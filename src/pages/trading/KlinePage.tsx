import React from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts-for-react';

const KlinePage: React.FC = () => {
  // Mock K线数据
  const klineChartOption: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      }),
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      scale: true,
    },
    series: [
      {
        type: 'line',
        data: Array.from({ length: 30 }, () => Math.random() * 100 + 3800),
        smooth: true,
        lineStyle: { color: '#1890ff' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.1)' },
            ],
          },
        },
      },
    ],
  };

  return (
    <>
      <PageTitle>K线图</PageTitle>
      <BaseRow>
        <BaseCol span={24}>
          <BaseCard>
            <ReactECharts option={klineChartOption} style={{ height: '700px' }} />
          </BaseCard>
        </BaseCol>
      </BaseRow>
    </>
  );
};

export default KlinePage;
