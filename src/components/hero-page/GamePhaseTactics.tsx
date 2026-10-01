import { Hourglass, Sunrise, Swords } from 'lucide-react';
import type { Tactics } from '@/types/hero';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';

const PHASES = [
  { key: 'earlyGame', title: 'Ранняя игра', time: '0–10 мин', icon: Sunrise },
  { key: 'midGame', title: 'Середина', time: '10–25 мин', icon: Swords },
  { key: 'lateGame', title: 'Поздняя игра', time: '25+ мин', icon: Hourglass },
] as const;

/** Тактика по этапам: три карточки-таймлайна. */
export function GamePhaseTactics({ tactics }: { tactics: Tactics }) {
  return (
    <RevealGroup as="ul" className="relative grid gap-5 md:grid-cols-3">
      <span
        aria-hidden="true"
        className="absolute left-0 right-0 top-[2.1rem] hidden h-px bg-gradient-to-r from-gold/0 via-gold/40 to-gold/0 md:block"
      />
      {PHASES.map(({ key, title, time, icon: Icon }, i) => (
        <RevealItem as="li" key={key} className="relative">
          <div className="panel h-full p-5">
            <div className="flex items-center gap-3">
              <span className="relative grid h-11 w-11 place-items-center rounded-full border border-gold/50 bg-bg-deep text-gold">
                <Icon size={20} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-sans text-base font-bold tracking-normal">
                  {i + 1}. {title}
                </h3>
                <p className="text-xs font-semibold text-ink-faint">{time}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">{tactics[key]}</p>
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
