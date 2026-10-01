import { memo, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

interface FilterChipProps {
  active: boolean;
  onToggle: () => void;
  children: ReactNode;
  /** Цвет активного состояния (например, цвет атрибута). */
  color?: string;
  count?: number;
  title?: string;
}

/** Чип-переключатель фильтра: aria-pressed, микроанимация, счётчик подходящих героев. */
export const FilterChip = memo(function FilterChip({
  active,
  onToggle,
  children,
  color,
  count,
  title,
}: FilterChipProps) {
  const activeStyle =
    active && color ? { borderColor: color, backgroundColor: `${color}26`, color } : undefined;
  return (
    <motion.button
      type="button"
      aria-pressed={active}
      title={title}
      onClick={onToggle}
      whileTap={{ scale: 0.94 }}
      style={activeStyle}
      className={cn(
        'inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-bold transition-colors',
        active
          ? !color && 'border-gold bg-gold/15 text-gold-light'
          : 'border-line-strong bg-panel text-ink-muted hover:border-gold/50 hover:text-ink',
      )}
    >
      {active && <Check size={14} aria-hidden="true" />}
      {children}
      {typeof count === 'number' && (
        <span className={cn('text-xs font-semibold', active ? 'opacity-80' : 'text-ink-faint')}>
          {count}
        </span>
      )}
    </motion.button>
  );
});
