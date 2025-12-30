import { httpApi } from '../http.api';

// ==================== 期货合约信息 ====================
export interface FutBasic {
  ts_code: string;
  symbol: string;
  exchange: string;
  name: string;
  fut_code?: string;
  multiplier?: number;
  trade_unit?: string;
  per_unit?: number;
  quote_unit?: string;
  quote_unit_desc?: string;
  d_mode_desc?: string;
  list_date?: string;
  delist_date?: string;
  d_month?: string;
  last_ddate?: string;
  trade_time_desc?: string;
}

export interface FutBasicQuery {
  skip?: number;
  limit?: number;
  exchange?: string;
  fut_type?: string;
  fut_code?: string;
  list_date?: string;
}

export const getFutBasicList = async (params: FutBasicQuery): Promise<{ data: FutBasic[]; count?: number }> => {
  const response = await httpApi.get<{ data: FutBasic[]; count?: number }>('futures/fut_basic', { params });
  return response.data;
};

// ==================== 交易日历 ====================
export interface TradeCal {
  exchange: string;
  cal_date: string;
  is_open: number;
  pretrade_date?: string;
}

export interface TradeCalQuery {
  skip?: number;
  limit?: number;
  exchange?: string;
  cal_date?: string;
  start_date?: string;
  end_date?: string;
  is_open?: number;
}

export const getTradeCalList = async (params: TradeCalQuery): Promise<{ data: TradeCal[]; count?: number }> => {
  const response = await httpApi.get<{ data: TradeCal[]; count?: number }>('futures/trade_cal', { params });
  return response.data;
};

// ==================== 期货日线行情 ====================
export interface FutDaily {
  ts_code: string;
  trade_date: string;
  pre_close?: number;
  pre_settle?: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  settle?: number;
  change1?: number;
  change2?: number;
  vol?: number;
  amount?: number;
  oi?: number;
  oi_chg?: number;
  delv_settle?: number;
}

export interface FutDailyQuery {
  skip?: number;
  limit?: number;
  ts_code?: string;
  trade_date?: string;
  exchange?: string;
  start_date?: string;
  end_date?: string;
}

export const getFutDailyList = async (params: FutDailyQuery): Promise<{ data: FutDaily[]; count?: number }> => {
  const response = await httpApi.get<{ data: FutDaily[]; count?: number }>('futures/fut_daily', { params });
  return response.data;
};

// ==================== 期货周/月线行情 ====================
export interface FutWeeklyMonthly {
  ts_code: string;
  trade_date: string;
  freq: string;
  end_date?: string;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  pre_close?: number;
  settle?: number;
  pre_settle?: number;
  change1?: number;
  change2?: number;
  vol?: number;
  amount?: number;
  oi?: number;
  oi_chg?: number;
  exchange?: string;
}

export interface FutWeeklyMonthlyQuery {
  skip?: number;
  limit?: number;
  ts_code?: string;
  trade_date?: string;
  freq?: string;
  exchange?: string;
  start_date?: string;
  end_date?: string;
}

export const getFutWeeklyMonthlyList = async (
  params: FutWeeklyMonthlyQuery
): Promise<{ data: FutWeeklyMonthly[]; count?: number }> => {
  const response = await httpApi.get<{ data: FutWeeklyMonthly[]; count?: number }>('futures/fut_weekly_monthly', {
    params,
  });
  return response.data;
};

// ==================== 通用响应接口 ====================
export interface FuturesResponse<T> {
  data: T[];
  count?: number;
}

// ==================== 同步数据接口 ====================
export interface FuturesSyncPayload {
  start_date?: string;
  end_date?: string;
  exchange?: string;
  fut_code?: string;
  ts_code?: string;
  freq?: string;
}

export const syncFuturesData = async (
  type: string,
  payload: FuturesSyncPayload
): Promise<{ message: string; success: number; failed: number }> => {
  try {
    // 映射前端类型到后端路径
    const typeMap: Record<string, string> = {
      fut_basic: 'fut_basic',
      trade_cal: 'trade_cal',
      fut_daily: 'fut_daily',
      fut_weekly_monthly: 'fut_weekly_monthly',
    };
    const backendType = typeMap[type] || type;
    const response = await httpApi.post<{ message: string; success: number; failed: number }>(
      `futures/${backendType}/sync`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to sync ${type}:`, error);
    throw error;
  }
};

