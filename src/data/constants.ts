import type { Attribute, Complexity, Lane, Position, Role } from '@/types/hero';

import metaJson from './generated/meta.json';

/**
 * Версия патча, на которую сверены способности и таланты.
 * Обновляется автоматически командой `npm run update:data`.
 */
export const PATCH: string = metaJson.patch;

export interface AttributeMeta {
  id: Attribute;
  label: string;
  short: string;
  color: string;
  /** Описание для карточки категории на главной. */
  blurb: string;
}

export const ATTRIBUTES: Record<Attribute, AttributeMeta> = {
  str: {
    id: 'str',
    label: 'Сила',
    short: 'СИЛ',
    color: '#e5484d',
    blurb: 'Живучие бойцы и инициаторы: много здоровья, первыми входят в драку.',
  },
  agi: {
    id: 'agi',
    label: 'Ловкость',
    short: 'ЛОВ',
    color: '#56c271',
    blurb: 'Быстрые атакующие герои, которые с предметами решают исход поздней игры.',
  },
  int: {
    id: 'int',
    label: 'Интеллект',
    short: 'ИНТ',
    color: '#4aa3df',
    blurb: 'Маги и саппорты: сильные заклинания, контроль и урон способностями.',
  },
  uni: {
    id: 'uni',
    label: 'Универсальный',
    short: 'УНИ',
    color: '#c9a86d',
    blurb: 'Получают урон от всех трёх атрибутов — гибкие герои с необычными ролями.',
  },
};

export const ATTRIBUTE_ORDER: Attribute[] = ['str', 'agi', 'int', 'uni'];

export interface RoleMeta {
  id: Role;
  label: string;
  hint: string;
}

export const ROLES: Record<Role, RoleMeta> = {
  carry: { id: 'carry', label: 'Керри', hint: 'Фармит и тащит позднюю игру' },
  support: { id: 'support', label: 'Саппорт', hint: 'Помогает союзникам, ставит варды' },
  nuker: { id: 'nuker', label: 'Нюкер', hint: 'Наносит быстрый урон способностями' },
  disabler: { id: 'disabler', label: 'Дизейблер', hint: 'Оглушает и обездвиживает врагов' },
  initiator: { id: 'initiator', label: 'Инициатор', hint: 'Начинает драки' },
  durable: { id: 'durable', label: 'Танк', hint: 'Выдерживает много урона' },
  escape: { id: 'escape', label: 'Эскейп', hint: 'Легко уходит от врагов' },
  pusher: { id: 'pusher', label: 'Пушер', hint: 'Быстро сносит вышки' },
  jungler: { id: 'jungler', label: 'Лесник', hint: 'Может фармить в лесу' },
};

export const ROLE_ORDER: Role[] = [
  'carry',
  'support',
  'nuker',
  'disabler',
  'initiator',
  'durable',
  'escape',
  'pusher',
  'jungler',
];

export const LANES: Record<Lane, { id: Lane; label: string }> = {
  safe: { id: 'safe', label: 'Лёгкая линия' },
  mid: { id: 'mid', label: 'Мид' },
  off: { id: 'off', label: 'Сложная линия' },
  jungle: { id: 'jungle', label: 'Лес' },
};

export const LANE_ORDER: Lane[] = ['safe', 'mid', 'off', 'jungle'];

export const POSITIONS: Record<Position, string> = {
  1: 'Поз. 1 — керри',
  2: 'Поз. 2 — мидер',
  3: 'Поз. 3 — хардлейнер',
  4: 'Поз. 4 — роумер',
  5: 'Поз. 5 — полный саппорт',
};

export const COMPLEXITY: Record<Complexity, { label: string; hint: string }> = {
  1: { label: 'Простой', hint: 'Понятные способности, прощает ошибки — отлично для первых матчей.' },
  2: { label: 'Средний', hint: 'Требует тайминга и знания механик, но быстро осваивается.' },
  3: { label: 'Сложный', hint: 'Много кнопок и тонких приёмов — для тех, кто освоился.' },
};

export const COMPLEXITY_ORDER: Complexity[] = [1, 2, 3];

/** Навигация сайта: единый источник для шапки, мобильного меню и футера. */
export const NAV_LINKS = [
  { to: '/', label: 'Главная', end: true },
  { to: '/heroes', label: 'Герои', end: false },
  { to: '/map', label: 'Карта', end: false },
  { to: '/beginners', label: 'Новичкам', end: false },
  { to: '/favorites', label: 'Избранное', end: false },
] as const;

/** Инструменты — выпадающее меню «Инструменты» в шапке и отдельный блок в мобильном меню. */
export const TOOL_LINKS: { to: string; label: string; hint: string }[] = [
  { to: '/me', label: 'Разбор моих матчей', hint: 'Последние матчи по данным OpenDota и советы' },
  { to: '/pick', label: 'Подбери героя', hint: '7 вопросов — и три героя под твой стиль игры' },
  { to: '/counter', label: 'Против кого я играю', hint: 'Кто опасен, что купить и на что смотреть' },
  { to: '/compare', label: 'Сравнение героев', hint: 'Два героя рядом: характеристики, способности, матчап' },
  { to: '/patch', label: 'Изменения патча', hint: 'Что поменялось у героев в новом патче' },
];
