// 市场数据 Mock

export interface PhaseDefinition {
  id: number;
  name: string;
  color: string;
  desc: string;
}

export const PHASE_DEFINITIONS: Record<number, PhaseDefinition> = {
  1: { id: 1, name: 'P1: 政策底/恐慌', color: '#ff4d4f', desc: 'Risk差/Structure差/Behavior背离' },
  2: { id: 2, name: 'P2: 流动性修复', color: '#faad14', desc: 'Rates改善/Risk中性/Structure不稳' },
  3: { id: 3, name: 'P3: 结构分化', color: '#1890ff', desc: 'Risk中/Liquidity松/Structure抱团' },
  4: { id: 4, name: 'P4: 扩散上行', color: '#52c41a', desc: 'Risk好/Credit好/Structure广度高' },
};

export interface HistoryDataItem {
  date: string;
  phaseId: number;
  mainRadar: number[]; // [Rates, Liquidity, FX, Inflation, Risk, Structure]
  subRadar: {
    Rates: number[];
    Liquidity: number[];
    FX: number[];
    Inflation: number[];
    Risk: number[];
    Structure: number[];
  };
  status: {
    label: string;
    color: string;
    dir: string;
  };
  riskStance: {
    tol: string;
    cap: string;
  };
  behavior: {
    nb: string; // 北向资金
    mar: string; // 融资余额
    mf: string; // 主力资金
  };
  result: {
    sh: string; // 上证指数
    pe: string; // PE
  };
}

export const historyData: HistoryDataItem[] = [
  {
    date: '2023-10-15',
    phaseId: 1,
    mainRadar: [-1.8, -1.5, -1.5, 0.5, -1.9, -1.8],
    subRadar: {
      Rates: [85, 80, 20, 30, 80, 20],
      Liquidity: [15, 10, 20, 10, 15, 20],
      FX: [95, 90, 95, 10, 20],
      Inflation: [30, 20, 20, 20, 30, 80],
      Risk: [90, 85, 20, 30, 85, 80],
      Structure: [15, 10, 95, 15, 20, 10],
    },
    status: { label: '极度紧缩 (Crisis)', color: 'status-improving', dir: '触底' },
    riskStance: { tol: '低 (Low)', cap: '20%' },
    behavior: { nb: '-65.5 亿', mar: '1.35 万亿', mf: '-450 亿' },
    result: { sh: '2,910.50', pe: '15.5' },
  },
  {
    date: '2023-10-25',
    phaseId: 1,
    mainRadar: [-1.5, -1.2, -1.5, 0.5, -1.5, -1.5],
    subRadar: {
      Rates: [80, 75, 25, 30, 80, 25],
      Liquidity: [20, 15, 30, 15, 20, 30],
      FX: [90, 80, 90, 15, 25],
      Inflation: [30, 25, 25, 25, 35, 75],
      Risk: [80, 75, 25, 35, 80, 75],
      Structure: [20, 15, 90, 20, 30, 15],
    },
    status: { label: '底部震荡', color: 'status-neutral', dir: '企稳' },
    riskStance: { tol: '低 (Low)', cap: '25%' },
    behavior: { nb: '-20.5 亿', mar: '1.36 万亿', mf: '-280 亿' },
    result: { sh: '2,935.20', pe: '15.6' },
  },
  {
    date: '2023-11-05',
    phaseId: 2,
    mainRadar: [0.5, 1.2, -0.8, 0.8, -0.5, -0.8],
    subRadar: {
      Rates: [50, 45, 50, 60, 60, 35],
      Liquidity: [60, 55, 50, 70, 60, 50],
      FX: [70, 60, 80, 30, 40],
      Inflation: [50, 40, 35, 35, 40, 65],
      Risk: [50, 40, 40, 45, 50, 50],
      Structure: [40, 35, 80, 30, 40, 25],
    },
    status: { label: '流动性注入', color: 'status-improving', dir: '反弹' },
    riskStance: { tol: '中 (Med)', cap: '40%' },
    behavior: { nb: '+85.2 亿', mar: '1.39 万亿', mf: '-50 亿' },
    result: { sh: '3,020.15', pe: '16.1' },
  },
  {
    date: '2023-11-20',
    phaseId: 2,
    mainRadar: [0.8, 1.5, -0.5, 0.8, -0.2, -0.5],
    subRadar: {
      Rates: [40, 35, 60, 70, 50, 40],
      Liquidity: [70, 65, 60, 80, 70, 60],
      FX: [60, 50, 70, 40, 50],
      Inflation: [60, 50, 45, 40, 40, 60],
      Risk: [40, 30, 50, 40, 40, 40],
      Structure: [60, 55, 70, 40, 50, 30],
    },
    status: { label: '强力反弹', color: 'status-improving', dir: '向上' },
    riskStance: { tol: '高 (High)', cap: '65%' },
    behavior: { nb: '+120.5 亿', mar: '1.42 万亿', mf: '+55 亿' },
    result: { sh: '3,080.12', pe: '16.5' },
  },
  {
    date: '2023-12-05',
    phaseId: 3,
    mainRadar: [1.2, 0.5, -0.8, 1.5, -0.5, 0.2],
    subRadar: {
      Rates: [60, 55, 70, 80, 40, 30],
      Liquidity: [40, 30, 70, 80, 50, 60],
      FX: [70, 40, 80, 30, 75],
      Inflation: [80, 60, 40, 45, 42, 70],
      Risk: [30, 20, 60, 50, 40, 35],
      Structure: [75, 70, 80, 50, 60, 40],
    },
    status: { label: '中性偏松 (Neutral+)', color: 'status-neutral', dir: '分化' },
    riskStance: { tol: '中 (Med)', cap: '50%' },
    behavior: { nb: '+45.2 亿', mar: '1.45 万亿', mf: '-12.5 亿' },
    result: { sh: '3,050.23', pe: '16.8' },
  },
  {
    date: '2023-12-15',
    phaseId: 3,
    mainRadar: [1.1, 0.4, -0.9, 1.4, -0.4, 0.3],
    subRadar: {
      Rates: [65, 60, 75, 80, 35, 30],
      Liquidity: [35, 25, 75, 75, 45, 65],
      FX: [75, 45, 85, 25, 80],
      Inflation: [85, 65, 45, 50, 45, 75],
      Risk: [35, 25, 65, 55, 45, 40],
      Structure: [80, 75, 85, 55, 65, 45],
    },
    status: { label: '结构加剧', color: 'status-neutral', dir: '整固' },
    riskStance: { tol: '中 (Med)', cap: '50%' },
    behavior: { nb: '-10.5 亿', mar: '1.46 万亿', mf: '-120 亿' },
    result: { sh: '3,035.80', pe: '16.7' },
  },
];

