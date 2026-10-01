import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const SECTION_LABELS: Record<string, string> = {
  heroes: 'Герои',
  map: 'Карта',
  beginners: 'Новичкам',
  favorites: 'Избранное',
  patch: 'Изменения патча',
  compare: 'Сравнение',
  pick: 'Подбор героя',
  counter: 'Против кого',
  me: 'Разбор матчей',
};

export interface Crumb {
  to: string;
  label: string;
}

type HeroNameLookup = (id: string) => string | undefined;

/**
 * Строит крошки из пути. Для неизвестных путей возвращает null.
 * Имя героя берётся через lookup; пока данные не загружены — null для страницы героя.
 */
export function buildCrumbs(pathname: string, heroName: HeroNameLookup | null): Crumb[] | null {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0 || parts.length > 2) return null;
  const [section, slug] = parts;
  if (!section || !(section in SECTION_LABELS)) return null;

  const crumbs: Crumb[] = [{ to: `/${section}`, label: SECTION_LABELS[section] ?? section }];
  if (slug) {
    if (section !== 'heroes' || !heroName) return null;
    const name = heroName(slug);
    if (!name) return null;
    crumbs.push({ to: `/heroes/${slug}`, label: name });
  }
  return crumbs;
}

/**
 * База героев подгружается отдельным чанком только когда она нужна крошкам
 * (на страницах героев), чтобы не утяжелять общий бандл.
 */
let cachedLookup: HeroNameLookup | null = null;
function useHeroNameLookup(needed: boolean): HeroNameLookup | null {
  const [lookup, setLookup] = useState<HeroNameLookup | null>(cachedLookup);
  useEffect(() => {
    if (!needed || lookup) return;
    let alive = true;
    void import('@/data/heroes').then(({ getHeroById }) => {
      cachedLookup = (id) => getHeroById(id)?.name;
      if (alive) setLookup(() => cachedLookup);
    });
    return () => {
      alive = false;
    };
  }, [needed, lookup]);
  return lookup;
}

/** Хлебные крошки. На главной и на 404 не показываются. */
export function Breadcrumbs() {
  const { pathname } = useLocation();
  const isHeroPage = /^\/heroes\/[^/]+\/?$/.test(pathname);
  const lookup = useHeroNameLookup(isHeroPage);
  const crumbs = buildCrumbs(pathname, lookup);
  if (!crumbs) return null;

  return (
    <nav aria-label="Хлебные крошки" className="container-page pt-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-faint">
        <li className="flex items-center">
          <Link to="/" className="flex items-center gap-1.5 transition-colors hover:text-gold-light">
            <Home size={14} aria-hidden="true" />
            Главная
          </Link>
        </li>
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={crumb.to} className="flex items-center gap-1.5">
              <ChevronRight size={14} aria-hidden="true" className="text-line-strong" />
              {last ? (
                <span aria-current="page" className="font-semibold text-ink-muted">
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.to} className="transition-colors hover:text-gold-light">
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
