import { memo } from 'react';
import type { Attribute, Lane, Role } from '@/types/hero';
import { ATTRIBUTES, LANES, ROLES } from '@/data/constants';
import { LANE_ICONS, ROLE_ICONS } from '@/lib/icons';
import { Badge } from './Badge';
import { AttributeIcon } from './AttributeIcon';

type Size = 'sm' | 'md';

/** Бейдж атрибута с официальной иконкой. */
export const AttributeBadge = memo(function AttributeBadge({
  attribute,
  size = 'sm',
  className,
}: {
  attribute: Attribute;
  size?: Size;
  className?: string;
}) {
  const meta = ATTRIBUTES[attribute];
  return (
    <Badge
      tone="attr"
      color={meta.color}
      size={size}
      className={className}
      icon={<AttributeIcon attribute={attribute} size={size === 'sm' ? 14 : 16} />}
    >
      {meta.label}
    </Badge>
  );
});

/** Бейдж роли с иконкой и подсказкой. */
export const RoleBadge = memo(function RoleBadge({ role, size = 'sm' }: { role: Role; size?: Size }) {
  const Icon = ROLE_ICONS[role];
  return (
    <Badge size={size} title={ROLES[role].hint} icon={<Icon size={12} aria-hidden="true" className="text-gold" />}>
      {ROLES[role].label}
    </Badge>
  );
});

/** Бейдж линии с иконкой. */
export const LaneBadge = memo(function LaneBadge({ lane, size = 'sm' }: { lane: Lane; size?: Size }) {
  const Icon = LANE_ICONS[lane];
  return (
    <Badge tone="gold" size={size} icon={<Icon size={12} aria-hidden="true" />}>
      {LANES[lane].label}
    </Badge>
  );
});
