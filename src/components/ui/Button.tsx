import { forwardRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/cn';
import { buttonHover, buttonTap } from '@/lib/motion';

type Variant = 'primary' | 'gold' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary:
    'bg-blood-sheen text-white shadow-glow-blood hover:brightness-110 border border-blood-light/40',
  gold: 'bg-gold-sheen text-bg shadow-glow-gold hover:brightness-110 border border-gold-light/50',
  outline: 'border border-gold/40 text-gold-light hover:border-gold hover:bg-gold/10',
  ghost: 'text-ink-muted hover:text-ink hover:bg-panel-raised',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-14 px-7 text-base gap-2.5',
};

const base =
  'inline-flex select-none items-center justify-center rounded-xl font-bold tracking-wide transition-[filter,background-color,border-color,color] duration-200 disabled:pointer-events-none disabled:opacity-50';

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
  className?: string;
}

type ButtonProps = CommonProps & Omit<HTMLMotionProps<'button'>, 'children' | 'className'>;

/** Кнопка с микроанимациями наведения и нажатия. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', icon, iconRight, children, className, type = 'button', ...rest },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type={type}
      whileHover={buttonHover}
      whileTap={buttonTap}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {icon}
      {children}
      {iconRight}
    </motion.button>
  );
});

const MotionLink = motion.create(Link);

interface ButtonLinkProps extends CommonProps {
  to: string;
  'aria-label'?: string;
}

/** Ссылка, оформленная как кнопка (внутренняя навигация). */
export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  children,
  className,
  ...rest
}: ButtonLinkProps) {
  return (
    <MotionLink
      to={to}
      whileHover={buttonHover}
      whileTap={buttonTap}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {icon}
      {children}
      {iconRight}
    </MotionLink>
  );
}
