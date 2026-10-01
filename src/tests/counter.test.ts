import { describe, expect, it } from 'vitest';
import { ALL_HEROES, getIndexHeroBySlug } from '@/data/allHeroes';
import { getHeroById } from '@/data/heroes';
import { getItem } from '@/data/items';
import { HERO_TRAITS, ITEM_ROLE, TRAITS } from '@/data/counter';
import { analyzeCounter, parseCounter, profileOf, traitWeight } from '@/lib/counter';

const h = (slug: string) => getIndexHeroBySlug(slug)!;
const analyze = (me: string | undefined, vs: string[]) =>
  analyzeCounter(me ? h(me) : undefined, vs.map(h), getHeroById);

describe('данные помощника', () => {
  it('черты описаны у каждого героя игры', () => {
    const missing = ALL_HEROES.filter((e) => !HERO_TRAITS[e.slug]?.length).map((e) => e.slug);
    expect(missing).toEqual([]);
  });
  it('в чертах нет несуществующих героев', () => {
    Object.keys(HERO_TRAITS).forEach((slug) => expect(getIndexHeroBySlug(slug), slug).toBeDefined());
  });
  it('все предметы против черт есть в справочнике', () => {
    Object.values(TRAITS).forEach((t) => t.items.forEach((id) => expect(getItem(id), id).toBeDefined()));
    Object.keys(ITEM_ROLE).forEach((id) => expect(getItem(id as never), id).toBeDefined());
  });
});

describe('разбор команды врага', () => {
  it('Снайпер против Рики, Акса и Фантом Лансера: Акс опасен по гайду, против Рики — пыль', () => {
    const a = analyze('sniper', ['riki', 'axe', 'phantom-lancer']);
    const axe = a.threats.find((t) => t.enemy.slug === 'axe');
    expect(axe?.reasons[0]).toMatch(/Блинк|Клич/);
    expect(a.items.map((i) => i.itemId)).toContain('dust');
    expect(a.traits.map((t) => t.trait)).toEqual(expect.arrayContaining(['invis', 'illusions']));
  });

  it('керри не советуют саппортские предметы, саппорту — предметы керри', () => {
    const carry = analyze('juggernaut', ['zeus', 'lion', 'riki', 'phantom-assassin', 'spectre']);
    carry.items.forEach((i) => expect(ITEM_ROLE[i.itemId], i.itemId).not.toBe('support'));
    const support = analyze('crystal-maiden', ['zeus', 'lion', 'riki', 'phantom-assassin', 'spectre']);
    support.items.forEach((i) => expect(ITEM_ROLE[i.itemId], i.itemId).not.toBe('core'));
  });

  it('«ты силён против него»: Акс против Снайпера', () => {
    const a = analyze('axe', ['sniper']);
    expect(a.threats[0]?.youCounter).toBeTruthy();
  });

  it('уклонение опасно физическому керри и не важно саппорту', () => {
    expect(traitWeight('evasion', profileOf(h('juggernaut')))).toBe(2);
    expect(traitWeight('evasion', profileOf(h('crystal-maiden')))).toBe(0);
    expect(traitWeight('evasion')).toBe(1);
  });

  it('без своего героя — всё равно есть предметы и черты', () => {
    const a = analyze(undefined, ['zeus']);
    expect(a.items.length).toBeGreaterThan(0);
    expect(a.traits[0]?.trait).toBeDefined();
  });

  it('адрес: неизвестные, повторы и сам «мой» герой отбрасываются, максимум 5', () => {
    const known = (s: string) => Boolean(getIndexHeroBySlug(s));
    const p = parseCounter(new URLSearchParams('me=sven&vs=zeus,zeus,hack,sven,axe,lion,lina,pudge,tiny'), known);
    expect(p.me).toBe('sven');
    expect(p.vs).toEqual(['zeus', 'axe', 'lion', 'lina', 'pudge']);
    expect(parseCounter(new URLSearchParams('me=hack'), known).me).toBeNull();
  });
});
