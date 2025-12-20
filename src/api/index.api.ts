import { httpApi } from '@app/api/http.api';

// ==================== 指数基础信息 ====================
export interface IndexBasic {
  ts_code: string;
  name: string;
  fullname?: string;
  market?: string;
  publisher?: string;
  index_type?: string;
  category?: string;
  base_date?: string;
  base_point?: number;
  list_date?: string;
  exp_date?: string;
  weight_rule?: string;
  desc_text?: string;
  update_time?: string;
  create_time?: string;
}

export interface IndexBasicResponse {
  data: IndexBasic[];
  count: number;
}

export interface IndexBasicQuery {
  skip?: number;
  limit?: number;
  keyword?: string;
  market?: string;
  publisher?: string;
  category?: string;
}

export const getIndexBasicList = async (params: IndexBasicQuery = {}): Promise<IndexBasicResponse> => {
  try {
    const response = await httpApi.get<IndexBasicResponse>('index/basic', { params });
    return response.data;
  } catch {
    return { data: [], count: 0 };
  }
};

export interface IndexBasicSyncPayload {
  keyword?: string;
  market?: string;
}

export const syncIndexBasic = async (payload: IndexBasicSyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  const response = await httpApi.post<{ message: string; success: number; failed: number }>('index/basic/sync', payload);
  return response.data;
};

// ==================== 指数日线行情 ====================
export interface IndexDaily {
  ts_code: string;
  trade_date: string;
  close?: number;
  open?: number;
  high?: number;
  low?: number;
  pre_close?: number;
  change?: number;
  pct_chg?: number;
  vol?: number;
  amount?: number;
}

export interface IndexDailyResponse {
  data: IndexDaily[];
}

export interface IndexDailyQuery {
  ts_code?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
}

export const getIndexDailyList = async (params: IndexDailyQuery = {}): Promise<IndexDailyResponse> => {
  try {
    const response = await httpApi.get<IndexDailyResponse>('index/daily', { params });
    return response.data;
  } catch {
    return { data: [] };
  }
};

export interface IndexDailySyncPayload {
  ts_code?: string;
  start_date?: string;
  end_date?: string;
}

export const syncIndexDaily = async (payload: IndexDailySyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  const response = await httpApi.post<{ message: string; success: number; failed: number }>('index/daily/sync', payload);
  return response.data;
};

// ==================== 大盘指数每日指标 ====================
export interface IndexDailybasic {
  ts_code: string;
  trade_date: string;
  total_mv?: number;
  float_mv?: number;
  total_share?: number;
  float_share?: number;
  free_share?: number;
  turnover_rate?: number;
  turnover_rate_f?: number;
  pe?: number;
  pe_ttm?: number;
  pb?: number;
}

export interface IndexDailybasicResponse {
  data: IndexDailybasic[];
}

export interface IndexDailybasicQuery {
  ts_code?: string;
  trade_date?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
}

export const getIndexDailybasicList = async (params: IndexDailybasicQuery = {}): Promise<IndexDailybasicResponse> => {
  try {
    const response = await httpApi.get<IndexDailybasicResponse>('index/dailybasic', { params });
    return response.data;
  } catch {
    return { data: [] };
  }
};

export interface IndexDailybasicSyncPayload {
  ts_code?: string;
  trade_date?: string;
  start_date?: string;
  end_date?: string;
}

export const syncIndexDailybasic = async (payload: IndexDailybasicSyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  const response = await httpApi.post<{ message: string; success: number; failed: number }>('index/dailybasic/sync', payload);
  return response.data;
};

// ==================== 指数周线行情 ====================
export interface IndexWeekly {
  ts_code: string;
  trade_date: string;
  close?: number;
  open?: number;
  high?: number;
  low?: number;
  pre_close?: number;
  change?: number;
  pct_chg?: number;
  vol?: number;
  amount?: number;
}

export interface IndexWeeklyResponse {
  data: IndexWeekly[];
}

export interface IndexWeeklyQuery {
  ts_code?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
}

export const getIndexWeeklyList = async (params: IndexWeeklyQuery = {}): Promise<IndexWeeklyResponse> => {
  try {
    const response = await httpApi.get<IndexWeeklyResponse>('index/weekly', { params });
    return response.data;
  } catch {
    return { data: [] };
  }
};

export interface IndexWeeklySyncPayload {
  ts_code?: string;
  start_date?: string;
  end_date?: string;
}

export const syncIndexWeekly = async (payload: IndexWeeklySyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  const response = await httpApi.post<{ message: string; success: number; failed: number }>('index/weekly/sync', payload);
  return response.data;
};

// ==================== 申万行业分类 ====================
export interface IndexClassify {
  index_code: string;
  industry_code: string;
  level1?: string;
  level2?: string;
  level3?: string;
  type?: string;
  is_pub?: string;
  reason?: string;
  count?: number;
  src?: string;
}

export interface IndexClassifyResponse {
  data: IndexClassify[];
  count: number;
}

export interface IndexClassifyQuery {
  skip?: number;
  limit?: number;
  level?: string;
  src?: string;
  keyword?: string;
}

export const getIndexClassifyList = async (params: IndexClassifyQuery = {}): Promise<IndexClassifyResponse> => {
  try {
    const response = await httpApi.get<IndexClassifyResponse>('index/classify', { params });
    return response.data;
  } catch {
    return { data: [], count: 0 };
  }
};

export interface IndexClassifySyncPayload {
  level?: string;
  src?: string;
}

