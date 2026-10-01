import type { Hero } from '@/types/hero';

/** Нормализация строки для поиска: регистр, «ё», лишние пробелы и знаки. */
export function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^a-zа-я0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Оценка совпадения героя с запросом.
 * 0 — не совпадает; чем больше, тем выше в выдаче.
 */
export function scoreHero(hero: Hero, query: string): number {
  const q = normalize(query);
  if (!q) return 0;
  const names = [normalize(hero.name), normalize(hero.nameEn)];
  let best = 0;
  for (const name of names) {
    if (name === q) best = Math.max(best, 100);
    else if (name.startsWith(q)) best = Math.max(best, 80);
    else if (name.split(' ').some((word) => word.startsWith(q))) best = Math.max(best, 60);
    else if (name.includes(q)) best = Math.max(best, 40);
  }
  if (best === 0 && q.length >= 3) {
    const abilityHit = hero.abilities.some(
      (a) => normalize(a.name).includes(q) || normalize(a.nameEn).includes(q),
    );
    if (abilityHit) best = 20;
  }
  return best;
}

/** Поиск героев по русскому/английскому имени и названиям способностей. */
export function searchHeroes(heroes: readonly Hero[], query: string, limit = Infinity): Hero[] {
  if (!normalize(query)) return [];
  return heroes
    .map((hero) => ({ hero, score: scoreHero(hero, query) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.hero.name.localeCompare(b.hero.name, 'ru'))
    .slice(0, limit)
    .map((r) => r.hero);
}
