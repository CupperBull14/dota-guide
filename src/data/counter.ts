import {
  Copy,
  EyeOff,
  Flame,
  Globe,
  HeartPulse,
  Lock,
  MicOff,
  PawPrint,
  Shield,
  Swords,
  Wind,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { ItemId } from './items';

/**
 * Данные помощника «Против кого я играю».
 * Черты героев намеренно упрощены: это то, на что новичку важно реагировать в игре
 * и при покупке предметов, а не полный разбор механик.
 */

export type Trait =
  | 'invis'
  | 'illusions'
  | 'magic'
  | 'physical'
  | 'evasion'
  | 'heal'
  | 'mobile'
  | 'disable'
  | 'silence'
  | 'summons'
  | 'tank'
  | 'global';

export interface TraitMeta {
  label: string;
  icon: LucideIcon;
  /** Чем опасно — одной фразой. */
  danger: string;
  /** Что делать в игре. */
  tip: string;
  /** Предметы против этой черты (в порядке полезности). */
  items: ItemId[];
}

export const TRAITS: Record<Trait, TraitMeta> = {
  invis: {
    label: 'Невидимость',
    icon: EyeOff,
    danger: 'Подкрадываются незаметно и нападают, когда ты не готов.',
    tip: 'Держи в инвентаре пыль и ставь сентри на пути к своей линии. Союзник внезапно умер без видимых врагов — это невидимка.',
    items: ['dust', 'ward_sentry', 'gem'],
  },
  illusions: {
    label: 'Иллюзии',
    icon: Copy,
    danger: 'Множество копий наносят урон и прячут настоящего героя.',
    tip: 'Бей по площади. У настоящего героя иногда видны эффекты, которых нет у иллюзий, — ищи его.',
    items: ['mjollnir', 'battle_fury', 'shivas_guard'],
  },
  magic: {
    label: 'Магический урон',
    icon: Flame,
    danger: 'Убивают способностями за пару секунд, особенно хрупких героев.',
    tip: 'Не стой плотно с командой и не подходи без нужды. Используй Палочку сразу, как только начали бить.',
    items: ['bkb', 'pipe', 'glimmer_cape'],
  },
  physical: {
    label: 'Физический урон',
    icon: Swords,
    danger: 'Сильные удары автоатаками — особенно в поздней игре.',
    tip: 'Броня и уход из-под фокуса спасают. Не давай керри врага спокойно фармить.',
    items: ['assault', 'shivas_guard', 'ghost', 'blade_mail', 'force_staff'],
  },
  evasion: {
    label: 'Уклонение',
    icon: Wind,
    danger: 'Твои атаки часто промахиваются.',
    tip: 'Против уклонения нужен предмет с точностью — без него физические керри бессильны.',
    items: ['monkey_king_bar'],
  },
  heal: {
    label: 'Лечение',
    icon: HeartPulse,
    danger: 'Сильно лечат себя или союзников — урон «растворяется».',
    tip: 'Наноси урон быстро и одновременно. Предметы против лечения сильно снижают их живучесть.',
    items: ['spirit_vessel'],
  },
  mobile: {
    label: 'Подвижность',
    icon: Zap,
    danger: 'Быстро врываются и так же быстро убегают.',
    tip: 'Держи контроль для них, а не для танков. Не гонись в туман — это может быть ловушка.',
    items: ['orchid', 'scythe_of_vyse', 'rod_of_atos', 'abyssal_blade'],
  },
  disable: {
    label: 'Много контроля',
    icon: Lock,
    danger: 'Оглушают и держат так, что ты не успеваешь ответить.',
    tip: 'Не входи в драку первым, если ты не инициатор. Невосприимчивость к магии решает драки.',
    items: ['bkb', 'lotus_orb', 'manta'],
  },
  silence: {
    label: 'Немота',
    icon: MicOff,
    danger: 'Запрещают использовать способности в самый важный момент.',
    tip: 'Используй способности до немоты. Предметы со снятием эффектов возвращают контроль над героем.',
    items: ['manta', 'lotus_orb', 'bkb'],
  },
  summons: {
    label: 'Призванные существа',
    icon: PawPrint,
    danger: 'Много юнитов давят линии и окружают тебя.',
    tip: 'Урон по площади и быстрая зачистка линий. Существа дают золото и опыт — убивай их.',
    items: ['mjollnir', 'battle_fury', 'shivas_guard'],
  },
  tank: {
    label: 'Очень живучие',
    icon: Shield,
    danger: 'Огромный запас здоровья и брони — убить их долго.',
    tip: 'Не трать на них весь урон в начале драки — бей тех, кто умирает быстрее.',
    items: ['desolator', 'silver_edge'],
  },
  global: {
    label: 'Присутствие по всей карте',
    icon: Globe,
    danger: 'Могут прийти или ударить из любой точки карты.',
    tip: 'Не стой один на далёкой линии без обзора и свитка телепортации.',
    items: ['ward_observer', 'tpscroll'],
  },
};

export const TRAIT_ORDER = Object.keys(TRAITS) as Trait[];

/** Для кого предмет: ядро керри, саппорт или любой. */
export const ITEM_ROLE: Partial<Record<ItemId, 'core' | 'support' | 'any'>> = {
  bkb: 'core',
  mjollnir: 'core',
  battle_fury: 'core',
  monkey_king_bar: 'core',
  orchid: 'core',
  abyssal_blade: 'core',
  manta: 'core',
  desolator: 'core',
  silver_edge: 'core',
  assault: 'core',
  glimmer_cape: 'support',
  ghost: 'support',
  ward_observer: 'support',
  gem: 'support',
};

/** Черты всех героев игры (ключ — slug из справочника heroes-index). */
export const HERO_TRAITS: Record<string, Trait[]> = {
  abaddon: ['tank', 'heal', 'physical'],
  alchemist: ['tank', 'physical'],
  'ancient-apparition': ['magic', 'global'],
  'anti-mage': ['mobile', 'physical'],
  'arc-warden': ['illusions', 'physical'],
  axe: ['tank', 'disable'],
  bane: ['disable', 'magic'],
  batrider: ['disable', 'mobile', 'magic'],
  beastmaster: ['summons', 'disable'],
  bloodseeker: ['physical', 'heal'],
  'bounty-hunter': ['invis', 'global'],
  brewmaster: ['tank', 'evasion', 'disable', 'summons'],
  bristleback: ['tank', 'physical'],
  broodmother: ['summons', 'invis', 'physical'],
  'centaur-warrunner': ['tank', 'disable'],
  'chaos-knight': ['illusions', 'disable', 'physical'],
  chen: ['heal', 'summons', 'global'],
  clinkz: ['invis', 'physical', 'mobile'],
  clockwerk: ['disable', 'mobile'],
  'crystal-maiden': ['disable', 'magic'],
  'dark-seer': ['disable', 'illusions'],
  'dark-willow': ['magic', 'disable'],
  dawnbreaker: ['global', 'heal', 'tank'],
  dazzle: ['heal'],
  'death-prophet': ['magic', 'summons', 'silence'],
  disruptor: ['disable', 'magic', 'silence'],
  doom: ['silence', 'tank', 'magic'],
  'dragon-knight': ['tank', 'physical', 'disable'],
  'drow-ranger': ['physical', 'silence'],
  'earth-spirit': ['disable', 'mobile', 'magic', 'silence'],
  earthshaker: ['disable', 'magic'],
  'elder-titan': ['disable', 'magic', 'physical'],
  'ember-spirit': ['mobile', 'magic', 'physical'],
  enchantress: ['heal', 'summons', 'physical'],
  enigma: ['disable', 'summons'],
  'faceless-void': ['disable', 'mobile', 'physical'],
  grimstroke: ['magic', 'disable'],
  gyrocopter: ['physical', 'magic'],
  hoodwink: ['magic', 'mobile', 'evasion'],
  huskar: ['heal', 'physical', 'tank'],
  invoker: ['magic', 'invis', 'disable'],
  io: ['heal', 'global', 'mobile'],
  jakiro: ['magic', 'disable'],
  juggernaut: ['physical', 'heal', 'mobile'],
  'keeper-of-the-light': ['magic', 'global'],
  kez: ['mobile', 'physical'],
  kunkka: ['disable', 'physical', 'tank'],
  largo: ['heal'],
  'legion-commander': ['disable', 'physical', 'heal'],
  leshrac: ['magic', 'disable'],
  lich: ['magic', 'disable'],
  lifestealer: ['heal', 'physical'],
  lina: ['magic', 'physical'],
  lion: ['disable', 'magic'],
  'lone-druid': ['summons', 'physical', 'tank'],
  luna: ['physical', 'magic'],
  lycan: ['summons', 'physical', 'mobile'],
  magnus: ['disable', 'mobile'],
  marci: ['physical', 'mobile', 'disable'],
  mars: ['disable', 'tank'],
  medusa: ['tank', 'physical'],
  meepo: ['summons', 'mobile', 'physical'],
  mirana: ['invis', 'disable', 'mobile'],
  'monkey-king': ['mobile', 'physical'],
  morphling: ['mobile', 'physical', 'illusions'],
  muerta: ['magic', 'physical', 'disable'],
  'naga-siren': ['illusions', 'disable'],
  'natures-prophet': ['global', 'summons', 'physical'],
  necrophos: ['heal', 'magic'],
  'night-stalker': ['silence', 'disable', 'physical', 'mobile'],
  'nyx-assassin': ['invis', 'magic', 'disable'],
  'ogre-magi': ['tank', 'magic', 'disable'],
  omniknight: ['heal', 'tank'],
  oracle: ['heal', 'disable'],
  'outworld-destroyer': ['magic'],
  pangolier: ['mobile', 'disable', 'physical'],
  'phantom-assassin': ['evasion', 'physical', 'mobile'],
  'phantom-lancer': ['illusions', 'mobile', 'physical'],
  phoenix: ['magic', 'heal', 'disable', 'mobile'],
  'primal-beast': ['tank', 'disable', 'mobile'],
  puck: ['mobile', 'magic', 'silence', 'disable'],
  pudge: ['tank', 'disable'],
  pugna: ['magic'],
  'queen-of-pain': ['mobile', 'magic'],
  razor: ['physical'],
  riki: ['invis', 'silence', 'physical', 'mobile'],
  ringmaster: ['disable', 'magic'],
  rubick: ['magic', 'disable'],
  'sand-king': ['invis', 'disable', 'magic', 'mobile'],
  'shadow-demon': ['illusions', 'disable', 'magic'],
  'shadow-fiend': ['magic', 'physical'],
  'shadow-shaman': ['disable', 'summons'],
  silencer: ['silence', 'global', 'magic'],
  'skywrath-mage': ['magic', 'silence'],
  slardar: ['disable', 'physical', 'tank'],
  slark: ['mobile', 'invis', 'physical'],
  snapfire: ['magic', 'disable'],
  sniper: ['physical'],
  spectre: ['global', 'tank', 'physical', 'illusions'],
  'spirit-breaker': ['global', 'disable', 'tank'],
  'storm-spirit': ['mobile', 'magic', 'disable'],
  sven: ['physical', 'disable', 'tank'],
  techies: ['magic', 'invis'],
  'templar-assassin': ['physical', 'invis'],
  terrorblade: ['illusions', 'physical'],
  tidehunter: ['tank', 'disable'],
  timbersaw: ['tank', 'magic', 'mobile'],
  tinker: ['magic'],
  tiny: ['physical', 'magic', 'disable', 'tank'],
  'treant-protector': ['heal', 'invis', 'disable', 'tank'],
  'troll-warlord': ['physical'],
  tusk: ['disable', 'physical'],
  underlord: ['tank', 'disable', 'global'],
  undying: ['heal', 'summons', 'tank'],
  ursa: ['physical', 'tank'],
  'vengeful-spirit': ['disable'],
  venomancer: ['magic', 'summons'],
  viper: ['magic', 'physical', 'tank'],
  visage: ['summons', 'physical', 'magic'],
  'void-spirit': ['mobile', 'magic', 'disable'],
  warlock: ['summons', 'heal', 'disable'],
  weaver: ['invis', 'mobile', 'physical'],
  windranger: ['evasion', 'physical', 'disable', 'mobile'],
  'winter-wyvern': ['heal', 'disable', 'magic'],
  'witch-doctor': ['magic', 'heal', 'disable'],
  'wraith-king': ['tank', 'physical', 'disable'],
  zeus: ['magic', 'global'],
};
