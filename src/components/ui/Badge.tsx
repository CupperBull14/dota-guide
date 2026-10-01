import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { lighten } from '@/lib/color';

type Tone = 'neutral' | 'gold' | 'blood' | 'attr';

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  /** Цвет для tone="attr" (цвет атрибута героя). */
  color?: string;
  size?: 'sm' | 'md';
  icon?: ReactNode;
  title?: string;
  className?: string;
}

const tones: Record<Exclude<Tone, 'attr'>, string> = {
  neutral: 'border-line-strong bg-panel-raised text-ink-muted',
  gold: 'border-gold/40 bg-gold/10 text-gold-light',
  blood: 'border-blood/50 bg-blood/15 text-[#f0a193]',
};

/** Бейдж для ролей, линий, атрибутов и меток. */
export const Badge = memo(function Badge({
  children,
  tone = 'neutral',
  color,
  size = 'sm',
  icon,
  title,
  className,
}: BadgeProps) {
  const style =
    tone === 'attr' && color
      ? { borderColor: `${color}66`, backgroundColor: `${color}1f`, color: lighten(color, 0.3) }
      : undefined;
  return (
    <span
      title={title}
      style={style}
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border font-semibold',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        tone !== 'attr' && tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
});
