// 🕊️白木 原创开发 🔗gl.baimu.live
// 子路径部署 base 前缀工具 - 从 astro.config.mjs 的 base 配置同步

/**
 * 站点 base 路径（来源：astro.config.mjs → import.meta.env.BASE_URL）
 * 部署到域名根时为 '/'，部署到子路径（如 /zr/）时为对应前缀
 */
export const base: string = import.meta.env.BASE_URL;

/**
 * 拼接 base 前缀
 * - 外部链接（http/https/mailto/锚点/#）原样返回
 * - 以 '/' 开头的站内路径自动补全 base 前缀
 * - 裸路径（如 docs/foo）会先规范为根绝对路径，避免在嵌套文档页被当成相对路径
 *   （否则 /docs/sake/ + docs/software → /docs/sake/docs/software）
 * - 显式相对路径（./ ../）保持相对，不处理
 *
 * @example base='/zr/' 时: withBase('/about') => '/zr/about'
 *          base='/' 时:    withBase('/about') => '/about'
 *          withBase('docs/foo') => '/docs/foo'（或带 base 前缀）
 */
export function withBase(path: string): string {
  if (!path) return path;
  // 外部链接 / 协议相对 / 锚点，不处理
  if (/^(https?:)?\/\//.test(path) || path.startsWith('mailto:') || path.startsWith('#')) {
    return path;
  }
  // 显式相对路径（./foo、../foo、?query）保持原样
  if (path.startsWith('.') || path.startsWith('?')) {
    return path;
  }

  // 裸路径规范为根绝对路径，防止嵌套页下相对解析导致路径重复拼接
  let normalized = path.startsWith('/') ? path : `/${path}`;

  const prefix = base.endsWith('/') ? base.slice(0, -1) : base;
  // 根路径
  if (normalized === '/') return prefix === '' ? '/' : `${prefix}/`;
  // 已带 base 前缀，避免重复拼接
  if (prefix !== '' && (normalized === prefix || normalized.startsWith(`${prefix}/`))) {
    return normalized;
  }
  return `${prefix}${normalized}`;
}

/**
 * 文档 slug → 带 base 的站内绝对链接
 * @example docHref('docs/software/fth7h') => '/docs/software/fth7h'（或 /zr/docs/...）
 */
export function docHref(slug: string): string {
  if (!slug) return withBase('/');
  return withBase(slug.startsWith('/') ? slug : `/${slug}`);
}
