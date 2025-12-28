import React from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { Card, Typography, Statistic } from 'antd';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts-for-react';
import { currentMarketData, subRadarConfigs, historyData } from './mocks/marketData.mock';

const { Title, Text } = Typography;

const ForexPage: React.FC = () => {
  const config = subRadarConfigs.FX;
  const currentSubData = currentMarketData.subRadar.FX;

  const subRadarOption: EChartsOption = {
    radar: {
      indicator: config.indicators,
      shape: 'circle',
      splitNumber: 3,
      radius: '70%',
      axisName: { color: '#666', fontSize: 12 },
      splitArea: { areaStyle: { color: ['#fff', '#f7f9fc'] } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: currentSubData,
            name: '汇率压力',
            itemStyle: { color: '#fa8c16' },
            areaStyle: { opacity: 0.3 },
          },
        ],
      },
    ],
  };

  const trendOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['USD/CNY', 'DXY'] },
    xAxis: {
      type: 'category',
      data: historyData.map((d) => d.date),
    },
    yAxis: [
      { type: 'value', name: 'USD/CNY', position: 'left' },
      { type: 'value', name: 'DXY', position: 'right' },
    ],
    series: [
      {
        name: 'USD/CNY',
        type: 'line',
        data: [7.28, 7.25, 7.18, 7.12, 7.15, 7.16],
        smooth: true,
        itemStyle: { color: '#cf1322' },
      },
      {
        name: 'DXY',
        type: 'line',
        yAxisIndex: 1,
        data: [106.5, 105.8, 104.2, 103.0, 103.4, 103.6],
        smooth: true,
        itemStyle: { color: '#1890ff' },
      },
    ],
  };

  return (
    <>
      <PageTitle>外汇与跨境资金</PageTitle>
      <BaseRow gutter={[16, 16]}>
        <BaseCol span={24}>
          <Card>
            <Title level={2}>外汇与跨境资金 (FX)</Title>
            <Text type="secondary">外部约束与输入型风险页 - 回答&ldquo;钱能不能进来？&rdquo;</Text>
          </Card>
        </BaseCol>

        <BaseCol xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="USD/CNY" value={7.15} precision={2} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </BaseCol>
        <BaseCol xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="DXY 美元指数" value={103.4} precision={1} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </BaseCol>
        <BaseCol xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="1Y 波动率" value={4.2} precision={1} suffix="%" valueStyle={{ color: '#3f8600' }} />
          </Card>
        </BaseCol>

        <BaseCol xs={24} lg={12}>
          <Card title="汇率压力结构雷达">
            <ReactECharts option={subRadarOption} style={{ height: '400px' }} />
          </Card>
        </BaseCol>

        <BaseCol xs={24} lg={12}>
          <Card title="汇率历史趋势">
            <ReactECharts option={trendOption} style={{ height: '400px' }} />
          </Card>
        </BaseCol>

        <BaseCol span={24}>
          <Card title="维度说明">
            <Text>
              外部约束与输入型风险页。包含：USD/CNY、DXY历史、波动率、与Risk/Liquidity的联动、历史Phase中的典型模式。
              这是很多平台完全没有、但你有优势的页面。
            </Text>
          </Card>
        </BaseCol>
      </BaseRow>
    </>
  );
};

export default ForexPage;

