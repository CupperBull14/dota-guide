import type { ItemId } from '@/data/items';

/** Основной атрибут героя. */
export type Attribute = 'str' | 'agi' | 'int' | 'uni';

/** Роли героя (как в клиенте игры). */
export type Role =
  | 'carry'
  | 'support'
  | 'nuker'
  | 'disabler'
  | 'initiator'
  | 'durable'
  | 'escape'
  | 'pusher'
  | 'jungler';

/** Линии, на которых обычно играет герой. */
export type Lane = 'safe' | 'mid' | 'off' | 'jungle';

/** Позиция в команде (1 — керри, 5 — полный саппорт). */
export type Position = 1 | 2 | 3 | 4 | 5;

export type Complexity = 1 | 2 | 3;

/** Клавиша способности в раскладке по умолчанию. */
export type AbilityKey = 'Q' | 'W' | 'E' | 'D' | 'F' | 'R';

export type AbilityType = 'active' | 'passive';

/** Особое происхождение способности. */
export type AbilityTag = 'ultimate' | 'innate' | 'scepter' | 'shard';

export interface Ability {
  key: AbilityKey;
  name: string;
  nameEn: string;
  type: AbilityType;
  tag?: AbilityTag;
  description: string;
  tips: string[];
  /** Внутреннее имя иконки на CDN Valve (заполняется автоматически из data/icons.ts). */
  icon?: string;
  /** Цифры из официального фида (заполняется автоматически, если есть данные). */
  numbers?: { cooldowns: number[]; manaCosts: number[]; castRange: number[] };
  /** Номер патча, в котором цифры способности изменились (из changelog). */
  changedIn?: string;
}

/** Шаг скиллбилда: клавиша способности или «T» — талант. */
export type SkillStep = AbilityKey | 'T';

export interface SkillBuild {
  /** Короткое словесное описание приоритета прокачки. */
  summary: string;
  /**
   * Порядок прокачки по уровням 1–16 (ровно 16 шагов): к 16-му уровню
   * все обычные способности и два уровня ульты вкачаны. Третий уровень ульты — на 18.
   * Не задаётся у героев с нестандартной прокачкой (Invoker): для них — только summary.
   */
  order?: SkillStep[];
  /** Альтернативный вариант и когда его выбирать. */
  alternative?: string;
}

/** Сфера Invoker'а. */
export type Orb = 'Q' | 'W' | 'E';

/** Заклинание, которое создаётся сочетанием сфер (только у Invoker). */
export interface InvokedSpell {
  name: string;
  nameEn: string;
  /** Сочетание сфер, например ['Q', 'Q', 'Q']. */
  combo: [Orb, Orb, Orb];
  description: string;
  tip: string;
  /** Внутреннее имя иконки на CDN Valve (заполняется автоматически). */
  icon?: string;
}

export type TalentLevel = 10 | 15 | 20 | 25;

export interface TalentRow {
  level: TalentLevel;
  left: string;
  right: string;
  /** Рекомендуемая ветка. */
  pick: 'left' | 'right';
  why: string;
  /** Номер патча, в котором таланты этого уровня изменились (из changelog). */
  changedIn?: string;
}

/** Предмет в билде: ссылка на справочник + зачем он нужен именно этому герою. */
export interface ItemRef {
  itemId: ItemId;
  why: string;
  count?: number;
}

export interface ItemBuild {
  start: ItemRef[];
  early: ItemRef[];
  core: ItemRef[];
  situational: ItemRef[];
}

export interface Tactics {
  earlyGame: string;
  midGame: string;
  lateGame: string;
}

/**
 * Связь с другим героем (контрпик или синергия).
 * heroId указывается, только если герой есть в базе, — тогда имя становится ссылкой.
 * Если вместо героя указан предмет (например, Silver Edge), heroId не задаётся.
 */
export interface HeroRelation {
  name: string;
  heroId?: string;
  why: string;
}

export interface Hero {
  /** slug для URL: /heroes/:id */
  id: string;
  name: string;
  nameEn: string;
  attribute: Attribute;
  complexity: Complexity;
  roles: Role[];
  lanes: Lane[];
  positions: Position[];
  goodForBeginners: boolean;
  beginnerReason: string;
  shortDescription: string;
  abilities: Ability[];
  skillBuild: SkillBuild;
  talents: TalentRow[];
  items: ItemBuild;
  tactics: Tactics;
  counters: HeroRelation[];
  synergies: HeroRelation[];
  tips: string[];
  /** Заклинания из сфер — только у Invoker. */
  invokedSpells?: InvokedSpell[];
  /** Портрет героя (горизонтальный, 16:9). Если не задан или не загрузился — стилизованная заглушка. */
  imageUrl?: string;
  /** Полноростовый рендер героя (PNG с прозрачностью) для баннера на странице героя. */
  renderUrl?: string;
}
