// 首页面板数据类型定义

export interface MarketRegime {
  phase: string;
  phaseName: string;
  badge: string;
  macroStatus: string;
  environment: string;
  environmentColor: string;
  riskExposure: string;
  applicableMarket: string;
}

export interface IndexData {
  name: string;
  code: string;
  price: number;
  change: number;
  changePercent: number;
  tags: Array<{
    text: string;
    type?: 'hot' | 'cold' | 'blue' | 'default';
  }>;
}

export interface ConstraintData {
  title: string;
  value: string;
  direction: 'up' | 'down' | 'flat';
  description: string;
  implication: string;
}

export interface ParticipationData {
  title: string;
  description: string;
  status: 'check' | 'warn';
  action: string;
  borderColor: string;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
}

export interface AlertData {
  icon: string;
  title: string;
  content: string;
  detail?: string;
  link?: string;
}
