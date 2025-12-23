import { httpApi } from '@app/api/http.api';

// ==================== 股票基础信息 ====================
export interface StockBasic {
  ts_code: string;
  symbol: string;
  name: string;
  area: string;
  industry: string;
  fullname?: string;
  enname?: string;
  cnspell?: string;
  market: string;
  exchange?: string;
  curr_type?: string;
  list_status: string;
  list_date: string;
  delist_date?: string;
  is_hs?: string;
  act_name?: string;
  act_ent_type?: string;
}

export interface StockBasicResponse {
  data: StockBasic[];
  count?: number;
}

export interface StockBasicQuery {
  skip?: number;
  limit?: number;
  keyword?: string;
  ts_code?: string | string[];
  name?: string;
  market?: string;
  exchange?: string;
  list_status?: string;
  is_hs?: string;
}

// Mock数据
const mockStockBasicData: StockBasic[] = [
  {
    ts_code: '000001.SZ',
    symbol: '000001',
    name: '平安银行',
    area: '深圳',
    industry: '银行',
    market: '主板',
    exchange: 'SZSE',
    list_status: 'L',
    list_date: '19910403',
    is_hs: 'S',
  },
  {
    ts_code: '000002.SZ',
    symbol: '000002',
    name: '万科A',
    area: '深圳',
    industry: '全国地产',
    market: '主板',
    exchange: 'SZSE',
    list_status: 'L',
    list_date: '19910129',
    is_hs: 'S',
  },
  {
    ts_code: '600000.SH',
    symbol: '600000',
    name: '浦发银行',
    area: '上海',
    industry: '银行',
    market: '主板',
    exchange: 'SSE',
    list_status: 'L',
    list_date: '19991110',
    is_hs: 'H',
  },
  {
    ts_code: '600036.SH',
    symbol: '600036',
    name: '招商银行',
    area: '深圳',
    industry: '银行',
    market: '主板',
    exchange: 'SSE',
    list_status: 'L',
    list_date: '20020409',
    is_hs: 'H',
  },
  {
    ts_code: '000858.SZ',
    symbol: '000858',
    name: '五粮液',
    area: '四川',
    industry: '白酒',
    market: '主板',
    exchange: 'SZSE',
    list_status: 'L',
    list_date: '19980427',
    is_hs: 'S',
  },
];

export const getStockBasicList = async (params: StockBasicQuery = {}): Promise<StockBasicResponse> => {
  try {
    // 处理 ts_code 数组，转换为逗号分隔字符串
    const queryParams: any = { ...params };
    if (queryParams.ts_code && Array.isArray(queryParams.ts_code)) {
      queryParams.ts_code = queryParams.ts_code.join(',');
    }
    
    const response = await httpApi.get<StockBasicResponse>('stock/basic', { params: queryParams });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stock basic list:', error);
    return { data: [], count: 0 };
  }
};

export interface StockBasicSyncPayload {
  keyword?: string;
  market?: string;
  exchange?: string;
  list_status?: string;
}

export const syncStockBasic = async (payload: StockBasicSyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  try {
    const response = await httpApi.post<{ message: string; success: number; failed: number }>('stock/basic/sync', payload);
    return response.data;
  } catch (error) {
    console.error('Failed to sync stock basic:', error);
    throw error;
  }
};

// ==================== 上市公司基本信息 ====================
export interface StockCompany {
  ts_code: string;
  com_name: string;
  com_id?: string;
  exchange: string;
  chairman?: string;
  manager?: string;
  secretary?: string;
  reg_capital?: number;
  setup_date?: string;
  province?: string;
  city?: string;
  introduction?: string;
  website?: string;
  email?: string;
  office?: string;
  employees?: number;
  main_business?: string;
  business_scope?: string;
}

export interface StockCompanyResponse {
  data: StockCompany[];
  count?: number;
}

export interface StockCompanyQuery {
  skip?: number;
  limit?: number;
  ts_code?: string;
  exchange?: string;
}

const mockStockCompanyData: StockCompany[] = [
  {
    ts_code: '000001.SZ',
    com_name: '平安银行股份有限公司',
    exchange: 'SZSE',
    chairman: '谢永林',
    manager: '胡跃飞',
    secretary: '周强',
    reg_capital: 1717041,
    setup_date: '19871222',
    province: '广东',
    city: '深圳',
    employees: 45678,
  },
];

