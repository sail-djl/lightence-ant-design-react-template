import React from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { Card, Typography, Statistic, Space } from 'antd';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts-for-react';
import { currentMarketData, subRadarConfigs, historyData } from './mocks/marketData.mock';

const { Title, Text } = Typography;

const LiquidityPage: React.FC = () => {
  const config = subRadarConfigs.Liquidity;
  const currentSubData = currentMarketData.subRadar.Liquidity;

  // Liquidity 子雷达图
  const liquidityRadarOption: EChartsOption = {
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
            name: '货币供给',
            itemStyle: { color: '#722ed1' },
            areaStyle: { opacity: 0.3 },
            symbolSize: 6,
          },
        ],
      },
    ],
  };

  // Liquidity 历史趋势图
  const liquidityTrendOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['M2 增速', '社融增量'] },
    xAxis: {
      type: 'category',
      data: historyData.map((d) => d.date),
    },
    yAxis: [
      { type: 'value', name: 'M2 增速 (%)', position: 'left' },
      { type: 'value', name: '社融增量 (万亿)', position: 'right' },
    ],
    series: [
      {
        name: 'M2 增速',
        type: 'line',
        data: [10.1, 10.2, 10.25, 10.3, 10.3, 10.28],
        smooth: true,
        itemStyle: { color: '#722ed1' },
      },
      {
        name: '社融增量',
        type: 'line',
        yAxisIndex: 1,
        data: [2.3, 2.35, 2.4, 2.45, 2.45, 2.42],
        smooth: true,
        itemStyle: { color: '#cf1322' },
      },
    ],
  };

  return (
    <>
      <PageTitle>流动性与货币条件</PageTitle>
      <BaseRow gutter={[16, 16]}>
        <BaseCol span={24}>
          <Card>
            <Title level={2}>流动性 / 货币条件 (Liquidity)</Title>
            <Text type="secondary">回答：资金松不松？(数量层)</Text>
          </Card>
        </BaseCol>

        {/* 关键指标 */}
        <BaseCol xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="M2 增速" value={10.3} suffix="%" valueStyle={{ color: '#722ed1' }} />
          </Card>
        </BaseCol>
        <BaseCol xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="社融增量" value={2.45} suffix="万亿" valueStyle={{ color: '#333' }} />
          </Card>
        </BaseCol>
        <BaseCol xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="OMO 本周" value={1800} suffix="亿" valueStyle={{ color: '#cf1322' }} />
          </Card>
        </BaseCol>

        {/* 流动性结构雷达图 */}
        <BaseCol xs={24} lg={12}>
          <Card title="货币供给结构雷达">
            <ReactECharts option={liquidityRadarOption} style={{ height: '400px' }} />
          </Card>
        </BaseCol>

        {/* Liquidity 历史趋势 */}
        <BaseCol xs={24} lg={12}>
          <Card title="流动性历史趋势">
            <ReactECharts option={liquidityTrendOption} style={{ height: '400px' }} />
          </Card>
        </BaseCol>

        {/* 详细说明 */}
        <BaseCol span={24}>
          <Card title="维度说明">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={5}>核心特征</Title>
                <Text>
                  货币供给趋势、社融结构、OMO/MLF/PSL操作、信用修复程度、Phase内的变化对比（P1→P2）
                </Text>
              </div>
              <div>
                <Title level={5}>核心指标</Title>
                <Text>M2、社融、OMO净投放、MLF/PSL方向、存单存量</Text>
              </div>
              <div>
                <Title level={5}>使用规则</Title>
                <Text>只看供给扩张，不看价格</Text>
              </div>
              <div>
                <Title level={5}>使用场景</Title>
                <Text>给&ldquo;为什么钱不好赚 / 为什么资金不进股市&rdquo;一个答案</Text>
              </div>
            </Space>
          </Card>
        </BaseCol>
      </BaseRow>
    </>
  );
};

export default LiquidityPage;


