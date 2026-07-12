<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  🎲 侧边栏随机文档卡片组件
-->

<template>
  <section class="random-posts-card">
    <!-- 头部：标题 + 数量徽章 -->
    <header class="random-posts-header">
      <h3 class="random-posts-title">
        <span class="random-posts-icon">{{ bloggerConfig.cloud.random.icon }}</span>
        <span>{{ bloggerConfig.cloud.random.title }}</span>
      </h3>
      <span class="random-posts-badge">
        <span class="random-posts-count">{{ displayPosts.length }}</span>
        <span>篇</span>
      </span>
    </header>

    <!-- 分隔线 -->
    <div class="random-posts-divider" />

    <!-- 随机文档列表 -->
    <div class="random-posts-body">
      <Transition
        name="random-posts-group"
        mode="out-in"
        :duration="600"
      >
        <ul
          v-if="displayPosts.length > 0"
          :key="groupKey"
          class="random-posts-list"
        >
          <li
            v-for="(post, index) in displayPosts"
            :key="post.slug"
            class="random-post-item"
            :style="{ '--index': index }"
          >
            <a :href="post.url" class="random-post-link" :aria-label="`查看文章：${post.title}`">
              <h4 class="random-post-item-title">{{ post.title }}</h4>
              <time class="random-post-item-date" :datetime="post.date">
                <svg class="random-post-item-date-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {{ formatDate(post.date) }}
              </time>
            </a>
          </li>
        </ul>
        <p v-else class="random-posts-empty">暂无可推荐文档</p>
      </Transition>
    </div>
  </section>
</template>

<script setup lang="ts">
/* 🎲 侧边栏随机文档卡片组件脚本 */

import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import type { Post } from '../types/post';
import { bloggerConfig } from '../config/blogger.config';

/* 📋 组件属性 */
const props = defineProps<{
  posts: Post[];
}>();

/* 🎲 当前随机文档 */
const randomPosts = ref<Post[]>([]);

/* 🔑 当前组标识，用于触发整组切换动画 */
const groupKey = ref(0);

/* 📐 展示数量与刷新间隔 */
const count = computed(() => bloggerConfig.cloud.random.count);
const interval = computed(() => bloggerConfig.cloud.random.interval);

/* 🎲 洗牌算法（Fisher-Yates） */
const shuffle = <T,>(arr: T[]): T[] => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/* 🔄 刷新随机文档 */
const refreshRandomPosts = () => {
  const source = props.posts;
  if (source.length === 0) {
    randomPosts.value = [];
    return;
  }
  randomPosts.value = shuffle(source).slice(0, count.value);
  groupKey.value++;
};

/* 📅 日期格式化函数 */
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/* 📊 最终展示数据 */
const displayPosts = computed<Post[]>(() => randomPosts.value);

/* ⏱️ 定时器引用 */
let timer: ReturnType<typeof setInterval> | null = null;

/* 🔄 启动自动刷新 */
const startAutoRefresh = () => {
  stopAutoRefresh();
  if (interval.value <= 0 || props.posts.length === 0) return;
  timer = setInterval(refreshRandomPosts, interval.value);
};

/* ⏹️ 停止自动刷新 */
const stopAutoRefresh = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

/* 👀 监听文档源变化 */
watch(() => props.posts, (newPosts) => {
  if (newPosts.length > 0) {
    refreshRandomPosts();
    startAutoRefresh();
  } else {
    randomPosts.value = [];
    stopAutoRefresh();
  }
}, { immediate: true, deep: true });

onMounted(() => {
  refreshRandomPosts();
  startAutoRefresh();
});

onUnmounted(() => {
  stopAutoRefresh();
});
</script>

<style scoped lang="scss">
/* 🎨 随机文档卡片样式 */

.random-posts-card {
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
  .random-posts-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem 0.75rem;
    margin-bottom: 0.875rem;
  }

  .random-posts-title {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--text-color);
    font-family: var(--font-heading);

    .random-posts-icon {
      font-size: 1rem;
      line-height: 1;
    }
  }

  .random-posts-badge {
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

    .random-posts-count {
      color: var(--text-color);
      font-weight: 600;
    }
  }

  /* 分隔线 */
  .random-posts-divider {
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

  /* 列表区域 */
  .random-posts-body {
    display: flex;
    flex-direction: column;
  }

  .random-posts-list {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .random-posts-empty {
    margin: 0;
    padding: 1rem 0;
    text-align: center;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  /* 单个随机文档卡片 */
  .random-post-item {
    position: relative;
    border-radius: calc(var(--card-border-radius) * 0.75);
    background: rgba(255, 255, 255, 0.35);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
      box-shadow 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
      background 0.35s ease;
    overflow: hidden;

    &:hover {
      transform: translateY(-2px) scale(1.01);
      box-shadow: 0 8px 20px -4px rgba(0, 0, 0, 0.12);
      background: rgba(255, 255, 255, 0.5);
    }

    .random-post-link {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      padding: 0.75rem 0.875rem;
      color: inherit;
      text-decoration: none;
    }

    .random-post-item-title {
      margin: 0;
      font-size: 0.875rem;
      font-weight: 600;
      line-height: 1.45;
      color: var(--text-color);
      font-family: var(--font-heading);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      transition: color var(--transition-normal);
    }

    &:hover .random-post-item-title {
      color: var(--primary-color);
    }

    .random-post-item-date {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin-top: auto;

      .random-post-item-date-icon {
        width: 0.875rem;
        height: 0.875rem;
      }
    }
  }
}

/* 🎬 整组切换动画：上一组整体上移渐隐，内部条目逐一上移渐隐；
   下一组整体上移渐显，内部条目逐一上移渐显 */
.random-posts-group-enter-active,
.random-posts-group-leave-active {
  transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.random-posts-group-enter-from {
  opacity: 0;
  transform: translateY(1rem);
}

.random-posts-group-leave-to {
  opacity: 0;
  transform: translateY(-1rem);
}

.random-posts-group-enter-active .random-post-item {
  animation: random-post-item-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
  animation-delay: calc(var(--index) * 0.08s);
}

.random-posts-group-leave-active .random-post-item {
  animation: random-post-item-out 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: calc(var(--index) * 0.08s);
}

@keyframes random-post-item-in {
  from {
    opacity: 0;
    transform: translateY(0.75rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes random-post-item-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-0.75rem);
  }
}

/* 🌙 暗色模式适配 */
:global(.dark-mode) {
  .random-posts-card {
    background: var(--glass-bg);
    border-color: var(--glass-border);

    .random-posts-title {
      color: var(--text-color);
    }

    .random-posts-badge {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.6);

      .random-posts-count {
        color: rgba(255, 255, 255, 0.85);
      }
    }

    .random-posts-divider {
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.1) 20%,
        rgba(255, 255, 255, 0.1) 80%,
        transparent
      );
    }

    .random-posts-empty {
      color: var(--text-secondary);
    }

    .random-post-item {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 20px -4px rgba(0, 0, 0, 0.3);
      }

      .random-post-item-title {
        color: var(--text-color);
      }

      &:hover .random-post-item-title {
        color: var(--primary-color);
      }

      .random-post-item-date {
        color: var(--text-secondary);
      }
    }
  }
}
</style>
