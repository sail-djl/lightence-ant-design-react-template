import React, { useMemo } from 'react';
import styled from 'styled-components';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseTabs } from '@app/components/common/BaseTabs/BaseTabs';
import { FxObasicTab } from './forex/tabs/FxObasicTab';
import { FxDailyTab } from './forex/tabs/FxDailyTab';

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

const ForexListPage: React.FC = () => {
  const tabItems = useMemo(
    () => [
      {
        key: 'fx_obasic',
        label: '外汇基础信息',
        children: <FxObasicTab />,
      },
      {
        key: 'fx_daily',
        label: '外汇日线行情',
        children: <FxDailyTab />,
      },
    ],
    []
  );

  return (
    <>
      <PageTitle>数据市场 · 外汇数据</PageTitle>
      <StyledTabs defaultActiveKey="fx_obasic" items={tabItems} type="card" />
    </>
  );
};

export default ForexListPage;

