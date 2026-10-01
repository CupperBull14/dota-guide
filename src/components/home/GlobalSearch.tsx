import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { HEROES } from '@/data/heroes';
import { ATTRIBUTES } from '@/data/constants';
import { searchHeroes } from '@/lib/search';
import { HeroAvatar } from '@/components/heroes/HeroAvatar';
import { AttributeIcon } from '@/components/ui/AttributeIcon';
import { cn } from '@/lib/cn';

const LIMIT = 6;

/**
 * Глобальный поиск по героям — combobox по паттерну WAI-ARIA:
 * ↑/↓ — выбор, Enter — переход, Esc — закрыть/очистить.
 */
export function GlobalSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const results = useMemo(() => searchHeroes(HEROES, query, LIMIT), [query]);
  const showList = open && query.trim().length > 0;

  const go = (heroId: string) => {
    setOpen(false);
    setQuery('');
    navigate(`/heroes/${heroId}`);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (results.length ? (i + 1) % results.length : -1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (results.length ? (i <= 0 ? results.length - 1 : i - 1) : -1));
    } else if (e.key === 'Enter') {
      const hero = results[active] ?? results[0];
      if (hero) {
        e.preventDefault();
        go(hero.id);
      }
    } else if (e.key === 'Escape') {
      if (showList) setOpen(false);
      else setQuery('');
    }
  };

  return (
    <div className="relative w-full max-w-xl">
      <label htmlFor={`${listId}-input`} className="sr-only">
        Поиск героя
      </label>
      <div className="group relative">
        <Search
          size={20}
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint transition-colors group-focus-within:text-gold"
        />
        <input
          ref={inputRef}
          id={`${listId}-input`}
          type="text"
          role="combobox"
          autoComplete="off"
          spellCheck={false}
          aria-autocomplete="list"
          aria-expanded={showList}
          aria-controls={listId}
          aria-activedescendant={showList && active >= 0 ? `${listId}-opt-${active}` : undefined}
          placeholder="Найти героя: Свен, Sniper, Zeus…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
          className="h-14 w-full rounded-2xl border border-line-strong bg-bg-deep/80 pl-12 pr-12 text-base text-ink shadow-panel outline-none backdrop-blur transition-[border-color,box-shadow] placeholder:text-ink-faint focus:border-gold/60 focus:shadow-glow-gold focus-visible:outline-none"
        />
        {query && (
          <button
            type="button"
            aria-label="Очистить поиск"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-ink-faint hover:bg-panel-raised hover:text-ink"
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showList && (
          <motion.ul
            id={listId}
            role="listbox"
            aria-label="Результаты поиска"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-line-strong bg-panel/95 p-1.5 shadow-panel backdrop-blur-lg"
          >
            {results.length === 0 ? (
              <li role="option" aria-selected={false} aria-disabled="true" className="px-4 py-3 text-sm text-ink-muted">
                Ничего не нашлось по запросу «{query.trim()}»
              </li>
            ) : (
              results.map((hero, i) => (
                <li
                  key={hero.id}
                  id={`${listId}-opt-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => go(hero.id)}
                  onMouseEnter={() => setActive(i)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors',
                    i === active ? 'bg-gold/10' : 'hover:bg-panel-raised',
                  )}
                >
                  <HeroAvatar hero={hero} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold text-ink">{hero.name}</span>
                    <span className="block truncate text-xs text-ink-faint">{hero.nameEn}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color: ATTRIBUTES[hero.attribute].color }}>
                    <AttributeIcon attribute={hero.attribute} size={16} />
                    <span className="hidden sm:inline">{ATTRIBUTES[hero.attribute].label}</span>
                  </span>
                </li>
              ))
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
