// 首页面板 Mock 数据
import type {
  MarketRegime,
  IndexData,
  ConstraintData,
  ParticipationData,
  WatchlistItem,
  AlertData,
} from './types';

export const mockMarketRegime: MarketRegime = {
  phase: 'Phase 3',
  phaseName: '结构分化期',
  badge: 'Dispersion',
  macroStatus: '中性偏松 (Neutral+)',
  environment: '中 (Medium)',
  environmentColor: '#faad14',
  riskExposure: '≤ 50%',
  applicableMarket: 'A股为主 (China A-Share Focus)',
};

export const mockIndexData: IndexData[] = [
  {
    name: '上证指数',
    code: '000001.SH',
    price: 2910.22,
    change: 13.08,
    changePercent: 0.45,
    tags: [
      { text: '权重护盘', type: 'blue' },
      { text: '放量', type: 'default' },
    ],
  },
  {
    name: '深证成指',
    code: '399001.SZ',
    price: 8902.33,
    change: -10.68,
    changePercent: -0.12,
    tags: [
      { text: '分化', type: 'default' },
      { text: '缩量', type: 'default' },
    ],
  },
  {
    name: '创业板指',
    code: '399006.SZ',
    price: 1732.5,
    change: -11.85,
    changePercent: -0.68,
    tags: [
      { text: '成长承压', type: 'hot' },
      { text: '弱势', type: 'default' },
    ],
  },
  {
    name: '沪深300',
    code: '000300.SH',
    price: 3350.15,
    change: 7.35,
    changePercent: 0.22,
    tags: [
      { text: '价值防御', type: 'blue' },
    ],
  },
  {
    name: '中证1000',
    code: '000852.SH',
    price: 5210.88,
    change: 57.32,
    changePercent: 1.1,
    tags: [
      { text: '普涨', type: 'hot' },
      { text: '活跃', type: 'hot' },
    ],
  },
  {
    name: '科创50',
    code: '000688.SH',
    price: 780.45,
    change: -2.73,
    changePercent: -0.35,
    tags: [
      { text: '半导体弱', type: 'default' },
    ],
  },
];

export const mockConstraintData: ConstraintData[] = [
  {
    title: 'Rates 利率',
    value: '短松长稳',
    direction: 'down',
    description: '资金面宽松、长端稳定',
    implication: '→ 对 A 股估值偏友好',
  },
  {
    title: 'Liquidity 流动性',
    value: '宽币/紧信',
    direction: 'flat',
    description: '资金淤积、信用未修复',
    implication: '→ A股偏结构行情，不易普涨',
  },
  {
    title: 'FX 外汇',
    value: '美元偏强',
    direction: 'up',
    description: '输入型压力上行',
    implication: '→ 对外资风险偏好偏压制',
  },
  {
    title: 'Risk 风险',
    value: '波动低位',
    direction: 'down',
    description: '风险定价偏安全',
    implication: '→ 下行风险可控，防结构拥挤',
  },
  {
    title: 'Structure 结构',
    value: '集中度高',
    direction: 'up',
    description: '抱团明显、扩散不足 (0.62)',
    implication: '→ 指数上行依赖权重/核心龙头',
  },
];

export const mockParticipationData: ParticipationData[] = [
  {
    title: 'A股 · 指数/风格 (Index & Style)',
    description: '结构性机会为主：偏强赛道 + 低位补涨跟踪',
    status: 'check',
    action: '进入风格雷达 →',
    borderColor: '#52c41a',
  },
  {
    title: 'A股 · 行业轮动 (Sector Rotation)',
    description: '关注高景气细分 + 政策催化方向',
    status: 'check',
    action: '进入行业热力图 →',
    borderColor: '#52c41a',
  },
  {
    title: 'A股 · 情绪/投机 (Sentiment)',
    description: '连板高度/打板回撤风险，谨慎参与',
    status: 'warn',
    action: '进入情绪监控 →',
    borderColor: '#faad14',
  },
];

export const mockWatchlistData: WatchlistItem[] = [
  {
    symbol: '510300.SH',
    name: '沪深300ETF',
    price: 3.35,
    changePercent: 0.22,
  },
  {
    symbol: '512100.SH',
    name: '中证1000ETF',
    price: 2.21,
    changePercent: 1.15,
  },
  {
    symbol: '588000.SH',
    name: '科创50ETF',
    price: 0.782,
    changePercent: -0.3,
  },
  {
    symbol: '601888.SH',
    name: '中国中免',
    price: 78.5,
    changePercent: -1.2,
  },
  {
    symbol: '600519.SH',
    name: '贵州茅台',
    price: 1650.0,
    changePercent: 0.1,
  },
];

export const mockAnchorData = {
  shanghai: { label: '上证', changePercent: 0.45 },
  chuangyeban: { label: '创业板', changePercent: -0.68 },
  hushen300: { label: '沪深300', changePercent: 0.22 },
};

export const mockAlertData: AlertData = {
  icon: '⚡',
  title: 'A股结构异动提醒：',
  content: '结构扩散指数快速上行 (0.45 → 0.62)',
  detail: '关注：低位补涨 / 行业扩散改善 / 量能是否跟随',
  link: '#',
};
