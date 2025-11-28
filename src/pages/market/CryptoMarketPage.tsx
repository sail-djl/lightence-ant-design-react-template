import React from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { StockList } from '@app/components/finance-dashboard/stock-list/StockList';
import { KlineChart } from '@app/components/finance-dashboard/kline-chart/KlineChart';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';

const CryptoMarketPage: React.FC = () => {
  return (
    <>
      <PageTitle>加密货币市场</PageTitle>
      <BaseRow gutter={[16, 16]}>
        <BaseCol span={24}>
          <KlineChart symbol="BTC/USDT" interval="1d" height="500px" />
        </BaseCol>
        <BaseCol span={24}>
          <StockList />
        </BaseCol>
      </BaseRow>
    </>
  );
};

export default CryptoMarketPage;

