import { memo, type KeyboardEvent } from 'react';
import type { MapZone as MapZoneData } from '@/data/map';
import { SIDE_META } from '@/data/map';

interface MapZoneProps {
  zone: MapZoneData;
  selected: boolean;
  dimmed: boolean;
  onSelect: (id: string) => void;
}

const activate = (e: KeyboardEvent, fn: () => void) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn();
  }
};

/** Кликабельная зона карты (площадь или линия). Фокус с клавиатуры, Enter/Space — выбрать. */
export const MapZone = memo(function MapZone({ zone, selected, dimmed, onSelect }: MapZoneProps) {
  const color = SIDE_META[zone.side].color;
  const common = {
    role: 'button',
    tabIndex: 0,
    'aria-label': `${zone.name}. ${zone.summary}`,
    'aria-pressed': selected,
    onClick: () => onSelect(zone.id),
    onKeyDown: (e: KeyboardEvent) => activate(e, () => onSelect(zone.id)),
    className: 'map-zone cursor-pointer outline-none',
  } as const;

  if (zone.kind === 'lane') {
    return (
      <g {...common} data-selected={selected || undefined} style={{ opacity: dimmed ? 0.45 : 1 }}>
        {/* Широкая невидимая полоса — удобная зона клика */}
        <path d={zone.shape} fill="none" stroke="transparent" strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" />
        <path
          d={zone.shape}
          fill="none"
          stroke={selected ? '#e6cf9c' : '#8f7746'}
          strokeOpacity={selected ? 1 : 0.55}
          strokeWidth={selected ? 16 : 11}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="map-zone-shape transition-[stroke,stroke-width,stroke-opacity] duration-300"
        />
      </g>
    );
  }

  return (
    <polygon
      {...common}
      points={zone.shape}
      fill={color}
      fillOpacity={selected ? 0.38 : 0.12}
      stroke={selected ? '#e6cf9c' : color}
      strokeOpacity={selected ? 1 : 0.35}
      strokeWidth={selected ? 4 : 2}
      strokeLinejoin="round"
      style={{ opacity: dimmed ? 0.5 : 1 }}
      className={`${common.className} map-zone-shape transition-[fill-opacity,stroke,stroke-width,opacity] duration-300`}
    />
  );
});
