// 🕊️白木 原创开发 🔗gl.baimu.live
// 图片查看器脚本

import { imageViewerConfig } from '../../config/imageViewer.config';

// ========================================
// 📋 类型定义
// ========================================
interface TransformState {
  scale: number;
  rotate: number;
  translateX: number;
  translateY: number;
}

// ========================================
// 🎨 SVG 图标
// ========================================
const ICONS = {
  close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  prev: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
  next: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
  zoomIn: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`,
  zoomOut: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>`,
  rotate: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`,
  fullscreenEnter: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>`,
  fullscreenExit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>`,
  originalSize: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path></svg>`,
};

// ========================================
// 🌐 全局状态
// ========================================
let wrapper: HTMLDivElement | null = null;
let canvas: HTMLDivElement | null = null;
let imageElement: HTMLImageElement | null = null;
let closeBtn: HTMLButtonElement | null = null;
let actionsContainer: HTMLDivElement | null = null;
let infoElement: HTMLDivElement | null = null;
let currentOriginalImage: HTMLImageElement | null = null;
let currentDocImages: HTMLImageElement[] = [];
let currentIndex = -1;
let transform: TransformState = { scale: 1, rotate: 0, translateX: 0, translateY: 0 };
let isFullscreen = false;
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let transformBeforeDrag = { translateX: 0, translateY: 0 };
let cleanupFns: Array<() => void> = [];

const WRAPPER_CLASS = 'rouxzhee-image-viewer__wrapper';
const CANVAS_CLASS = 'rouxzhee-image-viewer__canvas';
const CLOSE_CLASS = 'rouxzhee-image-viewer__close';
const ACTIONS_CLASS = 'rouxzhee-image-viewer__actions';
const ACTION_CLASS = 'rouxzhee-image-viewer__action';
const INFO_CLASS = 'rouxzhee-image-viewer__info';
const FADE_OUT_CLASS = `${WRAPPER_CLASS}--fade-out`;
const FULLSCREEN_CLASS = `${CANVAS_CLASS}--fullscreen`;

// ========================================
// 🔧 工具函数
// ========================================
function isExcludedImage(img: HTMLImageElement): boolean {
  if (!img.src || img.closest(`.${WRAPPER_CLASS}`)) {
    return true;
  }

  return imageViewerConfig.excludeSelectors.some((selector) => {
    return img.matches(selector) || img.closest(selector) !== null;
  });
}

function getDocContentElement(): HTMLElement | null {
  return document.querySelector(imageViewerConfig.docSelector);
}

function isImageInDocContent(img: HTMLImageElement): boolean {
  const docContent = getDocContentElement();
  return docContent ? docContent.contains(img) : false;
}

function formatInfo(current: number, total: number): string {
  return imageViewerConfig.text.infoTemplate
    .replace('{current}', String(current))
    .replace('{total}', String(total));
}

function applyTransform(animate = false): void {
  if (!imageElement) return;

  if (animate) {
    imageElement.style.transition = `transform ${imageViewerConfig.animationDuration}ms ease`;
  } else {
    imageElement.style.transition = 'none';
  }

  imageElement.style.transform = `translate(${transform.translateX}px, ${transform.translateY}px) scale(${transform.scale}) rotate(${transform.rotate}deg)`;
}

function clampScale(value: number): number {
  const { min, max } = imageViewerConfig.scale;
  return Math.min(max, Math.max(min, value));
}

// ========================================
// 🏗️ DOM 构建
// ========================================
function createWrapper(): HTMLDivElement {
  const el = document.createElement('div');
  el.className = WRAPPER_CLASS;
  el.style.zIndex = String(imageViewerConfig.zIndex);
  return el;
}

function createCanvas(): HTMLDivElement {
  const el = document.createElement('div');
  el.className = CANVAS_CLASS;
  return el;
}

function createCloseButton(): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = CLOSE_CLASS;
  btn.setAttribute('aria-label', imageViewerConfig.text.closeAriaLabel);
  btn.innerHTML = ICONS.close;
  return btn;
}

function createActionButton(icon: string, ariaLabel: string): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = ACTION_CLASS;
  btn.setAttribute('aria-label', ariaLabel);
  btn.innerHTML = icon;
  return btn;
}

