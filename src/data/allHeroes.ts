/**
 * Справочник ВСЕХ героев игры (≈127) — из src/data/generated/heroes-index.json.
 * Нужен для подбора героя, помощника «против кого» и разбора матчей.
 * Полные гайды есть только у героев из data/heroes.ts — у остальных есть имя, атрибут, роли и портрет.
 */
import type { HeroIndexEntry } from '@/lib/feed';
import indexJson from './generated/heroes-index.json';

export const ALL_HEROES = indexJson as unknown as HeroIndexEntry[];

const CDN = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes';

export const heroPortraitUrl = (entry: Pick<HeroIndexEntry, 'key'>) => `${CDN}/${entry.key}.png`;

const BY_ID = new Map(ALL_HEROES.map((h) => [h.id, h]));
const BY_SLUG = new Map(ALL_HEROES.map((h) => [h.slug, h]));

export const getIndexHeroById = (id: number) => BY_ID.get(id);
export const getIndexHeroBySlug = (slug: string) => BY_SLUG.get(slug);

/** Имя для показа: русское — у героев с гайдом на сайте, иначе английское из игры. */
export function displayName(entry: HeroIndexEntry, ruNames: ReadonlyMap<string, string>): string {
  return ruNames.get(entry.slug) ?? entry.name;
}
