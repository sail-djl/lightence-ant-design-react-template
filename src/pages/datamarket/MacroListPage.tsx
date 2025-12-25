import React, { useMemo } from 'react';
import styled from 'styled-components';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseTabs } from '@app/components/common/BaseTabs/BaseTabs';
import { ShiborTab } from './macro/tabs/ShiborTab';
import { LPRTab } from './macro/tabs/LPRTab';
import { GDPTab } from './macro/tabs/GDPTab';
import { CPITab } from './macro/tabs/CPITab';
import { PPITab } from './macro/tabs/PPITab';
import { MoneySupplyTab } from './macro/tabs/MoneySupplyTab';
import { SocialFinancingTab } from './macro/tabs/SocialFinancingTab';
import { PMITab } from './macro/tabs/PMITab';
import { USTreasuryYieldCurveTab } from './macro/tabs/USTreasuryYieldCurveTab';
import { USTreasuryRealYieldCurveTab } from './macro/tabs/USTreasuryRealYieldCurveTab';
import { USTreasuryBillTab } from './macro/tabs/USTreasuryBillTab';
import { USTreasuryLongTermTab } from './macro/tabs/USTreasuryLongTermTab';
import { USTreasuryRealLongTermAvgTab } from './macro/tabs/USTreasuryRealLongTermAvgTab';

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

const MacroListPage: React.FC = () => {
  const tabItems = useMemo(
    () => [
      {
        key: 'shibor',
        label: 'Shibor利率',
        children: <ShiborTab />,
      },
      {
        key: 'lpr',
        label: 'LPR贷款基础利率',
        children: <LPRTab />,
      },
      {
        key: 'gdp',
        label: 'GDP数据',
        children: <GDPTab />,
      },
      {
        key: 'cpi',
        label: 'CPI居民消费价格指数',
        children: <CPITab />,
      },
      {
        key: 'ppi',
        label: 'PPI工业生产者出厂价格指数',
        children: <PPITab />,
      },
      {
        key: 'money_supply',
        label: '货币供应量',
        children: <MoneySupplyTab />,
      },
      {
        key: 'social_financing',
        label: '社融增量（月度）',
        children: <SocialFinancingTab />,
      },
      {
        key: 'pmi',
        label: '采购经理人指数（PMI）',
        children: <PMITab />,
      },
      {
        key: 'us_yield_curve',
        label: '美国国债收益率曲线',
        children: <USTreasuryYieldCurveTab />,
      },
      {
        key: 'us_real_yield_curve',
        label: '美国国债实际收益率曲线',
        children: <USTreasuryRealYieldCurveTab />,
      },
      {
        key: 'us_treasury_bill',
        label: '美国短期国债利率',
        children: <USTreasuryBillTab />,
      },
      {
        key: 'us_long_term',
        label: '美国国债长期利率',
        children: <USTreasuryLongTermTab />,
      },
      {
        key: 'us_real_long_term_avg',
        label: '美国国债实际长期利率平均值',
        children: <USTreasuryRealLongTermAvgTab />,
      },
    ],
    []
  );

  return (
    <>
      <PageTitle>数据市场 · 宏观经济</PageTitle>
      <StyledTabs defaultActiveKey="shibor" items={tabItems} type="card" />
    </>
  );
};

export default MacroListPage;