function createActions(): HTMLDivElement {
  const container = document.createElement('div');
  container.className = ACTIONS_CLASS;
  return container;
}

function createInfo(): HTMLDivElement {
  const el = document.createElement('div');
  el.className = INFO_CLASS;
  return el;
}

// ========================================
// 🎬 打开 / 关闭
// ========================================
async function openViewer(originalImage: HTMLImageElement): Promise<void> {
  if (wrapper) {
    closeViewer(false);
  }

  currentOriginalImage = originalImage;
  currentDocImages = [];
  currentIndex = -1;

  const docContent = getDocContentElement();
  if (docContent && docContent.contains(originalImage)) {
    currentDocImages = Array.from(docContent.querySelectorAll('img')).filter(
      (img) => !isExcludedImage(img as HTMLImageElement)
    );
    currentIndex = currentDocImages.indexOf(originalImage);
  }

  transform = { scale: 1, rotate: 0, translateX: 0, translateY: 0 };
  isFullscreen = false;

  wrapper = createWrapper();
  canvas = createCanvas();
  imageElement = document.createElement('img');
  imageElement.src = originalImage.src;
  imageElement.alt = originalImage.alt || '';
  imageElement.draggable = false;

  closeBtn = createCloseButton();
  actionsContainer = createActions();
  infoElement = createInfo();

  canvas.appendChild(imageElement);
  wrapper.appendChild(canvas);
  wrapper.appendChild(closeBtn);
  wrapper.appendChild(actionsContainer);
  wrapper.appendChild(infoElement);
  document.body.appendChild(wrapper);

  rebuildActions();
  updateInfo();

  await new Promise<void>((resolve) => {
    if (imageElement!.complete && imageElement!.naturalWidth > 0) {
      resolve();
    } else {
      imageElement!.onload = () => resolve();
      imageElement!.onerror = () => resolve();
    }
  });

  if (!wrapper || !imageElement || !canvas) return;

  const originalRect = originalImage.getBoundingClientRect();
  const finalRect = imageElement.getBoundingClientRect();

  if (originalRect.width > 0 && originalRect.height > 0 && finalRect.width > 0 && finalRect.height > 0) {
    const scaleX = originalRect.width / finalRect.width;
    const scaleY = originalRect.height / finalRect.height;
    const translateX =
      originalRect.left + originalRect.width / 2 - (finalRect.left + finalRect.width / 2);
    const translateY =
      originalRect.top + originalRect.height / 2 - (finalRect.top + finalRect.height / 2);

    imageElement.style.transition = 'none';
    imageElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY}) rotate(0deg)`;

    requestAnimationFrame(() => {
      if (!imageElement) return;
      imageElement.style.transition = `transform ${imageViewerConfig.animationDuration}ms ease`;
      imageElement.style.transform = 'translate(0, 0) scale(1, 1) rotate(0deg)';
    });
  }

  attachViewerEvents();
}

function closeViewer(animated = true): void {
  if (!wrapper || !imageElement || !canvas) {
    disposeViewer();
    return;
  }

  detachViewerEvents();

  if (animated) {
    if (currentOriginalImage && document.body.contains(currentOriginalImage)) {
      const originalRect = currentOriginalImage.getBoundingClientRect();
      const currentRect = imageElement.getBoundingClientRect();

      if (originalRect.width > 0 && originalRect.height > 0 && currentRect.width > 0 && currentRect.height > 0) {
        const scaleX = originalRect.width / currentRect.width;
        const scaleY = originalRect.height / currentRect.height;
        const translateX =
          originalRect.left + originalRect.width / 2 - (currentRect.left + currentRect.width / 2);
        const translateY =
          originalRect.top + originalRect.height / 2 - (currentRect.top + currentRect.height / 2);

        imageElement.style.transition = `transform ${imageViewerConfig.animationDuration}ms ease`;
        imageElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY}) rotate(${transform.rotate}deg)`;
      }
    }

    wrapper.classList.add(FADE_OUT_CLASS);

    setTimeout(() => {
      disposeViewer();
    }, imageViewerConfig.animationDuration);
  } else {
    disposeViewer();
  }
}

