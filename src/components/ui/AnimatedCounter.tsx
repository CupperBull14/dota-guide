import { memo } from 'react';
import { useCountUp } from '@/hooks/useCountUp';

interface AnimatedCounterProps {
  value: number;
  label: string;
  suffix?: string;
}

/** Число, «набегающее» при появлении на экране. Экранным чтецам отдаём итог сразу. */
export const AnimatedCounter = memo(function AnimatedCounter({
  value,
  label,
  suffix = '',
}: AnimatedCounterProps) {
  const { ref, value: current } = useCountUp<HTMLSpanElement>(value);
  return (
    <div className="flex flex-col items-center text-center">
      <span
        ref={ref}
        aria-hidden="true"
        className="font-display text-4xl font-bold tabular-nums text-gold-gradient sm:text-5xl"
      >
        {current}
        {suffix}
      </span>
      <span className="sr-only">
        {value}
        {suffix} — {label}
      </span>
      <span aria-hidden="true" className="mt-2 text-sm font-semibold text-ink-muted">
        {label}
      </span>
    </div>
  );
});
