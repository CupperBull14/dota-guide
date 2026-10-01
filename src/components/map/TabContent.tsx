import { Clock, Eye, Route } from 'lucide-react';
import { MAP_MARKERS, MARKER_TYPES, ROTATIONS, TIMINGS, WARD_RULES, type MapTab } from '@/data/map';
import { cn } from '@/lib/cn';
import type { MapSelection } from './types';

interface TabContentProps {
  tab: MapTab;
  selection: MapSelection;
  onSelect: (s: MapSelection) => void;
  activeRotation: string | null;
  onRotation: (id: string | null) => void;
}

/** Содержимое вкладок «Руны / Варды / Ротации» рядом с картой. */
export function TabContent({ tab, selection, onSelect, activeRotation, onRotation }: TabContentProps) {
  if (tab === 'runes') {
    return (
      <div className="panel p-5">
        <h2 className="mb-3 flex items-center gap-2 font-sans text-base font-bold tracking-normal">
          <Clock size={18} className="text-gold" aria-hidden="true" />
          Главные тайминги
        </h2>
        <ol className="space-y-2.5">
          {TIMINGS.map((t) => (
            <li key={t.time + t.event} className="flex gap-3 text-sm">
              <span className="w-24 shrink-0 font-bold tabular-nums text-gold-light">{t.time}</span>
              <span className="text-ink-muted">{t.event}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (tab === 'wards') {
    const wards = MAP_MARKERS.filter((m) => m.tabs.includes('wards'));
    return (
      <div className="panel p-5">
        <h2 className="mb-3 flex items-center gap-2 font-sans text-base font-bold tracking-normal">
          <Eye size={18} className="text-gold" aria-hidden="true" />
          Где ставить варды (за Свет)
        </h2>
        <ul className="mb-4 space-y-1.5">
          {wards.map((w) => {
            const active = selection?.kind === 'marker' && selection.id === w.id;
            return (
              <li key={w.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => onSelect({ kind: 'marker', id: w.id })}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    active ? 'bg-gold/15 text-ink' : 'text-ink-muted hover:bg-panel-raised hover:text-ink',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: MARKER_TYPES[w.type].color }}
                  />
                  {w.name}
                </button>
              </li>
            );
          })}
        </ul>
        <ul className="space-y-2 border-t border-line pt-4 text-sm text-ink-muted">
          {WARD_RULES.map((r) => (
            <li key={r}>• {r}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="panel p-5">
      <h2 className="mb-3 flex items-center gap-2 font-sans text-base font-bold tracking-normal">
        <Route size={18} className="text-gold" aria-hidden="true" />
        Ротации (за Свет)
      </h2>
      <ul className="space-y-2">
        {ROTATIONS.map((r) => {
          const active = activeRotation === r.id;
          return (
            <li key={r.id}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => onRotation(active ? null : r.id)}
                className={cn(
                  'w-full rounded-xl border p-3 text-left transition-colors',
                  active ? 'border-gold/60 bg-gold/10' : 'border-line hover:border-gold/40 hover:bg-panel-raised',
                )}
              >
                <span className="flex items-center gap-2 font-bold text-ink">
                  <span aria-hidden="true" className="h-1.5 w-6 rounded-full" style={{ backgroundColor: r.color }} />
                  {r.name}
                </span>
                <span className="mt-1 block text-xs font-semibold text-gold-light">{r.timing}</span>
                {active && (
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-ink-muted">
                    {r.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
