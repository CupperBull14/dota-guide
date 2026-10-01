import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Анимированный счётчик: стартует, когда элемент попадает в область видимости.
 * При reduced-motion сразу показывает итоговое значение.
 */
export function useCountUp<T extends Element>(target: number, duration = 1400) {
  const ref = useRef<T | null>(null);
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? target : 0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setValue(target);
      return;
    }
    let frame = 0;
    let started = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (started || !entries.some((e) => e.isIntersecting)) return;
        started = true;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(target * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, duration, reduced]);

  return { ref, value };
}
