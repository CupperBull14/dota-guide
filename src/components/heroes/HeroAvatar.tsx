import { memo, useState } from 'react';
import type { Hero } from '@/types/hero';
import { ATTRIBUTES } from '@/data/constants';
import { cn } from '@/lib/cn';

interface HeroAvatarProps {
  hero: Pick<Hero, 'name' | 'nameEn' | 'attribute' | 'imageUrl'>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: 'h-10 w-10 text-lg rounded-lg',
  md: 'h-16 w-16 text-3xl rounded-xl',
  lg: 'h-24 w-24 text-5xl rounded-2xl',
  xl: 'h-32 w-32 text-6xl rounded-3xl sm:h-40 sm:w-40 sm:text-7xl',
};

/**
 * Квадратный портрет героя: картинка imageUrl, а если её нет или она не загрузилась —
 * стилизованная заглушка (градиент цвета атрибута + первая буква английского имени).
 */
export const HeroAvatar = memo(function HeroAvatar({ hero, size = 'md', className }: HeroAvatarProps) {
  const color = ATTRIBUTES[hero.attribute].color;
  const [broken, setBroken] = useState(false);
  const showImage = Boolean(hero.imageUrl) && !broken;

  return (
    <div
      className={cn(
        'relative isolate grid shrink-0 place-items-center overflow-hidden border font-display font-bold',
        sizes[size],
        className,
      )}
      style={{
        borderColor: `${color}80`,
        background: `radial-gradient(circle at 30% 20%, ${color}cc 0%, ${color}55 38%, #0b0e14 100%)`,
      }}
      aria-hidden="true"
    >
      {showImage ? (
        <img
          src={hero.imageUrl}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setBroken(true)}
          className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
        />
      ) : (
        <>
          <span
            className="absolute inset-0 -z-10 opacity-40 mix-blend-overlay"
            style={{
              backgroundImage:
                'repeating-linear-gradient(135deg, rgba(255,255,255,0.12) 0 2px, transparent 2px 10px)',
            }}
          />
          <span className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            {hero.nameEn.charAt(0)}
          </span>
        </>
      )}
    </div>
  );
});
