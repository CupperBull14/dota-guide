import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftRight, Check, GitCompareArrows, HeartHandshake, Link2, ShieldAlert, Unlink } from 'lucide-react';
import { HEROES, getHeroById } from '@/data/heroes';
import { HERO_DETAILS } from '@/data/live';
import { ATTRIBUTES } from '@/data/constants';
import { buildStatRows, matchup, parseCompare } from '@/lib/compare';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { HeroPicker } from '@/components/heroes/HeroPicker';
import { CompareHeroCard } from '@/components/compare/CompareHeroCard';
import { StatComparison } from '@/components/compare/StatComparison';
import { AbilityColumn } from '@/components/compare/AbilityColumn';

const IDS = HEROES.map((h) => h.id);
const SORTED = [...HEROES].sort((a, b) => a.name.localeCompare(b.name, 'ru'));

/** /compare?a=sven&b=axe — два героя рядом. */
export default function ComparePage() {
  const [params, setParams] = useSearchParams();
  const { a, b } = parseCompare(params, IDS, ['sven', 'juggernaut']);
  const heroA = getHeroById(a)!;
  const heroB = getHeroById(b)!;
  useDocumentTitle(`Сравнение: ${heroA.name} и ${heroB.name}`);
  const [copied, setCopied] = useState(false);

  const set = (next: { a?: string; b?: string }) => {
    setParams({ a: next.a ?? a, b: next.b ?? b }, { replace: true, preventScrollReset: true });
  };

  const rows = useMemo(() => buildStatRows(HERO_DETAILS[a], HERO_DETAILS[b]), [a, b]);
  const m = useMemo(() => matchup(heroA, heroB), [heroA, heroB]);
  const colorA = ATTRIBUTES[heroA.attribute].color;
  const colorB = ATTRIBUTES[heroB.attribute].color;

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
            <GitCompareArrows size={34} aria-hidden="true" className="shrink-0 text-gold" />
            Сравнение героев
          </span>
        }
        description="Выбери двух героев — увидишь характеристики, способности, предметы и кто кого контрит."
        action={
          <Button variant="outline" onClick={share} icon={copied ? <Check size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}>
            {copied ? 'Ссылка скопирована' : 'Поделиться'}
          </Button>
        }
      />

      {/* Выбор героев */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
        <HeroPicker heroes={SORTED} value={a} onChange={(id) => set({ a: id })} label="Первый герой" />
        <div className="flex flex-col items-center gap-2">
          <motion.span
            key={`${a}-${b}`}
            initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className="grid h-12 w-12 place-items-center rounded-full border-2 border-gold/60 bg-bg-deep font-display text-sm font-extrabold text-gold-light shadow-glow-gold"
            aria-hidden="true"
          >
            VS
          </motion.span>
          <button
            type="button"
            onClick={() => set({ a: b, b: a })}
            aria-label="Поменять героев местами"
            title="Поменять местами"
            className="grid h-9 w-9 place-items-center rounded-full border border-line-strong text-ink-muted transition-colors hover:border-gold/60 hover:text-gold-light"
          >
            <ArrowLeftRight size={16} aria-hidden="true" />
          </button>
        </div>
        <HeroPicker heroes={SORTED} value={b} onChange={(id) => set({ b: id })} label="Второй герой" />
      </div>

      {a === b && (
        <p className="mt-4 text-center text-sm text-ink-muted" role="status">
          Выбран один и тот же герой — выбери другого справа, чтобы сравнить.
        </p>
      )}

      {/* Карточки */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${a}-${b}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-8 grid grid-cols-2 gap-3 sm:gap-6"
        >
          <CompareHeroCard hero={heroA} other={heroB} align="left" />
          <CompareHeroCard hero={heroB} other={heroA} align="right" />
        </motion.div>
      </AnimatePresence>

      {/* Отношения героев */}
      {a !== b && (
        <Reveal className="mt-8">
          <section aria-labelledby="matchup-title" className="panel p-5">
            <h2 id="matchup-title" className="mb-3 font-sans text-lg font-bold tracking-normal">
              Как они связаны
            </h2>
            {!m.aCountersB && !m.bCountersA && !m.synergy ? (
              <p className="flex items-center gap-2 text-sm text-ink-muted">
                <Unlink size={16} aria-hidden="true" className="text-ink-faint" />
                По нашим гайдам эти герои напрямую не контрят друг друга и не отмечены как связка.
              </p>
            ) : (
              <ul className="space-y-3 text-sm">
                {m.bCountersA && (
                  <li className="flex gap-2.5">
                    <ShieldAlert size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-blood-light" />
                    <span>
                      <b className="text-ink">{heroB.name} контрит {heroA.name}:</b>{' '}
                      <span className="text-ink-muted">{m.bCountersA.why}</span>
                    </span>
                  </li>
                )}
                {m.aCountersB && (
                  <li className="flex gap-2.5">
                    <ShieldAlert size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-blood-light" />
                    <span>
                      <b className="text-ink">{heroA.name} контрит {heroB.name}:</b>{' '}
                      <span className="text-ink-muted">{m.aCountersB.why}</span>
                    </span>
                  </li>
                )}
                {m.synergy && (
                  <li className="flex gap-2.5">
                    <HeartHandshake size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-attr-agi" />
                    <span>
                      <b className="text-ink">Сильны вместе:</b> <span className="text-ink-muted">{m.synergy.why}</span>
                    </span>
                  </li>
                )}
              </ul>
            )}
          </section>
        </Reveal>
      )}

      {/* Характеристики */}
      <section aria-labelledby="stats-title" className="mt-10">
        <h2 id="stats-title" className="mb-4 text-2xl font-bold">
          Характеристики
        </h2>
        <StatComparison rows={rows} colorA={colorA} colorB={colorB} nameA={heroA.name} nameB={heroB.name} />
      </section>

      {/* Способности и предметы */}
      <section aria-labelledby="abilities-title" className="mt-10">
        <h2 id="abilities-title" className="mb-4 text-2xl font-bold">
          Способности и предметы
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-6">
          <AbilityColumn hero={heroA} />
          <AbilityColumn hero={heroB} />
        </div>
      </section>
    </div>
  );
}
