<!--
  🕊️白木 原创开发 🔗gl.baimu.live
  😎余温 原创开发 🔗https://wiki.xxdevops.cn
  🧭 导航栏组件 - 双模式切换起飞🚀
  📂 支持多级嵌套菜单
-->

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';
import Clock from './Clock.vue';
import { navbarConfig, type NavLink } from '../config/navbar.config';
import { useFooterDrawer } from '../composables/useFooterDrawer';
import type { TocItem, CategoryDoc, CategoryItem } from '../types/doc';

// 💕 组件属性定义（文档页侧边栏数据）
interface Props {
  toc?: TocItem[];
  showToc?: boolean;
  categoryDocs?: CategoryDoc[];
  categoryName?: string;
  categoryFullPath?: string;
  categoryTree?: CategoryItem[];
  isRootDoc?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  toc: () => [],
  showToc: true,
  categoryDocs: () => [],
  categoryName: '',
  categoryFullPath: '',
  categoryTree: () => [],
  isRootDoc: false
});

// 📊 计算属性：是否在移动端底座显示文档相关按钮
const hasToc = computed(() => props.showToc && props.toc.length > 0);
const hasCategory = computed(() =>
  props.isRootDoc ? props.categoryTree.length > 0 : props.categoryDocs.length > 0
);
const categoryPanelTitle = computed(() =>
  props.isRootDoc ? '📂文档分类' : `📂${props.categoryName || '文档列表'}`
);

// 🎯 当前打开的菜单路径（用于控制多级菜单展开状态）
const activeMenuPath = ref<string[]>([]);

// 📝 切换子菜单展开状态
const toggleSubmenu = (path: string[], event?: Event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  const pathKey = path.join('>');
  const parentPath = path.slice(0, -1).join('>');
  
  // 如果点击的是已展开的菜单，则关闭它
  if (activeMenuPath.value.join('>').startsWith(pathKey)) {
    // 关闭当前及子菜单，保留父级
    if (parentPath) {
      activeMenuPath.value = parentPath.split('>').filter(Boolean);
    } else {
      activeMenuPath.value = [];
    }
  } else {
    // 展开新菜单，关闭同级其他菜单
    if (parentPath) {
      activeMenuPath.value = [...parentPath.split('>').filter(Boolean), path[path.length - 1]];
    } else {
      activeMenuPath.value = [path[0]];
    }
  }
};

// 📝 检查菜单是否展开
const isMenuActive = (path: string[]): boolean => {
  const currentPath = activeMenuPath.value.join('>');
  const checkPath = path.join('>');
  return currentPath.startsWith(checkPath);
};

// 📝 关闭所有子菜单
const closeAllSubmenus = () => {
  activeMenuPath.value = [];
};

// 📝 处理点击页面其他地方关闭子菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  // 检查点击的是否在菜单区域内
  const isInsideMenu = target.closest('.navbar-menu-item') !== null;
  if (!isInsideMenu) {
    closeAllSubmenus();
  }
};

// 📝 移动端分类树展开状态
const expandedCategories = ref<Set<string>>(new Set());

// 🔗 切换分类展开/收起
const toggleCategory = (path: string) => {
  const next = new Set(expandedCategories.value);
  if (next.has(path)) {
    next.delete(path);
  } else {
    next.add(path);
  }
  expandedCategories.value = next;
};

// 🎯 响应式状态
const isScrolled = ref(false);

type MobilePanel = 'nav' | 'toc' | 'category' | null;
const activePanel = ref<MobilePanel>(null);
const isMobileMenuOpen = computed(() => activePanel.value !== null);

// 📄 检测是否在文档内容页面
const isDocPage = computed(() => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname;
  // 排除首页和其他非文档页面
  return path !== '/' && path !== '/index.html' && path !== '';
});

// 📱 检测是否为移动端
const isMobile = ref(false);
const checkIsMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
};

// 🦶 页脚抽屉共享状态
const { isOpen: isFooterDrawerOpen, close: closeFooterDrawer, toggle: toggleFooterDrawer } = useFooterDrawer();

// 🎨 导航栏透明度控制（普通页面效果）
const isNavbarFaded = ref(false);
let navbarFadeTimer: ReturnType<typeof setTimeout> | null = null;
const NAVBAR_FADE_DELAY = 3000; // ◀️ 3秒后降低透明度

