import { useMemo } from 'react';
import { HEROES } from '@/data/heroes';
import { ALL_HEROES, displayName, heroPortraitUrl } from '@/data/allHeroes';
import type { PickerHero } from '@/components/heroes/HeroPicker';

const RU = new Map(HEROES.map((h) => [h.id, h.name]));

/** Все герои игры в формате для HeroPicker: герои с гайдом — с русским именем. */
export function useHeroOptions(): PickerHero[] {
  return useMemo(
    () =>
      ALL_HEROES.map((e) => ({
        id: e.slug,
        name: displayName(e, RU),
        nameEn: e.name,
        attribute: e.attribute,
        imageUrl: heroPortraitUrl(e),
      })).sort((a, b) => a.name.localeCompare(b.name, 'ru')),
    [],
  );
}

export const heroName = (slug: string, fallback: string) => RU.get(slug) ?? fallback;
export const hasGuide = (slug: string) => RU.has(slug);
