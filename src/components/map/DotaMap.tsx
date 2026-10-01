import { memo, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  MAP_MARKERS,
  MAP_ZONES,
  MARKER_TYPES,
  ROTATIONS,
  type MapTab,
} from '@/data/map';
import { MapZone } from './MapZone';
import { MapMarker } from './MapMarker';
import type { MapSelection } from './types';

interface DotaMapProps {
  tab: MapTab;
  selection: MapSelection;
  onSelect: (selection: MapSelection) => void;
  activeRotation: string | null;
}

/** Декоративные вышки: [x, y, сторона]. */
const TOWERS: [number, number, 'r' | 'd'][] = [
  // Свет
  [110, 640, 'r'], [110, 470, 'r'], [110, 300, 'r'],
  [300, 700, 'r'], [360, 640, 'r'], [420, 580, 'r'],
  [360, 890, 'r'], [530, 890, 'r'], [700, 890, 'r'],
  // Тьма
  [890, 360, 'd'], [890, 530, 'd'], [890, 700, 'd'],
  [700, 300, 'd'], [640, 360, 'd'], [580, 420, 'd'],
  [640, 110, 'd'], [470, 110, 'd'], [300, 110, 'd'],
];

/** Детерминированные «деревья» для текстуры леса. */
function makeTrees(count: number, seed: number) {
  let s = seed;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return Array.from({ length: count }, () => ({ x: rnd() * 1000, y: rnd() * 1000, r: 5 + rnd() * 7 }));
}

const TREES = makeTrees(260, 7).filter(({ x, y }) => {
  // Не рисуем деревья на линиях, в реке и на базах.
  const onRiver = Math.abs(x - y) < 90;
  const onMid = Math.abs(x + y - 1000) < 60;
  const onEdges = x < 150 || x > 850 || y < 150 || y > 850;
  return !onRiver && !onMid && !onEdges;
});

/**
 * Стилизованная карта Dota 2 (SVG 1000×1000): стороны, река, линии, лес,
 * кликабельные зоны, пульсирующие маркеры и анимированные ротации.
 */
