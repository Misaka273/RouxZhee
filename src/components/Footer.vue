<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  🦶 页脚组件 - 承载运行时间等信息
-->

<template>
  <footer class="rouxzhee-footer" data-pagefind-ignore>
    <div class="rouxzhee-footer-inner">
      <!-- ⏱️ 站点运行时间 -->
      <Runtime v-if="runtimeConfig.enabled" />
    </div>
  </footer>
</template>

<script setup lang="ts">
import Runtime from './Runtime.vue';
import { runtimeConfig } from '../config/runtime.config';
</script>

<style scoped lang="scss">
/* ========================================
   🦶 页脚组件样式
   ======================================== */

.rouxzhee-footer {
  position: relative;
  z-index: var(--content-z-index);
  width: 100%;
  padding: 1.5rem 1rem;
  background: var(--bg-color);
  border-top: 1px solid var(--border-color);
}

.rouxzhee-footer-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: var(--max-content-width);
  margin: 0 auto;
}

/* ========================================
   📱 移动端适配
   ======================================== */
@media (max-width: 768px) {
  .rouxzhee-footer {
    padding: 1rem;
  }

  .rouxzhee-footer-inner {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>
