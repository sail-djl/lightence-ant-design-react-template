import { httpApi } from './http.api';

export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
}

export const getMarketData = async (): Promise<MarketData[]> => {
  try {
    const response = await httpApi.get('/api/market');
    return response.data;
  } catch (error) {
    console.error('获取市场数据失败:', error);
    return generateMockMarketData();
  }
};

const generateMockMarketData = (): MarketData[] => {
  const symbols = [
    { symbol: 'AAPL', name: '苹果公司' },
    { symbol: 'MSFT', name: '微软' },
    { symbol: 'GOOGL', name: '谷歌' },
    { symbol: 'AMZN', name: '亚马逊' },
    { symbol: 'TSLA', name: '特斯拉' },
    { symbol: 'META', name: 'Meta' },
    { symbol: 'NVDA', name: '英伟达' },
    { symbol: 'BTC/USDT', name: '比特币' },
    { symbol: 'ETH/USDT', name: '以太坊' },
  ];

  return symbols.map((item) => {
    const basePrice = Math.random() * 500 + 50;
    const change = (Math.random() - 0.5) * 20;
    const changePercent = (change / basePrice) * 100;

    return {
      symbol: item.symbol,
      name: item.name,
      price: Number(basePrice.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      volume: Math.floor(Math.random() * 10_000_000) + 1_000_000,
      marketCap: Math.floor(Math.random() * 1_000_000_000_000) + 100_000_000_000,
    };
  });
};
