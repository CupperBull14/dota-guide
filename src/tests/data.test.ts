import { describe, expect, it } from 'vitest';
import { HEROES, getHeroById } from '@/data/heroes';
import { ITEMS } from '@/data/items';
import { ATTRIBUTE_ORDER, COMPLEXITY_ORDER, ROLE_ORDER } from '@/data/constants';
import { buildCrumbs } from '@/components/layout/Breadcrumbs';

/** Целостность данных: всё, на что ссылается сайт, должно существовать. */
describe('данные героев', () => {
  it('id уникальны и пригодны для URL', () => {
    const ids = HEROES.map((h) => h.id);
    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach((id) => expect(id).toMatch(/^[a-z0-9-]+$/));
  });

  for (const hero of HEROES) {
    describe(hero.name, () => {
      it('таланты на 10/15/20/25, клавиши способностей уникальны', () => {
        expect(hero.talents.map((t) => t.level)).toEqual([10, 15, 20, 25]);
        const keys = hero.abilities.map((a) => a.key);
        expect(new Set(keys).size).toBe(keys.length);
      });

      const order = hero.skillBuild.order;
      if (order) {
        it('скиллбилд: 16 уровней, ульта на 6 и 12, таланты на 10 и 15', () => {
          expect(order).toHaveLength(16);
          const keys = new Set(hero.abilities.map((a) => a.key));
          order.forEach((step) => {
            if (step !== 'T') expect(keys.has(step)).toBe(true);
          });
          const ult = order
            .map((s, i) => (s === 'R' ? i + 1 : 0))
            .filter(Boolean);
          expect(ult).toEqual([6, 12]);
          expect(order[9]).toBe('T');
          expect(order[14]).toBe('T');
          // Каждая обычная способность вкачана не больше 4 раз.
          for (const key of ['Q', 'W', 'E'] as const) {
            expect(order.filter((s) => s === key).length).toBeLessThanOrEqual(4);
          }
        });
      } else {
        // Нестандартная прокачка (Инвокер): вместо таблицы — описание и заклинания из сфер.
        it('нестандартная прокачка: есть описание и заклинания', () => {
          expect(hero.skillBuild.summary.length).toBeGreaterThan(40);
          expect(hero.invokedSpells?.length ?? 0).toBeGreaterThan(0);
        });
      }

      it('все предметы есть в справочнике', () => {
        const all = [...hero.items.start, ...hero.items.early, ...hero.items.core, ...hero.items.situational];
        all.forEach((ref) => expect(ITEMS[ref.itemId], ref.itemId).toBeDefined());
      });

      it('ссылки на героев ведут на существующие страницы', () => {
        [...hero.counters, ...hero.synergies].forEach((rel) => {
          if (rel.heroId) expect(getHeroById(rel.heroId), rel.heroId).toBeDefined();
        });
      });

      it('есть портрет и рендер с CDN Valve', () => {
        expect(hero.imageUrl).toMatch(/^https:\/\/cdn\.cloudflare\.steamstatic\.com\/.+\.png$/);
        expect(hero.renderUrl).toMatch(/\/renders\/.+\.png$/);
      });

      it('есть описание, советы и тактика', () => {
        expect(hero.shortDescription.length).toBeGreaterThan(20);
        expect(hero.tips.length).toBeGreaterThan(0);
        expect(hero.abilities.every((a) => a.tips.length > 0)).toBe(true);
      });
    });
  }
});

describe('покрытие базы', () => {
  it('в базе 12–15 героев', () => {
    expect(HEROES.length).toBeGreaterThanOrEqual(12);
    expect(HEROES.length).toBeLessThanOrEqual(15);
  });
  it('покрыты все атрибуты, роли и уровни сложности', () => {
    expect(new Set(HEROES.map((h) => h.attribute))).toEqual(new Set(ATTRIBUTE_ORDER));
    expect(new Set(HEROES.map((h) => h.complexity))).toEqual(new Set(COMPLEXITY_ORDER));
    expect(new Set(HEROES.flatMap((h) => h.roles))).toEqual(new Set(ROLE_ORDER));
  });
  it('герои из базы в связях становятся ссылками', () => {
    const svenSyn = getHeroById('sven')?.synergies.find((s) => s.name === 'Magnus');
    expect(svenSyn?.heroId).toBe('magnus');
    const names = new Set(HEROES.flatMap((h) => [h.name, h.nameEn]));
    HEROES.forEach((h) =>
      [...h.counters, ...h.synergies].forEach((rel) => {
        if (names.has(rel.name)) expect(rel.heroId, `${h.id} → ${rel.name}`).toBeDefined();
      }),
    );
  });
  it('у Инвокера 10 заклинаний с уникальными сочетаниями сфер', () => {
    const spells = getHeroById('invoker')?.invokedSpells ?? [];
    expect(spells).toHaveLength(10);
    const combos = spells.map((s) => [...s.combo].sort().join(''));
    expect(new Set(combos).size).toBe(10);
  });
});

describe('хлебные крошки', () => {
  it('строятся для героя и раздела', () => {
    const lookup = (id: string) => getHeroById(id)?.name;
    expect(buildCrumbs('/heroes/sven', lookup)?.map((c) => c.label)).toEqual(['Герои', 'Свен']);
    expect(buildCrumbs('/map', lookup)?.map((c) => c.label)).toEqual(['Карта']);
    expect(buildCrumbs('/heroes', null)?.map((c) => c.label)).toEqual(['Герои']);
  });
  it('не строятся для главной и несуществующих путей', () => {
    const lookup = (id: string) => getHeroById(id)?.name;
    expect(buildCrumbs('/', lookup)).toBeNull();
    expect(buildCrumbs('/heroes/nope', lookup)).toBeNull();
    expect(buildCrumbs('/heroes/sven', null)).toBeNull();
    expect(buildCrumbs('/foo', lookup)).toBeNull();
  });
});
