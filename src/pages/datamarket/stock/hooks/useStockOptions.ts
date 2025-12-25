import { useState, useCallback, useEffect } from 'react';
import { getStockBasicList, StockBasic } from '@app/api/stock.api';

/**
 * 股票选项加载Hook
 * 用于在查询区域和同步弹窗中加载股票选项列表，支持远程搜索
 */
export const useStockOptions = () => {
  const [stockOptions, setStockOptions] = useState<StockBasic[]>([]);
  const [stockOptionsLoading, setStockOptionsLoading] = useState(false);

  // 加载股票选项列表（支持关键词搜索）
  const fetchStockOptions = useCallback(async (keyword?: string) => {
    setStockOptionsLoading(true);
    try {
      const res = await getStockBasicList({
        skip: 0,
        limit: 500,
        keyword: keyword || undefined,
      });
      setStockOptions(res.data);
    } catch (error) {
      console.error('Failed to load stock options:', error);
      setStockOptions([]);
    } finally {
      setStockOptionsLoading(false);
    }
  }, []);

  // 组件挂载时加载默认列表
  useEffect(() => {
    fetchStockOptions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    stockOptions,
    stockOptionsLoading,
    fetchStockOptions,
  };
};



