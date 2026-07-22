<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  😎余温 原创开发 🔗https://wiki.xxdevops.cn
  ☁️ 侧边栏云标签卡片组件
-->

<template>
  <section class="cloud-card">
    <!-- 头部：标题 + 数量徽章 -->
    <header class="cloud-card-header">
      <h3 class="cloud-card-title">
        <span class="cloud-card-icon">{{ icon }}</span>
        <span>{{ title }}</span>
      </h3>
      <span class="cloud-card-badge">
        <span class="cloud-card-count">{{ displayItems.length }}</span>
        <span>个{{ itemLabel }}</span>
      </span>
    </header>

    <!-- 分隔线 -->
    <div class="cloud-card-divider" />

        <!-- 标签云 -->
    <div class="cloud-card-body">
      <div v-if="displayItems.length > 0" ref="cloudWrapRef" class="cloud-wrap">
        <component
          :is="linkPrefix ? 'a' : 'span'"
          v-for="(item, index) in displayItems"
          :key="`cloud-${item.name}`"
          class="cloud-tag"
          :class="getCloudTheme(item.name)"
          :href="linkPrefix ? withBase(`${linkPrefix}/${encodeName(item.name)}`) : undefined"
          :style="{
            fontSize: getCloudFontSize(item.count),
            left: `calc(50% + ${positions[index]?.x ?? 0}px)`,
            top: `calc(50% + ${positions[index]?.y ?? 0}px)`,
            zIndex: displayItems.length - index,
          }"
        >
          <span class="cloud-name">{{ item.name }}</span>
          <span class="cloud-count">{{ item.count }}</span>
        </component>
      </div>
      <p v-else class="cloud-empty">暂无{{ itemLabel }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
/* ☁️ 云标签卡片组件脚本 */

import { computed, onMounted, ref } from 'vue';
import { withBase } from '../utils/base';
import type { CloudItem } from '../config/blogger.config';

/* ☁️ 标签云容器引用与尺寸 */
const cloudWrapRef = ref<HTMLElement | null>(null);
const containerSize = ref(260);

function updateContainerSize() {
  if (cloudWrapRef.value) {
    containerSize.value = cloudWrapRef.value.clientWidth;
  }
}

onMounted(() => {
  updateContainerSize();
});

/* 📋 组件属性 */
const props = withDefaults(
  defineProps<{
    title: string;
    icon?: string;
    itemLabel?: string;
    items: CloudItem[];
    linkPrefix?: string;
    maxCount?: number;
    minSize?: number;
    maxSize?: number;
  }>(),
  {
    icon: '☁️',
    itemLabel: '标签',
    linkPrefix: '',
    maxCount: 20,
    minSize: 12,
    maxSize: 24,
  },
);

/* 🔗 名称编码（用于 URL） */
function encodeName(name: string): string {
  return encodeURIComponent(name);
}

/* ☁️ 截断后的展示数据 */
const displayItems = computed<CloudItem[]>(() => {
  return props.items.slice(0, props.maxCount);
});

/* 📐 圆形云布局位置计算（数量越多越靠近中心） */
const positions = computed<{ x: number; y: number }[]>(() => {
  const data = displayItems.value;
  if (data.length === 0) return [];

  const size = containerSize.value;
  const maxRadius = size / 2 - 20;
  const goldenAngle = 2.39996; // °弧度

  // 按 count 降序已保证数量越多越靠前（越中心）
  const maxIndex = Math.max(data.length - 2, 2);
  const step = maxRadius / Math.pow(maxIndex, 0.6);

  return data.map((item, index) => {
    // 使用 0.6 次方让外圈分布更稀疏，减少完全重叠
    const r = Math.min(step * Math.pow(index, 1), maxRadius);
    const theta = index * goldenAngle;
    // 固定 2 位小数，避免服务端与客户端浮点精度差异导致 hydration 警告
    return {
      x: Number((r * Math.cos(theta)).toFixed(2)),
      y: Number((r * Math.sin(theta)).toFixed(2)),
    };
  });
});

/* 📊 云字体大小计算（数量越多，文字越大） */
function getCloudFontSize(count: number): string {
  const data = displayItems.value;
  const counts = data.map((item) => item.count);
  const max = Math.max(...counts, 1);
  const min = Math.min(...counts, max);
  if (max === min) return `${props.minSize}px`;
  const size = props.minSize + ((count - min) / (max - min)) * (props.maxSize - props.minSize);
  return `${Math.round(size)}px`;
}

/* 🎨 云标签颜色主题 */
const cloudThemes = ['purple', 'blue', 'pink', 'cyan', 'green', 'orange'];

function getCloudTheme(name: string): string {
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `tag--${cloudThemes[index % cloudThemes.length]}`;
}

</script>

<style scoped lang="scss">
/* 🎨 云标签卡片样式 */

.cloud-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: var(--card-padding);
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--card-border-radius);
  box-shadow: var(--card-shadow);
  overflow: hidden;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  transform: translateZ(0);
  will-change: transform, box-shadow;

  &:hover {
    transform: var(--card-transform-hover);
    box-shadow: var(--card-shadow-hover);
  }

  /* 头部 */
  .cloud-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem 0.75rem;
    margin-bottom: 0.875rem;
  }

  .cloud-card-title {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--text-color);
    font-family: var(--font-heading);

    .cloud-card-icon {
      font-size: 1rem;
      line-height: 1;
    }
  }

  .cloud-card-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.75rem;
    border-radius: 100px;
    font-size: 0.75rem;
    font-weight: 500;
    background: rgba(255, 255, 255, 0.35);
    border: 1px solid var(--glass-border);
    color: var(--text-secondary);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);

    .cloud-card-count {
      color: var(--text-color);
      font-weight: 600;
    }
  }

  /* 分隔线 */
  .cloud-card-divider {
    width: 100%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--glass-border) 20%,
      var(--glass-border) 80%,
      transparent
    );
    margin-bottom: 0.875rem;
    opacity: 0.6;
  }

