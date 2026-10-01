import { describe, expect, it } from 'vitest';
import { HEROES } from '@/data/heroes';
import { getIndexHeroBySlug } from '@/data/allHeroes';
import { HERO_STYLE, PICK_QUESTIONS } from '@/data/pick';
import { decodeAnswers, encodeAnswers, heroTags, rankHeroes } from '@/lib/pick';

const rank = (answers: number[]) => rankHeroes(HEROES, answers, (h) => getIndexHeroBySlug(h.id)?.attack);
const ids = (answers: number[], n = 3) => rank(answers).slice(0, n).map((r) => r.hero.id);

describe('подбор героя', () => {
  it('у каждого героя сайта описан стиль игры', () => {
    HEROES.forEach((h) => expect(HERO_STYLE[h.id]?.length, h.id).toBeGreaterThan(0));
  });

  it('теги героя: атака, роли, сложность, линии', () => {
    const tags = heroTags(HEROES.find((h) => h.id === 'sniper')!, 'ranged');
    ['ranged', 'carry', 'c1', 'safe', 'mid', 'farm', 'beginner'].forEach((t) => expect(tags.has(t as never), t).toBe(true));
  });

  it('дальний бой + керри + просто + фарм → Снайпер на 100%', () => {
    const [top] = rank([1, 0, 0, 0, 2, 1, 0]);
    expect(top?.hero.id).toBe('sniper');
    expect(top?.match).toBe(100);
    expect(top?.reasons.length).toBeGreaterThan(0);
  });

  it('саппорт со спасениями и большой ультой → Лич или Кристал Мейден', () => {
    expect(['lich', 'crystal-maiden']).toContain(ids([2, 1, 0, 1, 2, 0, 0], 1)[0]);
  });

  it('ближний бой, инициация, крепкий → Акс, Магнус или Шейкер', () => {
    expect(['axe', 'magnus', 'earthshaker']).toContain(ids([0, 2, 1, 1, 0, 0, 2], 1)[0]);
  });

  it('сложные механики, магия, мид → Инвокер или Зевс в тройке', () => {
    const top3 = ids([1, 3, 2, 1, 2, 0, 1]);
    expect(top3.some((id) => id === 'invoker' || id === 'zeus')).toBe(true);
  });

  it('«минимум кнопок» не советует сложных героев первыми', () => {
    const top3 = rank([2, 0, 0, 1, 0, 0, 0]).slice(0, 3);
    top3.forEach((r) => expect(r.hero.complexity, r.hero.id).toBeLessThan(3));
  });

  it('проценты в пределах 0–100, порядок по убыванию', () => {
    const r = rank([0, 1, 1, 2, 1, 2, 3]);
    r.forEach((x) => expect(x.match).toBeGreaterThanOrEqual(0));
    r.forEach((x) => expect(x.match).toBeLessThanOrEqual(100));
    for (let i = 1; i < r.length; i++) expect(r[i - 1]!.match).toBeGreaterThanOrEqual(r[i]!.match);
  });

  it('ответы в ссылке: кодирование и защита от мусора', () => {
    const answers = PICK_QUESTIONS.map(() => 0);
    expect(decodeAnswers(encodeAnswers(answers))).toEqual(answers);
    expect(decodeAnswers('9.9.9.9.9.9.9')).toBeNull();
    expect(decodeAnswers('0.0')).toBeNull();
    expect(decodeAnswers(null)).toBeNull();
  });
});
