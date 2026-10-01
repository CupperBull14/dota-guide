import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { TalentRow } from '@/types/hero';
import { cn } from '@/lib/cn';
import { fadeUp, stagger } from '@/lib/motion';

function Option({ text, picked, side }: { text: string; picked: boolean; side: 'left' | 'right' }) {
  return (
    <div
      className={cn(
        'relative flex min-h-16 items-center rounded-xl border px-4 py-3 text-sm leading-snug transition-colors',
        side === 'left' ? 'justify-end text-right' : 'justify-start text-left',
        picked
          ? 'border-gold/70 bg-gold/10 font-bold text-ink shadow-glow-gold'
          : 'border-line bg-panel text-ink-muted',
      )}
    >
      {picked && (
        <span
          className={cn(
            'absolute -top-2.5 inline-flex items-center gap-1 rounded-full bg-gold-sheen px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-bg',
            side === 'left' ? 'right-3' : 'left-3',
          )}
        >
          <Star size={10} className="fill-current" aria-hidden="true" />
          Берём
        </span>
      )}
      <span>{text}</span>
      {picked && <span className="sr-only"> — рекомендуемый талант</span>}
    </div>
  );
}

/** Дерево талантов как в игре: 25 сверху, 10 снизу; рекомендованная ветка подсвечена. */
export function TalentTree({ talents }: { talents: TalentRow[] }) {
  const rows = [...talents].sort((a, b) => b.level - a.level);
  return (
    <motion.ol
      className="space-y-4"
      variants={stagger(0.08)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      {rows.map((row) => (
        <motion.li key={row.level} variants={fadeUp}>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
            <Option text={row.left} picked={row.pick === 'left'} side="left" />
            <span
              className="grid h-12 w-12 place-items-center rounded-full border-2 border-gold/60 bg-bg-deep font-display text-lg font-bold text-gold-light"
              aria-label={`Уровень ${row.level}`}
            >
              {row.level}
            </span>
            <Option text={row.right} picked={row.pick === 'right'} side="right" />
          </div>
          <p className="mx-auto mt-2 max-w-2xl text-center text-xs leading-relaxed text-ink-faint sm:text-sm">
            {row.changedIn && (
              <span className="mr-2 inline-flex rounded-full border border-blood/50 bg-blood/15 px-2 py-0.5 text-[11px] font-bold text-[#f0a193]">
                Изменено в {row.changedIn} — рекомендация может устареть
              </span>
            )}
            {row.why}
          </p>
        </motion.li>
      ))}
    </motion.ol>
  );
}
