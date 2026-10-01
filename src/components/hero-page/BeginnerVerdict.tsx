import { Link } from 'react-router-dom';
import { ArrowRight, CircleAlert, GraduationCap } from 'lucide-react';
import type { Hero } from '@/types/hero';
import { COMPLEXITY } from '@/data/constants';
import { cn } from '@/lib/cn';

/** Вердикт «подходит ли новичку» с объяснением. */
export function BeginnerVerdict({ hero }: { hero: Hero }) {
  const ok = hero.goodForBeginners;
  const Icon = ok ? GraduationCap : CircleAlert;
  return (
    <div
      className={cn(
        'panel relative overflow-hidden p-5 sm:p-6',
        ok ? 'border-attr-agi/40' : 'border-gold/40',
      )}
    >
      <span
        aria-hidden="true"
        className={cn('absolute inset-y-0 left-0 w-1', ok ? 'bg-attr-agi' : 'bg-gold')}
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <span
          className={cn(
            'grid h-12 w-12 shrink-0 place-items-center rounded-xl border',
            ok ? 'border-attr-agi/50 bg-attr-agi/15 text-attr-agi' : 'border-gold/50 bg-gold/15 text-gold',
          )}
        >
          <Icon size={24} aria-hidden="true" />
        </span>
        <div className="flex-1">
          <p className="font-display text-xl font-bold">
            {ok ? 'Подходит новичку' : 'Лучше освоить позже'}
          </p>
          <p className="mt-1 text-sm font-semibold text-ink-faint">
            Сложность: {COMPLEXITY[hero.complexity].label.toLowerCase()} — {COMPLEXITY[hero.complexity].hint}
          </p>
          <p className="mt-3 leading-relaxed text-ink-muted">{hero.beginnerReason}</p>
          <Link
            to="/beginners"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-gold-light transition-colors hover:text-gold"
          >
            Основы игры для новичков
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
