import React, { useMemo, useState, useCallback } from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseTabs } from '@app/components/common/BaseTabs/BaseTabs';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseAutoComplete } from '@app/components/common/BaseAutoComplete/BaseAutoComplete';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { MarketIndexTab } from './tabs/MarketIndexTab';
import { MarketEtfTab } from './tabs/MarketEtfTab';
import { MarketOtcTab } from './tabs/MarketOtcTab';
import { MarketStockTab } from './tabs/MarketStockTab';
import { MarketAllTab } from './tabs/MarketAllTab';
import { useDispatch, useSelector } from 'react-redux';
import { addEntry } from '@app/store/slices/searchHistorySlice';

/**
 * 市场列表页面
 * 根据原型设计，包含全部、指数、ETF、场外、股票等标签页
 * 全局搜索功能统一管理
 */
const MarketListPage: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [activeTab, setActiveTab] = useState('index');
  const [searchTrigger, setSearchTrigger] = useState(0); // 用于触发子组件搜索

  const dispatch = useDispatch();
  const keywordHistory = useSelector((state: any) => state.searchHistory?.pages?.marketList?.keyword || []);
  const [keywordOpen, setKeywordOpen] = useState(false);

  // 处理搜索
  const handleSearch = useCallback(() => {
    if (keyword.trim()) {
      dispatch(addEntry({ page: 'marketList', field: 'keyword', value: keyword.trim() }));
    }
    setSearchTrigger((prev) => prev + 1); // 触发子组件重新搜索
  }, [keyword, dispatch]);

  // 处理重置
  const handleReset = useCallback(() => {
    setKeyword('');
    setSearchTrigger((prev) => prev + 1); // 触发子组件重置搜索
  }, []);

  // 处理Tab切换
  const handleTabChange = useCallback((key: string) => {
    setActiveTab(key);
    // Tab切换时，如果有关键词则自动触发搜索
    if (keyword.trim()) {
      setSearchTrigger((prev) => prev + 1);
    }
  }, [keyword]);

  const tabItems = useMemo(
    () => [
      {
        key: 'all',
        label: '全部',
        children: <MarketAllTab keyword={keyword} searchTrigger={searchTrigger} />,
      },
      {
        key: 'index',
        label: '指数',
        children: <MarketIndexTab keyword={keyword} searchTrigger={searchTrigger} />,
      },
      {
        key: 'etf',
        label: 'ETF',
        children: <MarketEtfTab keyword={keyword} searchTrigger={searchTrigger} />,
      },
      {
        key: 'otc',
        label: '场外',
        children: <MarketOtcTab keyword={keyword} searchTrigger={searchTrigger} />,
      },
      {
        key: 'stock',
        label: '股票',
        children: <MarketStockTab keyword={keyword} searchTrigger={searchTrigger} />,
      },
    ],
    [keyword, searchTrigger],
  );

  return (
    <>
      <PageTitle>市场列表</PageTitle>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem' }}>
        <BaseAutoComplete
          placeholder="搜索指数/ETF/场外/股票"
          allowClear
          value={keyword}
          options={keywordHistory.map((v: string) => ({ value: v, label: v }))}
          onChange={(val) => setKeyword(val as string)}
          onSelect={(val) => setKeyword(val as string)}
          open={keywordOpen}
          onFocus={() => setKeywordOpen(keywordHistory.length > 0)}
          onBlur={() => setKeywordOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          style={{ width: 300 }}
        />
        <BaseButton onClick={handleSearch}>查询</BaseButton>
        <BaseButton onClick={handleReset}>重置</BaseButton>
      </BaseSpace>
      <BaseTabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} type="line" />
    </>
  );
};

export default MarketListPage;

