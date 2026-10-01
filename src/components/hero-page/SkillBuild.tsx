import type { Ability, SkillBuild as SkillBuildData, SkillStep } from '@/types/hero';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { cn } from '@/lib/cn';
import { AbilityKeyBadge } from './AbilityKeyBadge';
import { AbilityIcon } from '@/components/ui/AbilityIcon';

interface SkillBuildProps {
  build: SkillBuildData;
  abilities: Ability[];
}

const ROWS: SkillStep[] = ['Q', 'W', 'E', 'R', 'T'];

/** Таблица прокачки по уровням 1–16 + текстовое описание и альтернатива. */
export function SkillBuild({ build, abilities }: SkillBuildProps) {
  const nameOf = (step: SkillStep) =>
    step === 'T' ? 'Талант' : abilities.find((a) => a.key === step)?.name ?? step;

  return (
    <div className="space-y-5">
      <p className="leading-relaxed text-ink-muted">{build.summary}</p>

      {build.order && (
        <div className="panel overflow-x-auto p-4">
          <table className="w-full min-w-[640px] border-separate border-spacing-1 text-center text-xs">
            <caption className="sr-only">Порядок прокачки способностей по уровням</caption>
            <thead>
              <tr>
                <th scope="col" className="w-44 text-left font-semibold text-ink-faint">
                  Уровень
                </th>
                {build.order.map((_, i) => (
                  <th key={i} scope="col" className="font-bold tabular-nums text-ink-faint">
                    {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row}>
                  <th scope="row" className="pr-2 text-left">
                    <span className="flex items-center gap-2">
                      {row === 'T' ? (
                        <AbilityKeyBadge k="★" className="h-7 w-7 text-sm" title="Талант" />
                      ) : (
                        <AbilityIcon
                          icon={abilities.find((a) => a.key === row)?.icon}
                          hotkey={row}
                          className="h-8 w-8"
                        />
                      )}
                      <span className="truncate text-sm font-semibold text-ink">{nameOf(row)}</span>
                    </span>
                  </th>
                  {build.order!.map((step, i) => {
                    const on = step === row;
                    return (
                      <td key={i} className="p-0">
                        {on ? (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.03, type: 'spring', stiffness: 400, damping: 20 }}
                            className={cn(
                              'mx-auto grid h-7 w-7 place-items-center rounded-md font-bold',
                              row === 'R'
                                ? 'bg-blood-sheen text-white shadow-glow-blood'
                                : row === 'T'
                                  ? 'bg-gold-sheen text-bg'
                                  : 'bg-gold/20 text-gold-light ring-1 ring-gold/50',
                            )}
                            aria-label={`Уровень ${i + 1}: ${nameOf(row)}`}
                          >
                            {i + 1}
                          </motion.span>
                        ) : (
                          <span aria-hidden="true" className="mx-auto block h-7 w-7 rounded-md bg-panel-raised/60" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-ink-faint">
            Третий уровень ульты — на 18-м уровне. Дальше берутся оставшиеся таланты.
          </p>
        </div>
      )}

      {build.alternative && (
        <p className="flex gap-2.5 rounded-xl border border-line bg-panel-raised/50 p-4 text-sm leading-relaxed text-ink-muted">
          <Info size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-gold" />
          <span>
            <span className="font-bold text-ink">Альтернатива: </span>
            {build.alternative}
          </span>
        </p>
      )}
    </div>
  );
}
