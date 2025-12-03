import { httpApi } from '@app/api/http.api';

// ============================================
// Polarization 接口类型定义
// ============================================
export interface ETFInfo {
  code: string;
  name: string;
  price: number;
  changePercent: number;
  navDate: string | null; // 净值日期 (YYYY-MM-DD)，可能为 null
}

export interface PolarizationData {
  currentPolarization: number;
  avgPolarization: number; // 3年平均
  status: 'low' | 'moderate' | 'high';
  trend: 'rising' | 'falling' | 'stable';
}

export interface DeviationData {
  date: string;
  deviation: number;
  etf1Price: number;
  etf2Price: number;
}

export interface DeviationSummary {
  today: number;
  weekAvg: number;
  monthAvg: number;
  yearAvg: number;
}

// ============================================
// Polarization API - 基金数据对接
// 数据来源: fund.fund_basic 和 fund.fund_nav
// ============================================

/**
 * 获取基金列表（从 fund.fund_basic 和 fund.fund_nav 获取）
 */
export const getETFList = async (): Promise<ETFInfo[]> => {
  try {
    const response = await httpApi.get('/polarization/fund-list');
    const data = response.data;
    // 调试：检查 001593.OF 的数据
    if (process.env.NODE_ENV === 'development' && Array.isArray(data)) {
      const fund001593 = data.find((f: ETFInfo) => f.code === '001593.OF');
      if (fund001593) {
        console.log('📡 API Response: 001593.OF data:', fund001593);
        console.log(
          '📡 API Response: changePercent:',
          fund001593.changePercent,
          'type:',
          typeof fund001593.changePercent,
        );
        console.log('📡 API Response: price:', fund001593.price, 'type:', typeof fund001593.price);
      }
    }
    return data;
  } catch (error) {
    console.error('获取基金列表失败:', error);
    // Fallback to mock data if backend is not available
    return generateMockFundList();
  }
};

/**
 * Mock数据生成（用于后端接口不可用时的fallback）
 */
const generateMockFundList = (): ETFInfo[] => {
  const today = new Date().toISOString().split('T')[0];
  return [
    { code: '510300', name: '沪深300ETF', price: 4.25, changePercent: 0.2, navDate: today },
    { code: '510500', name: '中证500ETF', price: 6.58, changePercent: -0.18, navDate: today },
    { code: '159915', name: '创业板ETF', price: 2.15, changePercent: 1.65, navDate: today },
    { code: '588000', name: '科创50ETF', price: 1.08, changePercent: 0.46, navDate: today },
    { code: '510050', name: '上证50ETF', price: 2.85, changePercent: -0.28, navDate: today },
    { code: '159949', name: '创业板50ETF', price: 1.25, changePercent: 1.46, navDate: today },
  ];
};

/**
 * 获取偏振度数据（从 fund.fund_nav 计算）
 */
export const getPolarizationData = async (etf1Code: string, etf2Code: string): Promise<PolarizationData> => {
  try {
    const response = await httpApi.get('/polarization/polarization', {
      params: {
        fund1Code: etf1Code,
        fund2Code: etf2Code,
      },
    });
    return response.data;
  } catch (error) {
    console.error('获取偏振度数据失败:', error);
    // Fallback to mock data
    return {
      currentPolarization: 0.75,
      avgPolarization: 0.85,
      status: 'moderate',
      trend: 'stable',
    };
  }
};

/**
 * 获取偏差数据（从 fund.fund_nav 计算）
 */
export const getDeviationData = async (
  etf1Code: string,
  etf2Code: string,
  timeRange: number,
): Promise<DeviationData[]> => {
  try {
    const response = await httpApi.get('/polarization/deviation', {
      params: {
        fund1Code: etf1Code,
        fund2Code: etf2Code,
        timeRange: timeRange,
      },
    });
    return response.data;
  } catch (error) {
    console.error('获取偏差数据失败:', error);
    // Fallback to mock data
    return generateMockDeviationData(timeRange);
  }
};

/**
 * Mock偏差数据生成（用于后端接口不可用时的fallback）
 */
const generateMockDeviationData = (timeRange: number): DeviationData[] => {
  const data: DeviationData[] = [];
  const basePrice1 = 4.25;
  const basePrice2 = 6.58;

  for (let i = timeRange; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const price1 = basePrice1 + (Math.random() * 0.2 - 0.1);
    const price2 = basePrice2 + (Math.random() * 0.2 - 0.1);

    data.push({
      date: date.toISOString().split('T')[0],
      deviation: parseFloat((price1 / price2).toFixed(3)),
      etf1Price: parseFloat(price1.toFixed(2)),
      etf2Price: parseFloat(price2.toFixed(2)),
    });
  }

  return data;
};

/**
 * 获取偏差摘要（从 fund.fund_nav 计算）
 */
export const getDeviationSummary = async (etf1Code: string, etf2Code: string): Promise<DeviationSummary> => {
  try {
    const response = await httpApi.get('/polarization/deviation-summary', {
      params: {
        fund1Code: etf1Code,
        fund2Code: etf2Code,
      },
    });
    return response.data;
  } catch (error) {
    console.error('获取偏差摘要失败:', error);
    // Fallback to mock data
    return {
      today: 0.85,
      weekAvg: 0.82,
      monthAvg: 0.79,
      yearAvg: 0.75,
    };
  }
};
