import { AnimatePresence, motion } from 'framer-motion';
import { Lightbulb, MousePointerClick, X } from 'lucide-react';
import { MAP_MARKERS, MAP_ZONES, MARKER_TYPES, SIDE_META } from '@/data/map';
import { MARKER_ICONS } from '@/lib/icons';
import { Badge } from '@/components/ui/Badge';
import { EASE_OUT } from '@/lib/motion';
import type { MapSelection } from './types';

interface ZoneInfoPanelProps {
  selection: MapSelection;
  onClear: () => void;
}

/** Описание выбранной зоны или объекта. Озвучивается программами чтения экрана. */
export function ZoneInfoPanel({ selection, onClear }: ZoneInfoPanelProps) {
  const zone = selection?.kind === 'zone' ? MAP_ZONES.find((z) => z.id === selection.id) : undefined;
  const marker = selection?.kind === 'marker' ? MAP_MARKERS.find((m) => m.id === selection.id) : undefined;
  const key = zone?.id ?? marker?.id ?? 'empty';

  return (
    <div className="panel relative min-h-[12rem] overflow-hidden p-5" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={key}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0, transition: { duration: 0.3, ease: EASE_OUT } }}
          exit={{ opacity: 0, x: -16, transition: { duration: 0.15 } }}
        >
          {!zone && !marker && (
            <div className="flex flex-col items-center gap-3 py-6 text-center text-ink-muted">
              <MousePointerClick size={28} className="text-gold" aria-hidden="true" />
              <p className="font-bold text-ink">Выбери зону или объект на карте</p>
              <p className="text-sm">Нажми на лес, реку, линию или маркер — здесь появится описание и советы.</p>
            </div>
          )}

          {zone && (
            <>
              <div className="flex items-start justify-between gap-3 pr-8">
                <h2 className="text-xl font-bold">{zone.name}</h2>
              </div>
              <Badge tone="attr" color={SIDE_META[zone.side].color} className="mt-2">
                {SIDE_META[zone.side].label}
              </Badge>
              <p className="mt-3 text-ink">{zone.summary}</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-ink-muted marker:text-gold">
                {zone.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              {zone.tips.map((tip) => (
                <p key={tip} className="mt-3 flex gap-2 text-sm text-gold-light">
                  <Lightbulb size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                  {tip}
                </p>
              ))}
            </>
          )}

          {marker && (
            <>
              <h2 className="flex items-center gap-3 pr-8 text-xl font-bold">
                {(() => {
                  const Icon = MARKER_ICONS[marker.type];
                  return (
                    <span
                      aria-hidden="true"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 bg-bg-deep"
                      style={{ borderColor: MARKER_TYPES[marker.type].color, color: MARKER_TYPES[marker.type].color }}
                    >
                      <Icon size={20} />
                    </span>
                  );
                })()}
                {marker.name}
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge tone="attr" color={MARKER_TYPES[marker.type].color}>
                  {MARKER_TYPES[marker.type].label}
                </Badge>
                <Badge tone="gold">{marker.short}</Badge>
              </div>
              <p className="mt-3 leading-relaxed text-ink-muted">{marker.description}</p>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {(zone || marker) && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Снять выбор"
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg text-ink-faint hover:bg-panel-raised hover:text-ink"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
