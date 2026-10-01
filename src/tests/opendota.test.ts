/**
 * Разбор матчей на реальных ответах OpenDota (сохранены 2026-10-01):
 * последние матчи публичного игрока, его профиль и распределения показателей Anti-Mage.
 */
import { describe, expect, it } from 'vitest';
import { parseAccountInput, rankName, type ODBenchmarks, type ODRecentMatch } from '@/lib/opendota';
import {
  benchmarkHero,
  buildAdvice,
  detectRoadmapSteps,
  heroUsage,
  isWin,
  percentileOf,
  summarize,
  type HeroBenchmark,
} from '@/lib/analysis';
import { getIndexHeroById } from '@/data/allHeroes';
import matchesJson from './fixtures/opendota-recent-matches.json';
import benchJson from './fixtures/opendota-benchmarks-am.json';

const MATCHES = matchesJson as ODRecentMatch[];
const AM = benchJson as ODBenchmarks;
const name = (id: number) => `#${id}`;

describe('parseAccountInput', () => {
  it('понимает Friend ID, SteamID64 и ссылки на профили', () => {
    expect(parseAccountInput('86745912')).toEqual({ ok: true, accountId: 86745912 });
    expect(parseAccountInput(' 76561198047011640 ')).toEqual({ ok: true, accountId: 86745912 });
    expect(parseAccountInput('https://steamcommunity.com/profiles/76561198047011640/')).toEqual({ ok: true, accountId: 86745912 });
    expect(parseAccountInput('https://www.dotabuff.com/players/86745912/matches')).toEqual({ ok: true, accountId: 86745912 });
    expect(parseAccountInput('https://www.opendota.com/players/86745912')).toEqual({ ok: true, accountId: 86745912 });
    expect(parseAccountInput('https://stratz.com/players/86745912')).toEqual({ ok: true, accountId: 86745912 });
  });
  it('отклоняет пустой ввод, vanity-ссылки и мусор', () => {
    expect(parseAccountInput('   ')).toEqual({ ok: false, reason: 'empty' });
    expect(parseAccountInput('https://steamcommunity.com/id/somebody/')).toEqual({ ok: false, reason: 'vanity' });
    expect(parseAccountInput('abc')).toEqual({ ok: false, reason: 'invalid' });
    expect(parseAccountInput('0')).toEqual({ ok: false, reason: 'invalid' });
    expect(parseAccountInput('99999999999')).toEqual({ ok: false, reason: 'invalid' });
  });
});

describe('rankName', () => {
  it('медаль и звёзды из rank_tier', () => {
    expect(rankName(80)).toBe('Титан');
    expect(rankName(54)).toBe('Легенда 4');
    expect(rankName(11)).toBe('Рекрут 1');
    expect(rankName(null)).toBeNull();
    expect(rankName(95)).toBeNull();
  });
});

describe('разбор реальных матчей', () => {
  it('победа считается по стороне игрока (слоты 128+ — Силы Тьмы)', () => {
    expect(MATCHES.map(isWin)).toEqual([true, true, true, false, false, true]);
  });

  it('сводка', () => {
    const s = summarize(MATCHES);
    expect(s.total).toBe(6);
    expect(s.counted).toBe(6);
    expect(s.turbo).toBe(0);
    expect(s.wins).toBe(4);
    expect(s.heroPool).toBe(5);
    expect(s.kills).toBeCloseTo(76 / 6, 5);
    expect(s.gpm).toBeCloseTo((939 + 799 + 690 + 661 + 814 + 747) / 6, 5);
  });

  it('турбо не входит в средние', () => {
    const turbo = MATCHES.map((m, i) => (i === 0 ? { ...m, game_mode: 23, gold_per_min: 5000 } : m));
    const s = summarize(turbo);
    expect(s.turbo).toBe(1);
    expect(s.counted).toBe(5);
    expect(s.gpm).toBeCloseTo((799 + 690 + 661 + 814 + 747) / 5, 5);
  });

  it('герои по частоте; все id есть в справочнике героев', () => {
    const usage = heroUsage(MATCHES);
    expect(usage[0]).toMatchObject({ heroId: 53, games: 2, wins: 1, core: true });
    expect(usage).toHaveLength(5);
    usage.forEach((u) => expect(getIndexHeroById(u.heroId), String(u.heroId)).toBeDefined());
  });
});

describe('перцентили OpenDota', () => {
  const lh = AM.result.last_hits_per_min;
  it('интерполяция между точками распределения', () => {
    expect(percentileOf(9.346811819595645, lh)).toBe(50);
    expect(percentileOf(8, lh)).toBe(32);
    expect(percentileOf(20, lh)).toBe(99);
    expect(percentileOf(0, lh)).toBe(0);
    expect(percentileOf(5, undefined)).toBeNull();
  });

  it('benchmarkHero: добивания высокие, выживаемость «перевёрнута»', () => {
    const b = benchmarkHero(heroUsage(MATCHES)[0]!, AM);
    expect(b.lastHits).toBeGreaterThanOrEqual(95);
    expect(b.survival).toBe(43);
    expect(benchmarkHero(heroUsage(MATCHES)[0]!).lastHits).toBeNull();
  });
});

describe('советы', () => {
  const usage = heroUsage(MATCHES)[0]!;
  const weak: HeroBenchmark = { usage, lastHits: 12, gpm: 20, damage: 18, survival: 15 };

  it('слабые места → советы со ссылкой на шаги роадмапа', () => {
    const advice = buildAdvice(summarize(MATCHES), [weak], name);
    const kinds = advice.map((a) => a.kind);
    expect(kinds).toEqual(expect.arrayContaining(['last-hits', 'deaths', 'damage']));
    expect(kinds).not.toContain('strength');
    expect(advice.find((a) => a.kind === 'last-hits')?.text).toContain('меньше, чем у 88%');
    expect(advice.find((a) => a.kind === 'last-hits')?.roadmapStep).toBe('m3');
  });

  it('сильная сторона и без ложных советов', () => {
    const strong: HeroBenchmark = { usage, lastHits: 96, gpm: 90, damage: 60, survival: 43 };
    const advice = buildAdvice(summarize(MATCHES), [strong], name);
    expect(advice.map((a) => a.kind)).toEqual(['strength']);
    expect(advice[0]!.text).toContain('лучше 96%');
  });

  it('большой пул героев при 10+ матчах', () => {
    const many = Array.from({ length: 10 }, (_, i) => ({ ...MATCHES[0]!, match_id: i, hero_id: i + 1 }));
    expect(buildAdvice(summarize(many), [], name).map((a) => a.kind)).toContain('hero-pool');
  });

  it('шаги роадмапа подтверждаются только статистикой', () => {
    const s = summarize(MATCHES);
    expect(detectRoadmapSteps(s, [{ usage, lastHits: 96, gpm: 90, damage: 60, survival: 43 }])).toEqual(['m1', 'm3']);
    expect(detectRoadmapSteps(s, [{ usage, lastHits: 20, gpm: 20, damage: 20, survival: 80 }])).toEqual(['m1', 'm9']);
    expect(detectRoadmapSteps(summarize([]), [])).toEqual([]);
  });
});
