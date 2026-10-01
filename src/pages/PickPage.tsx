import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { HEROES } from '@/data/heroes';
import { getIndexHeroBySlug } from '@/data/allHeroes';
import { PICK_QUESTIONS } from '@/data/pick';
import { decodeAnswers, encodeAnswers, rankHeroes } from '@/lib/pick';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { QuizQuestion } from '@/components/pick/QuizQuestion';
import { PickResults } from '@/components/pick/PickResults';
import { EASE_OUT } from '@/lib/motion';

const attackOf = (id: string) => getIndexHeroBySlug(id)?.attack;

/** /pick — короткий опрос и подбор героев под стиль игры. Результат можно отправить ссылкой (?r=…). */
export default function PickPage() {
  useDocumentTitle('Подбери героя');
  const [params, setParams] = useSearchParams();
  const fromUrl = decodeAnswers(params.get('r'));
  const [answers, setAnswers] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const total = PICK_QUESTIONS.length;
  // Результат живёт только в адресе: так им можно поделиться, а «назад» в браузере вернёт к вопросам.
  const finished = fromUrl;

  const results = useMemo(
    () => (finished ? rankHeroes(HEROES, finished, (h) => attackOf(h.id)) : []),
    [finished],
  );

  const select = useCallback(
    (option: number) => {
      const next = [...answers.slice(0, step), option];
      setAnswers(next);
      // Короткая пауза, чтобы было видно выбор, затем следующий вопрос.
      window.setTimeout(() => {
        if (next.length === total) {
          setParams({ r: encodeAnswers(next) }, { replace: false, preventScrollReset: true });
        } else {
          setStep(step + 1);
        }
      }, 220);
    },
    [answers, step, total, setParams],
  );

  const restart = () => {
    setAnswers([]);
    setStep(0);
    setParams({}, { replace: false });
  };

  const progress = finished ? 100 : Math.round((step / total) * 100);
  const question = PICK_QUESTIONS[step];

  return (
    <div className="container-page py-10 sm:py-14">
      <SectionTitle
        as="h1"
        eyebrow="Инструменты"
        title={
          <span className="flex items-center gap-3">
            <Wand2 size={34} aria-hidden="true" className="shrink-0 text-gold" />
            Подбери героя
          </span>
        }
        description={`${total} коротких вопросов о том, как тебе нравится играть, — и мы подскажем героев из базы с полным гайдом.`}
      />

      <div
        className="mb-8 h-2 overflow-hidden rounded-full bg-panel-raised"
        role="progressbar"
        aria-label="Прогресс опроса"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <motion.div
          className="h-full rounded-full bg-gold-sheen"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 140, damping: 22 }}
        />
      </div>

      <AnimatePresence mode="wait">
        {finished ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } }}
          >
            <PickResults results={results} onRestart={restart} />
          </motion.div>
        ) : (
          question && (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE_OUT } }}
              exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
            >
              <QuizQuestion
                question={question}
                index={step}
                total={total}
                selected={answers[step]}
                onSelect={select}
              />
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="mt-6 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold text-ink-muted hover:bg-panel-raised hover:text-ink"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  Назад
                </button>
              )}
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
