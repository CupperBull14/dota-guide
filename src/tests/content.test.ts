import { describe, expect, it } from 'vitest';
import { BASICS, GLOSSARY, GLOSSARY_CATEGORIES, ROADMAP } from '@/data/beginners';
import { ITEM_LIST } from '@/data/items';
import { ITEM_ICONS, ABILITY_ICONS, INVOKED_ICONS } from '@/data/icons';
import { HEROES } from '@/data/heroes';
import { NAV_LINKS, TOOL_LINKS } from '@/data/constants';

/** Все внутренние ссылки сайта должны вести на существующие роуты. */
const ROUTES = [
  /^\/$/,
  /^\/heroes(\?.*)?$/,
  /^\/heroes\/[a-z0-9-]+$/,
  /^\/map$/,
  /^\/beginners$/,
  /^\/favorites$/,
  /^\/patch$/,
  /^\/compare(\?.*)?$/,
  /^\/pick(\?.*)?$/,
  /^\/counter(\?.*)?$/,
  /^\/me(\?.*)?$/,
];
const isValidRoute = (to: string) => ROUTES.some((r) => r.test(to));

describe('раздел «Новичкам»', () => {
  it('ровно 10 шагов роадмапа с уникальными id', () => {
    expect(ROADMAP).toHaveLength(10);
    expect(new Set(ROADMAP.map((s) => s.id)).size).toBe(10);
  });
  it('ссылки в основах и роадмапе ведут на существующие страницы', () => {
    [...BASICS, ...ROADMAP].forEach((x) => {
      if (x.link) expect(isValidRoute(x.link.to), x.link.to).toBe(true);
    });
    [...NAV_LINKS, ...TOOL_LINKS].forEach((l) => expect(isValidRoute(l.to), l.to).toBe(true));
  });
  it('глоссарий: уникальные термины и известные категории', () => {
    expect(new Set(GLOSSARY.map((t) => t.term)).size).toBe(GLOSSARY.length);
    GLOSSARY.forEach((t) => expect(GLOSSARY_CATEGORIES[t.category], t.term).toBeDefined());
  });
});

describe('иконки', () => {
  it('у каждого предмета справочника есть иконка', () => {
    ITEM_LIST.forEach((item) => expect(ITEM_ICONS[item.id], item.id).toBeDefined());
  });
  it('иконки способностей привязаны к существующим клавишам героя', () => {
    Object.entries(ABILITY_ICONS).forEach(([heroId, map]) => {
      const hero = HEROES.find((h) => h.id === heroId);
      expect(hero, heroId).toBeDefined();
      Object.keys(map).forEach((key) => expect(hero?.abilities.some((a) => a.key === key), `${heroId}:${key}`).toBe(true));
    });
  });
  it('у всех основных способностей (Q/W/E/R) есть иконка', () => {
    HEROES.forEach((h) =>
      h.abilities
        .filter((a) => ['Q', 'W', 'E', 'R'].includes(a.key))
        .forEach((a) => expect(a.icon, `${h.id}:${a.key}`).toBeTruthy()),
    );
  });
  it('у всех заклинаний Инвокера есть иконка', () => {
    const invoker = HEROES.find((h) => h.id === 'invoker');
    invoker?.invokedSpells?.forEach((s) => expect(INVOKED_ICONS[s.nameEn], s.nameEn).toBeDefined());
  });
});

describe('цвета', () => {
  it('lighten осветляет цвет к белому', async () => {
    const { lighten } = await import('@/lib/color');
    expect(lighten('#000000', 0.5)).toBe('#808080');
    expect(lighten('#e5484d', 0)).toBe('#e5484d');
    expect(lighten('#e5484d', 1)).toBe('#ffffff');
  });
});
