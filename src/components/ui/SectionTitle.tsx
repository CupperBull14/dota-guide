import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';
import { cn } from '@/lib/cn';

interface SectionTitleProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
  action?: ReactNode;
  className?: string;
}

/** Заголовок секции: надзаголовок, заголовок Cinzel, описание, опциональное действие. */
export function SectionTitle({
  eyebrow,
  title,
  description,
  align = 'left',
  as: Tag = 'h2',
  id,
  action,
  className,
}: SectionTitleProps) {
  const centered = align === 'center';
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={cn(
        'mb-8 flex flex-col gap-4 sm:mb-10',
        centered ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className={cn('max-w-2xl', centered && 'mx-auto')}>
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-blood-light">
            {eyebrow}
          </p>
        )}
        <Tag id={id} className="text-2xl font-bold text-ink sm:text-3xl lg:text-4xl">
          {title}
        </Tag>
        {description && (
          <p className="mt-3 text-base leading-relaxed text-ink-muted">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  );
}
