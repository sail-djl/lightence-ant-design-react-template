import React, { useMemo } from 'react';
import styled from 'styled-components';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseTabs } from '@app/components/common/BaseTabs/BaseTabs';
import { FutBasicTab } from './futures/tabs/FutBasicTab';
import { TradeCalTab } from './futures/tabs/TradeCalTab';
import { FutDailyTab } from './futures/tabs/FutDailyTab';
import { FutWeeklyMonthlyTab } from './futures/tabs/FutWeeklyMonthlyTab';

const StyledTabs = styled(BaseTabs)`
  .ant-tabs-nav {
    margin-bottom: 16px;
    
    &::before {
      display: none;
    }
  }

  .ant-tabs-nav-wrap {
    overflow: visible !important;
  }

  .ant-tabs-nav-list {
    flex-wrap: wrap !important;
    overflow: visible !important;
    width: 100%;
  }

  .ant-tabs-tab {
    margin: 0 4px 8px 0 !important;
    flex-shrink: 0;
  }

  .ant-tabs-content-holder {
    padding-top: 0;
  }
`;

const FuturesListPage: React.FC = () => {
  const tabItems = useMemo(
    () => [
      {
        key: 'fut_basic',
        label: '期货合约信息',
        children: <FutBasicTab />,
      },
      {
        key: 'trade_cal',
        label: '交易日历',
        children: <TradeCalTab />,
      },
      {
        key: 'fut_daily',
        label: '日线行情',
        children: <FutDailyTab />,
      },
      {
        key: 'fut_weekly_monthly',
        label: '周/月线行情',
        children: <FutWeeklyMonthlyTab />,
      },
    ],
    []
  );

  return (
    <>
      <PageTitle>数据市场 · 期货数据</PageTitle>
      <StyledTabs defaultActiveKey="fut_basic" items={tabItems} type="card" />
    </>
  );
};

export default FuturesListPage;