/* 标签云容器 */
  .cloud-card-body {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 260px;
  }

  .cloud-wrap {
    position: relative;
    width: 100%;
    max-width: 320px;
    aspect-ratio: 1 / 1;
    margin: 0 auto;
  }

  .cloud-empty {
    margin: 0;
    padding: 1rem 0;
    text-align: center;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  /* 单个标签 */
  .cloud-tag {
    position: absolute;
    left: 50%;
    top: 50%;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.375rem 0.75rem;
    border-radius: 100px;
    font-weight: 500;
    letter-spacing: 0.3px;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    background: rgba(255, 255, 255, 0.35);
    border: 1px solid var(--glass-border);
    color: var(--text-secondary);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    will-change: transform, box-shadow, color;
    /* 以自身中心为定位基准 */
    transform: translate(-50%, -50%);
    text-decoration: none;

    .cloud-name {
      line-height: 1.4;
    }

    .cloud-count {
      font-size: 0.75em;
      opacity: 0.7;
      font-weight: 400;
    }

    &:hover {
      transform: translate(-50%, -50%) scale(1.12) translateY(-3px);
      box-shadow: 0 8px 20px -4px rgba(0, 0, 0, 0.15);
      z-index: 10;
    }

    /* 🎨 亮色模式颜色主题 */
    &.tag--purple {
      background: rgba(139, 92, 246, 0.08);
      border-color: rgba(139, 92, 246, 0.18);
      color: #7c3aed;

      &:hover {
        background: rgba(139, 92, 246, 0.16);
        box-shadow: 0 8px 20px -4px rgba(139, 92, 246, 0.2);
      }
    }

    &.tag--blue {
      background: rgba(59, 130, 246, 0.08);
      border-color: rgba(59, 130, 246, 0.18);
      color: #2563eb;

      &:hover {
        background: rgba(59, 130, 246, 0.16);
        box-shadow: 0 8px 20px -4px rgba(59, 130, 246, 0.2);
      }
    }

    &.tag--pink {
      background: rgba(236, 72, 153, 0.08);
      border-color: rgba(236, 72, 153, 0.18);
      color: #db2777;

      &:hover {
        background: rgba(236, 72, 153, 0.16);
        box-shadow: 0 8px 20px -4px rgba(236, 72, 153, 0.2);
      }
    }

    &.tag--cyan {
      background: rgba(34, 211, 238, 0.08);
      border-color: rgba(34, 211, 238, 0.18);
      color: #0891b2;

      &:hover {
        background: rgba(34, 211, 238, 0.16);
        box-shadow: 0 8px 20px -4px rgba(34, 211, 238, 0.2);
      }
    }

    &.tag--green {
      background: rgba(52, 211, 153, 0.08);
      border-color: rgba(52, 211, 153, 0.18);
      color: #059669;

      &:hover {
        background: rgba(52, 211, 153, 0.16);
        box-shadow: 0 8px 20px -4px rgba(52, 211, 153, 0.2);
      }
    }

    &.tag--orange {
      background: rgba(251, 146, 60, 0.08);
      border-color: rgba(251, 146, 60, 0.18);
      color: #ea580c;

      &:hover {
        background: rgba(251, 146, 60, 0.16);
        box-shadow: 0 8px 20px -4px rgba(251, 146, 60, 0.2);
      }
    }
  }
}

