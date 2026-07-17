// 🕊️白木 原创开发 🔗gl.baimu.live
// 运行时间配置 - 双层配置架构设计

// ========================================
// 📋 默认配置
// ========================================
export const defaultRuntimeConfig = {
  // 🎯 是否启用运行时间展示
  enabled: true,

  // 🚀 站点启动时间（ISO 8601）
  initDate: '2026-04-14T00:00:22Z',

  // 🔍 目标元素选择器
  selector: '#runtime',

  // ▶️ 是否在组件挂载时立即启动
  immediate: false,

  // 📝 前缀文案
  prefix: '已运行地球🌏',

  // 📝 后缀文案
  suffix: '',

  // 📝 时间单位文案
  labels: {
    day: '天',
    hour: '时',
    minute: '分',
    second: '秒',
  },

  // 🎨 时间数字颜色（引用 SCSS 全局变量）
  colors: {
    day: 'var(--rouxzhee-runtime-day-color)',
    hour: 'var(--rouxzhee-runtime-hour-color)',
    minute: 'var(--rouxzhee-runtime-minute-color)',
    second: 'var(--rouxzhee-runtime-second-color)',
  },
} as const;

// ========================================
// 📋 配置类型定义
// ========================================
export type RuntimeConfig = typeof defaultRuntimeConfig;

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
const userConfigModules = import.meta.glob('./.config/runtime.config.ts', { eager: true });

// 获取 runtime 用户配置模块
const runtimeUserModule = userConfigModules['./.config/runtime.config.ts'] as Record<string, any> | undefined;

// 提取用户配置
const userRuntimeConfig: Partial<RuntimeConfig> | undefined = runtimeUserModule?.userRuntimeConfig;

// 最终配置：优先使用用户配置，否则使用默认配置
export const runtimeConfig: RuntimeConfig = userRuntimeConfig
  ? mergeConfig(defaultRuntimeConfig, userRuntimeConfig)
  : defaultRuntimeConfig;

// 默认导出
export default runtimeConfig;
