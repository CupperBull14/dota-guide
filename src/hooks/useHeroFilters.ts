import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Hero } from '@/types/hero';
import {
  EMPTY_FILTERS,
  filterHeroes,
  parseFilters,
  serializeFilters,
  sortHeroes,
  type HeroFilters,
} from '@/lib/filters';

const SEARCH_DEBOUNCE_MS = 250;

/**
 * Состояние каталога героев, синхронизированное с URL (?attr=str&role=carry…).
 * Ссылкой на отфильтрованный список можно поделиться, кнопка «назад» работает.
 * Поисковая строка обновляет URL с задержкой, чтобы не засорять историю.
 */
export function useHeroFilters(heroes: readonly Hero[]) {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => parseFilters(params), [params]);
  const [query, setQuery] = useState(filters.q);

  // Если URL изменился извне (назад/вперёд, ссылка из категорий) — подтягиваем поиск.
  useEffect(() => {
    setQuery(filters.q);
  }, [filters.q]);

  const update = useCallback(
    (patch: Partial<HeroFilters>, options: { replace?: boolean } = {}) => {
      // Текущий текст поиска тоже сохраняем, даже если он ещё не попал в URL.
      const next = { ...parseFilters(params), q: query, ...patch };
      setParams(serializeFilters(next), { replace: options.replace ?? false, preventScrollReset: true });
    },
    [params, query, setParams],
  );

  // Отложенная запись поиска в URL.
  useEffect(() => {
    if (query === filters.q) return;
    const timer = window.setTimeout(() => update({ q: query }, { replace: true }), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [query, filters.q, update]);

  const reset = useCallback(() => {
    setQuery('');
    setParams(serializeFilters({ ...EMPTY_FILTERS, sort: filters.sort }), { preventScrollReset: true });
  }, [filters.sort, setParams]);

  // Фильтруем по актуальному тексту поиска сразу, не дожидаясь записи в URL.
  const results = useMemo(
    () => sortHeroes(filterHeroes(heroes, { ...filters, q: query }), filters.sort),
    [heroes, filters, query],
  );

  return { filters: { ...filters, q: query }, results, update, setQuery, reset };
}
