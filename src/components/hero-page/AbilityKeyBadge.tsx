import { cn } from '@/lib/cn';

/** Квадратная «клавиша» способности: Q, W, E, R… */
export function AbilityKeyBadge({ k, className, title }: { k: string; className?: string; title?: string }) {
  return (
    <kbd
      title={title}
      className={cn(
        'grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-gold/40 bg-bg-deep font-display text-base font-bold text-gold-light shadow-[inset_0_-2px_0_rgba(200,170,110,0.25)]',
        className,
      )}
    >
      {k}
    </kbd>
  );
}
