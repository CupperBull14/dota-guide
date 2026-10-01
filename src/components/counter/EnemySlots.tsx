import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { PickerHero } from '@/components/heroes/HeroPicker';
import { HeroPicker } from '@/components/heroes/HeroPicker';
import { HeroAvatar } from '@/components/heroes/HeroAvatar';
import { MAX_ENEMIES } from '@/lib/counter';

interface EnemySlotsProps {
  options: PickerHero[];
  value: string[];
  exclude: string[];
  onChange: (next: string[]) => void;
}

/** До 5 врагов: выбранные — чипами с удалением, плюс выбор следующего. */
export function EnemySlots({ options, value, exclude, onChange }: EnemySlotsProps) {
  const byId = new Map(options.map((o) => [o.id, o]));
  return (
    <div>
      <ul className="flex flex-wrap gap-2" aria-label="Выбранные враги">
        <AnimatePresence initial={false}>
          {value.map((id) => {
            const hero = byId.get(id);
            if (!hero) return null;
            return (
              <motion.li
                key={id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 rounded-full border border-blood/40 bg-blood/10 py-1 pl-1 pr-2"
              >
                <HeroAvatar hero={hero} size="sm" className="!h-8 !w-8 !rounded-full !text-sm" />
                <span className="text-sm font-bold">{hero.name}</span>
                <button
                  type="button"
                  onClick={() => onChange(value.filter((v) => v !== id))}
                  aria-label={`Убрать ${hero.name}`}
                  className="grid h-6 w-6 place-items-center rounded-full text-ink-muted hover:bg-blood/30 hover:text-ink"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
      {value.length < MAX_ENEMIES ? (
        <HeroPicker
          key={value.join(',')}
          className="mt-3 max-w-md"
          heroes={options}
          value={null}
          exclude={[...value, ...exclude]}
          onChange={(id) => onChange([...value, id])}
          label={`Враг ${value.length + 1} из ${MAX_ENEMIES}`}
          placeholder={value.length ? 'Добавить ещё врага' : 'Добавь первого врага'}
        />
      ) : (
        <p className="mt-3 text-sm text-ink-faint">Выбрана вся команда врага — 5 героев.</p>
      )}
    </div>
  );
}
