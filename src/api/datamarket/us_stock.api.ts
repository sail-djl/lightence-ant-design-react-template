import { httpApi } from '../http.api';

// ==================== 美股列表 ====================
export interface UsBasic {
  ts_code: string;
  name?: string;
  enname?: string;
  classify?: string;
  list_date?: string;
  delist_date?: string;
}

export interface UsBasicQuery {
  skip?: number;
  limit?: number;
  ts_code?: string;
  classify?: string;
}

export const getUsBasicList = async (params: UsBasicQuery): Promise<{ data: UsBasic[]; count?: number }> => {
  const response = await httpApi.get<{ data: UsBasic[]; count?: number }>('us_stock/us_basic', { params });
  return response.data;
};

// ==================== 美股日线行情 ====================
export interface UsDaily {
  ts_code: string;
  trade_date: string;
  close?: number;
  open?: number;
  high?: number;
  low?: number;
  pre_close?: number;
  change?: number;
  pct_change?: number;
  vol?: number;
  amount?: number;
  vwap?: number;
  turnover_ratio?: number;
  total_mv?: number;
  pe?: number;
  pb?: number;
}

export interface UsDailyQuery {
  skip?: number;
  limit?: number;
  ts_code?: string;
  trade_date?: string;
  start_date?: string;
  end_date?: string;
}

export const getUsDailyList = async (params: UsDailyQuery): Promise<{ data: UsDaily[]; count?: number }> => {
  const response = await httpApi.get<{ data: UsDaily[]; count?: number }>('us_stock/us_daily', { params });
  return response.data;
};

// ==================== 同步数据接口 ====================
export interface UsStockSyncPayload {
  start_date?: string;
  end_date?: string;
  ts_code?: string;
  classify?: string;
}

export const syncUsStockData = async (
  type: string,
  payload: UsStockSyncPayload
): Promise<{ message: string; success: number; failed: number }> => {
  try {
    const typeMap: Record<string, string> = {
      us_basic: 'us_basic',
      us_daily: 'us_daily',
    };
    const backendType = typeMap[type] || type;
    const response = await httpApi.post<{ message: string; success: number; failed: number }>(
      `us_stock/${backendType}/sync`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to sync ${type}:`, error);
    throw error;
  }
};

