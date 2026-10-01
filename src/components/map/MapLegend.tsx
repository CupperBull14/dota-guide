import { MAP_MARKERS, MARKER_TYPES, SIDE_META, type MapTab, type MarkerType } from '@/data/map';
import { MARKER_ICONS } from '@/lib/icons';

/** Легенда: стороны карты и типы объектов, видимые на текущей вкладке. */
export function MapLegend({ tab }: { tab: MapTab }) {
  const types = Array.from(
    new Set(MAP_MARKERS.filter((m) => m.tabs.length === 0 || m.tabs.includes(tab)).map((m) => m.type)),
  ) as MarkerType[];

  return (
    <div className="panel p-4">
      <h2 className="mb-3 font-sans text-xs font-bold uppercase tracking-[0.18em] text-gold">Легенда</h2>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm sm:grid-cols-3">
        {(['radiant', 'dire', 'neutral'] as const).map((side) => (
          <li key={side} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-3.5 w-3.5 rounded-sm"
              style={{ backgroundColor: SIDE_META[side].color, opacity: 0.8 }}
            />
            <span className="text-ink-muted">{side === 'neutral' ? 'Река' : SIDE_META[side].label}</span>
          </li>
        ))}
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-1.5 w-5 rounded-full bg-gold-dark" />
          <span className="text-ink-muted">Линии</span>
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-3 w-3 rotate-45 rounded-[2px] bg-attr-agi" />
          <span className="text-ink-muted">Вышки</span>
        </li>
        {types.map((type) => {
          const Icon = MARKER_ICONS[type];
          return (
          <li key={type} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="grid h-6 w-6 place-items-center rounded-full border-2 bg-bg-deep"
              style={{ borderColor: MARKER_TYPES[type].color, color: MARKER_TYPES[type].color }}
            >
              <Icon size={12} strokeWidth={2.6} />
            </span>
            <span className="text-ink-muted">{MARKER_TYPES[type].label}</span>
          </li>
          );
        })}
      </ul>
    </div>
  );
}