export const getStockCompanyList = async (params: StockCompanyQuery = {}): Promise<StockCompanyResponse> => {
  try {
    const response = await httpApi.get<StockCompanyResponse>('stock/company', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stock company list:', error);
    return { data: [], count: 0 };
  }
};

export interface StockCompanySyncPayload {
  ts_code?: string;
  exchange?: string;
}

export const syncStockCompany = async (payload: StockCompanySyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  try {
    const response = await httpApi.post<{ message: string; success: number; failed: number }>('stock/company/sync', payload);
    return response.data;
  } catch (error) {
    console.error('Failed to sync stock company:', error);
    throw error;
  }
};

// ==================== IPO新股列表 ====================
export interface StockIpo {
  ts_code: string;
  sub_code?: string;
  name: string;
  ipo_date?: string;
  issue_date?: string;
  amount?: number;
  market_amount?: number;
  price?: number;
  pe?: number;
  limit_amount?: number;
  funds?: number;
  ballot?: number;
}

export interface StockIpoResponse {
  data: StockIpo[];
  count?: number;
}

export interface StockIpoQuery {
  skip?: number;
  limit?: number;
  ts_code?: string;
  start_date?: string;
  end_date?: string;
  ipo_start_date?: string;
  ipo_end_date?: string;
}

const mockStockIpoData: StockIpo[] = [
  {
    ts_code: '001234.SZ',
    name: '新股名称',
    ipo_date: '20240115',
    issue_price: 12.5,
    issue_amount: 5000,
    raise_amount: 62500,
    pe_ratio: 22.5,
  },
];

export const getStockIpoList = async (params: StockIpoQuery = {}): Promise<StockIpoResponse> => {
  try {
    const response = await httpApi.get<StockIpoResponse>('stock/ipo', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stock IPO list:', error);
    return { data: [], count: 0 };
  }
};

export interface StockIpoSyncPayload {
  start_date?: string;
  end_date?: string;
}

export const syncStockIpo = async (payload: StockIpoSyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  try {
    const response = await httpApi.post<{ message: string; success: number; failed: number }>('stock/ipo/sync', payload);
    return response.data;
  } catch (error) {
    console.error('Failed to sync stock IPO:', error);
    throw error;
  }
};

// ==================== A股日线行情 ====================
export interface StockDaily {
  ts_code: string;
  trade_date: string;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  pre_close?: number;
  change?: number;
  pct_chg?: number;
  vol?: number;
  amount?: number;
}

export interface StockDailyResponse {
  data: StockDaily[];
}

export interface StockDailyQuery {
  ts_code?: string;
  trade_date?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
}

const mockStockDailyData: StockDaily[] = [
  {
    ts_code: '000001.SZ',
    trade_date: '20240115',
    open: 12.5,
    high: 12.85,
    low: 12.45,
    close: 12.7,
    pre_close: 12.6,
    change: 0.1,
    pct_chg: 0.79,
    vol: 1234567,
    amount: 15678901,
  },
  {
    ts_code: '000001.SZ',
    trade_date: '20240114',
    open: 12.55,
    high: 12.65,
    low: 12.5,
    close: 12.6,
    pre_close: 12.58,
    change: 0.02,
    pct_chg: 0.16,
    vol: 1123456,
    amount: 14123456,
  },
];

export const getStockDailyList = async (params: StockDailyQuery = {}): Promise<StockDailyResponse> => {
  try {
    const response = await httpApi.get<StockDailyResponse>('stock/daily', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stock daily list:', error);
    return { data: [] };
  }
};

export interface StockDailySyncPayload {
  ts_code?: string;
  trade_date?: string;
  start_date?: string;
  end_date?: string;
}

export const syncStockDaily = async (payload: StockDailySyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  try {
    const response = await httpApi.post<{ message: string; success: number; failed: number }>('stock/daily/sync', payload);
    return response.data;
  } catch (error) {
    console.error('Failed to sync stock daily:', error);
    throw error;
  }
};

// ==================== 每日指标 ====================
export interface StockDailybasic {
  ts_code: string;
  trade_date: string;
  close?: number;
  turnover_rate?: number;
  turnover_rate_f?: number;
  volume_ratio?: number;
  pe?: number;
  pe_ttm?: number;
  pb?: number;
  ps?: number;
  ps_ttm?: number;
  dv_ratio?: number;
  dv_ttm?: number;
  total_share?: number;
  float_share?: number;
  free_share?: number;
  total_mv?: number;
  circ_mv?: number;
}

export interface StockDailybasicResponse {
  data: StockDailybasic[];
}

export interface StockDailybasicQuery {
  ts_code?: string;
  trade_date?: string;
  start_date?: string;
  end_date?: string;
  skip?: number;
  limit?: number;
}

export interface StockDailybasicResponse {
  data: StockDailybasic[];
  count?: number;
}

export const getStockDailybasicList = async (params: StockDailybasicQuery = {}): Promise<StockDailybasicResponse> => {
  try {
    const response = await httpApi.get<StockDailybasicResponse>('stock/dailybasic', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stock dailybasic list:', error);
    return { data: [], count: 0 };
  }
};

export interface StockDailybasicSyncPayload {
  ts_code?: string;
  trade_date?: string;
  start_date?: string;
  end_date?: string;
}

export const syncStockDailybasic = async (payload: StockDailybasicSyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  try {
    const response = await httpApi.post<{ message: string; success: number; failed: number }>('stock/dailybasic/sync', payload);
    return response.data;
  } catch (error) {
    console.error('Failed to sync stock dailybasic:', error);
    throw error;
  }
};

// ==================== 利润表 ====================
export interface StockIncome {
  ts_code: string;
  ann_date: string;
  f_ann_date?: string;
  end_date: string;
  report_type?: string;
  comp_type?: string;
  basic_eps?: number;
  diluted_eps?: number;
  total_revenue?: number;
  revenue?: number;
  operate_profit?: number;
  total_profit?: number;
  n_income?: number;
}

export interface StockIncomeResponse {
  data: StockIncome[];
  count?: number;
}

export interface StockIncomeQuery {
  skip?: number;
  limit?: number;
  ts_code?: string;
  period?: string;
  start_date?: string;
  end_date?: string;
  report_type?: string;
}

const mockStockIncomeData: StockIncome[] = [
  {
    ts_code: '000001.SZ',
    ann_date: '20240115',
    end_date: '20231231',
    report_type: '1',
    basic_eps: 1.85,
    diluted_eps: 1.85,
    total_revenue: 1234567,
    revenue: 1123456,
    operate_profit: 456789,
    total_profit: 445678,
    n_income: 345678,
  },
];

export const getStockIncomeList = async (params: StockIncomeQuery = {}): Promise<StockIncomeResponse> => {
  try {
    const response = await httpApi.get<StockIncomeResponse>('stock/income', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stock income list:', error);
    return { data: [], count: 0 };
  }
};

export interface StockIncomeSyncPayload {
  ts_code?: string;
  period?: string;
  start_date?: string;
  end_date?: string;
}

export const syncStockIncome = async (payload: StockIncomeSyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  try {
    const response = await httpApi.post<{ message: string; success: number; failed: number }>('stock/income/sync', payload);
    return response.data;
  } catch (error) {
    console.error('Failed to sync stock income:', error);
    throw error;
  }
};

// ==================== 资产负债表 ====================
export interface StockBalancesheet {
  ts_code: string;
  ann_date: string;
  f_ann_date?: string;
  end_date: string;
  report_type?: string;
  total_assets?: number;
  total_cur_assets?: number;
  total_nca?: number;
  total_liab?: number;
  total_cur_liab?: number;
  total_hldr_eqy_exc_min_int?: number;
}

export interface StockBalancesheetResponse {
  data: StockBalancesheet[];
  count?: number;
}

export interface StockBalancesheetQuery {
  skip?: number;
  limit?: number;
  ts_code?: string;
  period?: string;
  start_date?: string;
  end_date?: string;
}

const mockStockBalancesheetData: StockBalancesheet[] = [
  {
    ts_code: '000001.SZ',
    ann_date: '20240115',
    end_date: '20231231',
    report_type: '1',
    total_assets: 4567890,
    total_cur_assets: 2345678,
    total_nca: 2222212,
    total_liab: 3456789,
    total_cur_liab: 2123456,
    total_hldr_eqy_exc_min_int: 1111101,
  },
];

export const getStockBalancesheetList = async (params: StockBalancesheetQuery = {}): Promise<StockBalancesheetResponse> => {
  try {
    const response = await httpApi.get<StockBalancesheetResponse>('stock/balancesheet', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stock balancesheet list:', error);
    return { data: [], count: 0 };
  }
};

export interface StockBalancesheetSyncPayload {
  ts_code?: string;
  period?: string;
  start_date?: string;
  end_date?: string;
}

export const syncStockBalancesheet = async (payload: StockBalancesheetSyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  try {
    const response = await httpApi.post<{ message: string; success: number; failed: number }>('stock/balancesheet/sync', payload);
    return response.data;
  } catch (error) {
    console.error('Failed to sync stock balancesheet:', error);
    throw error;
  }
};

// ==================== 主营业务构成 ====================
export interface StockBusiness {
  ts_code: string;
  end_date: string;
  bz_item: string;
  type?: string;
  bz_sales?: number;
  bz_profit?: number;
  bz_cost?: number;
  curr_type?: string;
  update_flag?: string;
}

export interface StockBusinessResponse {
  data: StockBusiness[];
  count?: number;
}

export interface StockBusinessQuery {
  skip?: number;
  limit?: number;
  ts_code?: string;
  period?: string;
  start_date?: string;
  end_date?: string;
  type?: string;
}

export const getStockBusinessList = async (params: StockBusinessQuery = {}): Promise<StockBusinessResponse> => {
  try {
    const response = await httpApi.get<StockBusinessResponse>('stock/business', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stock business list:', error);
    return { data: [], count: 0 };
  }
};

export interface StockBusinessSyncPayload {
  ts_code?: string;
  period?: string;
  start_date?: string;
  end_date?: string;
  type?: string;
}

export const syncStockBusiness = async (payload: StockBusinessSyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  try {
    const response = await httpApi.post<{ message: string; success: number; failed: number }>('stock/business/sync', payload);
    return response.data;
  } catch (error) {
    console.error('Failed to sync stock business:', error);
    throw error;
  }
};

// ==================== 财报披露日期 ====================
export interface StockReport {
  ts_code: string;
  end_date: string;
  ann_date?: string;
  pre_date?: string;
  actual_date?: string;
  modify_date?: string;
}

export interface StockReportResponse {
  data: StockReport[];
  count?: number;
}

export interface StockReportQuery {
  skip?: number;
  limit?: number;
  ts_code?: string;
  end_date?: string;
  pre_date?: string;
  ann_date?: string;
  actual_date?: string;
}

export const getStockReportList = async (params: StockReportQuery = {}): Promise<StockReportResponse> => {
  try {
    const response = await httpApi.get<StockReportResponse>('stock/report', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stock report list:', error);
    return { data: [], count: 0 };
  }
};

export interface StockReportSyncPayload {
  ts_code?: string;
  end_date?: string;
}

export const syncStockReport = async (payload: StockReportSyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  try {
    const response = await httpApi.post<{ message: string; success: number; failed: number }>('stock/report/sync', payload);
    return response.data;
  } catch (error) {
    console.error('Failed to sync stock report:', error);
    throw error;
  }
};

// ==================== 股东增减持 ====================
export interface StockShareholder {
  ts_code: string;
  ann_date: string;
  holder_name: string;
  holder_type?: string;
  in_de?: string;
  change_vol?: number;
  change_ratio?: number;
  after_share?: number;
  after_ratio?: number;
  avg_price?: number;
  total_share?: number;
  begin_date?: string;
  close_date?: string;
}

export interface StockShareholderResponse {
  data: StockShareholder[];
  count?: number;
}

export interface StockShareholderQuery {
  skip?: number;
  limit?: number;
  ts_code?: string;
  start_date?: string;
  end_date?: string;
}

export const getStockShareholderList = async (params: StockShareholderQuery = {}): Promise<StockShareholderResponse> => {
  try {
    const response = await httpApi.get<StockShareholderResponse>('stock/shareholder', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stock shareholder list:', error);
    return { data: [], count: 0 };
  }
};

export interface StockShareholderSyncPayload {
  ts_code?: string;
  start_date?: string;
  end_date?: string;
}

export const syncStockShareholder = async (payload: StockShareholderSyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  try {
    const response = await httpApi.post<{ message: string; success: number; failed: number }>('stock/shareholder/sync', payload);
    return response.data;
  } catch (error) {
    console.error('Failed to sync stock shareholder:', error);
    throw error;
  }
};

// ==================== 股票回购 ====================
export interface StockRepurchase {
  ts_code: string;
  ann_date: string;
  end_date?: string;
  proc?: string;
  exp_date?: string;
  vol?: number;
  amount?: number;
  high_limit?: number;
  low_limit?: number;
}

export interface StockRepurchaseResponse {
  data: StockRepurchase[];
  count?: number;
}

export interface StockRepurchaseQuery {
  skip?: number;
  limit?: number;
  ts_code?: string;
  start_date?: string;
  end_date?: string;
}

export const getStockRepurchaseList = async (params: StockRepurchaseQuery = {}): Promise<StockRepurchaseResponse> => {
  try {
    const response = await httpApi.get<StockRepurchaseResponse>('stock/repurchase', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stock repurchase list:', error);
    return { data: [], count: 0 };
  }
};

export interface StockRepurchaseSyncPayload {
  ts_code?: string;
  start_date?: string;
  end_date?: string;
}

export const syncStockRepurchase = async (payload: StockRepurchaseSyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  try {
    const response = await httpApi.post<{ message: string; success: number; failed: number }>('stock/repurchase/sync', payload);
    return response.data;
  } catch (error) {
    console.error('Failed to sync stock repurchase:', error);
    throw error;
  }
};

// ==================== 券商每月荐股 ====================
export interface StockRecommend {
  month: string;
  broker: string;
  ts_code: string;
  name?: string;
}

export interface StockRecommendResponse {
  data: StockRecommend[];
  count?: number;
}

export interface StockRecommendQuery {
  skip?: number;
  limit?: number;
  month?: string;
  broker?: string;
  ts_code?: string;
}

export const getStockRecommendList = async (params: StockRecommendQuery = {}): Promise<StockRecommendResponse> => {
  try {
    const response = await httpApi.get<StockRecommendResponse>('stock/recommend', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stock recommend list:', error);
    return { data: [], count: 0 };
  }
};

export interface StockRecommendSyncPayload {
  month?: string;
  broker?: string;
  ts_code?: string;
}

export const syncStockRecommend = async (payload: StockRecommendSyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  try {
    const response = await httpApi.post<{ message: string; success: number; failed: number }>('stock/recommend/sync', payload);
    return response.data;
  } catch (error) {
    console.error('Failed to sync stock recommend:', error);
    throw error;
  }
};

// ==================== 沪深港股通持股明细 ====================
export interface StockHsgt {
  code?: string;
  trade_date: string;
  ts_code: string;
  name?: string;
  vol?: number;
  ratio?: number;
  exchange?: string;
}

export interface StockHsgtResponse {
  data: StockHsgt[];
  count?: number;
}

export interface StockHsgtQuery {
  skip?: number;
  limit?: number;
  ts_code?: string;
  trade_date?: string;
  start_date?: string;
  end_date?: string;
  exchange?: string;
}

export const getStockHsgtList = async (params: StockHsgtQuery = {}): Promise<StockHsgtResponse> => {
  try {
    const response = await httpApi.get<StockHsgtResponse>('stock/hsgt', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stock hsgt list:', error);
    return { data: [], count: 0 };
  }
};

export interface StockHsgtSyncPayload {
  ts_code?: string;
  trade_date?: string;
  start_date?: string;
  end_date?: string;
  exchange?: string;
}

export const syncStockHsgt = async (payload: StockHsgtSyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  try {
    const response = await httpApi.post<{ message: string; success: number; failed: number }>('stock/hsgt/sync', payload);
    return response.data;
  } catch (error) {
    console.error('Failed to sync stock hsgt:', error);
    throw error;
  }
};

// ==================== 融资融券交易汇总 ====================
export interface StockMargin {
  trade_date: string;
  exchange_id: string;
  rzye?: number;
  rzmre?: number;
  rzche?: number;
  rqye?: number;
  rqmcl?: number;
  rzrqye?: number;
  rqyl?: number;
}

export interface StockMarginResponse {
  data: StockMargin[];
  count?: number;
}

export interface StockMarginQuery {
  skip?: number;
  limit?: number;
  trade_date?: string;
  start_date?: string;
  end_date?: string;
  exchange_id?: string;
}

export const getStockMarginList = async (params: StockMarginQuery = {}): Promise<StockMarginResponse> => {
  try {
    const response = await httpApi.get<StockMarginResponse>('stock/margin', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stock margin list:', error);
    return { data: [], count: 0 };
  }
};

export interface StockMarginSyncPayload {
  trade_date?: string;
  start_date?: string;
  end_date?: string;
  exchange_id?: string;
}

export const syncStockMargin = async (payload: StockMarginSyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  try {
    const response = await httpApi.post<{ message: string; success: number; failed: number }>('stock/margin/sync', payload);
    return response.data;
  } catch (error) {
    console.error('Failed to sync stock margin:', error);
    throw error;
  }
};

export const getStockTransferList = async (params: any = {}): Promise<{ data: any[]; count?: number }> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { data: [], count: 0 };
};

export const syncStockTransfer = async (payload: any): Promise<{ message: string; success: number; failed: number }> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { message: '同步完成', success: 0, failed: 0 };
};

// ==================== 同花顺概念板块资金流向 ====================
export interface StockThsconcept {
  trade_date: string;
  code: string;
  name?: string;
  net_mf_amount?: number;
  net_mf_ratio?: number;
}

export interface StockThsconceptResponse {
  data: StockThsconcept[];
  count?: number;
}

export interface StockThsconceptQuery {
  skip?: number;
  limit?: number;
  trade_date?: string;
  start_date?: string;
  end_date?: string;
}

export const getStockThsconceptList = async (params: StockThsconceptQuery = {}): Promise<StockThsconceptResponse> => {
  try {
    const response = await httpApi.get<StockThsconceptResponse>('stock/thsconcept', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stock thsconcept list:', error);
    return { data: [], count: 0 };
  }
};

export interface StockThsconceptSyncPayload {
  ts_code?: string;
  trade_date?: string;
  start_date?: string;
  end_date?: string;
}

export const syncStockThsconcept = async (payload: StockThsconceptSyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  try {
    const response = await httpApi.post<{ message: string; success: number; failed: number }>('stock/thsconcept/sync', payload);
    return response.data;
  } catch (error) {
    console.error('Failed to sync stock thsconcept:', error);
    throw error;
  }
};

// ==================== 同花顺行业资金流向 ====================
export interface StockThsindustry {
  trade_date: string;
  code: string;
  name?: string;
  net_mf_amount?: number;
  net_mf_ratio?: number;
}

export interface StockThsindustryResponse {
  data: StockThsindustry[];
  count?: number;
}

export interface StockThsindustryQuery {
  skip?: number;
  limit?: number;
  trade_date?: string;
  start_date?: string;
  end_date?: string;
}

export const getStockThsindustryList = async (params: StockThsindustryQuery = {}): Promise<StockThsindustryResponse> => {
  try {
    const response = await httpApi.get<StockThsindustryResponse>('stock/thsindustry', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stock thsindustry list:', error);
    return { data: [], count: 0 };
  }
};

export interface StockThsindustrySyncPayload {
  ts_code?: string;
  trade_date?: string;
  start_date?: string;
  end_date?: string;
}

export const syncStockThsindustry = async (payload: StockThsindustrySyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  try {
    const response = await httpApi.post<{ message: string; success: number; failed: number }>('stock/thsindustry/sync', payload);
    return response.data;
  } catch (error) {
    console.error('Failed to sync stock thsindustry:', error);
    throw error;
  }
};

// ==================== 东财概念及行业板块资金流向 ====================
export interface StockDcconcept {
  trade_date: string;
  code: string;
  name?: string;
  net_amount?: number;
  net_amount_rate?: number;
}

export interface StockDcconceptResponse {
  data: StockDcconcept[];
  count?: number;
}

export interface StockDcconceptQuery {
  skip?: number;
  limit?: number;
  trade_date?: string;
  start_date?: string;
  end_date?: string;
}

export const getStockDcconceptList = async (params: StockDcconceptQuery = {}): Promise<StockDcconceptResponse> => {
  try {
    const response = await httpApi.get<StockDcconceptResponse>('stock/dcconcept', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stock dcconcept list:', error);
    return { data: [], count: 0 };
  }
};

export interface StockDcconceptSyncPayload {
  ts_code?: string;
  trade_date?: string;
  start_date?: string;
  end_date?: string;
  content_type?: string;
}

export const syncStockDcconcept = async (payload: StockDcconceptSyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  try {
    const response = await httpApi.post<{ message: string; success: number; failed: number }>('stock/dcconcept/sync', payload);
    return response.data;
  } catch (error) {
    console.error('Failed to sync stock dcconcept:', error);
    throw error;
  }
};

// ==================== 龙虎榜每日明细 ====================
export interface StockLhb {
  trade_date: string;
  ts_code: string;
  name?: string;
  close?: number;
  pct_change?: number;
  turnover_rate?: number;
  amount?: number;
  l_sell?: number;
  l_buy?: number;
  l_amount?: number;
  net_amount?: number;
  net_rate?: number;
  amount_rate?: number;
  float_values?: number;
  reason?: string;
}

export interface StockLhbResponse {
  data: StockLhb[];
  count?: number;
}

export interface StockLhbQuery {
  skip?: number;
  limit?: number;
  ts_code?: string;
  trade_date?: string;
  start_date?: string;
  end_date?: string;
}

export const getStockLhbList = async (params: StockLhbQuery = {}): Promise<StockLhbResponse> => {
  try {
    const response = await httpApi.get<StockLhbResponse>('stock/toplist', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stock lhb list:', error);
    return { data: [], count: 0 };
  }
};

export interface StockLhbSyncPayload {
  trade_date: string;  // 必填参数
  ts_code?: string;  // 可选参数
}

export const syncStockLhb = async (payload: StockLhbSyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  try {
    const response = await httpApi.post<{ message: string; success: number; failed: number }>('stock/toplist/sync', payload);
    return response.data;
  } catch (error) {
    console.error('Failed to sync stock lhb:', error);
    throw error;
  }
};

// ==================== 龙虎榜机构明细 ====================
export interface StockLhbinstitution {
  trade_date: string;
  ts_code: string;
  exalter: string;
  side: string;
  buy?: number;
  buy_rate?: number;
  sell?: number;
  sell_rate?: number;
  net_buy?: number;
  reason?: string;
}

export interface StockLhbinstitutionResponse {
  data: StockLhbinstitution[];
  count?: number;
}

export interface StockLhbinstitutionQuery {
  skip?: number;
  limit?: number;
  ts_code?: string;
  trade_date?: string;
  start_date?: string;
  end_date?: string;
}

export const getStockLhbinstitutionList = async (params: StockLhbinstitutionQuery = {}): Promise<StockLhbinstitutionResponse> => {
  try {
    const response = await httpApi.get<StockLhbinstitutionResponse>('stock/topinst', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stock lhbinstitution list:', error);
    return { data: [], count: 0 };
  }
};

export interface StockLhbinstitutionSyncPayload {
  trade_date: string;  // 必填参数
  ts_code?: string;  // 可选参数
}

export const syncStockLhbinstitution = async (payload: StockLhbinstitutionSyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  try {
    const response = await httpApi.post<{ message: string; success: number; failed: number }>('stock/topinst/sync', payload);
    return response.data;
  } catch (error) {
    console.error('Failed to sync stock lhbinstitution:', error);
    throw error;
  }
};

// ==================== 最强板块统计 ====================
export interface StockStrongest {
  ts_code: string;
  name?: string;
  trade_date: string;
  days?: number;
  up_stat?: string;
  cons_nums?: number;
  up_nums?: string;
  pct_chg?: number;
  rank?: string;
}

export interface StockStrongestResponse {
  data: StockStrongest[];
  count?: number;
}

export interface StockStrongestQuery {
  skip?: number;
  limit?: number;
  ts_code?: string;
  trade_date?: string;
  start_date?: string;
  end_date?: string;
}

export const getStockStrongestList = async (params: StockStrongestQuery = {}): Promise<StockStrongestResponse> => {
  try {
    const response = await httpApi.get<StockStrongestResponse>('stock/strongest', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stock strongest list:', error);
    return { data: [], count: 0 };
  }
};

export interface StockStrongestSyncPayload {
  ts_code?: string;
  trade_date?: string;
  start_date?: string;
  end_date?: string;
}

export const syncStockStrongest = async (payload: StockStrongestSyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  try {
    const response = await httpApi.post<{ message: string; success: number; failed: number }>('stock/strongest/sync', payload);
    return response.data;
  } catch (error) {
    console.error('Failed to sync stock strongest:', error);
    throw error;
  }
};

