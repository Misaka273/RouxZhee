// 🕊️白木 原创开发 🔗gl.baimu.live
// 光标拖尾特效脚本

import { cursorTrailConfig } from '../../config/cursorTrail.config';

let fallDirection = cursorTrailConfig.defaultFallDirection;

export function useCursorTrail() {
  if (typeof document === 'undefined') return;

  const container = document.createElement('div');
  container.id = cursorTrailConfig.containerId;
  document.body.appendChild(container);

  // 可选方向切换
  document
    .querySelectorAll(`input[name="${cursorTrailConfig.fallDirectionInputName}"]`)
    .forEach((r) =>
      r.addEventListener('change', (e) => {
        fallDirection = parseInt((e.target as HTMLInputElement).value, 10) || cursorTrailConfig.defaultFallDirection;
      })
    );

  let x1 = 0;
  let y1 = 0;

  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  const distToDraw = cursorTrailConfig.distToDraw;
  const delay = cursorTrailConfig.delay;
  const fontSizes = cursorTrailConfig.fontSizes;
  const colorVariables = cursorTrailConfig.colorVariables;

  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const selRand = <T>(arr: T[]) => arr[rand(0, arr.length - 1)];
  const distanceTo = (x1: number, y1: number, x2: number, y2: number) =>
    Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const shouldDraw = (x: number, y: number) => distanceTo(x1, y1, x, y) >= distToDraw;

  const addStar = (x: number, y: number) => {
    const star = document.createElement('div');
    star.className = cursorTrailConfig.starClass;
    star.style.top = `${y + rand(-20, 20)}px`;
    star.style.left = `${x}px`;
    star.style.color = `var(${selRand(colorVariables)})`;
    star.style.fontSize = selRand(fontSizes);
    container.appendChild(star);

    const fs = 10 + 5 * parseFloat(getComputedStyle(star).fontSize);

    star.animate(
      {
        transform: [
          `translate(${rand(-5, 5)}px, ${(y + fs > vh ? vh - y : fs) * fallDirection * 0.3}px)`,
          `translate(${rand(-20, 20)}px, ${(y + fs > vh ? vh - y : fs) * fallDirection}px) rotateX(${rand(1, 500)}deg) rotateY(${rand(1, 500)}deg)`,
        ],
        opacity: [1, 0],
      },
      {
        duration: delay,
        fill: 'forwards',
      }
    );

    setTimeout(() => star.remove(), delay);
  };

  window.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    if (shouldDraw(clientX, clientY)) {
      addStar(clientX, clientY);
      x1 = clientX;
      y1 = clientY;
    }
  });
}
