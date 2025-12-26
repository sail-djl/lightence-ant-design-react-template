import { httpApi } from '@app/api/http.api';

// ==================== 期权合约信息 ====================
export interface OptBasic {
  ts_code: string;
  exchange: string;
  name: string;
  per_unit?: string;
  opt_code?: string;
  opt_type?: string;
  call_put?: string;
  exercise_type?: string;
  exercise_price?: number;
  s_month?: string;
  maturity_date?: string;
  list_price?: number;
  list_date?: string;
  delist_date?: string;
  last_edate?: string;
  last_ddate?: string;
  quote_unit?: string;
  min_price_chg?: string;
}

export interface OptBasicQuery {
  skip?: number;
  limit?: number;
  ts_code?: string;
  exchange?: string;
  list_date?: string;
  opt_code?: string;
  call_put?: string;
}

export const getOptBasicList = async (params: OptBasicQuery): Promise<{ data: OptBasic[]; count?: number }> => {
  const response = await httpApi.get<{ data: OptBasic[]; count?: number }>('option/opt_basic', { params });
  return response.data;
};

// ==================== 期权日线行情 ====================
export interface OptDaily {
  ts_code: string;
  trade_date: string;
  exchange?: string;
  pre_settle?: number;
  pre_close?: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  settle?: number;
  vol?: number;
  amount?: number;
  oi?: number;
}

export interface OptDailyQuery {
  skip?: number;
  limit?: number;
  ts_code?: string;
  trade_date?: string;
  start_date?: string;
  end_date?: string;
  exchange?: string;
}

export const getOptDailyList = async (params: OptDailyQuery): Promise<{ data: OptDaily[]; count?: number }> => {
  const response = await httpApi.get<{ data: OptDaily[]; count?: number }>('option/opt_daily', { params });
  return response.data;
};

// ==================== 同步数据接口 ====================
export interface OptionSyncPayload {
  start_date?: string;
  end_date?: string;
  exchange?: string;
  ts_code?: string;
  opt_code?: string;
  call_put?: string;
  list_date?: string;
}

export const syncOptionData = async (
  type: string,
  payload: OptionSyncPayload
): Promise<{ message: string; success: number; failed: number }> => {
  try {
    const typeMap: Record<string, string> = {
      opt_basic: 'opt_basic',
      opt_daily: 'opt_daily',
    };
    const backendType = typeMap[type] || type;
    const response = await httpApi.post<{ message: string; success: number; failed: number }>(
      `option/${backendType}/sync`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to sync ${type}:`, error);
    throw error;
  }
};