/* 🌙 暗色模式适配 */
:global(.dark-mode) {
  .cloud-card {
    background: var(--glass-bg);
    border-color: var(--glass-border);

    .cloud-card-title {
      color: var(--text-color);
    }

    .cloud-card-badge {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.6);

      .cloud-card-count {
        color: rgba(255, 255, 255, 0.85);
      }
    }

    .cloud-card-divider {
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.1) 20%,
        rgba(255, 255, 255, 0.1) 80%,
        transparent
      );
    }

    .cloud-empty {
      color: var(--text-secondary);
    }

    .cloud-tag {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.75);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

      &:hover {
        box-shadow: 0 8px 20px -4px rgba(0, 0, 0, 0.3);
      }

      &.tag--purple {
        background: rgba(139, 92, 246, 0.15);
        border-color: rgba(139, 92, 246, 0.25);
        color: #c4b5fd;

        &:hover {
          background: rgba(139, 92, 246, 0.25);
          box-shadow: 0 8px 20px -4px rgba(139, 92, 246, 0.25);
        }
      }

      &.tag--blue {
        background: rgba(59, 130, 246, 0.15);
        border-color: rgba(59, 130, 246, 0.25);
        color: #93c5fd;

        &:hover {
          background: rgba(59, 130, 246, 0.25);
          box-shadow: 0 8px 20px -4px rgba(59, 130, 246, 0.25);
        }
      }

      &.tag--pink {
        background: rgba(236, 72, 153, 0.15);
        border-color: rgba(236, 72, 153, 0.25);
        color: #f9a8d4;

        &:hover {
          background: rgba(236, 72, 153, 0.25);
          box-shadow: 0 8px 20px -4px rgba(236, 72, 153, 0.25);
        }
      }

      &.tag--cyan {
        background: rgba(34, 211, 238, 0.12);
        border-color: rgba(34, 211, 238, 0.22);
        color: #67e8f9;

        &:hover {
          background: rgba(34, 211, 238, 0.22);
          box-shadow: 0 8px 20px -4px rgba(34, 211, 238, 0.2);
        }
      }

      &.tag--green {
        background: rgba(52, 211, 153, 0.12);
        border-color: rgba(52, 211, 153, 0.22);
        color: #6ee7b7;

        &:hover {
          background: rgba(52, 211, 153, 0.22);
          box-shadow: 0 8px 20px -4px rgba(52, 211, 153, 0.2);
        }
      }

      &.tag--orange {
        background: rgba(251, 146, 60, 0.12);
        border-color: rgba(251, 146, 60, 0.22);
        color: #fdba74;

        &:hover {
          background: rgba(251, 146, 60, 0.22);
          box-shadow: 0 8px 20px -4px rgba(251, 146, 60, 0.2);
        }
      }
    }
  }
}
</style>
