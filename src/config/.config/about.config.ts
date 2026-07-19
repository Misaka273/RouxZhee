// 🕊️白木 原创开发 🔗gl.baimu.live
// 个人介绍页面用户自定义配置

import type { AboutConfig, FooterImageItem } from '../about.config';
import { withBase } from '../../utils/base';

// ========================================
// 📝 用户自定义配置
// 这里的配置会覆盖默认配置
// ========================================
export const userAboutConfig: Partial<AboutConfig> = {
  // 🖼️ 首屏 · 身份锚定区
  hero: {
    avatar: 'https://img.xxdevops.cn/blog/avatar/yuwen_avatar.avif?w=240&h=240&fit=crop&fm=webp&q=85',
    avatarAlt: '博主头像',
    name: '余温',
    handle: '@yu_wen',
    role: '资深云原生架构师 ｜ 前阿里 P7 ｜ 技术专栏作者',
    valueProposition: '用 8 年一线踩坑经验，帮你把复杂的系统架构，拆解成看得懂的实战笔记',
    stats: [
      { icon: '👨‍💻', value: '8年', label: '后端经验' },
      { icon: '📦', value: '千万级', label: '主导日活中台' },
      { icon: '📝', value: '156篇', label: '原创图解' },
    ],
    headerTags: {
      left: [
        '🤝 上知天文地理，下知鸡毛蒜皮',
        '🏃 拼尽全力终于没有力气',
        '🪸 互联网海螺',
        '💢 逃出了地球，没逃出 SQL 库',
      ],
      right: [
        '😏 说实话你挺好看的，但我没说实话',
        '🔍 Ta 只是喜欢你，又不是只喜欢你',
        '🤖️ 学了八年机械舞，结果发现写的代码都带卡顿',
        '🔨 野外 boss 遇真爱',
      ],
    },
  },

  // 📖 故事钩子 · 共鸣区
  story: {
    image: withBase('/assets/shiroki.avif'),
    quote: '我曾经也因为半夜线上告警，抱着电脑在出租屋里哭过',
    paragraphs: [
      '起点：我曾是个连 Git 都不会用的菜鸟',
      '转折：在无数次通宵加班和踩坑中，我总结出了一套自己的方法论',
      '现在：我把这些血泪教训写成文章，只为让后来的你，少熬一个夜',
      // 可继续追加更多故事段落
    ],
    testimonial: {
      author: '@白木',
      content: '看了你的 K8s 系列，我终于搞懂了 Pod 的生命周期',
    },
  },

  // 💼 硬核履历 · 时间轴
  career: {
    title: '💼 核心职业履历',
    items: [
      {
        period: '2022.04 - 至今',
        company: '某独角兽公司',
        role: '技术委员会核心成员',
        highlights: [
          '主导混合云容灾体系建设，将 RTO（恢复时间）从 2 小时缩短至 45 秒',
          '重构核心计费模块，解决高并发下数据一致性问题，支撑单日千万级订单',
        ],
      },
      {
        period: '2018.07 - 2022.03',
        company: '阿里巴巴',
        role: '高级开发工程师（P7）',
        highlights: [
          '参与双 11 大促核心链路优化，通过 JVM 调优和缓存策略，整体响应时间降低 40%',
          '从 0 到 1 搭建内部服务网格（Service Mesh）基础组件，覆盖集团 2000+ 核心应用',
        ],
      },
      {
        period: '2016.09 - 2018.06',
        company: '创业公司',
        role: '全栈开发（早期核心员工）',
        highlights: [
          '作为第 5 号员工，独立负责 App 后端及管理后台全流程开发，经历公司从 0 到被收购的完整周期',
        ],
      },
      // 示例：追加更多职业经历
      // {
      //   period: '2014.07 - 2016.08',
      //   company: '某外包公司',
      //   role: '初级开发工程师',
      //   highlights: [
      //     '独立完成 10+ 企业官网与后台管理系统前端开发',
      //     '沉淀出首套内部 UI 组件库，提升团队交付效率 30%',
      //   ],
      // },
    ],
  },

  // 🛠️ 技能与工具箱：继续往 categories 数组追加即可新增分类
  skills: {
    title: '🛠️ 技能与工具箱',
    categories: [
      {
        name: '编程语言',
        items: [
          { level: '精通', levelClass: 'master', label: 'Java、Go（源码级）' },
          { level: '熟练', levelClass: 'proficient', label: 'Python、Shell（生产级）' },
        ],
      },
      {
        name: '基础设施',
        items: [
          { level: '精通', levelClass: 'master', label: 'Kubernetes、Docker、Istio' },
          { level: '熟练', levelClass: 'proficient', label: 'Terraform、Ansible' },
        ],
      },
      {
        name: '数据中间件',
        items: [
          { level: '精通', levelClass: 'master', label: 'Redis、Kafka、MySQL（慢 SQL 调优）' },
          { level: '熟练', levelClass: 'proficient', label: 'ElasticSearch、ClickHouse' },
        ],
      },
      {
        name: '日常生产力',
        items: [
          { level: '', levelClass: 'plain', label: '终端控：Neovim + Tmux；画图神器：Excalidraw；笔记：Obsidian + Git' },
        ],
      },
      // 示例：追加更多分类
      // {
      //   name: '软技能',
      //   items: [
      //     { level: '熟练', levelClass: 'proficient', label: '技术写作与演讲' },
      //     { level: '熟练', levelClass: 'proficient', label: '跨团队项目管理' },
      //   ],
      // },
    ],
  },

  // 📢 博主输出 · 影响力资产
  influence: {
    title: '📢 博主输出 · 影响力资产',
    stats: {
      label: '📊 全网影响力',
      items: [
        { value: '18万+', label: '公众号/博客订阅' },
        { value: '优秀作者', label: '掘金/InfoQ' },
        { value: '800万+', label: '总阅读量' },
      ],
    },
    featured: {
      label: '📚 精选代表作',
      links: [
        { icon: '🔥', text: '01. 基础语法', href: '/basic-syntax-guide' },
        { icon: '🔥', text: '02. 代码块语法示例', href: '/code-block-syntax-guide' },
        { icon: '🔥', text: '03. 链接语法示例', href: '/link-syntax-guide' },
      ],
    },
    projects: {
      label: '🚀 项目展示',
      links: [
        { icon: '🔥', text: '04. 项目展示', href: '#' },
        { icon: '🔥', text: '05. 项目展示', href: '#' },
        { icon: '🔥', text: '06. 项目展示', href: '#' },
      ],
    },
    // ✨ 其他：支持配置多个自定义卡片，继续往数组里追加即可
    others: [
      {
        label: '✨ 其他',
        links: [
          { icon: '🔥', text: '07. 其他', href: '#' },
          { icon: '🔥', text: '08. 其他', href: '#' },
          { icon: '🔥', text: '09. 其他', href: '#' },
        ],
      },
      // 示例：新增一个自定义卡片
      {
        label: '📌 常用工具',
        links: [
          { icon: '📐', text: 'Excalidraw 画图模板', href: '#' },
          { icon: '🎨', text: 'Obsidian 知识库', href: '#' },
        ],
      },
      {
        label: '📌 工具',
        links: [
          { icon: '📐', text: 'Excalidraw 画图模板', href: '#' },
          { icon: '🎨', text: 'Obsidian 知识库', href: '#' },
        ],
      },
    ],
    recognition: {
      label: '🎤 行业认可',
      items: [
        '2025 QCon 全球软件开发大会 · 演讲嘉宾',
        '极客时间《云原生实战营》特邀讲师',
      ],
    },
  },

  // 🎮 个性彩蛋区
  quirks: {
    title: '🎮 个性彩蛋区',
    items: [
      { icon: '🕐', title: '写作习惯', content: '坚持每天早上 6:00 - 7:30 雷打不动写作，已持续 1200 天' },
      { icon: '📦', title: '原则洁癖', content: '凡是我教程里推荐的工具/组件，必须是我自己在生产环境用了超过半年的，绝不纯抄文档' },
      { icon: '🎮', title: '生活 B 面', content: '下班后是个《塞尔达》重度玩家，偶尔会在博客底部彩蛋里放我拍的晚霞照片' },
    ],
  },

  // 📧 底部联系信息
  footer: {
    email: 'Misaka273@outlook.com',
    replyNote: '24 小时内必回',
    updateText: '更新于 2026 年 7 月',
    // 🖼️ 底部图片：支持本地路径、外部 URL 或 { src, alt, href, external }
    images: [
      withBase('/assets/img/fileName.png'),
      // 外部图片直链
     'https://mu.baimu.live/img/acg/',
      // 可点击跳转的外部图片
      { src: 'https://mu.baimu.live/img/mn/', href: 'https://gl.baimu.live/785', external: true },
    ] as FooterImageItem[],
  },
};

export default userAboutConfig;
