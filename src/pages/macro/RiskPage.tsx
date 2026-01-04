import React from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { Card, Typography, Statistic, Alert } from 'antd';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts-for-react';
import { currentMarketData, subRadarConfigs, historyData } from './mocks/marketData.mock';

const { Title, Text } = Typography;

const RiskPage: React.FC = () => {
  const config = subRadarConfigs.Risk;
  const currentSubData = currentMarketData.subRadar.Risk;

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
            name: '风险定价',
            itemStyle: { color: '#faad14' },
            areaStyle: { opacity: 0.3 },
          },
        ],
      },
    ],
  };

  const trendOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['VIX', 'PCR', '信用利差'] },
    xAxis: {
      type: 'category',
      data: historyData.map((d) => d.date),
    },
    yAxis: [
      { type: 'value', name: 'VIX / PCR', position: 'left' },
      { type: 'value', name: '信用利差 (bp)', position: 'right' },
    ],
    series: [
      {
        name: 'VIX',
        type: 'line',
        data: [25, 23, 20, 18, 18.5, 19],
        smooth: true,
        itemStyle: { color: '#3f8600' },
      },
      {
        name: 'PCR',
        type: 'line',
        data: [1.2, 1.1, 0.95, 0.88, 0.85, 0.87],
        smooth: true,
        itemStyle: { color: '#cf1322' },
      },
      {
        name: '信用利差',
        type: 'line',
        yAxisIndex: 1,
        data: [150, 140, 130, 125, 120, 122],
        smooth: true,
        itemStyle: { color: '#1890ff' },
      },
    ],
  };

  return (
    <>
      <PageTitle>风险与波动</PageTitle>
      <BaseRow gutter={[16, 16]}>
        <BaseCol span={24}>
          <Card>
            <Title level={2}>风险与波动 (Risk)</Title>
            <Text type="secondary">系统性风险监控页 - 回答&ldquo;市场怕不怕？&rdquo;</Text>
          </Card>
        </BaseCol>

        <BaseCol xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="VIX" value={18.5} precision={1} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </BaseCol>
        <BaseCol xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="PCR" value={0.85} precision={2} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </BaseCol>
        <BaseCol xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="信用利差" value={120} suffix="bp" valueStyle={{ color: '#1890ff' }} />
          </Card>
        </BaseCol>

        <BaseCol xs={24} lg={12}>
          <Card title="风险定价结构雷达">
            <ReactECharts option={subRadarOption} style={{ height: '400px' }} />
          </Card>
        </BaseCol>

        <BaseCol xs={24} lg={12}>
          <Card title="风险指标历史趋势">
            <ReactECharts option={trendOption} style={{ height: '400px' }} />
          </Card>
        </BaseCol>

        <BaseCol span={24}>
          <Alert
            message="风险提示"
            description="系统性风险监控页。包含：VIX/PCR/利差、极值历史、与Phase的对应关系、'什么时候不该交易'。这是风控视角最喜欢的一页。"
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Card title="维度说明">
            <Text>
              系统性风险监控页。包含：VIX/PCR/利差、极值历史、与Phase的对应关系、&ldquo;什么时候不该交易&rdquo;。
              这是风控视角最喜欢的一页。
            </Text>
          </Card>
        </BaseCol>
      </BaseRow>
    </>
  );
};

export default RiskPage;

