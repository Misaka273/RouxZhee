// 🕊️白木 原创开发 🔗gl.baimu.live
// 👥 RZ 团队页面类型定义

/** 品牌信息 */
export interface TeamBrand {
  /** 品牌 LOGO */
  logo: string;
  /** 品牌名称 */
  name: string;
  /** 品牌简称 */
  shortName: string;
}

/** 品牌含义卡片 */
export interface TeamMeaningCard {
  /** 标题 */
  title: string;
  /** 说明文本行 */
  lines: string[];
}

/** 品牌含义配置 */
export interface TeamMeaning {
  /** 左侧容器 */
  left: TeamMeaningCard;
  /** 右侧容器 */
  right: TeamMeaningCard;
  /** 中间文本 */
  center: string[];
}

/** 品牌介绍卡片 */
export interface TeamIntro {
  /** 介绍文本行 */
  lines: string[];
}

/** 品牌 Slogan */
export interface TeamSlogan {
  /** 循环播放的文本片段 */
  parts: string[];
}

/** 团队成员 */
export interface TeamMember {
  /** 头像 */
  avatar: string;
  /** 名称 */
  name: string;
  /** 标签 */
  tag: string;
  /** 描述 */
  description: string;
}

/** 投喂配置 */
export interface TeamSponsor {
  /** 金额列表 */
  amounts: number[];
  /** 按钮文案 */
  buttonText: string;
  /** 支付 API 地址 */
  apiUrl?: string;
}

/** 团队页面完整配置 */
export interface TeamConfig {
  /** 品牌信息 */
  brand: TeamBrand;
  /** 品牌含义 */
  meaning: TeamMeaning;
  /** 品牌含义下方介绍卡片 */
  intro: TeamIntro;
  /** 品牌 Slogan */
  slogan: TeamSlogan;
  /** 团队成员 */
  members: TeamMember[];
  /** 投喂配置 */
  sponsor: TeamSponsor;
}
