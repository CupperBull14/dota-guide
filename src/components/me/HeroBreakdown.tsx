import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3 } from 'lucide-react';
import type { HeroBenchmark } from '@/lib/analysis';
import { ATTRIBUTES } from '@/data/constants';
import { fadeUp, stagger } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { HeroAvatar } from '@/components/heroes/HeroAvatar';
import { Badge } from '@/components/ui/Badge';
import { BENCHMARKED_HEROES } from '@/hooks/usePlayerAnalysis';
import { matchHero } from './heroLookup';

/** Сколько героев показываем в разборе. */
const SHOWN = 6;

function tone(p: number) {
  if (p >= 70) return { bar: 'bg-[#56c271]', text: 'text-[#8fdca3]', word: 'сильно' };
  if (p < 30) return { bar: 'bg-[#e5484d]', text: 'text-[#f0a193]', word: 'слабо' };
  return { bar: 'bg-gold', text: 'text-gold-light', word: 'средне' };
}

function PercentileBar({ label, value, detail }: { label: string; value: number | null; detail: string }) {
  if (value === null) return null;
  const t = tone(value);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="text-ink-muted">{label}</span>
        <span className={cn('font-bold tabular-nums', t.text)}>
          лучше {value}% <span className="sr-only">игроков на этом герое ({t.word})</span>
        </span>
      </div>
      <div
        className="mt-1 h-2 overflow-hidden rounded-full bg-panel-raised"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
      >
        <motion.div
          className={cn('h-full rounded-full', t.bar)}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(3, value)}%` }}
          transition={{ type: 'spring', stiffness: 90, damping: 20 }}
        />
      </div>
      <p className="mt-0.5 text-xs text-ink-faint">{detail}</p>
    </div>
  );
}

/** Герои игрока: матчи, победы и место среди всех игроков на этом герое (бенчмарки OpenDota). */
export const HeroBreakdown = memo(function HeroBreakdown({ heroes }: { heroes: HeroBenchmark[] }) {
  if (!heroes.length) return null;
  return (
    <section aria-labelledby="heroes-title">
      <h2 id="heroes-title" className="mb-1 flex items-center gap-2 font-sans text-xl font-bold tracking-normal">
        <BarChart3 size={20} aria-hidden="true" className="text-gold" />
        Твои герои
      </h2>
      <p className="mb-4 text-sm text-ink-faint">
        Проценты — место среди всех игроков на этом герое по данным OpenDota: «лучше 60%» значит, что 60% игроков
        показывают результат ниже твоего. Турбо не учитывается.
      </p>
      <motion.ul
        variants={stagger(0.06)}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        {heroes.slice(0, SHOWN).map((h) => {
          const hero = matchHero(h.usage.heroId);
          const color = ATTRIBUTES[hero.attribute].color;
          const winRate = Math.round((h.usage.wins / h.usage.games) * 100);
          const hasBench = h.lastHits !== null || h.survival !== null || h.damage !== null;
          return (
            <motion.li
              key={h.usage.heroId}
              variants={fadeUp}
              whileHover={{ y: -4, boxShadow: `0 12px 32px -12px ${color}99` }}
              className="panel flex flex-col gap-4 p-5"
            >
              <div className="flex items-center gap-3">
                <HeroAvatar hero={hero} size="md" />
                <div className="min-w-0">
                  <h3 className="truncate font-sans text-lg font-bold tracking-normal">{hero.name}</h3>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    <Badge tone="neutral">
                      {h.usage.games} {plural(h.usage.games, 'матч', 'матча', 'матчей')}
                    </Badge>
                    <Badge tone={winRate >= 50 ? 'gold' : 'blood'}>{winRate}% побед</Badge>
                    <Badge tone="neutral">{h.usage.core ? 'Кор' : 'Саппорт'}</Badge>
                  </div>
                </div>
              </div>
              {hasBench ? (
                <div className="space-y-3">
                  {h.usage.core && (
                    <PercentileBar
                      label="Добивания"
                      value={h.lastHits}
                      detail={`${h.usage.lhPerMin.toFixed(1).replace('.', ',')} в минуту`}
                    />
                  )}
                  <PercentileBar label="Золото" value={h.gpm} detail={`${Math.round(h.usage.gpm)} в минуту`} />
                  <PercentileBar
                    label="Урон по героям"
                    value={h.damage}
                    detail={`${Math.round(h.usage.damagePerMin)} в минуту`}
                  />
                  <PercentileBar
                    label="Выживаемость"
                    value={h.survival}
                    detail={`${(h.usage.deathsPerMin * 10).toFixed(1).replace('.', ',')} смертей за 10 минут`}
                  />
                </div>
              ) : (
                <p className="text-sm text-ink-faint">
                  Сравнение с другими игроками есть только для {BENCHMARKED_HEROES} самых частых героев в выборке.
                </p>
              )}
              {hero.guide && hero.slug && (
                <Link
                  to={`/heroes/${hero.slug}`}
                  className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold text-gold-light hover:text-gold"
                >
                  Гайд по герою
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              )}
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
});

export function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}
