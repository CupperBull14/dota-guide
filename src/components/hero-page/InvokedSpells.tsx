import type { InvokedSpell, Orb } from '@/types/hero';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { AbilityIcon } from '@/components/ui/AbilityIcon';

const ORB_STYLE: Record<Orb, { label: string; className: string }> = {
  Q: { label: 'Quas', className: 'border-attr-int/60 bg-attr-int/20 text-attr-int' },
  W: { label: 'Wex', className: 'border-[#b77ee8]/60 bg-[#b77ee8]/20 text-[#c9a0f0]' },
  E: { label: 'Exort', className: 'border-blood-light/60 bg-blood/20 text-blood-light' },
};

/** Десять заклинаний Инвокера и сочетания сфер. */
export function InvokedSpells({ spells }: { spells: InvokedSpell[] }) {
  return (
    <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2" step={0.04}>
      {spells.map((spell) => (
        <RevealItem as="li" key={spell.nameEn} className="panel p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <AbilityIcon icon={spell.icon} hotkey={spell.nameEn.charAt(0)} showKey={false} className="h-11 w-11" />
              <div>
                <p className="font-bold text-ink">{spell.name}</p>
                <p className="text-xs font-semibold text-ink-faint">{spell.nameEn}</p>
              </div>
            </div>
            <span className="flex gap-1" aria-label={`Сферы: ${spell.combo.map((o) => ORB_STYLE[o].label).join(', ')}`}>
              {spell.combo.map((orb, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  title={ORB_STYLE[orb].label}
                  className={`grid h-7 w-7 place-items-center rounded-full border text-xs font-bold ${ORB_STYLE[orb].className}`}
                >
                  {orb}
                </span>
              ))}
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">{spell.description}</p>
          <p className="mt-2 text-sm font-semibold text-gold-light">{spell.tip}</p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
