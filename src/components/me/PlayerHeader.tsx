import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Medal, RefreshCw, UserRound } from 'lucide-react';
import { playerUrl, rankName, type ODPlayer } from '@/lib/opendota';
import { fadeUp } from '@/lib/motion';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface PlayerHeaderProps {
  accountId: number;
  player: ODPlayer;
  onRefresh?: () => void;
}

/** Шапка игрока: аватар Steam, ник, медаль и ссылка на полный профиль OpenDota. */
export function PlayerHeader({ accountId, player, onRefresh }: PlayerHeaderProps) {
  const [avatarBroken, setAvatarBroken] = useState(false);
  const name = player.profile?.personaname?.trim() || `Игрок ${accountId}`;
  const avatar = player.profile?.avatarfull;
  const rank = rankName(player.rank_tier);

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      aria-label="Профиль игрока"
      className="panel relative overflow-hidden p-5 sm:p-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(200,170,110,0.18),transparent_55%)]"
      />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-gold/40 bg-panel-raised text-gold">
          {avatar && !avatarBroken ? (
            <img
              src={avatar}
              alt=""
              className="h-full w-full object-cover"
              onError={() => setAvatarBroken(true)}
            />
          ) : (
            <UserRound size={36} aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-sans text-2xl font-bold tracking-normal">{name}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge tone="neutral">ID {accountId}</Badge>
            {rank ? (
              <Badge tone="gold" icon={<Medal size={12} aria-hidden="true" />}>
                {rank}
                {player.leaderboard_rank ? ` · №${player.leaderboard_rank}` : ''}
              </Badge>
            ) : (
              <Badge tone="neutral" icon={<Medal size={12} aria-hidden="true" />}>
                Ранг скрыт или не откалиброван
              </Badge>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {onRefresh && (
            <Button size="sm" variant="ghost" onClick={onRefresh} icon={<RefreshCw size={16} aria-hidden="true" />}>
              Обновить
            </Button>
          )}
          <a
            href={playerUrl(accountId)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-gold/40 px-3.5 text-sm font-bold text-gold-light transition-colors hover:border-gold hover:bg-gold/10"
          >
            Профиль на OpenDota
            <ExternalLink size={14} aria-hidden="true" />
            <span className="sr-only">(откроется в новой вкладке)</span>
          </a>
        </div>
      </div>
    </motion.section>
  );
}
