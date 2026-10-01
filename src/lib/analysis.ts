import type { ODBenchmarkPoint, ODBenchmarks, ODRecentMatch } from '@/lib/opendota';

/**
 * Разбор последних матчей игрока. Только чистые функции: все выводы — из реальных
 * данных OpenDota (матчи игрока и распределения показателей по героям).
 */

/** Турбо искажает золото и опыт — такие матчи не сравниваем с обычными. */
export const TURBO_MODE = 23;

export const isWin = (m: Pick<ODRecentMatch, 'player_slot' | 'radiant_win'>) =>
  (m.player_slot < 128) === m.radiant_win;

const perMin = (value: number, durationSec: number) => (durationSec > 0 ? value / (durationSec / 60) : 0);

export interface MatchStats {
  match: ODRecentMatch;
  win: boolean;
  minutes: number;
  lhPerMin: number;
  deathsPerMin: number;
  damagePerMin: number;
  kda: number;
}

export function matchStats(m: ODRecentMatch): MatchStats {
  return {
    match: m,
    win: isWin(m),
    minutes: m.duration / 60,
    lhPerMin: perMin(m.last_hits, m.duration),
    deathsPerMin: perMin(m.deaths, m.duration),
    damagePerMin: perMin(m.hero_damage, m.duration),
    kda: (m.kills + m.assists) / Math.max(1, m.deaths),
  };
}

const avg = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);

export interface Summary {
  total: number;
  /** Матчи без турбо — по ним считаются средние. */
  counted: number;
  turbo: number;
  wins: number;
  winRate: number;
  kills: number;
  deaths: number;
  assists: number;
  kda: number;
  gpm: number;
  xpm: number;
  lhPerMin: number;
  minutes: number;
  /** Сколько разных героев в выборке. */
  heroPool: number;
}

export function summarize(matches: ODRecentMatch[]): Summary {
  const normal = matches.filter((m) => m.game_mode !== TURBO_MODE);
  const stats = normal.map(matchStats);
  const wins = matches.filter(isWin).length;
  const k = avg(normal.map((m) => m.kills));
  const d = avg(normal.map((m) => m.deaths));
  const a = avg(normal.map((m) => m.assists));
  return {
    total: matches.length,
    counted: normal.length,
    turbo: matches.length - normal.length,
    wins,
    winRate: matches.length ? wins / matches.length : 0,
    kills: k,
    deaths: d,
    assists: a,
    kda: (k + a) / Math.max(1, d),
    gpm: avg(normal.map((m) => m.gold_per_min)),
    xpm: avg(normal.map((m) => m.xp_per_min)),
    lhPerMin: avg(stats.map((s) => s.lhPerMin)),
    minutes: avg(stats.map((s) => s.minutes)),
    heroPool: new Set(matches.map((m) => m.hero_id)).size,
  };
}

export interface HeroUsage {
  heroId: number;
  games: number;
  wins: number;
  lhPerMin: number;
  deathsPerMin: number;
  damagePerMin: number;
  gpm: number;
  /** Чаще всего — керри/мид/оффлейн (1–3) или саппорт (4–5)? По lane_role OpenDota. */
  core: boolean;
}

/** Герои игрока по числу матчей (без турбо). */
export function heroUsage(matches: ODRecentMatch[]): HeroUsage[] {
  const groups = new Map<number, MatchStats[]>();
  matches
    .filter((m) => m.game_mode !== TURBO_MODE)
    .forEach((m) => groups.set(m.hero_id, [...(groups.get(m.hero_id) ?? []), matchStats(m)]));
  return [...groups.entries()]
    .map(([heroId, list]) => ({
      heroId,
      games: list.length,
      wins: list.filter((s) => s.win).length,
      lhPerMin: avg(list.map((s) => s.lhPerMin)),
      deathsPerMin: avg(list.map((s) => s.deathsPerMin)),
      damagePerMin: avg(list.map((s) => s.damagePerMin)),
      gpm: avg(list.map((s) => s.match.gold_per_min)),
      // lane_role 1–3 — линии коров; саппорты обычно получают 0/4/5 или «роум».
      core:
        list.filter((s) => (s.match.lane_role ?? 0) >= 1 && (s.match.lane_role ?? 0) <= 3 && !s.match.is_roaming).length >=
        list.length / 2,
    }))
    .sort((a, b) => b.games - a.games || b.wins - a.wins);
}

/**
 * Перцентиль значения в распределении OpenDota (0–100): какая доля игроков на этом герое
 * показывает результат не выше твоего. Линейная интерполяция между точками.
 */
export function percentileOf(value: number, points: ODBenchmarkPoint[] | undefined): number | null {
  if (!points?.length) return null;
  const sorted = [...points].sort((a, b) => a.percentile - b.percentile);
  const first = sorted[0]!;
  const last = sorted[sorted.length - 1]!;
  if (value <= first.value) return Math.round(first.percentile * 100 * (first.value ? Math.max(0, value / first.value) : 0));
  if (value >= last.value) return Math.round(last.percentile * 100);
  for (let i = 1; i < sorted.length; i++) {
    const lo = sorted[i - 1]!;
    const hi = sorted[i]!;
    if (value <= hi.value) {
      const t = hi.value === lo.value ? 0 : (value - lo.value) / (hi.value - lo.value);
      return Math.round((lo.percentile + t * (hi.percentile - lo.percentile)) * 100);
    }
  }
  return Math.round(last.percentile * 100);
}

export interface HeroBenchmark {
  usage: HeroUsage;
  /** Чем больше — тем лучше (добивания, урон, золото). */
  lastHits: number | null;
  gpm: number | null;
  damage: number | null;
  /** Перцентиль смертей уже «перевёрнут»: 90 = умираешь реже 90% игроков. */
  survival: number | null;
}

