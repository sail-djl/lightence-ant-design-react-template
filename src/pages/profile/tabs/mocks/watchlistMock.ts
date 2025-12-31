// Mock 数据类型定义
export interface WatchlistIndexItem {
  code: string;
  name: string;
  market: string;
  publisher: string;
  price?: number;
  changePercent?: number;
  addTime?: string;
}

export interface WatchlistEtfItem {
  code: string;
  name: string;
  exchange: string;
  indexCode?: string;
  indexName?: string;
  price?: number;
  changePercent?: number;
  addTime?: string;
}

// Mock 数据
export const mockWatchlistIndexData: WatchlistIndexItem[] = [
  {
    code: '000300.SH',
    name: '沪深300',
    market: '上海',
    publisher: '中证指数',
    price: 3856.23,
    changePercent: 0.22,
    addTime: '2024-01-15',
  },
  {
    code: '000852.SH',
    name: '中证1000',
    market: '上海',
    publisher: '中证指数',
    price: 6289.45,
    changePercent: 1.10,
    addTime: '2024-01-15',
  },
  {
    code: '399001.SZ',
    name: '深证成指',
    market: '深圳',
    publisher: '深交所',
    price: 12456.78,
    changePercent: -0.35,
    addTime: '2024-01-14',
  },
  {
    code: '000932.SH',
    name: '中证2000',
    market: '上海',
    publisher: '中证指数',
    price: 4523.67,
    changePercent: 0.85,
    addTime: '2024-01-14',
  },
  {
    code: '399006.SZ',
    name: '创业板指',
    market: '深圳',
    publisher: '深交所',
    price: 2345.89,
    changePercent: -0.52,
    addTime: '2024-01-13',
  },
];

export const mockWatchlistEtfData: WatchlistEtfItem[] = [
  {
    code: '510300.SH',
    name: '300ETF',
    exchange: 'SH',
    indexCode: '000300.SH',
    indexName: '沪深300',
    price: 4.125,
    changePercent: 0.24,
    addTime: '2024-01-15',
  },
  {
    code: '159919.SZ',
    name: '300ETF',
    exchange: 'SZ',
    indexCode: '000300.SH',
    indexName: '沪深300',
    price: 4.098,
    changePercent: 0.20,
    addTime: '2024-01-15',
  },
  {
    code: '510500.SH',
    name: '500ETF',
    exchange: 'SH',
    indexCode: '000905.SH',
    indexName: '中证500',
    price: 6.789,
    changePercent: 0.85,
    addTime: '2024-01-14',
  },
  {
    code: '159915.SZ',
    name: '创业板ETF',
    exchange: 'SZ',
    indexCode: '399006.SZ',
    indexName: '创业板指',
    price: 2.456,
    changePercent: -0.48,
    addTime: '2024-01-13',
  },
  {
    code: '512100.SH',
    name: '1000ETF',
    exchange: 'SH',
    indexCode: '000852.SH',
    indexName: '中证1000',
    price: 3.234,
    changePercent: 1.15,
    addTime: '2024-01-12',
  },
];

