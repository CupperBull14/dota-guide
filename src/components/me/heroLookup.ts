import { getIndexHeroById, heroPortraitUrl } from '@/data/allHeroes';
import { hasGuide, heroName } from '@/components/counter/useHeroOptions';
import type { Attribute } from '@/types/hero';

export interface MatchHero {
  id: number;
  slug: string | null;
  name: string;
  nameEn: string;
  attribute: Attribute;
  imageUrl?: string;
  /** Есть ли на сайте полный гайд по герою. */
  guide: boolean;
}

/** Герой по числовому id OpenDota/Valve. Неизвестный id (новый герой до обновления данных) — заглушка. */
export function matchHero(id: number): MatchHero {
  const entry = getIndexHeroById(id);
  if (!entry) return { id, slug: null, name: `Герой #${id}`, nameEn: '?', attribute: 'uni', guide: false };
  return {
    id,
    slug: entry.slug,
    name: heroName(entry.slug, entry.name),
    nameEn: entry.name,
    attribute: entry.attribute,
    imageUrl: heroPortraitUrl(entry),
    guide: hasGuide(entry.slug),
  };
}

export const matchHeroName = (id: number) => matchHero(id).name;

/** Названия режимов из game_mode OpenDota (самые частые в паблике). */
const GAME_MODES: Record<number, string> = {
  1: 'All Pick',
  2: 'Captains Mode',
  3: 'Random Draft',
  4: 'Single Draft',
  5: 'All Random',
  16: 'Captains Draft',
  18: 'Ability Draft',
  22: 'All Pick',
  23: 'Турбо',
};

export function modeLabel(gameMode: number, lobbyType: number): string {
  const mode = GAME_MODES[gameMode] ?? `Режим ${gameMode}`;
  return lobbyType === 7 ? `${mode} · рейтинг` : mode;
}

export const formatDuration = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

const DATE = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
export const formatStart = (unix: number) => DATE.format(new Date(unix * 1000));