// 🎨 导航栏隐藏控制（文档页面效果 - 上移渐隐）
const isNavbarHidden = ref(false);
let navbarHideTimer: ReturnType<typeof setTimeout> | null = null;
const NAVBAR_HIDE_DELAY = 3000; // ◀️ 3秒后上移隐藏

// 🔗 启动导航栏淡出计时器（普通页面）
const startNavbarFadeTimer = () => {
  // 如果是文档页面或移动端，不使用此效果
  if (isDocPage.value || isMobile.value) return;
  // 清除已有计时器
  if (navbarFadeTimer) {
    clearTimeout(navbarFadeTimer);
  }
  // 设置新的计时器，3秒后降低透明度
  navbarFadeTimer = setTimeout(() => {
    isNavbarFaded.value = true;
  }, NAVBAR_FADE_DELAY);
};

// 🔗 启动导航栏隐藏计时器（文档页面 - 上移渐隐）
const startNavbarHideTimer = () => {
  // 如果不是文档页面或是移动端，不使用此效果
  if (!isDocPage.value || isMobile.value) return;
  // 清除已有计时器
  if (navbarHideTimer) {
    clearTimeout(navbarHideTimer);
  }
  // 设置新的计时器，3秒后上移隐藏
  navbarHideTimer = setTimeout(() => {
    isNavbarHidden.value = true;
  }, NAVBAR_HIDE_DELAY);
};

// 🔗 处理导航栏鼠标移入
const handleNavbarMouseEnter = () => {
  // 如果是文档页面且导航栏已隐藏，显示导航栏
  if (isDocPage.value && !isMobile.value && isNavbarHidden.value) {
    isNavbarHidden.value = false;
    // 清除隐藏计时器
    if (navbarHideTimer) {
      clearTimeout(navbarHideTimer);
      navbarHideTimer = null;
    }
    return;
  }
  // 普通页面：鼠标移入，恢复透明度
  if (!isDocPage.value || isMobile.value) {
    isNavbarFaded.value = false;
    // 清除淡出计时器
    if (navbarFadeTimer) {
      clearTimeout(navbarFadeTimer);
      navbarFadeTimer = null;
    }
  }
};

// 🔗 处理触发区域鼠标移入（立即显示导航栏，无延迟）
const handleTriggerMouseEnter = () => {
  if (!isDocPage.value || isMobile.value) return;
  // 立即显示导航栏
  isNavbarHidden.value = false;
  // 清除隐藏计时器
  if (navbarHideTimer) {
    clearTimeout(navbarHideTimer);
    navbarHideTimer = null;
  }
};

// 🔗 处理导航栏鼠标移出
const handleNavbarMouseLeave = () => {
  // 如果是文档页面，启动隐藏计时器
  if (isDocPage.value && !isMobile.value) {
    startNavbarHideTimer();
    return;
  }
  // 普通页面：启动淡出计时器
  startNavbarFadeTimer();
};

// 从配置中获取滚动阈值
const SCROLL_THRESHOLD = navbarConfig.scroll.threshold;

/**
 * 处理滚动事件，切换导航栏样式
 */
const handleScroll = () => {
  // 移动端底部底座无需切换滚动样式，避免桌面端 margin 样式泄漏导致偏移
  if (isMobile.value) return;

  const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
  const newIsScrolled = scrollY > SCROLL_THRESHOLD;

  // 只在状态变化时更新
  if (isScrolled.value !== newIsScrolled) {
    isScrolled.value = newIsScrolled;
  }
};

/**
 * 强制检查初始滚动状态
 */
const checkInitialScroll = () => {
  if (isMobile.value) {
    isScrolled.value = false;
    return;
  }

  const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
  isScrolled.value = scrollY > SCROLL_THRESHOLD;
};

/**
 * 打开指定移动端面板
 */
const openPanel = (panel: NonNullable<MobilePanel>) => {
  activePanel.value = panel;
  closeFooterDrawer();
};

/**
 * 切换指定移动端面板
 */
const togglePanel = (panel: NonNullable<MobilePanel>) => {
  if (activePanel.value === panel) {
    activePanel.value = null;
  } else {
    activePanel.value = panel;
    closeFooterDrawer();
  }
};

/**
 * 关闭移动端面板
 */
