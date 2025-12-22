import {
  IndexDetailInfo,
  IndexMetric,
  IndexHistoryData,
  IndexConstituent,
  IndexNews,
  IndexComparison,
} from './types';

// 指数详情基本信息
export const mockIndexDetailInfo: IndexDetailInfo = {
  name: '沪深300',
  code: '000300.SH',
  enName: 'CSI 300 Index',
  currentPrice: 3856.42,
  change: -12.35,
  changePercent: -0.32,
  open: 3865.2,
  prevClose: 3868.77,
  high: 3872.15,
  low: 3845.3,
  volume: '1.8万亿',
  turnover: 0.72,
  tradeDate: '', // mock 数据不设置日期
  prevTradeDate: undefined,
};

// 关键指标数据
export const mockIndexMetrics: IndexMetric[] = [
  { label: 'PE (市盈率)', value: 12.35, trend: '分位: 65.3% (近5年)' },
  { label: 'PB (市净率)', value: 1.42, trend: '分位: 68.5% (近5年)' },
  { label: 'PS (市销率)', value: 1.85, trend: '分位: 58.2%' },
  { label: '股息率', value: '2.85%', trend: '较昨日 +0.02%' },
  { label: 'ROE (净资产收益率)', value: '11.25%', trend: '较去年同期 +1.2%' },
  { label: 'ROA (总资产收益率)', value: '8.45%', trend: '较去年同期 +0.8%' },
  { label: '总市值', value: '28.5万亿', trend: '占A股总市值 32.5%' },
  { label: '流通市值', value: '25.8万亿', trend: '流通率 90.5%' },
];

// K线图页面的关键指标
export const mockKlineMetrics: IndexMetric[] = [
  { label: 'PE (市盈率)', value: 12.35, trend: '分位: 65.3%' },
  { label: 'PB (市净率)', value: 1.42, trend: '分位: 68.5%' },
  { label: '股息率', value: '2.85%', trend: '较昨日 +0.02%' },
  { label: '52周最高', value: 4125.68, trend: '2024-01-15' },
  { label: '52周最低', value: 3456.2, trend: '2023-10-23' },
  { label: '年初至今', value: '+3.21%', trend: '排名: 15/50' },
];

// 历史数据
export const mockHistoryData: IndexHistoryData[] = [
  {
    tradeDate: '2024-01-15',
    close: 3856.42,
    change: -12.35,
    changePercent: -0.32,
    open: 3865.2,
    high: 3872.15,
    low: 3845.3,
    volume: '1.8万亿',
    amount: '2.5万亿',
    turnover: 0.72,
  },
  {
    tradeDate: '2024-01-14',
    close: 3868.77,
    change: 25.68,
    changePercent: 0.67,
    open: 3845.2,
    high: 3875.3,
    low: 3840.15,
    volume: '1.6万亿',
    amount: '2.2万亿',
    turnover: 0.65,
  },
  {
    tradeDate: '2024-01-13',
    close: 3843.09,
    change: -8.45,
    changePercent: -0.22,
    open: 3850.2,
    high: 3855.3,
    low: 3835.15,
    volume: '1.5万亿',
    amount: '2.0万亿',
    turnover: 0.6,
  },
  {
    tradeDate: '2024-01-12',
    close: 3851.54,
    change: 15.23,
    changePercent: 0.4,
    open: 3835.2,
    high: 3860.3,
    low: 3830.15,
    volume: '1.4万亿',
    amount: '1.9万亿',
    turnover: 0.58,
  },
  {
    tradeDate: '2024-01-11',
    close: 3836.31,
    change: -18.45,
    changePercent: -0.48,
    open: 3855.2,
    high: 3862.3,
    low: 3825.15,
    volume: '1.7万亿',
    amount: '2.3万亿',
    turnover: 0.7,
  },
];

// 成分股数据
export const mockConstituents: IndexConstituent[] = [
  { name: '贵州茅台', code: '600519', weight: 5.23, changePercent: 1.25 },
  { name: '中国平安', code: '601318', weight: 3.85, changePercent: -0.45 },
  { name: '招商银行', code: '600036', weight: 3.42, changePercent: 0.68 },
  { name: '五粮液', code: '000858', weight: 2.95, changePercent: 1.12 },
  { name: '美的集团', code: '000333', weight: 2.68, changePercent: -0.32 },
  { name: '宁德时代', code: '300750', weight: 2.45, changePercent: 2.35 },
  { name: '兴业银行', code: '601166', weight: 2.32, changePercent: 0.45 },
  { name: '长江电力', code: '600900', weight: 2.18, changePercent: -0.15 },
  { name: '中国中免', code: '601888', weight: 2.05, changePercent: 1.85 },
  { name: '恒瑞医药', code: '600276', weight: 1.95, changePercent: 0.92 },
];

// 新闻公告数据
export const mockNews: IndexNews[] = [
  {
    title: '沪深300指数成分股调整公告',
    date: '2024-01-15 09:00',
    source: '中证指数公司',
  },
  {
    title: '沪深300ETF资金流入创新高',
    date: '2024-01-14 15:30',
    source: '证券时报',
  },
  {
    title: '机构看好沪深300长期投资价值',
    date: '2024-01-13 10:20',
    source: '中国证券报',
  },
  {
    title: '沪深300指数估值处于合理区间',
    date: '2024-01-12 14:15',
    source: '金融界',
  },
  {
    title: '沪深300指数技术面分析：短期震荡，长期看好',
    date: '2024-01-11 16:45',
    source: '东方财富',
  },
];

// 指数对比数据
export const mockComparison: IndexComparison[] = [
  {
    name: '沪深300',
    code: '000300',
    currentPrice: 3856.42,
    changePercent: -0.32,
    ytd: 3.21,
    pe: 12.35,
    pb: 1.42,
  },
  {
    name: '上证指数',
    code: '000001',
    currentPrice: 3125.68,
    changePercent: 0.04,
    ytd: 5.32,
    pe: 13.25,
    pb: 1.38,
  },
  {
    name: '中证500',
    code: '000905',
    currentPrice: 5421.89,
    changePercent: 0.53,
    ytd: 8.45,
    pe: 18.65,
    pb: 1.85,
  },
  {
    name: '创业板指',
    code: '399006',
    currentPrice: 2156.78,
    changePercent: 0.71,
    ytd: 12.34,
    pe: 22.35,
    pb: 3.25,
  },
];

// 生成 K 线图数据
export const generateKlineData = (days: number = 30) => {
  const data = [];
  const basePrice = 3800;
  let currentPrice = basePrice;

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    const change = (Math.random() - 0.5) * 50;
    currentPrice += change;
    data.push({
      date: `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
      value: Number(currentPrice.toFixed(2)),
    });
  }

  return data;
};

