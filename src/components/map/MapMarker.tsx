import { memo, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { MARKER_TYPES, type MapMarker as MapMarkerData } from '@/data/map';
import { MARKER_ICONS } from '@/lib/icons';

interface MapMarkerProps {
  marker: MapMarkerData;
  selected: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

/** Объект на карте: пульсирующий маркер с буквой-символом. */
export const MapMarker = memo(function MapMarker({ marker, selected, onSelect, onHover }: MapMarkerProps) {
  const meta = MARKER_TYPES[marker.type];
  const Icon = MARKER_ICONS[marker.type];
  const r = marker.type === 'roshan' || marker.type === 'tormentor' ? 20 : 15;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 24 }}
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
    >
      <g
        transform={`translate(${marker.x} ${marker.y})`}
        role="button"
        tabIndex={0}
        aria-label={`${marker.name}: ${marker.short}`}
        aria-pressed={selected}
        className="map-marker cursor-pointer outline-none"
        onClick={() => onSelect(marker.id)}
        onKeyDown={(e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(marker.id);
          }
        }}
        onMouseEnter={() => onHover(marker.id)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(marker.id)}
        onBlur={() => onHover(null)}
      >
        {/* Пульсирующее кольцо (CSS-анимация, отключается при reduced-motion) */}
        <circle
          r={r}
          fill="none"
          stroke={meta.color}
          strokeWidth={3}
          className="animate-pulse-ring"
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
        <circle r={r + 14} fill="transparent" />
        <circle
          r={selected ? r + 4 : r}
          fill="#0b0e14"
          stroke={meta.color}
          strokeWidth={selected ? 5 : 3}
          className="map-marker-dot transition-all duration-200"
        />
        <Icon
          x={-r * 0.62}
          y={-r * 0.62}
          width={r * 1.24}
          height={r * 1.24}
          color={meta.color}
          strokeWidth={2.4}
          aria-hidden="true"
          className="pointer-events-none"
        />
      </g>
    </motion.g>
  );
});
