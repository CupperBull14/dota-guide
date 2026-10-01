import { motion, useReducedMotion } from 'framer-motion';
import { Home, Swords } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { ButtonLink } from '@/components/ui/Button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { EASE_OUT } from '@/lib/motion';

/** 404: «потерянный в тумане войны» — пульсирующий вард и дрейфующий туман. */
export default function NotFoundPage() {
  useDocumentTitle('Страница не найдена');
  const { pathname } = useLocation();
  const reduced = useReducedMotion();

  return (
    <section
      aria-labelledby="nf-title"
      className="container-page relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden py-20 text-center"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 animate-drift rounded-full bg-blood/15 blur-[100px]" />
        <div
          className="absolute left-[20%] top-[30%] h-72 w-72 animate-drift rounded-full bg-ink/5 blur-[80px]"
          style={{ animationDelay: '-6s' }}
        />
      </div>

      <div className="relative mb-10 grid h-40 w-40 place-items-center" aria-hidden="true">
        <span className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-gold/60" />
        <span
          className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-gold/40"
          style={{ animationDelay: '0.7s' }}
        />
        <motion.svg
          viewBox="0 0 64 64"
          className="relative h-20 w-20"
          animate={reduced ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M32 6c7 8 12 15 12 24a12 12 0 0 1-24 0c0-9 5-16 12-24z" fill="#c8aa6e" />
          <circle cx="32" cy="30" r="5" fill="#0b0e14" />
          <rect x="30" y="42" width="4" height="16" rx="2" fill="#8f7746" />
        </motion.svg>
      </div>

      <motion.p
        initial={{ opacity: 0, scale: 0.8, filter: 'blur(12px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
        className="font-display text-8xl font-extrabold text-gold-gradient sm:text-9xl"
        aria-hidden="true"
      >
        404
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: EASE_OUT }}
      >
        <h1 id="nf-title" className="mt-4 text-2xl font-bold sm:text-3xl">
          Потерялись в тумане войны
        </h1>
        <p className="mx-auto mt-4 max-w-md text-ink-muted">
          Страницы <code className="rounded bg-panel-raised px-1.5 py-0.5 text-sm text-gold-light">{pathname}</code>{' '}
          нет на карте. Поставьте вард в другом месте — или вернитесь на базу.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/" icon={<Home size={18} aria-hidden="true" />}>
            На главную
          </ButtonLink>
          <ButtonLink to="/heroes" variant="outline" icon={<Swords size={18} aria-hidden="true" />}>
            К героям
          </ButtonLink>
        </div>
      </motion.div>
    </section>
  );
}
