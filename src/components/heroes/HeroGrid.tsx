import { AnimatePresence, motion } from 'framer-motion';
import type { Hero } from '@/types/hero';
import { HeroCard } from './HeroCard';

interface HeroGridProps {
  heroes: readonly Hero[];
}

const item = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.94, transition: { duration: 0.18 } },
};

/**
 * Сетка карточек с layout-анимацией: при смене фильтров карточки
 * плавно исчезают, появляются и перестраиваются на новые места.
 */
export function HeroGrid({ heroes }: HeroGridProps) {
  return (
    <motion.ul layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="list">
      <AnimatePresence mode="popLayout" initial={false}>
        {heroes.map((hero) => (
          <motion.li
            key={hero.id}
            layout
            variants={item}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ layout: { type: 'spring', stiffness: 350, damping: 32 } }}
            className="h-full"
          >
            <HeroCard hero={hero} />
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}