export const syncIndexClassify = async (payload: IndexClassifySyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  const response = await httpApi.post<{ message: string; success: number; failed: number }>('index/classify/sync', payload);
  return response.data;
};

// ==================== 申万行业成分构成 ====================
export interface IndexMember {
  l1_code: string;
  l1_name?: string;
  l2_code: string;
  l2_name?: string;
  l3_code: string;
  l3_name?: string;
  ts_code: string;
  name?: string;
  in_date?: string;
  out_date?: string;
  is_new?: string;
}

export interface IndexMemberResponse {
  data: IndexMember[];
  count: number;
}

export interface IndexMemberQuery {
  skip?: number;
  limit?: number;
  l1_code?: string;
  l2_code?: string;
  l3_code?: string;
  ts_code?: string;
  is_new?: string;
}

export const getIndexMemberList = async (params: IndexMemberQuery = {}): Promise<IndexMemberResponse> => {
  try {
    const response = await httpApi.get<IndexMemberResponse>('index/member', { params });
    return response.data;
  } catch {
    return { data: [], count: 0 };
  }
};

export interface IndexMemberSyncPayload {
  l1_code?: string;
  l2_code?: string;
  l3_code?: string;
  ts_code?: string;
  is_new?: string;
}

export const syncIndexMember = async (payload: IndexMemberSyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  const response = await httpApi.post<{ message: string; success: number; failed: number }>('index/member/sync', payload);
  return response.data;
};

// ==================== 申万行业日线行情 ====================
export interface SwDaily {
  ts_code: string;
  trade_date: string;
  name?: string;
  open?: number;
  low?: number;
  high?: number;
  close?: number;
  change?: number;
  pct_change?: number;
  vol?: number;
  amount?: number;
  pe?: number;
  pb?: number;
  float_mv?: number;
  total_mv?: number;
}

export interface SwDailyResponse {
  data: SwDaily[];
}

export interface SwDailyQuery {
  ts_code?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
}

export const getSwDailyList = async (params: SwDailyQuery = {}): Promise<SwDailyResponse> => {
  try {
    const response = await httpApi.get<SwDailyResponse>('index/sw/daily', { params });
    return response.data;
  } catch {
    return { data: [] };
  }
};

export interface SwDailySyncPayload {
  ts_code?: string;
  start_date?: string;
  end_date?: string;
}

export const syncSwDaily = async (payload: SwDailySyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  const response = await httpApi.post<{ message: string; success: number; failed: number }>('index/sw/daily/sync', payload);
  return response.data;
};

// ==================== 国际指数 ====================
export interface IndexGlobal {
  ts_code: string;
  trade_date: string;
  open?: number;
  close?: number;
  high?: number;
  low?: number;
  pre_close?: number;
  change?: number;
  pct_chg?: number;
  swing?: number;
  vol?: number;
  amount?: number;
}

export interface IndexGlobalResponse {
  data: IndexGlobal[];
}

export interface IndexGlobalQuery {
  ts_code?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
}

export const getIndexGlobalList = async (params: IndexGlobalQuery = {}): Promise<IndexGlobalResponse> => {
  try {
    const response = await httpApi.get<IndexGlobalResponse>('index/global', { params });
    return response.data;
  } catch {
    return { data: [] };
  }
};

export interface IndexGlobalSyncPayload {
  ts_code?: string;
  start_date?: string;
  end_date?: string;
}

export const syncIndexGlobal = async (payload: IndexGlobalSyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  const response = await httpApi.post<{ message: string; success: number; failed: number }>('index/global/sync', payload);
  return response.data;
};

// ==================== 指数技术因子 ====================
export interface IndexFactor {
  ts_code: string;
  trade_date: string;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  pre_close?: number;
  change?: number;
  pct_change?: number;
  vol?: number;
  amount?: number;
  macd_bfq?: number;
  macd_dif_bfq?: number;
  macd_dea_bfq?: number;
  rsi_bfq_6?: number;
  rsi_bfq_12?: number;
  rsi_bfq_24?: number;
  kdj_bfq?: number;
  kdj_k_bfq?: number;
  kdj_d_bfq?: number;
  ma_bfq_5?: number;
  ma_bfq_10?: number;
  ma_bfq_20?: number;
  ma_bfq_30?: number;
  ma_bfq_60?: number;
  ma_bfq_90?: number;
  ma_bfq_250?: number;
  ema_bfq_5?: number;
  ema_bfq_10?: number;
  ema_bfq_20?: number;
  ema_bfq_30?: number;
  ema_bfq_60?: number;
  ema_bfq_90?: number;
  ema_bfq_250?: number;
  boll_upper_bfq?: number;
  boll_mid_bfq?: number;
  boll_lower_bfq?: number;
}

export interface IndexFactorResponse {
  data: IndexFactor[];
}

export interface IndexFactorQuery {
  ts_code: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
}

export const getIndexFactorList = async (params: IndexFactorQuery): Promise<IndexFactorResponse> => {
  try {
    const response = await httpApi.get<IndexFactorResponse>('index/factor', { params });
    return response.data;
  } catch {
    return { data: [] };
  }
};

export interface IndexFactorSyncPayload {
  ts_code?: string;
  start_date?: string;
  end_date?: string;
}

export const syncIndexFactor = async (payload: IndexFactorSyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  const response = await httpApi.post<{ message: string; success: number; failed: number }>('index/factor/sync', payload);
  return response.data;
};

