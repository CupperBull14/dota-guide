import { useRef, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { PickQuestion } from '@/data/pick';
import { cn } from '@/lib/cn';
import { fadeUp, stagger } from '@/lib/motion';

interface QuizQuestionProps {
  question: PickQuestion;
  index: number;
  total: number;
  selected: number | undefined;
  onSelect: (option: number) => void;
}

/**
 * Вопрос с вариантами-карточками. Группа ведёт себя как radiogroup:
 * стрелки переключают вариант, Enter/Space — выбрать.
 */
export function QuizQuestion({ question, index, total, selected, onSelect }: QuizQuestionProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const n = question.options.length;
  const focusIndex = selected ?? 0;

  const onKeyDown = (e: KeyboardEvent, i: number) => {
    const next = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? i - 1 : null;
    if (next === null) return;
    e.preventDefault();
    refs.current[(next + n) % n]?.focus();
  };

  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blood-light">
        Вопрос {index + 1} из {total}
      </p>
      <h2 id={`q-${question.id}`} className="text-2xl font-bold sm:text-3xl">
        {question.title}
      </h2>
      <motion.div
        role="radiogroup"
        aria-labelledby={`q-${question.id}`}
        className={cn('mt-6 grid gap-3', n === 4 ? 'sm:grid-cols-2' : 'sm:grid-cols-3')}
        variants={stagger(0.06)}
        initial="hidden"
        animate="visible"
      >
        {question.options.map((option, i) => {
          const active = selected === i;
          const Icon = option.icon;
          return (
            <motion.button
              key={option.label}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={i === focusIndex ? 0 : -1}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                'relative flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-[border-color,box-shadow,background-color]',
                active
                  ? 'border-gold bg-gold/10 shadow-glow-gold'
                  : 'border-line bg-panel hover:border-gold/50',
              )}
            >
              <span
                className={cn(
                  'grid h-12 w-12 place-items-center rounded-xl border',
                  active ? 'border-gold bg-gold-sheen text-bg' : 'border-gold/40 bg-gold/10 text-gold',
                )}
              >
                <Icon size={24} aria-hidden="true" />
              </span>
              <span>
                <span className="block font-bold text-ink">{option.label}</span>
                <span className="mt-1 block text-sm text-ink-muted">{option.hint}</span>
              </span>
              {active && (
                <span className="absolute right-4 top-4 text-gold" aria-hidden="true">
                  <Check size={18} />
                </span>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
