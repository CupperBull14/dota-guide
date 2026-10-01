import { useId, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookA, Search } from 'lucide-react';
import { GLOSSARY, GLOSSARY_CATEGORIES, type GlossaryCategory } from '@/data/beginners';
import { GLOSSARY_ICONS } from '@/lib/icons';
import { normalize } from '@/lib/search';
import { FilterChip } from '@/components/heroes/FilterChip';
import { EmptyState } from '@/components/ui/EmptyState';

const CATEGORIES = Object.keys(GLOSSARY_CATEGORIES) as GlossaryCategory[];

/** Глоссарий: поиск по термину и определению, фильтр по категории, layout-анимация. */
export function Glossary() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<GlossaryCategory | null>(null);
  const inputId = useId();

  const terms = useMemo(() => {
    const q = normalize(query);
    return GLOSSARY.filter(
      (t) =>
        (!category || t.category === category) &&
        (!q || normalize(`${t.term} ${t.alt ?? ''} ${t.definition}`).includes(q)),
    ).sort((a, b) => a.term.localeCompare(b.term, 'ru'));
  }, [query, category]);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4">
        <div className="group relative max-w-md">
          <label htmlFor={inputId} className="sr-only">
            Поиск по глоссарию
          </label>
          <Search
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint group-focus-within:text-gold"
          />
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Например: ганк, стак, Аегис…"
            className="h-12 w-full rounded-xl border border-line-strong bg-bg-deep/70 pl-11 pr-4 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-faint focus:border-gold/60 focus:shadow-glow-gold focus-visible:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Категории терминов">
          <FilterChip active={category === null} onToggle={() => setCategory(null)}>
            Все
          </FilterChip>
          {CATEGORIES.map((c) => {
            const Icon = GLOSSARY_ICONS[c];
            return (
              <FilterChip key={c} active={category === c} onToggle={() => setCategory(category === c ? null : c)}>
                <Icon size={14} aria-hidden="true" />
                {GLOSSARY_CATEGORIES[c]}
              </FilterChip>
            );
          })}
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        Найдено терминов: {terms.length}
      </p>

      {terms.length === 0 ? (
        <EmptyState
          icon={<BookA size={28} aria-hidden="true" />}
          title="Такого термина нет"
          description="Попробуй другое слово или сбрось категорию."
        />
      ) : (
        <motion.dl layout className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {terms.map((t) => {
              const Icon = GLOSSARY_ICONS[t.category];
              return (
                <motion.div
                  key={t.term}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="panel p-4"
                >
                  <dt className="flex items-start justify-between gap-3">
                    <span>
                      <span className="block font-bold text-ink">{t.term}</span>
                      {t.alt && <span className="block text-xs font-semibold text-ink-faint">{t.alt}</span>}
                    </span>
                    <span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gold/10 text-gold"
                      title={GLOSSARY_CATEGORIES[t.category]}
                    >
                      <Icon size={16} aria-hidden="true" />
                      <span className="sr-only">{GLOSSARY_CATEGORIES[t.category]}</span>
                    </span>
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink-muted">{t.definition}</dd>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.dl>
      )}
    </div>
  );
}
