// 🕊️白木 原创开发 🔗gl.baimu.live
// 站点概览页面用户自定义配置

import type { SiteOverviewConfig } from '../site.config';
// 📝 以下配置与 src/config/site.config.ts 的默认数据来源保持一致
// 取消注释后会覆盖默认值
import { seoConfig } from '../seo.config';
import { aboutConfig } from '../about.config';
import { bloggerConfig } from '../blogger.config';
import { themeConfig } from '../theme.config';

// ========================================
// 📝 用户自定义配置
// 默认配置已从 seo / about / blogger / runtime / version.json / theme.config.ts / doc 自动读取
// 如需覆盖，取消对应注释并修改值即可
// ========================================
export const userSiteOverviewConfig: Partial<SiteOverviewConfig> = {
  // 🏠 站点信息卡片（默认自动读取 seoConfig 与 runtimeConfig）
  site: {
    name: seoConfig.siteName,
    description: seoConfig.defaultDescription,
    icon: '/favicon.svg',
    status: 'normal',
  },

  // 🔗 绑定域名（无外部配置来源，按需填写）
  domain: {
    primary: 'wiki.xxdevops.cn',
    aliases: ['www.wiki.xxdevops.cn'],
    status: 'resolved',
  },

  // 👤 拥有者 & 备案信息（默认自动读取 aboutConfig 与 bloggerConfig）
  owner: {
    name: aboutConfig.hero.name,
    contact: aboutConfig.footer.email,
  },
  icp: {
    number: bloggerConfig.beian.icp.text,
    href: bloggerConfig.beian.icp.href,
    entity: aboutConfig.hero.name,
  },
  gongan: {
    text: bloggerConfig.beian.gongan.text,
    href: bloggerConfig.beian.gongan.href,
  },

  // 📝 文档统计（默认自动读取 doc 目录，无需在此配置）

  // 🏷️ 分类云（默认自动读取 doc 目录 frontmatter 的 category，无需在此配置）

  // 🏷️ 标签云（默认自动读取 doc 目录 frontmatter 的 tags，无需在此配置）

  // 📊 站点访客量（无外部配置来源，按需填写）
  visitors: {
    total: 123456,
    today: 1234,
    yesterday: 2345,
    month: 34567,
    online: 42,
  },

  // 🎨 当前主题（默认自动读取 theme.config.ts 与 version.json）
  theme: {
    name: themeConfig.name,
    preview: themeConfig.preview,
    author: themeConfig.author,
    description: themeConfig.description,
  },
};

export default userSiteOverviewConfig;
