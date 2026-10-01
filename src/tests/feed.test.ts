import { describe, expect, it } from 'vitest';
import herolist from './fixtures/herolist.json';
import svenFeed from './fixtures/herodata-sven.json';
import {
  buildDetails,
  buildTalents,
  comparePatches,
  diffDetails,
  findLatestPatch,
  resolveTalentText,
  slugify,
  toIndexEntry,
  type FeedHeroData,
  type FeedHeroListItem,
} from '@/lib/feed';
import { HEROES } from '@/data/heroes';
import { ALL_HEROES } from '@/data/allHeroes';
import { DATA_META, HERO_DETAILS } from '@/data/live';

const list = (herolist as { result: { data: { heroes: FeedHeroListItem[] } } }).result.data.heroes;
const sven = (svenFeed as unknown as { result: { data: { heroes: FeedHeroData[] } } }).result.data.heroes[0]!;
const svenItem = list.find((h) => h.id === 18)!;

describe('разбор фида dota2.com', () => {
  it('slugify', () => {
    expect(slugify("Nature's Prophet")).toBe('natures-prophet');
    expect(slugify('Anti-Mage')).toBe('anti-mage');
    expect(slugify('Phantom Assassin')).toBe('phantom-assassin');
  });

  it('запись индекса: атрибут, роли, тип атаки', () => {
    const e = toIndexEntry(svenItem, sven);
    expect(e).toMatchObject({ id: 18, key: 'sven', slug: 'sven', name: 'Sven', attribute: 'str', attack: 'melee' });
    expect(e.roles).toEqual({ carry: 2, nuker: 1, disabler: 2, durable: 2, initiator: 2 });
  });

  it('таланты Свена совпадают с игрой (левая/правая ветка)', () => {
    const t = buildTalents(sven);
    expect(t.map((x) => x.level)).toEqual([10, 15, 20, 25]);
    expect(t[0]).toMatchObject({ left: expect.stringContaining('+20%'), right: expect.stringContaining('+5 сек.') });
    expect(t[1]).toMatchObject({ left: expect.stringContaining('+25%'), right: expect.stringContaining('–12 сек.') });
    expect(t[2]).toMatchObject({ left: expect.stringContaining('+8'), right: expect.stringContaining('–25%') });
    expect(t[3]).toMatchObject({ left: expect.stringContaining('+1 сек.'), right: expect.stringContaining('+50%') });
    t.forEach((row) => {
      expect(row.left).not.toContain('{');
      expect(row.right).not.toContain('{');
    });
  });

  it('подстановка значений и перевод названий способностей', () => {
    const talent = sven.talents[0]!;
    expect(resolveTalentText(talent, sven.abilities)).toBe('+5 сек. действия Warcry');
    const [row] = buildTalents(sven, { Warcry: 'Боевой клич' });
    expect(row?.right).toBe('+5 сек. действия «Боевой клич»');
  });

  it('запасной поиск значения, если имя в шаблоне не совпало', () => {
    const talent = { ...sven.talents[0]!, name_loc: '+{s:bonus_unknown_name} сек.' };
    expect(resolveTalentText(talent, sven.abilities)).toBe('+5 сек.');
    const noBonus = { ...talent, name: 'special_bonus_nothing' };
    expect(resolveTalentText(noBonus, sven.abilities)).toBe('+? сек.');
  });

  it('цифры способностей', () => {
    const d = buildDetails('sven', sven);
    const hammer = d.abilities.find((a) => a.key === 'sven_storm_bolt');
    expect(hammer?.cooldowns).toEqual([21, 18, 15, 12]);
    expect(hammer?.manaCosts).toEqual([110]);
    expect(d.abilities.find((a) => a.key === 'sven_gods_strength')?.ultimate).toBe(true);
    expect(d.abilities.find((a) => a.key === 'sven_wrath_of_god')?.innate).toBe(true);
    expect(d.stats.health).toBeGreaterThan(0);
  });

  it('сравнение снимков находит изменения', () => {
    const prev = buildDetails('sven', sven);
    const next = structuredClone(prev);
    next.talents[1]!.left = 'новый талант';
    next.abilities[0]!.cooldowns = [20, 17, 14, 11];
    const changes = diffDetails(prev, next);
    expect(changes).toHaveLength(2);
    expect(changes[0]).toMatchObject({ kind: 'talent', label: 'Талант 15 ур. (слева)', after: 'новый талант' });
    expect(changes[1]).toMatchObject({ kind: 'cooldown', before: '21 / 18 / 15 / 12', after: '20 / 17 / 14 / 11' });
    expect(diffDetails(prev, prev)).toEqual([]);
  });

  it('номер патча', () => {
    expect(comparePatches('7.41', '7.41f')).toBeLessThan(0);
    expect(comparePatches('7.42', '7.41f')).toBeGreaterThan(0);
    expect(findLatestPatch({ patches: [{ patch_name: '7.40' }, { patch_name: '7.41c' }, 'мусор', { v: '7.41f' }] })).toBe(
      '7.41f',
    );
    expect(findLatestPatch({})).toBeNull();
  });
});

describe('сгенерированные данные (npm run update:data)', () => {
  it('в справочнике все герои игры, включая героев сайта', () => {
    expect(ALL_HEROES.length).toBeGreaterThanOrEqual(120);
    HEROES.forEach((h) => expect(ALL_HEROES.some((e) => e.slug === h.id), h.id).toBe(true));
    expect(new Set(ALL_HEROES.map((h) => h.slug)).size).toBe(ALL_HEROES.length);
  });

  it('у всех героев справочника есть роли (данные загружены полностью)', () => {
    const withoutRoles = ALL_HEROES.filter((h) => !h.roles || Object.keys(h.roles).length === 0).map((h) => h.slug);
    expect(withoutRoles, 'запусти npm run update:data').toEqual([]);
  });

  it('для каждого героя сайта есть официальные таланты и цифры', () => {
    HEROES.forEach((h) => {
      const d = HERO_DETAILS[h.id];
      expect(d, `${h.id}: запусти npm run update:data`).toBeDefined();
      expect(d?.talents).toHaveLength(4);
    });
  });

  it('номер патча в правильном формате', () => {
    expect(DATA_META.patch).toMatch(/^\d+\.\d{2}[a-z]?$/);
  });
});
