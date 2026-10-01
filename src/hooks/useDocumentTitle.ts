import { useEffect } from 'react';

const SITE = 'Dota Guide';

/** Устанавливает document.title вида «Страница — Dota Guide». */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE}` : `${SITE} — справочник по Dota 2`;
  }, [title]);
}