const closePanel = () => {
  activePanel.value = null;
  closeAllSubmenus();
};

/**
 * 切换移动端菜单（兼容旧接口）
 */
const toggleMobileMenu = () => {
  togglePanel('nav');
};

/**
 * 关闭移动端菜单（兼容旧接口）
 */
const closeMobileMenu = () => {
  closePanel();
};

/**
 * 按 ESC 关闭移动端面板
 */
const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && activePanel.value) {
    closePanel();
  }
};

// 📱 打开移动端面板时禁止页面滚动
watch(activePanel, (panel) => {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = panel ? 'hidden' : '';
});

// 🦶 页脚抽屉打开时关闭移动端面板
watch(isFooterDrawerOpen, (open) => {
  if (open) {
    closePanel();
  }
});

// 📱 切换到移动端时，强制取消导航栏隐藏状态
watch(isMobile, (mobile) => {
  if (mobile) {
    isNavbarHidden.value = false;
    if (navbarHideTimer) {
      clearTimeout(navbarHideTimer);
      navbarHideTimer = null;
    }
  }
});

/**
 * 打开移动端菜单并展开指定子菜单（兼容旧接口）
 */
const openMobileMenuWithSubmenu = (path: string[]) => {
  activePanel.value = 'nav';
  activeMenuPath.value = path;
};

// 🔗 移动端目录锚点平滑滚动
const scrollToTocAnchor = (id: string) => {
  closePanel();
  nextTick(() => {
    const element = document.getElementById(id);
    if (!element) return;

    const offset = 16;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    const targetPosition = element.getBoundingClientRect().top + scrollTop - offset;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  });
};

// 🚀 组件挂载
onMounted(() => {
  // 初始化移动端检测
  isMobile.value = checkIsMobile();

  // 监听窗口大小变化，更新移动端状态
  window.addEventListener('resize', () => {
    const wasMobile = isMobile.value;
    isMobile.value = checkIsMobile();

    if (isMobile.value) {
      // 📱 切换到移动端时，确保导航栏不会隐藏
      isScrolled.value = false;
      isNavbarHidden.value = false;
      if (navbarHideTimer) {
        clearTimeout(navbarHideTimer);
        navbarHideTimer = null;
      }
    } else if (wasMobile) {
      checkInitialScroll();
    }
  });

  // 强制检查初始滚动状态
  checkInitialScroll();

  // 监听滚动
  window.addEventListener('scroll', handleScroll, { passive: true });

  // 🖱️ 监听全局点击事件，点击菜单区域外关闭子菜单
  document.addEventListener('click', handleClickOutside);

  // ⌨️ 监听 ESC 键关闭移动端菜单
  document.addEventListener('keydown', handleEscKey);

  // 延迟再次检查，确保 DOM 完全渲染
  setTimeout(checkInitialScroll, 100);

  // 📂 初始化分类展开状态（与 DocContent 保持一致）
  if (props.categoryTree.length > 0) {
    props.categoryTree.forEach(category => {
      if (category.isExpanded) {
        expandedCategories.value.add(category.path);
      }
    });
  }

  // ⏱️ 启动导航栏效果计时器（页面加载3秒后开始）
  // 文档页面使用上移渐隐，普通页面使用透明度淡出
  if (isDocPage.value && !isMobile.value) {
    startNavbarHideTimer();
  } else {
    startNavbarFadeTimer();
  }
});

// 🧹 组件卸载
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  // 🖱️ 移除全局点击事件监听
  document.removeEventListener('click', handleClickOutside);
  // ⌨️ 移除 ESC 键监听
  document.removeEventListener('keydown', handleEscKey);
  // 清除导航栏淡出计时器
  if (navbarFadeTimer) {
    clearTimeout(navbarFadeTimer);
  }
  // 清除导航栏隐藏计时器
  if (navbarHideTimer) {
    clearTimeout(navbarHideTimer);
  }
  // 恢复页面滚动
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
});
</script>

