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
 * - 已是完整 base 路径或相对路径原样返回
 *
 * @example base='/zr/' 时: withBase('/about') => '/zr/about'
 *          base='/' 时:    withBase('/about') => '/about'
 */
export function withBase(path: string): string {
  if (!path) return path;
  // 外部链接 / 协议相对 / 锚点，不处理
  if (/^(https?:)?\/\//.test(path) || path.startsWith('mailto:') || path.startsWith('#')) {
    return path;
  }
  if (!path.startsWith('/')) return path;

  const prefix = base.endsWith('/') ? base.slice(0, -1) : base;
  // 根路径
  if (path === '/') return prefix === '' ? '/' : `${prefix}/`;
  // 已带 base 前缀，避免重复拼接
  if (prefix !== '' && (path === prefix || path.startsWith(`${prefix}/`))) return path;
  return `${prefix}${path}`;
}
