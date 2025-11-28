import React from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { KlineChart } from '@app/components/finance-dashboard/kline-chart/KlineChart';
import { MarketOverview } from '@app/components/finance-dashboard/market-overview/MarketOverview';
import { StockList } from '@app/components/finance-dashboard/stock-list/StockList';
import { FinancialIndicators } from '@app/components/finance-dashboard/financial-indicators/FinancialIndicators';
import { useResponsive } from '@app/hooks/useResponsive';
import * as S from './DashboardPage.styles';

const FinanceDashboardPage: React.FC = () => {
  const { isDesktop } = useResponsive();

  const desktopLayout = (
    <BaseRow gutter={[16, 16]}>
      <BaseCol xs={24} lg={16}>
        <KlineChart symbol="AAPL" interval="1d" height="500px" />
      </BaseCol>
      <BaseCol xs={24} lg={8}>
        <MarketOverview />
      </BaseCol>
      <BaseCol xs={24}>
        <FinancialIndicators />
      </BaseCol>
      <BaseCol xs={24}>
        <StockList />
      </BaseCol>
    </BaseRow>
  );

  const mobileLayout = (
    <BaseRow gutter={[16, 16]}>
      <BaseCol span={24}>
        <KlineChart symbol="AAPL" interval="1d" height="400px" />
      </BaseCol>
      <BaseCol span={24}>
        <MarketOverview />
      </BaseCol>
      <BaseCol span={24}>
        <FinancialIndicators />
      </BaseCol>
      <BaseCol span={24}>
        <StockList />
      </BaseCol>
    </BaseRow>
  );

  return (
    <>
      <PageTitle>金融仪表盘</PageTitle>
      {isDesktop ? desktopLayout : mobileLayout}
    </>
  );
};

export default FinanceDashboardPage;

