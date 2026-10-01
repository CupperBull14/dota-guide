import { ArrowUpDown } from 'lucide-react';
import { SORT_OPTIONS, type SortKey } from '@/lib/filters';

interface SortSelectProps {
  value: SortKey;
  onChange: (value: SortKey) => void;
}

/** Сортировка: нативный select (доступен с клавиатуры и на мобильных) в стилях сайта. */
export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <label className="relative flex items-center">
      <span className="sr-only">Сортировка</span>
      <ArrowUpDown
        size={16}
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 text-gold"
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-line-strong bg-panel pl-10 pr-9 text-sm font-bold text-ink transition-colors hover:border-gold/50 focus:border-gold/60 sm:w-auto"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.id} value={o.id} className="bg-panel">
            {o.label}
          </option>
        ))}
      </select>
      <span aria-hidden="true" className="pointer-events-none absolute right-3.5 text-ink-faint">
        ▾
      </span>
    </label>
  );
}
