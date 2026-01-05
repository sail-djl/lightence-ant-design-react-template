import React from 'react';
import { MarketIndexTab } from './MarketIndexTab';

interface MarketAllTabProps {
  keyword?: string;
  searchTrigger?: number;
}

/**
 * 全部标签页 - 合并显示所有类型的数据
 * 目前简单实现为显示指数数据，后续可以优化为合并多个数据源
 */
export const MarketAllTab: React.FC<MarketAllTabProps> = ({ keyword, searchTrigger }) => {
  // 暂时显示指数数据，后续可以优化为合并多个数据源
  return <MarketIndexTab keyword={keyword} searchTrigger={searchTrigger} />;
};

