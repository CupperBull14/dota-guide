import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Wrench } from 'lucide-react';
import { TOOL_LINKS } from '@/data/constants';
import { NAV_ICONS } from '@/lib/icons';
import { cn } from '@/lib/cn';

/**
 * Выпадающее меню «Инструменты»: клик или Enter открывает, ↑/↓ — по пунктам,
 * Esc и клик снаружи — закрывают с возвратом фокуса на кнопку.
 */
export function ToolsMenu() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLAnchorElement | null>>([]);
  const active = TOOL_LINKS.some((t) => pathname.startsWith(t.to));

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const focusItem = (i: number) => {
    const n = TOOL_LINKS.length;
    itemsRef.current[((i % n) + n) % n]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const current = itemsRef.current.findIndex((el) => el === document.activeElement);
    if (e.key === 'Escape') {
      setOpen(false);
      buttonRef.current?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) setOpen(true);
      window.requestAnimationFrame(() => focusItem(current + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusItem(current - 1);
    }
  };

  return (
    <div ref={rootRef} className="relative" onKeyDown={onKeyDown}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-bold transition-colors',
          active || open ? 'text-gold-light' : 'text-ink-muted hover:text-ink',
        )}
      >
        <Wrench size={16} aria-hidden="true" className={active ? 'text-gold' : 'opacity-70'} />
        Инструменты
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="inline-flex" aria-hidden="true">
          <ChevronDown size={14} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-line-strong bg-panel/95 p-2 shadow-panel backdrop-blur-lg"
          >
            <ul>
              {TOOL_LINKS.map((tool, i) => {
                const Icon = NAV_ICONS[tool.to];
                const current = pathname.startsWith(tool.to);
                return (
                  <li key={tool.to}>
                    <Link
                      ref={(el) => {
                        itemsRef.current[i] = el;
                      }}
                      to={tool.to}
                      aria-current={current ? 'page' : undefined}
                      className={cn(
                        'flex gap-3 rounded-xl p-3 transition-colors',
                        current ? 'bg-gold/10' : 'hover:bg-panel-raised focus-visible:bg-panel-raised',
                      )}
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-gold/30 bg-gold/10 text-gold">
                        {Icon && <Icon size={18} aria-hidden="true" />}
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-ink">{tool.label}</span>
                        <span className="block text-xs text-ink-faint">{tool.hint}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
