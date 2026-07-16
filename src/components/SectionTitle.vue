<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  区块标题组件（椭圆轨道 + 副标题 + 渐变主标题）
-->

<template>
  <div class="title-wrapper">
    <svg class="orbit" viewBox="0 0 420 120">
      <defs>
        <linearGradient :id="gradientId" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="var(--primary-color)" stop-opacity="0.95" />
          <stop offset="15%" stop-color="var(--primary-color)" stop-opacity="0.05" />
          <stop offset="50%" stop-color="var(--primary-color)" stop-opacity="0.06" />
          <stop offset="85%" stop-color="var(--primary-color)" stop-opacity="0.05" />
          <stop offset="100%" stop-color="var(--primary-color)" stop-opacity="0.95" />
        </linearGradient>
      </defs>
      <ellipse
        cx="210"
        cy="60"
        rx="200"
        ry="50"
        :stroke="`url(#${gradientId})`"
      />
    </svg>
    <div class="subtitle">{{ subtitle }}</div>
    <h2 class="section-title">{{ title }}</h2>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue';

interface Props {
  subtitle: string;
  title: string;
}

defineProps<Props>();

const gradientId = useId();
</script>

<style scoped lang="scss">
.title-wrapper {
  position: relative;
  text-align: center;
  padding: 24px 16px;
  margin-top: 130px;
  margin-bottom: 4px;
}

.orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  max-width: 90vw;
  height: auto;
  transform: translate(-50%, -50%) rotate(-8deg);
  z-index: 0;
  pointer-events: none;

  ellipse {
    fill: none;
    stroke-width: 3;
    stroke-dasharray: 10 14;
    stroke-linecap: round;
  }
}

.subtitle {
  position: relative;
  z-index: 1;
  font-size: 11px;
  font-weight: 600;
  color: var(--primary-color);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.section-title {
  position: relative;
  z-index: 1;
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 900;
  letter-spacing: -1px;
  background: linear-gradient(
    135deg,
    var(--about-gradient-start) 0%,
    var(--about-gradient-end) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transform: skewX(-6deg);
  display: inline-block;
  filter: drop-shadow(
    0 2px 4px color-mix(in srgb, var(--primary-color) 25%, transparent)
  );
  margin-bottom: 0;
}
</style>
