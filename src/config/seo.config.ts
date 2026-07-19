// 🕊️白木 原创开发 🔗gl.baimu.live
// SEO 配置 - 双层配置架构设计

import { withBase } from '../utils/base';

// ========================================
// 📋 默认配置
// ========================================
export const defaultSeoConfig = {
  /** 站点名称 */
  siteName: 'RouxZhee博客',

  /** 默认标题 */
  defaultTitle: 'RouxZhee',

  /** 标题模板，%s 为页面标题 */
  titleTemplate: '%s | RouxZhee',

  /** 默认描述 */
  defaultDescription: 'RouxZhee博客 - 注重阅读与写文档的个人博客',

  /** 默认社交分享 / 搜索引擎配图 */
  defaultImage: withBase('/assets/img/RouxZhee-shilitu.jpg'),

  /** Open Graph 区域设置 */
  locale: 'zh_CN',

  /** 浏览器主题色 */
  themeColor: '#0e7490',

  /** 默认作者 */
  author: 'RouxZhee',

  /** robots 默认策略 */
  robots: {
    index: true,
    follow: true,
  },

  /** Twitter Card 配置 */
  twitter: {
    card: 'summary_large_image' as 'summary' | 'summary_large_image' | 'app' | 'player',
    site: '',
    creator: '',
  },

  /** Open Graph 默认配置 */
  openGraph: {
    type: 'website' as 'website' | 'article',
    siteName: 'RouxZhee博客',
  },

  /** JSON-LD 结构化数据 */
  jsonLd: {
    enabled: true,
  },
} as const;

// ========================================
// 📋 配置类型定义
// ========================================
export type SeoConfig = typeof defaultSeoConfig;

// ========================================
// 🔧 配置合并函数
// ========================================
function mergeConfig<T extends Record<string, any>>(defaultConfig: T, userConfig?: Partial<T>): T {
  if (!userConfig) return defaultConfig;

  const merged = { ...defaultConfig };
  for (const key in userConfig) {
    if (userConfig[key] !== undefined) {
      if (Array.isArray(userConfig[key])) {
        merged[key] = userConfig[key] as T[Extract<keyof T, string>];
      } else if (typeof userConfig[key] === 'object' && userConfig[key] !== null) {
        merged[key] = mergeConfig(merged[key], userConfig[key]);
      } else {
        merged[key] = userConfig[key] as T[Extract<keyof T, string>];
      }
    }
  }
  return merged;
}

// ========================================
// 🔧 构建时配置加载策略
// ========================================
// 使用 import.meta.glob 仅加载对应的用户配置，避免不同配置间循环引用
const userConfigModules = import.meta.glob('./.config/seo.config.ts', { eager: true });
const seoUserModule = userConfigModules['./.config/seo.config.ts'] as Record<string, any> | undefined;
const userSeoConfig: Partial<SeoConfig> | undefined = seoUserModule?.userSeoConfig;

export const seoConfig: SeoConfig = userSeoConfig
  ? mergeConfig(defaultSeoConfig, userSeoConfig)
  : defaultSeoConfig;

export default seoConfig;
