import React from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { StockList } from '@app/components/finance-dashboard/stock-list/StockList';
import { MarketOverview } from '@app/components/finance-dashboard/market-overview/MarketOverview';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';

const StockMarketPage: React.FC = () => {
  return (
    <>
      <PageTitle>股票市场</PageTitle>
      <BaseRow gutter={[16, 16]}>
        <BaseCol xs={24} lg={8}>
          <MarketOverview />
        </BaseCol>
        <BaseCol xs={24} lg={16}>
          <StockList />
        </BaseCol>
      </BaseRow>
    </>
  );
};

export default StockMarketPage;
