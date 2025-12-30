import { httpApi } from '../http.api';

// ==================== 可转债基本信息 ====================
export interface CbBasic {
  ts_code: string;
  bond_full_name?: string;
  bond_short_name?: string;
  cb_code?: string;
  stk_code?: string;
  stk_short_name?: string;
  maturity?: number;
  par?: number;
  issue_price?: number;
  issue_size?: number;
  remain_size?: number;
  value_date?: string;
  maturity_date?: string;
  rate_type?: string;
  coupon_rate?: number;
  add_rate?: number;
  pay_per_year?: number;
  list_date?: string;
  delist_date?: string;
  exchange?: string;
  conv_start_date?: string;
  conv_end_date?: string;
  conv_stop_date?: string;
  first_conv_price?: number;
  conv_price?: number;
  rate_clause?: string;
  put_clause?: string;
  maturity_put_price?: string;
  call_clause?: string;
  reset_clause?: string;
  conv_clause?: string;
  guarantor?: string;
  guarantee_type?: string;
  issue_rating?: string;
  newest_rating?: string;
  rating_comp?: string;
}

export interface CbBasicQuery {
  skip?: number;
  limit?: number;
  ts_code?: string;
  list_date?: string;
  exchange?: string;
}

export const getCbBasicList = async (params: CbBasicQuery): Promise<{ data: CbBasic[]; count?: number }> => {
  const response = await httpApi.get<{ data: CbBasic[]; count?: number }>('bond/cb_basic', { params });
  return response.data;
};

// ==================== 可转债发行 ====================
export interface CbIssue {
  ts_code: string;
  ann_date: string;
  res_ann_date?: string;
  plan_issue_size?: number;
  issue_size?: number;
  issue_price?: number;
  issue_type?: string;
  issue_cost?: number;
  onl_code?: string;
  onl_name?: string;
  onl_date?: string;
  onl_size?: number;
  onl_pch_vol?: number;
  onl_pch_num?: number;
  onl_pch_excess?: number;
  onl_winning_rate?: number;
  shd_ration_code?: string;
  shd_ration_name?: string;
  shd_ration_date?: string;
  shd_ration_record_date?: string;
  shd_ration_pay_date?: string;
  shd_ration_price?: number;
  shd_ration_ratio?: number;
  shd_ration_size?: number;
  shd_ration_vol?: number;
  shd_ration_num?: number;
  shd_ration_excess?: number;
  offl_size?: number;
  offl_deposit?: number;
  offl_pch_vol?: number;
  offl_pch_num?: number;
  offl_pch_excess?: number;
  offl_winning_rate?: number;
  lead_underwriter?: string;
  lead_underwriter_vol?: number;
}

export interface CbIssueQuery {
  skip?: number;
  limit?: number;
  ts_code?: string;
  ann_date?: string;
  start_date?: string;
  end_date?: string;
}

export const getCbIssueList = async (params: CbIssueQuery): Promise<{ data: CbIssue[]; count?: number }> => {
  const response = await httpApi.get<{ data: CbIssue[]; count?: number }>('bond/cb_issue', { params });
  return response.data;
};

// ==================== 可转债行情 ====================
export interface CbDaily {
  ts_code: string;
  trade_date: string;
  pre_close?: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  change?: number;
  pct_chg?: number;
  vol?: number;
  amount?: number;
  bond_value?: number;
  bond_over_rate?: number;
  cb_value?: number;
  cb_over_rate?: number;
}

export interface CbDailyQuery {
  skip?: number;
  limit?: number;
  ts_code?: string;
  trade_date?: string;
  start_date?: string;
  end_date?: string;
}

export const getCbDailyList = async (params: CbDailyQuery): Promise<{ data: CbDaily[]; count?: number }> => {
  const response = await httpApi.get<{ data: CbDaily[]; count?: number }>('bond/cb_daily', { params });
  return response.data;
};

// ==================== 同步数据接口 ====================
export interface BondSyncPayload {
  start_date?: string;
  end_date?: string;
  ts_code?: string;
  list_date?: string;
  exchange?: string;
  ann_date?: string;
}

export const syncBondData = async (
  type: string,
  payload: BondSyncPayload
): Promise<{ message: string; success: number; failed: number }> => {
  try {
    const typeMap: Record<string, string> = {
      cb_basic: 'cb_basic',
      cb_issue: 'cb_issue',
      cb_daily: 'cb_daily',
    };
    const backendType = typeMap[type] || type;
    const response = await httpApi.post<{ message: string; success: number; failed: number }>(
      `bond/${backendType}/sync`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to sync ${type}:`, error);
    throw error;
  }
};