function disposeViewer(): void {
  if (wrapper && wrapper.parentNode) {
    wrapper.parentNode.removeChild(wrapper);
  }

  wrapper = null;
  canvas = null;
  imageElement = null;
  closeBtn = null;
  actionsContainer = null;
  infoElement = null;
  currentOriginalImage = null;
  currentDocImages = [];
  currentIndex = -1;
  transform = { scale: 1, rotate: 0, translateX: 0, translateY: 0 };
  isFullscreen = false;
  cleanupFns = [];
}

// ========================================
// 🎛️ 操作区重建
// ========================================
function rebuildActions(): void {
  if (!actionsContainer) return;
  actionsContainer.innerHTML = '';

  const inDoc = currentIndex >= 0 && currentDocImages.length > 0;

  const prevBtn = createActionButton(ICONS.prev, imageViewerConfig.text.prevAriaLabel);
  prevBtn.disabled = !inDoc || currentIndex <= 0;
  prevBtn.addEventListener('click', () => switchImage(-1));

  const nextBtn = createActionButton(ICONS.next, imageViewerConfig.text.nextAriaLabel);
  nextBtn.disabled = !inDoc || currentIndex >= currentDocImages.length - 1;
  nextBtn.addEventListener('click', () => switchImage(1));

  const zoomInBtn = createActionButton(ICONS.zoomIn, imageViewerConfig.text.zoomInAriaLabel);
  zoomInBtn.addEventListener('click', () => zoom(imageViewerConfig.scale.step));

  const zoomOutBtn = createActionButton(ICONS.zoomOut, imageViewerConfig.text.zoomOutAriaLabel);
  zoomOutBtn.addEventListener('click', () => zoom(-imageViewerConfig.scale.step));

  const fullscreenBtn = createActionButton(
    isFullscreen ? ICONS.fullscreenExit : ICONS.fullscreenEnter,
    isFullscreen ? imageViewerConfig.text.fullscreenExitAriaLabel : imageViewerConfig.text.fullscreenEnterAriaLabel
  );
  fullscreenBtn.addEventListener('click', toggleFullscreen);

  const rotateBtn = createActionButton(ICONS.rotate, imageViewerConfig.text.rotateAriaLabel);
  rotateBtn.addEventListener('click', rotate);

  const resetBtn = createActionButton(ICONS.originalSize, imageViewerConfig.text.originalSizeAriaLabel);
  resetBtn.addEventListener('click', resetTransform);

  actionsContainer.appendChild(prevBtn);
  actionsContainer.appendChild(nextBtn);
  actionsContainer.appendChild(zoomOutBtn);
  actionsContainer.appendChild(zoomInBtn);
  actionsContainer.appendChild(fullscreenBtn);
  actionsContainer.appendChild(rotateBtn);
  actionsContainer.appendChild(resetBtn);
}

function updateInfo(): void {
  if (!infoElement) return;

  if (currentIndex >= 0 && currentDocImages.length > 1) {
    infoElement.textContent = formatInfo(currentIndex + 1, currentDocImages.length);
    infoElement.style.display = 'block';
  } else {
    infoElement.style.display = 'none';
  }
}

// ========================================
// 🔍 缩放 / 旋转 / 重置 / 全屏
// ========================================
function zoom(delta: number, centerX?: number, centerY?: number): void {
  if (!imageElement || !canvas) return;

  const newScale = clampScale(transform.scale + delta);
  if (newScale === transform.scale) return;

  if (centerX !== undefined && centerY !== undefined) {
    const rect = canvas.getBoundingClientRect();
    const originX = centerX - rect.left - rect.width / 2;
    const originY = centerY - rect.top - rect.height / 2;
    const ratio = newScale / transform.scale;

    transform.translateX = originX - (originX - transform.translateX) * ratio;
    transform.translateY = originY - (originY - transform.translateY) * ratio;
  }

  transform.scale = newScale;
  applyTransform(true);
}

