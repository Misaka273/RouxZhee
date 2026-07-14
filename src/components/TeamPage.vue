<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  👥 RZ 团队页面组件
  配置来源：src/页面模板/team.md
-->

<template>
  <div class="team-page-wrapper">
    <main class="team-page">
      <!-- 品牌信息 -->
      <section class="team-brand-section card-with-decoration">
        <div class="brand-left">
          <div class="brand-logo-wrapper">
            <img
              :src="config.brand.logo"
              :alt="config.brand.name"
              class="brand-logo"
              loading="eager"
            />
          </div>
        </div>
        <div class="brand-right">
          <h1 class="brand-name">{{ config.brand.name }}</h1>
          <p class="brand-short-name">品牌简称 {{ config.brand.shortName }}</p>
        </div>
      </section>

      <!-- 品牌含义 -->
      <section class="team-meaning-section">
        <div class="meaning-card meaning-card-left card-with-decoration">
          <h2 class="meaning-title">{{ config.meaning.left.title }}</h2>
          <p
            v-for="(line, index) in config.meaning.left.lines"
            :key="`meaning-left-${index}`"
            class="meaning-line"
          >
            {{ line }}
          </p>
        </div>

        <div class="meaning-center">
          <div class="meaning-sparkle" aria-hidden="true">
            <div class="sparkle-track">
              <span class="sparkle-dot"></span>
            </div>
            <p
              v-for="(line, index) in config.meaning.center"
              :key="`meaning-center-${index}`"
              class="meaning-center-line"
            >
              {{ line }}
            </p>
          </div>
        </div>

        <div class="meaning-card meaning-card-right card-with-decoration">
          <h2 class="meaning-title">{{ config.meaning.right.title }}</h2>
          <p
            v-for="(line, index) in config.meaning.right.lines"
            :key="`meaning-right-${index}`"
            class="meaning-line"
          >
            {{ line }}
          </p>
        </div>
      </section>

      <!-- 介绍卡片 + 品牌 Slogan -->
      <section class="team-info-section">
        <div class="intro-card card-with-decoration">
          <p
            v-for="(line, index) in config.intro.lines"
            :key="`intro-${index}`"
            class="intro-line"
          >
            {{ line }}
          </p>
        </div>

        <div
          class="slogan-card card-with-decoration"
          @mouseenter="pauseSloganCarousel"
          @mouseleave="resumeSloganCarousel"
        >
          <div class="slogan-stage">
            <span class="slogan-measure" aria-hidden="true">{{ longestSlogan }}</span>
            <span
              v-for="(part, index) in config.slogan.parts"
              :key="`slogan-${index}`"
              class="slogan-part"
              :style="{ animationDelay: `${index * 2.5}s` }"
            >
              {{ part }}
            </span>
          </div>
          <span class="slogan-watermark" aria-hidden="true">{{ config.brand.name }}</span>
        </div>
      </section>

      <!-- 团队成员 -->
      <section class="team-members-section">
        <h2 class="section-title">👥 团队成员</h2>
        <div class="members-grid">
          <div
            v-for="(member, index) in config.members"
            :key="`member-${index}`"
            class="member-card card-with-decoration"
          >
            <div class="member-avatar-wrapper">
              <img
                :src="member.avatar"
                :alt="member.name"
                class="member-avatar"
                loading="lazy"
              />
            </div>
            <div class="member-info">
              <div class="member-header">
                <h3 class="member-name">{{ member.name }}</h3>
                <span class="member-tag">{{ member.tag }}</span>
              </div>
              <p class="member-description">{{ member.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 投喂板块 -->
      <section class="team-sponsor-section">
        <h2 class="section-title">☕ 投喂支持</h2>
        <div class="sponsor-amounts">
          <button
            v-for="(amount, index) in config.sponsor.amounts"
            :key="`amount-${index}`"
            type="button"
            class="sponsor-amount-card"
            :class="{ active: selectedAmount === amount }"
            @click="selectedAmount = amount"
          >
            <span class="amount-value">{{ amount }}</span>
            <span class="amount-unit">元</span>
          </button>
        </div>
        <button
          type="button"
          class="sponsor-button"
          :disabled="!selectedAmount"
          @click="handleSponsor"
        >
          {{ config.sponsor.buttonText }}
        </button>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
/* 👥 RZ 团队页面组件脚本 */

import { ref, computed, onUnmounted } from 'vue';
import type { TeamConfig } from '../types/team';

interface Props {
  config: TeamConfig;
}

const props = defineProps<Props>();
const config = props.config;

/* 📏 取最长 Slogan 文本，用于自适应卡片宽度 */
const longestSlogan = computed(() => {
  const parts = config.slogan.parts || [];
  return parts.slice().sort((a, b) => b.length - a.length)[0] || '';
});

/* ☕ 当前选中的投喂金额 */
const selectedAmount = ref<number | null>(config.sponsor.amounts[0] ?? null);

/* 🚀 投喂按钮点击：预留支付 API 接入点 */
function handleSponsor() {
  if (!selectedAmount.value) return;

  const apiUrl = config.sponsor.apiUrl?.trim();
  if (apiUrl) {
    // 后续接入真实支付 API
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: selectedAmount.value }),
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('投喂接口调用失败:', error);
    });
  } else {
    // eslint-disable-next-line no-console
    console.log(`投喂金额：${selectedAmount.value} 元，请接入 sponsor.apiUrl`);
  }
}

