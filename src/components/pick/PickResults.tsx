import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, GitCompareArrows, Link2, RotateCcw, Trophy } from 'lucide-react';
import { useState } from 'react';
import type { PickResult } from '@/lib/pick';
import { ATTRIBUTES } from '@/data/constants';
import { HeroPortrait } from '@/components/heroes/HeroPortrait';
import { HeroAvatar } from '@/components/heroes/HeroAvatar';
import { AttributeBadge } from '@/components/ui/MetaBadges';
import { ComplexityStars } from '@/components/ui/ComplexityStars';
import { Button, ButtonLink } from '@/components/ui/Button';
import { fadeUp, stagger } from '@/lib/motion';
import { MatchRing } from './MatchRing';
import { cn } from '@/lib/cn';

interface PickResultsProps {
  results: PickResult[];
  onRestart: () => void;
}

/** Итог подбора: три лучших героя с причинами, ещё трое — списком. */
export function PickResults({ results, onRestart }: PickResultsProps) {
  const [copied, setCopied] = useState(false);
  const top = results.slice(0, 3);
  const more = results.slice(3, 6);
  const [first, second] = top;

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
    <div>
      <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold sm:text-3xl">
        <Trophy size={28} aria-hidden="true" className="text-gold" />
        Твои герои
      </h2>

      <motion.ol className="grid gap-5 lg:grid-cols-3" variants={stagger(0.12)} initial="hidden" animate="visible">
        {top.map(({ hero, match, reasons }, i) => {
          const color = ATTRIBUTES[hero.attribute].color;
          return (
            <motion.li
              key={hero.id}
              variants={fadeUp}
              className={cn('panel relative overflow-hidden', i === 0 && 'border-gold/60 shadow-glow-gold')}
            >
              {i === 0 && (
                <span className="absolute left-3 top-3 z-10 rounded-full bg-gold-sheen px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-bg">
                  Лучший выбор
                </span>
              )}
              <div className="relative">
                <HeroPortrait hero={hero} eager className="aspect-[16/9] w-full" />
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-panel to-transparent" />
              </div>
              <div className="relative -mt-10 p-5">
                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-sans text-xl font-extrabold tracking-normal">
                      <span className="sr-only">{i + 1}. </span>
                      {hero.name}
                    </h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <AttributeBadge attribute={hero.attribute} />
                      <ComplexityStars value={hero.complexity} size={12} />
                    </div>
                  </div>
                  <MatchRing value={match} color={color} />
                </div>
                <ul className="mt-4 space-y-1.5 text-sm">
                  {reasons.map((r) => (
                    <li key={r} className="flex gap-2 text-ink-muted">
                      <Check size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-gold" />
                      {r}
                    </li>
                  ))}
                </ul>
                <ButtonLink to={`/heroes/${hero.id}`} size="sm" className="mt-5" iconRight={<ArrowRight size={16} aria-hidden="true" />}>
                  Открыть гайд
                </ButtonLink>
              </div>
            </motion.li>
          );
        })}
      </motion.ol>

      {more.length > 0 && (
        <section aria-labelledby="pick-more" className="mt-8">
          <h3 id="pick-more" className="mb-3 font-sans text-xs font-bold uppercase tracking-[0.2em] text-gold">
            Ещё подходят
          </h3>
          <ul className="grid gap-3 sm:grid-cols-3">
            {more.map(({ hero, match }) => (
              <li key={hero.id}>
                <Link
                  to={`/heroes/${hero.id}`}
                  className="panel flex items-center gap-3 p-3 transition-colors hover:border-gold/50"
                >
                  <HeroAvatar hero={hero} size="sm" />
                  <span className="flex-1 font-bold">{hero.name}</span>
                  <span className="text-sm font-bold tabular-nums text-gold-light">{match}%</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Button variant="outline" icon={<RotateCcw size={16} aria-hidden="true" />} onClick={onRestart}>
          Пройти заново
        </Button>
        {first && second && (
          <ButtonLink
            to={`/compare?a=${first.hero.id}&b=${second.hero.id}`}
            variant="ghost"
            icon={<GitCompareArrows size={16} aria-hidden="true" />}
          >
            Сравнить первых двух
          </ButtonLink>
        )}
        <Button
          variant="ghost"
          onClick={share}
          icon={copied ? <Check size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}
        >
          {copied ? 'Ссылка скопирована' : 'Поделиться результатом'}
        </Button>
      </div>
    </div>
  );
}
