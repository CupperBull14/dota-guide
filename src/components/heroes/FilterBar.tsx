import { useId, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GraduationCap, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import type { Hero } from '@/types/hero';
import {
  ATTRIBUTES,
  ATTRIBUTE_ORDER,
  COMPLEXITY,
  COMPLEXITY_ORDER,
  LANES,
  LANE_ORDER,
  ROLES,
  ROLE_ORDER,
} from '@/data/constants';
import { countActiveFilters, hasAnyFilter, toggleValue, type HeroFilters } from '@/lib/filters';
import { ComplexityStars } from '@/components/ui/ComplexityStars';
import { AttributeIcon } from '@/components/ui/AttributeIcon';
import { LANE_ICONS, ROLE_ICONS } from '@/lib/icons';
import { cn } from '@/lib/cn';
import { EASE_OUT } from '@/lib/motion';
import { FilterChip } from './FilterChip';
import { SortSelect } from './SortSelect';

interface FilterBarProps {
  heroes: readonly Hero[];
  filters: HeroFilters;
  onChange: (patch: Partial<HeroFilters>) => void;
  onQueryChange: (q: string) => void;
  onReset: () => void;
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  const id = useId();
  return (
    <fieldset className="min-w-0" aria-labelledby={id}>
      <legend id={id} className="mb-2.5 text-xs font-bold uppercase tracking-[0.18em] text-gold">
        {title}
      </legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

/**
 * Панель фильтров каталога: поиск, сортировка, группы чипов.
 * На мобильных группы сворачиваются под кнопку «Фильтры».
 */
export function FilterBar({ heroes, filters, onChange, onQueryChange, onReset }: FilterBarProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const active = countActiveFilters(filters);

  // Сколько героев в базе у каждого значения — подсказка рядом с чипом.
  const counts = useMemo(() => {
    const by = <K extends string | number>(pick: (h: Hero) => K | K[]) => {
      const map = new Map<K, number>();
      heroes.forEach((h) => {
        const v = pick(h);
        (Array.isArray(v) ? v : [v]).forEach((k) => map.set(k, (map.get(k) ?? 0) + 1));
      });
      return map;
    };
    return {
      attr: by((h) => h.attribute),
      role: by((h) => h.roles),
      complexity: by((h) => h.complexity),
      lane: by((h) => h.lanes),
    };
  }, [heroes]);

  const groups = (
    <div className="grid gap-6 pt-5 md:grid-cols-2 xl:grid-cols-[auto_1fr_auto]">
      <Group title="Атрибут">
        {ATTRIBUTE_ORDER.map((id) => (
          <FilterChip
            key={id}
            active={filters.attr.includes(id)}
            color={ATTRIBUTES[id].color}
            count={counts.attr.get(id) ?? 0}
            onToggle={() => onChange({ attr: toggleValue(filters.attr, id) })}
          >
            <AttributeIcon attribute={id} size={16} />
            {ATTRIBUTES[id].label}
          </FilterChip>
        ))}
      </Group>
      <Group title="Роль">
        {ROLE_ORDER.map((id) => {
          const Icon = ROLE_ICONS[id];
          return (
          <FilterChip
            key={id}
            title={ROLES[id].hint}
            active={filters.role.includes(id)}
            count={counts.role.get(id) ?? 0}
            onToggle={() => onChange({ role: toggleValue(filters.role, id) })}
          >
            <Icon size={14} aria-hidden="true" />
            {ROLES[id].label}
          </FilterChip>
          );
        })}
      </Group>
      <Group title="Сложность">
        {COMPLEXITY_ORDER.map((value) => (
          <FilterChip
            key={value}
            title={COMPLEXITY[value].hint}
            active={filters.complexity.includes(value)}
            count={counts.complexity.get(value) ?? 0}
            onToggle={() => onChange({ complexity: toggleValue(filters.complexity, value) })}
          >
            <ComplexityStars value={value} size={12} />
            <span className="sr-only">{COMPLEXITY[value].label}</span>
          </FilterChip>
        ))}
      </Group>
      <Group title="Линия">
        {LANE_ORDER.map((id) => {
          const Icon = LANE_ICONS[id];
          return (
          <FilterChip
            key={id}
            active={filters.lane.includes(id)}
            count={counts.lane.get(id) ?? 0}
            onToggle={() => onChange({ lane: toggleValue(filters.lane, id) })}
          >
            <Icon size={14} aria-hidden="true" />
            {LANES[id].label}
          </FilterChip>
          );
        })}
      </Group>
      <Group title="Опыт">
        <FilterChip active={filters.beginner} onToggle={() => onChange({ beginner: !filters.beginner })}>
          <GraduationCap size={14} aria-hidden="true" />
          Подходит новичку
        </FilterChip>
      </Group>
    </div>
  );

  return (
    <section aria-label="Фильтры героев" className="panel p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="group relative flex-1">
          <label htmlFor={`${panelId}-q`} className="sr-only">
            Поиск по имени или способности
          </label>
          <Search
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint group-focus-within:text-gold"
          />
          <input
            id={`${panelId}-q`}
            type="search"
            value={filters.q}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Имя героя или способности…"
            autoComplete="off"
            className="h-12 w-full rounded-xl border border-line-strong bg-bg-deep/70 pl-11 pr-10 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-faint focus:border-gold/60 focus:shadow-glow-gold focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {filters.q && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              aria-label="Очистить поиск"
              className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-ink-faint hover:bg-panel-raised hover:text-ink"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <div className="flex-1 sm:flex-none">
            <SortSelect value={filters.sort} onChange={(sort) => onChange({ sort })} />
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={`${panelId}-groups`}
            className="relative inline-flex h-12 items-center gap-2 rounded-xl border border-line-strong bg-panel px-4 text-sm font-bold text-ink transition-colors hover:border-gold/50 md:hidden"
          >
            <SlidersHorizontal size={16} aria-hidden="true" className="text-gold" />
            Фильтры
            {active > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-blood px-1 text-[11px] text-white">
                {active}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Десктоп: группы всегда видны */}
      <div className="hidden md:block">{groups}</div>

      {/* Мобильные: плавно раскрывающаяся панель */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${panelId}-groups`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="overflow-hidden md:hidden"
          >
            {groups}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {hasAnyFilter(filters) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className={cn('flex justify-end pt-4')}>
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold text-ink-muted transition-colors hover:bg-panel-raised hover:text-gold-light"
              >
                <RotateCcw size={14} aria-hidden="true" />
                Сбросить всё
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
