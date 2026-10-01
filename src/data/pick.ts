import {
  Brain,
  Crosshair,
  Crown,
  Feather,
  Flame,
  Footprints,
  Gem,
  HandHeart,
  HeartHandshake,
  Layers,
  Shield,
  ShieldCheck,
  Shuffle,
  Sparkles,
  Sprout,
  Swords,
  Target,
  Wind,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { Role } from '@/types/hero';

/**
 * Данные для подбора героя: вопросы, варианты ответов и «стиль» каждого героя.
 * Каждый ответ добавляет баллы героям с нужными тегами (или отнимает — отрицательный вес).
 */

export type StyleTag =
  | 'farm' // спокойно фармит и становится сильнее
  | 'fight' // постоянно в драках
  | 'hunt' // охотится на одиночек, ганкает
  | 'durable' // крепкий
  | 'mobile' // легко убегает
  | 'glass' // хрупкий, но с уроном
  | 'teamult' // ульта по всей команде врага
  | 'pick' // убивает одну цель за секунды
  | 'save'; // спасает союзников

export type PickTag =
  | Role
  | StyleTag
  | 'melee'
  | 'ranged'
  | 'c1'
  | 'c2'
  | 'c3'
  | 'safe'
  | 'mid'
  | 'off'
  | 'roam'
  | 'beginner';

export interface PickOption {
  label: string;
  hint: string;
  icon: LucideIcon;
  effects: Partial<Record<PickTag, number>>;
}

export interface PickQuestion {
  id: string;
  title: string;
  options: PickOption[];
}

export const PICK_QUESTIONS: PickQuestion[] = [
  {
    id: 'range',
    title: 'Как тебе удобнее сражаться?',
    options: [
      { label: 'В гуще боя', hint: 'Ближний бой, лицом к лицу', icon: Swords, effects: { melee: 3 } },
      { label: 'Издалека', hint: 'Бить с безопасной дистанции', icon: Crosshair, effects: { ranged: 3 } },
      { label: 'Без разницы', hint: 'Главное — побеждать', icon: Shuffle, effects: {} },
    ],
  },
  {
    id: 'role',
    title: 'Какая роль тебе ближе?',
    options: [
      { label: 'Тащить игру', hint: 'Фармить и решать исход в конце', icon: Crown, effects: { carry: 4 } },
      { label: 'Помогать команде', hint: 'Варды, спасения, контроль', icon: HandHeart, effects: { support: 4 } },
      { label: 'Начинать драки', hint: 'Первым врываться во врагов', icon: Zap, effects: { initiator: 4 } },
      { label: 'Взрывать магией', hint: 'Большой урон способностями', icon: Flame, effects: { nuker: 4 } },
    ],
  },
  {
    id: 'complexity',
    title: 'Сколько кнопок готов освоить?',
    options: [
      { label: 'Минимум', hint: 'Хочу понять игру, а не героя', icon: Feather, effects: { c1: 2, c2: -1, c3: -4, beginner: 2 } },
      { label: 'Чуть больше', hint: 'Готов потренироваться', icon: Layers, effects: { c2: 1, c3: -2 } },
      { label: 'Хоть все', hint: 'Люблю сложные механики', icon: Brain, effects: { c3: 2, c2: 1 } },
    ],
  },
  {
    id: 'pace',
    title: 'Что тебе приятнее в игре?',
    options: [
      { label: 'Спокойно фармить', hint: 'Становиться сильнее с каждой минутой', icon: Sprout, effects: { farm: 3 } },
      { label: 'Постоянно драться', hint: 'Чем больше драк — тем лучше', icon: Swords, effects: { fight: 3 } },
      { label: 'Охотиться', hint: 'Ловить врагов поодиночке', icon: Target, effects: { hunt: 3 } },
    ],
  },
  {
    id: 'risk',
    title: 'Как относишься к опасности?',
    options: [
      { label: 'Хочу быть крепким', hint: 'Меня трудно убить', icon: Shield, effects: { durable: 3, glass: -1 } },
      { label: 'Люблю уворачиваться', hint: 'Быстро убегаю и возвращаюсь', icon: Wind, effects: { mobile: 3 } },
      { label: 'Хрупкий, но опасный', hint: 'Готов рисковать ради урона', icon: Gem, effects: { glass: 2, nuker: 1 } },
    ],
  },
  {
    id: 'moment',
    title: 'Какой момент самый крутой?',
    options: [
      { label: 'Ульта по всей команде', hint: 'Один каст — и драка выиграна', icon: Sparkles, effects: { teamult: 3 } },
      { label: 'Убить цель за секунду', hint: 'Точный и смертельный удар', icon: Crosshair, effects: { pick: 3 } },
      { label: 'Спасти союзника', hint: 'Вытащить друга из беды', icon: HeartHandshake, effects: { save: 3 } },
    ],
  },
  {
    id: 'lane',
    title: 'Где хочешь начинать игру?',
    options: [
      { label: 'Лёгкая линия', hint: 'Спокойный фарм под защитой', icon: ShieldCheck, effects: { safe: 2 } },
      { label: 'Мид', hint: 'Один на один, быстрые уровни', icon: Crosshair, effects: { mid: 2 } },
      { label: 'Сложная линия', hint: 'Выживать и мешать врагу', icon: Swords, effects: { off: 2 } },
      { label: 'Помогать везде', hint: 'Ходить по карте и ганкать', icon: Footprints, effects: { roam: 2, hunt: 1 } },
    ],
  },
];

/** Стиль игры героев с полным гайдом. */
export const HERO_STYLE: Record<string, StyleTag[]> = {
  sven: ['farm', 'fight', 'durable'],
  sniper: ['farm', 'glass', 'pick'],
  zeus: ['fight', 'teamult', 'glass'],
  axe: ['fight', 'durable', 'hunt', 'pick'],
  lich: ['save', 'teamult', 'fight'],
  pudge: ['hunt', 'pick', 'durable'],
  earthshaker: ['teamult', 'fight'],
  juggernaut: ['farm', 'mobile', 'pick'],
  'phantom-assassin': ['farm', 'hunt', 'pick', 'mobile'],
  'crystal-maiden': ['save', 'teamult', 'glass'],
  'storm-spirit': ['mobile', 'hunt', 'pick', 'fight'],
  magnus: ['teamult', 'fight', 'mobile', 'save'],
  enigma: ['teamult', 'fight', 'farm'],
  windranger: ['mobile', 'pick', 'fight'],
  invoker: ['fight', 'teamult', 'pick'],
};

/** Как объяснить совпадение тега человеку. */
export const TAG_REASONS: Record<PickTag, string> = {
  melee: 'Сражается в ближнем бою',
  ranged: 'Бьёт с дистанции',
  carry: 'Керри — решает исход поздней игры',
  support: 'Саппорт — помогает и спасает команду',
  initiator: 'Начинает драки',
  nuker: 'Наносит большой урон способностями',
  disabler: 'Много контроля',
  durable: 'Очень живучий',
  escape: 'Легко уходит от врагов',
  pusher: 'Быстро сносит вышки',
  jungler: 'Может фармить лес',
  farm: 'Растёт от фарма — чем дольше игра, тем сильнее',
  fight: 'Силён в командных драках',
  hunt: 'Охотится на одиночек',
  mobile: 'Подвижный, трудно поймать',
  glass: 'Хрупкий, но с огромным уроном',
  teamult: 'Ульта переворачивает командные драки',
  pick: 'Быстро убивает одну цель',
  save: 'Умеет спасать союзников',
  c1: 'Простой в освоении',
  c2: 'Средней сложности',
  c3: 'Сложный, но с огромным потенциалом',
  safe: 'Играет на лёгкой линии',
  mid: 'Играет на миду',
  off: 'Играет на сложной линии',
  roam: 'Ходит по карте и помогает линиям',
  beginner: 'Подходит новичкам',
};
