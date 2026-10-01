import { motion } from 'framer-motion';

/** Круговой индикатор процента совпадения. */
export function MatchRing({ value, color, size = 72 }: { value: number; color: string; size?: number }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`Совпадение ${value}%`}>
      <svg viewBox="0 0 72 72" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#232b38" strokeWidth="6" />
        <motion.circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - value / 100) }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </svg>
      <span aria-hidden="true" className="absolute inset-0 grid place-items-center font-display text-base font-bold text-ink">
        {value}%
      </span>
    </div>
  );
}
