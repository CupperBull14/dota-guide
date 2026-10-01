import { Droplet, Lightbulb, RefreshCw, Ruler } from 'lucide-react';
import type { Ability, AbilityTag } from '@/types/hero';
import { Accordion } from '@/components/ui/Accordion';
import { Badge } from '@/components/ui/Badge';
import { AbilityIcon } from '@/components/ui/AbilityIcon';

const TAG_LABELS: Record<AbilityTag, { label: string; tone: 'gold' | 'blood' | 'neutral' }> = {
  ultimate: { label: 'Ульта', tone: 'blood' },
  innate: { label: 'Врождённая', tone: 'neutral' },
  scepter: { label: 'Аганим', tone: 'gold' },
  shard: { label: 'Шард', tone: 'gold' },
};

const fmtList = (xs: number[]) => xs.join(' / ');

/** Цифры способности по уровням из официального фида. */
function AbilityNumbersRow({
  numbers,
  changedIn,
}: {
  numbers: NonNullable<Ability['numbers']>;
  changedIn?: string;
}) {
  const items = [
    { icon: RefreshCw, label: 'Перезарядка', value: numbers.cooldowns.length ? `${fmtList(numbers.cooldowns)} с` : '' },
    { icon: Droplet, label: 'Мана', value: numbers.manaCosts.length ? fmtList(numbers.manaCosts) : '' },
    { icon: Ruler, label: 'Дальность', value: numbers.castRange.length ? fmtList(numbers.castRange) : '' },
  ].filter((i) => i.value);
  if (!items.length && !changedIn) return null;
  return (
    <dl className="flex flex-wrap gap-2 text-xs">
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-center gap-1.5 rounded-lg border border-line bg-bg-deep/60 px-2.5 py-1.5">
          <Icon size={13} aria-hidden="true" className="text-gold" />
          <dt className="text-ink-faint">{label}:</dt>
          <dd className="font-bold tabular-nums text-ink">{value}</dd>
        </div>
      ))}
      {changedIn && (
        <div className="flex items-center">
          <Badge tone="blood">Изменено в {changedIn}</Badge>
        </div>
      )}
    </dl>
  );
}

/** Порядок показа: врождённая → Q W E → ульта → Аганим/Шард. */
const ORDER = (a: Ability) =>
  a.tag === 'innate' ? 0 : a.tag === 'ultimate' ? 2 : a.tag === 'scepter' || a.tag === 'shard' ? 3 : 1;

/** Способности героя в аккордеоне: описание + советы. */
export function AbilityList({ abilities }: { abilities: Ability[] }) {
  const sorted = [...abilities].sort((a, b) => ORDER(a) - ORDER(b));
  const firstMain = sorted.find((a) => !a.tag) ?? sorted[0];

  return (
    <Accordion
      multiple
      defaultOpen={firstMain ? [firstMain.key] : []}
      items={sorted.map((ability) => ({
        id: ability.key,
        title: (
          <span className="flex items-center gap-3">
            <AbilityIcon icon={ability.icon} hotkey={ability.key} className="h-12 w-12" />
            <span className="min-w-0">
              <span className="block truncate">{ability.name}</span>
              <span className="block truncate text-xs font-semibold text-ink-faint">{ability.nameEn}</span>
            </span>
          </span>
        ),
        meta: (
          <span className="flex gap-1.5">
            <Badge>{ability.type === 'active' ? 'Актив' : 'Пассив'}</Badge>
            {ability.tag && <Badge tone={TAG_LABELS[ability.tag].tone}>{TAG_LABELS[ability.tag].label}</Badge>}
          </span>
        ),
        content: (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-1.5 sm:hidden">
              <Badge>{ability.type === 'active' ? 'Актив' : 'Пассив'}</Badge>
              {ability.tag && <Badge tone={TAG_LABELS[ability.tag].tone}>{TAG_LABELS[ability.tag].label}</Badge>}
            </div>
            <p className="text-ink">{ability.description}</p>
            {ability.numbers && <AbilityNumbersRow numbers={ability.numbers} changedIn={ability.changedIn} />}
            <ul className="space-y-2">
              {ability.tips.map((tip) => (
                <li key={tip} className="flex gap-2.5 text-sm">
                  <Lightbulb size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-gold" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ),
      }))}
    />
  );
}
