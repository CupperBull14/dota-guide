import { ArrowRight, BookA, Compass, Flag, GraduationCap, Sparkles } from 'lucide-react';
import { HEROES } from '@/data/heroes';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal, RevealGroup } from '@/components/ui/Reveal';
import { HeroCard } from '@/components/heroes/HeroCard';
import { BasicsSection } from '@/components/beginners/BasicsSection';
import { Roadmap } from '@/components/beginners/Roadmap';
import { Glossary } from '@/components/beginners/Glossary';

const JUMPS = [
  { href: '#basics', label: 'Основы', icon: Compass },
  { href: '#roadmap', label: 'Первые 10 матчей', icon: Flag },
  { href: '#glossary', label: 'Глоссарий', icon: BookA },
  { href: '#starter-heroes', label: 'С кого начать', icon: Sparkles },
];

/** /beginners — основы, роадмап, глоссарий и герои для новичков. */
export default function BeginnersPage() {
  useDocumentTitle('Новичкам');
  const starters = HEROES.filter((h) => h.goodForBeginners).sort((a, b) => a.complexity - b.complexity);

  return (
    <div className="container-page py-10 sm:py-14">
      <SectionTitle
        as="h1"
        eyebrow="Новичкам"
        title={
          <span className="flex items-center gap-3">
            <GraduationCap size={36} aria-hidden="true" className="shrink-0 text-gold" />
            Первые шаги в Dota 2
          </span>
        }
        description="Всё, что нужно знать в первых матчах: как устроена игра, что тренировать по порядку и что значат слова, которые пишут в чате."
      />

      <Reveal>
        <nav aria-label="Разделы страницы" className="mb-4 flex flex-wrap gap-2">
          {JUMPS.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-panel px-4 py-2 text-sm font-bold text-ink-muted transition-colors hover:border-gold/60 hover:text-gold-light"
            >
              <Icon size={16} aria-hidden="true" className="text-gold" />
              {label}
            </a>
          ))}
        </nav>
      </Reveal>

      <section id="basics" aria-labelledby="basics-title" className="scroll-mt-24 py-10">
        <SectionTitle id="basics-title" eyebrow="Основы" title="Как устроена игра" />
        <BasicsSection />
      </section>

      <section id="roadmap" aria-labelledby="roadmap-title" className="scroll-mt-24 py-10">
        <SectionTitle
          id="roadmap-title"
          eyebrow="Роадмап"
          title="Первые 10 матчей"
          description="Один навык на матч. Отмечай пройденные шаги — прогресс сохранится в браузере."
        />
        <Roadmap />
      </section>

      <section id="glossary" aria-labelledby="glossary-title" className="scroll-mt-24 py-10">
        <SectionTitle
          id="glossary-title"
          eyebrow="Глоссарий"
          title="Словарь игрока"
          description="Сленг и термины, которые ты услышишь в каждой игре."
        />
        <Glossary />
      </section>

      <section id="starter-heroes" aria-labelledby="starters-title" className="scroll-mt-24 py-10">
        <SectionTitle
          id="starters-title"
          eyebrow="Герои"
          title="С кого начать"
          description="Герои с пометкой «Подходит новичку» — простые и прощающие ошибки."
          action={
            <ButtonLink
              to="/heroes?beginner=1"
              variant="outline"
              iconRight={<ArrowRight size={18} aria-hidden="true" />}
            >
              Все в каталоге
            </ButtonLink>
          }
        />
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {starters.map((hero) => (
            <HeroCard key={hero.id} hero={hero} />
          ))}
        </RevealGroup>
      </section>
    </div>
  );
}
