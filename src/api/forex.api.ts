import { httpApi } from '@app/api/http.api';

// ==================== 外汇基础信息 ====================
export interface FxObasic {
  ts_code: string;
  name: string;
  classify?: string;
  exchange?: string;
  min_unit?: number;
  max_unit?: number;
  pip?: number;
  pip_cost?: number;
  traget_spread?: number;
  min_stop_distance?: number;
  trading_hours?: string;
  break_time?: string;
}

export interface FxObasicQuery {
  skip?: number;
  limit?: number;
  ts_code?: string;
  exchange?: string;
  classify?: string;
}

export const getFxObasicList = async (params: FxObasicQuery): Promise<{ data: FxObasic[]; count?: number }> => {
  const response = await httpApi.get<{ data: FxObasic[]; count?: number }>('forex/fx_obasic', { params });
  return response.data;
};

// ==================== 外汇日线行情 ====================
export interface FxDaily {
  ts_code: string;
  trade_date: string;
  bid_open?: number;
  bid_close?: number;
  bid_high?: number;
  bid_low?: number;
  ask_open?: number;
  ask_close?: number;
  ask_high?: number;
  ask_low?: number;
  tick_qty?: number;
  exchange?: string;
}

export interface FxDailyQuery {
  skip?: number;
  limit?: number;
  ts_code?: string;
  trade_date?: string;
  start_date?: string;
  end_date?: string;
  exchange?: string;
}

export const getFxDailyList = async (params: FxDailyQuery): Promise<{ data: FxDaily[]; count?: number }> => {
  const response = await httpApi.get<{ data: FxDaily[]; count?: number }>('forex/fx_daily', { params });
  return response.data;
};

// ==================== 同步数据接口 ====================
export interface ForexSyncPayload {
  start_date?: string;
  end_date?: string;
  ts_code?: string;
  exchange?: string;
  classify?: string;
}

export const syncForexData = async (
  type: string,
  payload: ForexSyncPayload
): Promise<{ message: string; success: number; failed: number }> => {
  try {
    const typeMap: Record<string, string> = {
      fx_obasic: 'fx_obasic',
      fx_daily: 'fx_daily',
    };
    const backendType = typeMap[type] || type;
    const response = await httpApi.post<{ message: string; success: number; failed: number }>(
      `forex/${backendType}/sync`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to sync ${type}:`, error);
    throw error;
  }
};

