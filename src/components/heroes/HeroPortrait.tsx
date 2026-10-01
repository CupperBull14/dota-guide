import { memo, useState } from 'react';
import type { Hero } from '@/types/hero';
import { ATTRIBUTES } from '@/data/constants';
import { cn } from '@/lib/cn';

interface HeroPortraitProps {
  hero: Pick<Hero, 'name' | 'nameEn' | 'attribute' | 'imageUrl'>;
  className?: string;
  /** Загружать сразу (для первого экрана) или лениво. */
  eager?: boolean;
}

/**
 * Широкий портрет героя (16:9) для карточек.
 * Пока картинка грузится или если не загрузилась — градиент атрибута с буквой.
 */
export const HeroPortrait = memo(function HeroPortrait({ hero, className, eager = false }: HeroPortraitProps) {
  const color = ATTRIBUTES[hero.attribute].color;
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(hero.imageUrl ? 'loading' : 'error');

  return (
    <div
      aria-hidden="true"
      className={cn('relative isolate overflow-hidden', className)}
      style={{ background: `radial-gradient(circle at 30% 30%, ${color}aa 0%, ${color}33 45%, #0b0e14 100%)` }}
    >
      {status !== 'loaded' && (
        <span className="absolute inset-0 grid place-items-center font-display text-5xl font-bold text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          {hero.nameEn.charAt(0)}
        </span>
      )}
      {hero.imageUrl && status !== 'error' && (
        <img
          src={hero.imageUrl}
          alt=""
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-500',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}
    </div>
  );
});
