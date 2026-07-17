// 🕊️白木 原创开发 🔗gl.baimu.live
// Astro 核心配置 - 性能优化
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import { visit } from 'unist-util-visit';

/**
 * 🧹 去除 Markdown 中的 HTML 注释节点及其产生的空段落
 * 避免注释被渲染成含 <br> 的空白段落，造成移动端文档内容顶部出现大段空白
 */
function remarkStripHtmlComments() {
  return (tree) => {
    visit(tree, 'paragraph', (node, index, parent) => {
      if (!parent || typeof index !== 'number') return;
      const onlyWhitespaceCommentsOrBreaks = node.children.every((child) => {
        if (child.type === 'text') return /^\s*$/.test(child.value);
        if (child.type === 'html') return /^\s*<!--[\s\S]*?-->\s*$/.test(child.value);
        if (child.type === 'break') return true;
        return false;
      });
      if (onlyWhitespaceCommentsOrBreaks) {
        parent.children.splice(index, 1);
        return index;
      }
    });
  };
}

// https://astro.build/config
export default defineConfig({
  // 🚀 构建优化配置
  build: {
    // 📦 启用 HTML 压缩
    inlineStylesheets: 'auto',
    // 🗜️ 资源压缩
    compressHTML: true,
  },

  // 🎯 Vue 集成配置
  integrations: [
    vue({
      // ⚡ Vue 组件优化
      appInject: {
        // 可以在这里注入全局配置
      },
    })
  ],

  // 🌐 站点 URL（全项目唯一配置入口，SEO / canonical / og:url 等均从此自动同步）
  site: 'https://gl.baimu.live',

  // 📄 输出模式配置
  output: 'static',

  // 🚀 Vite 构建优化
  vite: {
    cacheDir: `.astro/vite-cache-${process.getuid?.() ?? 'user'}`,
    server: {
      // 允许 CNB 云开发代理域名访问 Astro/Vite dev server
      allowedHosts: ['.cnb.run'],
    },
    build: {
      // 📦 CSS 代码分割
      cssCodeSplit: true,
      // 🗜️ 禁用 CSS 压缩以规避 lightningcss rgba 解析问题
      cssMinify: false,
      // 🗜️ 启用 Terser 压缩（比 esbuild 更激进）
      minify: 'terser',
      terserOptions: {
        compress: {
          // 删除 console 和 debugger
          drop_console: true,
          drop_debugger: true,
          // 更激进的压缩
          passes: 2,
          // 内联小函数
          inline: 2,
        },
        mangle: {
          // 压缩变量名
          safari10: true,
        },
        format: {
          // 删除注释
          comments: false,
        },
      },
      // 📦 代码分割策略
      rollupOptions: {
        output: {
          // 手动代码分割 - 只包含项目内部模块
          manualChunks: (id) => {
            // 工具函数单独打包
            if (id.includes('src/utils/image.ts') || id.includes('src/utils/performance.ts')) {
              return 'utils';
            }
          },
          // 确保 chunk 文件名包含哈希
          entryFileNames: '_astro/[name].[hash].js',
          chunkFileNames: '_astro/[name].[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name || '';
            if (info.endsWith('.css')) {
              return '_astro/styles/[name].[hash][extname]';
            }
            return '_astro/[name].[hash][extname]';
          },
        },
      },
      // 🎯 chunk 大小警告阈值（KB）
      chunkSizeWarningLimit: 500,
    },
    css: {
      // 🎨 开发环境禁用 source map 以提升性能
      devSourcemap: false,
    },
    // 💾 依赖优化
    optimizeDeps: {
      include: ['vue'],
    },
  },

  // 🖼️ 图片优化配置
  image: {
    // 🎨 默认图片质量
    quality: 80,
    // 📐 默认图片格式
    format: ['avif', 'webp'],
  },

  // 🔧 预渲染策略
  prerender: {
    // 📄 预渲染所有路由（静态站点推荐）
    entries: ['*'],
  },

  // 🌍 国际化配置（可选）
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  // 📝 Markdown 处理配置
  markdown: {
    remarkPlugins: [remarkStripHtmlComments],
  },
});
