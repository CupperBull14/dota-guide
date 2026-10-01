import { memo } from 'react';
import { Star } from 'lucide-react';
import type { Complexity } from '@/types/hero';
import { COMPLEXITY } from '@/data/constants';
import { cn } from '@/lib/cn';

interface ComplexityStarsProps {
  value: Complexity;
  size?: number;
  showLabel?: boolean;
  className?: string;
}

/** Звёзды сложности 1–3 с доступной подписью. */
export const ComplexityStars = memo(function ComplexityStars({
  value,
  size = 14,
  showLabel = false,
  className,
}: ComplexityStarsProps) {
  const label = `Сложность: ${value} из 3 — ${COMPLEXITY[value].label.toLowerCase()}`;
  return (
    <span className={cn('inline-flex items-center gap-2', className)} title={label}>
      <span className="inline-flex gap-0.5" role="img" aria-label={label}>
        {[1, 2, 3].map((i) => (
          <Star
            key={i}
            size={size}
            aria-hidden="true"
            className={i <= value ? 'fill-gold text-gold' : 'text-line-strong'}
          />
        ))}
      </span>
      {showLabel && (
        <span className="text-xs font-semibold text-ink-muted">{COMPLEXITY[value].label}</span>
      )}
    </span>
  );
});
