// 🕊️白木 原创开发 🔗gl.baimu.live
// 运行时间组合式 - 在页面元素内展示站点运行时长

import { computed, getCurrentScope, onScopeDispose, type MaybeRef, toValue } from 'vue';
import { runtimeConfig } from '../config/runtime.config';

// ========================================
// 📋 类型定义
// ========================================
export interface UseRuntimeLabels {
  /** 天单位文案 */
  day?: string;
  /** 时单位文案 */
  hour?: string;
  /** 分单位文案 */
  minute?: string;
  /** 秒单位文案 */
  second?: string;
}

export interface UseRuntimeColors {
  /** 天数颜色 */
  day?: string;
  /** 小时颜色 */
  hour?: string;
  /** 分钟颜色 */
  minute?: string;
  /** 秒数颜色 */
  second?: string;
}

export interface UseRuntimeOptions {
  /** 目标元素选择器 */
  selector?: string;
  /** 是否立即启动刷新 */
  immediate?: boolean;
  /** 前缀文案 */
  prefix?: string;
  /** 后缀文案 */
  suffix?: string;
  /** 时间单位文案 */
  labels?: UseRuntimeLabels;
  /** 时间数字颜色 */
  colors?: UseRuntimeColors;
}

// ========================================
// 🔧 客户端环境判断
// ========================================
const isClient = typeof window !== 'undefined' && typeof document !== 'undefined';

// ========================================
// 🚀 组合式实现
// ========================================
/**
 * 站点运行时间组合式
 * @param initDate 站点启动时间（字符串或 ref），默认读取 runtimeConfig.initDate
 * @param options 展示配置项，未提供时使用 runtimeConfig 默认值
 * @returns { start, stop }
 */
export function useRuntime(
  initDate: MaybeRef<string> = runtimeConfig.initDate,
  options: UseRuntimeOptions = {}
) {
  const config = {
    selector: options.selector ?? runtimeConfig.selector,
    immediate: options.immediate ?? runtimeConfig.immediate,
    prefix: options.prefix ?? runtimeConfig.prefix,
    suffix: options.suffix ?? runtimeConfig.suffix,
    labels: { ...runtimeConfig.labels, ...options.labels },
    colors: { ...runtimeConfig.colors, ...options.colors },
  };

  const startTime = computed(() => new Date(toValue(initDate)));
  let runtimeElement: HTMLElement | null = null;
  let timer: ReturnType<typeof setInterval> | null = null;

  /**
   * 更新运行时间 DOM
   */
  const update = () => {
    if (!isClient || !runtimeElement) return;

    const now = new Date();
    const diff = now.getTime() - startTime.value.getTime();

    // ❌ 无效日期保护
    if (Number.isNaN(diff)) return;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    runtimeElement.innerHTML = `${config.prefix}
      <span style="color: ${config.colors.day}">${days}</span> ${config.labels.day}
      <span style="color: ${config.colors.hour}">${hours}</span> ${config.labels.hour}
      <span style="color: ${config.colors.minute}">${minutes}</span> ${config.labels.minute}
      <span style="color: ${config.colors.second}">${seconds}</span> ${config.labels.second}
      ${config.suffix}`;
  };

  /**
   * 查询元素并启动定时刷新
   */
  const start = () => {
    if (!isClient) return;

    // 🧹 先清理可能存在的旧定时器
    stop();

    runtimeElement = document.querySelector(config.selector);
    if (!runtimeElement) return;

    update();
    timer = setInterval(update, 1000);
  };

  /**
   * 清理定时器
   */
  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  // 🚀 立即启动
  if (config.immediate) {
    start();
  }

  // 🧹 作用域销毁时自动清理
  if (getCurrentScope()) {
    onScopeDispose(stop);
  }

  return { start, stop };
}

export default useRuntime;
