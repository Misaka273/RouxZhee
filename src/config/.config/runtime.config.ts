// 🕊️白木 原创开发 🔗gl.baimu.live
// 用户自定义运行时间配置 - 覆盖默认配置

import type { RuntimeConfig } from '../runtime.config';

// ========================================
// 📝 用户自定义配置
// ========================================
export const userRuntimeConfig: Partial<RuntimeConfig> = {
  // 🚀 站点启动时间（请替换为实际建站时间）
  // initDate: '2026-04-14T00:00:22Z',

  // 📝 前缀文案
  // prefix: '已运行地球🌏',

  // 🎨 时间数字颜色（支持 CSS 变量或直接写色值）
  // colors: {
  //   day: 'var(--rouxzhee-runtime-day-color)',
  //   hour: 'var(--rouxzhee-runtime-hour-color)',
  //   minute: 'var(--rouxzhee-runtime-minute-color)',
  //   second: 'var(--rouxzhee-runtime-second-color)',
  // },
};

// 默认导出
export default userRuntimeConfig;
