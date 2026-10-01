import { motion } from 'framer-motion';
import { ArrowRight, Coins, Eye, GraduationCap, Map, Sprout } from 'lucide-react';
import { HEROES } from '@/data/heroes';
import { ButtonLink } from '@/components/ui/Button';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { HeroCard } from '@/components/heroes/HeroCard';

const BASICS = [
  { icon: Coins, title: 'Золото и добивания', text: 'Золото даёт только последний удар по крипу. Научись добивать — и предметы придут вовремя.' },
  { icon: Sprout, title: 'Опыт и уровни', text: 'Опыт получают все герои рядом с гибнущими врагами. Стой рядом с линией, даже если не добиваешь.' },
  { icon: Eye, title: 'Обзор и варды', text: 'Вард показывает врагов в тумане войны. Кто видит больше — тот выигрывает драки.' },
  { icon: Map, title: 'Карта и тайминги', text: 'Руны, Рошан и лагеря появляются по таймерам. Знать их — значит быть на шаг впереди.' },
];

/** Блок «Для новичков»: ключевые основы и герои, с которых стоит начать. */
export function BeginnerTeaser() {
  const starters = HEROES.filter((h) => h.goodForBeginners).slice(0, 3);

  return (
    <section aria-labelledby="beginners-title" className="relative py-16 sm:py-20">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-blood/[0.06] to-transparent"
      />
      <div className="container-page">
        <SectionTitle
          id="beginners-title"
          eyebrow="Для новичков"
          title="Первые шаги в Dota 2"
          description="Четыре идеи, которые делают из новичка полезного союзника. Подробный разбор и план на первые 10 матчей — в разделе для новичков."
          action={
            <ButtonLink to="/beginners" variant="outline" iconRight={<ArrowRight size={18} aria-hidden="true" />}>
              Открыть раздел
            </ButtonLink>
          }
        />

        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BASICS.map(({ icon: Icon, title, text }) => (
            <RevealItem key={title} as="article" className="panel h-full p-5">
              <motion.span
                whileHover={{ rotate: -8, scale: 1.08 }}
                className="grid h-11 w-11 place-items-center rounded-xl border border-blood/40 bg-blood/15 text-blood-light"
              >
                <Icon size={22} aria-hidden="true" />
              </motion.span>
              <h3 className="mt-4 font-sans text-base font-bold tracking-normal text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{text}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        {starters.length > 0 && (
          <Reveal className="mt-12">
            <h3 className="mb-5 flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.2em] text-gold">
              <GraduationCap size={16} aria-hidden="true" />
              С кого начать
            </h3>
            <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {starters.map((hero) => (
                <HeroCard key={hero.id} hero={hero} />
              ))}
            </RevealGroup>
          </Reveal>
        )}
      </div>
    </section>
  );
}
