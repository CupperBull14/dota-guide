/**
 * Справочник предметов.
 * name — название, привычное русскоязычному игроку; nameEn — официальное английское.
 * purpose — общее назначение предмета. То, зачем предмет конкретному герою,
 * хранится в билде героя (ItemRef.why).
 */
export interface Item {
  id: string;
  name: string;
  nameEn: string;
  category: ItemCategory;
  purpose: string;
}

export type ItemCategory = 'consumable' | 'basic' | 'boots' | 'support' | 'utility' | 'damage' | 'defense' | 'magic';

export const ITEM_CATEGORIES: Record<ItemCategory, string> = {
  consumable: 'Расходники',
  basic: 'Базовые',
  boots: 'Обувь',
  support: 'Поддержка',
  utility: 'Утилити',
  damage: 'Урон',
  defense: 'Защита',
  magic: 'Магия',
};

const define = <const T extends Record<string, Omit<Item, 'id'>>>(items: T) =>
  Object.fromEntries(Object.entries(items).map(([id, item]) => [id, { id, ...item }])) as {
    [K in keyof T]: Item & { id: K };
  };

export const ITEMS = define({
  // ── Расходники ─────────────────────────────────────────────
  tango: {
    name: 'Танго',
    nameEn: 'Tango',
    category: 'consumable',
    purpose: 'Дешёвое восстановление здоровья: съедаешь дерево и лечишься несколько секунд.',
  },
  faerie_fire: {
    name: 'Фейерик',
    nameEn: 'Faerie Fire',
    category: 'consumable',
    purpose: 'Мгновенное лечение и немного урона — спасает от смерти в первые минуты.',
  },
  clarity: {
    name: 'Кларити',
    nameEn: 'Clarity',
    category: 'consumable',
    purpose: 'Восстанавливает ману, пока тебя не атакуют враги.',
  },
  healing_salve: {
    name: 'Фласка',
    nameEn: 'Healing Salve',
    category: 'consumable',
    purpose: 'Сильное лечение со временем; сбивается, если получить урон от врага.',
  },
  ward_observer: {
    name: 'Обсервер-вард',
    nameEn: 'Observer Ward',
    category: 'consumable',
    purpose: 'Невидимый вард, дающий обзор области на несколько минут.',
  },
  ward_sentry: {
    name: 'Сентри-вард',
    nameEn: 'Sentry Ward',
    category: 'consumable',
    purpose: 'Показывает невидимых врагов и вражеские варды рядом.',
  },
  tpscroll: {
    name: 'Свиток телепортации',
    nameEn: 'Town Portal Scroll',
    category: 'consumable',
    purpose: 'Телепорт к союзному зданию — всегда держи один в слоте.',
  },

  // ── Базовые ───────────────────────────────────────────────
  branches: {
    name: 'Ветка',
    nameEn: 'Iron Branch',
    category: 'basic',
    purpose: 'Самая дешёвая прибавка ко всем атрибутам, позже идёт в Магическую палочку.',
  },
  quelling_blade: {
    name: 'Клинок квеллинга',
    nameEn: 'Quelling Blade',
    category: 'basic',
    purpose: 'Бонусный урон по крипам для удобных добиваний, рубит деревья.',
  },
  ring_of_protection: {
    name: 'Кольцо защиты',
    nameEn: 'Ring of Protection',
    category: 'basic',
    purpose: 'Немного брони на старте, собирается дальше в более крупные предметы.',
  },
  magic_wand: {
    name: 'Палочка',
    nameEn: 'Magic Wand',
    category: 'basic',
    purpose: 'Копит заряды от вражеских заклинаний и мгновенно восстанавливает здоровье и ману.',
  },

  // ── Обувь ─────────────────────────────────────────────────
  boots: {
    name: 'Ботинки',
    nameEn: 'Boots of Speed',
    category: 'boots',
    purpose: 'Бонус к скорости передвижения — основа для любой другой обуви.',
  },
  power_treads: {
    name: 'Тредсы',
    nameEn: 'Power Treads',
    category: 'boots',
    purpose: 'Скорость атаки и переключаемый бонус к атрибуту.',
  },
  arcane_boots: {
    name: 'Арканы',
    nameEn: 'Arcane Boots',
    category: 'boots',
    purpose: 'Мана и мгновенное восстановление маны себе и союзникам рядом.',
  },

  // ── Поддержка ─────────────────────────────────────────────
  glimmer_cape: {
    name: 'Плащ мерцания',
    nameEn: 'Glimmer Cape',
    category: 'support',
    purpose: 'Делает союзника невидимым и даёт ему защиту от магии.',
  },
  force_staff: {
    name: 'Посох силы',
    nameEn: 'Force Staff',
    category: 'support',
    purpose: 'Толкает цель вперёд: спасает союзника или вытаскивает себя из-под удара.',
  },
  pipe: {
    name: 'Пайп',
    nameEn: 'Pipe of Insight',
    category: 'support',
    purpose: 'Барьер от магического урона для всей команды.',
  },
  vanguard: {
    name: 'Вэнгард',
    nameEn: 'Vanguard',
    category: 'defense',
    purpose: 'Защита от физического урона — хороший ранний предмет танка. В 7.41 рецепт Вангарда переработали, перед покупкой смотри описание в игре.',
  },

  // ── Утилити / инициация ───────────────────────────────────
  blink: {
    name: 'Блинк',
    nameEn: 'Blink Dagger',
    category: 'utility',
    purpose: 'Мгновенный прыжок на короткую дистанцию — главный инструмент инициации.',
  },
  bkb: {
    name: 'БКБ',
    nameEn: 'Black King Bar',
    category: 'utility',
    purpose: 'Иммунитет к большинству заклинаний на несколько секунд.',
  },
  shadow_blade: {
    name: 'Теневой клинок',
    nameEn: 'Shadow Blade',
    category: 'utility',
    purpose: 'Невидимость для захода в драку или побега.',
  },
  silver_edge: {
    name: 'Серебряная грань',
    nameEn: 'Silver Edge',
    category: 'utility',
    purpose: 'Невидимость, а удар из неё отключает пассивные способности цели.',
  },
  rod_of_atos: {
    name: 'Атос',
    nameEn: 'Rod of Atos',
    category: 'utility',
    purpose: 'Приковывает цель к земле на дистанции.',
  },
  aghanims_scepter: {
    name: 'Аганим',
    nameEn: "Aghanim's Scepter",
    category: 'magic',
    purpose: 'Улучшает способность героя или даёт новую.',
  },
  refresher: {
    name: 'Рефрешер',
    nameEn: 'Refresher Orb',
    category: 'magic',
    purpose: 'Мгновенно перезаряжает способности героя. С патча 7.41 предметы он больше не перезаряжает.',
  },

  // ── Магия ─────────────────────────────────────────────────
  aether_lens: {
    name: 'Эфирная линза',
    nameEn: 'Aether Lens',
    category: 'magic',
    purpose: 'Увеличивает дальность применения заклинаний и даёт ману.',
  },
  octarine_core: {
    name: 'Октариновое ядро',
    nameEn: 'Octarine Core',
    category: 'magic',
    purpose: 'Сокращает перезарядку способностей и предметов.',
  },

  // ── Урон ──────────────────────────────────────────────────
  dragon_lance: {
    name: 'Драконье копьё',
    nameEn: 'Dragon Lance',
    category: 'damage',
    purpose: 'Дальность атаки и атрибуты для героев дальнего боя.',
  },
  hurricane_pike: {
    name: 'Ураганная пика',
    nameEn: 'Hurricane Pike',
    category: 'damage',
    purpose: 'Отталкивает врага и тебя друг от друга, затем даёт несколько атак без ограничения дальности.',
  },
  crystalys: {
    name: 'Кристаллис',
    nameEn: 'Crystalys',
    category: 'damage',
    purpose: 'Шанс критического удара; собирается в Дедал.',
  },
  daedalus: {
    name: 'Дедал',
    nameEn: 'Daedalus',
    category: 'damage',
    purpose: 'Мощный шанс критического удара и урон.',
  },
  mjollnir: {
    name: 'Мьёльнир',
    nameEn: 'Mjollnir',
    category: 'damage',
    purpose: 'Скорость атаки и цепные молнии — отлично чистит крипов и иллюзии.',
  },
  satanic: {
    name: 'Сатаник',
    nameEn: 'Satanic',
    category: 'damage',
    purpose: 'Вампиризм и активный рывок лечения в драке.',
  },

  // ── Защита ────────────────────────────────────────────────
  assault: {
    name: 'Штурмовая кираса',
    nameEn: 'Assault Cuirass',
    category: 'defense',
    purpose: 'Аура брони и скорости атаки союзникам, снижает броню врагов рядом.',
  },
  blade_mail: {
    name: 'Блейдмейл',
    nameEn: 'Blade Mail',
    category: 'defense',
    purpose: 'Возвращает врагам полученный урон.',
  },
  shivas_guard: {
    name: 'Шива',
    nameEn: "Shiva's Guard",
    category: 'defense',
    purpose: 'Броня, волна холода, аура замедления атаки врагов и большая область действия твоих заклинаний (с 7.41).',
  },
  // ── Добавлено на этапе 2 ──────────────────────────────────
  bottle: {
    name: 'Бутылка',
    nameEn: 'Bottle',
    category: 'consumable',
    purpose: 'Хранит руны и быстро восстанавливает здоровье и ману — классика мидера.',
  },
  phase_boots: {
    name: 'Фейзы',
    nameEn: 'Phase Boots',
    category: 'boots',
    purpose: 'Урон, броня и рывок скорости, во время которого проходишь сквозь юнитов.',
  },
  tranquil_boots: {
    name: 'Транквилы',
    nameEn: 'Tranquil Boots',
    category: 'boots',
    purpose: 'Быстрая обувь с сильной регенерацией здоровья вне боя — выбор роумеров и саппортов.',
  },
  travel_boots: {
    name: 'Тревела',
    nameEn: 'Boots of Travel',
    category: 'boots',
    purpose: 'Телепорт к любому союзному юниту или зданию и максимальная скорость передвижения.',
  },
  hand_of_midas: {
    name: 'Мидас',
    nameEn: 'Hand of Midas',
    category: 'utility',
    purpose: 'Превращает крипа в золото и опыт — ускоряет развитие героя.',
  },
  maelstrom: {
    name: 'Мальстрём',
    nameEn: 'Maelstrom',
    category: 'damage',
    purpose: 'Цепные молнии при атаке; собирается в Мьёльнир.',
  },
  battle_fury: {
    name: 'Бфа',
    nameEn: 'Battle Fury',
    category: 'damage',
    purpose: 'Раскалывающий урон по площади и регенерация — ускоряет фарм.',
  },
  manta: {
    name: 'Манта',
    nameEn: 'Manta Style',
    category: 'damage',
    purpose: 'Создаёт две иллюзии и снимает с героя большинство негативных эффектов.',
  },
  desolator: {
    name: 'Дезолятор',
    nameEn: 'Desolator',
    category: 'damage',
    purpose: 'Большой урон и снижение брони цели при атаке.',
  },
  abyssal_blade: {
    name: 'Абиссал',
    nameEn: 'Abyssal Blade',
    category: 'damage',
    purpose: 'Шанс оглушить при атаке и активное оглушение, пробивающее иммунитет к эффектам.',
  },
  butterfly: {
    name: 'Баттерфляй',
    nameEn: 'Butterfly',
    category: 'damage',
    purpose: 'Ловкость, урон и уклонение от атак.',
  },
  monkey_king_bar: {
    name: 'МКБ',
    nameEn: 'Monkey King Bar',
    category: 'damage',
    purpose: 'Атаки не промахиваются — ответ на уклонение врага.',
  },
  orchid: {
    name: 'Орхидея',
    nameEn: 'Orchid Malevolence',
    category: 'magic',
    purpose: 'Немота: цель не может использовать способности, затем получает дополнительный урон.',
  },
  kaya_and_sange: {
    name: 'Кая и Санге',
    nameEn: 'Kaya and Sange',
    category: 'magic',
    purpose: 'Сила, интеллект, усиление заклинаний и сопротивление замедлениям.',
  },
  bloodstone: {
    name: 'Бладстоун',
    nameEn: 'Bloodstone',
    category: 'magic',
    purpose: 'Мана, вампиризм от заклинаний и активное усиление лечения.',
  },
  scythe_of_vyse: {
    name: 'Хекс',
    nameEn: 'Scythe of Vyse',
    category: 'magic',
    purpose: 'Превращает врага в беззащитное существо на несколько секунд.',
  },
  heart: {
    name: 'Сердце',
    nameEn: 'Heart of Tarrasque',
    category: 'defense',
    purpose: 'Огромный запас здоровья и сильная регенерация вне боя.',
  },
  dust: {
    name: 'Пыль',
    nameEn: 'Dust of Appearance',
    category: 'consumable',
    purpose: 'Показывает невидимых врагов вокруг и замедляет их на несколько секунд.',
  },
  gem: {
    name: 'Гем',
    nameEn: 'Gem of True Sight',
    category: 'utility',
    purpose: 'Постоянно показывает невидимых врагов и варды рядом. Выпадает при смерти владельца.',
  },
  ghost: {
    name: 'Призрачный скипетр',
    nameEn: 'Ghost Scepter',
    category: 'support',
    purpose: 'Делает тебя бесплотным: физические атаки не наносят урона несколько секунд.',
  },
  spirit_vessel: {
    name: 'Вессел',
    nameEn: 'Spirit Vessel',
    category: 'support',
    purpose: 'Наносит урон и сильно снижает лечение и регенерацию врага.',
  },
  lotus_orb: {
    name: 'Лотус',
    nameEn: 'Lotus Orb',
    category: 'defense',
    purpose: 'Снимает негативные эффекты и отражает следующее направленное заклинание обратно.',
  },
});

export type ItemId = keyof typeof ITEMS;

export const ITEM_LIST: Item[] = Object.values(ITEMS);

export function getItem(id: ItemId): Item {
  return ITEMS[id];
}
