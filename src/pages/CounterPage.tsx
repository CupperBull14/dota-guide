import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Dices, Link2, ShieldHalf, Users, X } from 'lucide-react';
import { getHeroById } from '@/data/heroes';
import { ALL_HEROES, getIndexHeroBySlug } from '@/data/allHeroes';
import { analyzeCounter, MAX_ENEMIES, parseCounter } from '@/lib/counter';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { HeroPicker } from '@/components/heroes/HeroPicker';
import { EnemySlots } from '@/components/counter/EnemySlots';
import { CounterResults } from '@/components/counter/CounterResults';
import { heroName, useHeroOptions } from '@/components/counter/useHeroOptions';
import { EASE_OUT } from '@/lib/motion';

const known = (slug: string) => Boolean(getIndexHeroBySlug(slug));

/** /counter?me=sven&vs=riki,zeus — помощник против вражеской команды. */
export default function CounterPage() {
  useDocumentTitle('Против кого я играю');
  const options = useHeroOptions();
  const [params, setParams] = useSearchParams();
  const { me, vs } = parseCounter(params, known);
  const [copied, setCopied] = useState(false);

  const update = (next: { me?: string | null; vs?: string[] }) => {
    const nextMe = next.me === undefined ? me : next.me;
    const nextVs = (next.vs ?? vs).filter((s) => s !== nextMe);
    const p = new URLSearchParams();
    if (nextMe) p.set('me', nextMe);
    if (nextVs.length) p.set('vs', nextVs.join(','));
    setParams(p, { replace: true, preventScrollReset: true });
  };

  const meEntry = me ? getIndexHeroBySlug(me) : undefined;
  const enemies = vs.map((s) => getIndexHeroBySlug(s)).filter((e) => e !== undefined);
  const analysis = useMemo(
    () => (enemies.length ? analyzeCounter(meEntry, enemies, getHeroById) : null),
    [me, vs.join(',')],
  );

  const randomEnemies = () => {
    const pool = ALL_HEROES.filter((h) => h.slug !== me).map((h) => h.slug);
    const picked: string[] = [];
    while (picked.length < MAX_ENEMIES && pool.length) {
      const [s] = pool.splice(Math.floor(Math.random() * pool.length), 1);
      if (s) picked.push(s);
    }
    update({ vs: picked });
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="container-page py-10 sm:py-14">
      <SectionTitle
        as="h1"
        eyebrow="Инструменты"
        title={
          <span className="flex items-center gap-3">
            <ShieldHalf size={34} aria-hidden="true" className="shrink-0 text-gold" />
            Против кого я играю
          </span>
        }
        description="Выбери героев врага (и своего героя, если хочешь точнее) — подскажем, кто опаснее всего, что купить и на что смотреть в игре. Доступны все герои Dota 2."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <section aria-labelledby="me-title" className="panel p-5">
          <h2 id="me-title" className="mb-1 font-sans text-lg font-bold tracking-normal">
            Твой герой
          </h2>
          <p className="mb-3 text-sm text-ink-faint">Необязательно, но так советы точнее.</p>
          <HeroPicker
            heroes={options}
            value={me}
            exclude={vs}
            onChange={(id) => update({ me: id })}
            label="Твой герой"
            placeholder="Выбери своего героя"
          />
          {me && (
            <button
              type="button"
              onClick={() => update({ me: null })}
              className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-ink-muted hover:text-ink"
            >
              <X size={14} aria-hidden="true" />
              Без героя
            </button>
          )}
        </section>

        <section aria-labelledby="enemy-title" className="panel p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 id="enemy-title" className="flex items-center gap-2 font-sans text-lg font-bold tracking-normal">
              <Users size={18} aria-hidden="true" className="text-blood-light" />
              Герои врага{' '}
              <span className="text-sm font-semibold text-ink-faint">
                {vs.length}/{MAX_ENEMIES}
              </span>
            </h2>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={randomEnemies} icon={<Dices size={16} aria-hidden="true" />}>
                Случайные
              </Button>
              {vs.length > 0 && (
                <Button size="sm" variant="ghost" onClick={() => update({ vs: [] })} icon={<X size={16} aria-hidden="true" />}>
                  Очистить
                </Button>
              )}
            </div>
          </div>
          <EnemySlots options={options} value={vs} exclude={me ? [me] : []} onChange={(next) => update({ vs: next })} />
        </section>
      </div>

      <div className="mt-10" aria-live="polite">
        <AnimatePresence mode="wait">
          {analysis ? (
            <motion.div
              key={`${me}-${vs.join(',')}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <CounterResults
                analysis={analysis}
                hasMe={Boolean(meEntry)}
                myName={meEntry ? heroName(meEntry.slug, meEntry.name) : undefined}
              />
              <div className="mt-8">
                <Button
                  variant="outline"
                  onClick={share}
                  icon={copied ? <Check size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}
                >
                  {copied ? 'Ссылка скопирована' : 'Поделиться разбором'}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EmptyState
                icon={<ShieldHalf size={28} aria-hidden="true" />}
                title="Добавь хотя бы одного врага"
                description="Начни с героя, который чаще всего тебе мешает, — или нажми «Случайные», чтобы посмотреть, как это работает."
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
