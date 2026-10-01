import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface HeroRenderProps {
  src?: string;
  color: string;
  className?: string;
}

/** Полноростовый рендер героя для баннера. Пока не загрузился — не показывается вовсе. */
export function HeroRender({ src, color, className }: HeroRenderProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;

  return (
    <div aria-hidden="true" className={cn('pointer-events-none', className)}>
      <span
        className="absolute bottom-[10%] left-1/2 h-2/3 w-2/3 -translate-x-1/2 rounded-full blur-[90px] transition-opacity duration-700"
        style={{ backgroundColor: color, opacity: loaded ? 0.35 : 0 }}
      />
      <motion.img
        src={src}
        alt=""
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        initial={false}
        animate={loaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-full w-full object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
        style={{
          maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
        }}
      />
    </div>
  );
}
