import { memo } from 'react';
import { ExternalLink, ListOrdered } from 'lucide-react';
import { isWin, TURBO_MODE } from '@/lib/analysis';
import { matchUrl, type ODRecentMatch } from '@/lib/opendota';
import { cn } from '@/lib/cn';
import { HeroAvatar } from '@/components/heroes/HeroAvatar';
import { formatDuration, formatStart, matchHero, modeLabel } from './heroLookup';

/** Таблица последних матчей со ссылками на полный разбор на OpenDota. */
export const MatchTable = memo(function MatchTable({ matches }: { matches: ODRecentMatch[] }) {
  return (
    <section aria-labelledby="matches-title">
      <h2 id="matches-title" className="mb-4 flex items-center gap-2 font-sans text-xl font-bold tracking-normal">
        <ListOrdered size={20} aria-hidden="true" className="text-gold" />
        Матчи
      </h2>
      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <caption className="sr-only">Последние матчи игрока</caption>
          <thead className="border-b border-line text-xs uppercase tracking-[0.12em] text-ink-faint">
            <tr>
              <th scope="col" className="px-4 py-3 font-bold">Герой</th>
              <th scope="col" className="px-4 py-3 font-bold">Итог</th>
              <th scope="col" className="px-4 py-3 font-bold">K / D / A</th>
              <th scope="col" className="px-4 py-3 font-bold">Добивания</th>
              <th scope="col" className="px-4 py-3 font-bold">Золото/мин</th>
              <th scope="col" className="px-4 py-3 font-bold">Длительность</th>
              <th scope="col" className="px-4 py-3 font-bold"><span className="sr-only">Разбор</span></th>
            </tr>
          </thead>
          <tbody>
            {matches.map((m) => {
              const hero = matchHero(m.hero_id);
              const win = isWin(m);
              return (
                <tr
                  key={m.match_id}
                  className={cn(
                    'border-b border-line/60 transition-colors last:border-0 hover:bg-panel-raised',
                    m.game_mode === TURBO_MODE && 'opacity-75',
                  )}
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <HeroAvatar hero={hero} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate font-bold">{hero.name}</p>
                        <p className="text-xs text-ink-faint">
                          {modeLabel(m.game_mode, m.lobby_type)} · {formatStart(m.start_time)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={cn(
                        'inline-flex rounded-md border px-2 py-0.5 text-xs font-bold',
                        win ? 'border-[#56c271]/50 bg-[#56c271]/15 text-[#8fdca3]' : 'border-blood/50 bg-blood/15 text-[#f0a193]',
                      )}
                    >
                      {win ? 'Победа' : 'Поражение'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 tabular-nums">
                    {m.kills} / {m.deaths} / {m.assists}
                  </td>
                  <td className="px-4 py-2.5 tabular-nums">{m.last_hits}</td>
                  <td className="px-4 py-2.5 tabular-nums">{m.gold_per_min}</td>
                  <td className="px-4 py-2.5 tabular-nums">{formatDuration(m.duration)}</td>
                  <td className="px-4 py-2.5 text-right">
                    <a
                      href={matchUrl(m.match_id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-gold-light hover:text-gold"
                    >
                      Разбор
                      <ExternalLink size={14} aria-hidden="true" />
                      <span className="sr-only">матча {m.match_id} на OpenDota (новая вкладка)</span>
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
});
