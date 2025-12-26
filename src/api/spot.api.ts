import { httpApi } from '@app/api/http.api';

// ==================== 黄金现货基础信息 ====================
export interface SgeBasic {
  ts_code: string;
  ts_name: string;
  trade_type?: string;
  t_unit?: number;
  p_unit?: number;
  min_change?: number;
  price_limit?: number;
  min_vol?: number;
  max_vol?: number;
  trade_mode?: string;
  margin_rate?: number;
  liq_rate?: number;
  trade_time?: string;
  list_date?: string;
}

export interface SgeBasicQuery {
  skip?: number;
  limit?: number;
  ts_code?: string;
}

export const getSgeBasicList = async (params: SgeBasicQuery): Promise<{ data: SgeBasic[]; count?: number }> => {
  const response = await httpApi.get<{ data: SgeBasic[]; count?: number }>('spot/sge_basic', { params });
  return response.data;
};

// ==================== 上海黄金现货日行情 ====================
export interface SgeDaily {
  ts_code: string;
  trade_date: string;
  close?: number;
  open?: number;
  high?: number;
  low?: number;
  price_avg?: number;
  change?: number;
  pct_change?: number;
  vol?: number;
  amount?: number;
  oi?: number;
  settle_vol?: number;
  settle_dire?: string;
}

export interface SgeDailyQuery {
  skip?: number;
  limit?: number;
  ts_code?: string;
  trade_date?: string;
  start_date?: string;
  end_date?: string;
}

export const getSgeDailyList = async (params: SgeDailyQuery): Promise<{ data: SgeDaily[]; count?: number }> => {
  const response = await httpApi.get<{ data: SgeDaily[]; count?: number }>('spot/sge_daily', { params });
  return response.data;
};

// ==================== 通用响应接口 ====================
export interface SpotResponse<T> {
  data: T[];
  count?: number;
}

// ==================== 同步数据接口 ====================
export interface SpotSyncPayload {
  start_date?: string;
  end_date?: string;
  ts_code?: string;
}

export const syncSpotData = async (
  type: string,
  payload: SpotSyncPayload
): Promise<{ message: string; success: number; failed: number }> => {
  try {
    // 映射前端类型到后端路径
    const typeMap: Record<string, string> = {
      sge_basic: 'sge_basic',
      sge_daily: 'sge_daily',
    };
    const backendType = typeMap[type] || type;
    const response = await httpApi.post<{ message: string; success: number; failed: number }>(
      `spot/${backendType}/sync`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to sync ${type}:`, error);
    throw error;
  }
};

