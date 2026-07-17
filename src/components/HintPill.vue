<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  💬 状态提示胶囊 - 全局可复用提示组件
  📖 通过 useHintPill() 控制显示/隐藏，可放置于任意相对定位容器内
-->

<script setup lang="ts">
import { useHintPill } from '../composables/useHintPill';

const { hintText, visible } = useHintPill();
</script>

<template>
  <div
    class="hint-pill"
    :class="{ 'is-visible': visible }"
    aria-hidden="true"
  >
    {{ hintText }}
  </div>
</template>

<style scoped lang="scss">
// 💬 状态提示胶囊
.hint-pill {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translateY(4px);
  padding: 7px 16px;
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.2;
  color: var(--navbar-hint-text);
  background: var(--navbar-capsule-bg);
  border: 1px solid var(--navbar-capsule-border);
  border-radius: 9999px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition:
    opacity 0.25s ease,
    visibility 0.25s ease,
    transform 0.25s ease;
  z-index: 2;

  &.is-visible {
    opacity: 1;
    visibility: visible;
    transform: translate(-50%, -50%) translateY(0);
  }

  @media (max-width: 768px) {
    display: none;
  }
}
</style>