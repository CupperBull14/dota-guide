import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

export interface SectionLink {
  id: string;
  label: string;
}

/**
 * Липкая навигация по разделам страницы героя.
 * Подсвечивает раздел, который сейчас на экране (IntersectionObserver).
 */
export function SectionNav({ sections }: { sections: SectionLink[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-140px 0px -55% 0px' },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="Разделы гайда"
      className="sticky top-16 z-30 -mx-4 border-b border-line bg-bg/85 px-4 backdrop-blur-lg sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
    >
      <ul className="flex gap-1 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sections.map((s) => (
          <li key={s.id} className="shrink-0">
            <a
              href={`#${s.id}`}
              aria-current={active === s.id ? 'true' : undefined}
              className={cn(
                'block rounded-lg px-3 py-1.5 text-sm font-bold transition-colors',
                active === s.id ? 'bg-gold/15 text-gold-light' : 'text-ink-muted hover:text-ink',
              )}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
