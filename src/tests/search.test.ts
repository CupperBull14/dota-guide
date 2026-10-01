import { describe, expect, it } from 'vitest';
import { normalize, searchHeroes } from '@/lib/search';
import { HEROES } from '@/data/heroes';

describe('normalize', () => {
  it('приводит регистр, «ё» и пробелы', () => {
    expect(normalize('  Ёж   Свен!  ')).toBe('еж свен');
  });
});

describe('searchHeroes', () => {
  it('находит по русскому имени без учёта регистра', () => {
    expect(searchHeroes(HEROES, 'свен')[0]?.id).toBe('sven');
  });
  it('находит по английскому имени', () => {
    expect(searchHeroes(HEROES, 'SNIP')[0]?.id).toBe('sniper');
  });
  it('пустой запрос — пустой результат', () => {
    expect(searchHeroes(HEROES, '   ')).toEqual([]);
  });
  it('уважает лимит', () => {
    expect(searchHeroes(HEROES, 'а', 2).length).toBeLessThanOrEqual(2);
  });
});
