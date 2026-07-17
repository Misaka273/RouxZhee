// 🕊️白木 原创开发 🔗gl.baimu.live
// 💬 状态提示胶囊共享状态 - 供导航栏及其他组件跨组件复用

import { ref } from 'vue';

const hintText = ref('');
const visible = ref(false);

export function useHintPill() {
  function show(text: string) {
    if (!text) return;
    hintText.value = text;
    visible.value = true;
  }

  function hide() {
    visible.value = false;
  }

  return {
    hintText,
    visible,
    show,
    hide,
  };
}
