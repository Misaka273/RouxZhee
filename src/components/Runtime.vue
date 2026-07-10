<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  ⏱️ 运行时间展示组件
-->

<template>
  <span :id="elementId" class="rouxzhee-runtime" />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRuntime } from '../composables/useRuntime';
import { runtimeConfig } from '../config/runtime.config';

// 📝 从选择器中解析元素 id
const elementId = computed(() => runtimeConfig.selector.replace(/^#/, ''));

// 🚀 使用组合式，挂载后启动
const { start } = useRuntime(runtimeConfig.initDate, {
  selector: runtimeConfig.selector,
  immediate: false,
});

onMounted(start);
</script>

<style scoped lang="scss">
.rouxzhee-runtime {
  font-family: var(--rouxzhee-font-family-mono, 'Monaco', 'Menlo', 'Consolas', monospace);
  font-size: 0.875rem;
  color: var(--text-secondary);
  white-space: nowrap;
}
</style>
