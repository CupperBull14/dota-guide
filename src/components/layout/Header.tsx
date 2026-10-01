import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { NAV_LINKS } from '@/data/constants';
import { NAV_ICONS } from '@/lib/icons';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/cn';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { ToolsMenu } from './ToolsMenu';

/** Шапка: логотип, навигация с анимированным индикатором, мобильное меню. */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { favorites } = useFavorites();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Закрываем меню при переходе на другую страницу.
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-300',
        scrolled ? 'border-line bg-bg/85 backdrop-blur-lg' : 'border-transparent bg-transparent',
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Основная навигация" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    cn(
                      'relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-bold transition-colors',
                      isActive ? 'text-gold-light' : 'text-ink-muted hover:text-ink',
                    )
                  }
                >
                  {({ isActive }) => {
                    const Icon = NAV_ICONS[link.to];
                    return (
                    <>
                      {Icon && <Icon size={16} aria-hidden="true" className={isActive ? 'text-gold' : 'opacity-70'} />}
                      {link.label}
                      {link.to === '/favorites' && favorites.length > 0 && (
                        <span
                          className="grid h-5 min-w-5 place-items-center rounded-full bg-blood px-1 text-[11px] font-bold text-white"
                          aria-label={`${favorites.length} в избранном`}
                        >
                          {favorites.length}
                        </span>
                      )}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute inset-x-3 -bottom-[1px] h-0.5 rounded-full bg-gold-sheen"
                          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                          aria-hidden="true"
                        />
                      )}
                    </>
                    );
                  }}
                </NavLink>
              </li>
            ))}
            <li>
              <ToolsMenu />
            </li>
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Открыть меню"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-panel text-ink transition-colors hover:border-gold/50 lg:hidden"
        >
          <Menu size={22} aria-hidden="true" />
        </button>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} favoritesCount={favorites.length} />
    </header>
  );
}
