import type { Hero, HeroRelation } from '@/types/hero';
import { ABILITY_ICONS, INVOKED_ICONS } from './icons';
import { HERO_DETAILS, latestChangesFor } from './live';
import { sven } from './hero-list/sven';
import { sniper } from './hero-list/sniper';
import { zeus } from './hero-list/zeus';
import { axe } from './hero-list/axe';
import { lich } from './hero-list/lich';
import { pudge } from './hero-list/pudge';
import { earthshaker } from './hero-list/earthshaker';
import { juggernaut } from './hero-list/juggernaut';
import { phantomAssassin } from './hero-list/phantom-assassin';
import { crystalMaiden } from './hero-list/crystal-maiden';
import { stormSpirit } from './hero-list/storm-spirit';
import { magnus } from './hero-list/magnus';
import { enigma } from './hero-list/enigma';
import { windranger } from './hero-list/windranger';
import { invoker } from './hero-list/invoker';

/**
 * База героев. Каждый герой — отдельный файл в ./hero-list.
 * Чтобы добавить героя: создай файл по образцу и добавь его в список ниже.
 * Способности, Аганимы и таланты сверены с патчем PATCH из constants.ts.
 * В талантах left — левая ветка в игре, right — правая.
 */
const RAW: Hero[] = [
  sven,
  sniper,
  zeus,
  axe,
  lich,
  pudge,
  earthshaker,
  juggernaut,
  phantomAssassin,
  crystalMaiden,
  stormSpirit,
  magnus,
  enigma,
  windranger,
  invoker,
];

/**
 * Портреты и рендеры героев с официального CDN Dota 2 (Valve).
 * Ключ — внутреннее имя героя в игре (у некоторых оно отличается: Zeus → zuus, Magnus → magnataur).
 * Если картинка не загрузится (нет интернета, CDN недоступен), сайт покажет стилизованную заглушку.
 */
const CDN = 'https://cdn.cloudflare.steamstatic.com/apps/dota2';
const VALVE_KEYS: Record<string, string> = {
  sven: 'sven',
  sniper: 'sniper',
  zeus: 'zuus',
  axe: 'axe',
  lich: 'lich',
  pudge: 'pudge',
  earthshaker: 'earthshaker',
  juggernaut: 'juggernaut',
  'phantom-assassin': 'phantom_assassin',
  'crystal-maiden': 'crystal_maiden',
  'storm-spirit': 'storm_spirit',
  magnus: 'magnataur',
  enigma: 'enigma',
  windranger: 'windrunner',
  invoker: 'invoker',
};

const withImages = (hero: Hero): Hero => {
  const valveKey = VALVE_KEYS[hero.id];
  const abilityIcons = ABILITY_ICONS[hero.id] ?? {};
  return {
    ...hero,
    imageUrl: hero.imageUrl ?? (valveKey ? `${CDN}/images/dota_react/heroes/${valveKey}.png` : undefined),
    renderUrl: hero.renderUrl ?? (valveKey ? `${CDN}/videos/dota_react/heroes/renders/${valveKey}.png` : undefined),
    abilities: hero.abilities.map((a) => ({ ...a, icon: a.icon ?? abilityIcons[a.key] })),
    invokedSpells: hero.invokedSpells?.map((s) => ({ ...s, icon: s.icon ?? INVOKED_ICONS[s.nameEn] })),
  };
};

/**
 * Подмешивает официальные данные из фида: тексты талантов, цифры способностей
 * и отметки «изменено в патче». Рекомендации (pick/why) остаются нашими.
 */
const withLiveData = (hero: Hero): Hero => {
  const details = HERO_DETAILS[hero.id];
  if (!details) return hero;
  const latest = latestChangesFor(hero.id);
  const changedLevels = new Set(
    latest?.changes.filter((c) => c.kind === 'talent').map((c) => Number(/\d+/.exec(c.label)?.[0])) ?? [],
  );
  const changedAbilities = new Set(
    latest?.changes.filter((c) => c.kind !== 'talent').map((c) => c.label.split(': ').slice(1).join(': ')) ?? [],
  );
  return {
    ...hero,
    talents: hero.talents.map((t) => {
      const live = details.talents.find((d) => d.level === t.level);
      return {
        ...t,
        left: live?.left && !live.left.includes('?') ? live.left : t.left,
        right: live?.right && !live.right.includes('?') ? live.right : t.right,
        changedIn: changedLevels.has(t.level) ? latest?.patch : undefined,
      };
    }),
    abilities: hero.abilities.map((a) => {
      const live = a.icon ? details.abilities.find((d) => d.key === a.icon) : undefined;
      if (!live) return a;
      return {
        ...a,
        numbers: { cooldowns: live.cooldowns, manaCosts: live.manaCosts, castRange: live.castRange },
        changedIn: changedAbilities.has(live.name) ? latest?.patch : undefined,
      };
    }),
  };
};

const key = (name: string) => name.toLowerCase().replace(/ё/g, 'е').trim();

const BY_NAME = new Map<string, string>();
for (const hero of RAW) {
  BY_NAME.set(key(hero.name), hero.id);
  BY_NAME.set(key(hero.nameEn), hero.id);
}

/**
 * Автоматически связывает контрпики и синергии с героями из базы:
 * если имя совпадает с именем героя, у связи появляется heroId — и она станет ссылкой.
 */
const link = (relation: HeroRelation): HeroRelation => {
  if (relation.heroId) return relation;
  const heroId = BY_NAME.get(key(relation.name));
  return heroId ? { ...relation, heroId } : relation;
};

export const HEROES: Hero[] = RAW.map(withImages).map(withLiveData).map((hero) => ({
  ...hero,
  counters: hero.counters.map(link),
  synergies: hero.synergies.map(link),
}));

const BY_ID = new Map(HEROES.map((hero) => [hero.id, hero]));

export function getHeroById(id: string): Hero | undefined {
  return BY_ID.get(id);
}
