import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { HEROES, getHeroById } from '@/data/heroes';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { HeroHero } from '@/components/hero-page/HeroHero';
import { SectionNav, type SectionLink } from '@/components/hero-page/SectionNav';
import { HeroSection } from '@/components/hero-page/HeroSection';
import { BeginnerVerdict } from '@/components/hero-page/BeginnerVerdict';
import { AbilityList } from '@/components/hero-page/AbilityList';
import { InvokedSpells } from '@/components/hero-page/InvokedSpells';
import { SkillBuild } from '@/components/hero-page/SkillBuild';
import { TalentTree } from '@/components/hero-page/TalentTree';
import { ItemBuild } from '@/components/hero-page/ItemBuild';
import { GamePhaseTactics } from '@/components/hero-page/GamePhaseTactics';
import { HeroRelations } from '@/components/hero-page/HeroRelations';
import { HeroTips } from '@/components/hero-page/HeroTips';
import { HeroPager } from '@/components/hero-page/HeroPager';
import NotFoundPage from './NotFoundPage';

const ALPHABETICAL = [...HEROES].sort((a, b) => a.name.localeCompare(b.name, 'ru'));

/** /heroes/:slug — полный гайд по герою. Неизвестный slug → 404. */
export default function HeroDetailPage() {
  const { slug = '' } = useParams();
  const hero = getHeroById(slug);
  useDocumentTitle(hero ? `${hero.name} (${hero.nameEn}) — гайд` : 'Страница не найдена');

  const sections = useMemo<SectionLink[]>(() => {
    if (!hero) return [];
    return [
      { id: 'beginner', label: 'Новичку' },
      { id: 'abilities', label: 'Способности' },
      ...(hero.invokedSpells ? [{ id: 'spells', label: 'Заклинания' }] : []),
      { id: 'skills', label: 'Прокачка' },
      { id: 'talents', label: 'Таланты' },
      { id: 'items', label: 'Предметы' },
      { id: 'tactics', label: 'Тактика' },
      { id: 'matchups', label: 'Матчапы' },
      { id: 'tips', label: 'Советы' },
    ];
  }, [hero]);

  if (!hero) return <NotFoundPage />;

  const index = ALPHABETICAL.findIndex((h) => h.id === hero.id);
  const prev = ALPHABETICAL[(index - 1 + ALPHABETICAL.length) % ALPHABETICAL.length] ?? hero;
  const next = ALPHABETICAL[(index + 1) % ALPHABETICAL.length] ?? hero;

  return (
    <article>
      <HeroHero hero={hero} />

      <div className="container-page">
        <SectionNav sections={sections} />

        <HeroSection id="beginner" title="Подходит ли новичку">
          <BeginnerVerdict hero={hero} />
        </HeroSection>

        <HeroSection id="abilities" title="Способности" subtitle="Нажми на способность, чтобы раскрыть советы.">
          <AbilityList abilities={hero.abilities} />
        </HeroSection>

        {hero.invokedSpells && (
          <HeroSection
            id="spells"
            title="Заклинания из сфер"
            subtitle="Собери три сферы и нажми Призыв (R). Порядок сфер не важен."
          >
            <InvokedSpells spells={hero.invokedSpells} />
          </HeroSection>
        )}

        <HeroSection id="skills" title="Порядок прокачки">
          <SkillBuild build={hero.skillBuild} abilities={hero.abilities} />
        </HeroSection>

        <HeroSection id="talents" title="Таланты" subtitle="Золотом отмечен рекомендуемый выбор и почему.">
          <TalentTree talents={hero.talents} />
        </HeroSection>

        <HeroSection id="items" title="Предметы">
          <ItemBuild items={hero.items} />
        </HeroSection>

        <HeroSection id="tactics" title="Тактика по этапам игры">
          <GamePhaseTactics tactics={hero.tactics} />
        </HeroSection>

        <HeroSection id="matchups" title="Контрпики и синергии">
          <HeroRelations counters={hero.counters} synergies={hero.synergies} />
        </HeroSection>

        <HeroSection id="tips" title="Советы">
          <HeroTips tips={hero.tips} />
        </HeroSection>

        <div className="pb-4">
          <HeroPager prev={prev} next={next} />
          <Link
            to="/heroes"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-ink-muted transition-colors hover:text-gold-light"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Ко всем героям
          </Link>
        </div>
      </div>
    </article>
  );
}
