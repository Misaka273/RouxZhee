/*
  Pagefind 客户端 API 类型定义
*/

export interface PagefindSearchFragment {
  url: string;
  excerpt: string;
  meta?: {
    title?: string;
    image?: string;
    [key: string]: string | undefined;
  };
  sub_results?: Array<{
    title: string;
    url: string;
    excerpt: string;
  }>;
}

export interface PagefindSearchResult {
  id: string;
  score: number;
  data: () => Promise<PagefindSearchFragment>;
}

export interface PagefindSearchResponse {
  results: PagefindSearchResult[];
  unfilteredResultCount: number;
}

export interface PagefindOptions {
  excerptLength?: number;
  basePath?: string;
  baseUrl?: string;
}

export interface PagefindModule {
  init: () => Promise<void>;
  options: (options: PagefindOptions) => Promise<void>;
  search: (term: string) => Promise<PagefindSearchResponse | null>;
  debouncedSearch: (
    term: string,
    options?: Record<string, unknown>,
    debounceTimeoutMs?: number
  ) => Promise<PagefindSearchResponse | null>;
}

declare module '/pagefind/pagefind.js' {
  const pagefind: PagefindModule;
  export const init: PagefindModule['init'];
  export const options: PagefindModule['options'];
  export const search: PagefindModule['search'];
  export const debouncedSearch: PagefindModule['debouncedSearch'];
}
