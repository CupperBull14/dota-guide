/**
 * Клиент открытого API OpenDota (https://docs.opendota.com) — бесплатно, без ключа.
 * Запросы идут прямо из браузера пользователя; ограничение OpenDota — около 60 запросов в минуту.
 */

export const OPENDOTA_API = 'https://api.opendota.com/api';

/** Разница между 64-битным SteamID и 32-битным ID аккаунта Dota. */
const STEAM64_BASE = 76561197960265728n;

// ─────────────────────────── Типы ответов API ───────────────────────────

export interface ODProfile {
  account_id: number;
  personaname: string | null;
  avatarfull?: string | null;
  avatarmedium?: string | null;
  profileurl?: string | null;
}

export interface ODPlayer {
  profile?: ODProfile | null;
  rank_tier?: number | null;
  leaderboard_rank?: number | null;
}

/** Элемент /players/{id}/recentMatches (формат сверен с живым ответом API). */
export interface ODRecentMatch {
  match_id: number;
  player_slot: number;
  radiant_win: boolean;
  hero_id: number;
  start_time: number;
  duration: number;
  game_mode: number;
  lobby_type: number;
  kills: number;
  deaths: number;
  assists: number;
  xp_per_min: number;
  gold_per_min: number;
  hero_damage: number;
  tower_damage: number;
  hero_healing: number;
  last_hits: number;
  lane?: number | null;
  lane_role?: number | null;
  is_roaming?: boolean | null;
  leaver_status?: number;
  party_size?: number | null;
}

export interface ODBenchmarkPoint {
  percentile: number;
  value: number;
}

/** /benchmarks?hero_id=… — распределение показателей по герою. */
export interface ODBenchmarks {
  hero_id: number;
  result: Partial<
    Record<
      | 'gold_per_min'
      | 'xp_per_min'
      | 'kills_per_min'
      | 'deaths_per_min'
      | 'assists_per_min'
      | 'last_hits_per_min'
      | 'denies_per_min'
      | 'hero_damage_per_min'
      | 'hero_healing_per_min'
      | 'tower_damage',
      ODBenchmarkPoint[]
    >
  >;
}

// ─────────────────────────── Ввод аккаунта ───────────────────────────

export type AccountParse = { ok: true; accountId: number } | { ok: false; reason: 'empty' | 'vanity' | 'invalid' };

/**
 * Понимает: 32-битный ID (Friend ID в клиенте Dota), 64-битный SteamID,
 * ссылки на steamcommunity.com/profiles/…, dotabuff, opendota и stratz.
 * Ссылку вида steamcommunity.com/id/имя без ключа Steam API превратить в ID нельзя.
 */
export function parseAccountInput(raw: string): AccountParse {
  const input = raw.trim();
  if (!input) return { ok: false, reason: 'empty' };
  if (/steamcommunity\.com\/id\//i.test(input)) return { ok: false, reason: 'vanity' };

  const fromUrl =
    /steamcommunity\.com\/profiles\/(\d{17})/i.exec(input)?.[1] ??
    /(?:dotabuff\.com|opendota\.com|stratz\.com)\/players\/(\d{1,17})/i.exec(input)?.[1];
  const digits = fromUrl ?? (/^\d+$/.test(input) ? input : null);
  if (!digits) return { ok: false, reason: 'invalid' };

  const n = BigInt(digits);
  if (digits.length === 17 && n > STEAM64_BASE) {
    return { ok: true, accountId: Number(n - STEAM64_BASE) };
  }
  if (digits.length <= 10 && n > 0n && n < 4294967296n) return { ok: true, accountId: Number(n) };
  return { ok: false, reason: 'invalid' };
}

// ─────────────────────────── Запросы ───────────────────────────

export type ODErrorKind = 'network' | 'not-found' | 'rate-limit' | 'server';

export class OpenDotaError extends Error {
  constructor(
    public kind: ODErrorKind,
    message: string,
  ) {
    super(message);
  }
}

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${OPENDOTA_API}${path}`, { signal });
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw error;
    throw new OpenDotaError('network', 'Нет связи с OpenDota');
  }
  if (res.status === 404) throw new OpenDotaError('not-found', 'Игрок не найден');
  if (res.status === 429) throw new OpenDotaError('rate-limit', 'Слишком много запросов');
  if (!res.ok) throw new OpenDotaError('server', `OpenDota ответил ${res.status}`);
  return (await res.json()) as T;
}

export const fetchPlayer = (id: number, signal?: AbortSignal) => getJson<ODPlayer>(`/players/${id}`, signal);

export const fetchRecentMatches = (id: number, signal?: AbortSignal) =>
  getJson<ODRecentMatch[]>(`/players/${id}/recentMatches`, signal);

export const fetchBenchmarks = (heroId: number, signal?: AbortSignal) =>
  getJson<ODBenchmarks>(`/benchmarks?hero_id=${heroId}`, signal);

export const matchUrl = (matchId: number) => `https://www.opendota.com/matches/${matchId}`;
export const playerUrl = (accountId: number) => `https://www.opendota.com/players/${accountId}`;

// ─────────────────────────── Ранг ───────────────────────────

const MEDALS = ['Рекрут', 'Страж', 'Рыцарь', 'Герой', 'Легенда', 'Властелин', 'Божество', 'Титан'];

/** rank_tier: десятки — медаль (1 Рекрут … 8 Титан), единицы — звёзды. */
export function rankName(rankTier?: number | null): string | null {
  if (!rankTier) return null;
  const medal = MEDALS[Math.floor(rankTier / 10) - 1];
  if (!medal) return null;
  const stars = rankTier % 10;
  return medal === 'Титан' || !stars ? medal : `${medal} ${stars}`;
}