export function benchmarkHero(usage: HeroUsage, bench?: ODBenchmarks): HeroBenchmark {
  const r = bench?.result ?? {};
  const deaths = percentileOf(usage.deathsPerMin, r.deaths_per_min);
  return {
    usage,
    lastHits: percentileOf(usage.lhPerMin, r.last_hits_per_min),
    gpm: percentileOf(usage.gpm, r.gold_per_min),
    damage: percentileOf(usage.damagePerMin, r.hero_damage_per_min),
    survival: deaths === null ? null : 100 - deaths,
  };
}

// ─────────────────────────── Советы ───────────────────────────

export type AdviceKind = 'last-hits' | 'deaths' | 'damage' | 'hero-pool' | 'strength' | 'turbo';

export interface Advice {
  kind: AdviceKind;
  tone: 'improve' | 'good' | 'info';
  title: string;
  text: string;
  /** Связанный шаг роадмапа «Первые 10 матчей». */
  roadmapStep?: string;
  link?: { to: string; label: string };
}

/**
 * Советы на основе фактов. heroName — имя героя для текста.
 * Пороги: «нужно поработать» — ниже 30-го перцентиля (хуже 70% игроков на этом герое),
 * «сильная сторона» — выше 70-го.
 */
export function buildAdvice(
  summary: Summary,
  heroes: HeroBenchmark[],
  heroName: (id: number) => string,
): Advice[] {
  const advice: Advice[] = [];
  const main = heroes.filter((h) => h.usage.games >= 2);

  const weakLh = main.find((h) => h.usage.core && h.lastHits !== null && h.lastHits < 30);
  if (weakLh) {
    advice.push({
      kind: 'last-hits',
      tone: 'improve',
      title: 'Добивания',
      text: `На ${heroName(weakLh.usage.heroId)} у тебя ${weakLh.usage.lhPerMin.toFixed(1)} добивания в минуту — меньше, чем у ${100 - (weakLh.lastHits ?? 0)}% игроков на этом герое. Пять минут ластхитов в демо-режиме перед игрой быстро это исправят.`,
      roadmapStep: 'm3',
      link: { to: '/beginners#roadmap', label: 'Шаг «Ластхиты» в роадмапе' },
    });
  }

  const weakSurvival = main.find((h) => h.survival !== null && h.survival < 30);
  if (weakSurvival) {
    advice.push({
      kind: 'deaths',
      tone: 'improve',
      title: 'Смерти',
      text: `На ${heroName(weakSurvival.usage.heroId)} ты умираешь чаще, чем ${100 - (weakSurvival.survival ?? 0)}% игроков на этом герое (${(weakSurvival.usage.deathsPerMin * 10).toFixed(1)} смертей за 10 минут). Чаще смотри на миникарту и держись за союзниками в драках.`,
      roadmapStep: 'm9',
      link: { to: '/beginners#roadmap', label: 'Шаги «Миникарта» и «Позиция в драке»' },
    });
  }

  const weakDamage = main.find((h) => h.damage !== null && h.damage < 30);
  if (weakDamage) {
    advice.push({
      kind: 'damage',
      tone: 'improve',
      title: 'Участие в драках',
      text: `На ${heroName(weakDamage.usage.heroId)} урон по героям ниже, чем у ${100 - (weakDamage.damage ?? 0)}% игроков. Приходи на драки вовремя: держи свиток телепортации и следи за союзниками на миникарте.`,
      roadmapStep: 'm5',
    });
  }

  if (summary.total >= 10 && summary.heroPool >= 8) {
    advice.push({
      kind: 'hero-pool',
      tone: 'improve',
      title: 'Слишком много разных героев',
      text: `За последние ${summary.total} матчей ты сыграл на ${summary.heroPool} разных героях. Пока учишься, выбери 1–2 героев — так быстрее растёт понимание игры.`,
      roadmapStep: 'm2',
      link: { to: '/pick', label: 'Подобрать своего героя' },
    });
  }

  const best = [...main]
    .map((h) => ({ h, score: Math.max(h.lastHits ?? 0, h.survival ?? 0, h.damage ?? 0) }))
    .sort((a, b) => b.score - a.score)[0];
  if (best && best.score >= 70) {
    const { h } = best;
    const what =
      h.lastHits === best.score ? 'добиваниям' : h.survival === best.score ? 'выживаемости' : 'урону по героям';
    advice.push({
      kind: 'strength',
      tone: 'good',
      title: 'Сильная сторона',
      text: `На ${heroName(h.usage.heroId)} по ${what} ты лучше ${best.score}% игроков на этом герое. Так держать!`,
    });
  }

  if (summary.turbo > 0) {
    advice.push({
      kind: 'turbo',
      tone: 'info',
      title: 'Турбо-матчи',
      text: `${summary.turbo} из ${summary.total} матчей — турбо. В средних показателях они не учитываются: в турбо золото и опыт идут быстрее.`,
    });
  }

  return advice;
}

/** Какие шаги роадмапа подтверждены статистикой (их можно отметить пройденными). */
export function detectRoadmapSteps(summary: Summary, heroes: HeroBenchmark[]): string[] {
  const steps: string[] = [];
  if (summary.total > 0) steps.push('m1');
  if (heroes.some((h) => h.usage.games >= 5)) steps.push('m2');
  if (heroes.some((h) => h.usage.core && h.usage.games >= 2 && (h.lastHits ?? 0) >= 50)) steps.push('m3');
  if (heroes.some((h) => h.usage.games >= 2 && (h.survival ?? 0) >= 50)) steps.push('m9');
  return steps;
}
