import { memo } from 'react';
import { abilityIconUrl } from '@/data/icons';
import { GameIcon } from './GameIcon';
import { cn } from '@/lib/cn';

interface AbilityIconProps {
  icon?: string;
  /** Клавиша — показывается в углу и как заглушка. */
  hotkey?: string;
  className?: string;
  showKey?: boolean;
}

/** Иконка способности с клавишей в углу. Без иконки — стилизованная «клавиша». */
export const AbilityIcon = memo(function AbilityIcon({ icon, hotkey, className, showKey = true }: AbilityIconProps) {
  return (
    <span className={cn('relative inline-block shrink-0', className)}>
      <GameIcon
        src={icon ? abilityIconUrl(icon) : undefined}
        className="h-full w-full rounded-lg border border-gold/40 bg-bg-deep shadow-[inset_0_-2px_0_rgba(200,170,110,0.25)]"
        fallback={<span className="font-display text-base font-bold text-gold-light">{hotkey ?? '•'}</span>}
      />
      {showKey && hotkey && icon && (
        <kbd className="absolute -bottom-1 -right-1 grid h-4 min-w-4 place-items-center rounded bg-bg-deep px-0.5 font-sans text-[10px] font-extrabold leading-none text-gold-light ring-1 ring-gold/50">
          {hotkey}
        </kbd>
      )}
    </span>
  );
});
