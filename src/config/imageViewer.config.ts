// 🕊️白木 原创开发 🔗gl.baimu.live
// 图片查看器配置 - 双层配置架构设计

// ========================================
// 📋 默认配置
// ========================================
export const defaultImageViewerConfig = {
  // ✨ 功能开关
  enabled: true,

  // 🎯 DOM 选择器
  docSelector: '.rz-content',

  // 🚫 排除预览的图片选择器
  // 图片查看器仅用于文档落地页，已限定在 docSelector 内查找，
  // 此处主要排除文档内容区内不应触发预览的图片
  excludeSelectors: [
    'a img',
    'img[src*="data:image/svg+xml"]',
    'pre img',
    '.code-block-wrapper img',
  ] as string[],

  // 📐 层级控制
  zIndex: 9998,

  // 🔍 缩放配置
  scale: {
    min: 0.5,
    max: 3.0,
    step: 0.1,
    wheelStep: 0.1,
  },

  // 🔄 旋转配置
  rotationStep: 90,

  // ⏱️ 动画时长（ms）
  animationDuration: 300,

  // 📝 文本常量（统一由 TypeScript 管理，避免硬编码）
  text: {
    closeAriaLabel: '关闭图片查看器',
    prevAriaLabel: '上一张',
    nextAriaLabel: '下一张',
    zoomInAriaLabel: '放大',
    zoomOutAriaLabel: '缩小',
    rotateAriaLabel: '旋转',
    fullscreenEnterAriaLabel: '进入全屏',
    fullscreenExitAriaLabel: '退出全屏',
    originalSizeAriaLabel: '原始大小',
    infoTemplate: '{current} / {total}',
  },

  // ⌨️ 快捷键映射
  keyboardShortcuts: {
    close: ['Escape'],
    zoomIn: ['+', '='],
    zoomOut: ['-'],
    rotate: ['r', 'R'],
    prev: ['ArrowLeft'],
    next: ['ArrowRight'],
    reset: ['0'],
    fullscreen: ['f', 'F'],
  },
} as const;

// ========================================
// 📋 配置类型定义
// ========================================
export type ImageViewerConfig = typeof defaultImageViewerConfig;

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
const userConfigModules = import.meta.glob('./.config/imageViewer.config.ts', { eager: true });

const imageViewerUserModule = userConfigModules['./.config/imageViewer.config.ts'] as Record<string, any> | undefined;

const userImageViewerConfig: Partial<ImageViewerConfig> | undefined = imageViewerUserModule?.userImageViewerConfig;

export const imageViewerConfig: ImageViewerConfig = userImageViewerConfig
  ? mergeConfig(defaultImageViewerConfig, userImageViewerConfig)
  : defaultImageViewerConfig;

export default imageViewerConfig;
