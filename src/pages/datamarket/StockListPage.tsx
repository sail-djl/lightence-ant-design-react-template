import React, { useMemo } from 'react';
import styled from 'styled-components';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseTabs } from '@app/components/common/BaseTabs/BaseTabs';
import { StockBasicTab } from './stock/tabs/StockBasicTab';
import { StockCompanyTab } from './stock/tabs/StockCompanyTab';
import { StockIpoTab } from './stock/tabs/StockIpoTab';
import { StockDailyTab } from './stock/tabs/StockDailyTab';
import { StockDailybasicTab } from './stock/tabs/StockDailybasicTab';
import { StockIncomeTab } from './stock/tabs/StockIncomeTab';
import { StockBalancesheetTab } from './stock/tabs/StockBalancesheetTab';
import { StockBusinessTab } from './stock/tabs/StockBusinessTab';
import { StockReportTab } from './stock/tabs/StockReportTab';
import { StockShareholderTab } from './stock/tabs/StockShareholderTab';
import { StockRepurchaseTab } from './stock/tabs/StockRepurchaseTab';
import { StockRecommendTab } from './stock/tabs/StockRecommendTab';
import { StockHsgtTab } from './stock/tabs/StockHsgtTab';
import { StockMarginTab } from './stock/tabs/StockMarginTab';
import { StockTransferTab } from './stock/tabs/StockTransferTab';
import { StockThsconceptTab } from './stock/tabs/StockThsconceptTab';
import { StockThsindustryTab } from './stock/tabs/StockThsindustryTab';
import { StockDcconceptTab } from './stock/tabs/StockDcconceptTab';
import { StockLhbTab } from './stock/tabs/StockLhbTab';
import { StockLhbinstitutionTab } from './stock/tabs/StockLhbinstitutionTab';
import { StockStrongestTab } from './stock/tabs/StockStrongestTab';

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

const StockListPage: React.FC = () => {
  const tabItems = useMemo(
    () => [
      {
        key: 'basic',
        label: '基础信息',
        children: <StockBasicTab />,
      },
      {
        key: 'company',
        label: '上市公司基本信息',
        children: <StockCompanyTab />,
      },
      {
        key: 'ipo',
        label: 'IPO新股列表',
        children: <StockIpoTab />,
      },
      {
        key: 'daily',
        label: 'A股日线行情',
        children: <StockDailyTab />,
      },
      {
        key: 'dailybasic',
        label: '每日指标',
        children: <StockDailybasicTab />,
      },
      {
        key: 'income',
        label: '利润表',
        children: <StockIncomeTab />,
      },
      {
        key: 'balancesheet',
        label: '资产负债表',
        children: <StockBalancesheetTab />,
      },
      {
        key: 'business',
        label: '主营业务构成',
        children: <StockBusinessTab />,
      },
      {
        key: 'report',
        label: '财报披露日期表',
        children: <StockReportTab />,
      },
      {
        key: 'shareholder',
        label: '股东增减持',
        children: <StockShareholderTab />,
      },
      {
        key: 'repurchase',
        label: '股票回购',
        children: <StockRepurchaseTab />,
      },
      {
        key: 'recommend',
        label: '券商每月荐股',
        children: <StockRecommendTab />,
      },
      {
        key: 'hsgt',
        label: '沪深港股通持股明细',
        children: <StockHsgtTab />,
      },
      {
        key: 'margin',
        label: '融资融券交易汇总',
        children: <StockMarginTab />,
      },
      {
        key: 'transfer',
        label: '转融资交易汇总',
        children: <StockTransferTab />,
      },
      {
        key: 'thsconcept',
        label: '同花顺概念板块资金流向',
        children: <StockThsconceptTab />,
      },
      {
        key: 'thsindustry',
        label: '同花顺行业资金流向',
        children: <StockThsindustryTab />,
      },
      {
        key: 'dcconcept',
        label: '东财概念及行业板块资金流向',
        children: <StockDcconceptTab />,
      },
      {
        key: 'lhb',
        label: '龙虎榜每日明细',
        children: <StockLhbTab />,
      },
      {
        key: 'lhbinstitution',
        label: '龙虎榜机构明细',
        children: <StockLhbinstitutionTab />,
      },
      // {
      //   key: 'strongest',
      //   label: '最强板块统计',
      //   children: <StockStrongestTab />,
      // },
    ],
    []
  );

  return (
    <>
      <PageTitle>数据市场 · 股票数据</PageTitle>
      <StyledTabs defaultActiveKey="basic" items={tabItems} type="card" />
    </>
  );
};

export default StockListPage;

