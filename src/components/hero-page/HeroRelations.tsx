import { Link } from 'react-router-dom';
import { HeartHandshake, ShieldAlert } from 'lucide-react';
import type { HeroRelation } from '@/types/hero';
import { getHeroById } from '@/data/heroes';
import { HeroAvatar } from '@/components/heroes/HeroAvatar';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { cn } from '@/lib/cn';

function RelationItem({ rel, tone }: { rel: HeroRelation; tone: 'counter' | 'synergy' }) {
  const hero = rel.heroId ? getHeroById(rel.heroId) : undefined;
  const avatar = hero ? (
    <HeroAvatar hero={hero} size="sm" />
  ) : (
    <span
      aria-hidden="true"
      className={cn(
        'grid h-10 w-10 shrink-0 place-items-center rounded-lg border font-display text-lg font-bold',
        tone === 'counter' ? 'border-blood/40 bg-blood/10 text-blood-light' : 'border-attr-agi/40 bg-attr-agi/10 text-attr-agi',
      )}
    >
      {rel.name.charAt(0)}
    </span>
  );

  const body = (
    <>
      {avatar}
      <span className="min-w-0">
        <span className={cn('block font-bold', hero ? 'text-gold-light group-hover:underline' : 'text-ink')}>
          {hero ? hero.name : rel.name}
        </span>
        <span className="mt-0.5 block text-sm leading-relaxed text-ink-muted">{rel.why}</span>
      </span>
    </>
  );

  return (
    <RevealItem as="li">
      {hero ? (
        <Link
          to={`/heroes/${hero.id}`}
          className="group flex gap-3 rounded-xl p-3 transition-colors hover:bg-panel-raised"
        >
          {body}
        </Link>
      ) : (
        <div className="flex gap-3 p-3">{body}</div>
      )}
    </RevealItem>
  );
}

interface HeroRelationsProps {
  counters: HeroRelation[];
  synergies: HeroRelation[];
}

/** Контрпики и синергии. Герои из базы — ссылки на их страницы. */
export function HeroRelations({ counters, synergies }: HeroRelationsProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="panel border-blood/30 p-4 sm:p-5">
        <h3 className="mb-3 flex items-center gap-2 font-sans text-lg font-bold tracking-normal text-blood-light">
          <ShieldAlert size={20} aria-hidden="true" />
          Кто контрит
        </h3>
        <RevealGroup as="ul" className="space-y-1">
          {counters.map((rel) => (
            <RelationItem key={rel.name} rel={rel} tone="counter" />
          ))}
        </RevealGroup>
      </div>
      <div className="panel border-attr-agi/30 p-4 sm:p-5">
        <h3 className="mb-3 flex items-center gap-2 font-sans text-lg font-bold tracking-normal text-attr-agi">
          <HeartHandshake size={20} aria-hidden="true" />
          С кем силён
        </h3>
        <RevealGroup as="ul" className="space-y-1">
          {synergies.map((rel) => (
            <RelationItem key={rel.name} rel={rel} tone="synergy" />
          ))}
        </RevealGroup>
      </div>
    </div>
  );
}
