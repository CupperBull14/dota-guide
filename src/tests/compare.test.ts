import { describe, expect, it } from 'vitest';
import { buildStatRows, matchup, parseCompare } from '@/lib/compare';
import { getHeroById, HEROES } from '@/data/heroes';
import { HERO_DETAILS } from '@/data/live';

describe('сравнение героев', () => {
  it('характеристики: победитель по каждой строке', () => {
    const rows = buildStatRows(HERO_DETAILS.sven, HERO_DETAILS.sniper);
    expect(rows.map((r) => r.id)).toEqual(['health', 'mana', 'armor', 'damage', 'range', 'speed', 'str', 'agi', 'int']);
    // Снайпер бьёт дальше Свена
    expect(rows.find((r) => r.id === 'range')?.winner).toBe('b');
    rows.forEach((r) => {
      if (r.a !== null && r.b !== null) {
        const expected = r.a === r.b ? 'tie' : r.a > r.b ? 'a' : 'b';
        expect(r.winner, r.id).toBe(expected);
      }
    });
  });

  it('без данных — прочерки, без победителя', () => {
    const rows = buildStatRows(undefined, HERO_DETAILS.sven);
    expect(rows.every((r) => r.aText === '—' && r.winner === null)).toBe(true);
  });

  it('матчап: Акс контрит Снайпера (из гайда Снайпера), синергия Свена и Магнуса', () => {
    const sniper = getHeroById('sniper')!;
    const axe = getHeroById('axe')!;
    expect(matchup(sniper, axe).bCountersA?.heroId).toBe('axe');
    expect(matchup(axe, sniper).aCountersB?.heroId).toBe('axe');
    expect(matchup(getHeroById('sven')!, getHeroById('magnus')!).synergy).toBeDefined();
    expect(matchup(sniper, sniper)).toEqual({});
  });

  it('разбор адреса с запасными значениями', () => {
    const ids = HEROES.map((h) => h.id);
    expect(parseCompare(new URLSearchParams('a=zeus&b=lich'), ids, ['sven', 'axe'])).toEqual({ a: 'zeus', b: 'lich' });
    expect(parseCompare(new URLSearchParams('a=hack'), ids, ['sven', 'axe'])).toEqual({ a: 'sven', b: 'axe' });
  });
});
