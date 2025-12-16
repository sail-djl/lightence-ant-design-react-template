import { httpApi } from '@app/api/http.api';

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

