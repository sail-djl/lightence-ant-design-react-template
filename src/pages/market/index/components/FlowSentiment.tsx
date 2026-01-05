import React from 'react';
import { Card, Typography } from 'antd';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts-for-react';

const { Title } = Typography;

export const FlowSentiment: React.FC = () => {
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
          color: (params: any) => (Number(params.value) >= 0 ? '#52c41a' : '#f5222d'),
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

  return (
    <Card title="资金流向与情绪 (Flow & Sentiment)">
      <ReactECharts option={flowChartOption} style={{ height: '300px' }} />
      <div style={{ marginTop: 20 }}>
        <Title level={5} style={{ borderLeft: '3px solid #1890ff', paddingLeft: 12 }}>
          ETF资金流
        </Title>
        <ReactECharts option={etfFlowChartOption} style={{ height: '250px' }} />
      </div>
    </Card>
  );
};

