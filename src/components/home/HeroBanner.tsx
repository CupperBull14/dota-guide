import { motion } from 'framer-motion';
import { GraduationCap, Swords } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { PATCH } from '@/data/constants';
import { EASE_OUT, stagger } from '@/lib/motion';
import { GlobalSearch } from './GlobalSearch';
import { RandomHeroButton } from './RandomHeroButton';

const EMBERS = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 53) % 100}%`,
  delay: `${(i * 0.9) % 9}s`,
  duration: `${9 + ((i * 7) % 8)}s`,
  size: 2 + (i % 3),
}));

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

/** Главный баннер: анимированный градиентный фон, искры, заголовок, поиск и действия. */
export function HeroBanner() {
  return (
    <section aria-labelledby="home-title" className="relative isolate overflow-hidden">
      {/* Фон: дрейфующие пятна света, сетка и искры */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute -left-40 top-[-10rem] h-[36rem] w-[36rem] animate-drift rounded-full bg-blood/25 blur-[120px]" />
        <div
          className="absolute -right-32 top-10 h-[30rem] w-[30rem] animate-drift rounded-full bg-gold/15 blur-[120px]"
          style={{ animationDelay: '-9s' }}
        />
        <div className="absolute inset-0 bg-noise" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(#c8aa6e 1px, transparent 1px), linear-gradient(90deg, #c8aa6e 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
          }}
        />
        <div className="motion-decor absolute inset-0">
          {EMBERS.map((e, i) => (
            <span
              key={i}
              className="absolute bottom-0 animate-ember rounded-full bg-gold-light shadow-[0_0_8px_2px_rgba(224,84,63,0.7)]"
              style={{
                left: e.left,
                width: e.size,
                height: e.size,
                animationDelay: e.delay,
                animationDuration: e.duration,
              }}
            />
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
      </div>

      <motion.div
        className="container-page flex flex-col items-center py-20 text-center sm:py-28 lg:py-32"
        variants={stagger(0.12, 0.05)}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={item}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-gold-light"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-blood-light shadow-[0_0_8px_#e0543f]" aria-hidden="true" />
          Патч {PATCH}
        </motion.p>

        <motion.h1
          id="home-title"
          variants={item}
          className="max-w-4xl text-4xl font-extrabold leading-[1.1] sm:text-6xl lg:text-7xl"
        >
          Стань сильнее
          <br />
          <span className="animate-shimmer bg-[linear-gradient(110deg,#8f7746_20%,#e6cf9c_40%,#c8aa6e_50%,#e6cf9c_60%,#8f7746_80%)] bg-[length:200%_100%] bg-clip-text text-transparent">
            в каждой игре
          </span>
        </motion.h1>

        <motion.p variants={item} className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
          Гайды по героям с билдами и талантами, интерактивная карта и понятные основы для новичков —
          всё на русском.
        </motion.p>

        <motion.div variants={item} className="mt-10 flex w-full justify-center">
          <GlobalSearch />
        </motion.div>

        <motion.div variants={item} className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink to="/heroes" size="lg" icon={<Swords size={20} aria-hidden="true" />}>
            Все герои
          </ButtonLink>
          <RandomHeroButton />
          <ButtonLink
            to="/beginners"
            size="lg"
            variant="ghost"
            icon={<GraduationCap size={20} aria-hidden="true" />}
          >
            Я новичок
          </ButtonLink>
        </motion.div>
      </motion.div>
    </section>
  );
}
