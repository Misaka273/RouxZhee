<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  😎余温 原创开发 🔗https://wiki.xxdevops.cn
  📝 标签/分类文档列表落地页组件
-->

<template>
  <div class="post-list-page-wrapper">
    <!-- 🎯 页面标题 -->
    <header class="post-list-page-header">
      <div class="post-list-page-title-wrap">
        <span class="post-list-page-icon">{{ icon }}</span>
        <h1 class="post-list-page-title">
          <span class="post-list-page-label">{{ title }}</span>
          <span class="post-list-page-name">{{ itemName }}</span>
        </h1>
      </div>
      <p class="post-list-page-subtitle">
        共 <strong>{{ posts.length }}</strong> 篇文档
        <template v-if="posts.length === 0">，暂无相关内容</template>
      </p>
      <a v-if="backLink" :href="backLink" class="post-list-page-back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span>{{ backText }}</span>
      </a>
    </header>

    <!-- 📝 文档卡片网格 -->
    <main class="post-list-page-body">
      <div v-if="posts.length > 0" class="post-list-grid">
        <PostCard
          v-for="post in posts"
          :key="post.slug"
          :post="post"
        />
      </div>
      <div v-else class="post-list-empty">
        <span class="post-list-empty-icon">📭</span>
        <p>该{{ itemLabel }}下暂时没有文档</p>
        <a v-if="backLink" :href="backLink" class="post-list-empty-link">返回{{ backText }}</a>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
/* 🔗 标签/分类文档列表落地页组件脚本 */

import PostCard from './PostCard.vue';
import type { Post } from '../types/post';

/* 📋 组件属性 */
interface Props {
  title: string;
  icon?: string;
  itemLabel?: string;
  itemName: string;
  posts: Post[];
  backLink?: string;
  backText?: string;
}

withDefaults(defineProps<Props>(), {
  icon: '📝',
  itemLabel: '标签',
  backLink: '',
  backText: '全部',
});
</script>

<style lang="scss">
@use '../styles/post-list-page.scss' as *;
</style>
