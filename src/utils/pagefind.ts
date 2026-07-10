/*
  Pagefind 搜索工具 - 懒加载索引与搜索
*/

import type { PagefindModule, PagefindSearchFragment } from '../types/pagefind';

let pagefindModule: PagefindModule | null = null;
let initPromise: Promise<PagefindModule | null> | null = null;
let indexAvailable: boolean | null = null;

/** 检查 Pagefind 索引是否可用 */
export async function isPagefindAvailable(): Promise<boolean> {
  if (indexAvailable !== null) return indexAvailable;

  try {
    const response = await fetch('/pagefind/pagefind-entry.json', { method: 'HEAD' });
    indexAvailable = response.ok;
  } catch {
    indexAvailable = false;
  }

  return indexAvailable;
}

/** 运行时动态加载 Pagefind（避免 Vite 构建时解析） */
async function importPagefind(): Promise<PagefindModule> {
  const importer = new Function('specifier', 'return import(specifier)') as (
    specifier: string
  ) => Promise<PagefindModule>;
  return importer('/pagefind/pagefind.js');
}

/** 懒加载并初始化 Pagefind */
export async function getPagefind(): Promise<PagefindModule | null> {
  if (pagefindModule) return pagefindModule;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const available = await isPagefindAvailable();
    if (!available) return null;

    try {
      const module = await importPagefind();
      await module.options({ excerptLength: 24 });
      await module.init();
      pagefindModule = module;
      return module;
    } catch (error) {
      console.warn('[Pagefind] 初始化失败:', error);
      indexAvailable = false;
      return null;
    }
  })();

  return initPromise;
}

export interface FlatSearchResult {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  isSubResult?: boolean;
}

/** 将 Pagefind 结果展平为 UI 列表项 */
export async function flattenSearchResults(
  results: Awaited<ReturnType<PagefindModule['search']>>
): Promise<FlatSearchResult[]> {
  if (!results?.results?.length) return [];

  const items: FlatSearchResult[] = [];

  for (const result of results.results) {
    const data: PagefindSearchFragment = await result.data();
    const title = data.meta?.title || data.url;

    items.push({
      id: result.id,
      title,
      url: data.url,
      excerpt: data.excerpt,
    });

    if (data.sub_results?.length) {
      for (const sub of data.sub_results) {
        items.push({
          id: `${result.id}-${sub.url}`,
          title: sub.title || title,
          url: sub.url,
          excerpt: sub.excerpt,
          isSubResult: true,
        });
      }
    }
  }

  return items;
}
