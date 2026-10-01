import { describe, expect, it } from 'vitest';
import { HEROES } from '@/data/heroes';
import {
  EMPTY_FILTERS,
  countActiveFilters,
  filterHeroes,
  parseFilters,
  serializeFilters,
  sortHeroes,
  toggleValue,
} from '@/lib/filters';

const parse = (qs: string) => parseFilters(new URLSearchParams(qs));

describe('parseFilters', () => {
  it('читает ссылки из категорий главной', () => {
    expect(parse('attr=str').attr).toEqual(['str']);
    expect(parse('role=support').role).toEqual(['support']);
    expect(parse('complexity=1').complexity).toEqual([1]);
  });
  it('игнорирует мусор и повторы, держит канонический порядок', () => {
    const f = parse('attr=int,xxx,str,str&complexity=9,2&sort=hack&lane=mid');
    expect(f.attr).toEqual(['str', 'int']);
    expect(f.complexity).toEqual([2]);
    expect(f.sort).toBe('name');
    expect(f.lane).toEqual(['mid']);
  });
  it('сериализация и разбор — взаимно обратны', () => {
    const f = { ...EMPTY_FILTERS, attr: ['agi' as const], role: ['carry' as const], beginner: true, sort: 'attribute' as const };
    expect(parseFilters(serializeFilters(f))).toEqual(f);
    expect(serializeFilters(EMPTY_FILTERS).toString()).toBe('');
  });
});

describe('filterHeroes', () => {
  it('без фильтров — все герои', () => {
    expect(filterHeroes(HEROES, EMPTY_FILTERS)).toHaveLength(HEROES.length);
  });
  it('внутри группы — ИЛИ, между группами — И', () => {
    const both = filterHeroes(HEROES, { ...EMPTY_FILTERS, attr: ['str', 'agi'] });
    expect(both.every((h) => h.attribute === 'str' || h.attribute === 'agi')).toBe(true);
    const strCarry = filterHeroes(HEROES, { ...EMPTY_FILTERS, attr: ['str'], role: ['carry'] });
    expect(strCarry.map((h) => h.id)).toEqual(['sven']);
  });
  it('новичкам и поиск', () => {
    expect(filterHeroes(HEROES, { ...EMPTY_FILTERS, beginner: true }).every((h) => h.goodForBeginners)).toBe(true);
    expect(filterHeroes(HEROES, { ...EMPTY_FILTERS, q: 'инвок' }).map((h) => h.id)).toEqual(['invoker']);
  });
  it('считает активные фильтры', () => {
    expect(countActiveFilters({ ...EMPTY_FILTERS, attr: ['str', 'int'], beginner: true })).toBe(3);
  });
});

describe('sortHeroes', () => {
  it('по сложности и по атрибуту', () => {
    const asc = sortHeroes(HEROES, 'complexity-asc');
    expect(asc[0]?.complexity).toBe(1);
    expect(asc[asc.length - 1]?.complexity).toBe(3);
    const byAttr = sortHeroes(HEROES, 'attribute');
    expect(byAttr[0]?.attribute).toBe('str');
    expect(byAttr[byAttr.length - 1]?.attribute).toBe('uni');
  });
  it('toggleValue', () => {
    expect(toggleValue(['a'], 'b')).toEqual(['a', 'b']);
    expect(toggleValue(['a', 'b'], 'a')).toEqual(['b']);
  });
});