<template>
  <!-- 🧭 导航栏容器（包含触发区域） -->
  <div
    class="navbar-wrapper"
    :class="{ 'is-hidden': isNavbarHidden }"
    @mouseenter="handleNavbarMouseEnter"
    @mouseleave="handleNavbarMouseLeave"
  >
    <!-- 📄 文档页面：顶部触发区域（导航栏隐藏时显示） -->
    <div
      v-if="isDocPage && !isMobile"
      class="navbar-trigger-area"
      :class="{ 'is-visible': isNavbarHidden }"
      @mouseenter="handleTriggerMouseEnter"
    ></div>

    <!-- 🧭 导航栏 -->
    <nav
      class="navbar"
      :class="{
        'is-scrolled': isScrolled && !isMobile,
        'is-transparent': !isScrolled && !isMobile,
        'is-faded': isNavbarFaded,
        'is-hidden': isNavbarHidden
      }"
    >
      <!-- 📱 移动端底座背景（含中间凸起） -->
      <div class="navbar-dock-bg" aria-hidden="true">
        <svg
          class="navbar-dock-bg-svg"
          viewBox="0 0 390 92"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            class="navbar-dock-bg-path"
            d="M0,42 V92 H390 V42 Q390,34 382,34 H255 C238,34 230,2 195,2 C160,2 152,34 135,34 H8 Q0,34 0,42 Z"
          />
        </svg>
      </div>
      <div class="navbar-container">
      <!-- 🏠 Logo 区域 -->
      <div class="navbar-brand-wrapper">
        <a href="/" class="navbar-brand" @click="closeMobileMenu" :aria-label="navbarConfig.logo.siteName">
          <img
            v-if="navbarConfig.logo.showLogo"
            :src="navbarConfig.logo.src"
            :alt="navbarConfig.logo.siteName"
            class="navbar-logo"
            decoding="sync"
          />
          <span v-if="navbarConfig.logo.showSiteName" class="navbar-site-name">
            {{ navbarConfig.logo.siteName }}
          </span>
        </a>
      </div>

      <!-- 📍 导航链接（支持多级菜单） -->
      <div class="navbar-menu">
        <template v-for="(link, index) in navbarConfig.links" :key="`nav-${index}`">
          <!-- 🔗 有子菜单的项 -->
          <div
            v-if="link.children && link.children.length > 0"
            class="navbar-menu-item has-submenu"
            :class="{ 'is-active': isMenuActive([link.text]) }"
          >
            <span
              class="navbar-link submenu-toggle"
              @click="toggleSubmenu([link.text], $event)"
            >
              {{ link.text }}
              <span class="submenu-arrow" :class="{ 'is-rotated': isMenuActive([link.text]) }">▶</span>
            </span>
            <!-- 📂 二级菜单 -->
            <div class="submenu level-1">
              <template v-for="(child, childIndex) in link.children" :key="`nav-${index}-${childIndex}`">
                <!-- 🔗 有三级菜单的项 -->
                <div
                  v-if="child.children && child.children.length > 0"
                  class="submenu-item has-submenu"
                  :class="{ 'is-active': isMenuActive([link.text, child.text]) }"
                >
                  <span
                    class="submenu-link submenu-toggle"
                    @click="toggleSubmenu([link.text, child.text], $event)"
                  >
                    {{ child.text }}
                    <span class="submenu-arrow" :class="{ 'is-rotated': isMenuActive([link.text, child.text]) }">▶</span>
                  </span>
                  <!-- 📂 三级菜单 -->
                  <div class="submenu level-2">
                    <a
                      v-for="(grandChild, grandChildIndex) in child.children"
                      :key="`nav-${index}-${childIndex}-${grandChildIndex}`"
                      :href="grandChild.href"
                      class="submenu-link"
                      :target="grandChild.external ? '_blank' : undefined"
                      :rel="grandChild.external ? 'noopener noreferrer' : undefined"
                    >
                      {{ grandChild.text }}
                    </a>
                  </div>
                </div>
                <!-- 🔗 普通二级链接 -->
                <a
                  v-else
                  :href="child.href"
                  class="submenu-link"
                  :target="child.external ? '_blank' : undefined"
                  :rel="child.external ? 'noopener noreferrer' : undefined"
                >
                  {{ child.text }}
                </a>
              </template>
            </div>
          </div>
          <!-- 🔗 普通一级链接 -->
          <a
            v-else
            :href="link.href"
            class="navbar-link"
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noopener noreferrer' : undefined"
          >
            {{ link.text }}
          </a>
        </template>
      </div>

      <!-- 🔗 右侧区域：社交链接 + 时钟 -->
      <div class="navbar-right">
        <!-- 社交链接区域 -->
        <div v-if="navbarConfig.social.enabled" class="navbar-social">
          <a
            v-for="(social, index) in navbarConfig.social.links"
            :key="`social-${index}`"
            :href="social.href"
            class="social-link"
            :target="social.external ? '_blank' : undefined"
            :rel="social.external ? 'noopener noreferrer' : undefined"
            :aria-label="social.name"
          >
            <!-- 🎨 使用 v-html 渲染完整 SVG 代码 -->
            <span class="social-icon" v-html="social.icon"></span>
          </a>
        </div>

        <!-- ⏰ 时钟区域 -->
        <div v-if="navbarConfig.clock.enabled" class="navbar-clock">
          <Clock />
        </div>
      </div>

      <!-- 📱 移动端底部菜单触发按钮 -->
      <div class="navbar-mobile-dock-menu">
        <div class="navbar-dock-left">
          <!-- 📑 目录按钮 -->
          <button
            v-if="hasToc"
            class="navbar-dock-menu-trigger"
            :class="{ 'is-active': activePanel === 'toc' }"
            @click="togglePanel('toc')"
            aria-label="文档目录"
          >
            <svg
              class="dock-menu-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span class="dock-menu-label">目录</span>
          </button>

          <!-- 🧭 导航按钮 -->
          <button
            class="navbar-dock-menu-trigger"
            :class="{ 'is-active': activePanel === 'nav' }"
            @click="togglePanel('nav')"
            :aria-label="navbarConfig.mobileMenu.ariaLabel"
          >
            <svg
              class="dock-menu-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
            </svg>
            <span class="dock-menu-label">导航</span>
          </button>
        </div>

        <div class="navbar-dock-right">
          <!-- 📁 分类按钮 -->
          <button
            v-if="hasCategory"
            class="navbar-dock-menu-trigger"
            :class="{ 'is-active': activePanel === 'category' }"
            @click="togglePanel('category')"
            aria-label="文档分类"
          >
            <svg
              class="dock-menu-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <span class="dock-menu-label">分类</span>
          </button>

          <!-- 🦶 页脚抽屉按钮 -->
          <button
            class="navbar-dock-menu-trigger"
            :class="{ 'is-active': isFooterDrawerOpen }"
            @click="toggleFooterDrawer"
            aria-label="关于站点"
          >
            <svg
              class="dock-menu-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <span class="dock-menu-label">关于</span>
          </button>
        </div>
      </div>

      <!-- 📱 移动端菜单按钮 -->
      <button
        class="navbar-toggle"
        :class="{ 'is-active': isMobileMenuOpen }"
        @click="toggleMobileMenu"
        :aria-label="navbarConfig.mobileMenu.ariaLabel"
      >
        <span class="toggle-line"></span>
        <span class="toggle-line"></span>
        <span class="toggle-line"></span>
      </button>
    </div>
  </nav>
