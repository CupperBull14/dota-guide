import type { Attribute, Complexity, Hero, Lane, Role } from '@/types/hero';
import { ATTRIBUTE_ORDER, COMPLEXITY_ORDER, LANE_ORDER, ROLE_ORDER } from '@/data/constants';
import { normalize, scoreHero } from '@/lib/search';

export type SortKey = 'name' | 'complexity-asc' | 'complexity-desc' | 'attribute';

export const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: 'name', label: 'По имени (А–Я)' },
  { id: 'complexity-asc', label: 'Сначала простые' },
  { id: 'complexity-desc', label: 'Сначала сложные' },
  { id: 'attribute', label: 'По атрибуту' },
];

export const DEFAULT_SORT: SortKey = 'name';

export interface HeroFilters {
  q: string;
  attr: Attribute[];
  role: Role[];
  complexity: Complexity[];
  lane: Lane[];
  beginner: boolean;
  sort: SortKey;
}

export const EMPTY_FILTERS: HeroFilters = {
  q: '',
  attr: [],
  role: [],
  complexity: [],
  lane: [],
  beginner: false,
  sort: DEFAULT_SORT,
};

/** Читает список значений из параметра «a,b,c», отбрасывая неизвестные и повторы. */
function readList<T extends string | number>(
  raw: string | null,
  allowed: readonly T[],
  cast: (v: string) => T = (v) => v as T,
): T[] {
  if (!raw) return [];
  const result: T[] = [];
  for (const part of raw.split(',')) {
    const value = cast(part.trim());
    if (allowed.includes(value) && !result.includes(value)) result.push(value);
  }
  // Сохраняем канонический порядок, чтобы URL не зависел от порядка кликов.
  return allowed.filter((v) => result.includes(v));
}

/** Разбирает фильтры из query-строки. Некорректные значения молча игнорируются. */
export function parseFilters(params: URLSearchParams): HeroFilters {
  const sortRaw = params.get('sort');
  const sort = SORT_OPTIONS.some((o) => o.id === sortRaw) ? (sortRaw as SortKey) : DEFAULT_SORT;
  return {
    q: (params.get('q') ?? '').slice(0, 60),
    attr: readList(params.get('attr'), ATTRIBUTE_ORDER),
    role: readList(params.get('role'), ROLE_ORDER),
    complexity: readList(params.get('complexity'), COMPLEXITY_ORDER, (v) => Number(v) as Complexity),
    lane: readList(params.get('lane'), LANE_ORDER),
    beginner: params.get('beginner') === '1',
    sort,
  };
}

/** Превращает фильтры обратно в query-параметры (пустые значения не пишутся). */
export function serializeFilters(filters: HeroFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set('q', filters.q.trim());
  if (filters.attr.length) params.set('attr', filters.attr.join(','));
  if (filters.role.length) params.set('role', filters.role.join(','));
  if (filters.complexity.length) params.set('complexity', filters.complexity.join(','));
  if (filters.lane.length) params.set('lane', filters.lane.join(','));
  if (filters.beginner) params.set('beginner', '1');
  if (filters.sort !== DEFAULT_SORT) params.set('sort', filters.sort);
  return params;
}

/** Число активных фильтров (без поиска и сортировки) — для бейджа на кнопке. */
export function countActiveFilters(f: HeroFilters): number {
  return f.attr.length + f.role.length + f.complexity.length + f.lane.length + (f.beginner ? 1 : 0);
}

export function hasAnyFilter(f: HeroFilters): boolean {
  return countActiveFilters(f) > 0 || normalize(f.q).length > 0;
}

/**
 * Фильтрация: внутри одной группы значения объединяются через «ИЛИ»
 * (Сила или Ловкость), между группами — через «И».
 */
export function filterHeroes(heroes: readonly Hero[], f: HeroFilters): Hero[] {
  const query = normalize(f.q);
  return heroes.filter(
    (h) =>
      (f.attr.length === 0 || f.attr.includes(h.attribute)) &&
      (f.role.length === 0 || h.roles.some((r) => f.role.includes(r))) &&
      (f.complexity.length === 0 || f.complexity.includes(h.complexity)) &&
      (f.lane.length === 0 || h.lanes.some((l) => f.lane.includes(l))) &&
      (!f.beginner || h.goodForBeginners) &&
      (!query || scoreHero(h, query) > 0),
  );
}

const byName = (a: Hero, b: Hero) => a.name.localeCompare(b.name, 'ru');

export function sortHeroes(heroes: readonly Hero[], sort: SortKey): Hero[] {
  const list = [...heroes];
  switch (sort) {
    case 'complexity-asc':
      return list.sort((a, b) => a.complexity - b.complexity || byName(a, b));
    case 'complexity-desc':
      return list.sort((a, b) => b.complexity - a.complexity || byName(a, b));
    case 'attribute':
      return list.sort(
        (a, b) =>
          ATTRIBUTE_ORDER.indexOf(a.attribute) - ATTRIBUTE_ORDER.indexOf(b.attribute) || byName(a, b),
      );
    case 'name':
    default:
      return list.sort(byName);
  }
}

/** Переключает значение в списке (добавить, если нет; убрать, если есть). */
export function toggleValue<T>(list: readonly T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}
