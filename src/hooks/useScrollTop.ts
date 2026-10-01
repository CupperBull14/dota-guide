import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Сбрасывает скролл при смене страницы (но не при смене query/hash). */
export function useScrollTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
}
