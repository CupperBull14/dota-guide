import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
import type { Attribute } from '@/types/hero';
import { normalize } from '@/lib/search';
import { HeroAvatar } from './HeroAvatar';
import { AttributeIcon } from '@/components/ui/AttributeIcon';
import { cn } from '@/lib/cn';

export interface PickerHero {
  id: string;
  name: string;
  nameEn: string;
  attribute: Attribute;
  imageUrl?: string;
}

interface HeroPickerProps {
  heroes: readonly PickerHero[];
  value: string | null;
  onChange: (id: string) => void;
  label: string;
  placeholder?: string;
  /** Скрыть уже выбранных где-то ещё героев. */
  exclude?: readonly string[];
  className?: string;
}

/**
 * Выбор героя: кнопка с портретом, по нажатию — поиск и список.
 * Клавиатура: ↑/↓ — по списку, Enter — выбрать, Esc — закрыть.
 * Используется в сравнении, помощнике «против кого» и разборе матчей.
 */
export function HeroPicker({
  heroes,
  value,
  onChange,
  label,
  placeholder = 'Выбери героя',
  exclude = [],
  className,
}: HeroPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selected = heroes.find((h) => h.id === value);

  const options = useMemo(() => {
    const q = normalize(query);
    return heroes
      .filter((h) => !exclude.includes(h.id) || h.id === value)
      .filter((h) => !q || normalize(h.name).includes(q) || normalize(h.nameEn).includes(q))
      .slice(0, 50);
  }, [heroes, query, exclude, value]);

  const close = (focusButton = true) => {
    setOpen(false);
    setQuery('');
    if (focusButton) buttonRef.current?.focus();
  };

  const choose = (heroId: string) => {
    onChange(heroId);
    close();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const hero = options[active];
      if (hero) choose(hero.id);
    } else if (e.key === 'Escape') {
      close();
    }
  };

  return (
    <div className={cn('relative', className)}>
      <span id={`${id}-label`} className="sr-only">
        {label}
      </span>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label ${id}-value`}
        onClick={() => {
          setOpen((v) => !v);
          setActive(0);
          window.setTimeout(() => inputRef.current?.focus(), 30);
        }}
        className="flex w-full items-center gap-3 rounded-2xl border border-line-strong bg-panel p-3 text-left transition-[border-color,box-shadow] hover:border-gold/50 focus-visible:shadow-glow-gold"
      >
        {selected ? (
          <HeroAvatar hero={selected} size="sm" />
        ) : (
          <span className="grid h-10 w-10 place-items-center rounded-lg border border-dashed border-line-strong text-ink-faint">
            ?
          </span>
        )}
        <span id={`${id}-value`} className="min-w-0 flex-1">
          <span className="block truncate font-bold text-ink">{selected ? selected.name : placeholder}</span>
          {selected && <span className="block truncate text-xs text-ink-faint">{selected.nameEn}</span>}
        </span>
        <ChevronDown size={18} aria-hidden="true" className="shrink-0 text-gold" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="absolute inset-x-0 top-full z-40 mt-2 rounded-2xl border border-line-strong bg-panel/95 p-2 shadow-panel backdrop-blur-lg"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) close(false);
            }}
          >
            <div className="relative mb-2">
              <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-label={`Поиск: ${label}`}
                aria-expanded="true"
                aria-controls={`${id}-list`}
                aria-activedescendant={options[active] ? `${id}-opt-${options[active].id}` : undefined}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Поиск по имени…"
                autoComplete="off"
                className="h-10 w-full rounded-xl border border-line bg-bg-deep/70 pl-9 pr-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-gold/60 focus-visible:outline-none"
              />
            </div>
            <ul id={`${id}-list`} role="listbox" aria-label={label} className="max-h-72 overflow-y-auto">
              {options.length === 0 && (
                <li className="px-3 py-2 text-sm text-ink-muted" role="option" aria-selected={false} aria-disabled="true">
                  Никого не нашлось
                </li>
              )}
              {options.map((hero, i) => (
                <li
                  key={hero.id}
                  id={`${id}-opt-${hero.id}`}
                  role="option"
                  aria-selected={hero.id === value}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(hero.id)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2',
                    i === active ? 'bg-gold/10' : 'hover:bg-panel-raised',
                  )}
                >
                  <HeroAvatar hero={hero} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-ink">{hero.name}</span>
                    <span className="block truncate text-xs text-ink-faint">{hero.nameEn}</span>
                  </span>
                  <AttributeIcon attribute={hero.attribute} size={16} />
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
