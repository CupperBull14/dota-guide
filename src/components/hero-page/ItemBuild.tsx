import { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, Crown, Shield, Sparkles } from 'lucide-react';
import type { ItemBuild as ItemBuildData, ItemRef } from '@/types/hero';
import { ITEM_CATEGORIES, getItem } from '@/data/items';
import { Tabs, type TabItem } from '@/components/ui/Tabs';
import { Tooltip } from '@/components/ui/Tooltip';
import { ItemIcon } from '@/components/ui/ItemIcon';
import { fadeUp, stagger } from '@/lib/motion';

type Stage = keyof ItemBuildData;

const TABS: TabItem<Stage>[] = [
  { id: 'start', label: 'Старт', icon: <Coins size={16} aria-hidden="true" /> },
  { id: 'early', label: 'Ранние', icon: <Sparkles size={16} aria-hidden="true" /> },
  { id: 'core', label: 'Ядро', icon: <Crown size={16} aria-hidden="true" /> },
  { id: 'situational', label: 'Ситуатив', icon: <Shield size={16} aria-hidden="true" /> },
];

const HINTS: Record<Stage, string> = {
  start: 'Покупка на 0-й минуте.',
  early: 'Первые 10–15 минут: обувь и дешёвые полезные предметы.',
  core: 'Главные предметы героя — собирай их в этом порядке.',
  situational: 'Бери в зависимости от врагов и хода игры.',
};

function ItemCard({ entry }: { entry: ItemRef }) {
  const item = getItem(entry.itemId);
  return (
    <motion.li variants={fadeUp} className="panel flex gap-4 p-4">
      <Tooltip content={<><b>{item.nameEn}</b> · {ITEM_CATEGORIES[item.category]}<br />{item.purpose}</>}>
        <span
          tabIndex={0}
          aria-label={`${item.name}: ${item.purpose}`}
          className="relative block w-16 shrink-0 cursor-help rounded-lg transition-transform hover:scale-105"
        >
          <ItemIcon item={item} className="w-16" />
          {entry.count && entry.count > 1 && (
            <span className="absolute -bottom-1.5 -right-1.5 rounded-md bg-blood px-1.5 text-xs font-bold text-white">
              ×{entry.count}
            </span>
          )}
        </span>
      </Tooltip>
      <div className="min-w-0">
        <p className="font-bold text-ink">
          {item.name}
          <span className="ml-2 text-xs font-semibold text-ink-faint">{item.nameEn}</span>
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">{entry.why}</p>
      </div>
    </motion.li>
  );
}

/** Предметы по этапам игры во вкладках; у каждого — зачем он именно этому герою. */
export function ItemBuild({ items }: { items: ItemBuildData }) {
  const [stage, setStage] = useState<Stage>('core');
  return (
    <Tabs tabs={TABS} value={stage} onChange={setStage} label="Этапы сборки предметов">
      <p className="mb-4 text-sm text-ink-faint">{HINTS[stage]} Наведи на иконку — общее описание предмета.</p>
      <motion.ul className="grid gap-4 md:grid-cols-2" variants={stagger(0.06)} initial="hidden" animate="visible">
        {items[stage].map((entry) => (
          <ItemCard key={entry.itemId} entry={entry} />
        ))}
      </motion.ul>
    </Tabs>
  );
}
