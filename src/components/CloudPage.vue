<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  ☁️ 全屏云标签落地页组件
-->

<template>
  <div class="cloud-page-wrapper">
    <!-- 🎯 页面标题 -->
    <header class="cloud-page-header">
      <h1 class="cloud-page-title">
        <span class="cloud-page-icon">{{ icon }}</span>
        <span>{{ title }}</span>
      </h1>
      <p class="cloud-page-subtitle">
        共 <strong>{{ items.length }}</strong> 个{{ itemLabel }}，点击即可筛选相关文档
      </p>
    </header>

    <!-- ☁️ 全屏标签云 -->
    <main class="cloud-page-body">
      <div v-if="displayItems.length > 0" ref="cloudWrapRef" class="cloud-page-wrap">
        <component
          :is="linkPrefix ? 'a' : 'span'"
          v-for="(item, index) in displayItems"
          :key="`cloud-page-${item.name}`"
          class="cloud-page-tag"
          :class="getCloudTheme(item.name)"
          :href="linkPrefix ? withBase(`${linkPrefix}/${encodeName(item.name)}`) : undefined"
          :style="{
            fontSize: getCloudFontSize(item.count),
            left: `calc(50% + ${positions[index]?.x ?? 0}px)`,
            top: `calc(50% + ${positions[index]?.y ?? 0}px)`,
            zIndex: displayItems.length - index,
          }"
        >
          <span class="cloud-page-name">{{ item.name }}</span>
          <span class="cloud-page-count">{{ item.count }}</span>
        </component>
      </div>
      <p v-else class="cloud-page-empty">暂无{{ itemLabel }}</p>
    </main>
  </div>
</template>

<script setup lang="ts">
/* ☁️ 全屏云标签落地页组件脚本 */

import { computed, onMounted, ref } from 'vue';
import { withBase } from '../utils/base';
import type { CloudItem } from '../config/blogger.config';

/* ☁️ 标签云容器引用与尺寸 */
const cloudWrapRef = ref<HTMLElement | null>(null);
const containerSize = ref(600);

function updateContainerSize() {
  if (cloudWrapRef.value) {
    const rect = cloudWrapRef.value.getBoundingClientRect();
    containerSize.value = Math.min(rect.width, rect.height);
  }
}

onMounted(() => {
  updateContainerSize();
  window.addEventListener('resize', updateContainerSize);
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
    maxCount: 100,
    minSize: 14,
    maxSize: 42,
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
  const maxRadius = size / 2 - 40;
  const goldenAngle = 2.39996; // 弧度

  const maxIndex = Math.max(data.length - 2, 2);
  const step = maxRadius / Math.pow(maxIndex, 0.6);

  return data.map((_, index) => {
    const r = Math.min(step * Math.pow(index, 1), maxRadius);
    const theta = index * goldenAngle;
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

<style lang="scss">
@use '../styles/cloud-page.scss' as *;
</style>