function rotate(): void {
  if (!imageElement) return;

  const newRotate = transform.rotate + imageViewerConfig.rotationStep;
  const isRotated = Math.abs(newRotate % 180) === 90;

  transform.rotate = newRotate;
  transform.translateX = 0;
  transform.translateY = 0;

  if (isRotated) {
    const layoutWidth = imageElement.clientWidth;
    const layoutHeight = imageElement.clientHeight;
    if (layoutWidth > 0 && layoutHeight > 0) {
      const maxWidth = isFullscreen ? window.innerWidth : window.innerWidth * 0.9;
      const maxHeight = isFullscreen ? window.innerHeight : window.innerHeight * 0.8;
      const scaleX = maxWidth / layoutHeight;
      const scaleY = maxHeight / layoutWidth;
      transform.scale = clampScale(Math.min(scaleX, scaleY));
    }
  } else {
    transform.scale = 1;
  }

  applyTransform(true);
}

function resetTransform(): void {
  transform = { scale: 1, rotate: 0, translateX: 0, translateY: 0 };
  applyTransform(true);
}

function toggleFullscreen(): void {
  if (!canvas || !imageElement) return;
  isFullscreen = !isFullscreen;
  canvas.classList.toggle(FULLSCREEN_CLASS, isFullscreen);

  if (Math.abs(transform.rotate % 180) === 90) {
    requestAnimationFrame(() => {
      if (!imageElement) return;
      const layoutWidth = imageElement.clientWidth;
      const layoutHeight = imageElement.clientHeight;
      if (layoutWidth > 0 && layoutHeight > 0) {
        const maxWidth = isFullscreen ? window.innerWidth : window.innerWidth * 0.9;
        const maxHeight = isFullscreen ? window.innerHeight : window.innerHeight * 0.8;
        const scaleX = maxWidth / layoutHeight;
        const scaleY = maxHeight / layoutWidth;
        transform.scale = clampScale(Math.min(scaleX, scaleY));
        transform.translateX = 0;
        transform.translateY = 0;
        applyTransform(true);
      }
    });
  }

  rebuildActions();
}

// ========================================
// 🔄 图片切换
// ========================================
function switchImage(direction: number): void {
  if (currentDocImages.length === 0 || currentIndex < 0) return;

  const newIndex = currentIndex + direction;
  if (newIndex < 0 || newIndex >= currentDocImages.length) return;

  currentIndex = newIndex;
  currentOriginalImage = currentDocImages[currentIndex];

  if (imageElement && currentOriginalImage) {
    imageElement.style.transition = `opacity ${imageViewerConfig.animationDuration / 2}ms ease`;
    imageElement.style.opacity = '0';

    setTimeout(() => {
      if (!imageElement || !currentOriginalImage) return;
      imageElement.src = currentOriginalImage.src;
      imageElement.alt = currentOriginalImage.alt || '';
      transform = { scale: 1, rotate: 0, translateX: 0, translateY: 0 };
      applyTransform(false);

      requestAnimationFrame(() => {
        if (!imageElement) return;
        imageElement.style.opacity = '1';
      });
    }, imageViewerConfig.animationDuration / 2);
  }

  rebuildActions();
  updateInfo();
}

// ========================================
// ✋ 拖拽平移
// ========================================
function handleDragStart(clientX: number, clientY: number): void {
  if (!canvas) return;
  isDragging = true;
  dragStart = { x: clientX, y: clientY };
  transformBeforeDrag = { translateX: transform.translateX, translateY: transform.translateY };
  canvas.classList.add('is-dragging');

  if (imageElement) {
    imageElement.style.transition = 'none';
  }
}

function handleDragMove(clientX: number, clientY: number): void {
  if (!isDragging) return;
  const deltaX = clientX - dragStart.x;
  const deltaY = clientY - dragStart.y;

  transform.translateX = transformBeforeDrag.translateX + deltaX;
  transform.translateY = transformBeforeDrag.translateY + deltaY;
  applyTransform(false);
}

function handleDragEnd(): void {
  if (!isDragging) return;
  isDragging = false;
  canvas?.classList.remove('is-dragging');
}

