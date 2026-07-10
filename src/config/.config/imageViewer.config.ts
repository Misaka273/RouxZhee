// 🕊️白木 原创开发 🔗gl.baimu.live
// 用户自定义图片查看器配置 - 覆盖默认配置

import type { ImageViewerConfig } from '../imageViewer.config';

// ========================================
// 📝 用户自定义配置
// 这里的配置会覆盖默认配置
// ========================================
export const userImageViewerConfig: Partial<ImageViewerConfig> = {
  // ✨ 功能开关
  // enabled: true,

  // 🎯 文档内容区选择器
  // docSelector: '.rz-content',

  // 🚫 排除预览的图片选择器
  // 图片查看器仅用于文档落地页，已限定在 docSelector 内查找
  // excludeSelectors: [
  //   'a img',
  //   'img[src*="data:image/svg+xml"]',
  //   'pre img',
  //   '.code-block-wrapper img',
  // ],

  // 📐 层级控制
  // zIndex: 9998,

  // 🔍 缩放配置
  // scale: {
  //   min: 0.5,
  //   max: 3.0,
  //   step: 0.1,
  //   wheelStep: 0.1,
  // },

  // 🔄 旋转配置
  // rotationStep: 90,

  // ⏱️ 动画时长（ms）
  // animationDuration: 300,

  // 📝 文本常量
  // text: {
  //   closeAriaLabel: '关闭图片查看器',
  //   prevAriaLabel: '上一张',
  //   nextAriaLabel: '下一张',
  //   zoomInAriaLabel: '放大',
  //   zoomOutAriaLabel: '缩小',
  //   rotateAriaLabel: '旋转',
  //   fullscreenEnterAriaLabel: '进入全屏',
  //   fullscreenExitAriaLabel: '退出全屏',
  //   originalSizeAriaLabel: '原始大小',
  //   infoTemplate: '{current} / {total}',
  // },

  // ⌨️ 快捷键映射
  // keyboardShortcuts: {
  //   close: ['Escape'],
  //   zoomIn: ['+', '='],
  //   zoomOut: ['-'],
  //   rotate: ['r', 'R'],
  //   prev: ['ArrowLeft'],
  //   next: ['ArrowRight'],
  //   reset: ['0'],
  //   fullscreen: ['f', 'F'],
  // },
};
