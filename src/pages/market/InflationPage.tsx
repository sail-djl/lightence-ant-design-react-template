import React from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { Card, Typography, Statistic } from 'antd';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts-for-react';
import { currentMarketData, subRadarConfigs, historyData } from './mocks/marketData.mock';

const { Title, Text } = Typography;

const InflationPage: React.FC = () => {
  const config = subRadarConfigs.Inflation;
  const currentSubData = currentMarketData.subRadar.Inflation;

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
            name: '成本来源',
            itemStyle: { color: '#f5222d' },
            areaStyle: { opacity: 0.3 },
          },
        ],
      },
    ],
  };

  const trendOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Brent原油', 'LME铜', '黄金'] },
    xAxis: {
      type: 'category',
      data: historyData.map((d) => d.date),
    },
    yAxis: [
      { type: 'value', name: '原油 ($)', position: 'left' },
      { type: 'value', name: '铜 ($)', position: 'right' },
    ],
    series: [
      {
        name: 'Brent原油',
        type: 'line',
        data: [82, 83, 84, 85, 85.2, 85.5],
        smooth: true,
        itemStyle: { color: '#cf1322' },
      },
      {
        name: 'LME铜',
        type: 'line',
        yAxisIndex: 1,
        data: [8300, 8350, 8380, 8390, 8400, 8410],
        smooth: true,
        itemStyle: { color: '#3f8600' },
      },
      {
        name: '黄金',
        type: 'line',
        yAxisIndex: 1,
        data: [2020, 2025, 2028, 2030, 2030, 2032],
        smooth: true,
        itemStyle: { color: '#faad14' },
      },
    ],
  };

  return (
    <>
      <PageTitle>通胀与商品周期</PageTitle>
      <BaseRow gutter={[16, 16]}>
        <BaseCol span={24}>
          <Card>
            <Title level={2}>通胀与商品周期 (Inflation)</Title>
            <Text type="secondary">实体与金融的连接器 - 回答&ldquo;实体压力在不在？&rdquo;</Text>
          </Card>
        </BaseCol>

        <BaseCol xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="Brent 原油" value={85.2} precision={1} prefix="$" valueStyle={{ color: '#cf1322' }} />
          </Card>
        </BaseCol>
        <BaseCol xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="LME 铜" value={8400} prefix="$" valueStyle={{ color: '#3f8600' }} />
          </Card>
        </BaseCol>
        <BaseCol xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="黄金" value={2030} prefix="$" valueStyle={{ color: '#faad14' }} />
          </Card>
        </BaseCol>

        <BaseCol xs={24} lg={12}>
          <Card title="成本来源结构雷达">
            <ReactECharts option={subRadarOption} style={{ height: '400px' }} />
          </Card>
        </BaseCol>

        <BaseCol xs={24} lg={12}>
          <Card title="商品价格历史趋势">
            <ReactECharts option={trendOption} style={{ height: '400px' }} />
          </Card>
        </BaseCol>

        <BaseCol span={24}>
          <Card title="维度说明">
            <Text>
              实体与金融的连接器。包含：原油/工业金属/黄金拆解、输入型vs内需型通胀、对利率、权益估值的影响路径。
              这是把&ldquo;宏观&rdquo;真正落到&ldquo;资产定价&rdquo;的地方。
            </Text>
          </Card>
        </BaseCol>
      </BaseRow>
    </>
  );
};

export default InflationPage;

