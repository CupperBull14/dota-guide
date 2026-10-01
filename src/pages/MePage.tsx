import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, EyeOff, History, Loader2, RefreshCw, SearchX, ShieldAlert, WifiOff } from 'lucide-react';
import { parseAccountInput, type ODErrorKind } from '@/lib/opendota';
import { buildAdvice, detectRoadmapSteps } from '@/lib/analysis';
import { usePlayerAnalysis } from '@/hooks/usePlayerAnalysis';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { EASE_OUT } from '@/lib/motion';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { AccountForm } from '@/components/me/AccountForm';
import { PlayerHeader } from '@/components/me/PlayerHeader';
import { SummaryStats } from '@/components/me/SummaryStats';
import { HeroBreakdown } from '@/components/me/HeroBreakdown';
import { AdviceList } from '@/components/me/AdviceList';
import { MatchTable } from '@/components/me/MatchTable';
import { matchHeroName } from '@/components/me/heroLookup';

const ACCOUNT_KEY = 'dota-guide:account';

function readSaved(): number | null {
  try {
    const raw = window.localStorage.getItem(ACCOUNT_KEY);
    if (!raw) return null;
    const parsed = parseAccountInput(raw);
    return parsed.ok ? parsed.accountId : null;
  } catch {
    return null;
  }
}

function save(id: number) {
  try {
    window.localStorage.setItem(ACCOUNT_KEY, String(id));
  } catch {
    // без localStorage просто не запоминаем
  }
}

const ERRORS: Record<ODErrorKind, { icon: typeof WifiOff; title: string; text: string }> = {
  network: {
    icon: WifiOff,
    title: 'Нет связи с OpenDota',
    text: 'Проверь интернет или попробуй позже — возможно, OpenDota временно недоступен или его блокирует сеть.',
  },
  'not-found': {
    icon: SearchX,
    title: 'Игрок не найден',
    text: 'По этому ID нет профиля. Проверь Friend ID в клиенте Dota 2 — это число под ником в профиле.',
  },
  'rate-limit': {
    icon: ShieldAlert,
    title: 'Слишком много запросов',
    text: 'Бесплатный доступ OpenDota ограничен примерно 60 запросами в минуту. Подожди минуту и обнови.',
  },
  server: {
    icon: ShieldAlert,
    title: 'OpenDota ответил ошибкой',
    text: 'Сервис временно не отвечает как надо. Попробуй обновить через пару минут.',
  },
};

