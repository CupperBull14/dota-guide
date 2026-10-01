import { Link } from 'react-router-dom';
import { NAV_LINKS, PATCH, TOOL_LINKS } from '@/data/constants';
import { NAV_ICONS } from '@/lib/icons';
import { Logo } from './Logo';

/** Футер: навигация, версия патча, дисклеймер. */
export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-bg-deep/60">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
            Справочник по Dota 2 на русском: гайды по героям, предметы, таланты, карта и основы для
            тех, кто только начинает.
          </p>
        </div>
        <nav aria-label="Навигация в футере">
          <h2 className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.2em] text-gold">
            Разделы
          </h2>
          <ul className="grid grid-cols-2 gap-2 text-sm md:grid-cols-1">
            {[...NAV_LINKS, ...TOOL_LINKS].map((link) => {
              const Icon = NAV_ICONS[link.to];
              return (
                <li key={link.to}>
                  <Link to={link.to} className="inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-gold-light">
                    {Icon && <Icon size={14} aria-hidden="true" className="text-gold/70" />}
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div>
          <h2 className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.2em] text-gold">
            Актуальность
          </h2>
          <p className="text-sm text-ink-muted">
            Способности и таланты сверены с патчем{' '}
            <span className="font-bold text-gold-light">{PATCH}</span>.
          </p>
          <p className="mt-3 text-sm text-ink-muted">
            Источники: официальные данные и заметки патчей dota2.com, статистика OpenDota и Dotabuff,
            справочники Liquipedia и Dota 2 Wiki.
          </p>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="container-page py-5 text-xs leading-relaxed text-ink-faint">
          Dota Guide — фанатский некоммерческий проект. Dota 2 и все связанные названия — товарные
          знаки Valve Corporation. Сайт не связан с Valve.
        </p>
      </div>
    </footer>
  );
}
