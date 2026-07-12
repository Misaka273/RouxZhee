// 🕊️白木 原创开发 🔗gl.baimu.live
// 🦶 页脚抽屉共享状态 - 供 Footer 与 Navbar 跨组件协同

import { ref } from 'vue';

const isOpen = ref(false);

export function useFooterDrawer() {
  function open() {
    isOpen.value = true;
  }

  function close() {
    isOpen.value = false;
  }

  function toggle() {
    isOpen.value = !isOpen.value;
  }

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
