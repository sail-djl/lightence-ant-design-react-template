import React, { useEffect, useState } from 'react';
import type { CallbackDataParams } from 'echarts/types/dist/shared';
import type { EChartsOption } from 'echarts-for-react';
import { BaseChart } from '@app/components/common/charts/BaseChart';
import { getKlineData, KlineData } from '@app/api/kline.api';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';
import { getDefaultTooltipStyles } from '@app/components/common/charts/BaseChart';
import { Select } from 'antd';
import { Loading } from '@app/components/common/Loading/Loading';
import * as S from './KlineChart.styles';

const { Option } = Select;

interface KlineChartProps {
  symbol?: string;
  interval?: string;
  height?: string | number;
}

export const KlineChart: React.FC<KlineChartProps> = ({
  symbol = 'AAPL',
  interval: defaultInterval = '1d',
  height = '600px',
}) => {
  const [klineData, setKlineData] = useState<KlineData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSymbol, setCurrentSymbol] = useState<string>(symbol);
  const [currentInterval, setCurrentInterval] = useState<string>(defaultInterval);
  const theme = useAppSelector((state) => state.theme.theme);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getKlineData(currentSymbol, currentInterval);
        setKlineData(data);
      } catch (error) {
        console.error('加载K线数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentSymbol, currentInterval]);

  if (loading && klineData.length === 0) {
    return <Loading />;
  }

  const option: EChartsOption = {
    title: {
      text: `${currentSymbol} K线图`,
      left: 0,
      textStyle: {
        color: themeObject[theme].textMain,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      ...getDefaultTooltipStyles(themeObject[theme]),
      formatter: (params: CallbackDataParams | CallbackDataParams[]) => {
        const paramArray = Array.isArray(params) ? params : [params];
        const first = paramArray[0];
        const dataIndex = typeof first?.dataIndex === 'number' ? first.dataIndex : undefined;
        const kline = typeof dataIndex === 'number' ? klineData[dataIndex] : undefined;

        if (first && kline) {
          return `
              <div>
                <div><strong>${first.axisValue}</strong></div>
                <div>开盘: ${kline.open}</div>
                <div>收盘: ${kline.close}</div>
                <div>最高: ${kline.high}</div>
                <div>最低: ${kline.low}</div>
                <div>成交量: ${kline.volume.toLocaleString()}</div>
              </div>
            `;
        }
        return '';
      },
    },
    grid: [
      {
        left: '10%',
        right: '8%',
        top: '15%',
        height: '60%',
      },
      {
        left: '10%',
        right: '8%',
        top: '80%',
        height: '15%',
      },
    ],
    xAxis: [
      {
        type: 'category',
        data: klineData.map((item) => item.time),
        scale: true,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: false },
        min: 'dataMin',
        max: 'dataMax',
      },
      {
        type: 'category',
        gridIndex: 1,
        data: klineData.map((item) => item.time),
        scale: true,
        boundaryGap: false,
        axisLine: { onZero: false },
        axisTick: { show: false },
        splitLine: { show: false },
        min: 'dataMin',
        max: 'dataMax',
      },
    ],
    yAxis: [
      {
        scale: true,
        splitArea: {
          show: true,
        },
        position: 'right',
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      },
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1],
        start: 70,
        end: 100,
      },
      {
        show: true,
        xAxisIndex: [0, 1],
        type: 'slider',
        top: '95%',
        start: 70,
        end: 100,
      },
    ],
    series: [
      {
        name: currentSymbol,
        type: 'candlestick',
        data: klineData.map((item) => [item.open, item.close, item.low, item.high]),
        itemStyle: {
          color: '#26a69a',
          color0: '#ef5350',
          borderColor: '#26a69a',
          borderColor0: '#ef5350',
        },
      },
      {
        name: '成交量',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: klineData.map((item) => item.volume),
        itemStyle: {
          color: (params: CallbackDataParams) => {
            const index = typeof params.dataIndex === 'number' ? params.dataIndex : 0;
            if (index > 0) {
              const current = klineData[index];
              const prev = klineData[index - 1];
              if (current && prev) {
                return current.close >= prev.close ? '#26a69a' : '#ef5350';
              }
            }
            return '#26a69a';
          },
        },
      },
    ],
  };

  return (
    <S.KlineChartWrapper>
      <S.ChartControls>
        <Select
          value={currentSymbol}
          onChange={(value) => {
            setCurrentSymbol(value as string);
          }}
          style={{ width: 120, minWidth: 120 }}
        >
          <Option value="AAPL">AAPL</Option>
          <Option value="MSFT">MSFT</Option>
          <Option value="GOOGL">GOOGL</Option>
          <Option value="TSLA">TSLA</Option>
          <Option value="BTC/USDT">BTC/USDT</Option>
          <Option value="ETH/USDT">ETH/USDT</Option>
        </Select>
        <Select
          value={currentInterval}
          onChange={(value) => {
            setCurrentInterval(value as string);
          }}
          style={{ width: 120 }}
        >
          <Option value="1m">1分钟</Option>
          <Option value="5m">5分钟</Option>
          <Option value="15m">15分钟</Option>
          <Option value="1h">1小时</Option>
          <Option value="4h">4小时</Option>
          <Option value="1d">1天</Option>
          <Option value="1w">1周</Option>
        </Select>
      </S.ChartControls>
      <BaseChart option={option} height={height} />
    </S.KlineChartWrapper>
  );
};
