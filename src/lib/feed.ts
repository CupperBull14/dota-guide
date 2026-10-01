/**
 * Разбор официального фида dota2.com/datafeed и подготовка данных сайта.
 * Только чистые функции — без сети и файлов, поэтому всё покрыто тестами.
 * Сетью и записью файлов занимается scripts/update-data.ts.
 */
import type { Attribute, Complexity, Role, TalentLevel } from '@/types/hero';

// ─────────────────────────── Типы фида ───────────────────────────

export interface FeedHeroListItem {
  id: number;
  name: string; // npc_dota_hero_sven
  name_loc: string;
  name_english_loc: string;
  primary_attr: number; // 0 сила, 1 ловкость, 2 интеллект, 3 универсальный
  complexity: number; // 1–3
}

export interface FeedSpecialValue {
  name: string;
  values_float: number[];
  is_percentage?: boolean;
  heading_loc?: string;
  bonuses: { name: string; value: number; operation: number }[];
}

export interface FeedAbility {
  id: number;
  name: string;
  name_loc: string;
  desc_loc?: string;
  type: number; // 1 — ультимативная
  max_level?: number;
  cooldowns: number[];
  mana_costs: number[];
  cast_ranges: number[];
  special_values: FeedSpecialValue[];
  ability_is_innate?: boolean;
  ability_is_granted_by_scepter?: boolean;
  ability_is_granted_by_shard?: boolean;
}

export interface FeedHeroData {
  id: number;
  name: string;
  name_loc: string;
  primary_attr: number;
  complexity: number;
  attack_capability: number; // 1 ближний бой, 2 дальний
  role_levels: number[];
  str_base: number;
  agi_base: number;
  int_base: number;
  str_gain: number;
  agi_gain: number;
  int_gain: number;
  damage_min: number;
  damage_max: number;
  attack_range: number;
  armor: number;
  movement_speed: number;
  max_health: number;
  max_mana: number;
  abilities: FeedAbility[];
  talents: FeedAbility[];
}

// ─────────────────────── Данные, которые пишем ───────────────────────

/** Короткая запись о любом герое игры (для подбора, контрпиков, разбора матчей). */
export interface HeroIndexEntry {
  /** Числовой id героя в игре (используется в OpenDota). */
  id: number;
  /** Внутреннее имя без префикса: sven, zuus, magnataur… */
  key: string;
  /** Адрес на сайте: sven, anti-mage, natures-prophet… */
  slug: string;
  name: string;
  attribute: Attribute;
  complexity: Complexity;
  attack?: 'melee' | 'ranged';
  /** Роли с уровнем выраженности 1–3 (из клиента игры). */
  roles?: Partial<Record<Role, number>>;
}

export interface AbilityNumbers {
  /** Внутреннее имя способности — совпадает с Ability.icon на сайте. */
  key: string;
  name: string;
  ultimate: boolean;
  innate: boolean;
  cooldowns: number[];
  manaCosts: number[];
  castRange: number[];
}

export interface GeneratedTalent {
  level: TalentLevel;
  left: string;
  right: string;
}

export interface HeroDetails {
  slug: string;
  stats: {
    health: number;
    mana: number;
    armor: number;
    moveSpeed: number;
    attackRange: number;
    damage: [number, number];
    str: [number, number];
    agi: [number, number];
    int: [number, number];
  };
  abilities: AbilityNumbers[];
  talents: GeneratedTalent[];
}

export interface ChangeEntry {
  kind: 'talent' | 'cooldown' | 'mana';
  /** Человекочитаемое место изменения: «Талант 15 ур. (слева)», «Перезарядка: Грозовой молот». */
  label: string;
  before: string;
  after: string;
}

export interface HeroChangelog {
  slug: string;
  changes: ChangeEntry[];
}

export interface PatchChangelog {
  patch: string;
  date: string;
  heroes: HeroChangelog[];
}

// ─────────────────────────── Справочники ───────────────────────────

const ATTRS: Attribute[] = ['str', 'agi', 'int', 'uni'];

