import type { Hero } from '@/types/hero';
import { HERO_STYLE, PICK_QUESTIONS, TAG_REASONS, type PickTag } from '@/data/pick';

export interface PickResult {
  hero: Hero;
  /** Совпадение в процентах (0–100). */
  match: number;
  /** Главные причины совпадения, по убыванию веса. */
  reasons: string[];
}

/** Все теги героя: тип атаки, роли, сложность, линии, стиль игры. */
export function heroTags(hero: Hero, attack?: 'melee' | 'ranged'): Set<PickTag> {
  const tags = new Set<PickTag>(hero.roles);
  if (attack) tags.add(attack);
  tags.add(`c${hero.complexity}` as PickTag);
  hero.lanes.forEach((l) => {
    if (l === 'safe' || l === 'mid' || l === 'off') tags.add(l);
  });
  if (hero.positions.includes(4)) tags.add('roam');
  (HERO_STYLE[hero.id] ?? []).forEach((t) => tags.add(t));
  if (hero.goodForBeginners) tags.add('beginner');
  return tags;
}

/** Суммарные веса тегов по выбранным ответам (индексы вариантов). */
export function collectEffects(answers: readonly number[]): Map<PickTag, number> {
  const total = new Map<PickTag, number>();
  answers.forEach((optionIndex, qi) => {
    const option = PICK_QUESTIONS[qi]?.options[optionIndex];
    if (!option) return;
    Object.entries(option.effects).forEach(([tag, w]) => {
      total.set(tag as PickTag, (total.get(tag as PickTag) ?? 0) + (w ?? 0));
    });
  });
  return total;
}

/**
 * Ранжирует героев по ответам.
 * Совпадение = набранные баллы / максимум, который мог бы набрать «идеальный» герой.
 */
export function rankHeroes(
  heroes: readonly Hero[],
  answers: readonly number[],
  attackOf: (hero: Hero) => 'melee' | 'ranged' | undefined,
): PickResult[] {
  const effects = collectEffects(answers);
  const ideal = [...effects.values()].filter((w) => w > 0).reduce((s, w) => s + w, 0) || 1;

  return heroes
    .map((hero) => {
      const tags = heroTags(hero, attackOf(hero));
      let score = 0;
      const matched: { tag: PickTag; w: number }[] = [];
      effects.forEach((w, tag) => {
        if (!tags.has(tag)) return;
        score += w;
        if (w > 0) matched.push({ tag, w });
      });
      const reasons = matched
        .sort((a, b) => b.w - a.w)
        .map((m) => TAG_REASONS[m.tag])
        .filter((r, i, arr) => arr.indexOf(r) === i)
        .slice(0, 4);
      const match = Math.max(0, Math.min(100, Math.round((score / ideal) * 100)));
      return { hero, match, reasons };
    })
    .sort((a, b) => b.match - a.match || a.hero.complexity - b.hero.complexity || a.hero.name.localeCompare(b.hero.name, 'ru'));
}

/** Ответы ↔ строка для ссылки: «0.2.1.0.2.1.3». */
export const encodeAnswers = (answers: readonly number[]) => answers.join('.');

export function decodeAnswers(raw: string | null): number[] | null {
  if (!raw) return null;
  const parts = raw.split('.').map(Number);
  if (parts.length !== PICK_QUESTIONS.length) return null;
  const valid = parts.every((n, i) => Number.isInteger(n) && n >= 0 && n < (PICK_QUESTIONS[i]?.options.length ?? 0));
  return valid ? parts : null;
}
