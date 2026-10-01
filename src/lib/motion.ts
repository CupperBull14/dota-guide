import type { Variants } from 'framer-motion';

/** Кривая плавного замедления (cubic-bezier). */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Появление снизу при скролле. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

/** Контейнер, по очереди проявляющий детей. */
export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

/** Переход между страницами. */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } },
};

/** Микроанимации кнопок. */
export const buttonTap = { scale: 0.96 };
export const buttonHover = { y: -2 };
