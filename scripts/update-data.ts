/**
 * Обновление данных с официального сайта Dota 2.
 *
 *   npm run update:data              — скачать всё с dota2.com
 *   npm run update:data -- --patch 7.42   — явно указать номер патча
 *   npm run update:data -- --offline <папка>  — взять файлы из папки (для отладки):
 *        herolist.json и herodata-<id>.json
 *
 * Что делает:
 *  1. src/data/generated/heroes-index.json — все герои игры (имя, атрибут, роли, тип атаки).
 *  2. src/data/generated/hero-details.json — для героев сайта: способности (перезарядка, мана) и таланты.
 *  3. Сравнивает с прошлым снимком и дописывает изменения в changelog.json (страница /patch).
 *  4. src/data/generated/meta.json — номер патча и дата обновления.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildDetails,
  comparePatches,
  diffDetails,
  findLatestPatch,
  toIndexEntry,
  type FeedHeroData,
  type FeedHeroListItem,
  type HeroDetails,
  type HeroIndexEntry,
  type PatchChangelog,
} from '../src/lib/feed';
import { HEROES } from '../src/data/heroes';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src/data/generated');
const API = 'https://www.dota2.com/datafeed';
const LANG = 'russian';

const args = process.argv.slice(2);
const argValue = (flag: string) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const offlineDir = argValue('--offline');
const patchArg = argValue('--patch');

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url: string, attempt = 1): Promise<unknown> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'dota-guide-data-updater' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    if (attempt >= 4) throw new Error(`Не удалось загрузить ${url}: ${(error as Error).message}`);
    await sleep(800 * attempt);
    return fetchJson(url, attempt + 1);
  }
}

async function readJson<T>(path: string, fallback: T): Promise<T> {
  if (!existsSync(path)) return fallback;
  return JSON.parse(await readFile(path, 'utf8')) as T;
}

async function writeJson(name: string, data: unknown) {
  await writeFile(join(OUT, name), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

async function loadHeroList(): Promise<FeedHeroListItem[]> {
  const json = offlineDir
    ? JSON.parse(await readFile(join(offlineDir, 'herolist.json'), 'utf8'))
    : await fetchJson(`${API}/herolist?language=${LANG}`);
  const heroes = (json as { result?: { data?: { heroes?: FeedHeroListItem[] } } }).result?.data?.heroes;
  if (!Array.isArray(heroes) || heroes.length < 100) throw new Error('Неожиданный формат списка героев.');
  return heroes;
}

async function loadHeroData(id: number): Promise<FeedHeroData | undefined> {
  if (offlineDir) {
    const path = join(offlineDir, `herodata-${id}.json`);
    if (!existsSync(path)) return undefined;
    return (JSON.parse(await readFile(path, 'utf8')) as { result: { data: { heroes: FeedHeroData[] } } }).result.data
      .heroes[0];
  }
  const json = (await fetchJson(`${API}/herodata?language=${LANG}&hero_id=${id}`)) as {
    result?: { data?: { heroes?: FeedHeroData[] } };
  };
  return json.result?.data?.heroes?.[0];
}

/** Загружает данные героев по 4 параллельно, с паузами — бережно к серверу. */
async function loadAll(list: FeedHeroListItem[]) {
  const result = new Map<number, FeedHeroData>();
  let done = 0;
  const queue = [...list];
  const worker = async () => {
    for (let item = queue.shift(); item; item = queue.shift()) {
      const data = await loadHeroData(item.id);
      if (data) result.set(item.id, data);
      done += 1;
      process.stdout.write(`\r  Загружено героев: ${done}/${list.length}`);
      if (!offlineDir) await sleep(150);
    }
  };
  await Promise.all(Array.from({ length: 4 }, worker));
  process.stdout.write('\n');
  return result;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  console.log(offlineDir ? `Режим offline: ${offlineDir}` : `Источник: ${API}`);

  const list = await loadHeroList();
  console.log(`Героев в игре: ${list.length}`);
  const data = await loadAll(list);

  // 1. Индекс всех героев
  const index: HeroIndexEntry[] = list
    .map((item) => toIndexEntry(item, data.get(item.id)))
    .sort((a, b) => a.name.localeCompare(b.name, 'en'));

  // 2. Детали героев сайта
  const details: Record<string, HeroDetails> = {};
  const missing: string[] = [];
  for (const hero of HEROES) {
    const entry = index.find((e) => e.slug === hero.id);
    const feed = entry ? data.get(entry.id) : undefined;
    if (!feed) {
      missing.push(hero.id);
      continue;
    }
    const rename = Object.fromEntries(hero.abilities.map((a) => [a.nameEn, a.name]));
    details[hero.id] = buildDetails(hero.id, feed, rename);
  }
  if (missing.length) console.warn(`⚠ Нет данных для: ${missing.join(', ')}`);

  // 3. Номер патча
  const meta = await readJson<{ patch: string; updatedAt: string }>(join(OUT, 'meta.json'), {
    patch: '7.41f',
    updatedAt: '',
  });
  let patch = patchArg ?? meta.patch;
  if (!patchArg && !offlineDir) {
    try {
      const found = findLatestPatch(await fetchJson(`${API}/patchnoteslist?language=english`));
      if (found && comparePatches(found, patch) >= 0) patch = found;
    } catch {
      console.warn('⚠ Не удалось узнать номер патча — оставляю прежний. Можно указать: --patch 7.42');
    }
  }

  // 4. Изменения относительно прошлого снимка
  const prev = await readJson<Record<string, HeroDetails>>(join(OUT, 'hero-details.json'), {});
  const changelog = await readJson<PatchChangelog[]>(join(OUT, 'changelog.json'), []);
  const heroes = Object.values(details)
    .map((next) => {
      const old = prev[next.slug];
      return { slug: next.slug, changes: old ? diffDetails(old, next) : [] };
    })
    .filter((h) => h.changes.length > 0);

  const today = new Date().toISOString().slice(0, 10);
  if (heroes.length) {
    const existing = changelog.find((c) => c.patch === patch);
    if (existing) {
      // Тот же патч обновили ещё раз — сливаем изменения.
      for (const h of heroes) {
        const old = existing.heroes.find((x) => x.slug === h.slug);
        if (old) old.changes.push(...h.changes);
        else existing.heroes.push(h);
      }
      existing.date = today;
    } else {
      changelog.unshift({ patch, date: today, heroes });
    }
    console.log(`Изменений: ${heroes.reduce((n, h) => n + h.changes.length, 0)} у ${heroes.length} героев.`);
  } else {
    console.log(Object.keys(prev).length ? 'Изменений в данных героев нет.' : 'Первый запуск — снимок сохранён.');
  }

  await writeJson('heroes-index.json', index);
  await writeJson('hero-details.json', details);
  await writeJson('changelog.json', changelog);
  await writeJson('meta.json', { patch, updatedAt: offlineDir ? meta.updatedAt || today : today });
  console.log(`Готово. Патч: ${patch}. Файлы: src/data/generated/`);
}

main().catch((error) => {
  console.error(`\n✖ ${(error as Error).message}`);
  process.exit(1);
});
