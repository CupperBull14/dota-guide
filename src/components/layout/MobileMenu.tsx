import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { NAV_LINKS, TOOL_LINKS } from '@/data/constants';
import { NAV_ICONS } from '@/lib/icons';
import { cn } from '@/lib/cn';
import { EASE_OUT } from '@/lib/motion';
import { Logo } from './Logo';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  favoritesCount: number;
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Мобильное меню: модальная панель с фокус-ловушкой,
 * закрытием по Esc и клику на фон, блокировкой прокрутки страницы.
 */
export function MobileMenu({ open, onClose, favoritesCount }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const focusFirst = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    }, 50);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(focusFirst);
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            className="absolute inset-0 bg-bg-deep/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Меню навигации"
            initial={{ x: '100%' }}
            animate={{ x: 0, transition: { duration: 0.35, ease: EASE_OUT } }}
            exit={{ x: '100%', transition: { duration: 0.25 } }}
            className="absolute inset-y-0 right-0 flex w-[min(20rem,86vw)] flex-col overflow-y-auto border-l border-line bg-panel p-5 shadow-panel"
          >
            <div className="mb-8 flex items-center justify-between">
              <Logo onClick={onClose} />
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрыть меню"
                className="grid h-11 w-11 place-items-center rounded-xl border border-line text-ink hover:border-gold/50"
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Мобильная навигация">
              <motion.ul
                className="flex flex-col gap-1"
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
              >
                {NAV_LINKS.map((link) => (
                  <motion.li
                    key={link.to}
                    variants={{ hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0 } }}
                  >
                    <NavLink
                      to={link.to}
                      end={link.end}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center justify-between rounded-xl px-4 py-3.5 font-display text-lg font-bold transition-colors',
                          isActive
                            ? 'bg-gold/10 text-gold-light'
                            : 'text-ink-muted hover:bg-panel-raised hover:text-ink',
                        )
                      }
                    >
                      <span className="flex items-center gap-3">
                        {(() => {
                          const Icon = NAV_ICONS[link.to];
                          return Icon ? <Icon size={20} aria-hidden="true" className="text-gold" /> : null;
                        })()}
                        {link.label}
                      </span>
                      {link.to === '/favorites' && favoritesCount > 0 && (
                        <span className="grid h-6 min-w-6 place-items-center rounded-full bg-blood px-1.5 font-sans text-xs text-white">
                          {favoritesCount}
                        </span>
                      )}
                    </NavLink>
                  </motion.li>
                ))}
              </motion.ul>
              <p className="mb-2 mt-6 px-4 text-xs font-bold uppercase tracking-[0.2em] text-gold">Инструменты</p>
              <ul className="flex flex-col gap-1">
                {TOOL_LINKS.map((tool) => {
                  const Icon = NAV_ICONS[tool.to];
                  return (
                    <li key={tool.to}>
                      <NavLink
                        to={tool.to}
                        onClick={onClose}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 rounded-xl px-4 py-3 font-bold transition-colors',
                            isActive ? 'bg-gold/10 text-gold-light' : 'text-ink-muted hover:bg-panel-raised hover:text-ink',
                          )
                        }
                      >
                        {Icon && <Icon size={18} aria-hidden="true" className="text-gold" />}
                        {tool.label}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