/** Порядок ролей в role_levels клиента игры. */
export const FEED_ROLE_ORDER: Role[] = [
  'carry',
  'support',
  'nuker',
  'disabler',
  'jungler',
  'durable',
  'escape',
  'pusher',
  'initiator',
];

export const HERO_PREFIX = 'npc_dota_hero_';

/** Адрес героя на сайте из английского имени: «Nature's Prophet» → «natures-prophet». */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const clampComplexity = (n: number): Complexity => (n <= 1 ? 1 : n >= 3 ? 3 : 2);

export function attributeFromFeed(n: number): Attribute {
  return ATTRS[n] ?? 'uni';
}

/** Запись индекса из списка героев (+ роли и тип атаки, если есть полные данные). */
export function toIndexEntry(item: FeedHeroListItem, data?: FeedHeroData): HeroIndexEntry {
  const key = item.name.replace(HERO_PREFIX, '');
  const entry: HeroIndexEntry = {
    id: item.id,
    key,
    slug: slugify(item.name_english_loc || item.name_loc),
    name: item.name_english_loc || item.name_loc,
    attribute: attributeFromFeed(item.primary_attr),
    complexity: clampComplexity(item.complexity),
  };
  if (data) {
    entry.attack = data.attack_capability === 2 ? 'ranged' : 'melee';
    const roles: Partial<Record<Role, number>> = {};
    data.role_levels.forEach((level, i) => {
      const role = FEED_ROLE_ORDER[i];
      if (role && level > 0) roles[role] = level;
    });
    entry.roles = roles;
  }
  return entry;
}

// ─────────────────────────── Таланты ───────────────────────────

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : String(Number(n.toFixed(2))));

/**
 * Подставляет значения в шаблон таланта.
 * {s:bonus_X} — бонус, который талант даёт значению X какой-то способности;
 * {s:value} и прочие — собственные значения таланта.
 */
export function resolveTalentText(talent: FeedAbility, abilities: FeedAbility[]): string {
  return talent.name_loc
    .replace(/\{s:([^}]+)\}/g, (_, key: string) => {
      if (key.startsWith('bonus_')) {
        const base = key.slice('bonus_'.length);
        for (const ability of abilities) {
          for (const sv of ability.special_values) {
            if (sv.name !== base) continue;
            const bonus = sv.bonuses.find((b) => b.name === talent.name);
            if (bonus) return fmt(Math.abs(bonus.value));
          }
        }
      }
      const own = talent.special_values.find((sv) => sv.name === key || `bonus_${sv.name}` === key);
      const value = own?.values_float[0];
      if (value !== undefined) return fmt(Math.abs(value));
      // Запасной путь: имя значения в шаблоне не совпало с данными (так бывает у Инвокера).
      // Если у таланта ровно один бонус во всех способностях — это и есть нужное число.
      const all = abilities.flatMap((a) =>
        a.special_values.flatMap((sv) => sv.bonuses.filter((b) => b.name === talent.name)),
      );
      const unique = new Set(all.map((b) => b.value));
      const only = all[0];
      return unique.size === 1 && only ? fmt(Math.abs(only.value)) : '?';
    })
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Таланты в фиде идут парами по уровням 10, 15, 20, 25:
 * чётный индекс — правая ветка в игре, нечётный — левая (сверено с клиентом).
 */
export function buildTalents(
  data: FeedHeroData,
  /** Замена английских названий способностей на русские (в кавычках) из базы сайта. */
  rename: Record<string, string> = {},
): GeneratedTalent[] {
  const levels: TalentLevel[] = [10, 15, 20, 25];
  const translate = (text: string) =>
    Object.entries(rename)
      .sort((a, b) => b[0].length - a[0].length)
      .reduce((acc, [en, ru]) => acc.split(en).join(`«${ru}»`), text);
  return levels.map((level, i) => {
    const right = data.talents[i * 2];
    const left = data.talents[i * 2 + 1];
    return {
      level,
      left: left ? translate(resolveTalentText(left, data.abilities)) : '',
      right: right ? translate(resolveTalentText(right, data.abilities)) : '',
    };
  });
}