// ========================================
// ⌨️ 事件监听
// ========================================
function attachViewerEvents(): void {
  if (!wrapper || !closeBtn || !canvas || !imageElement) return;

  const onCloseClick = () => closeViewer(true);
  closeBtn.addEventListener('click', onCloseClick);
  cleanupFns.push(() => closeBtn?.removeEventListener('click', onCloseClick));

  const onWrapperClick = (e: MouseEvent) => {
    if (e.target === wrapper) {
      closeViewer(true);
    }
  };
  wrapper.addEventListener('click', onWrapperClick);
  cleanupFns.push(() => wrapper?.removeEventListener('click', onWrapperClick));

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? imageViewerConfig.scale.wheelStep : -imageViewerConfig.scale.wheelStep;
    zoom(delta, e.clientX, e.clientY);
  };
  wrapper.addEventListener('wheel', onWheel, { passive: false });
  cleanupFns.push(() => wrapper?.removeEventListener('wheel', onWheel as EventListener));

  const onMouseDown = (e: MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };
  canvas.addEventListener('mousedown', onMouseDown);
  cleanupFns.push(() => canvas?.removeEventListener('mousedown', onMouseDown));

  const onMouseMove = (e: MouseEvent) => {
    handleDragMove(e.clientX, e.clientY);
  };
  window.addEventListener('mousemove', onMouseMove);
  cleanupFns.push(() => window.removeEventListener('mousemove', onMouseMove));

  const onMouseUp = () => {
    handleDragEnd();
  };
  window.addEventListener('mouseup', onMouseUp);
  cleanupFns.push(() => window.removeEventListener('mouseup', onMouseUp));

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    e.preventDefault();
    handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
  };
  canvas.addEventListener('touchstart', onTouchStart, { passive: false });
  cleanupFns.push(() => canvas?.removeEventListener('touchstart', onTouchStart));

  const onTouchMove = (e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    e.preventDefault();
    handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
  };
  canvas.addEventListener('touchmove', onTouchMove, { passive: false });
  cleanupFns.push(() => canvas?.removeEventListener('touchmove', onTouchMove));

  const onTouchEnd = () => {
    handleDragEnd();
  };
  canvas.addEventListener('touchend', onTouchEnd);
  cleanupFns.push(() => canvas?.removeEventListener('touchend', onTouchEnd));

  const onKeyDown = (e: KeyboardEvent) => {
    const key = e.key;
    const shortcuts = imageViewerConfig.keyboardShortcuts;

    if (shortcuts.close.includes(key)) {
      e.preventDefault();
      closeViewer(true);
    } else if (shortcuts.zoomIn.includes(key)) {
      e.preventDefault();
      zoom(imageViewerConfig.scale.step);
    } else if (shortcuts.zoomOut.includes(key)) {
      e.preventDefault();
      zoom(-imageViewerConfig.scale.step);
    } else if (shortcuts.rotate.includes(key)) {
      e.preventDefault();
      rotate();
    } else if (shortcuts.prev.includes(key)) {
      e.preventDefault();
      switchImage(-1);
    } else if (shortcuts.next.includes(key)) {
      e.preventDefault();
      switchImage(1);
    } else if (shortcuts.reset.includes(key)) {
      e.preventDefault();
      resetTransform();
    } else if (shortcuts.fullscreen.includes(key)) {
      e.preventDefault();
      toggleFullscreen();
    }
  };
  document.addEventListener('keydown', onKeyDown);
  cleanupFns.push(() => document.removeEventListener('keydown', onKeyDown));
}

function detachViewerEvents(): void {
  cleanupFns.forEach((fn) => fn());
  cleanupFns = [];
}

// ========================================
// 🔗 图片点击事件委托
// ========================================
function getClickedImage(target: EventTarget | null): HTMLImageElement | null {
  if (!target || !(target instanceof Node)) return null;

  const img = target instanceof HTMLImageElement ? target : (target as HTMLElement).closest('img');
  return img as HTMLImageElement | null;
}

function onDocImageClick(e: MouseEvent): void {
  const img = getClickedImage(e.target);
  if (!img) return;

  if (!isImageInDocContent(img)) return;
  if (isExcludedImage(img)) return;

  e.preventDefault();
  e.stopPropagation();
  openViewer(img);
}

function attachDocClickDelegate(): void {
  document.body.addEventListener('click', onDocImageClick);
}

// ========================================
// 🚀 初始化入口
// ========================================
export function useImageViewer(): void {
  if (typeof document === 'undefined') return;
  if (!imageViewerConfig.enabled) return;

  attachDocClickDelegate();
}
