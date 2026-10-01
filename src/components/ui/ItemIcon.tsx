import { memo } from 'react';
import type { Item } from '@/data/items';
import { ITEM_ICONS, itemIconUrl } from '@/data/icons';
import { GameIcon } from './GameIcon';
import { cn } from '@/lib/cn';

/** Иконка предмета (88×64 в игре — соотношение 11:8). Без сети — буква на золотом фоне. */
export const ItemIcon = memo(function ItemIcon({ item, className }: { item: Item; className?: string }) {
  const key = ITEM_ICONS[item.id];
  return (
    <GameIcon
      src={key ? itemIconUrl(key) : undefined}
      className={cn(
        'aspect-[11/8] rounded-lg border border-gold/40 bg-[radial-gradient(circle_at_30%_20%,rgba(200,170,110,0.35),#0b0e14)]',
        className,
      )}
      fallback={<span className="font-display text-lg font-bold text-gold-light">{item.nameEn.charAt(0)}</span>}
    />
  );
});
