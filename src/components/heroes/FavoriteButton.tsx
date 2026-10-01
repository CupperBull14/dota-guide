import { memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/cn';

interface FavoriteButtonProps {
  heroId: string;
  heroName: string;
  size?: 'sm' | 'md';
  withLabel?: boolean;
  className?: string;
}

/** Переключатель «в избранное» с анимацией сердца. */
export const FavoriteButton = memo(function FavoriteButton({
  heroId,
  heroName,
  size = 'sm',
  withLabel = false,
  className,
}: FavoriteButtonProps) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(heroId);
  const label = active ? `Убрать ${heroName} из избранного` : `Добавить ${heroName} в избранное`;

  return (
    <motion.button
      type="button"
      aria-pressed={active}
      aria-label={withLabel ? undefined : label}
      title={label}
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        // Кнопка живёт внутри карточки-ссылки: не даём клику перейти по ссылке.
        e.preventDefault();
        e.stopPropagation();
        toggle(heroId);
      }}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-full border backdrop-blur transition-colors',
        size === 'sm' ? 'h-9 w-9' : 'h-11 px-4',
        active
          ? 'border-blood-light/60 bg-blood/25 text-blood-light'
          : 'border-line-strong bg-bg/70 text-ink-muted hover:border-gold/50 hover:text-gold-light',
        className,
      )}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={active ? 'on' : 'off'}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          className="inline-flex"
        >
          <Heart size={size === 'sm' ? 16 : 18} className={active ? 'fill-current' : ''} aria-hidden="true" />
        </motion.span>
      </AnimatePresence>
      {withLabel && (
        <span className="text-sm font-bold">{active ? 'В избранном' : 'В избранное'}</span>
      )}
    </motion.button>
  );
});
