import { memo, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Clock, Coins, Crosshair, Sparkles, Swords, Trophy, Users } from 'lucide-react';
import type { Summary } from '@/lib/analysis';
import { fadeUp, stagger } from '@/lib/motion';

interface TileProps {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
}

function Tile({ icon, label, value, hint }: TileProps) {
  return (
    <motion.li
      variants={fadeUp}
      className="panel flex items-start gap-3 p-4 transition-shadow hover:shadow-glow-gold"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-faint">{label}</p>
        <p className="font-display text-2xl font-bold tabular-nums text-gold-gradient">{value}</p>
        {hint && <p className="text-xs text-ink-faint">{hint}</p>}
      </div>
    </motion.li>
  );
}

const pct = (x: number) => `${Math.round(x * 100)}%`;
const fixed = (x: number, d = 1) => x.toFixed(d).replace('.', ',');

/** Сводка по последним матчам. Средние — без турбо-матчей. */
export const SummaryStats = memo(function SummaryStats({ summary }: { summary: Summary }) {
  const hasNormal = summary.counted > 0;
  return (
    <section aria-labelledby="summary-title">
      <h2 id="summary-title" className="mb-4 font-sans text-xl font-bold tracking-normal">
        Последние {summary.total} матчей
      </h2>
      <motion.ul
        variants={stagger(0.05)}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4"
      >
        <Tile
          icon={<Trophy size={20} aria-hidden="true" />}
          label="Победы"
          value={pct(summary.winRate)}
          hint={`${summary.wins} из ${summary.total}`}
        />
        <Tile
          icon={<Swords size={20} aria-hidden="true" />}
          label="KDA"
          value={hasNormal ? fixed(summary.kda, 2) : '—'}
          hint={hasNormal ? `${fixed(summary.kills)} / ${fixed(summary.deaths)} / ${fixed(summary.assists)}` : undefined}
        />
        <Tile
          icon={<Coins size={20} aria-hidden="true" />}
          label="Золото в минуту"
          value={hasNormal ? String(Math.round(summary.gpm)) : '—'}
          hint={hasNormal ? `Опыт в минуту: ${Math.round(summary.xpm)}` : undefined}
        />
        <Tile
          icon={<Crosshair size={20} aria-hidden="true" />}
          label="Добивания в минуту"
          value={hasNormal ? fixed(summary.lhPerMin) : '—'}
        />
        <Tile
          icon={<Clock size={20} aria-hidden="true" />}
          label="Средняя длина матча"
          value={hasNormal ? `${Math.round(summary.minutes)} мин` : '—'}
        />
        <Tile
          icon={<Users size={20} aria-hidden="true" />}
          label="Разных героев"
          value={String(summary.heroPool)}
        />
        {summary.turbo > 0 && (
          <Tile
            icon={<Sparkles size={20} aria-hidden="true" />}
            label="Турбо"
            value={String(summary.turbo)}
            hint="Не входят в средние"
          />
        )}
      </motion.ul>
    </section>
  );
});
