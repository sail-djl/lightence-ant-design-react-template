import { httpApi } from '@app/api/http.api';

export interface EtfBasic {
  ts_code: string;
  csname: string;
  extname?: string;
  cname?: string;
  index_code?: string;
  index_name?: string;
  setup_date?: string;
  list_date?: string;
  list_status?: 'L' | 'D' | 'P';
  exchange?: 'SH' | 'SZ';
  mgr_name?: string;
  custod_name?: string;
  mgt_fee?: number;
  etf_type?: string;
  update_time?: string;
  create_time?: string;
}

export interface EtfBasicResponse {
  data: EtfBasic[];
  count: number;
}

export interface EtfQuery {
  skip?: number;
  limit?: number;
  keyword?: string;
  exchange?: 'SH' | 'SZ';
  list_status?: 'L' | 'D' | 'P';
  etf_type?: string;
  mgr_name?: string;
}

export const getEtfBasicList = async (params: EtfQuery = {}): Promise<EtfBasicResponse> => {
  try {
    const response = await httpApi.get<EtfBasicResponse>('etf/basic', { params });
    return response.data;
  } catch {
    return { data: [], count: 0 };
  }
};

