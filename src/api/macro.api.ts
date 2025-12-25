import { httpApi } from '@app/api/http.api';

// ==================== Shibor利率数据 ====================
export interface Shibor {
  date: string;
  on_rate?: number;
  rate_1w?: number;
  rate_2w?: number;
  rate_1m?: number;
  rate_3m?: number;
  rate_6m?: number;
  rate_9m?: number;
  rate_1y?: number;
}

export interface ShiborQuery {
  skip?: number;
  limit?: number;
  date?: string;
  start_date?: string;
  end_date?: string;
}

// ==================== LPR贷款基础利率 ====================
export interface LPR {
  date: string;
  rate_1y?: number;
  rate_5y?: number;
}

export interface LPRQuery {
  skip?: number;
  limit?: number;
  date?: string;
  start_date?: string;
  end_date?: string;
}

// ==================== GDP数据 ====================
export interface GDP {
  quarter: string;
  gdp?: number;
  gdp_yoy?: number;
  pi?: number;
  pi_yoy?: number;
  si?: number;
  si_yoy?: number;
  ti?: number;
  ti_yoy?: number;
}

export interface GDPQuery {
  skip?: number;
  limit?: number;
  quarter?: string;
  start_q?: string;
  end_q?: string;
}

// ==================== CPI居民消费价格指数 ====================
export interface CPI {
  month: string;
  nt_val?: number;
  nt_yoy?: number;
  nt_mom?: number;
  nt_accu?: number;
  town_val?: number;
  town_yoy?: number;
  town_mom?: number;
  town_accu?: number;
  cnt_val?: number;
  cnt_yoy?: number;
  cnt_mom?: number;
  cnt_accu?: number;
}

export interface CPIQuery {
  skip?: number;
  limit?: number;
  month?: string;
  start_m?: string;
  end_m?: string;
}

// ==================== PPI工业生产者出厂价格指数 ====================
export interface PPI {
  month: string;
  ppi_yoy?: number;
  ppi_mom?: number;
  ppi_accu?: number;
  ppi_mp_yoy?: number;
  ppi_mp_mom?: number;
  ppi_mp_accu?: number;
  ppi_mp_qm_yoy?: number;
  ppi_mp_qm_mom?: number;
  ppi_mp_qm_accu?: number;
  ppi_mp_rm_yoy?: number;
  ppi_mp_rm_mom?: number;
  ppi_mp_rm_accu?: number;
  ppi_mp_p_yoy?: number;
  ppi_mp_p_mom?: number;
  ppi_mp_p_accu?: number;
  ppi_cg_yoy?: number;
  ppi_cg_mom?: number;
  ppi_cg_accu?: number;
  ppi_cg_f_yoy?: number;
  ppi_cg_f_mom?: number;
  ppi_cg_f_accu?: number;
  ppi_cg_c_yoy?: number;
  ppi_cg_c_mom?: number;
  ppi_cg_c_accu?: number;
  ppi_cg_adu_yoy?: number;
  ppi_cg_adu_mom?: number;
  ppi_cg_adu_accu?: number;
  ppi_cg_dcg_yoy?: number;
  ppi_cg_dcg_mom?: number;
  ppi_cg_dcg_accu?: number;
}

export interface PPIQuery {
  skip?: number;
  limit?: number;
  month?: string;
  start_m?: string;
  end_m?: string;
}

// ==================== 货币供应量 ====================
export interface MoneySupply {
  month: string;
  m0?: number;
  m0_yoy?: number;
  m0_mom?: number;
  m1?: number;
  m1_yoy?: number;
  m1_mom?: number;
  m2?: number;
  m2_yoy?: number;
  m2_mom?: number;
}

export interface MoneySupplyQuery {
  skip?: number;
  limit?: number;
  month?: string;
  start_m?: string;
  end_m?: string;
}

// ==================== 社融增量（月度） ====================
export interface SocialFinancing {
  month: string;
  inc_month?: number;
  inc_cumval?: number;
  stk_endval?: number;
}

export interface SocialFinancingQuery {
  skip?: number;
  limit?: number;
  month?: string;
  start_m?: string;
  end_m?: string;
}

