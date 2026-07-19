// 🕊️白木 原创开发 🔗gl.baimu.live
// 🎨 主题说明配置

import versionInfo from '../../version.json';

// ========================================
// 📋 主题信息配置
// ========================================
export const themeConfig = {
  /** 主题名称（读取 version.json themeName） */
  name: versionInfo.themeName,

  /** 主题预览图路径 */
  preview: '/assets/shiroki.avif',

  /** 主题作者 */
  author: 'RouxZhee 团队',

  /** 主题描述（读取 version.json themeDescription） */
  description: versionInfo.themeDescription,
} as const;

export type ThemeConfig = typeof themeConfig;

export default themeConfig;
