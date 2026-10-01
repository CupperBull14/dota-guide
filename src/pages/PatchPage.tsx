import { Link } from 'react-router-dom';
import { ArrowRight, Droplet, History, RefreshCw, Sparkles, type LucideIcon } from 'lucide-react';
import { CHANGELOG, DATA_META } from '@/data/live';
import { getHeroById } from '@/data/heroes';
import type { ChangeEntry } from '@/lib/feed';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { HeroAvatar } from '@/components/heroes/HeroAvatar';

const KIND: Record<ChangeEntry['kind'], { icon: LucideIcon; label: string }> = {
  talent: { icon: Sparkles, label: 'Талант' },
  cooldown: { icon: RefreshCw, label: 'Перезарядка' },
  mana: { icon: Droplet, label: 'Мана' },
};

const formatDate = (iso: string) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

/** /patch — что изменилось у героев сайта между обновлениями данных. */
export default function PatchPage() {
  useDocumentTitle('Изменения патча');

  return (
    <div className="container-page py-10 sm:py-14">
      <SectionTitle
        as="h1"
        eyebrow="Патчи"
        title={
          <span className="flex items-center gap-3">
            <History size={34} aria-hidden="true" className="shrink-0 text-gold" />
            Что изменилось
          </span>
        }
        description={`Таланты, перезарядки и расход маны сверяются с официальным сайтом Dota 2. Текущий патч — ${DATA_META.patch}${
          DATA_META.updatedAt ? `, данные обновлены ${formatDate(DATA_META.updatedAt)}` : ''
        }.`}
      />

      {CHANGELOG.length === 0 ? (
        <EmptyState
          icon={<History size={28} aria-hidden="true" />}
          title="Пока без изменений"
          description="История начнётся со следующего обновления данных: как только Valve выпустит патч, здесь появится список того, что поменялось у героев."
        />
      ) : (
        <div className="space-y-14">
          {CHANGELOG.map((patch) => (
            <section key={patch.patch} aria-labelledby={`patch-${patch.patch}`}>
              <Reveal className="mb-5 flex flex-wrap items-center gap-3">
                <h2 id={`patch-${patch.patch}`} className="text-2xl font-bold sm:text-3xl">
                  Патч {patch.patch}
                </h2>
                <Badge tone="gold">{formatDate(patch.date)}</Badge>
                <Badge>
                  {patch.heroes.length} {patch.heroes.length === 1 ? 'герой' : 'героя(ев)'}
                </Badge>
              </Reveal>
              <RevealGroup className="grid gap-5 lg:grid-cols-2">
                {patch.heroes.map((h) => {
                  const hero = getHeroById(h.slug);
                  return (
                    <RevealItem key={h.slug} as="article" className="panel p-5">
                      <div className="mb-4 flex items-center gap-3">
                        {hero && <HeroAvatar hero={hero} size="sm" />}
                        <h3 className="flex-1 font-sans text-lg font-bold tracking-normal">
                          {hero ? hero.name : h.slug}
                        </h3>
                        {hero && (
                          <Link
                            to={`/heroes/${hero.id}`}
                            className="inline-flex items-center gap-1 text-sm font-bold text-gold-light hover:text-gold"
                          >
                            Гайд
                            <ArrowRight size={14} aria-hidden="true" />
                          </Link>
                        )}
                      </div>
                      <ul className="space-y-3">
                        {h.changes.map((c, i) => {
                          const { icon: Icon } = KIND[c.kind];
                          return (
                            <li key={i} className="rounded-xl border border-line bg-bg-deep/50 p-3 text-sm">
                              <p className="flex items-center gap-2 font-bold text-ink">
                                <Icon size={14} aria-hidden="true" className="text-gold" />
                                {c.label}
                              </p>
                              <p className="mt-1.5 text-ink-faint line-through decoration-blood/60">
                                <span className="sr-only">Было: </span>
                                {c.before || '—'}
                              </p>
                              <p className="mt-1 flex gap-1.5 font-semibold text-gold-light">
                                <ArrowRight size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
                                <span className="sr-only">Стало: </span>
                                {c.after || '—'}
                              </p>
                            </li>
                          );
                        })}
                      </ul>
                    </RevealItem>
                  );
                })}
              </RevealGroup>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
