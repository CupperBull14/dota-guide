import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { EASE_OUT } from '@/lib/motion';

export interface TabItem<T extends string> {
  id: T;
  label: ReactNode;
  icon?: ReactNode;
}

interface TabsProps<T extends string> {
  tabs: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  label: string;
  /** Содержимое активной вкладки. */
  children: ReactNode;
  className?: string;
}

/**
 * Вкладки по паттерну WAI-ARIA: role="tablist", стрелки ←/→, Home/End,
 * roving tabindex, анимированный индикатор и смена панели.
 */
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
  children,
  className,
}: TabsProps<T>) {
  const baseId = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.id === value),
  );

  const select = (index: number) => {
    const tab = tabs[index];
    if (!tab) return;
    onChange(tab.id);
    refs.current[index]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = tabs.length - 1;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      select(activeIndex === last ? 0 : activeIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      select(activeIndex === 0 ? last : activeIndex - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      select(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      select(last);
    }
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        className="relative flex gap-1 overflow-x-auto rounded-2xl border border-line bg-panel p-1.5"
      >
        {tabs.map((tab, index) => {
          const selected = tab.id === value;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                refs.current[index] = el;
              }}
              role="tab"
              type="button"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(tab.id)}
              onKeyDown={onKeyDown}
              className={cn(
                'relative flex min-w-max flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors',
                selected ? 'text-bg' : 'text-ink-muted hover:text-ink',
              )}
            >
              {selected && (
                <motion.span
                  layoutId={`${baseId}-indicator`}
                  className="absolute inset-0 rounded-xl bg-gold-sheen shadow-glow-gold"
                  transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  aria-hidden="true"
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tab.icon}
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={value}
          role="tabpanel"
          id={`${baseId}-panel-${value}`}
          aria-labelledby={`${baseId}-tab-${value}`}
          tabIndex={0}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_OUT } }}
          exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
          className="mt-5 focus-visible:outline-offset-4"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
