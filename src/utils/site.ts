// 🕊️白木 原创开发 🔗gl.baimu.live
// 站点 URL 工具 - 从 astro.config.mjs 的 site 配置同步

/**
 * 获取站点 URL（来源：astro.config.mjs → import.meta.env.SITE）
 * 全项目只需在 astro.config.mjs 配置 site，此处自动同步
 */
export function getSiteUrl(): string {
  const site = import.meta.env.SITE;
  if (!site) return '';
  return site.replace(/\/$/, '');
}