/* ⏸️ Slogan 轮播悬停暂停：等当前文字完全显示后再暂停 */
let pauseTimerId: number | null = null;
const SLOGAN_CYCLE_MS = 7500;
// 每段 slogan 进入 opacity:1 后的“完全显示”时间段（基于统一循环时间轴）
const SLOGAN_HOLD_RANGES: Array<[number, number]> = [
  [750, 1875],   // 0：0s
  [3250, 4375],  // 1：2.5s
  [5750, 6875],  // 2：5s
];

function getSloganAnimations(): Animation[] {
  const stage = document.querySelector('.slogan-stage');
  if (!stage) return [];
  try {
    return Array.from(stage.getAnimations({ subtree: true })).filter((anim) => {
      const target = anim.effect?.target;
      return target instanceof Element && target.classList.contains('slogan-part');
    });
  } catch {
    return Array.from(stage.getAnimations()).filter((anim) => {
      const target = anim.effect?.target;
      return target instanceof Element && target.classList.contains('slogan-part');
    });
  }
}

function getSloganCycleTime(): number | null {
  const anims = getSloganAnimations();
  if (!anims.length) return null;
  const currentTime = anims[0].currentTime;
  if (currentTime == null) return null;
  return (currentTime as number) % SLOGAN_CYCLE_MS;
}

function pauseSloganCarousel() {
  if (pauseTimerId != null) {
    clearTimeout(pauseTimerId);
    pauseTimerId = null;
  }

  const animations = getSloganAnimations();
  if (!animations.length) return;

  const doPause = () => {
    animations.forEach((anim) => anim.pause());
  };

  const cycleTime = getSloganCycleTime();
  if (cycleTime == null) {
    doPause();
    return;
  }

  // 若当前已处于某段文字的完全显示阶段，直接暂停
  const isInHold = SLOGAN_HOLD_RANGES.some(
    ([start, end]) => cycleTime >= start && cycleTime <= end
  );
  if (isInHold) {
    doPause();
    return;
  }

  // 否则等待下一段文字进入完全显示阶段
  const nextStart =
    SLOGAN_HOLD_RANGES.map(([start]) => start)
      .filter((start) => start > cycleTime)
      .sort((a, b) => a - b)[0] ?? SLOGAN_CYCLE_MS + SLOGAN_HOLD_RANGES[0][0];
  const waitMs = nextStart - cycleTime;

  pauseTimerId = window.setTimeout(() => {
    doPause();
    pauseTimerId = null;
  }, waitMs);
}

function resumeSloganCarousel() {
  if (pauseTimerId != null) {
    clearTimeout(pauseTimerId);
    pauseTimerId = null;
  }
  getSloganAnimations().forEach((anim) => {
    if (anim.playState === 'paused') anim.play();
  });
}

onUnmounted(() => {
  if (pauseTimerId != null) {
    clearTimeout(pauseTimerId);
  }
});
</script>

<style scoped lang="scss">
@use '../styles/team-page.scss' as *;
</style>
