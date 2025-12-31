import React, { useMemo } from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseTabs } from '@app/components/common/BaseTabs/BaseTabs';
import { WatchlistIndexTab } from './tabs/WatchlistIndexTab';
import { WatchlistEtfTab } from './tabs/WatchlistEtfTab';

/**
 * 个人自选页面
 */
const WatchlistPage: React.FC = () => {
  const tabItems = useMemo(
    () => [
      {
        key: 'index',
        label: '指数',
        children: <WatchlistIndexTab />,
      },
      {
        key: 'etf',
        label: 'ETF',
        children: <WatchlistEtfTab />,
      },
    ],
    [],
  );

  return (
    <>
      <PageTitle>个人自选</PageTitle>
      <BaseTabs defaultActiveKey="index" items={tabItems} type="card" />
    </>
  );
};

export default WatchlistPage;
