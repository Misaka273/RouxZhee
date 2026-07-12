<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  🏠 站点概览页面组件
-->

<template>
  <div class="site-page-wrapper">
    <main class="site-page">
      <!-- 页面标题 -->
      <header class="site-page-header animate-fade-in-up animate-delay-1">
        <h1 class="page-title">
          <span class="title-icon">🏠</span>
          <span>站点概览</span>
        </h1>
        <p class="page-subtitle">一站式的站点核心信息展示与快捷管理入口</p>
      </header>

      <!-- 两栏布局 -->
      <div class="site-page-layout">
        <!-- 上方左右卡片：站点主题 + 站点访客量 -->
        <div class="site-page-top">
          <!-- 站点使用主题 -->
          <section class="site-card theme-card animate-fade-in-up animate-delay-2">
            <h2 class="card-title">
              <span class="card-icon">🎨</span>
              <span>站点主题</span>
            </h2>

            <div class="theme-content">
              <img
                :src="config.theme.preview"
                :alt="config.theme.name"
                class="theme-preview"
                loading="lazy"
              />
              <div class="theme-info">
                <h3 class="theme-name">{{ config.theme.name }}</h3>
                <span class="theme-version">{{ config.theme.version }}</span>
                <p class="theme-author">作者：{{ config.theme.author }}</p>
                <p class="theme-description">{{ config.theme.description }}</p>
              </div>
            </div>
          </section>

          <!-- 站点访客量 -->
          <section class="site-card visitors-card animate-fade-in-up animate-delay-2">
            <h2 class="card-title">
              <span class="card-icon">📊</span>
              <span>站点访客量</span>
            </h2>

            <div class="visitors-main">
              <p class="visitors-total-label">累计访客</p>
              <span class="visitors-total-value">{{ formatNumber(config.visitors.total) }}</span>
            </div>

            <div class="visitors-grid">
              <div class="visitors-item">
                <span class="visitors-item-value">{{ formatNumber(config.visitors.today) }}</span>
                <span class="visitors-item-label">今日</span>
              </div>
              <div class="visitors-item">
                <span class="visitors-item-value">{{ formatNumber(config.visitors.yesterday) }}</span>
                <span class="visitors-item-label">昨日</span>
              </div>
              <div class="visitors-item">
                <span class="visitors-item-value">{{ formatNumber(config.visitors.month) }}</span>
                <span class="visitors-item-label">本月</span>
              </div>
              <div class="visitors-item visitors-online">
                <span class="visitors-item-value">{{ formatNumber(config.visitors.online) }}</span>
                <span class="visitors-item-label">实时在线</span>
              </div>
            </div>
          </section>
        </div>

        <!-- 下方主内容区 -->
        <div class="site-page-main">
          <!-- 站点信息卡片 -->
          <section class="site-card site-info-card animate-fade-in-up animate-delay-2">
            <div class="site-info-header">
              <div class="site-icon-wrapper">
                <img
                  :src="config.site.icon"
                  :alt="config.site.name"
                  class="site-icon-img"
                  loading="eager"
                />
              </div>
              <div class="site-info-meta">
                <h2 class="site-name">{{ config.site.name }}</h2>
                <span class="site-status" :class="`status-${config.site.status}`">
                  {{ siteStatusText }}
                </span>
              </div>
            </div>

            <div class="site-info-list">
              <div class="info-item">
                <span class="info-label">站点名称</span>
                <span class="info-value">{{ config.site.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">站点简介</span>
                <span class="info-value">{{ config.site.description }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">创建时间</span>
                <span class="info-value">{{ config.site.createdAt }}</span>
              </div>
            </div>
          </section>

          <!-- 绑定域名 -->
          <section
            v-if="config.domain.primary"
            class="site-card domain-card animate-fade-in-up animate-delay-3"
          >
            <h2 class="card-title">
              <span class="card-icon">🔗</span>
              <span>绑定域名</span>
            </h2>

            <div class="domain-primary">
              <span class="domain-name">{{ config.domain.primary }}</span>
              <span class="domain-badge">主域名</span>
            </div>

            <div v-if="config.domain.aliases.length > 0" class="domain-list">
              <div
                v-for="(alias, index) in config.domain.aliases"
                :key="`alias-${index}`"
                class="domain-item"
              >
                <span class="domain-item-name">{{ alias }}</span>
                <span class="domain-status" :class="`status-${config.domain.status}`">
                  {{ domainStatusText }}
                </span>
              </div>
            </div>
          </section>

          <!-- 拥有者 & 备案信息 -->
          <section class="site-card owner-card animate-fade-in-up animate-delay-4">
            <h2 class="card-title">
              <span class="card-icon">👤</span>
              <span>拥有者 & 备案信息</span>
            </h2>

            <div class="owner-section">
              <p class="section-label">拥有者</p>
              <div class="owner-info-list">
                <div class="info-row">
                  <span class="info-row-label">拥有者姓名</span>
                  <span class="info-row-value">{{ config.owner.name }}</span>
                </div>
                <div class="info-row">
                  <span class="info-row-label">联系方式</span>
                  <span class="info-row-value">{{ config.owner.contact }}</span>
                </div>
              </div>
            </div>

            <div v-if="config.icp.number" class="owner-section">
              <p class="section-label">备案信息</p>
              <div class="owner-info-list">
                <div class="info-row">
                  <span class="info-row-label">备案号</span>
                  <a
                    v-if="config.icp.href"
                    class="info-row-value"
                    :href="config.icp.href"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ config.icp.number }}
                  </a>
                  <span v-else class="info-row-value">{{ config.icp.number }}</span>
                </div>
                <div class="info-row">
                  <span class="info-row-label">备案主体</span>
                  <span class="info-row-value">{{ config.icp.entity }}</span>
                </div>
                <div v-if="config.gongan.text" class="info-row">
                  <span class="info-row-label">公安备案</span>
                  <a
                    v-if="config.gongan.href"
                    class="info-row-value"
                    :href="config.gongan.href"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ config.gongan.text }}
                  </a>
                  <span v-else class="info-row-value">{{ config.gongan.text }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- 文档总数 -->
          <section class="site-card documents-card animate-fade-in-up animate-delay-5">
            <h2 class="card-title">
              <span class="card-icon">📝</span>
              <span>文档统计</span>
            </h2>

            <div class="documents-stats">
              <div class="documents-stat">
                <span class="documents-stat-value">{{ formatNumber(config.documents.total) }}</span>
                <span class="documents-stat-label">文档总数</span>
              </div>
              <div class="documents-stat">
                <span class="documents-stat-value">{{ formatNumber(config.documents.today) }}</span>
                <span class="documents-stat-label">今日新增</span>
              </div>
              <div class="documents-stat">
                <span class="documents-stat-value">{{ formatNumber(config.documents.week) }}</span>
                <span class="documents-stat-label">本周新增</span>
              </div>
            </div>

            <div class="documents-trend">
              <p class="trend-label">近 7 天文档增长趋势</p>
              <div class="trend-chart">
                <div
                  v-for="(value, index) in config.documents.trend"
                  :key="`trend-${index}`"
                  class="trend-bar"
                  :style="{ height: `${getTrendHeight(value)}%` }"
                >
                  <span class="trend-tooltip">{{ value }} 篇</span>
                </div>
              </div>
            </div>
          </section>

          <!-- 文档分类云 -->
          <section class="site-card cloud-card animate-fade-in-up animate-delay-6">
            <h2 class="card-title">
              <span class="card-icon">🏷️</span>
              <span>文档分类云</span>
            </h2>

            <div class="cloud-container">
              <span
                v-for="item in config.categories"
                :key="`category-${item.name}`"
                class="cloud-item"
                :style="{
                  fontSize: getCloudFontSize(item.count, config.categories, 14, 36),
                  color: getCloudColor(item.name),
                }"
              >
                {{ item.name }}
                <span class="count-badge">({{ item.count }})</span>
              </span>
            </div>
          </section>

          <!-- 文档标签云 -->
          <section class="site-card cloud-card animate-fade-in-up animate-delay-6">
            <h2 class="card-title">
              <span class="card-icon">🔖</span>
              <span>文档标签云</span>
            </h2>

            <div class="cloud-container">
              <span
                v-for="item in config.tags"
                :key="`tag-${item.name}`"
                class="cloud-item"
                :style="{
                  fontSize: getCloudFontSize(item.count, config.tags, 12, 32),
                  color: getCloudColor(item.name),
                }"
              >
                {{ item.name }}
                <span class="count-badge">({{ item.count }})</span>
              </span>
            </div>
          </section>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
