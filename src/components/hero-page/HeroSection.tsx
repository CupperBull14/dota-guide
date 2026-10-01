import type { ReactNode } from 'react';
import { Reveal } from '@/components/ui/Reveal';

interface HeroSectionProps {
  id: string;
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
}

/** Раздел страницы героя: якорь для навигации, заголовок, появление при скролле. */
export function HeroSection({ id, title, subtitle, children }: HeroSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-32 py-10 sm:py-12">
      <Reveal>
        <div className="mb-6 flex flex-col gap-1">
          <h2 id={`${id}-title`} className="text-2xl font-bold sm:text-3xl">
            {title}
          </h2>
          {subtitle && <p className="text-ink-muted">{subtitle}</p>}
        </div>
        {children}
      </Reveal>
    </section>
  );
}
