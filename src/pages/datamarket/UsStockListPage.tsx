import React, { useMemo } from 'react';
import styled from 'styled-components';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseTabs } from '@app/components/common/BaseTabs/BaseTabs';
import { UsBasicTab } from './us_stock/tabs/UsBasicTab';
import { UsDailyTab } from './us_stock/tabs/UsDailyTab';

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

const UsStockListPage: React.FC = () => {
  const tabItems = useMemo(
    () => [
      {
        key: 'us_basic',
        label: '美股列表',
        children: <UsBasicTab />,
      },
      {
        key: 'us_daily',
        label: '美股日线行情',
        children: <UsDailyTab />,
      },
    ],
    []
  );

  return (
    <>
      <PageTitle>数据市场 · 美股数据</PageTitle>
      <StyledTabs defaultActiveKey="us_basic" items={tabItems} type="card" />
    </>
  );
};

export default UsStockListPage;

