import React, { useMemo } from 'react';
import styled from 'styled-components';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseTabs } from '@app/components/common/BaseTabs/BaseTabs';
import { CbBasicTab } from './bond/tabs/CbBasicTab';
import { CbIssueTab } from './bond/tabs/CbIssueTab';
import { CbDailyTab } from './bond/tabs/CbDailyTab';

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

const BondListPage: React.FC = () => {
  const tabItems = useMemo(
    () => [
      {
        key: 'cb_basic',
        label: '可转债基本信息',
        children: <CbBasicTab />,
      },
      {
        key: 'cb_issue',
        label: '可转债发行',
        children: <CbIssueTab />,
      },
      {
        key: 'cb_daily',
        label: '可转债行情',
        children: <CbDailyTab />,
      },
    ],
    []
  );

  return (
    <>
      <PageTitle>数据市场 · 债券数据</PageTitle>
      <StyledTabs defaultActiveKey="cb_basic" items={tabItems} type="card" />
    </>
  );
};

export default BondListPage;