/** /me?id=123456789 — разбор последних матчей игрока по открытым данным OpenDota. */
export default function MePage() {
  useDocumentTitle('Разбор моих матчей');
  const [params, setParams] = useSearchParams();
  const fromUrl = parseAccountInput(params.get('id') ?? '');
  const accountId = fromUrl.ok ? fromUrl.accountId : null;
  const [attempt, setAttempt] = useState(0);
  const [saved, setSaved] = useState<number | null>(null);
  const state = usePlayerAnalysis(accountId, attempt);

  useEffect(() => setSaved(readSaved()), []);
  useEffect(() => {
    if (state.status === 'ready') {
      save(state.data.accountId);
      setSaved(state.data.accountId);
    }
  }, [state]);

  const open = (id: number) => {
    if (id === accountId) setAttempt((n) => n + 1);
    else setParams({ id: String(id) }, { replace: false, preventScrollReset: true });
  };
  const refresh = () => setAttempt((n) => n + 1);

  const ready = state.status === 'ready' ? state.data : null;
  const advice = useMemo(
    () => (ready ? buildAdvice(ready.summary, ready.heroes, matchHeroName) : []),
    [ready],
  );
  const steps = useMemo(() => (ready ? detectRoadmapSteps(ready.summary, ready.heroes) : []), [ready]);

  return (
    <div className="container-page py-10 sm:py-14">
      <SectionTitle
        as="h1"
        eyebrow="Инструменты"
        title={
          <span className="flex items-center gap-3">
            <Activity size={34} aria-hidden="true" className="shrink-0 text-gold" />
            Разбор моих матчей
          </span>
        }
        description="Вставь свой ID Dota 2 — разберём последние матчи по открытым данным OpenDota: где ты сильнее других игроков на тех же героях, а где стоит поработать."
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <AccountForm
          key={accountId ?? 'new'}
          initial={accountId ? String(accountId) : ''}
          busy={state.status === 'loading'}
          onSubmit={open}
        />
        <aside className="panel p-5 text-sm text-ink-muted" aria-label="Как это работает">
          <p className="mb-2 font-bold text-ink">Как это работает</p>
          <ul className="space-y-1.5">
            <li>Данные берутся напрямую из открытого API OpenDota — сайт ничего не хранит, кроме твоего ID в браузере.</li>
            <li>Анализируются последние ~20 матчей. Турбо показываем, но не учитываем в средних.</li>
            <li>Твои показатели сравниваются с распределением всех игроков на том же герое.</li>
          </ul>
          {saved && saved !== accountId && (
            <Button
              size="sm"
              variant="ghost"
              className="mt-3"
              onClick={() => open(saved)}
              icon={<History size={16} aria-hidden="true" />}
            >
              Открыть прошлый аккаунт ({saved})
            </Button>
          )}
        </aside>
      </div>

      <div className="mt-10" aria-live="polite" aria-busy={state.status === 'loading'}>
        <AnimatePresence mode="wait">
          {state.status === 'idle' && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EmptyState
                icon={<Activity size={28} aria-hidden="true" />}
                title="Введи ID, чтобы начать"
                description="Нужен Friend ID из профиля в клиенте Dota 2 или ссылка на твой профиль на Dotabuff, OpenDota или Steam."
              />
            </motion.div>
          )}

          {state.status === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="panel flex items-center justify-center gap-3 p-10 text-ink-muted"
              role="status"
            >
              <Loader2 size={22} aria-hidden="true" className="animate-spin text-gold motion-reduce:animate-none" />
              Загружаю матчи игрока {state.accountId} с OpenDota…
            </motion.div>
          )}

          {state.status === 'empty' && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <PlayerHeader accountId={state.accountId} player={state.player} onRefresh={refresh} />
              <EmptyState
                icon={<EyeOff size={28} aria-hidden="true" />}
                title="Матчи не видны"
                description="Скорее всего, статистика скрыта. В Dota 2: Настройки → Параметры → Социальные → включи «Открыть доступ к данным матчей» (Expose Public Match Data), сыграй матч и обнови страницу."
                action={
                  <Button variant="outline" onClick={refresh} icon={<RefreshCw size={16} aria-hidden="true" />}>
                    Обновить
                  </Button>
                }
              />
            </motion.div>
          )}

          {state.status === 'error' && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {(() => {
                const e = ERRORS[state.kind];
                const Icon = e.icon;
                return (
                  <EmptyState
                    icon={<Icon size={28} aria-hidden="true" />}
                    title={e.title}
                    description={e.text}
                    action={
                      <Button variant="outline" onClick={refresh} icon={<RefreshCw size={16} aria-hidden="true" />}>
                        Попробовать снова
                      </Button>
                    }
                  />
                );
              })()}
            </motion.div>
          )}

          {ready && (
            <motion.div
              key={`ready-${ready.accountId}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="space-y-10"
            >
              <PlayerHeader accountId={ready.accountId} player={ready.player} onRefresh={refresh} />
              <SummaryStats summary={ready.summary} />
              <AdviceList advice={advice} confirmedSteps={steps} />
              <HeroBreakdown heroes={ready.heroes} />
              <MatchTable matches={ready.matches} />
              <p className="text-xs text-ink-faint">
                Данные: OpenDota (opendota.com). Новые матчи появляются там через несколько минут после игры.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
