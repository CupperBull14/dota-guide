import { describe, expect, it } from 'vitest';
import { MAP_MARKERS, MAP_ZONES, MARKER_TYPES, ROTATIONS } from '@/data/map';

const inBounds = (n: number) => n >= 0 && n <= 1000;

describe('данные карты', () => {
  it('id зон и маркеров уникальны', () => {
    const ids = [...MAP_ZONES.map((z) => z.id), ...MAP_MARKERS.map((m) => m.id)];
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('все координаты внутри карты 0–1000', () => {
    MAP_MARKERS.forEach((m) => {
      expect(inBounds(m.x) && inBounds(m.y), m.id).toBe(true);
    });
    MAP_ZONES.forEach((z) => {
      const nums = z.shape.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
      expect(nums.length, z.id).toBeGreaterThan(3);
      nums.forEach((n) => expect(inBounds(n), z.id).toBe(true));
    });
  });
  it('у каждого маркера известный тип', () => {
    MAP_MARKERS.forEach((m) => expect(MARKER_TYPES[m.type], m.id).toBeDefined());
  });
  it('стороны: зоны Света ниже диагонали реки, Тьмы — выше', () => {
    MAP_ZONES.filter((z) => z.kind === 'area' && z.side !== 'neutral').forEach((z) => {
      const nums = z.shape.split(/[ ,]+/).map(Number);
      for (let i = 0; i < nums.length; i += 2) {
        const x = nums[i] ?? 0;
        const y = nums[i + 1] ?? 0;
        if (z.side === 'radiant') expect(y, z.id).toBeGreaterThanOrEqual(x);
        else expect(y, z.id).toBeLessThanOrEqual(x);
      }
    });
  });
  it('в каждой вкладке есть объекты, у ротаций есть шаги', () => {
    for (const tab of ['runes', 'wards'] as const) {
      expect(MAP_MARKERS.some((m) => m.tabs.includes(tab))).toBe(true);
    }
    expect(ROTATIONS.length).toBeGreaterThan(0);
    ROTATIONS.forEach((r) => expect(r.steps.length).toBeGreaterThan(0));
  });
});
