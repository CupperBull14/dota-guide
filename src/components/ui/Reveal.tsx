import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, stagger } from '@/lib/motion';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'ul' | 'li' | 'article';
}

/** Появление блока снизу при попадании в область видимости. */
export function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
  step?: number;
  as?: 'div' | 'ul' | 'section';
}

/** Контейнер для поочерёдного появления детей (дети — RevealItem). */
export function RevealGroup({ children, className, step = 0.08, as = 'div' }: RevealGroupProps) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      variants={stagger(step)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </Component>
  );
}

interface RevealItemProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'article';
}

export function RevealItem({ children, className, as = 'div' }: RevealItemProps) {
  const Component = motion[as];
  return (
    <Component className={className} variants={fadeUp}>
      {children}
    </Component>
  );
}
