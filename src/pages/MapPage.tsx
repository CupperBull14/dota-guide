import { useCallback, useState } from 'react';
import { Eye, Gem, Route } from 'lucide-react';
import { MAP_ZONES, type MapTab } from '@/data/map';
import { PATCH } from '@/data/constants';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Tabs, type TabItem } from '@/components/ui/Tabs';
import { Reveal } from '@/components/ui/Reveal';
import { DotaMap } from '@/components/map/DotaMap';
import { MapLegend } from '@/components/map/MapLegend';
import { ZoneInfoPanel } from '@/components/map/ZoneInfoPanel';
import { TabContent } from '@/components/map/TabContent';
import type { MapSelection } from '@/components/map/types';
import { cn } from '@/lib/cn';

const TABS: TabItem<MapTab>[] = [
  { id: 'runes', label: 'Руны', icon: <Gem size={16} aria-hidden="true" /> },
  { id: 'wards', label: 'Варды', icon: <Eye size={16} aria-hidden="true" /> },
  { id: 'rotations', label: 'Ротации', icon: <Route size={16} aria-hidden="true" /> },
];

/** /map — интерактивная стилизованная карта. */
export default function MapPage() {
  useDocumentTitle('Интерактивная карта');
  const [tab, setTab] = useState<MapTab>('runes');
  const [selection, setSelection] = useState<MapSelection>(null);
  const [activeRotation, setActiveRotation] = useState<string | null>(null);

  const changeTab = useCallback((next: MapTab) => {
    setTab(next);
    setActiveRotation(null);
    // Выбранный маркер может исчезнуть на другой вкладке — снимаем выбор маркера.
    setSelection((s) => (s?.kind === 'marker' ? null : s));
  }, []);

  return (
    <div className="container-page py-10 sm:py-14">
      <SectionTitle
        as="h1"
        eyebrow="Карта"
        title="Интерактивная карта"
        description={`Нажимай на зоны и объекты, чтобы узнать, что там происходит. Схема стилизована: объекты показаны примерно, тайминги — для патча ${PATCH}.`}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Reveal className="space-y-4">
          <DotaMap tab={tab} selection={selection} onSelect={setSelection} activeRotation={activeRotation} />
          <MapLegend tab={tab} />
        </Reveal>

        <div className="space-y-4">
          <ZoneInfoPanel selection={selection} onClear={() => setSelection(null)} />
          <Tabs tabs={TABS} value={tab} onChange={changeTab} label="Слои карты">
            <TabContent
              tab={tab}
              selection={selection}
              onSelect={setSelection}
              activeRotation={activeRotation}
              onRotation={setActiveRotation}
            />
          </Tabs>
        </div>
      </div>

      {/* Список зон: удобен на мобильных и для навигации с клавиатуры */}
      <Reveal className="mt-8">
        <h2 className="mb-3 font-sans text-xs font-bold uppercase tracking-[0.18em] text-gold">Все зоны карты</h2>
        <ul className="flex flex-wrap gap-2">
          {MAP_ZONES.map((z) => {
            const active = selection?.kind === 'zone' && selection.id === z.id;
            return (
              <li key={z.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setSelection({ kind: 'zone', id: z.id });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={cn(
                    'rounded-full border px-3.5 py-2 text-sm font-bold transition-colors',
                    active
                      ? 'border-gold bg-gold/15 text-gold-light'
                      : 'border-line-strong bg-panel text-ink-muted hover:border-gold/50 hover:text-ink',
                  )}
                >
                  {z.name}
                </button>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </div>
  );
}
