import { SearchX } from 'lucide-react';
import { HEROES } from '@/data/heroes';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useHeroFilters } from '@/hooks/useHeroFilters';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { FilterBar } from '@/components/heroes/FilterBar';
import { HeroGrid } from '@/components/heroes/HeroGrid';

const pluralHeroes = (n: number) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return 'герой';
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'героя';
  return 'героев';
};

/** /heroes — каталог: фильтры, поиск, сортировка; состояние живёт в URL. */
export default function HeroesPage() {
  useDocumentTitle('Все герои');
  const { filters, results, update, setQuery, reset } = useHeroFilters(HEROES);

  return (
    <div className="container-page py-10 sm:py-14">
      <SectionTitle
        as="h1"
        eyebrow="Каталог"
        title="Все герои"
        description="Фильтруй по атрибуту, роли, сложности и линии. Внутри группы можно выбрать несколько вариантов — подойдёт любой из них."
      />

      <FilterBar
        heroes={HEROES}
        filters={filters}
        onChange={(patch) => update(patch)}
        onQueryChange={setQuery}
        onReset={reset}
      />

      <p className="mb-5 mt-8 text-sm font-semibold text-ink-muted" role="status" aria-live="polite">
        {results.length === HEROES.length
          ? `Показаны все ${HEROES.length} ${pluralHeroes(HEROES.length)}`
          : `Найдено: ${results.length} ${pluralHeroes(results.length)} из ${HEROES.length}`}
      </p>

      {results.length > 0 ? (
        <HeroGrid heroes={results} />
      ) : (
        <EmptyState
          icon={<SearchX size={28} aria-hidden="true" />}
          title="Таких героев нет"
          description="Попробуй убрать часть фильтров или изменить запрос."
          action={
            <Button variant="outline" onClick={reset}>
              Сбросить фильтры
            </Button>
          }
        />
      )}
    </div>
  );
}
