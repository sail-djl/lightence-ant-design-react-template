import React from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { FinancialIndicators } from '@app/components/finance-dashboard/financial-indicators/FinancialIndicators';
import { StockList } from '@app/components/finance-dashboard/stock-list/StockList';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';

const ForexMarketPage: React.FC = () => {
  return (
    <>
      <PageTitle>外汇市场</PageTitle>
      <BaseRow gutter={[16, 16]}>
        <BaseCol span={24}>
          <FinancialIndicators />
        </BaseCol>
        <BaseCol span={24}>
          <StockList />
        </BaseCol>
      </BaseRow>
    </>
  );
};

export default ForexMarketPage;

