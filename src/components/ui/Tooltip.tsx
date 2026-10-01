import { useId, useState, type ReactElement, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface TooltipProps {
  content: ReactNode;
  children: ReactElement;
  side?: 'top' | 'bottom';
  className?: string;
}

/**
 * Подсказка при наведении и при фокусе с клавиатуры (Esc — скрыть).
 * Триггер получает aria-describedby через обёртку.
 */
export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpen(false);
      }}
      aria-describedby={open ? id : undefined}
    >
      {children}
      <AnimatePresence>
        {open && (
          <span
            className={cn(
              'pointer-events-none absolute left-1/2 z-50 -translate-x-1/2',
              side === 'top' ? 'bottom-full pb-2' : 'top-full pt-2',
            )}
          >
            <motion.span
              id={id}
              role="tooltip"
              initial={{ opacity: 0, y: side === 'top' ? 6 : -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.16 }}
              className={cn(
                'block w-max max-w-[16rem] rounded-lg border border-gold/30 bg-bg-deep/95 px-3 py-2 text-xs font-medium leading-snug text-ink shadow-panel backdrop-blur',
                className,
              )}
            >
              {content}
            </motion.span>
          </span>
        )}
      </AnimatePresence>
    </span>
  );
}
