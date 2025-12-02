import { httpApi } from './http.api';

export interface KlineData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const getVolatilityFromInterval = (interval: string): number => {
  if (interval.endsWith('m')) {
    return 2;
  }
  if (interval.endsWith('h')) {
    return 6;
  }
  if (interval === '1w') {
    return 12;
  }
  return 8;
};

export const getKlineData = async (symbol: string, interval = '1d'): Promise<KlineData[]> => {
  try {
    // 示例：使用你的后端 API
    // 如果没有后端，可以返回模拟数据
    const response = await httpApi.get(`/api/kline/${symbol}`, {
      params: { interval },
    });
    return response.data;
  } catch (error) {
    console.error('获取K线数据失败:', error);
    // 返回模拟数据作为降级方案
    return generateMockKlineData(symbol, interval);
  }
};

// 生成模拟K线数据
const generateMockKlineData = (symbol: string, interval: string): KlineData[] => {
  const data: KlineData[] = [];
  const basePrice = 50 + (Array.from(symbol).reduce((sum, char) => sum + char.charCodeAt(0), 0) % 200);
  const volatility = getVolatilityFromInterval(interval);
  let currentPrice = basePrice;
  const now = new Date();

  // 生成30天的数据
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const change = (Math.random() - 0.5) * volatility;
    const open = currentPrice;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 5;
    const low = Math.min(open, close) - Math.random() * 5;
    const volume = Math.floor(Math.random() * 1_000_000) + 100_000;

    data.push({
      time: date.toISOString().split('T')[0],
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });

    currentPrice = close;
  }

  return data;
};
