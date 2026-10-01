import { memo, useState, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface GameIconProps {
  src?: string;
  /** Что показать, пока картинки нет или она не загрузилась. */
  fallback: ReactNode;
  className?: string;
  imgClassName?: string;
  alt?: string;
  style?: CSSProperties;
}

/**
 * Иконка из игры (способность, предмет, атрибут) с плавным появлением
 * и откатом на стилизованную заглушку, если картинка недоступна.
 */
export const GameIcon = memo(function GameIcon({ src, fallback, className, imgClassName, alt = '', style }: GameIconProps) {
  const [state, setState] = useState<'loading' | 'ok' | 'error'>(src ? 'loading' : 'error');
  return (
    <span style={style} className={cn('relative inline-grid shrink-0 place-items-center overflow-hidden', className)}>
      {state !== 'ok' && <span className="absolute inset-0 grid place-items-center">{fallback}</span>}
      {src && state !== 'error' && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setState('ok')}
          onError={() => setState('error')}
          className={cn(
            'relative h-full w-full object-cover transition-opacity duration-300',
            state === 'ok' ? 'opacity-100' : 'opacity-0',
            imgClassName,
          )}
        />
      )}
    </span>
  );
});