/* 🏠 站点概览页面组件脚本 */

import { computed } from 'vue';
import { siteOverviewConfig } from '../config/site.config';
import type { CloudItem, SiteOverviewConfig } from '../config/site.config';

/* 📋 外部动态数据 */
const props = defineProps<{
  data?: Partial<SiteOverviewConfig>;
}>();

/* 📋 合并默认配置与动态数据 */
const config = computed<SiteOverviewConfig>(() => {
  const data = props.data || {};
  return {
    ...siteOverviewConfig,
    ...data,
    site: { ...siteOverviewConfig.site, ...data.site },
    domain: { ...siteOverviewConfig.domain, ...data.domain },
    owner: { ...siteOverviewConfig.owner, ...data.owner },
    icp: { ...siteOverviewConfig.icp, ...data.icp },
    gongan: { ...siteOverviewConfig.gongan, ...data.gongan },
    documents: { ...siteOverviewConfig.documents, ...data.documents },
    theme: { ...siteOverviewConfig.theme, ...data.theme },
    visitors: { ...siteOverviewConfig.visitors, ...data.visitors },
    categories: data.categories || siteOverviewConfig.categories,
    tags: data.tags || siteOverviewConfig.tags,
  };
});

/* 🏷️ 状态文本映射 */
const siteStatusText = computed(() => {
  const map: Record<string, string> = {
    normal: '正常运行',
    maintenance: '维护中',
    closed: '已关闭',
  };
  return map[config.value.site.status] || config.value.site.status;
});

