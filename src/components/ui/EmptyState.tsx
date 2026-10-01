import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}

/** Пустое состояние: ничего не найдено, избранное пусто и т. п. */
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="panel flex flex-col items-center gap-4 px-6 py-14 text-center"
      role="status"
    >
      <div className="grid h-16 w-16 place-items-center rounded-2xl border border-gold/30 bg-gold/10 text-gold">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      {description && <p className="max-w-md text-ink-muted">{description}</p>}
      {action}
    </motion.div>
  );
}
