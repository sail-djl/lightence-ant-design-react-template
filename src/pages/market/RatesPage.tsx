import React from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { Card, Typography, Statistic, Space } from 'antd';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts-for-react';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { currentMarketData, subRadarConfigs, historyData } from './mocks/marketData.mock';

const { Title, Text } = Typography;

const RatesPage: React.FC = () => {
  const config = subRadarConfigs.Rates;
  const currentSubData = currentMarketData.subRadar.Rates;

  // Rates 子雷达图
  const ratesRadarOption: EChartsOption = {
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
            name: '利率结构',
            itemStyle: { color: '#1890ff' },
            areaStyle: { opacity: 0.3 },
            symbolSize: 6,
          },
        ],
      },
    ],
  };

  // Rates 历史趋势图
  const ratesTrendOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['DR007', '10Y国债收益率'] },
    xAxis: {
      type: 'category',
      data: historyData.map((d) => d.date),
    },
    yAxis: {
      type: 'value',
      name: '收益率 (%)',
    },
    series: [
      {
        name: 'DR007',
        type: 'line',
        data: [1.85, 1.82, 1.78, 1.75, 1.85, 1.83],
        smooth: true,
        itemStyle: { color: '#1890ff' },
      },
      {
        name: '10Y国债收益率',
        type: 'line',
        data: [2.68, 2.65, 2.58, 2.52, 2.68, 2.70],
        smooth: true,
        itemStyle: { color: '#52c41a' },
      },
    ],
  };

  return (
    <>
      <PageTitle>利率与资金成本</PageTitle>
      <BaseRow gutter={[16, 16]}>
        <BaseCol span={24}>
          <Card>
            <Title level={2}>利率 / 资金成本 (Rates)</Title>
            <Text type="secondary">回答：资金贵不贵？(价格层)</Text>
          </Card>
        </BaseCol>

        {/* 关键指标 */}
        <BaseCol xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="DR007"
              value={1.85}
              precision={2}
              suffix="%"
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowDownOutlined />}
            />
          </Card>
        </BaseCol>
        <BaseCol xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="10Y 国债收益率"
              value={2.68}
              precision={2}
              suffix="%"
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </BaseCol>
        <BaseCol xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="期限利差 (10Y-1Y)" value={83} suffix="bp" valueStyle={{ color: '#1890ff' }} />
          </Card>
        </BaseCol>
        <BaseCol xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="中美利差" value={-150} suffix="bp" valueStyle={{ color: '#faad14' }} />
          </Card>
        </BaseCol>

        {/* 利率结构雷达图 */}
        <BaseCol xs={24} lg={12}>
          <Card title="利率结构雷达">
            <ReactECharts option={ratesRadarOption} style={{ height: '400px' }} />
          </Card>
        </BaseCol>

        {/* Rates 历史趋势 */}
        <BaseCol xs={24} lg={12}>
          <Card title="利率历史趋势">
            <ReactECharts option={ratesTrendOption} style={{ height: '400px' }} />
          </Card>
        </BaseCol>

        {/* 详细说明 */}
        <BaseCol span={24}>
          <Card title="维度说明">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={5}>核心特征</Title>
                <Text>
                  利率结构历史（短端/长端）、期限利差、中美利差、Phase内的变化对比（P1→P2）
                </Text>
              </div>
              <div>
                <Title level={5}>核心指标</Title>
                <Text>短端利率（Shibor, DR007）、长端利率（国债收益率）、期限利差、中美利差</Text>
              </div>
              <div>
                <Title level={5}>使用规则</Title>
                <Text>只看价格，不看数量</Text>
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

export default RatesPage;

