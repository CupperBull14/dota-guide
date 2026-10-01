import type { AbilityKey, Attribute } from '@/types/hero';

/**
 * Официальные иконки Dota 2 с CDN Valve.
 * Ключи — внутренние имена в игре. Если картинка не загрузится,
 * компоненты покажут стилизованную заглушку, так что сайт не ломается без интернета.
 */
export const VALVE_CDN = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react';

export const abilityIconUrl = (key: string) => `${VALVE_CDN}/abilities/${key}.png`;
export const itemIconUrl = (key: string) => `${VALVE_CDN}/items/${key}.png`;

export const ATTRIBUTE_ICONS: Record<Attribute, string> = {
  str: `${VALVE_CDN}/icons/hero_strength.png`,
  agi: `${VALVE_CDN}/icons/hero_agility.png`,
  int: `${VALVE_CDN}/icons/hero_intelligence.png`,
  uni: `${VALVE_CDN}/icons/hero_universal.png`,
};

/**
 * Иконки способностей: герой → клавиша → внутреннее имя.
 * Для части врождённых способностей у Valve нет отдельной иконки — их здесь нет, там будет заглушка.
 */
export const ABILITY_ICONS: Record<string, Partial<Record<AbilityKey, string>>> = {
  sven: {
    D: 'sven_wrath_of_god',
    Q: 'sven_storm_bolt',
    W: 'sven_great_cleave',
    E: 'sven_warcry',
    R: 'sven_gods_strength',
  },
  sniper: {
    Q: 'sniper_shrapnel',
    W: 'sniper_headshot',
    E: 'sniper_take_aim',
    F: 'sniper_concussive_grenade',
    R: 'sniper_assassinate',
  },
  zeus: {
    D: 'zuus_static_field',
    Q: 'zuus_arc_lightning',
    W: 'zuus_lightning_bolt',
    E: 'zuus_heavenly_jump',
    F: 'zuus_cloud',
    R: 'zuus_thundergods_wrath',
  },
  axe: {
    Q: 'axe_berserkers_call',
    W: 'axe_battle_hunger',
    E: 'axe_counter_helix',
    R: 'axe_culling_blade',
  },
  lich: {
    Q: 'lich_frost_nova',
    W: 'lich_frost_shield',
    E: 'lich_sinister_gaze',
    F: 'lich_ice_spire',
    R: 'lich_chain_frost',
  },
  pudge: {
    Q: 'pudge_meat_hook',
    W: 'pudge_rot',
    E: 'pudge_flesh_heap',
    R: 'pudge_dismember',
  },
  earthshaker: {
    Q: 'earthshaker_fissure',
    W: 'earthshaker_enchant_totem',
    E: 'earthshaker_aftershock',
    R: 'earthshaker_echo_slam',
  },
  juggernaut: {
    Q: 'juggernaut_blade_fury',
    W: 'juggernaut_healing_ward',
    E: 'juggernaut_blade_dance',
    F: 'juggernaut_swift_slash',
    R: 'juggernaut_omni_slash',
  },
  'phantom-assassin': {
    D: 'phantom_assassin_blur',
    Q: 'phantom_assassin_stifling_dagger',
    W: 'phantom_assassin_phantom_strike',
    E: 'phantom_assassin_immaterial',
    F: 'phantom_assassin_fan_of_knives',
    R: 'phantom_assassin_coup_de_grace',
  },
  'crystal-maiden': {
    D: 'crystal_maiden_glacial_guard',
    Q: 'crystal_maiden_crystal_nova',
    W: 'crystal_maiden_frostbite',
    E: 'crystal_maiden_brilliance_aura',
    F: 'crystal_maiden_crystal_clone',
    R: 'crystal_maiden_freezing_field',
  },
  'storm-spirit': {
    Q: 'storm_spirit_static_remnant',
    W: 'storm_spirit_electric_vortex',
    E: 'storm_spirit_overload',
    R: 'storm_spirit_ball_lightning',
  },
  magnus: {
    D: 'magnataur_solid_core',
    Q: 'magnataur_shockwave',
    W: 'magnataur_empower',
    E: 'magnataur_skewer',
    F: 'magnataur_horn_toss',
    R: 'magnataur_reverse_polarity',
  },
  enigma: {
    Q: 'enigma_malefice',
    W: 'enigma_demonic_conversion',
    E: 'enigma_midnight_pulse',
    R: 'enigma_black_hole',
  },
  windranger: {
    D: 'windrunner_tailwind',
    Q: 'windrunner_shackleshot',
    W: 'windrunner_powershot',
    E: 'windrunner_windrun',
    F: 'windrunner_gale_force',
    R: 'windrunner_focusfire',
  },
  invoker: {
    Q: 'invoker_quas',
    W: 'invoker_wex',
    E: 'invoker_exort',
    R: 'invoker_invoke',
  },
};

