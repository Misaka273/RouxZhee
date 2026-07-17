<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  🦶 页脚组件 - 抽屉式，点击按钮从底部展开全页面板
-->

<template>
  <footer class="rouxzhee-footer" data-pagefind-ignore>
    <!-- 🔘 抽屉触发按钮 -->
    <button
      ref="triggerRef"
      class="footer-drawer-trigger"
      type="button"
      aria-haspopup="dialog"
      :aria-expanded="isOpen"
      aria-controls="footer-drawer"
      aria-label="展开页脚信息"
      @click="open"
    >
      <span class="trigger-icon" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m18 15-6-6-6 6"/>
        </svg>
      </span>
      <span class="trigger-text">关于站点</span>
    </button>

    <!-- 📦 半屏抽屉 -->
    <Transition name="footer-drawer">
      <div
        v-if="isOpen"
        id="footer-drawer"
        class="footer-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="footer-drawer-title"
      >
        <!-- 🌫️ 遮罩层 -->
        <div
          class="footer-drawer-backdrop"
          role="presentation"
          @click="close"
        />

        <!-- 📄 抽屉内容 -->
        <div class="footer-drawer-panel">
          <!-- ✖️ 关闭按钮 -->
          <button
            class="footer-drawer-close"
            type="button"
            aria-label="关闭页脚信息"
            @click="close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>

          <!-- 🧾 内容区 -->
          <div class="footer-drawer-content">
            <div class="footer-drawer-content-inner">
              <h2 id="footer-drawer-title" class="footer-drawer-title">关于站点</h2>

              <!-- 🏠 站点信息 -->
              <div class="footer-site-info">
                <img
                  v-if="navbarConfig.logo.showLogo"
                  :src="navbarConfig.logo.src"
                  :alt="navbarConfig.logo.siteName"
                  class="footer-site-logo"
                />
                <div class="footer-site-meta">
                  <h3 class="footer-site-name">{{ navbarConfig.logo.siteName }}</h3>
                  <p class="footer-site-desc">{{ seoConfig.defaultDescription }}</p>
                </div>
              </div>

              <!-- ⏱️ 站点运行时间 -->
              <div v-if="runtimeConfig.enabled" class="footer-drawer-section">
                <h3 class="footer-drawer-section-title">运行时间</h3>
                <Runtime />
              </div>

              <!-- 🏅 备案勋章卡片 -->
              <div v-if="hasBeian" class="footer-beian-badges">
                <a
                  v-if="bloggerConfig.beian.icp?.text"
                  :href="bloggerConfig.beian.icp.href"
                  class="footer-beian-badge"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ICP备案信息"
                >
                  <span class="beian-badge-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </span>
                  <span class="beian-badge-text">{{ bloggerConfig.beian.icp.text }}</span>
                </a>

                <a
                  v-if="bloggerConfig.beian.gongan?.text"
                  :href="bloggerConfig.beian.gongan.href"
                  class="footer-beian-badge"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="公安备案信息"
                >
                  <span class="beian-badge-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="M12 8v4" />
                      <path d="M12 16h.01" />
                    </svg>
                  </span>
                  <span class="beian-badge-text">{{ bloggerConfig.beian.gongan.text }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import Runtime from './Runtime.vue';
import { runtimeConfig } from '../config/runtime.config';
import { navbarConfig } from '../config/navbar.config';
import { seoConfig } from '../config/seo.config';
import { bloggerConfig } from '../config/blogger.config';
import { useFooterDrawer } from '../composables/useFooterDrawer';

const { isOpen, open, close, toggle } = useFooterDrawer();
const triggerRef = ref<HTMLButtonElement | null>(null);

const hasBeian = computed(() =>
  !!(bloggerConfig.beian?.icp?.text || bloggerConfig.beian?.gongan?.text)
);

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) {
    close();
  }
}

watch(isOpen, (open) => {
  if (typeof document === 'undefined') return;

  if (open) {
    document.body.classList.add('footer-drawer-open');
    document.addEventListener('keydown', handleKeyDown);
  } else {
    document.body.classList.remove('footer-drawer-open');
    document.removeEventListener('keydown', handleKeyDown);
    nextTick(() => {
      triggerRef.value?.focus();
    });
  }
});

onMounted(() => {
  if (isOpen.value && typeof document !== 'undefined') {
    document.body.classList.add('footer-drawer-open');
    document.addEventListener('keydown', handleKeyDown);
  }
});

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.classList.remove('footer-drawer-open');
    document.removeEventListener('keydown', handleKeyDown);
  }
});

// 保持与旧用法兼容：外部仍可通过模板 ref 调用
defineExpose({ open, close, toggle });
</script>

<style scoped lang="scss">
/* ========================================
   🦶 页脚组件样式 - 抽屉式
   ======================================== */

.rouxzhee-footer {
  position: relative;
  z-index: var(--footer-drawer-z-index);
  width: 100%;
  pointer-events: none;
}

