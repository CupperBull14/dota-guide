import {
  Activity,
  ShieldHalf,
  Wand2,
  GitCompareArrows,
  History,
  Backpack,
  BookOpen,
  Clock,
  MessagesSquare,
  Sprout,
  Target,
  Users,
  Castle,
  Coins,
  Crosshair,
  Crown,
  Droplets,
  Eye,
  Flame,
  Flower2,
  GraduationCap,
  HandHeart,
  Heart,
  Hexagon,
  Home,
  Lock,
  Map,
  ScanEye,
  Shield,
  ShieldCheck,
  Skull,
  Store,
  Swords,
  Trees,
  Wind,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { Lane, Role } from '@/types/hero';
import type { MarkerType } from '@/data/map';
import type { BasicsIcon, GlossaryCategory } from '@/data/beginners';

/** Иконки ролей — используются в бейджах, фильтрах и категориях. */
export const ROLE_ICONS: Record<Role, LucideIcon> = {
  carry: Crown,
  support: HandHeart,
  nuker: Flame,
  disabler: Lock,
  initiator: Zap,
  durable: Shield,
  escape: Wind,
  pusher: Castle,
  jungler: Trees,
};

/** Иконки линий. */
export const LANE_ICONS: Record<Lane, LucideIcon> = {
  safe: ShieldCheck,
  mid: Crosshair,
  off: Swords,
  jungle: Trees,
};

/** Иконки разделов навигации (по пути). */
export const NAV_ICONS: Record<string, LucideIcon> = {
  '/': Home,
  '/heroes': Swords,
  '/map': Map,
  '/beginners': GraduationCap,
  '/favorites': Heart,
  '/patch': History,
  '/compare': GitCompareArrows,
  '/pick': Wand2,
  '/counter': ShieldHalf,
  '/me': Activity,
};

/** Иконки объектов на карте и в легенде. */
export const MARKER_ICONS: Record<MarkerType, LucideIcon> = {
  'power-rune': Zap,
  'bounty-rune': Coins,
  'water-rune': Droplets,
  shrine: BookOpen,
  roshan: Skull,
  tormentor: Hexagon,
  shop: Store,
  lotus: Flower2,
  observer: Eye,
  sentry: ScanEye,
};

/** Иконки тем раздела «Основы». */
export const BASICS_ICONS: Record<BasicsIcon, LucideIcon> = {
  goal: Target,
  gold: Coins,
  xp: Sprout,
  farm: Trees,
  wards: Eye,
  timings: Clock,
  roles: Users,
  items: Backpack,
  map: Map,
  team: HandHeart,
};

/** Иконки категорий глоссария. */
export const GLOSSARY_ICONS: Record<GlossaryCategory, LucideIcon> = {
  economy: Coins,
  lane: Swords,
  fight: Flame,
  map: Map,
  roles: Users,
  items: Backpack,
  chat: MessagesSquare,
};
