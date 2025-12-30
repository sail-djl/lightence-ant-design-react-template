import { httpApi } from '../http.api';

export interface FundBasic {
  ts_code: string;
  name: string;
  management?: string;
  custodian?: string;
  fund_type?: string;
  invest_type?: string;
  type?: string;
  found_date?: string;
  list_date?: string;
  status?: 'D' | 'I' | 'L';
  market?: 'E' | 'O';
  m_fee?: number;
  c_fee?: number;
  update_time?: string;
  create_time?: string;
}

export interface FundBasicResponse {
  data: FundBasic[];
  count: number;
}

export interface FundQuery {
  skip?: number;
  limit?: number;
  keyword?: string;
  market?: 'E' | 'O';
  status?: 'D' | 'I' | 'L';
  fund_type?: string;
  management?: string;
}

export const getFundBasicList = async (params: FundQuery = {}): Promise<FundBasicResponse> => {
  try {
    const response = await httpApi.get<FundBasicResponse>('fund/basic', { params });
    return response.data;
  } catch {
    return { data: [], count: 0 };
  }
};

export interface FundSyncPayload {
  start_date?: string;
  end_date?: string;
  keyword?: string;
  market?: 'E' | 'O';
  status?: 'D' | 'I' | 'L';
  fund_type?: string;
  management?: string;
}

export interface FundFactor {
  ts_code: string;
  trade_date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  pre_close: number;
  change: number;
  pct_change: number;
  vol: number;
  amount: number;
  turnover_rate?: number;
  pe?: number;
  pb?: number;
  total_mv?: number;
  circ_mv?: number;
}

export interface FundFactorResponse {
  data: FundFactor[];
}

export const getFundFactorList = async (
  ts_code: string,
  start_date?: string,
  end_date?: string,
): Promise<FundFactorResponse> => {
  try {
    const response = await httpApi.get<FundFactorResponse>('fund/factor', {
      params: { ts_code, start_date, end_date },
    });
    return response.data;
  } catch {
    return { data: [] };
  }
};

export const syncFundNav = async (payload: FundSyncPayload): Promise<void> => {
  await httpApi.post('fund/nav/sync', payload);
};

export interface FundFactorSyncPayload {
  ts_code?: string;
  start_date?: string;
  end_date?: string;
}

export const syncFundFactor = async (payload: FundFactorSyncPayload): Promise<void> => {
  await httpApi.post('fund/factor/sync', payload);
};
