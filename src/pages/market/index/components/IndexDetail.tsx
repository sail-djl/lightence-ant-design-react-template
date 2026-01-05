import React from 'react';
import { Card, Select } from 'antd';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts-for-react';

const { Option } = Select;

interface IndexDetailProps {
  selectedIndex: string;
  onIndexChange: (value: string) => void;
}

export const IndexDetail: React.FC<IndexDetailProps> = ({ selectedIndex, onIndexChange }) => {
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
    <Card
      title="指数详情 (Index Detail)"
      extra={
        <Select value={selectedIndex} onChange={onIndexChange} style={{ width: 150 }}>
          <Option value="000300">沪深300</Option>
          <Option value="000905">中证500</Option>
          <Option value="399006">创业板指</Option>
          <Option value="000001">上证指数</Option>
        </Select>
      }
    >
      <ReactECharts option={klineChartOption} style={{ height: '400px' }} />
    </Card>
  );
};





