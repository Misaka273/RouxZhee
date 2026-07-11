<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  👤 个人介绍页面组件
-->

<template>
  <div class="about-page-wrapper">
    <main class="about-page">
      <!-- 一、首屏 · 身份锚定区 -->
      <section class="about-header animate-fade-in-up animate-delay-1">
        <div class="header-tags left">
          <span
            v-for="(tag, index) in config.hero.headerTags.left"
            :key="`left-${index}`"
            class="tag"
          >
            {{ tag }}
          </span>
        </div>

        <div class="header-avatar">
          <div class="avatar-wrapper circle-rotate">
            <img
              :src="config.hero.avatar"
              :alt="config.hero.avatarAlt"
              class="blogger-avatar"
              loading="eager"
            />
            <span class="status-icon">🟢</span>
          </div>
        </div>

        <div class="header-tags right">
          <span
            v-for="(tag, index) in config.hero.headerTags.right"
            :key="`right-${index}`"
            class="tag"
          >
            {{ tag }}
          </span>
        </div>
      </section>

      <!-- 姓名 / 职业锚点 / 价值主张 / 核心数据 -->
      <section class="about-identity animate-fade-in-up animate-delay-2">
        <h1 class="identity-name">{{ config.hero.name }}</h1>
        <p class="identity-handle">{{ config.hero.handle }}</p>
        <p class="identity-role">{{ config.hero.role }}</p>
        <p class="identity-value">{{ config.hero.valueProposition }}</p>

        <div class="identity-stats">
          <div
            v-for="(stat, index) in config.hero.stats"
            :key="`stat-${index}`"
            class="stat-item"
          >
            <span class="stat-icon">{{ stat.icon }}</span>
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </section>

      <!-- 介绍卡片 -->
      <section class="intro-cards animate-fade-in-up animate-delay-3">
        <div class="intro-card gradient-card">
          <span class="greeting">泥嚎，很高兴认识你 👋</span>
          <span class="name">{{ config.hero.name }}</span>
          <span class="role">{{ config.hero.role.split('｜')[0] }}</span>
        </div>
        <div class="intro-card text-card">
          <span class="label">追求</span>
          <h2 class="title">源于热爱<br>而去创造</h2>
          <div class="tags">
            <span>bug 制造机</span>
            <span>往来穿梭，带走一部分 bug</span>
            <span>提交要努力，Pr 要开心</span>
          </div>
        </div>
      </section>

      <!-- 二、故事钩子 · 共鸣区 -->
      <section class="story-section animate-fade-in-up animate-delay-4">
        <h2 class="section-title">
          <span class="icon">📖</span>
          <span>故事钩子</span>
          <span class="subtitle">把简历变活人</span>
        </h2>

        <div class="story-content">
          <div class="story-image-wrapper">
            <img
              :src="config.story.image"
              alt="故事配图"
              class="story-image"
              loading="lazy"
            />
          </div>

          <div class="story-text">
            <blockquote class="story-quote">
              {{ config.story.quote }}
            </blockquote>

            <div class="story-paragraphs">
              <p
                v-for="(paragraph, index) in config.story.paragraphs"
                :key="`story-p-${index}`"
              >
                {{ paragraph }}
              </p>
            </div>

            <div class="story-testimonial">
              <span class="testimonial-author">{{ config.story.testimonial.author }}</span>
              <p class="testimonial-content">{{ config.story.testimonial.content }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 三、硬核履历 · 时间轴 -->
      <section class="career-section animate-fade-in-up animate-delay-5">
        <h2 class="section-title">
          <span class="icon">💼</span>
          <span>{{ config.career.title.replace('💼 ', '') }}</span>
          <span class="subtitle">简历原教旨部分</span>
        </h2>

        <div class="career-content">
          <div class="timeline">
            <div
              v-for="(item, index) in config.career.items"
              :key="`career-${index}`"
              class="timeline-item"
            >
              <div class="timeline-marker">
                <span class="timeline-dot"></span>
                <span v-if="index !== config.career.items.length - 1" class="timeline-line"></span>
              </div>
              <div class="timeline-body">
                <div class="timeline-meta">
                  <span class="timeline-period">{{ item.period }}</span>
                  <span class="timeline-company">{{ item.company }}</span>
                  <span class="timeline-role">{{ item.role }}</span>
                </div>
                <ul class="timeline-highlights">
                  <li
                    v-for="(highlight, hIndex) in item.highlights"
                    :key="`highlight-${index}-${hIndex}`"
                  >
                    {{ highlight }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 四、技能与工具箱 -->
      <section class="skills-section animate-fade-in-up animate-delay-6">
        <h2 class="section-title">
          <span class="icon">🛠️</span>
          <span>{{ config.skills.title.replace('🛠️ ', '') }}</span>
          <span class="subtitle">一目了然的能力雷达</span>
        </h2>

        <div class="skills-content">
          <!-- 饼图 -->
          <div class="skills-chart-wrapper">
            <svg viewBox="0 0 200 200" class="skills-chart">
              <circle cx="100" cy="100" r="85" class="skills-chart-bg" />
              <path
                v-for="slice in skillsChartData.slices"
                :key="slice.name"
                :d="slice.path"
                :fill="slice.color"
                class="skills-chart-slice"
                :class="{ active: activeSkillCategory === slice.name }"
                @mouseenter="activeSkillCategory = slice.name"
                @mouseleave="activeSkillCategory = null"
              />
              <circle cx="100" cy="100" r="55" class="skills-chart-hole" />
              <text x="100" y="95" text-anchor="middle" class="skills-chart-total">
                {{ skillsChartData.total }}
              </text>
              <text x="100" y="115" text-anchor="middle" class="skills-chart-total-label">
                项技能
              </text>
            </svg>
          </div>

          <!-- 图例与详情 -->
          <div class="skills-legend">
            <div
              v-for="(category, index) in skillsChartData.categories"
              :key="`legend-${index}`"
              class="skill-legend-item"
              :class="{ active: activeSkillCategory === category.name }"
              @mouseenter="activeSkillCategory = category.name"
              @mouseleave="activeSkillCategory = null"
            >
              <div class="legend-header">
                <span class="legend-dot" :style="{ background: category.color }"></span>
                <h3 class="legend-name">{{ category.name }}</h3>
                <span class="legend-percentage">{{ category.percentage }}%</span>
              </div>
              <div class="legend-items">
                <span
                  v-for="(item, sIndex) in category.items"
                  :key="`legend-item-${index}-${sIndex}`"
                  class="legend-tag"
                  :class="`level-${item.levelClass}`"
                >
                  {{ item.level ? `${item.level} · ` : '' }}{{ item.label }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 五、博主输出 · 影响力资产 -->
      <section class="influence-section animate-fade-in-up animate-delay-7">
        <h2 class="section-title">
          <span class="icon">📢</span>
          <span>{{ config.influence.title.replace('📢 ', '') }}</span>
          <span class="subtitle">把博客当第二产品</span>
        </h2>

        <div class="influence-grid">
          <!-- 全网影响力 -->
          <div class="influence-card stats-card">
            <h3 class="influence-card-title">{{ config.influence.stats.label }}</h3>
            <div class="influence-stats">
              <div
                v-for="(stat, index) in config.influence.stats.items"
                :key="`influence-stat-${index}`"
                class="influence-stat"
              >
                <span class="influence-stat-value">{{ stat.value }}</span>
                <span class="influence-stat-label">{{ stat.label }}</span>
              </div>
            </div>
          </div>

          <!-- 精选代表作 -->
          <div class="influence-card links-card">
            <h3 class="influence-card-title">{{ config.influence.featured.label }}</h3>
            <div class="influence-links">
              <a
                v-for="(link, index) in config.influence.featured.links"
                :key="`featured-${index}`"
                :href="link.href"
                class="influence-link"
              >
                <span class="link-icon">{{ link.icon }}</span>
                <span class="link-text">{{ link.text }}</span>
              </a>
            </div>
          </div>

          <!-- 项目展示 -->
          <div class="influence-card links-card">
            <h3 class="influence-card-title">{{ config.influence.projects.label }}</h3>
            <div class="influence-links">
              <a
                v-for="(link, index) in config.influence.projects.links"
                :key="`project-${index}`"
                :href="link.href"
                class="influence-link"
              >
                <span class="link-icon">{{ link.icon }}</span>
                <span class="link-text">{{ link.text }}</span>
              </a>
            </div>
          </div>

          <!-- 其他：支持多个自定义卡片 -->
          <div
            v-for="(card, index) in config.influence.others"
            :key="`other-card-${index}`"
            class="influence-card links-card"
          >
            <h3 class="influence-card-title">{{ card.label }}</h3>
            <div class="influence-links">
              <a
                v-for="(link, lIndex) in card.links"
                :key="`other-${index}-${lIndex}`"
                :href="link.href"
                class="influence-link"
              >
                <span class="link-icon">{{ link.icon }}</span>
                <span class="link-text">{{ link.text }}</span>
              </a>
            </div>
          </div>

          <!-- 行业认可 -->
          <div class="influence-card recognition-card">
            <h3 class="influence-card-title">{{ config.influence.recognition.label }}</h3>
            <ul class="recognition-list">
              <li
                v-for="(item, index) in config.influence.recognition.items"
                :key="`recognition-${index}`"
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 六、个性彩蛋区 -->
      <section class="quirks-section animate-fade-in-up animate-delay-8">
        <h2 class="section-title">
          <span class="icon">🎮</span>
          <span>{{ config.quirks.title.replace('🎮 ', '') }}</span>
          <span class="subtitle">只属于你的怪癖</span>
        </h2>

        <div class="quirks-grid">
          <div
            v-for="(quirk, index) in config.quirks.items"
            :key="`quirk-${index}`"
            class="quirk-card"
          >
            <span class="quirk-icon">{{ quirk.icon }}</span>
            <h3 class="quirk-title">{{ quirk.title }}</h3>
            <p class="quirk-content">{{ quirk.content }}</p>
          </div>
        </div>
      </section>

      <!-- 底部联系信息 -->
      <section class="about-footer animate-fade-in-up animate-delay-9">
        <p class="footer-line">
          📧 商务合作/技术顾问咨询：
          <a :href="`mailto:${config.footer.email}`" class="footer-email">
            {{ config.footer.email }}
          </a>
          ｜ 回复效率：{{ config.footer.replyNote }}
          ｜ {{ config.footer.updateText }}
        </p>

        <!-- 🖼️ 底部自定义图片 -->
        <div
          v-if="config.footer.images && config.footer.images.length > 0"
          class="footer-images"
        >
          <div
            v-for="(image, index) in config.footer.images"
            :key="`footer-image-${index}`"
            class="footer-image-wrapper"
          >
            <component
              :is="getFooterImage(image).href ? 'a' : 'div'"
              :href="getFooterImage(image).href"
              :target="getFooterImage(image).external ? '_blank' : undefined"
              :rel="getFooterImage(image).external ? 'noopener noreferrer' : undefined"
              class="footer-image-link"
            >
              <img
                :src="getFooterImage(image).src"
                :alt="getFooterImage(image).alt || ` footer-image-${index}`"
                class="footer-image"
                loading="lazy"
              />
            </component>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
/* 🔗 个人介绍页面组件脚本 */

import { computed, ref } from 'vue';
import { aboutConfig } from '../config/about.config';
import type { FooterImageItem } from '../config/about.config';

/* 📋 配置数据 */
const config = aboutConfig;

/* 🎯 当前高亮的技能分类 */
const activeSkillCategory = ref<string | null>(null);

/* 🎨 技能分类配色（自动循环） */
const skillCategoryColors = [
  '#ec4899',
  '#0e7490',
  '#8b5cf6',
  '#f59e0b',
  '#10b981',
  '#ef4444',
  '#06b6d4',
  '#84cc16',
];

/* 📊 技能饼图数据 */
const skillsChartData = computed(() => {
  const categories = config.skills.categories.map((category, index) => ({
    ...category,
    color: skillCategoryColors[index % skillCategoryColors.length],
    count: category.items.length,
  }));

  const total = categories.reduce((sum, category) => sum + category.count, 0);
  let currentAngle = -90;

  const slices = categories.map((category) => {
    const percentage = total > 0 ? category.count / total : 0;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    return {
      name: category.name,
      color: category.color,
      path: createDonutSlicePath(100, 100, 85, 50, startAngle, endAngle),
      percentage: Math.round(percentage * 100),
    };
  });

  return {
    categories: categories.map((category, index) => ({
      ...category,
      percentage: slices[index].percentage,
    })),
    slices,
    total,
  };
});

/* 📐 生成甜甜圈扇形路径 */
function createDonutSlicePath(
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
): string {
  const toRad = (angle: number) => (angle * Math.PI) / 180;

  const x1 = cx + outerRadius * Math.cos(toRad(startAngle));
  const y1 = cy + outerRadius * Math.sin(toRad(startAngle));
  const x2 = cx + outerRadius * Math.cos(toRad(endAngle));
  const y2 = cy + outerRadius * Math.sin(toRad(endAngle));

  const x3 = cx + innerRadius * Math.cos(toRad(endAngle));
  const y3 = cy + innerRadius * Math.sin(toRad(endAngle));
  const x4 = cx + innerRadius * Math.cos(toRad(startAngle));
  const y4 = cy + innerRadius * Math.sin(toRad(startAngle));

  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${x1} ${y1}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
    'Z',
  ].join(' ');
}

/* 🖼️ 统一底部图片配置格式 */
function getFooterImage(image: FooterImageItem) {
  if (typeof image === 'string') {
    return { src: image, alt: '', href: '', external: false };
  }
  return {
    src: image.src,
    alt: image.alt ?? '',
    href: image.href ?? '',
    external: image.external ?? false,
  };
}
</script>

<style scoped lang="scss">
@use '../styles/about-page.scss' as *;
</style>
