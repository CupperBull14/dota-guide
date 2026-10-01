/**
 * Прогресс роадмапа «Первые 10 матчей» — общий для раздела «Новичкам» и разбора матчей.
 * Хранится в localStorage; изменения рассылаются событием, чтобы все подписчики обновились.
 */
const KEY = 'dota-guide:roadmap';
const EVENT = 'dota-guide:roadmap-change';

function read(): string[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

let snapshot: string[] | null = null;

export const getRoadmapSnapshot = () => (snapshot ??= read());
export const EMPTY_ROADMAP: string[] = [];

export const subscribeRoadmap = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
};

export function writeRoadmap(ids: string[]) {
  snapshot = ids;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // localStorage недоступен — прогресс живёт до перезагрузки
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Добавляет шаги к пройденным (без дублей). Возвращает, сколько добавлено. */
export function markRoadmapSteps(ids: string[]): number {
  const cur = getRoadmapSnapshot();
  const fresh = ids.filter((id) => !cur.includes(id));
  if (fresh.length) writeRoadmap([...cur, ...fresh]);
  return fresh.length;
}

/** Только для тестов: сбросить кэш снимка. */
export const resetRoadmapCache = () => {
  snapshot = null;
};