/** Иконки заклинаний Инвокера по английскому названию. */
export const INVOKED_ICONS: Record<string, string> = {
  'Cold Snap': 'invoker_cold_snap',
  'Ghost Walk': 'invoker_ghost_walk',
  'Ice Wall': 'invoker_ice_wall',
  Tornado: 'invoker_tornado',
  'E.M.P.': 'invoker_emp',
  Alacrity: 'invoker_alacrity',
  'Chaos Meteor': 'invoker_chaos_meteor',
  'Sun Strike': 'invoker_sun_strike',
  'Forge Spirit': 'invoker_forge_spirit',
  'Deafening Blast': 'invoker_deafening_blast',
};

/** Иконки предметов: id в справочнике → внутреннее имя предмета в игре. */
export const ITEM_ICONS: Record<string, string> = {
  tango: 'tango',
  faerie_fire: 'faerie_fire',
  clarity: 'clarity',
  healing_salve: 'flask',
  ward_observer: 'ward_observer',
  ward_sentry: 'ward_sentry',
  tpscroll: 'tpscroll',
  branches: 'branches',
  quelling_blade: 'quelling_blade',
  ring_of_protection: 'ring_of_protection',
  magic_wand: 'magic_wand',
  boots: 'boots',
  power_treads: 'power_treads',
  arcane_boots: 'arcane_boots',
  glimmer_cape: 'glimmer_cape',
  force_staff: 'force_staff',
  pipe: 'pipe',
  vanguard: 'vanguard',
  blink: 'blink',
  bkb: 'black_king_bar',
  shadow_blade: 'invis_sword',
  silver_edge: 'silver_edge',
  rod_of_atos: 'rod_of_atos',
  aghanims_scepter: 'ultimate_scepter',
  refresher: 'refresher',
  aether_lens: 'aether_lens',
  octarine_core: 'octarine_core',
  dragon_lance: 'dragon_lance',
  hurricane_pike: 'hurricane_pike',
  crystalys: 'lesser_crit',
  daedalus: 'greater_crit',
  mjollnir: 'mjollnir',
  satanic: 'satanic',
  assault: 'assault',
  blade_mail: 'blade_mail',
  shivas_guard: 'shivas_guard',
  bottle: 'bottle',
  phase_boots: 'phase_boots',
  tranquil_boots: 'tranquil_boots',
  travel_boots: 'travel_boots',
  hand_of_midas: 'hand_of_midas',
  maelstrom: 'maelstrom',
  battle_fury: 'bfury',
  manta: 'manta',
  desolator: 'desolator',
  abyssal_blade: 'abyssal_blade',
  butterfly: 'butterfly',
  monkey_king_bar: 'monkey_king_bar',
  orchid: 'orchid',
  kaya_and_sange: 'kaya_and_sange',
  bloodstone: 'bloodstone',
  scythe_of_vyse: 'sheepstick',
  heart: 'heart',
  dust: 'dust',
  gem: 'gem',
  ghost: 'ghost',
  spirit_vessel: 'spirit_vessel',
  lotus_orb: 'lotus_orb',
};
