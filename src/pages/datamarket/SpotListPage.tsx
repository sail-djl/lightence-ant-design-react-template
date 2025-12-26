import React, { useMemo } from 'react';
import styled from 'styled-components';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseTabs } from '@app/components/common/BaseTabs/BaseTabs';
import { SgeBasicTab } from './spot/tabs/SgeBasicTab';
import { SgeDailyTab } from './spot/tabs/SgeDailyTab';

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

const SpotListPage: React.FC = () => {
  const tabItems = useMemo(
    () => [
      {
        key: 'sge_basic',
        label: '黄金现货基础信息',
        children: <SgeBasicTab />,
      },
      {
        key: 'sge_daily',
        label: '上海黄金现货日行情',
        children: <SgeDailyTab />,
      },
    ],
    []
  );

  return (
    <>
      <PageTitle>数据市场 · 现货数据</PageTitle>
      <StyledTabs defaultActiveKey="sge_basic" items={tabItems} type="card" />
    </>
  );
};

export default SpotListPage;

