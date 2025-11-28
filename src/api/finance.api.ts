import { httpApi } from './http.api';

export interface FinancialIndicator {
  name: string;
  value: number;
  unit: string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface PortfolioData {
  totalValue: number;
  totalProfit: number;
  totalProfitPercent: number;
  positions: Array<{
    symbol: string;
    name: string;
    quantity: number;
    avgPrice: number;
    currentPrice: number;
    profit: number;
    profitPercent: number;
  }>;
}

export const getFinancialIndicators = async (): Promise<FinancialIndicator[]> => {
  try {
    const response = await httpApi.get('/api/finance/indicators');
    return response.data;
  } catch (error) {
    console.error('获取金融指标失败:', error);
    return generateMockIndicators();
  }
};

export const getPortfolioData = async (): Promise<PortfolioData> => {
  try {
    const response = await httpApi.get('/api/finance/portfolio');
    return response.data;
  } catch (error) {
    console.error('获取投资组合失败:', error);
    return generateMockPortfolio();
  }
};

const generateMockIndicators = (): FinancialIndicator[] => {
  return [
    { name: '上证指数', value: 3200.45, unit: '点', change: 25.3, trend: 'up' },
    { name: '深证成指', value: 11500.23, unit: '点', change: -15.2, trend: 'down' },
    { name: '创业板指', value: 2450.67, unit: '点', change: 8.5, trend: 'up' },
    { name: '沪深300', value: 4100.12, unit: '点', change: 12.8, trend: 'up' },
    { name: '美元指数', value: 103.45, unit: '点', change: -0.3, trend: 'down' },
    { name: '黄金价格', value: 1980.50, unit: '美元/盎司', change: 5.2, trend: 'up' },
  ];
};

const generateMockPortfolio = (): PortfolioData => {
  return {
    totalValue: 1250000,
    totalProfit: 125000,
    totalProfitPercent: 11.11,
    positions: [
      { symbol: 'AAPL', name: '苹果公司', quantity: 100, avgPrice: 150, currentPrice: 175, profit: 2500, profitPercent: 16.67 },
      { symbol: 'MSFT', name: '微软', quantity: 50, avgPrice: 300, currentPrice: 350, profit: 2500, profitPercent: 16.67 },
      { symbol: 'GOOGL', name: '谷歌', quantity: 30, avgPrice: 120, currentPrice: 140, profit: 600, profitPercent: 16.67 },
    ],
  };
};

