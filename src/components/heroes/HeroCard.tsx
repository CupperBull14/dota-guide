import { memo, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import type { Hero } from '@/types/hero';
import { ATTRIBUTES, ROLES } from '@/data/constants';
import { AttributeBadge, RoleBadge } from '@/components/ui/MetaBadges';
import { Badge } from '@/components/ui/Badge';
import { ComplexityStars } from '@/components/ui/ComplexityStars';
import { HeroPortrait } from './HeroPortrait';
import { FavoriteButton } from './FavoriteButton';
import { fadeUp } from '@/lib/motion';

interface HeroCardProps {
  hero: Hero;
  /** Сколько ролей показывать (остальные — «+N»). */
  maxRoles?: number;
}

/** Карточка героя: портрет, подъём и свечение цвета атрибута при наведении/фокусе. */
export const HeroCard = memo(function HeroCard({ hero, maxRoles = 3 }: HeroCardProps) {
  const attr = ATTRIBUTES[hero.attribute];
  const roles = hero.roles.slice(0, maxRoles);
  const rest = hero.roles.length - roles.length;

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      style={{ '--attr-color': attr.color } as CSSProperties}
      className="group relative h-full"
    >
      <Link
        to={`/heroes/${hero.id}`}
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-panel transition-[box-shadow,border-color] duration-300 hover:border-transparent hover:shadow-glow-attr focus-visible:shadow-glow-attr"
      >
        <div className="relative">
          <HeroPortrait
            hero={hero}
            className="aspect-[16/9] w-full group-hover:[&_img]:scale-105"
          />
          {/* Затемнение к низу для читаемости и цветная линия атрибута */}
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-panel via-panel/10 to-transparent" />
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-0.5"
            style={{ background: `linear-gradient(90deg, transparent, ${attr.color}, transparent)` }}
          />
          <span className="absolute bottom-3 left-4 flex items-center gap-2">
            <AttributeBadge attribute={hero.attribute} className="bg-bg/70 backdrop-blur" />
          </span>
        </div>

        <div className="relative flex flex-1 flex-col px-5 pb-5 pt-3">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-10 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-40"
            style={{ backgroundColor: attr.color }}
          />
          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-ink">{hero.name}</h3>
              <p className="truncate text-sm text-ink-faint">{hero.nameEn}</p>
            </div>
            <ComplexityStars value={hero.complexity} size={13} className="mt-1.5 shrink-0" />
          </div>

          <p className="relative mt-3 line-clamp-2 text-sm leading-relaxed text-ink-muted">
            {hero.shortDescription}
          </p>

          <div className="relative mt-auto flex flex-wrap gap-1.5 pt-4">
            {roles.map((role) => (
              <RoleBadge key={role} role={role} />
            ))}
            {rest > 0 && (
              <Badge title={hero.roles.slice(maxRoles).map((r) => ROLES[r].label).join(', ')}>+{rest}</Badge>
            )}
            {hero.goodForBeginners && (
              <Badge tone="gold" icon={<GraduationCap size={12} aria-hidden="true" />}>
                Новичку
              </Badge>
            )}
          </div>
        </div>
      </Link>
      <FavoriteButton heroId={hero.id} heroName={hero.name} className="absolute right-3 top-3 z-10" />
    </motion.article>
  );
});
