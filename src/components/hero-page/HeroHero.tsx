import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { GitCompareArrows, MapPin, Users } from 'lucide-react';
import { HEROES } from '@/data/heroes';
import { ButtonLink } from '@/components/ui/Button';
import type { Hero } from '@/types/hero';
import { ATTRIBUTES, PATCH, POSITIONS } from '@/data/constants';
import { Badge } from '@/components/ui/Badge';
import { AttributeBadge, LaneBadge, RoleBadge } from '@/components/ui/MetaBadges';
import { ComplexityStars } from '@/components/ui/ComplexityStars';
import { HeroAvatar } from '@/components/heroes/HeroAvatar';
import { FavoriteButton } from '@/components/heroes/FavoriteButton';
import { HeroRender } from './HeroRender';
import { EASE_OUT, stagger } from '@/lib/motion';

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
};

/** С кем сравнить по умолчанию: другой герой с той же главной ролью, иначе любой другой. */
function compareTarget(hero: Hero): string {
  const others = HEROES.filter((h) => h.id !== hero.id);
  const sameRole = others.find((h) => h.roles[0] === hero.roles[0]);
  return (sameRole ?? others[0] ?? hero).id;
}

/** Баннер героя: градиент цвета атрибута, портрет, имя, бейджи, избранное. */
export function HeroHero({ hero }: { hero: Hero }) {
  const attr = ATTRIBUTES[hero.attribute];

  return (
    <section
      aria-labelledby="hero-name"
      style={{ '--attr-color': attr.color } as CSSProperties}
      className="relative isolate overflow-hidden border-b border-line"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: `radial-gradient(900px 420px at 15% 0%, ${attr.color}55, transparent 65%), radial-gradient(700px 380px at 100% 100%, ${attr.color}22, transparent 60%)`,
          }}
        />
        <div className="absolute inset-0 bg-noise" />
        <div
          className="absolute -left-6 bottom-6 hidden select-none font-display text-[10rem] font-extrabold leading-none opacity-[0.04] lg:block"
          style={{ color: attr.color }}
        >
          {hero.nameEn}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-bg" />
      </div>

      <HeroRender
        src={hero.renderUrl}
        color={attr.color}
        className="absolute bottom-0 right-0 top-0 -z-10 hidden w-[46%] max-w-[640px] lg:block"
      />

      <motion.div
        className="container-page flex flex-col gap-8 py-10 sm:py-14 md:flex-row md:items-center"
        variants={stagger(0.08)}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={item} className="relative self-start lg:hidden">
          <span
            aria-hidden="true"
            className="absolute inset-0 -z-10 rounded-3xl blur-2xl"
            style={{ backgroundColor: `${attr.color}55` }}
          />
          <HeroAvatar hero={hero} size="xl" />
        </motion.div>

        <div className="min-w-0 flex-1 lg:max-w-[56%] lg:py-6">
          <motion.div variants={item} className="flex flex-wrap items-center gap-2">
            <AttributeBadge attribute={hero.attribute} size="md" />
            <span className="rounded-full border border-line-strong bg-panel/80 px-3 py-1">
              <ComplexityStars value={hero.complexity} size={14} showLabel />
            </span>
            <Badge tone="neutral" size="md" title="Патч, с которым сверены способности и таланты">
              Патч {PATCH}
            </Badge>
          </motion.div>

          <motion.h1 variants={item} id="hero-name" className="mt-4 text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            {hero.name}
          </motion.h1>
          <motion.p variants={item} className="mt-1 font-display text-lg tracking-widest text-ink-faint">
            {hero.nameEn}
          </motion.p>
          <motion.p variants={item} className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
            {hero.shortDescription}
          </motion.p>

          <motion.dl variants={item} className="mt-6 grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
            <div>
              <dt className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-gold">
                <Users size={14} aria-hidden="true" />
                Роли
              </dt>
              <dd className="flex flex-wrap gap-1.5">
                {hero.roles.map((r) => (
                  <RoleBadge key={r} role={r} />
                ))}
              </dd>
            </div>
            <div>
              <dt className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-gold">
                <MapPin size={14} aria-hidden="true" />
                Линии и позиции
              </dt>
              <dd className="flex flex-wrap gap-1.5">
                {hero.lanes.map((l) => (
                  <LaneBadge key={l} lane={l} />
                ))}
                {hero.positions.map((p) => (
                  <Badge key={p} title={POSITIONS[p]}>
                    Поз. {p}
                  </Badge>
                ))}
              </dd>
            </div>
          </motion.dl>

          <motion.div variants={item} className="mt-7 flex flex-wrap items-center gap-3">
            <FavoriteButton heroId={hero.id} heroName={hero.name} size="md" withLabel />
            <ButtonLink
              to={`/compare?a=${hero.id}&b=${compareTarget(hero)}`}
              variant="outline"
              icon={<GitCompareArrows size={18} aria-hidden="true" />}
            >
              Сравнить
            </ButtonLink>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
