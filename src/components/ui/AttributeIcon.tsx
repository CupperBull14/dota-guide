import { memo } from 'react';
import type { Attribute } from '@/types/hero';
import { ATTRIBUTES } from '@/data/constants';
import { ATTRIBUTE_ICONS } from '@/data/icons';
import { GameIcon } from './GameIcon';
import { cn } from '@/lib/cn';

interface AttributeIconProps {
  attribute: Attribute;
  size?: number;
  className?: string;
}

/** Официальная иконка атрибута; без сети — цветной кружок. */
export const AttributeIcon = memo(function AttributeIcon({ attribute, size = 16, className }: AttributeIconProps) {
  return (
    <GameIcon
      src={ATTRIBUTE_ICONS[attribute]}
      style={{ width: size, height: size }}
      className={cn('rounded-full', className)}
      imgClassName="object-contain"
      fallback={
        <span className="block h-3/4 w-3/4 rounded-full" style={{ backgroundColor: ATTRIBUTES[attribute].color }} />
      }
    />
  );
});
