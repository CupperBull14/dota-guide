import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'dota-guide:favorites';
const EVENT = 'dota-guide:favorites-change';

function read(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

// Кэшируем снимок, чтобы useSyncExternalStore получал стабильную ссылку.
let snapshot: string[] | null = null;
function getSnapshot(): string[] {
  if (snapshot === null) snapshot = read();
  return snapshot;
}
const EMPTY: string[] = [];
function getServerSnapshot(): string[] {
  return EMPTY;
}

function write(ids: string[]) {
  snapshot = ids;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Хранилище недоступно (приватный режим) — избранное живёт до перезагрузки.
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(callback: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      snapshot = read();
      callback();
    }
  };
  window.addEventListener(EVENT, callback);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener('storage', onStorage);
  };
}

/** Избранные герои: localStorage + синхронизация между компонентами и вкладками. */
export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const toggle = useCallback((id: string) => {
    const current = getSnapshot();
    write(current.includes(id) ? current.filter((f) => f !== id) : [...current, id]);
  }, []);

  const clear = useCallback(() => write([]), []);

  return { favorites, isFavorite, toggle, clear };
}
