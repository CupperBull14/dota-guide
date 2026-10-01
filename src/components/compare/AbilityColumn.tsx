import type { Hero } from '@/types/hero';
import { AbilityIcon } from '@/components/ui/AbilityIcon';
import { ItemIcon } from '@/components/ui/ItemIcon';
import { getItem } from '@/data/items';

/** Способности (с перезарядкой) и ядро предметов героя — колонка для сравнения. */
export function AbilityColumn({ hero }: { hero: Hero }) {
  const abilities = hero.abilities.filter((a) => a.tag !== 'scepter' && a.tag !== 'shard');
  return (
    <div className="space-y-5">
      <ul className="space-y-2">
        {abilities.map((a) => (
          <li key={a.key} className="flex items-center gap-3 rounded-xl border border-line bg-bg-deep/40 p-2.5">
            <AbilityIcon icon={a.icon} hotkey={a.key} className="h-10 w-10" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-ink">{a.name}</span>
              <span className="block truncate text-xs text-ink-faint">
                {a.tag === 'ultimate' ? 'Ульта' : a.tag === 'innate' ? 'Врождённая' : a.type === 'active' ? 'Актив' : 'Пассив'}
                {a.numbers?.cooldowns.length ? ` · ${a.numbers.cooldowns.join('/')} с` : ''}
              </span>
            </span>
          </li>
        ))}
      </ul>
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-gold">Ядро предметов</p>
        <ul className="flex flex-wrap gap-2">
          {hero.items.core.map((ref) => {
            const item = getItem(ref.itemId);
            return (
              <li key={ref.itemId} title={`${item.name} — ${ref.why}`}>
                <ItemIcon item={item} className="w-14" />
                <span className="sr-only">{item.name}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
