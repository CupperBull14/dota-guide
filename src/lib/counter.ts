import type { Hero } from '@/types/hero';
import type { HeroIndexEntry } from '@/lib/feed';
import type { ItemId } from '@/data/items';
import { HERO_TRAITS, ITEM_ROLE, TRAITS, TRAIT_ORDER, type Trait } from '@/data/counter';
import { normalize } from '@/lib/search';

export const MAX_ENEMIES = 5;

export interface MyProfile {
  support: boolean;
  fragile: boolean;
  melee: boolean;
  caster: boolean;
  physicalCarry: boolean;
}

/** Грубый профиль «моего» героя по данным игры: от него зависит, что для меня опаснее. */
export function profileOf(hero: HeroIndexEntry): MyProfile {
  const r = hero.roles ?? {};
  const support = (r.support ?? 0) > (r.carry ?? 0);
  return {
    support,
    fragile: support || hero.attack === 'ranged',
    melee: hero.attack === 'melee',
    caster: (r.nuker ?? 0) >= 2 || hero.attribute === 'int',
    physicalCarry: (r.carry ?? 0) >= 2,
  };
}

/** Насколько черта врага опасна для меня (без героя — всё по 1). */
export function traitWeight(trait: Trait, me?: MyProfile): number {
  if (!me) return 1;
  switch (trait) {
    case 'invis':
    case 'mobile':
    case 'magic':
      return me.fragile ? 2 : 1;
    case 'disable':
      return me.melee ? 2 : 1;
    case 'silence':
      return me.caster ? 2 : 1;
    case 'evasion':
      return me.physicalCarry ? 2 : 0;
    case 'tank':
      return me.physicalCarry ? 1 : 0.5;
    case 'global':
      return me.fragile ? 1 : 0.5;
    case 'heal':
    case 'summons':
      return 0.5;
    default:
      return 1;
  }
}

export interface EnemyThreat {
  enemy: HeroIndexEntry;
  score: number;
  /** Почему опасен: сначала из гайда, затем по чертам. */
  reasons: string[];
  /** Если мой герой контрит этого врага (по гайду врага). */
  youCounter?: string;
}

export interface TraitGroup {
  trait: Trait;
  heroes: HeroIndexEntry[];
  weight: number;
}

export interface ItemAdvice {
  itemId: ItemId;
  score: number;
  against: HeroIndexEntry[];
  traits: Trait[];
  inGuide: boolean;
}

export interface CounterAnalysis {
  threats: EnemyThreat[];
  traits: TraitGroup[];
  items: ItemAdvice[];
}

const sameHero = (rel: { name: string; heroId?: string }, hero: HeroIndexEntry) =>
  rel.heroId === hero.slug || normalize(rel.name) === normalize(hero.name);

/**
 * Разбор вражеской команды.
 * guideOf — функция, отдающая полный гайд героя (если он есть на сайте).
 */
export function analyzeCounter(
  me: HeroIndexEntry | undefined,
  enemies: HeroIndexEntry[],
  guideOf: (slug: string) => Hero | undefined,
): CounterAnalysis {
  const profile = me ? profileOf(me) : undefined;
  const myGuide = me ? guideOf(me.slug) : undefined;

  // Угрозы по каждому врагу
  const threats: EnemyThreat[] = enemies.map((enemy) => {
    const traits = HERO_TRAITS[enemy.slug] ?? [];
    let score = traits.reduce((s, t) => s + traitWeight(t, profile), 0);
    const reasons: string[] = [];
    const fromMyGuide = myGuide?.counters.find((rel) => sameHero(rel, enemy));
    if (fromMyGuide) {
      score += 4;
      reasons.push(fromMyGuide.why);
    }
    const enemyGuide = guideOf(enemy.slug);
    const youCounter = me ? enemyGuide?.counters.find((rel) => sameHero(rel, me))?.why : undefined;
    if (youCounter) score -= 2;
    traits
      .filter((t) => traitWeight(t, profile) >= 1)
      .sort((a, b) => traitWeight(b, profile) - traitWeight(a, profile))
      .slice(0, 2)
      .forEach((t) => reasons.push(`${TRAITS[t].label}: ${TRAITS[t].danger.toLowerCase()}`));
    return { enemy, score, reasons: reasons.slice(0, 3), youCounter };
  });
  threats.sort((a, b) => b.score - a.score);

  // Черты команды врага
  const traitMap = new Map<Trait, HeroIndexEntry[]>();
  enemies.forEach((e) =>
    (HERO_TRAITS[e.slug] ?? []).forEach((t) => traitMap.set(t, [...(traitMap.get(t) ?? []), e])),
  );
  const traits: TraitGroup[] = [...traitMap.entries()]
    .map(([trait, heroes]) => ({ trait, heroes, weight: heroes.length * traitWeight(trait, profile) }))
    .filter((g) => g.weight > 0)
    .sort((a, b) => b.weight - a.weight || TRAIT_ORDER.indexOf(a.trait) - TRAIT_ORDER.indexOf(b.trait));

  // Предметы
  const guideItems = new Set<ItemId>(
    myGuide ? [...myGuide.items.start, ...myGuide.items.early, ...myGuide.items.core, ...myGuide.items.situational].map((r) => r.itemId) : [],
  );
  const itemMap = new Map<ItemId, ItemAdvice>();
  traits.forEach((g) => {
    TRAITS[g.trait].items.forEach((itemId, i) => {
      const role = ITEM_ROLE[itemId] ?? 'any';
      if (profile?.support && role === 'core') return;
      if (profile && !profile.support && role === 'support') return;
      const entry = itemMap.get(itemId) ?? { itemId, score: 0, against: [], traits: [], inGuide: guideItems.has(itemId) };
      entry.score += g.weight * (i === 0 ? 1.5 : 1);
      entry.traits.push(g.trait);
      g.heroes.forEach((h) => {
        if (!entry.against.includes(h)) entry.against.push(h);
      });
      itemMap.set(itemId, entry);
    });
  });
  const items = [...itemMap.values()]
    .map((it) => ({ ...it, score: it.score + (it.inGuide ? 1 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return { threats, traits, items };
}

/** Разбор адреса: ?me=sven&vs=riki,zeus — неизвестные и повторы отбрасываются. */
export function parseCounter(params: URLSearchParams, known: (slug: string) => boolean) {
  const me = params.get('me');
  const vs = (params.get('vs') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter((s, i, arr) => s && known(s) && arr.indexOf(s) === i && s !== me)
    .slice(0, MAX_ENEMIES);
  return { me: me && known(me) ? me : null, vs };
}
