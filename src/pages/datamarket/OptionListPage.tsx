import React, { useMemo } from 'react';
import styled from 'styled-components';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseTabs } from '@app/components/common/BaseTabs/BaseTabs';
import { OptBasicTab } from './option/tabs/OptBasicTab';
import { OptDailyTab } from './option/tabs/OptDailyTab';

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

const OptionListPage: React.FC = () => {
  const tabItems = useMemo(
    () => [
      {
        key: 'opt_basic',
        label: '期权合约信息',
        children: <OptBasicTab />,
      },
      {
        key: 'opt_daily',
        label: '期权日线行情',
        children: <OptDailyTab />,
      },
    ],
    []
  );

  return (
    <>
      <PageTitle>数据市场 · 期权数据</PageTitle>
      <StyledTabs defaultActiveKey="opt_basic" items={tabItems} type="card" />
    </>
  );
};

export default OptionListPage;

