// @vitest-environment jsdom
/**
 * Смоук-тесты страниц: каждый роут рендерится без ошибок, показывает свой заголовок h1
 * и ставит document.title. Плюс пара сценариев: фильтр из URL и избранное.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import App from '@/App';

function beforeAllStubs() {
  // jsdom не умеет IntersectionObserver и matchMedia — подставляем простые заглушки.
  class IO {
    constructor(private cb: IntersectionObserverCallback) {}
    observe(el: Element) {
      this.cb([{ isIntersecting: true, target: el } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
    }
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
    root = null;
    rootMargin = '';
    thresholds = [];
  }
  vi.stubGlobal('IntersectionObserver', IO);
  vi.stubGlobal(
    'matchMedia',
    (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList,
  );
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
}
beforeAll(beforeAllStubs);

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <MotionConfig reducedMotion="always">
        <App />
      </MotionConfig>
    </MemoryRouter>,
  );
}

const ROUTES: { path: string; h1: RegExp; title: string }[] = [
  { path: '/', h1: /Стань сильнее/, title: 'Dota Guide — справочник по Dota 2' },
  { path: '/heroes', h1: /Все герои/, title: 'Все герои — Dota Guide' },
  { path: '/heroes/sven', h1: /Свен/, title: 'Свен (Sven) — гайд — Dota Guide' },
  { path: '/heroes/invoker', h1: /Инвокер/, title: 'Инвокер (Invoker) — гайд — Dota Guide' },
  { path: '/map', h1: /Интерактивная карта/, title: 'Интерактивная карта — Dota Guide' },
  { path: '/beginners', h1: /Первые шаги в Dota 2/, title: 'Новичкам — Dota Guide' },
  { path: '/favorites', h1: /Мои герои/, title: 'Избранное — Dota Guide' },
  { path: '/patch', h1: /Что изменилось/, title: 'Изменения патча — Dota Guide' },
  { path: '/compare?a=sven&b=zeus', h1: /Сравнение героев/, title: 'Сравнение: Свен и Зевс — Dota Guide' },
  { path: '/pick', h1: /Подбери героя/, title: 'Подбери героя — Dota Guide' },
  { path: '/pick?r=1.0.0.0.2.1.0', h1: /Подбери героя/, title: 'Подбери героя — Dota Guide' },
  { path: '/counter', h1: /Против кого я играю/, title: 'Против кого я играю — Dota Guide' },
  { path: '/counter?me=sniper&vs=riki,axe,phantom-lancer', h1: /Против кого я играю/, title: 'Против кого я играю — Dota Guide' },
  { path: '/me', h1: /Разбор моих матчей/, title: 'Разбор моих матчей — Dota Guide' },
  { path: '/compare?a=nope', h1: /Сравнение героев/, title: 'Сравнение: Свен и Джаггернаут — Dota Guide' },
  { path: '/no-such-page', h1: /Потерялись в тумане войны/, title: 'Страница не найдена — Dota Guide' },
  { path: '/heroes/no-such-hero', h1: /Потерялись в тумане войны/, title: 'Страница не найдена — Dota Guide' },
];

describe('страницы', () => {
  for (const route of ROUTES) {
    it(`${route.path} → заголовок и document.title`, async () => {
      renderAt(route.path);
      const h1 = await screen.findByRole('heading', { level: 1 }, { timeout: 5000 });
      expect(h1.textContent).toMatch(route.h1);
      // Заголовок вкладки ставится эффектом после отрисовки — ждём его, а не проверяем мгновенно.
      await waitFor(() => expect(document.title).toBe(route.title), { timeout: 3000 });
      // На странице ровно один h1 — правильная структура заголовков.
      expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    });
  }

  it('у каждой страницы есть шапка, main и футер', async () => {
    renderAt('/');
    await screen.findByRole('heading', { level: 1 });
    // Ровно один «banner» — шапка сайта; заголовки секций не должны им притворяться.
    expect(screen.getAllByRole('banner')).toHaveLength(1);
    expect(screen.getByRole('main')).toBeTruthy();
    expect(screen.getByRole('contentinfo')).toBeTruthy();
    expect(screen.getByRole('navigation', { name: 'Основная навигация' })).toBeTruthy();
  });
});

describe('сценарии', () => {
  it('фильтр из ссылки категории: /heroes?attr=str показывает только силовиков', async () => {
    renderAt('/heroes?attr=str');
    expect(await screen.findByText(/Найдено: 4 героя из 15/, undefined, { timeout: 5000 })).toBeTruthy();
  });

  it('герой, добавленный в избранное, появляется на /favorites', async () => {
    renderAt('/heroes/sven');
    const button = await screen.findByRole('button', { name: 'В избранное' }, { timeout: 5000 });
    act(() => {
      fireEvent.click(button);
    });
    expect(screen.getByRole('button', { name: 'В избранном' }).getAttribute('aria-pressed')).toBe('true');
    cleanup();

    renderAt('/favorites');
    expect(await screen.findByText('В избранном: 1', undefined, { timeout: 5000 })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Свен' })).toBeTruthy();
  });

  it('подбор героя: 7 ответов → результат и ссылка с ответами', async () => {
    renderAt('/pick');
    for (let i = 0; i < 7; i++) {
      const radios = await screen.findAllByRole('radio', undefined, { timeout: 3000 });
      act(() => {
        fireEvent.click(radios[0]!);
      });
      if (i < 6) await screen.findByText(`Вопрос ${i + 2} из 7`, undefined, { timeout: 3000 });
    }
    expect(await screen.findByText('Твои герои', undefined, { timeout: 3000 })).toBeTruthy();
    expect(screen.getAllByText('Лучший выбор')).toHaveLength(1);
  });

  it('помощник: по ссылке сразу виден разбор и предметы', async () => {
    renderAt('/counter?me=sniper&vs=riki,axe');
    expect(await screen.findByText(/Самые опасные для/, undefined, { timeout: 3000 })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Что купить' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Невидимость' })).toBeTruthy();
  });

  it('несуществующий герой не ломает хлебные крошки', async () => {
    renderAt('/heroes/no-such-hero');
    await screen.findByRole('heading', { level: 1 });
    expect(screen.queryByRole('navigation', { name: 'Хлебные крошки' })).toBeNull();
  });
  it('разбор матчей: по ссылке /me?id= грузит данные OpenDota и показывает советы', async () => {
    const player = (await import('./fixtures/opendota-player.json')).default;
    const matches = (await import('./fixtures/opendota-recent-matches.json')).default;
    const bench = (await import('./fixtures/opendota-benchmarks-am.json')).default;
    const fetchMock = vi.fn(async (url: string) => {
      const body = url.includes('/recentMatches') ? matches : url.includes('/benchmarks') ? bench : player;
      return { ok: true, status: 200, json: async () => body } as Response;
    });
    vi.stubGlobal('fetch', fetchMock);
    try {
      renderAt('/me?id=86745912');
      expect(await screen.findByText('Последние 6 матчей', undefined, { timeout: 5000 })).toBeTruthy();
      expect(screen.getByText(/Титан/)).toBeTruthy();
      expect(screen.getByRole('heading', { name: 'Советы по твоим матчам' })).toBeTruthy();
      expect(screen.getAllByRole('link', { name: /^Разбор матча/ })).toHaveLength(6);
      // 2 запроса игрока + бенчмарки трёх самых частых героев.
      expect(fetchMock).toHaveBeenCalledTimes(5);
    } finally {
      vi.unstubAllGlobals();
      beforeAllStubs();
    }
  });
});
