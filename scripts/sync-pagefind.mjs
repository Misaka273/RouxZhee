/**
 * 将构建产物中的 Pagefind 索引同步到 public/，供开发环境使用
 */
import { cpSync, existsSync, rmSync } from 'fs';
import { resolve } from 'path';

const distPagefind = resolve(process.cwd(), 'dist/pagefind');
const publicPagefind = resolve(process.cwd(), 'public/pagefind');

if (!existsSync(distPagefind)) {
  console.warn('[pagefind] dist/pagefind 不存在，跳过同步');
  process.exit(0);
}

if (existsSync(publicPagefind)) {
  rmSync(publicPagefind, { recursive: true, force: true });
}

cpSync(distPagefind, publicPagefind, { recursive: true });
console.log('[pagefind] 已同步索引到 public/pagefind');
