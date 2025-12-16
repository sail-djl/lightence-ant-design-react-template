import React, { useState } from 'react';
import { Card, Row, Select, Typography } from 'antd';
import ReactECharts from 'echarts-for-react';
import type { CallbackDataParams } from 'echarts/types/dist/shared';
import type { EChartsOption } from 'echarts-for-react';
import { useTranslation } from 'react-i18next';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './IndexDashboardPage.styles';

const { Title, Text } = Typography;
const { Option } = Select;

interface IndexData {
  name: string;
  code: string;
  value: number;
  change: number;
  changePercent: number;
  ytd: number;
  volume: string;
  turnover: number;
  pePercentile: number;
  pbPercentile: number;
  trend: 'strong' | 'weak';
}

const mockIndexData: IndexData[] = [
  {
    name: '上证指数',
    code: '000001',
    value: 3125.68,
    change: 1.25,
    changePercent: 0.04,
    ytd: 5.32,
    volume: '3.2万亿',
    turnover: 0.85,
    pePercentile: 58.3,
    pbPercentile: 62.1,
    trend: 'strong',
  },
  {
    name: '沪深300',
    code: '000300',
    value: 3856.42,
    change: -12.35,
    changePercent: -0.32,
    ytd: 3.21,
    volume: '1.8万亿',
    turnover: 0.72,
    pePercentile: 65.3,
    pbPercentile: 68.5,
    trend: 'weak',
  },
  {
    name: '中证500',
    code: '000905',
    value: 5421.89,
    change: 28.56,
    changePercent: 0.53,
    ytd: 8.45,
    volume: '1.2万亿',
    turnover: 1.15,
    pePercentile: 45.2,
    pbPercentile: 48.7,
    trend: 'strong',
  },
  {
    name: '创业板指',
    code: '399006',
    value: 2156.78,
    change: 15.23,
    changePercent: 0.71,
    ytd: 12.34,
    volume: '0.9万亿',
    turnover: 1.45,
    pePercentile: 72.5,
    pbPercentile: 75.2,
    trend: 'strong',
  },
  {
    name: '上证50',
    code: '000016',
    value: 2654.32,
    change: -8.45,
    changePercent: -0.32,
    ytd: 2.15,
    volume: '0.6万亿',
    turnover: 0.58,
    pePercentile: 68.9,
    pbPercentile: 71.3,
    trend: 'weak',
  },
  {
    name: '科创50',
    code: '000688',
    value: 985.67,
    change: 12.34,
    changePercent: 1.27,
    ytd: 15.67,
    volume: '0.3万亿',
    turnover: 1.85,
    pePercentile: 55.4,
    pbPercentile: 58.9,
    trend: 'strong',
  },
];

const IndexDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState('000300');

  const styleHeatmapOption: EChartsOption = {
    title: {
      text: '风格相对收益热力图(%)',
      left: 'center',
      textStyle: { fontSize: 14 },
    },
    tooltip: {
      position: 'top',
      formatter: (params: CallbackDataParams) => `${params.seriesName}<br/>${params.name}: ${params.value}%`,
    },
    grid: {
      height: '60%',
      top: '15%',
    },
    xAxis: {
      type: 'category',
      data: ['1M', '3M', '6M'],
      splitArea: { show: true },
    },
    yAxis: {
      type: 'category',
      data: ['大盘', '中盘', '小盘', '成长', '价值', '高股息', '高弹性'],
      splitArea: { show: true },
    },
    visualMap: {
      min: -5,
      max: 5,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '5%',
      inRange: {
        color: ['#52c41a', '#fff', '#f5222d'],
      },
    },
    series: [
      {
        name: '相对收益',
        type: 'heatmap',
        data: [
          [0, 0, 2.3],
          [1, 0, 1.8],
          [2, 0, 1.2],
          [0, 1, 3.5],
          [1, 1, 2.9],
          [2, 1, 2.1],
          [0, 2, 4.2],
          [1, 2, 3.8],
          [2, 2, 3.1],
          [0, 3, 2.8],
          [1, 3, 2.1],
          [2, 3, 1.5],
          [0, 4, -1.2],
          [1, 4, -0.8],
          [2, 4, -0.3],
          [0, 5, -0.5],
          [1, 5, 0.2],
          [2, 5, 0.8],
          [0, 6, 3.2],
          [1, 6, 2.5],
          [2, 6, 1.9],
        ],
        label: {
          show: true,
          formatter: '{c}%',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  const styleRadarOption: EChartsOption = {
    tooltip: {},
    radar: {
      indicator: [
        { name: '大盘', max: 100 },
        { name: '成长', max: 100 },
        { name: '高弹性', max: 100 },
        { name: '流动性', max: 100 },
        { name: '估值', max: 100 },
      ],
      center: ['50%', '50%'],
      radius: '70%',
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [75, 85, 90, 80, 65],
            name: '创业板指',
            areaStyle: { opacity: 0.3 },
          },
          {
            value: [85, 45, 40, 90, 70],
            name: '沪深300',
            areaStyle: { opacity: 0.3 },
          },
          {
            value: [60, 70, 75, 70, 55],
            name: '中证500',
            areaStyle: { opacity: 0.3 },
          },
        ],
      },
    ],
  };

  const flowChartOption: EChartsOption = {
    title: {
      text: '北向资金净流入 (亿元)',
      left: 'center',
      textStyle: { fontSize: 14 },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
    },
    legend: {
      data: ['北向资金', '融资余额变化'],
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: Array.from({ length: 21 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (20 - i));
        return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      }),
    },
    yAxis: [
      {
        type: 'value',
        name: '亿元',
        position: 'left',
      },
      {
        type: 'value',
        name: '亿元',
        position: 'right',
      },
    ],
    series: [
      {
        name: '北向资金',
        type: 'bar',
        data: Array.from({ length: 21 }, () => Number((Math.random() * 100 - 50).toFixed(2))),
        itemStyle: {
          color: (params: CallbackDataParams) => (Number(params.value) >= 0 ? '#52c41a' : '#f5222d'),
        },
      },
      {
        name: '融资余额变化',
        type: 'line',
        yAxisIndex: 1,
        data: Array.from({ length: 21 }, () => Number((Math.random() * 50 - 25).toFixed(2))),
        lineStyle: { color: '#1890ff' },
        itemStyle: { color: '#1890ff' },
      },
    ],
  };

  const etfFlowChartOption: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
    },
    yAxis: {
      type: 'category',
      data: ['沪深300ETF', '中证500ETF', '创业板ETF', '科创50ETF', '上证50ETF'],
    },
    series: [
      {
        type: 'bar',
        data: [12.5, 8.3, 5.2, 3.1, 2.8],
        itemStyle: {
          color: '#1890ff',
        },
      },
    ],
  };

  const klineChartOption: EChartsOption = {
    tooltip: {
      trigger: 'axis',
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
    },
    yAxis: {
      type: 'value',
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
      <PageTitle>{t('common.index-dashboard')}</PageTitle>
      <S.Wrapper>
        <S.Header>
          <Title level={2}>📊 指数面板 - 指挥中枢</Title>
          <Text type="secondary">市场风格判断 · 仓位指导 · 策略信号</Text>
        </S.Header>

        <Card title="指数概览 (Market Overview)" style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]}>
            {mockIndexData.map((index) => (
              <BaseCol key={index.code} xs={24} sm={12} md={8} lg={6}>
                <S.IndexCard $trend={index.trend}>
                  <S.IndexCardHeader>
                    <S.IndexName>{index.name}</S.IndexName>
                    <S.FlameIcon>{index.trend === 'strong' ? '🔥' : '❄️'}</S.FlameIcon>
                  </S.IndexCardHeader>
                  <S.IndexValue>{index.value.toFixed(2)}</S.IndexValue>
                  <S.IndexChange $positive={index.changePercent >= 0}>
                    {index.changePercent >= 0 ? '+' : ''}
                    {index.change.toFixed(2)} ({index.changePercent >= 0 ? '+' : ''}
                    {index.changePercent.toFixed(2)}%)
                  </S.IndexChange>
                  <S.IndexMeta>
                    <div>
                      年内: {index.changePercent >= 0 ? '+' : ''}
                      {index.ytd.toFixed(2)}%
                    </div>
                    <div>成交: {index.volume}</div>
                    <div>
                      PE分位: {index.pePercentile.toFixed(1)}% | PB分位: {index.pbPercentile.toFixed(1)}%
                    </div>
                  </S.IndexMeta>
                </S.IndexCard>
              </BaseCol>
            ))}
          </Row>
        </Card>

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <BaseCol xs={24} lg={12}>
            <Card title="风格与行业轮动 (Style & Sector Rotation)">
              <ReactECharts option={styleHeatmapOption} style={{ height: '300px' }} />
              <div style={{ marginTop: 20 }}>
                <Title level={5} style={{ borderLeft: '3px solid #52c41a', paddingLeft: 12 }}>
                  风格雷达图
                </Title>
                <ReactECharts option={styleRadarOption} style={{ height: '300px' }} />
              </div>
            </Card>
          </BaseCol>

          <BaseCol xs={24} lg={12}>
            <Card title="资金流向与情绪 (Flow & Sentiment)">
              <ReactECharts option={flowChartOption} style={{ height: '300px' }} />
              <div style={{ marginTop: 20 }}>
                <Title level={5} style={{ borderLeft: '3px solid #1890ff', paddingLeft: 12 }}>
                  ETF资金流
                </Title>
                <ReactECharts option={etfFlowChartOption} style={{ height: '250px' }} />
              </div>
            </Card>
          </BaseCol>
        </Row>

        <Row gutter={[16, 16]}>
          <BaseCol xs={24} lg={14}>
            <Card
              title="指数详情 (Index Detail)"
              extra={
                <Select value={selectedIndex} onChange={setSelectedIndex} style={{ width: 150 }}>
                  <Option value="000300">沪深300</Option>
                  <Option value="000905">中证500</Option>
                  <Option value="399006">创业板指</Option>
                  <Option value="000001">上证指数</Option>
                </Select>
              }
            >
              <ReactECharts option={klineChartOption} style={{ height: '400px' }} />
            </Card>
          </BaseCol>

          <BaseCol xs={24} lg={10}>
            <Card title="策略信号 (Strategy Signals)">
              <S.SignalCard>
                <S.SignalItem>
                  <S.SignalLabel>仓位建议</S.SignalLabel>
                  <S.SignalValue>偏多</S.SignalValue>
                </S.SignalItem>
                <S.SignalItem>
                  <S.SignalLabel>风格倾向</S.SignalLabel>
                  <S.SignalValue>成长 / 高弹性</S.SignalValue>
                </S.SignalItem>
                <S.SignalItem>
                  <S.SignalLabel>风险灯</S.SignalLabel>
                  <S.SignalValue>
                    <S.RiskLight $color="yellow" />
                    <span>中等风险</span>
                  </S.SignalValue>
                </S.SignalItem>
                <S.SignalItem>
                  <S.SignalLabel>估值分位</S.SignalLabel>
                  <S.SignalValue>65.3%</S.SignalValue>
                </S.SignalItem>
                <S.SignalItem>
                  <S.SignalLabel>偏离度</S.SignalLabel>
                  <S.SignalValue>+2.3σ</S.SignalValue>
                </S.SignalItem>
                <S.SignalItem>
                  <S.SignalLabel>策略建议</S.SignalLabel>
                  <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.6, display: 'block', marginTop: 8 }}>
                    当前成长风格累计超额收益偏高，资金流放缓，建议减仓高弹性成长，保留部分核心资产。
                  </Text>
                </S.SignalItem>
              </S.SignalCard>
            </Card>
          </BaseCol>
        </Row>
      </S.Wrapper>
    </>
  );
};

export default IndexDashboardPage;
