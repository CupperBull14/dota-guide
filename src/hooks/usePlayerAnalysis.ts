import { useEffect, useState } from 'react';
import {
  fetchBenchmarks,
  fetchPlayer,
  fetchRecentMatches,
  OpenDotaError,
  type ODBenchmarks,
  type ODErrorKind,
  type ODPlayer,
  type ODRecentMatch,
} from '@/lib/opendota';
import { benchmarkHero, heroUsage, summarize, type HeroBenchmark, type Summary } from '@/lib/analysis';

/** Сколько самых частых героев сравниваем с распределением OpenDota (1 запрос на героя). */
export const BENCHMARKED_HEROES = 3;

export interface PlayerAnalysis {
  accountId: number;
  player: ODPlayer;
  matches: ODRecentMatch[];
  summary: Summary;
  heroes: HeroBenchmark[];
}

export type AnalysisState =
  | { status: 'idle' }
  | { status: 'loading'; accountId: number }
  /** Профиль есть, но матчей нет: скорее всего, закрыта статистика матчей. */
  | { status: 'empty'; accountId: number; player: ODPlayer }
  | { status: 'error'; accountId: number; kind: ODErrorKind }
  | { status: 'ready'; data: PlayerAnalysis };

/**
 * Загружает профиль, последние матчи и распределения показателей по главным героям.
 * Пока не готовы бенчмарки, разбор всё равно строится — просто без перцентилей.
 */
export function usePlayerAnalysis(accountId: number | null, attempt = 0): AnalysisState {
  const [state, setState] = useState<AnalysisState>({ status: 'idle' });

  useEffect(() => {
    if (accountId === null) {
      setState({ status: 'idle' });
      return;
    }
    const controller = new AbortController();
    const { signal } = controller;
    setState({ status: 'loading', accountId });

    (async () => {
      try {
        const [player, matches] = await Promise.all([
          fetchPlayer(accountId, signal),
          fetchRecentMatches(accountId, signal),
        ]);
        // OpenDota на неизвестный ID отвечает 200 с пустым профилем.
        if (!player.profile) throw new OpenDotaError('not-found', 'Игрок не найден');
        if (!matches.length) {
          setState({ status: 'empty', accountId, player });
          return;
        }
        const usage = heroUsage(matches);
        const top = usage.slice(0, BENCHMARKED_HEROES);
        const benches = await Promise.all(
          top.map((u) => fetchBenchmarks(u.heroId, signal).catch((e: unknown): ODBenchmarks | undefined => {
            if ((e as Error).name === 'AbortError') throw e;
            return undefined; // без перцентилей по этому герою, но разбор продолжается
          })),
        );
        const heroes = usage.map((u, i) => benchmarkHero(u, i < top.length ? benches[i] : undefined));
        setState({ status: 'ready', data: { accountId, player, matches, summary: summarize(matches), heroes } });
      } catch (error) {
        if ((error as Error).name === 'AbortError') return;
        const kind = error instanceof OpenDotaError ? error.kind : 'server';
        setState({ status: 'error', accountId, kind });
      }
    })();

    return () => controller.abort();
  }, [accountId, attempt]);

  return state;
}