// ==================== 采购经理人指数（PMI） ====================
export interface PMI {
  month: string;
  pmi010000?: number;
  pmi010100?: number;
  pmi010200?: number;
  pmi010300?: number;
  pmi010400?: number;
  pmi010401?: number;
  pmi010402?: number;
  pmi010403?: number;
  pmi010500?: number;
  pmi010501?: number;
  pmi010502?: number;
  pmi010503?: number;
  pmi010600?: number;
  pmi010601?: number;
  pmi010602?: number;
  pmi010603?: number;
  pmi010700?: number;
  pmi010701?: number;
  pmi010702?: number;
  pmi010703?: number;
  pmi010800?: number;
  pmi010801?: number;
  pmi010802?: number;
  pmi010803?: number;
  pmi010900?: number;
  pmi011000?: number;
  pmi011100?: number;
  pmi011200?: number;
  pmi011300?: number;
  pmi011400?: number;
  pmi011500?: number;
  pmi011600?: number;
  pmi011700?: number;
  pmi011800?: number;
  pmi011900?: number;
  pmi012000?: number;
  pmi020100?: number;
  pmi020101?: number;
  pmi020102?: number;
  pmi020200?: number;
  pmi020201?: number;
  pmi020202?: number;
  pmi020300?: number;
  pmi020301?: number;
  pmi020302?: number;
  pmi020400?: number;
  pmi020401?: number;
  pmi020402?: number;
  pmi020500?: number;
  pmi020501?: number;
  pmi020502?: number;
  pmi020600?: number;
  pmi020601?: number;
  pmi020602?: number;
  pmi020700?: number;
  pmi020800?: number;
  pmi020900?: number;
  pmi021000?: number;
  pmi030000?: number;
}

export interface PMIQuery {
  skip?: number;
  limit?: number;
  month?: string;
  start_m?: string;
  end_m?: string;
}

// ==================== 美国国债收益率曲线 ====================
export interface USTreasuryYieldCurve {
  date: string;
  m1?: number;
  m2?: number;
  m3?: number;
  m4?: number;
  m6?: number;
  y1?: number;
  y2?: number;
  y3?: number;
  y5?: number;
  y7?: number;
  y10?: number;
  y20?: number;
  y30?: number;
}

export interface USTreasuryYieldCurveQuery {
  skip?: number;
  limit?: number;
  date?: string;
  start_date?: string;
  end_date?: string;
}

// ==================== 美国国债实际收益率曲线 ====================
export interface USTreasuryRealYieldCurve {
  date: string;
  y5?: number;
  y7?: number;
  y10?: number;
  y20?: number;
  y30?: number;
}

export interface USTreasuryRealYieldCurveQuery {
  skip?: number;
  limit?: number;
  date?: string;
  start_date?: string;
  end_date?: string;
}

// ==================== 美国短期国债利率 ====================
export interface USTreasuryBill {
  date: string;
  w4_bd?: number;
  w4_ce?: number;
  w8_bd?: number;
  w8_ce?: number;
  w13_bd?: number;
  w13_ce?: number;
  w17_bd?: number;
  w17_ce?: number;
  w26_bd?: number;
  w26_ce?: number;
  w52_bd?: number;
  w52_ce?: number;
}

export interface USTreasuryBillQuery {
  skip?: number;
  limit?: number;
  date?: string;
  start_date?: string;
  end_date?: string;
}

// ==================== 美国国债长期利率 ====================
export interface USTreasuryLongTerm {
  date: string;
  ltc?: number;
  cmt?: number;
  e_factor?: number;
}

export interface USTreasuryLongTermQuery {
  skip?: number;
  limit?: number;
  date?: string;
  start_date?: string;
  end_date?: string;
}

// ==================== 美国国债实际长期利率平均值 ====================
export interface USTreasuryRealLongTermAvg {
  date: string;
  ltr_avg?: number;
}

export interface USTreasuryRealLongTermAvgQuery {
  skip?: number;
  limit?: number;
  date?: string;
  start_date?: string;
  end_date?: string;
}

// ==================== 通用响应接口 ====================
export interface MacroResponse<T> {
  data: T[];
  count?: number;
}

