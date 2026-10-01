import { useCallback, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Flag, RotateCcw, Trophy } from 'lucide-react';
import { ROADMAP } from '@/data/beginners';
import { cn } from '@/lib/cn';
import { fadeUp, stagger } from '@/lib/motion';
import { EMPTY_ROADMAP, getRoadmapSnapshot, subscribeRoadmap, writeRoadmap } from '@/lib/roadmapStore';

const getSnapshot = getRoadmapSnapshot;
const subscribe = subscribeRoadmap;
const write = writeRoadmap;
const EMPTY = EMPTY_ROADMAP;

/** Роадмап «первые 10 матчей» с отметками прогресса (сохраняются в браузере). */
export function Roadmap() {
  const done = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  const toggle = useCallback((id: string) => {
    const cur = getSnapshot();
    write(cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);
  }, []);
  const progress = Math.round((done.length / ROADMAP.length) * 100);

  return (
    <div>
      <div className="panel mb-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-gold/40 bg-gold/10 text-gold">
          {progress === 100 ? <Trophy size={24} aria-hidden="true" /> : <Flag size={24} aria-hidden="true" />}
        </span>
        <div className="flex-1">
          <p className="font-bold">
            {progress === 100 ? 'Все 10 шагов пройдены — отличная работа!' : `Пройдено ${done.length} из ${ROADMAP.length}`}
          </p>
          <div
            className="mt-2 h-2.5 overflow-hidden rounded-full bg-panel-raised"
            role="progressbar"
            aria-label="Прогресс роадмапа"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <motion.div
              className="h-full rounded-full bg-gold-sheen"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
        </div>
        {done.length > 0 && (
          <button
            type="button"
            onClick={() => write([])}
            className="inline-flex items-center gap-1.5 self-start rounded-lg px-3 py-1.5 text-sm font-bold text-ink-muted hover:bg-panel-raised hover:text-ink sm:self-center"
          >
            <RotateCcw size={14} aria-hidden="true" />
            Сбросить
          </button>
        )}
      </div>

      <motion.ol
        className="relative space-y-4 before:absolute before:bottom-4 before:left-[1.4rem] before:top-4 before:w-px before:bg-gradient-to-b before:from-gold/60 before:via-gold/20 before:to-transparent"
        variants={stagger(0.06)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {ROADMAP.map((step, i) => {
          const isDone = done.includes(step.id);
          return (
            <motion.li key={step.id} variants={fadeUp} className="relative flex gap-4">
              <button
                type="button"
                onClick={() => toggle(step.id)}
                aria-pressed={isDone}
                aria-label={`${step.match}: ${step.title} — ${isDone ? 'отметить как не пройденный' : 'отметить как пройденный'}`}
                className={cn(
                  'relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 font-display font-bold transition-colors',
                  isDone
                    ? 'border-gold bg-gold-sheen text-bg shadow-glow-gold'
                    : 'border-gold/50 bg-bg-deep text-gold-light hover:border-gold',
                )}
              >
                {isDone ? <Check size={20} aria-hidden="true" /> : i + 1}
              </button>
              <div className={cn('panel flex-1 p-5 transition-opacity', isDone && 'opacity-70')}>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blood-light">{step.match}</p>
                <h3 className="mt-1 font-sans text-lg font-bold tracking-normal">{step.title}</h3>
                <p className="mt-1 text-sm font-semibold text-gold-light">Цель: {step.goal}</p>
                <ul className="mt-3 space-y-1.5 text-sm text-ink-muted">
                  {step.actions.map((a) => (
                    <li key={a} className="flex gap-2">
                      <Check size={14} aria-hidden="true" className="mt-1 shrink-0 text-gold/70" />
                      {a}
                    </li>
                  ))}
                </ul>
                {step.link && (
                  <Link
                    to={step.link.to}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-gold-light hover:text-gold"
                  >
                    {step.link.label}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </motion.li>
          );
        })}
      </motion.ol>
    </div>
  );
}
