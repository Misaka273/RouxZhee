// 🕊️白木 原创开发 🔗gl.baimu.live
// 用户自定义光标拖尾特效配置 - 覆盖默认配置

import type { CursorTrailConfig } from '../cursorTrail.config';

// ========================================
// 📝 用户自定义配置
// 这里的配置会覆盖默认配置
// ========================================
export const userCursorTrailConfig: Partial<CursorTrailConfig> = {
  // ✨ 功能开关
  // enabled: true,

  // 📐 绘制阈值（px）
  // distToDraw: 50,

  // ⏱️ 动画持续时间（ms）
  // delay: 1000,

  // 🔤 字体尺寸集合
  // fontSizes: ['1.1rem', '1.4rem', '0.8rem', '1.7rem'],

  // 🎨 颜色 CSS 变量名集合（需与 variables.scss 中定义保持一致）
  // colorVariables: [
  //   '--cursor-trail-color-1',
  //   '--cursor-trail-color-2',
  //   '--cursor-trail-color-3',
  //   '--cursor-trail-color-4',
  //   '--cursor-trail-color-5',
  //   '--cursor-trail-color-6',
  // ],

  // ✦ 星星字符
  // starCharacter: '✦',

  // 🧭 下落方向单选框 name
  // fallDirectionInputName: 'trailside',

  // 🧭 默认下落方向
  // defaultFallDirection: 1,
};