const domainStatusText = computed(() => {
  const map: Record<string, string> = {
    resolved: '已解析',
    pending: '待验证',
    expired: '已过期',
  };
  return map[config.value.domain.status] || config.value.domain.status;
});

/* 🔢 数字格式化 */
function formatNumber(value: number): string {
  return value.toLocaleString('zh-CN');
}

/* 📊 趋势图高度计算 */
function getTrendHeight(value: number): number {
  const max = Math.max(...config.value.documents.trend, 1);
  return Math.max((value / max) * 100, 8);
}

/* ☁️ 云字体大小计算 */
function getCloudFontSize(
  count: number,
  data: CloudItem[],
  minSize: number,
  maxSize: number,
): string {
  const counts = data.map((item) => item.count);
  const max = Math.max(...counts);
  const min = Math.min(...counts);
  if (max === min) return `${minSize}px`;
  const size = minSize + ((count - min) / (max - min)) * (maxSize - minSize);
  return `${Math.round(size)}px`;
}

/* 🎨 云颜色计算 */
const cloudColors = [
  '#409EFF',
  '#67C23A',
  '#E6A23C',
  '#F56C6C',
  '#909399',
  '#9B59B6',
  '#1ABC9C',
  '#E67E22',
];

function getCloudColor(name: string): string {
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return cloudColors[index % cloudColors.length];
}
</script>

<style scoped lang="scss">
@use '../styles/site-page.scss' as *;
</style>
