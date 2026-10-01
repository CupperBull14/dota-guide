/**
 * Данные, сгенерированные скриптом `npm run update:data` из официального фида dota2.com.
 * Файлы лежат в src/data/generated и коммитятся вместе с проектом.
 */
import type { HeroDetails, PatchChangelog } from '@/lib/feed';
import detailsJson from './generated/hero-details.json';
import changelogJson from './generated/changelog.json';
import metaJson from './generated/meta.json';

export const HERO_DETAILS = detailsJson as unknown as Record<string, HeroDetails>;
export const CHANGELOG = changelogJson as unknown as PatchChangelog[];
export const DATA_META = metaJson as { patch: string; updatedAt: string };

/** Изменения героя в самом свежем патче, где он менялся. */
export function latestChangesFor(slug: string) {
  for (const patch of CHANGELOG) {
    const hero = patch.heroes.find((h) => h.slug === slug);
    if (hero) return { patch: patch.patch, changes: hero.changes };
  }
  return null;
}
