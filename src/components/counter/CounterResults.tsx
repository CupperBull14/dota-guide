import { Link } from 'react-router-dom';
import { BookOpen, Lightbulb, ShieldAlert, ShieldCheck, ShoppingBag } from 'lucide-react';
import type { CounterAnalysis } from '@/lib/counter';
import { TRAITS } from '@/data/counter';
import { getItem } from '@/data/items';
import { heroPortraitUrl } from '@/data/allHeroes';
import { HeroAvatar } from '@/components/heroes/HeroAvatar';
import { ItemIcon } from '@/components/ui/ItemIcon';
import { Badge } from '@/components/ui/Badge';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import { hasGuide, heroName } from './useHeroOptions';

interface CounterResultsProps {
  analysis: CounterAnalysis;
  hasMe: boolean;
  myName?: string;
}

const avatar = (e: CounterAnalysis['threats'][number]['enemy']) => ({
  name: heroName(e.slug, e.name),
  nameEn: e.name,
  attribute: e.attribute,
  imageUrl: heroPortraitUrl(e),
});

/** Результат: опасные враги, черты команды и предметы. */
export function CounterResults({ analysis, hasMe, myName }: CounterResultsProps) {
  const { threats, traits, items } = analysis;
  const top = threats.slice(0, 3);

  return (
    <div className="space-y-10">
      {hasMe && (
        <section aria-labelledby="threats-title">
          <h2 id="threats-title" className="mb-4 flex items-center gap-2 text-2xl font-bold">
            <ShieldAlert size={24} aria-hidden="true" className="text-blood-light" />
            Самые опасные для {myName ? `«${myName}»` : 'тебя'}
          </h2>
          <RevealGroup as="ul" className="grid gap-4 md:grid-cols-3">
            {top.map((t, i) => {
              const name = heroName(t.enemy.slug, t.enemy.name);
              return (
                <RevealItem as="li" key={t.enemy.slug} className="panel p-5">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-2xl font-extrabold text-blood-light" aria-hidden="true">
                      {i + 1}
                    </span>
                    <HeroAvatar hero={avatar(t.enemy)} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold">{name}</span>
                      {hasGuide(t.enemy.slug) && (
                        <Link to={`/heroes/${t.enemy.slug}`} className="text-xs font-bold text-gold-light hover:text-gold">
                          Гайд по герою
                        </Link>
                      )}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-sm text-ink-muted">
                    {t.reasons.map((r) => (
                      <li key={r}>• {r}</li>
                    ))}
                  </ul>
                  {t.youCounter && (
                    <p className="mt-3 flex gap-2 rounded-lg bg-attr-agi/10 p-2 text-sm text-attr-agi">
                      <ShieldCheck size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
                      Но ты силён против него: {t.youCounter}
                    </p>
                  )}
                </RevealItem>
              );
            })}
          </RevealGroup>
        </section>
      )}

      <section aria-labelledby="buy-title">
        <h2 id="buy-title" className="mb-4 flex items-center gap-2 text-2xl font-bold">
          <ShoppingBag size={24} aria-hidden="true" className="text-gold" />
          Что купить
        </h2>
        <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((advice) => {
            const item = getItem(advice.itemId);
            return (
              <RevealItem as="li" key={advice.itemId} className="panel flex gap-4 p-4">
                <ItemIcon item={item} className="w-16" />
                <div className="min-w-0">
                  <p className="font-bold text-ink">{item.name}</p>
                  <p className="mt-0.5 text-xs text-ink-faint">{item.nameEn}</p>
                  <p className="mt-2 text-sm text-ink-muted">
                    Против: {advice.against.map((h) => heroName(h.slug, h.name)).join(', ')}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {advice.traits.map((t) => (
                      <Badge key={t}>{TRAITS[t].label}</Badge>
                    ))}
                    {advice.inGuide && (
                      <Badge tone="gold" icon={<BookOpen size={12} aria-hidden="true" />}>
                        Есть в гайде
                      </Badge>
                    )}
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
        {!hasMe && (
          <p className="mt-3 text-sm text-ink-faint">
            Выбери своего героя — подсказки станут точнее: керри не посоветуем саппортские предметы и наоборот.
          </p>
        )}
      </section>

      <section aria-labelledby="traits-title">
        <h2 id="traits-title" className="mb-4 flex items-center gap-2 text-2xl font-bold">
          <Lightbulb size={24} aria-hidden="true" className="text-gold" />
          Чего ждать от врагов
        </h2>
        <RevealGroup as="ul" className="grid gap-4 md:grid-cols-2">
          {traits.map((g) => {
            const meta = TRAITS[g.trait];
            const Icon = meta.icon;
            return (
              <RevealItem as="li" key={g.trait} className="panel p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-gold/40 bg-gold/10 text-gold">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <h3 className="flex-1 font-sans text-lg font-bold tracking-normal">{meta.label}</h3>
                  <span className="flex -space-x-2">
                    {g.heroes.map((h) => (
                      <HeroAvatar key={h.slug} hero={avatar(h)} size="sm" className="!h-8 !w-8 ring-2 ring-panel" />
                    ))}
                  </span>
                </div>
                <p className="mt-3 text-sm text-ink">{meta.danger}</p>
                <p className="mt-2 text-sm text-ink-muted">{meta.tip}</p>
                <p className="mt-2 text-xs text-ink-faint">
                  {g.heroes.map((h) => heroName(h.slug, h.name)).join(', ')}
                </p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>
    </div>
  );
}