// ==================== API函数 ====================
export const getShiborList = async (params: ShiborQuery): Promise<MacroResponse<Shibor>> => {
  try {
    const response = await httpApi.get<MacroResponse<Shibor>>('macro/shibor', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch shibor list:', error);
    return { data: [], count: 0 };
  }
};

export const getLPRList = async (params: LPRQuery): Promise<MacroResponse<LPR>> => {
  try {
    const response = await httpApi.get<MacroResponse<LPR>>('macro/lpr', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch lpr list:', error);
    return { data: [], count: 0 };
  }
};

export const getGDPList = async (params: GDPQuery): Promise<MacroResponse<GDP>> => {
  try {
    const response = await httpApi.get<MacroResponse<GDP>>('macro/cn_gdp', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch gdp list:', error);
    return { data: [], count: 0 };
  }
};

export const getCPIList = async (params: CPIQuery): Promise<MacroResponse<CPI>> => {
  try {
    const response = await httpApi.get<MacroResponse<CPI>>('macro/cpi', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch cpi list:', error);
    return { data: [], count: 0 };
  }
};

export const getPPIList = async (params: PPIQuery): Promise<MacroResponse<PPI>> => {
  try {
    const response = await httpApi.get<MacroResponse<PPI>>('macro/ppi', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch ppi list:', error);
    return { data: [], count: 0 };
  }
};

export const getMoneySupplyList = async (params: MoneySupplyQuery): Promise<MacroResponse<MoneySupply>> => {
  try {
    const response = await httpApi.get<MacroResponse<MoneySupply>>('macro/money_supply', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch money supply list:', error);
    return { data: [], count: 0 };
  }
};

export const getSocialFinancingList = async (params: SocialFinancingQuery): Promise<MacroResponse<SocialFinancing>> => {
  try {
    const response = await httpApi.get<MacroResponse<SocialFinancing>>('macro/social_financing', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch social financing list:', error);
    return { data: [], count: 0 };
  }
};

export const getPMIList = async (params: PMIQuery): Promise<MacroResponse<PMI>> => {
  try {
    const response = await httpApi.get<MacroResponse<PMI>>('macro/pmi', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch pmi list:', error);
    return { data: [], count: 0 };
  }
};

export const getUSTreasuryYieldCurveList = async (params: USTreasuryYieldCurveQuery): Promise<MacroResponse<USTreasuryYieldCurve>> => {
  try {
    const response = await httpApi.get<MacroResponse<USTreasuryYieldCurve>>('macro/us_treasury_yield_curve', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch us treasury yield curve list:', error);
    return { data: [], count: 0 };
  }
};

export const getUSTreasuryRealYieldCurveList = async (params: USTreasuryRealYieldCurveQuery): Promise<MacroResponse<USTreasuryRealYieldCurve>> => {
  try {
    const response = await httpApi.get<MacroResponse<USTreasuryRealYieldCurve>>('macro/us_treasury_real_yield_curve', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch us treasury real yield curve list:', error);
    return { data: [], count: 0 };
  }
};

export const getUSTreasuryBillList = async (params: USTreasuryBillQuery): Promise<MacroResponse<USTreasuryBill>> => {
  try {
    const response = await httpApi.get<MacroResponse<USTreasuryBill>>('macro/us_treasury_bill', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch us treasury bill list:', error);
    return { data: [], count: 0 };
  }
};

export const getUSTreasuryLongTermList = async (params: USTreasuryLongTermQuery): Promise<MacroResponse<USTreasuryLongTerm>> => {
  try {
    const response = await httpApi.get<MacroResponse<USTreasuryLongTerm>>('macro/us_treasury_long_term', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch us treasury long term list:', error);
    return { data: [], count: 0 };
  }
};

export const getUSTreasuryRealLongTermAvgList = async (params: USTreasuryRealLongTermAvgQuery): Promise<MacroResponse<USTreasuryRealLongTermAvg>> => {
  try {
    const response = await httpApi.get<MacroResponse<USTreasuryRealLongTermAvg>>('macro/us_treasury_real_long_term_avg', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch us treasury real long term avg list:', error);
    return { data: [], count: 0 };
  }
};

// ==================== 同步数据接口 ====================
export interface MacroSyncPayload {
  start_date?: string;
  end_date?: string;
  start_m?: string;
  end_m?: string;
  start_q?: string;
  end_q?: string;
}

export const syncMacroData = async (type: string, payload: MacroSyncPayload): Promise<{ message: string; success: number; failed: number }> => {
  try {
    // 映射前端类型到后端路径
    const typeMap: Record<string, string> = {
      gdp: 'cn_gdp',
      cpi: 'cpi',
      pmi: 'pmi',
      ppi: 'ppi',
      shibor: 'shibor',
      lpr: 'lpr',
      money_supply: 'money_supply',
      social_financing: 'social_financing',
      us_treasury_yield_curve: 'us_treasury_yield_curve',
      us_treasury_real_yield_curve: 'us_treasury_real_yield_curve',
      us_treasury_bill: 'us_treasury_bill',
      us_treasury_long_term: 'us_treasury_long_term',
      us_treasury_real_long_term_avg: 'us_treasury_real_long_term_avg',
    };
    const backendType = typeMap[type] || type;
    const response = await httpApi.post<{ message: string; success: number; failed: number }>(`macro/${backendType}/sync`, payload);
    return response.data;
  } catch (error) {
    console.error(`Failed to sync ${type}:`, error);
    throw error;
  }
};


