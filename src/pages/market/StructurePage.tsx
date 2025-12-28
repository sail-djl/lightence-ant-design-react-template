import React from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { Card, Typography, Statistic } from 'antd';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts-for-react';
import { currentMarketData, subRadarConfigs, historyData } from './mocks/marketData.mock';

const { Title, Text } = Typography;

const StructurePage: React.FC = () => {
  const config = subRadarConfigs.Structure;
  const currentSubData = currentMarketData.subRadar.Structure;

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
            name: '市场广度',
            itemStyle: { color: '#52c41a' },
            areaStyle: { opacity: 0.3 },
          },
        ],
      },
    ],
  };

  const trendOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['涨跌比', '集中度', '扩散指数'] },
    xAxis: {
      type: 'category',
      data: historyData.map((d) => d.date),
    },
    yAxis: [
      { type: 'value', name: '涨跌比 / 集中度 (%)', position: 'left' },
      { type: 'value', name: '扩散指数', position: 'right' },
    ],
    series: [
      {
        name: '涨跌比',
        type: 'line',
        data: [0.5, 0.6, 1.2, 1.5, 1.85, 1.8],
        smooth: true,
        itemStyle: { color: '#3f8600' },
      },
      {
        name: '集中度',
        type: 'line',
        data: [60, 55, 45, 40, 35, 36],
        smooth: true,
        itemStyle: { color: '#cf1322' },
      },
      {
        name: '扩散指数',
        type: 'line',
        yAxisIndex: 1,
        data: [30, 35, 50, 60, 68, 67],
        smooth: true,
        itemStyle: { color: '#1890ff' },
      },
    ],
  };

  return (
    <>
      <PageTitle>市场结构与广度</PageTitle>
      <BaseRow gutter={[16, 16]}>
        <BaseCol span={24}>
          <Card>
            <Title level={2}>市场结构与广度 (Structure)</Title>
            <Text type="secondary">行情质量检测页 - 回答&ldquo;行情健康吗？&rdquo;</Text>
          </Card>
        </BaseCol>

        <BaseCol xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="涨跌比" value={1.85} precision={2} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </BaseCol>
        <BaseCol xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="集中度" value={35} suffix="%" valueStyle={{ color: '#333' }} />
          </Card>
        </BaseCol>
        <BaseCol xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="扩散指数" value={68} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </BaseCol>

        <BaseCol xs={24} lg={12}>
          <Card title="市场广度结构雷达">
            <ReactECharts option={subRadarOption} style={{ height: '400px' }} />
          </Card>
        </BaseCol>

        <BaseCol xs={24} lg={12}>
          <Card title="市场结构历史趋势">
            <ReactECharts option={trendOption} style={{ height: '400px' }} />
          </Card>
        </BaseCol>

        <BaseCol span={24}>
          <Card title="维度说明">
            <Text>
              行情质量检测页。包含：涨跌比、集中度、扩散指数、抱团vs普涨、与融资/北向的背离分析。
              这是A股特色+你体系优势的集中体现。
            </Text>
          </Card>
        </BaseCol>
      </BaseRow>
    </>
  );
};

export default StructurePage;

