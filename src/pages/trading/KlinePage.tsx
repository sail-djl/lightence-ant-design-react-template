import React from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { KlineChart } from '@app/components/finance-dashboard/kline-chart/KlineChart';

const KlinePage: React.FC = () => {
  return (
    <>
      <PageTitle>K线图</PageTitle>
      <BaseRow>
        <BaseCol span={24}>
          <KlineChart symbol="AAPL" interval="1d" height="700px" />
        </BaseCol>
      </BaseRow>
    </>
  );
};

export default KlinePage;
