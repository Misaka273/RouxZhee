// 🕊️白木 原创开发 🔗gl.baimu.live
// 🎨 主题说明配置

// ========================================
// 📋 主题信息配置
// ========================================
export const themeConfig = {
  /** 主题名称 */
  name: '默认主题',

  /** 主题预览图路径 */
  preview: '/assets/shiroki.avif',

  /** 主题作者 */
  author: 'RouxZhee 团队',

  /** 主题描述 */
  description: '简洁优雅的文档主题，专注于阅读体验',
} as const;

export type ThemeConfig = typeof themeConfig;

export default themeConfig;
