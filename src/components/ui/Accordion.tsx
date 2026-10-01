import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import { EASE_OUT } from '@/lib/motion';

export interface AccordionItem {
  id: string;
  title: ReactNode;
  /** Подзаголовок/метка справа от заголовка. */
  meta?: ReactNode;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  /** Разрешить одновременно открывать несколько пунктов. */
  multiple?: boolean;
  defaultOpen?: string[];
  className?: string;
}

/**
 * Доступный аккордеон: кнопки с aria-expanded/aria-controls,
 * навигация стрелками ↑/↓, Home/End, плавная анимация высоты.
 */
export function Accordion({ items, multiple = false, defaultOpen = [], className }: AccordionProps) {
  const [open, setOpen] = useState<string[]>(defaultOpen);
  const baseId = useId();
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  const toggle = (id: string) =>
    setOpen((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : multiple ? [...prev, id] : [id],
    );

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = items.length - 1;
    const focus = (i: number) => buttons.current[i]?.focus();
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focus(index === last ? 0 : index + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        focus(index === 0 ? last : index - 1);
        break;
      case 'Home':
        e.preventDefault();
        focus(0);
        break;
      case 'End':
        e.preventDefault();
        focus(last);
        break;
    }
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {items.map((item, index) => {
        const isOpen = open.includes(item.id);
        const headerId = `${baseId}-h-${item.id}`;
        const panelId = `${baseId}-p-${item.id}`;
        return (
          <div
            key={item.id}
            className={cn(
              'panel overflow-hidden transition-colors duration-300',
              isOpen && 'border-gold/40',
            )}
          >
            <h3 className="font-sans text-base tracking-normal">
              <button
                ref={(el) => {
                  buttons.current[index] = el;
                }}
                id={headerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                onKeyDown={(e) => onKeyDown(e, index)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left font-bold text-ink transition-colors hover:bg-panel-raised"
              >
                <span className="flex-1">{item.title}</span>
                {item.meta && <span className="hidden sm:inline-flex">{item.meta}</span>}
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                  className="text-gold"
                  aria-hidden="true"
                >
                  <ChevronDown size={20} />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-line px-5 py-4 leading-relaxed text-ink-muted">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