</div>

<!-- 📱 移动端菜单遮罩与弹窗 -->
<div
  class="navbar-mobile-menu-overlay"
  :class="{ 'is-open': isMobileMenuOpen }"
  @click="closeMobileMenu"
></div>
<div
  class="navbar-mobile-menu"
  :class="{ 'is-open': isMobileMenuOpen }"
>
  <div class="mobile-menu-header">
    <span class="mobile-menu-title">
      {{ activePanel === 'toc' ? '📄当前文档目录' : activePanel === 'category' ? categoryPanelTitle : '导航' }}
    </span>
    <button
      class="mobile-menu-close"
      @click="closeMobileMenu"
      aria-label="关闭菜单"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  </div>
  <div class="mobile-menu-body">
    <!-- 🧭 导航面板 -->
    <template v-if="activePanel === 'nav'">
      <div class="mobile-menu-cards">
        <template v-for="(link, index) in navbarConfig.links" :key="`mobile-${index}`">
          <!-- 🔗 有子菜单的项 -->
          <div
            v-if="link.children && link.children.length > 0"
            class="mobile-menu-card has-submenu"
            :class="{ 'is-active': isMenuActive([link.text]) }"
          >
            <span
              class="mobile-menu-card-header submenu-toggle"
              @click="toggleSubmenu([link.text], $event)"
            >
              {{ link.text }}
              <svg
                class="submenu-arrow"
                :class="{ 'is-rotated': isMenuActive([link.text]) }"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
            <!-- 📂 二级菜单 -->
            <div v-show="isMenuActive([link.text])" class="mobile-menu-card-body">
              <template v-for="(child, childIndex) in link.children" :key="`mobile-${index}-${childIndex}`">
                <!-- 🔗 有三级菜单的项 -->
                <div
                  v-if="child.children && child.children.length > 0"
                  class="mobile-menu-group has-submenu"
                  :class="{ 'is-active': isMenuActive([link.text, child.text]) }"
                >
                  <span
                    class="mobile-menu-group-title submenu-toggle"
                    @click="toggleSubmenu([link.text, child.text], $event)"
                  >
                    {{ child.text }}
                    <svg
                      class="submenu-arrow"
                      :class="{ 'is-rotated': isMenuActive([link.text, child.text]) }"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </span>
                  <!-- 📂 三级菜单 -->
                  <div v-show="isMenuActive([link.text, child.text])" class="mobile-menu-list level-2">
                    <a
                      v-for="(grandChild, grandChildIndex) in child.children"
                      :key="`mobile-${index}-${childIndex}-${grandChildIndex}`"
                      :href="grandChild.href"
                      class="mobile-menu-link"
                      :target="grandChild.external ? '_blank' : undefined"
                      :rel="grandChild.external ? 'noopener noreferrer' : undefined"
                      @click="closeMobileMenu"
                    >
                      {{ grandChild.text }}
                    </a>
                  </div>
                </div>
                <!-- 🔗 普通二级链接 -->
                <a
                  v-else
                  :href="child.href"
                  class="mobile-menu-link"
                  :target="child.external ? '_blank' : undefined"
                  :rel="child.external ? 'noopener noreferrer' : undefined"
                  @click="closeMobileMenu"
                >
                  {{ child.text }}
                </a>
              </template>
            </div>
          </div>
          <!-- 🔗 普通一级链接 -->
          <a
            v-else
            :href="link.href"
            class="mobile-menu-card mobile-menu-card-link"
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noopener noreferrer' : undefined"
            @click="closeMobileMenu"
          >
            <span class="mobile-menu-card-header">
              {{ link.text }}
            </span>
          </a>
        </template>
      </div>
    </template>

    <!-- 📑 目录面板 -->
    <template v-else-if="activePanel === 'toc'">
      <nav class="mobile-menu-list mobile-menu-toc">
        <a
          v-for="item in toc"
          :key="item.id"
          :href="`#${item.id}`"
          class="mobile-menu-link"
          :class="`toc-level-${item.level}`"
          @click.prevent="scrollToTocAnchor(item.id)"
        >
          {{ item.text }}
        </a>
      </nav>
    </template>

    <!-- 📁 分类面板 -->
    <template v-else-if="activePanel === 'category'">
      <div class="mobile-menu-list mobile-menu-category">
        <!-- 📂 根目录模式：显示分类树 -->
        <template v-if="isRootDoc && categoryTree.length > 0">
          <div
            v-for="category in categoryTree"
            :key="category.path"
            class="mobile-menu-category-group"
          >
            <button
              class="mobile-menu-category-header"
              @click="toggleCategory(category.path)"
            >
              <span class="category-toggle">{{ expandedCategories.has(category.path) ? '📂' : '📁' }}</span>
              <span class="category-name">{{ category.name }}</span>
            </button>
            <div v-show="expandedCategories.has(category.path)" class="mobile-menu-category-links">
              <a
                v-for="doc in category.docs"
                :key="doc.slug"
                :href="`/${doc.slug}`"
                class="mobile-menu-link"
                :class="{ 'is-current': doc.isCurrent }"
              >
                {{ doc.title }}
              </a>
            </div>
          </div>
        </template>

        <!-- 📂 子目录模式：显示当前分类下的文档 -->
        <template v-else>
          <a
            v-for="doc in categoryDocs"
            :key="doc.slug"
            :href="`/${doc.slug}`"
            class="mobile-menu-link"
            :class="{ 'is-current': doc.isCurrent }"
          >
            {{ doc.title }}
          </a>
        </template>
      </div>
    </template>
  </div>
</div>
</template>

<style lang="scss">
@use '../styles/navbar.scss' as *;
</style>
