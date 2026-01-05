export interface IndexData {
  name: string;
  code: string;
  value: number;
  change: number;
  changePercent: number;
  ytd: number;
  volume: string;
  turnover: number;
  pePercentile: number;
  pbPercentile: number;
  trend: 'strong' | 'weak';
}

// 指数详情相关类型
export interface IndexDetailInfo {
  name: string;
  code: string;
  enName: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  open: number;
  prevClose: number; // 昨日收盘（往前一个交易日）
  high: number;
  low: number;
  volume: string;
  turnover: number;
  tradeDate: string; // 数据日期（最近一日的交易日期）
  prevTradeDate?: string; // 昨日交易日期（往前一个交易日）
}

export interface IndexMetric {
  label: string;
  value: number | string;
  trend?: string;
  trendValue?: number;
}

export interface IndexHistoryData {
  tradeDate: string;
  close: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  volume: string;
  amount: string;
  turnover: number;
}

export interface IndexConstituent {
  name: string;
  code: string;
  weight: number;
  changePercent: number;
}

export interface IndexNews {
  title: string;
  date: string;
  source: string;
}

export interface IndexComparison {
  name: string;
  code: string;
  currentPrice: number;
  changePercent: number;
  ytd: number;
  pe: number;
  pb: number;
}