// 当前最新数据（默认显示）
export const currentMarketData = historyData[historyData.length - 1];

// 子雷达配置
export interface SubRadarConfig {
  title: string;
  indicators: Array<{ name: string; max: number }>;
  metrics: Array<{ label: string; val: string; color: string }>;
}

export const subRadarConfigs: Record<string, SubRadarConfig> = {
  Rates: {
    title: 'Rates · 利率结构雷达',
    indicators: [
      { name: 'Shibor O/N 偏离', max: 100 },
      { name: 'DR007 偏离', max: 100 },
      { name: '1Y 国债方向', max: 100 },
      { name: '10Y 国债方向', max: 100 },
      { name: '期限利差 (10Y-1Y)', max: 100 },
      { name: '中美利差方向', max: 100 },
    ],
    metrics: [
      { label: 'DR007', val: '1.85%', color: '#3f8600' },
      { label: '10Y 国债', val: '2.68%', color: '#cf1322' },
      { label: '期限利差', val: '+83bp', color: '#333' },
    ],
  },
  Liquidity: {
    title: 'Liquidity · 货币供给结构',
    indicators: [
      { name: 'M2 同比趋势', max: 100 },
      { name: '社融同比趋势', max: 100 },
      { name: '社融结构(实/虚)', max: 100 },
      { name: 'OMO 净投放', max: 100 },
      { name: 'MLF/PSL 方向', max: 100 },
      { name: '存单存量', max: 100 },
    ],
    metrics: [
      { label: 'M2 增速', val: '10.3%', color: '#333' },
      { label: '社融增量', val: '2.45万亿', color: '#333' },
      { label: 'OMO 本周', val: '+1800亿', color: '#cf1322' },
    ],
  },
  FX: {
    title: 'FX · 汇率压力结构',
    indicators: [
      { name: 'USD/CNY 趋势', max: 100 },
      { name: 'USD/CNY 波动', max: 100 },
      { name: 'DXY 美元指数', max: 100 },
      { name: '中美利差', max: 100 },
      { name: '非美货币共振', max: 100 },
    ],
    metrics: [
      { label: 'USD/CNY', val: '7.15', color: '#cf1322' },
      { label: 'DXY', val: '103.4', color: '#cf1322' },
      { label: '1Y 波动率', val: '4.2%', color: '#3f8600' },
    ],
  },
  Inflation: {
    title: 'Inflation · 成本来源结构',
    indicators: [
      { name: '原油趋势', max: 100 },
      { name: '原油波动', max: 100 },
      { name: '铜趋势', max: 100 },
      { name: '铝趋势', max: 100 },
      { name: '工业金属综合', max: 100 },
      { name: '黄金 (交叉)', max: 100 },
    ],
    metrics: [
      { label: 'Brent 原油', val: '$85.2', color: '#cf1322' },
      { label: 'LME 铜', val: '$8400', color: '#3f8600' },
      { label: '黄金', val: '$2030', color: '#cf1322' },
    ],
  },
  Risk: {
    title: 'Risk · 风险定价结构',
    indicators: [
      { name: 'VIX 水平', max: 100 },
      { name: 'VIX 变化', max: 100 },
      { name: 'PCR 水平', max: 100 },
      { name: 'PCR 偏离', max: 100 },
      { name: '信用利差', max: 100 },
      { name: '违约率预期', max: 100 },
    ],
    metrics: [
      { label: 'VIX', val: '18.5', color: '#3f8600' },
      { label: 'PCR', val: '0.85', color: '#cf1322' },
      { label: '信用利差', val: '120bp', color: '#333' },
    ],
  },
  Structure: {
    title: 'Structure · 市场广度结构',
    indicators: [
      { name: '涨跌比', max: 100 },
      { name: '集中度', max: 100 },
      { name: '扩散指数', max: 100 },
      { name: '新高/新低', max: 100 },
      { name: '成交量分布', max: 100 },
      { name: '行业轮动', max: 100 },
    ],
    metrics: [
      { label: '涨跌比', val: '1.85', color: '#3f8600' },
      { label: '集中度', val: '35%', color: '#333' },
      { label: '扩散指数', val: '68', color: '#3f8600' },
    ],
  },
};

