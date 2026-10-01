import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap } from 'lucide-react';
import type { Hero } from '@/types/hero';
import { HeroPortrait } from '@/components/heroes/HeroPortrait';
import { AttributeBadge, LaneBadge, RoleBadge } from '@/components/ui/MetaBadges';
import { ComplexityStars } from '@/components/ui/ComplexityStars';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';

/** Карточка героя в сравнении: портрет, атрибут, сложность, роли и линии. Общие роли подсвечены. */
export function CompareHeroCard({ hero, other, align }: { hero: Hero; other: Hero; align: 'left' | 'right' }) {
  const right = align === 'right';
  return (
    <article className="panel overflow-hidden">
      <div className="relative">
        <HeroPortrait hero={hero} eager className="aspect-[16/9] w-full" />
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" />
      </div>
      <div className={cn('space-y-3 p-4 sm:p-5', right && 'sm:text-right')}>
        <div>
          <h2 className="font-sans text-xl font-extrabold tracking-normal sm:text-2xl">{hero.name}</h2>
          <p className="text-sm text-ink-faint">{hero.nameEn}</p>
        </div>
        <div className={cn('flex flex-wrap items-center gap-2', right && 'sm:justify-end')}>
          <AttributeBadge attribute={hero.attribute} />
          <ComplexityStars value={hero.complexity} size={13} showLabel />
          {hero.goodForBeginners && (
            <Badge tone="gold" icon={<GraduationCap size={12} aria-hidden="true" />}>
              Новичку
            </Badge>
          )}
        </div>
        <div className={cn('flex flex-wrap gap-1.5', right && 'sm:justify-end')}>
          {hero.roles.map((r) => (
            <span key={r} className={cn(!other.roles.includes(r) && 'opacity-60')}>
              <RoleBadge role={r} />
            </span>
          ))}
        </div>
        <div className={cn('flex flex-wrap gap-1.5', right && 'sm:justify-end')}>
          {hero.lanes.map((l) => (
            <LaneBadge key={l} lane={l} />
          ))}
        </div>
        <Link
          to={`/heroes/${hero.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-gold-light hover:text-gold"
        >
          Открыть гайд
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
