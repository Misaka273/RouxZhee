// 🕊️白木 原创开发 🔗gl.baimu.live
// 光标拖尾特效配置 - 双层配置架构设计

// ========================================
// 📋 默认配置
// ========================================
export const defaultCursorTrailConfig = {
  // ✨ 功能开关
  enabled: true,

  // 🎯 DOM 标识
  containerId: 'rouxzhee-cursor-trail-container',
  starClass: 'rouxzhee-cursor-trail-star',

  // 📐 绘制阈值：鼠标移动超过此距离（px）才生成新星星
  distToDraw: 50,

  // ⏱️ 星星动画持续时间（ms）
  delay: 1000,

  // 🔤 星星字体尺寸集合
  fontSizes: ['1.1rem', '1.4rem', '0.8rem', '1.7rem'] as string[],

  // 🎨 星星颜色 CSS 变量名集合（实际颜色由 SCSS 全局变量管理）
  colorVariables: [
    '--cursor-trail-color-1',
    '--cursor-trail-color-2',
    '--cursor-trail-color-3',
    '--cursor-trail-color-4',
    '--cursor-trail-color-5',
    '--cursor-trail-color-6',
  ] as string[],

  // ✦ 星星字符
  starCharacter: '✦',

  // 🧭 下落方向单选框 name，页面提供 input[name="trailside"] 可切换方向
  fallDirectionInputName: 'trailside',

  // 🧭 默认下落方向：1 向下，-1 向上
  defaultFallDirection: 1,
} as const;

// ========================================
// 📋 配置类型定义
// ========================================
export type CursorTrailConfig = typeof defaultCursorTrailConfig;

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
const userConfigModules = import.meta.glob('./.config/cursorTrail.config.ts', { eager: true });

const cursorTrailUserModule = userConfigModules['./.config/cursorTrail.config.ts'] as Record<string, any> | undefined;

const userCursorTrailConfig: Partial<CursorTrailConfig> | undefined = cursorTrailUserModule?.userCursorTrailConfig;

export const cursorTrailConfig: CursorTrailConfig = userCursorTrailConfig
  ? mergeConfig(defaultCursorTrailConfig, userCursorTrailConfig)
  : defaultCursorTrailConfig;

export default cursorTrailConfig;
