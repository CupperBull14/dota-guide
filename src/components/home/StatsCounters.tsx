import { Backpack, GraduationCap, Sparkles, Users } from 'lucide-react';
import { HEROES } from '@/data/heroes';
import { ITEM_LIST } from '@/data/items';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';

const STATS = [
  { value: HEROES.length, label: 'героев с полным гайдом', icon: Users },
  { value: HEROES.reduce((sum, h) => sum + h.abilities.length, 0), label: 'способностей с советами', icon: Sparkles },
  { value: ITEM_LIST.length, label: 'предметов в справочнике', icon: Backpack },
  { value: HEROES.filter((h) => h.goodForBeginners).length, label: 'героев для новичков', icon: GraduationCap },
];

/** Анимированные счётчики по данным сайта. */
export function StatsCounters() {
  return (
    <section aria-label="Сайт в цифрах" className="container-page">
      <RevealGroup className="panel relative grid grid-cols-2 gap-8 overflow-hidden px-6 py-10 sm:px-10 lg:grid-cols-4">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
        />
        {STATS.map((s) => (
          <RevealItem key={s.label} className="flex flex-col items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
              <s.icon size={20} aria-hidden="true" />
            </span>
            <AnimatedCounter value={s.value} label={s.label} />
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
