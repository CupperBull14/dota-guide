import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import type { StatRow } from '@/lib/compare';
import { cn } from '@/lib/cn';

interface StatComparisonProps {
  rows: StatRow[];
  colorA: string;
  colorB: string;
  nameA: string;
  nameB: string;
}

/** Характеристики «зеркальными» полосками: у кого больше — полоса длиннее и подсвечена. */
export function StatComparison({ rows, colorA, colorB, nameA, nameB }: StatComparisonProps) {
  return (
    <div className="panel p-4 sm:p-6">
      <table className="w-full border-separate border-spacing-y-3 text-sm">
        <caption className="sr-only">
          Характеристики на 1-м уровне: {nameA} и {nameB}
        </caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">{nameA}</th>
            <th scope="col">Характеристика</th>
            <th scope="col">{nameB}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const max = Math.max(row.a ?? 0, row.b ?? 0) || 1;
            const wa = ((row.a ?? 0) / max) * 100;
            const wb = ((row.b ?? 0) / max) * 100;
            return (
              <tr key={row.id}>
                <td className="w-[40%] align-middle">
                  <div className="flex items-center justify-end gap-2">
                    <span className={cn('tabular-nums', row.winner === 'a' ? 'font-extrabold text-ink' : 'text-ink-muted')}>
                      {row.aText}
                    </span>
                    <span className="relative h-2.5 w-full max-w-[10rem] overflow-hidden rounded-full bg-panel-raised">
                      <motion.span
                        className="absolute inset-y-0 right-0 rounded-full"
                        style={{ backgroundColor: colorA, opacity: row.winner === 'a' ? 1 : 0.45 }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${wa}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </span>
                  </div>
                </td>
                <th scope="row" className="w-[20%] px-2 text-center align-middle text-xs font-bold text-ink-faint sm:text-sm">
                  <span className="inline-flex items-center gap-1">
                    {row.label}
                    {row.hint && (
                      <span title={row.hint} className="hidden text-ink-faint sm:inline">
                        <Info size={12} aria-hidden="true" />
                        <span className="sr-only"> ({row.hint})</span>
                      </span>
                    )}
                  </span>
                </th>
                <td className="w-[40%] align-middle">
                  <div className="flex items-center gap-2">
                    <span className="relative h-2.5 w-full max-w-[10rem] overflow-hidden rounded-full bg-panel-raised">
                      <motion.span
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{ backgroundColor: colorB, opacity: row.winner === 'b' ? 1 : 0.45 }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${wb}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </span>
                    <span className={cn('tabular-nums', row.winner === 'b' ? 'font-extrabold text-ink' : 'text-ink-muted')}>
                      {row.bText}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-2 text-center text-xs text-ink-faint">
        Значения на 1-м уровне по данным dota2.com. У атрибутов: база и прирост за уровень.
      </p>
    </div>
  );
}
