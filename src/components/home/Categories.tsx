import { memo, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { AttributeIcon } from '@/components/ui/AttributeIcon';
import { ROLE_ICONS } from '@/lib/icons';
import type { Attribute, Complexity, Role } from '@/types/hero';
import {
  ATTRIBUTES,
  ATTRIBUTE_ORDER,
  COMPLEXITY,
  COMPLEXITY_ORDER,
  ROLES,
  ROLE_ORDER,
} from '@/data/constants';
import { HEROES } from '@/data/heroes';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ComplexityStars } from '@/components/ui/ComplexityStars';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';

const countBy = <K,>(pick: (h: (typeof HEROES)[number]) => K | K[], key: K) =>
  HEROES.filter((h) => {
    const v = pick(h);
    return Array.isArray(v) ? v.includes(key) : v === key;
  }).length;

const plural = (n: number) => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'герой';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'героя';
  return 'героев';
};

const AttributeCard = memo(function AttributeCard({ id }: { id: Attribute }) {
  const meta = ATTRIBUTES[id];
  const count = countBy((h) => h.attribute, id);
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }} className="h-full">
      <Link
        to={`/heroes?attr=${id}`}
        style={{ '--attr-color': meta.color } as CSSProperties}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-panel p-6 shadow-panel transition-[box-shadow,border-color] duration-300 hover:border-transparent hover:shadow-glow-attr"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 opacity-20 transition-opacity duration-300 group-hover:opacity-40"
          style={{ background: `radial-gradient(circle at 100% 0%, ${meta.color}, transparent 60%)` }}
        />
        <span className="relative flex items-center justify-between">
          <span
            className="grid h-12 w-12 place-items-center rounded-xl border"
            style={{ borderColor: `${meta.color}66`, backgroundColor: `${meta.color}1f`, color: meta.color }}
          >
            <AttributeIcon attribute={id} size={30} />
          </span>
          <ArrowUpRight
            size={20}
            aria-hidden="true"
            className="text-ink-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
          />
        </span>
        <span className="relative mt-5 font-display text-xl font-bold" style={{ color: meta.color }}>
          {meta.label}
        </span>
        <span className="relative mt-2 text-sm leading-relaxed text-ink-muted">{meta.blurb}</span>
        <span className="relative mt-4 text-xs font-bold uppercase tracking-widest text-ink-faint">
          {count} {plural(count)} в базе
        </span>
      </Link>
    </motion.div>
  );
});

function RoleChip({ id }: { id: Role }) {
  const count = countBy((h) => h.roles, id);
  const Icon = ROLE_ICONS[id];
  return (
    <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
      <Link
        to={`/heroes?role=${id}`}
        title={ROLES[id].hint}
        className="flex items-center gap-2 rounded-full border border-line-strong bg-panel px-4 py-2.5 text-sm font-bold text-ink-muted transition-colors hover:border-gold/60 hover:text-gold-light"
      >
        <Icon size={16} aria-hidden="true" className="text-gold" />
        {ROLES[id].label}
        <span className="rounded-full bg-panel-raised px-2 py-0.5 text-xs text-ink-faint">{count}</span>
      </Link>
    </motion.div>
  );
}

function ComplexityCard({ value }: { value: Complexity }) {
  const count = countBy((h) => h.complexity, value);
  return (
    <motion.div whileHover={{ y: -4 }} className="h-full">
      <Link
        to={`/heroes?complexity=${value}`}
        className="group flex h-full items-start gap-4 rounded-2xl border border-line bg-panel p-5 transition-[border-color,box-shadow] duration-300 hover:border-gold/50 hover:shadow-glow-gold"
      >
        <ComplexityStars value={value} size={18} className="mt-0.5" />
        <span className="flex-1">
          <span className="block font-bold text-ink">
            {COMPLEXITY[value].label}{' '}
            <span className="text-sm font-semibold text-ink-faint">· {count}</span>
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-ink-muted">{COMPLEXITY[value].hint}</span>
        </span>
      </Link>
    </motion.div>
  );
}

/** Категории: атрибуты, роли и сложность — каждая ведёт на отфильтрованный список героев. */
export function Categories() {
  return (
    <section aria-labelledby="categories-title" className="container-page py-16 sm:py-20">
      <SectionTitle
        id="categories-title"
        eyebrow="Категории"
        title="Выбери своего героя"
        description="Начни с атрибута, роли или уровня сложности — фильтр откроется сразу на нужных героях."
      />

      <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ATTRIBUTE_ORDER.map((id) => (
          <RevealItem key={id} className="h-full">
            <AttributeCard id={id} />
          </RevealItem>
        ))}
      </RevealGroup>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <h3 className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.2em] text-gold">По роли</h3>
          <RevealGroup className="flex flex-wrap gap-2.5" step={0.04}>
            {ROLE_ORDER.map((id) => (
              <RevealItem key={id}>
                <RoleChip id={id} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
        <div>
          <h3 className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.2em] text-gold">По сложности</h3>
          <RevealGroup className="grid gap-3">
            {COMPLEXITY_ORDER.map((value) => (
              <RevealItem key={value}>
                <ComplexityCard value={value} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