export const DotaMap = memo(function DotaMap({ tab, selection, onSelect, activeRotation }: DotaMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const markers = useMemo(
    () => MAP_MARKERS.filter((m) => m.tabs.length === 0 || m.tabs.includes(tab)),
    [tab],
  );
  const hoveredMarker = markers.find((m) => m.id === hovered);
  const selectZone = (id: string) => onSelect({ kind: 'zone', id });
  const selectMarker = (id: string) => onSelect({ kind: 'marker', id });

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-line-strong bg-bg-deep shadow-panel">
      <svg
        viewBox="0 0 1000 1000"
        className="h-full w-full"
        role="group"
        aria-label="Схема карты Dota 2. Зоны и объекты можно выбрать клавишами Tab и Enter."
      >
        <defs>
          <linearGradient id="radiant-g" x1="0" y1="1" x2="0.6" y2="0.4">
            <stop offset="0" stopColor="#1f3b26" />
            <stop offset="1" stopColor="#16241b" />
          </linearGradient>
          <linearGradient id="dire-g" x1="1" y1="0" x2="0.4" y2="0.6">
            <stop offset="0" stopColor="#3d1d1a" />
            <stop offset="1" stopColor="#241615" />
          </linearGradient>
          <linearGradient id="river-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1d4e6e" />
            <stop offset="0.5" stopColor="#2a6c94" />
            <stop offset="1" stopColor="#1d4e6e" />
          </linearGradient>
          <radialGradient id="base-glow-r">
            <stop offset="0" stopColor="#56c271" stopOpacity="0.6" />
            <stop offset="1" stopColor="#56c271" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="base-glow-d">
            <stop offset="0" stopColor="#e5484d" stopOpacity="0.6" />
            <stop offset="1" stopColor="#e5484d" stopOpacity="0" />
          </radialGradient>
          <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" />
          </marker>
        </defs>

        {/* Стороны */}
        <polygon points="0,0 0,1000 1000,1000" fill="url(#radiant-g)" />
        <polygon points="0,0 1000,0 1000,1000" fill="url(#dire-g)" />

        {/* Лес */}
        <g aria-hidden="true" opacity={0.55}>
          {TREES.map((t, i) => (
            <circle key={i} cx={t.x} cy={t.y} r={t.r} fill={t.y > t.x ? '#2c5a35' : '#5a2b26'} />
          ))}
        </g>

        {/* Река */}
        <path
          aria-hidden="true"
          d="M 20 70 C 200 230 300 330 430 420 S 640 600 760 700 S 900 850 980 930 L 930 980 C 850 900 700 780 600 700 S 400 540 340 470 S 160 280 70 20 Z"
          fill="url(#river-g)"
          opacity={0.85}
        />

        {/* Свечение баз */}
        <circle cx={120} cy={880} r={150} fill="url(#base-glow-r)" aria-hidden="true" />
        <circle cx={880} cy={120} r={150} fill="url(#base-glow-d)" aria-hidden="true" />

        {/* Зоны */}
        {MAP_ZONES.filter((z) => z.kind === 'area').map((zone) => (
          <MapZone
            key={zone.id}
            zone={zone}
            selected={selection?.kind === 'zone' && selection.id === zone.id}
            dimmed={false}
            onSelect={selectZone}
          />
        ))}
        {MAP_ZONES.filter((z) => z.kind === 'lane').map((zone) => (
          <MapZone
            key={zone.id}
            zone={zone}
            selected={selection?.kind === 'zone' && selection.id === zone.id}
            dimmed={tab === 'rotations'}
            onSelect={selectZone}
          />
        ))}

        {/* Вышки */}
        <g aria-hidden="true">
          {TOWERS.map(([x, y, side], i) => (
            <rect
              key={i}
              x={x - 9}
              y={y - 9}
              width={18}
              height={18}
              rx={3}
              transform={`rotate(45 ${x} ${y})`}
              fill={side === 'r' ? '#56c271' : '#e5484d'}
              stroke="#0b0e14"
              strokeWidth={3}
            />
          ))}
          {/* Древние */}
          <circle cx={120} cy={880} r={26} fill="#56c271" stroke="#e6cf9c" strokeWidth={4} />
          <circle cx={880} cy={120} r={26} fill="#e5484d" stroke="#e6cf9c" strokeWidth={4} />
        </g>

        {/* Подписи зон */}
        <g aria-hidden="true" className="pointer-events-none select-none">
          {MAP_ZONES.map((z) => (
            <text
              key={z.id}
              x={z.label.x}
              y={z.label.y}
              textAnchor="middle"
              fontSize={22}
              fontWeight={700}
              fontFamily="Manrope, sans-serif"
              fill="#e8e3d7"
              fillOpacity={0.75}
              stroke="#07090d"
              strokeWidth={5}
              strokeOpacity={0.7}
              paintOrder="stroke"
              transform={z.id === 'top-lane' ? `rotate(-90 ${z.label.x} ${z.label.y})` : undefined}
            >
              {z.name}
            </text>
          ))}
        </g>

        {/* Ротации */}
        <AnimatePresence>
          {tab === 'rotations' &&
            ROTATIONS.map((r) => {
              const active = activeRotation === null || activeRotation === r.id;
              return (
                <motion.path
                  key={r.id}
                  d={r.path}
                  fill="none"
                  stroke={r.color}
                  strokeWidth={active ? 9 : 5}
                  strokeLinecap="round"
                  markerEnd="url(#arrow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: active ? 1 : 0.25 }}
                  exit={{ opacity: 0 }}
                  transition={{ pathLength: { duration: 1.2, ease: 'easeInOut' }, opacity: { duration: 0.3 } }}
                  aria-hidden="true"
                />
              );
            })}
        </AnimatePresence>

        {/* Маркеры */}
        <AnimatePresence>
          {markers.map((m) => (
            <MapMarker
              key={m.id}
              marker={m}
              selected={selection?.kind === 'marker' && selection.id === m.id}
              onSelect={selectMarker}
              onHover={setHovered}
            />
          ))}
        </AnimatePresence>
      </svg>

      {/* Тултип над маркером */}
      <AnimatePresence>
        {hoveredMarker && (
          <div
            key={hoveredMarker.id}
            className="pointer-events-none absolute z-10"
            style={{
              left: `${hoveredMarker.x / 10}%`,
              top: `${hoveredMarker.y / 10}%`,
              transform: `translate(-50%, ${hoveredMarker.y < 150 ? '28px' : 'calc(-100% - 28px)'})`,
            }}
          >
            <motion.div
              role="tooltip"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-max max-w-[14rem] rounded-lg border border-gold/30 bg-bg-deep/95 px-3 py-2 text-xs shadow-panel backdrop-blur"
            >
              <span className="block font-bold" style={{ color: MARKER_TYPES[hoveredMarker.type].color }}>
                {hoveredMarker.name}
              </span>
              <span className="text-ink-muted">{hoveredMarker.short}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});
