/*
  🕊️白木 原创开发 🔗gl.baimu.live
  📋 SEO 类型定义
*/

/** 页面级 SEO 输入（Layout / 页面传入） */
export interface SeoPageInput {
  title: string;
  description?: string;
  /** 自定义 canonical 路径，如 /basic-syntax-guide */
  canonical?: string;
  /** 页面配图（相对或绝对 URL） */
  image?: string;
  /** Open Graph 类型 */
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  author?: string;
  noindex?: boolean;
  /** 是否套用 titleTemplate，默认 true */
  useTitleTemplate?: boolean;
  /** frontmatter: seoTitle */
  seoTitle?: string;
  /** frontmatter: seoDescription */
  seoDescription?: string;
  /** frontmatter: ogImage */
  ogImage?: string;
}

/** 解析后的完整 SEO 数据（供 SeoHead 渲染） */
export interface ResolvedSeo {
  title: string;
  description: string;
  canonical: string;
  absoluteUrl: string;
  image: string;
  absoluteImage: string;
  type: 'website' | 'article';
  siteName: string;
  locale: string;
  themeColor: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  author?: string;
  noindex: boolean;
  twitter: {
    card: string;
    site?: string;
    creator?: string;
  };
  jsonLdEnabled: boolean;
}