// ─────────────────────────── Детали героя ───────────────────────────

export function buildDetails(
  slug: string,
  data: FeedHeroData,
  rename: Record<string, string> = {},
): HeroDetails {
  return {
    slug,
    stats: {
      health: data.max_health,
      mana: data.max_mana,
      armor: Number(data.armor.toFixed(1)),
      moveSpeed: data.movement_speed,
      attackRange: data.attack_range,
      damage: [data.damage_min, data.damage_max],
      str: [data.str_base, data.str_gain],
      agi: [data.agi_base, data.agi_gain],
      int: [data.int_base, data.int_gain],
    },
    abilities: data.abilities
      .filter((a) => a.name && !a.name.startsWith('special_bonus') && !a.name.endsWith('_empty1'))
      .map((a) => ({
        key: a.name,
        name: rename[a.name_loc] ?? a.name_loc,
        ultimate: a.type === 1,
        innate: Boolean(a.ability_is_innate),
        cooldowns: a.cooldowns.filter((n) => n > 0),
        manaCosts: a.mana_costs.filter((n) => n > 0),
        castRange: a.cast_ranges.filter((n) => n > 0),
      })),
    talents: buildTalents(data, rename),
  };
}

// ─────────────────────────── Сравнение версий ───────────────────────────

const list = (xs: number[]) => (xs.length ? xs.map(fmt).join(' / ') : '—');

/** Что поменялось у героя между двумя снимками данных. */
export function diffDetails(prev: HeroDetails, next: HeroDetails): ChangeEntry[] {
  const changes: ChangeEntry[] = [];

  next.talents.forEach((t) => {
    const old = prev.talents.find((p) => p.level === t.level);
    if (!old) return;
    if (old.left !== t.left)
      changes.push({ kind: 'talent', label: `Талант ${t.level} ур. (слева)`, before: old.left, after: t.left });
    if (old.right !== t.right)
      changes.push({ kind: 'talent', label: `Талант ${t.level} ур. (справа)`, before: old.right, after: t.right });
  });

  next.abilities.forEach((a) => {
    const old = prev.abilities.find((p) => p.key === a.key);
    if (!old) return;
    if (list(old.cooldowns) !== list(a.cooldowns))
      changes.push({ kind: 'cooldown', label: `Перезарядка: ${a.name}`, before: list(old.cooldowns), after: list(a.cooldowns) });
    if (list(old.manaCosts) !== list(a.manaCosts))
      changes.push({ kind: 'mana', label: `Расход маны: ${a.name}`, before: list(old.manaCosts), after: list(a.manaCosts) });
  });

  return changes;
}

/** Ищет номер патча вида 7.41f в произвольном JSON (формат списка патчей не документирован). */
export function findLatestPatch(json: unknown): string | null {
  const found: string[] = [];
  const walk = (v: unknown) => {
    if (typeof v === 'string' && /^\d+\.\d{2}[a-z]?$/.test(v.trim())) found.push(v.trim());
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  walk(json);
  if (!found.length) return null;
  const sorted = found.sort(comparePatches);
  return sorted[sorted.length - 1] ?? null;
}

/** Сравнение номеров патчей: 7.41 < 7.41a < 7.41f < 7.42. */
export function comparePatches(a: string, b: string): number {
  const parse = (p: string) => {
    const m = /^(\d+)\.(\d+)([a-z]?)$/.exec(p);
    return m ? [Number(m[1]), Number(m[2]), m[3] ? m[3].charCodeAt(0) - 96 : 0] : [0, 0, 0];
  };
  const [a1, a2, a3] = parse(a);
  const [b1, b2, b3] = parse(b);
  return (a1 ?? 0) - (b1 ?? 0) || (a2 ?? 0) - (b2 ?? 0) || (a3 ?? 0) - (b3 ?? 0);
}
