import React from 'react';
import { Card, Typography } from 'antd';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts-for-react';

const { Title } = Typography;

export const StyleRotation: React.FC = () => {
  const styleHeatmapOption: EChartsOption = {
    title: {
      text: '风格相对收益热力图(%)',
      left: 'center',
      textStyle: { fontSize: 14 },
    },
    tooltip: {
      position: 'top',
      formatter: (params: any) => `${params.seriesName}<br/>${params.name}: ${params.value}%`,
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

  return (
    <Card title="风格与行业轮动 (Style & Sector Rotation)">
      <ReactECharts option={styleHeatmapOption} style={{ height: '300px' }} />
      <div style={{ marginTop: 20 }}>
        <Title level={5} style={{ borderLeft: '3px solid #52c41a', paddingLeft: 12 }}>
          风格雷达图
        </Title>
        <ReactECharts option={styleRadarOption} style={{ height: '300px' }} />
      </div>
    </Card>
  );
};



