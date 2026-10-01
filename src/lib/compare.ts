import type { Hero, HeroRelation } from '@/types/hero';
import type { HeroDetails } from '@/lib/feed';

export interface StatRow {
  id: string;
  label: string;
  a: number | null;
  b: number | null;
  /** Подпись значения, например «648» или «24 +3.5». */
  aText: string;
  bText: string;
  winner: 'a' | 'b' | 'tie' | null;
  hint?: string;
}

const round = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

/** Строки сравнения характеристик на 1-м уровне (из официального фида). */
export function buildStatRows(a?: HeroDetails, b?: HeroDetails): StatRow[] {
  type Pick = (d: HeroDetails) => { value: number; text: string };
  const rows: { id: string; label: string; pick: Pick; hint?: string }[] = [
    { id: 'health', label: 'Здоровье', pick: (d) => ({ value: d.stats.health, text: String(d.stats.health) }) },
    { id: 'mana', label: 'Мана', pick: (d) => ({ value: d.stats.mana, text: String(d.stats.mana) }) },
    { id: 'armor', label: 'Броня', pick: (d) => ({ value: d.stats.armor, text: round(d.stats.armor) }) },
    {
      id: 'damage',
      label: 'Урон атаки',
      pick: (d) => ({ value: (d.stats.damage[0] + d.stats.damage[1]) / 2, text: `${d.stats.damage[0]}–${d.stats.damage[1]}` }),
    },
    {
      id: 'range',
      label: 'Дальность атаки',
      pick: (d) => ({ value: d.stats.attackRange, text: String(d.stats.attackRange) }),
      hint: '150 и меньше — ближний бой',
    },
    { id: 'speed', label: 'Скорость', pick: (d) => ({ value: d.stats.moveSpeed, text: String(d.stats.moveSpeed) }) },
    ...(['str', 'agi', 'int'] as const).map((attr) => ({
      id: attr,
      label: { str: 'Сила', agi: 'Ловкость', int: 'Интеллект' }[attr],
      hint: 'База и прирост за уровень',
      pick: (d: HeroDetails) => ({
        value: d.stats[attr][0] + d.stats[attr][1] * 24,
        text: `${d.stats[attr][0]} +${round(d.stats[attr][1])}`,
      }),
    })),
  ];

  return rows.map(({ id, label, pick, hint }) => {
    const av = a ? pick(a) : null;
    const bv = b ? pick(b) : null;
    let winner: StatRow['winner'] = null;
    if (av && bv) winner = av.value === bv.value ? 'tie' : av.value > bv.value ? 'a' : 'b';
    return {
      id,
      label,
      hint,
      a: av?.value ?? null,
      b: bv?.value ?? null,
      aText: av?.text ?? '—',
      bText: bv?.text ?? '—',
      winner,
    };
  });
}

export interface Matchup {
  /** b контрит a (b есть в списке контрпиков a). */
  bCountersA?: HeroRelation;
  aCountersB?: HeroRelation;
  synergy?: HeroRelation;
}

/** Отношения двух героев по данным гайдов. */
export function matchup(a: Hero, b: Hero): Matchup {
  if (a.id === b.id) return {};
  return {
    bCountersA: a.counters.find((r) => r.heroId === b.id),
    aCountersB: b.counters.find((r) => r.heroId === a.id),
    synergy: a.synergies.find((r) => r.heroId === b.id) ?? b.synergies.find((r) => r.heroId === a.id),
  };
}

/** Разбирает ?a=…&b=… с запасными значениями для неизвестных героев. */
export function parseCompare(params: URLSearchParams, ids: readonly string[], fallback: [string, string]) {
  const pick = (key: 'a' | 'b', def: string) => {
    const v = params.get(key);
    return v && ids.includes(v) ? v : def;
  };
  return { a: pick('a', fallback[0]), b: pick('b', fallback[1]) };
}