/* 🔘 触发按钮 */
.footer-drawer-trigger {
  position: fixed;
  left: 1.5rem;
  bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  pointer-events: auto;
  cursor: pointer;
  color: var(--text-white);
  background: var(--gradient-primary);
  border: none;
  border-radius: 9999px;
  box-shadow: 0 4px 16px rgba(14, 116, 144, 0.35), 0 2px 8px rgba(6, 182, 212, 0.2);
  font-family: 'xnyt', var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(14, 116, 144, 0.45), 0 4px 12px rgba(6, 182, 212, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
}

.trigger-icon {
  display: inline-flex;
  transition: transform var(--transition-normal);
}

.footer-drawer-trigger:hover .trigger-icon {
  transform: translateY(-2px);
}

.trigger-text {
  line-height: 1;
}

/* 📦 全屏抽屉 */
.footer-drawer {
  position: fixed;
  inset: 0;
  z-index: var(--footer-drawer-overlay-z-index);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  pointer-events: none;
}

/* 🌫️ 遮罩层 */
.footer-drawer-backdrop {
  position: absolute;
  inset: 0;
  pointer-events: auto;
  background: var(--search-overlay-bg);
  backdrop-filter: blur(var(--footer-drawer-backdrop-blur));
  -webkit-backdrop-filter: blur(var(--footer-drawer-backdrop-blur));
}

/* 📄 抽屉面板 */
.footer-drawer-panel {
  position: relative;
  z-index: var(--footer-drawer-content-z-index);
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 50vh;
  pointer-events: auto;
  background: var(--bg-color);
  border-radius: 24px 24px 0 0;
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

/* ✖️ 关闭按钮 */
.footer-drawer-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  cursor: pointer;
  color: var(--text-secondary);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  transition: color var(--transition-fast), background var(--transition-fast), transform var(--transition-fast);

  &:hover {
    color: var(--text-color);
    background: var(--card-bg);
    transform: rotate(90deg);
  }

  &:focus-visible {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
}

/* 🧾 内容区 */
.footer-drawer-content {
  flex: 1;
  padding: 3rem 1.5rem 2rem;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.footer-drawer-content-inner {
  width: 100%;
  max-width: var(--max-content-width);
  margin: 0 auto;
}

.footer-drawer-title {
  margin: 0 0 1.5rem;
  font-family: 'xnyt', var(--font-body);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
}

.footer-drawer-section {
  padding: 1.25rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--card-border-radius);
}

.footer-drawer-section-title {
  margin: 0 0 0.75rem;
  font-family: 'xnyt', var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-secondary);
}

/* 🏠 站点信息 */
.footer-site-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.footer-site-logo {
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  object-fit: contain;
}

.footer-site-meta {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
}

.footer-site-name {
  margin: 0;
  font-family: 'xnyt', var(--font-body);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

.footer-site-desc {
  margin: 0;
  font-family: 'xnyt', var(--font-body);
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

/* 🏅 备案勋章卡片 */
.footer-beian-badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.footer-beian-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  color: var(--text-white);
  font-family: 'xnyt', var(--font-body);
  text-decoration: none;
  background: var(--gradient-primary);
  border-radius: 9999px;
  box-shadow: 0 4px 14px rgba(14, 116, 144, 0.35), 0 2px 6px rgba(6, 182, 212, 0.2);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 22px rgba(14, 116, 144, 0.45), 0 4px 10px rgba(6, 182, 212, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
}

.beian-badge-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;

  svg {
    width: 100%;
    height: 100%;
  }
}

.beian-badge-text {
  font-size: 0.8125rem;
  font-weight: 500;
  white-space: nowrap;
}

/* ========================================
   🔄 过渡动画
   ======================================== */

.footer-drawer-enter-active,
.footer-drawer-leave-active {
  transition: opacity var(--transition-normal);
}

.footer-drawer-enter-from,
.footer-drawer-leave-to {
  opacity: 0;
}

.footer-drawer-enter-active .footer-drawer-panel,
.footer-drawer-leave-active .footer-drawer-panel {
  transition: transform var(--transition-normal);
}

.footer-drawer-enter-from .footer-drawer-panel,
.footer-drawer-leave-to .footer-drawer-panel {
  transform: translateY(100%);
}

/* ========================================
   📱 移动端适配
   ======================================== */
@media (max-width: 768px) {
  .footer-drawer-trigger {
    display: none;
  }

  .footer-drawer-panel {
    border-radius: 20px 20px 0 0;
  }

  .footer-drawer-content {
    padding: 2.5rem 1rem 1.5rem;
  }

  .footer-drawer-title {
    font-size: 1.25rem;
  }

  .footer-site-info {
    gap: 0.875rem;
  }

  .footer-site-logo {
    width: 48px;
    height: 48px;
  }

  .footer-site-name {
    font-size: 1.125rem;
  }

  .footer-site-desc {
    font-size: 0.8125rem;
  }

  .footer-beian-badges {
    flex-direction: column;
    gap: 0.75rem;
  }

  .footer-beian-badge {
    width: 100%;
    justify-content: center;
  }
}
</style>

<style lang="scss">
/* 锁定页面滚动 */
body.footer-drawer-open {
  overflow: hidden;
}
</style>
