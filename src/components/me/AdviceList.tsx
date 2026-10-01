import { memo, useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Flag, Info, Lightbulb, ThumbsUp, TrendingUp } from 'lucide-react';
import type { Advice } from '@/lib/analysis';
import { ROADMAP } from '@/data/beginners';
import { EMPTY_ROADMAP, getRoadmapSnapshot, markRoadmapSteps, subscribeRoadmap } from '@/lib/roadmapStore';
import { fadeUp, stagger } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';

const TONES = {
  improve: { icon: TrendingUp, ring: 'border-blood/50 bg-blood/15 text-[#f0a193]', label: 'Над чем поработать' },
  good: { icon: ThumbsUp, ring: 'border-[#56c271]/50 bg-[#56c271]/15 text-[#8fdca3]', label: 'Сильная сторона' },
  info: { icon: Info, ring: 'border-line-strong bg-panel-raised text-ink-muted', label: 'К сведению' },
} as const;

const STEP_TITLE = new Map(ROADMAP.map((s) => [s.id, `${s.match}: ${s.title}`]));

interface AdviceListProps {
  advice: Advice[];
  /** Шаги роадмапа, подтверждённые статистикой. */
  confirmedSteps: string[];
}

/** Советы по статистике + синхронизация с роадмапом «Первые 10 матчей» (только по кнопке). */
export const AdviceList = memo(function AdviceList({ advice, confirmedSteps }: AdviceListProps) {
  const done = useSyncExternalStore(subscribeRoadmap, getRoadmapSnapshot, () => EMPTY_ROADMAP);
  const pending = confirmedSteps.filter((id) => !done.includes(id));
  const [added, setAdded] = useState<number | null>(null);

  const sync = () => setAdded(markRoadmapSteps(pending));

  return (
    <section aria-labelledby="advice-title">
      <h2 id="advice-title" className="mb-4 flex items-center gap-2 font-sans text-xl font-bold tracking-normal">
        <Lightbulb size={20} aria-hidden="true" className="text-gold" />
        Советы по твоим матчам
      </h2>

      {advice.length ? (
        <motion.ul variants={stagger(0.06)} initial="hidden" animate="visible" className="grid gap-3 md:grid-cols-2">
          {advice.map((a) => {
            const t = TONES[a.tone];
            const Icon = t.icon;
            return (
              <motion.li key={a.kind} variants={fadeUp} className="panel flex gap-4 p-5">
                <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl border', t.ring)}>
                  <Icon size={20} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-faint">{t.label}</p>
                  <h3 className="font-sans text-lg font-bold tracking-normal">{a.title}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{a.text}</p>
                  {a.link && (
                    <Link
                      to={a.link.to}
                      className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-gold-light hover:text-gold"
                    >
                      {a.link.label}
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      ) : (
        <p className="panel p-5 text-ink-muted">
          Явных слабых мест не видно: на твоих главных героях показатели в пределах обычного. Сыграй ещё несколько
          матчей — разбор станет точнее.
        </p>
      )}

      {confirmedSteps.length > 0 && (
        <div className="panel mt-4 flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-gold/40 bg-gold/10 text-gold">
            <Flag size={20} aria-hidden="true" />
          </span>
          <div className="flex-1">
            <p className="font-bold">Статистика подтверждает шаги роадмапа «Первые 10 матчей»</p>
            <p className="text-sm text-ink-muted">{confirmedSteps.map((id) => STEP_TITLE.get(id) ?? id).join(' · ')}</p>
          </div>
          <div aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {pending.length ? (
                <motion.div key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Button size="sm" variant="outline" onClick={sync} icon={<Check size={16} aria-hidden="true" />}>
                    Отметить пройденными ({pending.length})
                  </Button>
                </motion.div>
              ) : (
                <motion.p
                  key="done"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#8fdca3]"
                >
                  <Check size={16} aria-hidden="true" />
                  {added ? `Отмечено шагов: ${added}` : 'Уже отмечены'}
                  <Link to="/beginners#roadmap" className="ml-1 text-gold-light underline-offset-2 hover:underline">
                    Открыть роадмап
                  </Link>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </section>
  );
});
