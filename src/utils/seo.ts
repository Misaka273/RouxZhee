// 🕊️白木 原创开发 🔗gl.baimu.live
// SEO 工具函数 - 解析页面 SEO 数据

import { seoConfig } from '../config/seo.config';
import { getSiteUrl } from './site';
import type { ResolvedSeo, SeoPageInput } from '../types/seo';

/**
 * 将相对路径转为绝对 URL
 */
export function toAbsoluteUrl(path: string, siteUrl?: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const base = (siteUrl || getSiteUrl()).replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

/**
 * 格式化页面标题
 */
export function formatSeoTitle(title: string, useTemplate = true): string {
  if (!useTemplate) return title;

  const template = seoConfig.titleTemplate;
  if (template.includes('%s')) {
    return template.replace('%s', title);
  }

  return `${title} | ${seoConfig.siteName}`;
}

/**
 * 解析页面 SEO 配置，合并全局默认值
 */
export function resolvePageSeo(
  page: SeoPageInput,
  pathname: string = '/',
  siteUrl?: string
): ResolvedSeo {
  const baseUrl = siteUrl || getSiteUrl();

  const rawTitle = page.seoTitle || page.title;
  const title = formatSeoTitle(rawTitle, page.useTitleTemplate !== false);
  const description = page.seoDescription || page.description || seoConfig.defaultDescription;
  const image = page.ogImage || page.image || seoConfig.defaultImage;
  const canonicalPath = normalizeCanonical(page.canonical || pathname);
  const absoluteUrl = toAbsoluteUrl(canonicalPath, baseUrl);
  const absoluteImage = toAbsoluteUrl(image, baseUrl);
  const type = page.type || seoConfig.openGraph.type;

  return {
    title,
    description,
    canonical: canonicalPath,
    absoluteUrl,
    image,
    absoluteImage,
    type,
    siteName: seoConfig.openGraph.siteName,
    locale: seoConfig.locale,
    themeColor: seoConfig.themeColor,
    publishedTime: page.publishedTime,
    modifiedTime: page.modifiedTime,
    tags: page.tags,
    author: page.author || seoConfig.author,
    noindex: page.noindex === true,
    twitter: {
      card: seoConfig.twitter.card,
      site: seoConfig.twitter.site || undefined,
      creator: seoConfig.twitter.creator || undefined,
    },
    jsonLdEnabled: seoConfig.jsonLd.enabled,
  };
}

/**
 * 快捷创建页面 SEO 输入
 */
export function createPageSeo(input: SeoPageInput): SeoPageInput {
  return input;
}

function normalizeCanonical(path: string): string {
  if (!path) return '/';
  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
  return withLeadingSlash.replace(/\/+$/, '') || '/';
}

/**
 * 生成 robots meta 内容
 */
export function getRobotsContent(noindex: boolean): string {
  if (noindex) return 'noindex, nofollow';

  const { index, follow } = seoConfig.robots;
  const parts: string[] = [];
  parts.push(index ? 'index' : 'noindex');
  parts.push(follow ? 'follow' : 'nofollow');
  return parts.join(', ');
}
