import { useEffect, useMemo, useState } from 'react';
import { Heart, HeartOff, Swords, Trash2 } from 'lucide-react';
import { HEROES } from '@/data/heroes';
import { useFavorites } from '@/hooks/useFavorites';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button, ButtonLink } from '@/components/ui/Button';
import { HeroGrid } from '@/components/heroes/HeroGrid';

/** /favorites — избранные герои из localStorage. */
export default function FavoritesPage() {
  useDocumentTitle('Избранное');
  const { favorites, clear } = useFavorites();
  const [confirming, setConfirming] = useState(false);

  // Порядок — как добавляли; несуществующие id (после удаления героя из базы) пропускаем.
  const heroes = useMemo(
    () => favorites.map((id) => HEROES.find((h) => h.id === id)).filter((h) => h !== undefined),
    [favorites],
  );

  // Кнопка подтверждения сама «остывает» через 4 секунды.
  useEffect(() => {
    if (!confirming) return;
    const t = window.setTimeout(() => setConfirming(false), 4000);
    return () => window.clearTimeout(t);
  }, [confirming]);

  return (
    <div className="container-page py-10 sm:py-14">
      <SectionTitle
        as="h1"
        eyebrow="Избранное"
        title={
          <span className="flex items-center gap-3">
            <Heart size={34} aria-hidden="true" className="shrink-0 fill-blood text-blood-light" />
            Мои герои
          </span>
        }
        description="Герои, которых ты отметил сердечком. Список хранится в этом браузере."
        action={
          heroes.length > 0 ? (
            <Button
              variant={confirming ? 'primary' : 'ghost'}
              icon={<Trash2 size={16} aria-hidden="true" />}
              onClick={() => {
                if (confirming) {
                  clear();
                  setConfirming(false);
                } else {
                  setConfirming(true);
                }
              }}
            >
              {confirming ? 'Нажми ещё раз, чтобы очистить' : 'Очистить список'}
            </Button>
          ) : undefined
        }
      />

      {heroes.length > 0 ? (
        <>
          <p className="mb-5 text-sm font-semibold text-ink-muted" role="status" aria-live="polite">
            В избранном: {heroes.length}
          </p>
          <HeroGrid heroes={heroes} />
        </>
      ) : (
        <EmptyState
          icon={<HeartOff size={28} aria-hidden="true" />}
          title="Пока пусто"
          description="Нажми на сердечко на карточке или странице героя — и он появится здесь."
          action={
            <ButtonLink to="/heroes" icon={<Swords size={18} aria-hidden="true" />}>
              К героям
            </ButtonLink>
          }
        />
      )}
    </div>
  );
}
