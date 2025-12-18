import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { InputNumber } from '@app/components/common/inputs/InputNumber/InputNumber';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseChart } from '@app/components/common/charts/BaseChart';
import { EChartsOption } from 'echarts-for-react';
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import { AppDate } from '@app/constants/Dates';
import { Dates } from '@app/constants/Dates';
import { 
  getETFList, 
  getPolarizationData, 
  getDeviationData, 
  getDeviationSummary,
  getAccumulativeData,
  ETFInfo,
  DeviationData,
  DeviationSummary,
  PolarizationData,
  AccumulativeData,
} from '@app/api/polarization.api';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { setSelectedFund1, setSelectedFund2 } from '@app/store/slices/polarizationSlice';
import * as S from './PolarizationModelPage.styles';

// TIME_RANGES 将在组件内使用 t() 函数动态生成

const FUND_BASKET_DATA = [
  { name: '创业', multiplier: 4, amount: '18k' },
  { name: '上证', multiplier: 4, amount: '18k' },
  { name: '深指', multiplier: 1, amount: '4.5k' },
  { name: '现金', multiplier: 1, amount: '2.5k' },
  { name: '加仓', multiplier: 'n', amount: '动态' },
];

const MIN_REVENUE_DATA = [
  { key: '1', operation: '1k/天', daily: '5/天(0.5%,0.05%)', weekly: '25/周(2.5%,0.25%)', monthly: '105/月(10.5%,1.05%)', yearly: '1250/年(125%,12.5%)' },
  { key: '2', operation: '2k/天', daily: '10/天(0.5%,0.05%)', weekly: '50/周(2.5%,0.25%)', monthly: '210/月(10.5%,1.05%)', yearly: '2500/年(125%,12.5%)' },
  { key: '3', operation: '2.5k/天', daily: '12.5/天(0.5%,0.05%)', weekly: '62.5/周(2.5%,0.25%)', monthly: '262.5/月(10.5%,1.05%)', yearly: '3150/年(125%,12.5%)' },
];

const MAX_REVENUE_DATA = [
  { key: '1', operation: '1k/天', daily: '10/天(1%,0.1%)', weekly: '50/周(5%,0.5%)', monthly: '210/月(21%,2.1%)', yearly: '2500/年(250%,25%)' },
  { key: '2', operation: '2k/天', daily: '20/天(1%,0.1%)', weekly: '100/周(5%,0.5%)', monthly: '420/月(21%,2.1%)', yearly: '5000/年(250%,25%)' },
  { key: '3', operation: '2.5k/天', daily: '25/天(1%,0.1%)', weekly: '125/周(5%,0.5%)', monthly: '525/月(21%,2.1%)', yearly: '6250/年(250%,25%)' },
];

export const PolarizationModelPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  // 从 store 读取上次选中的基金
  const storedFund1 = useAppSelector((state) => state.polarization.selectedFund1);
  const storedFund2 = useAppSelector((state) => state.polarization.selectedFund2);
  
  // 调试信息（开发环境）
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Current language:', i18n.language);
      console.log('Translation test:', t('polarization.title'));
    }
  }, [t, i18n.language]);
  
  // 时间范围选项（使用国际化）
  const TIME_RANGES = useMemo(() => [
    { value: 7, label: t('polarization.timeRange.week1') },
    { value: 30, label: t('polarization.timeRange.month1') },
    { value: 90, label: t('polarization.timeRange.month3') },
    { value: 180, label: t('polarization.timeRange.month6') },
    { value: 365, label: t('polarization.timeRange.year1') },
    { value: 1095, label: t('polarization.timeRange.year3') },
    { value: 1825, label: t('polarization.timeRange.year5') },
  ], [t]);
  
  const [etfList, setEtfList] = useState<ETFInfo[]>([]);
  // 使用 store 中的值作为初始值，如果没有则使用默认值
  const [etf1, setEtf1] = useState<string>(storedFund1 || '510300');
  const [etf2, setEtf2] = useState<string>(storedFund2 || '510500');
  const [timeRange, setTimeRange] = useState<number>(7);
  const [accumulativeTimeRange, setAccumulativeTimeRange] = useState<number>(365); // 累加收益图表独立的时间范围，默认1年
  const [accumulativeDateRange, setAccumulativeDateRange] = useState<[AppDate | null, AppDate | null]>([null, null]); // 自定义日期范围
  const [operationAmount, setOperationAmount] = useState<number>(2.5);
  const [deviationData, setDeviationData] = useState<DeviationData[]>([]);
  const [deviationSummary, setDeviationSummary] = useState<DeviationSummary | null>(null);
  const [polarizationData, setPolarizationData] = useState<PolarizationData | null>(null);
  const [accumulativeData, setAccumulativeData] = useState<AccumulativeData[]>([]);

  // 加载ETF列表
  useEffect(() => {
    const loadETFList = async () => {
      const list = await getETFList();
      // 调试信息（开发环境）
      if (process.env.NODE_ENV === 'development' && list.length > 0) {
        console.log('📊 Fund list loaded:', list.length, 'funds');
        console.log('📊 First fund sample:', list[0]);
        console.log('📊 First fund navDate:', list[0]?.navDate);
        // 检查 001593.OF 的数据
        const fund001593 = list.find(f => f.code === '001593.OF');
        if (fund001593) {
          console.log('📊 Found 001593.OF in list:', fund001593);
          console.log('📊 001593.OF changePercent:', fund001593.changePercent, 'type:', typeof fund001593.changePercent);
          console.log('📊 001593.OF price:', fund001593.price, 'type:', typeof fund001593.price);
          console.log('📊 001593.OF navDate:', fund001593.navDate);
        } else {
          console.warn('⚠️ 001593.OF not found in fund list');
        }
      }
      setEtfList(list);
      
      // 如果列表加载完成，且 store 中有保存的值，验证这些值是否在列表中
      if (list.length > 0) {
        // 验证并设置基准基金
        if (storedFund1 && list.find(e => e.code === storedFund1)) {
          // 如果保存的基金在列表中，使用保存的值
          setEtf1(storedFund1);
        } else if (!storedFund1) {
          // 如果没有保存的值，使用默认值或列表中的第一个
          const firstFund = list[0]?.code || '510300';
          setEtf1(firstFund);
          dispatch(setSelectedFund1(firstFund));
        } else {
          // 如果保存的基金不在列表中，使用列表中的第一个
          const firstFund = list[0]?.code || '510300';
          setEtf1(firstFund);
          dispatch(setSelectedFund1(firstFund));
        }
        
        // 验证并设置对比基金
        if (storedFund2 && list.find(e => e.code === storedFund2)) {
          // 如果保存的基金在列表中，使用保存的值
          setEtf2(storedFund2);
        } else if (!storedFund2) {
          // 如果没有保存的值，使用默认值或列表中的第二个（或第一个如果只有一个）
          const secondFund = list[1]?.code || list[0]?.code || '510500';
          setEtf2(secondFund);
          dispatch(setSelectedFund2(secondFund));
        } else {
          // 如果保存的基金不在列表中，使用列表中的第二个（或第一个如果只有一个）
          const secondFund = list[1]?.code || list[0]?.code || '510500';
          setEtf2(secondFund);
          dispatch(setSelectedFund2(secondFund));
        }
      }
    };
    loadETFList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 当基金选择改变时，保存到 store
  const handleFund1Change = (value: unknown) => {
    const fundValue = typeof value === 'string' ? value : String(value);
    setEtf1(fundValue);
    dispatch(setSelectedFund1(fundValue));
  };

  const handleFund2Change = (value: unknown) => {
    const fundValue = typeof value === 'string' ? value : String(value);
    setEtf2(fundValue);
    dispatch(setSelectedFund2(fundValue));
  };

  // 获取ETF信息，并确保数值字段为数字类型
  const etf1Info = useMemo(() => {
    const info = etfList.find(e => e.code === etf1);
    if (info) {
      // 调试日志：检查 001593.OF 的原始数据
      if (etf1 === '001593.OF' && process.env.NODE_ENV === 'development') {
        console.log('🔍 etf1Info raw data for 001593.OF:', info);
        console.log('🔍 changePercent raw:', info.changePercent, 'type:', typeof info.changePercent);
        console.log('🔍 price raw:', info.price, 'type:', typeof info.price);
      }
      const price = Number(info.price) || 0;
      const changePercent = Number(info.changePercent) || 0;
      if (etf1 === '001593.OF' && process.env.NODE_ENV === 'development') {
        console.log('🔍 changePercent converted:', changePercent);
        console.log('🔍 price converted:', price);
      }
      return {
        ...info,
        price,
        changePercent,
      };
    }
    return info;
  }, [etfList, etf1]);
  
  const etf2Info = useMemo(() => {
    const info = etfList.find(e => e.code === etf2);
    if (info) {
      return {
        ...info,
        price: Number(info.price) || 0,
        changePercent: Number(info.changePercent) || 0,
      };
    }
    return info;
  }, [etfList, etf2]);

  // 加载偏差数据
  useEffect(() => {
    if (etf1 && etf2 && etf1 !== etf2) {
      const loadData = async () => {
        const [devData, summary, polarData] = await Promise.all([
          getDeviationData(etf1, etf2, timeRange),
          getDeviationSummary(etf1, etf2),
          getPolarizationData(etf1, etf2),
        ]);
        // 调试：检查偏差数据格式
        if (process.env.NODE_ENV === 'development' && devData.length > 0) {
          console.log('📊 Deviation Data loaded:', devData.length, 'records');
          console.log('📊 First deviation sample:', devData[0]);
          console.log('📊 First deviation keys:', Object.keys(devData[0]));
          console.log('📊 etf1PctChg:', devData[0]?.etf1PctChg, 'type:', typeof devData[0]?.etf1PctChg);
          console.log('📊 etf2PctChg:', devData[0]?.etf2PctChg, 'type:', typeof devData[0]?.etf2PctChg);
        }
        setDeviationData(devData);
        setDeviationSummary(summary);
        setPolarizationData(polarData);
      };
      loadData();
    }
  }, [etf1, etf2, timeRange]);

  // 加载累加数据（使用独立的时间范围或自定义日期范围）
  useEffect(() => {
    if (etf1 && etf2 && etf1 !== etf2) {
      const loadAccumulativeData = async () => {
        let accumData: AccumulativeData[] = [];
        if (accumulativeDateRange[0] && accumulativeDateRange[1]) {
          // 使用自定义日期范围
          const startDate = Dates.format(accumulativeDateRange[0], 'YYYY-MM-DD');
          const endDate = Dates.format(accumulativeDateRange[1], 'YYYY-MM-DD');
          accumData = await getAccumulativeData(etf1, etf2, undefined, startDate, endDate);
        } else {
          // 使用固定时间范围
          accumData = await getAccumulativeData(etf1, etf2, accumulativeTimeRange);
        }
        setAccumulativeData(accumData);
      };
      loadAccumulativeData();
    }
  }, [etf1, etf2, accumulativeTimeRange, accumulativeDateRange]);

  // 计算操作资金
  const fundAmount = operationAmount * 9;
  const cashAmount = operationAmount;
  const totalAmount = fundAmount + cashAmount;

  // 生成累加图表配置
  const accumulativeChartOption = useMemo((): EChartsOption => {
    if (accumulativeData.length === 0) {
      return {};
    }

    const dates = accumulativeData.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
    });
    const stableLine = accumulativeData.map(d => d.stableLine);
    const profitLine = accumulativeData.map(d => d.profitLine);

    // 计算平均值（只计算稳定线的平均值）
    const stableValues = stableLine.filter(v => typeof v === 'number' && !isNaN(v));
    const averageValue = stableValues.length > 0 
      ? stableValues.reduce((sum, val) => sum + val, 0) / stableValues.length 
      : 0;

    return {
      title: {
        text: `${etf1Info?.name || ''} vs ${etf2Info?.name || ''} - ${TIME_RANGES.find(r => r.value === accumulativeTimeRange)?.label}累加收益`,
        left: 'center',
        textStyle: { fontSize: 14 },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: (params: any) => {
          let result = `${params[0].axisValue}<br/>`;
          params.forEach((param: any) => {
            const value = typeof param.value === 'number' ? param.value.toFixed(2) : param.value;
            result += `${param.marker}${param.seriesName}: ${value}%<br/>`;
          });
          return result;
        },
      },
      legend: {
        data: ['稳定线', '收益线'],
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
        data: dates,
      },
      yAxis: {
        type: 'value',
        name: '累加收益(%)',
        axisLabel: {
          formatter: '{value}%',
        },
        splitLine: {
          show: true,
        },
      },
      series: [
        {
          name: '稳定线',
          type: 'line',
          smooth: true,
          data: stableLine,
          lineStyle: { color: '#1890ff', width: 2 },
          itemStyle: { color: '#1890ff' },
          markLine: {
            silent: true,
            data: [
              {
                yAxis: 0,
                lineStyle: {
                  color: '#ff4d4f',
                  type: 'dashed',
                  width: 2,
                },
                label: {
                  show: true,
                  position: 'end',
                  formatter: 'y = 0',
                  color: '#ff4d4f',
                },
              },
              {
                yAxis: -5,
                lineStyle: {
                  color: '#faad14',
                  type: 'dashed',
                  width: 2,
                },
                label: {
                  show: true,
                  position: 'end',
                  formatter: 'y = -5',
                  color: '#faad14',
                },
              },
              {
                yAxis: -10,
                lineStyle: {
                  color: '#ff4d4f',
                  type: 'dashed',
                  width: 2,
                },
                label: {
                  show: true,
                  position: 'end',
                  formatter: 'y = -10',
                  color: '#ff4d4f',
                },
              },
              {
                yAxis: averageValue,
                lineStyle: {
                  color: '#722ed1',
                  type: 'dashed',
                  width: 2,
                },
                label: {
                  show: true,
                  position: 'end',
                  formatter: `y = ${averageValue.toFixed(2)}`,
                  color: '#722ed1',
                },
              },
            ],
          },
        },
        {
          name: '收益线',
          type: 'line',
          smooth: true,
          data: profitLine,
          lineStyle: { color: '#52c41a', width: 2 },
          itemStyle: { color: '#52c41a' },
        },
      ],
    };
  }, [accumulativeData, etf1Info, etf2Info, accumulativeTimeRange, t, TIME_RANGES]);

  // 生成偏差图表配置
  const deviationChartOption = useMemo((): EChartsOption => {
    if (deviationData.length === 0) {
      return {};
    }

    const dates = deviationData.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
    });
    const deviationValues = deviationData.map(d => d.deviation);
    const etf1PctChg = deviationData.map(d => d.etf1PctChg);
    const etf2PctChg = deviationData.map(d => d.etf2PctChg);

    // 计算所有数据的范围（涨跌幅和偏差趋势），用于统一两个Y轴的刻度范围
    const allPctChg = [...etf1PctChg, ...etf2PctChg];
    const pctChgMin = Math.min(...allPctChg);
    const pctChgMax = Math.max(...allPctChg);
    const deviationMin = Math.min(...deviationValues);
    const deviationMax = Math.max(...deviationValues);
    
    // 取两个范围的并集，确保两个Y轴使用相同的刻度范围
    const unifiedMin = Math.min(pctChgMin, deviationMin);
    const unifiedMax = Math.max(pctChgMax, deviationMax);
    const padding = (unifiedMax - unifiedMin) * 0.1 || 0.1;
    const unifiedAxisMin = unifiedMin - padding;
    const unifiedAxisMax = unifiedMax + padding;

    return {
      title: {
        text: `${etf1Info?.name || ''} vs ${etf2Info?.name || ''} - ${TIME_RANGES.find(r => r.value === timeRange)?.label}${t('polarization.deviation.trend')}`,
        left: 'center',
        textStyle: { fontSize: 14 },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: (params: any) => {
          let result = `${params[0].axisValue}<br/>`;
          params.forEach((param: any) => {
            const value = typeof param.value === 'number' ? param.value.toFixed(2) : param.value;
            result += `${param.marker}${param.seriesName}: ${value}%<br/>`;
          });
          return result;
        },
      },
      legend: {
        data: [
          `${etf1Info?.name || ''} ${t('polarization.objectSelection.change')}`,
          `${etf2Info?.name || ''} ${t('polarization.objectSelection.change')}`,
          t('polarization.deviation.trend'),
        ],
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
        data: dates,
      },
      yAxis: [
        {
          type: 'value',
          name: `${t('polarization.objectSelection.change')}(%)`,
          position: 'left',
          min: unifiedAxisMin,
          max: unifiedAxisMax,
          axisLabel: {
            formatter: '{value}%',
          },
        },
        {
          type: 'value',
          name: `${t('polarization.deviation.trend')}(%)`,
          position: 'right',
          min: unifiedAxisMin,
          max: unifiedAxisMax,
          axisLabel: {
            formatter: '{value}%',
          },
        },
      ],
      series: [
        {
          name: `${etf1Info?.name || ''} ${t('polarization.objectSelection.change')}`,
          type: 'line',
          smooth: true,
          data: etf1PctChg,
          yAxisIndex: 0,
          lineStyle: { color: '#1890ff', width: 1.5 },
          itemStyle: { color: '#1890ff' },
        },
        {
          name: `${etf2Info?.name || ''} ${t('polarization.objectSelection.change')}`,
          type: 'line',
          smooth: true,
          data: etf2PctChg,
          yAxisIndex: 0,
          lineStyle: { color: '#f5222d', width: 1.5 },
          itemStyle: { color: '#f5222d' },
        },
        {
          name: t('polarization.deviation.trend'),
          type: 'line',
          smooth: true,
          data: deviationValues,
          yAxisIndex: 1,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(140, 140, 140, 0.3)' },
                { offset: 1, color: 'rgba(140, 140, 140, 0.1)' },
              ],
            },
          },
          lineStyle: { color: '#8c8c8c', width: 2 },
          itemStyle: { color: '#8c8c8c' },
        },
      ],
    };
  }, [deviationData, etf1Info, etf2Info, timeRange, t, TIME_RANGES]);

  // 生成偏振度趋势图
  const polarizationTrendOption = useMemo((): EChartsOption => {
    if (deviationData.length === 0) {
      return {};
    }

    const dates = deviationData.slice(-30).map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
    });
    const trendData = deviationData.slice(-30).map(d => d.deviation);

    return {
      title: {
        text: `${t('polarization.trend.title')} (${t('polarization.timeRange.month1')})`,
        left: 'center',
        textStyle: { fontSize: 12 },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates,
      },
      yAxis: {
        type: 'value',
        name: t('polarization.overview.title'),
        min: 0,
        max: 1,
      },
      series: [{
        name: t('polarization.overview.title'),
        type: 'line',
        smooth: true,
        data: trendData,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(114, 46, 209, 0.3)' },
              { offset: 1, color: 'rgba(114, 46, 209, 0.1)' },
            ],
          },
        },
        lineStyle: { color: '#722ed1', width: 2 },
        itemStyle: { color: '#722ed1' },
      }],
    };
  }, [deviationData, t, TIME_RANGES]);

  const etfOptions = etfList.map(etf => ({
    value: etf.code,
    label: `${etf.name} (${etf.code})`,
  }));

  // 基金选择器搜索过滤函数（支持按代码或名称搜索）
  const filterOption = (input: string, option?: any) => {
    if (!option || !input) return true;
    const searchText = input.toLowerCase().trim();
    if (!searchText) return true;
    
    const label = String(option.label || '').toLowerCase();
    const value = String(option.value || '').toLowerCase();
    
    // 支持按基金代码或名称搜索（label 格式: "基金名称 (代码)"）
    // 可以搜索完整标签、代码或名称部分
    return label.includes(searchText) || value.includes(searchText);
  };

  return (
    <>
      <PageTitle>{t('polarization.title')}</PageTitle>
      <S.Container>
        {/* 页面标题 */}
        <S.Header>
          <h1>🔮 {t('polarization.pageTitle')}</h1>
          <p>{t('polarization.subtitle')}</p>
        </S.Header>

        {/* 偏振对象选择 */}
        <BaseCard title={t('polarization.objectSelection.title')}>
          <BaseRow gutter={[20, 20]}>
            <BaseCol xs={24} md={12}>
              <S.EtfSelectorCard $active={!!etf1Info}>
                <S.EtfSelectorLabel>📊 {t('polarization.objectSelection.benchmark')}</S.EtfSelectorLabel>
                <BaseSelect
                  value={etf1}
                  onChange={handleFund1Change}
                  options={etfOptions}
                  style={{ width: '100%' }}
                  showSearch
                  placeholder={t('polarization.objectSelection.searchPlaceholder')}
                  filterOption={filterOption}
                  optionFilterProp="label"
                />
                {etf1Info && (
                  <S.EtfInfo>
                    <S.EtfInfoRow>
                      {(() => {
                        const changePercent = Number(etf1Info.changePercent) || 0;
                        const price = Number(etf1Info.price) || 0;
                        // 调试：检查显示时的数据
                        if (etf1 === '001593.OF' && process.env.NODE_ENV === 'development') {
                          console.log('🎨 Display: etf1Info:', etf1Info);
                          console.log('🎨 Display: changePercent:', changePercent, 'raw:', etf1Info.changePercent);
                          console.log('🎨 Display: price:', price, 'raw:', etf1Info.price);
                        }
                        return (
                          <>
                            <span>{t('polarization.objectSelection.change')}: <strong>{changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%</strong></span>
                            <span>|</span>
                            <span>{t('polarization.objectSelection.price')}: <strong>{price.toFixed(2)}</strong></span>
                            {etf1Info.navDate && etf1Info.navDate !== 'null' && etf1Info.navDate !== 'None' && etf1Info.navDate.trim() !== '' && (
                              <>
                                <span>|</span>
                                <span>({etf1Info.navDate})</span>
                              </>
                            )}
                          </>
                        );
                      })()}
                    </S.EtfInfoRow>
                  </S.EtfInfo>
                )}
              </S.EtfSelectorCard>
            </BaseCol>
            <BaseCol xs={24} md={12}>
              <S.EtfSelectorCard $active={!!etf2Info}>
                <S.EtfSelectorLabel>📈 {t('polarization.objectSelection.comparison')}</S.EtfSelectorLabel>
                <BaseSelect
                  value={etf2}
                  onChange={handleFund2Change}
                  options={etfOptions}
                  style={{ width: '100%' }}
                  showSearch
                  placeholder={t('polarization.objectSelection.searchPlaceholder')}
                  filterOption={filterOption}
                  optionFilterProp="label"
                />
                {etf2Info && (
                  <S.EtfInfo>
                    <S.EtfInfoRow>
                      <span>{t('polarization.objectSelection.change')}: <strong>{(Number(etf2Info.changePercent) || 0) >= 0 ? '+' : ''}{(Number(etf2Info.changePercent) || 0).toFixed(2)}%</strong></span>
                      <span>|</span>
                      <span>{t('polarization.objectSelection.price')}: <strong>{(Number(etf2Info.price) || 0).toFixed(2)}</strong></span>
                      {etf2Info.navDate && 
                       etf2Info.navDate !== 'null' && 
                       etf2Info.navDate !== 'None' && 
                       typeof etf2Info.navDate === 'string' &&
                       etf2Info.navDate.trim() !== '' && (
                        <>
                          <span>|</span>
                          <span>({etf2Info.navDate})</span>
                        </>
                      )}
                    </S.EtfInfoRow>
                  </S.EtfInfo>
                )}
              </S.EtfSelectorCard>
            </BaseCol>
          </BaseRow>

          {/* 累加收益图表 */}
          {etf1 && etf2 && etf1 !== etf2 && (
            <S.DeviationDisplay style={{ marginBottom: '24px' }}>
              <S.SectionTitle>累加收益对比</S.SectionTitle>
              
              {/* 时间范围选择 */}
              <S.TimeRangeSelector>
                {TIME_RANGES.map(range => (
                  <BaseButton
                    key={range.value}
                    type={accumulativeTimeRange === range.value && !accumulativeDateRange[0] ? 'primary' : 'default'}
                    onClick={() => {
                      setAccumulativeTimeRange(range.value);
                      setAccumulativeDateRange([null, null]); // 清空日期范围
                    }}
                  >
                    {range.label}
                  </BaseButton>
                ))}
              </S.TimeRangeSelector>
              
              {/* 自定义日期范围选择 */}
              <div style={{ marginTop: '12px', marginBottom: '20px' }}>
                <DayjsDatePicker.RangePicker
                  value={accumulativeDateRange}
                  onChange={(dates) => {
                    if (dates && dates[0] && dates[1]) {
                      setAccumulativeDateRange([dates[0], dates[1]]);
                      setAccumulativeTimeRange(0); // 清空固定时间范围
                    } else {
                      setAccumulativeDateRange([null, null]);
                      setAccumulativeTimeRange(365); // 恢复默认时间范围
                    }
                  }}
                  format="YYYY-MM-DD"
                  placeholder={['开始日期', '结束日期']}
                  style={{ width: '100%', maxWidth: '400px' }}
                />
              </div>

              {accumulativeData.length > 0 ? (
                <BaseChart
                  option={accumulativeChartOption}
                  height="350px"
                />
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                  {t('polarization.loadingData')}
                </div>
              )}
            </S.DeviationDisplay>
          )}

          {/* 偏差数据展示 */}
          {etf1 && etf2 && etf1 !== etf2 && deviationSummary && (
            <S.DeviationDisplay>
              <S.SectionTitle>{t('polarization.deviation.title')}</S.SectionTitle>
              
              {/* 时间范围选择 */}
              <S.TimeRangeSelector>
                {TIME_RANGES.map(range => (
                  <BaseButton
                    key={range.value}
                    type={timeRange === range.value ? 'primary' : 'default'}
                    onClick={() => setTimeRange(range.value)}
                  >
                    {range.label}
                  </BaseButton>
                ))}
              </S.TimeRangeSelector>

              {/* 偏差摘要 */}
              <BaseRow gutter={[16, 16]}>
                <BaseCol xs={12} sm={6}>
                  <S.DeviationSummaryCard>
                    <div>{t('polarization.deviation.today')}</div>
                    <S.DeviationValue>{deviationSummary.today != null ? deviationSummary.today.toFixed(3) : '--'}</S.DeviationValue>
                  </S.DeviationSummaryCard>
                </BaseCol>
                <BaseCol xs={12} sm={6}>
                  <S.DeviationSummaryCard>
                    <div>{t('polarization.deviation.weekAvg')}</div>
                    <S.DeviationValue>{deviationSummary.weekAvg != null ? deviationSummary.weekAvg.toFixed(3) : '--'}</S.DeviationValue>
                  </S.DeviationSummaryCard>
                </BaseCol>
                <BaseCol xs={12} sm={6}>
                  <S.DeviationSummaryCard>
                    <div>{t('polarization.deviation.monthAvg')}</div>
                    <S.DeviationValue>{deviationSummary.monthAvg != null ? deviationSummary.monthAvg.toFixed(3) : '--'}</S.DeviationValue>
                  </S.DeviationSummaryCard>
                </BaseCol>
                <BaseCol xs={12} sm={6}>
                  <S.DeviationSummaryCard>
                    <div>{t('polarization.deviation.yearAvg')}</div>
                    <S.DeviationValue>{deviationSummary.yearAvg != null ? deviationSummary.yearAvg.toFixed(3) : '--'}</S.DeviationValue>
                  </S.DeviationSummaryCard>
                </BaseCol>
              </BaseRow>

              {/* 偏差趋势图表 */}
              {deviationData.length > 0 && (
                <BaseChart
                  option={deviationChartOption}
                  height="350px"
                />
              )}
            </S.DeviationDisplay>
          )}
        </BaseCard>

        {/* 偏振度概览 */}
        <BaseCard title={t('polarization.overview.title')}>
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '16px', padding: '12px', background: '#fafafa', borderRadius: '4px', lineHeight: '1.6' }}>
            <strong>{t('polarization.overview.calculationBasis')}</strong>{t('polarization.overview.calculationDescription')}
          </div>
          {polarizationData && etf1Info && etf2Info ? (
            <BaseRow gutter={[16, 16]}>
              <BaseCol xs={24} sm={12} md={8} lg={6}>
                <S.PolarCard>
                  <div>{etf1Info.name} vs {etf2Info.name}</div>
                  <S.PolarValue>{polarizationData.currentPolarization != null ? polarizationData.currentPolarization.toFixed(3) : '--'}</S.PolarValue>
                  <S.PolarStatus>
                    {polarizationData.status === 'high' ? t('polarization.overview.statusHigh') : polarizationData.status === 'low' ? t('polarization.overview.statusLow') : t('polarization.overview.statusModerate')}
                  </S.PolarStatus>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '12px' }}>
                    <div>{t('polarization.overview.avg3Year')}: {polarizationData.avgPolarization != null ? polarizationData.avgPolarization.toFixed(3) : '--'}</div>
                    <div>{t('polarization.overview.trend')}: {polarizationData.trend === 'rising' ? `📈 ${t('polarization.overview.trendRising')}` : polarizationData.trend === 'falling' ? `📉 ${t('polarization.overview.trendFalling')}` : `➡️ ${t('polarization.overview.trendStable')}`}</div>
                  </div>
                </S.PolarCard>
              </BaseCol>
            </BaseRow>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999', fontSize: '14px' }}>
              {t('polarization.overview.selectTwoFunds')}
            </div>
          )}
        </BaseCard>

        {/* 资金篮模型 */}
        <BaseCard title={t('polarization.fundBasket.title')}>
          <BaseRow gutter={[8, 8]}>
            {FUND_BASKET_DATA.map((item, index) => (
              <BaseCol xs={8} sm={6} md={4.8} key={index}>
                <S.BasketItem>
                  <div>{item.name}</div>
                  <S.BasketMultiplier>×{item.multiplier}</S.BasketMultiplier>
                  <div style={{ fontSize: '11px', color: '#666' }}>{item.amount}</div>
                </S.BasketItem>
              </BaseCol>
            ))}
          </BaseRow>
          <div style={{ marginTop: '20px', padding: '16px', background: '#f0f2f5', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
              <strong>{t('polarization.fundBasket.description')}</strong>{t('polarization.fundBasket.descriptionText')}
            </div>
          </div>
        </BaseCard>

        {/* 操作资金计算 */}
        <BaseCard title={t('polarization.operationCapital.title')}>
          <BaseRow gutter={[8, 8]}>
            <BaseCol xs={24} sm={12} md={6}>
              <S.CalcCard>
                <S.CalcRow>
                  <span>{t('polarization.operationCapital.operationAmount')}</span>
                  <S.CalcInputWrapper>
                    <InputNumber
                      value={operationAmount}
                      onChange={(value) => setOperationAmount(typeof value === 'number' ? value : 2.5)}
                      min={0.1}
                      max={100}
                      step={0.1}
                      precision={1}
                      style={{ width: '80px' }}
                    />
                    <span style={{ fontSize: '12px', color: '#999' }}>{t('polarization.operationCapital.perDay')}</span>
                  </S.CalcInputWrapper>
                </S.CalcRow>
              </S.CalcCard>
            </BaseCol>
            <BaseCol xs={24} sm={12} md={6}>
              <S.CalcCard>
                <S.CalcRow>
                  <span>{t('polarization.operationCapital.fundAmount')}</span>
                  <S.CalcValue>{fundAmount.toFixed(1)}k ({(operationAmount * 3).toFixed(1)}*3)</S.CalcValue>
                </S.CalcRow>
              </S.CalcCard>
            </BaseCol>
            <BaseCol xs={24} sm={12} md={6}>
              <S.CalcCard>
                <S.CalcRow>
                  <span>{t('polarization.operationCapital.cashReserve')}</span>
                  <S.CalcValue>{cashAmount.toFixed(1)}k</S.CalcValue>
                </S.CalcRow>
              </S.CalcCard>
            </BaseCol>
            <BaseCol xs={24} sm={12} md={6}>
              <S.CalcCard $highlight>
                <S.CalcRow>
                  <span>{t('polarization.operationCapital.totalAmount')}</span>
                  <S.CalcValue $highlight>{totalAmount.toFixed(1)}k</S.CalcValue>
                </S.CalcRow>
              </S.CalcCard>
            </BaseCol>
          </BaseRow>
        </BaseCard>

        {/* 收益预期表格 */}
        <BaseRow gutter={[20, 20]}>
          <BaseCol xs={24} lg={12}>
            <BaseCard title={t('polarization.revenue.minExpected.title')}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
                {t('polarization.revenue.minExpected.description')}
              </div>
              <BaseTable
                columns={[
                  { title: t('polarization.revenue.minExpected.operation'), dataIndex: 'operation', key: 'operation' },
                  { title: t('polarization.revenue.minExpected.daily'), dataIndex: 'daily', key: 'daily' },
                  { title: t('polarization.revenue.minExpected.weekly'), dataIndex: 'weekly', key: 'weekly' },
                  { title: t('polarization.revenue.minExpected.monthly'), dataIndex: 'monthly', key: 'monthly' },
                  { title: t('polarization.revenue.minExpected.yearly'), dataIndex: 'yearly', key: 'yearly' },
                ]}
                dataSource={MIN_REVENUE_DATA}
                pagination={false}
                size="small"
                rowClassName={(record, index) => index === 1 ? 'highlight' : ''}
              />
            </BaseCard>
          </BaseCol>
          <BaseCol xs={24} lg={12}>
            <BaseCard title={t('polarization.revenue.maxExpected.title')}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
                {t('polarization.revenue.maxExpected.description')}
              </div>
              <BaseTable
                columns={[
                  { title: t('polarization.revenue.minExpected.operation'), dataIndex: 'operation', key: 'operation' },
                  { title: t('polarization.revenue.minExpected.daily'), dataIndex: 'daily', key: 'daily' },
                  { title: t('polarization.revenue.minExpected.weekly'), dataIndex: 'weekly', key: 'weekly' },
                  { title: t('polarization.revenue.minExpected.monthly'), dataIndex: 'monthly', key: 'monthly' },
                  { title: t('polarization.revenue.minExpected.yearly'), dataIndex: 'yearly', key: 'yearly' },
                ]}
                dataSource={MAX_REVENUE_DATA}
                pagination={false}
                size="small"
                rowClassName={(record, index) => index === 1 ? 'highlight' : ''}
              />
            </BaseCard>
          </BaseCol>
        </BaseRow>

        {/* 特殊情况处理 */}
        <BaseRow gutter={[20, 20]}>
          <BaseCol xs={24} lg={16}>
            <BaseCard title={t('polarization.specialCases.title')}>
              <BaseRow gutter={[12, 12]}>
                <BaseCol xs={24} sm={12}>
                  <S.SpecialCase>
                    <S.SpecialCaseTitle>{t('polarization.specialCases.continuousDecline.title')}</S.SpecialCaseTitle>
                    <S.SpecialCaseContent>{t('polarization.specialCases.continuousDecline.description')}</S.SpecialCaseContent>
                    <BaseButton type="primary" size="small">{t('polarization.specialCases.continuousDecline.button')}</BaseButton>
                  </S.SpecialCase>
                </BaseCol>
                <BaseCol xs={24} sm={12}>
                  <S.SpecialCase $warning>
                    <S.SpecialCaseTitle>{t('polarization.specialCases.continuousDeviation.title')}</S.SpecialCaseTitle>
                    <S.SpecialCaseContent>{t('polarization.specialCases.continuousDeviation.description')}</S.SpecialCaseContent>
                    <BaseButton type="primary" size="small">{t('polarization.specialCases.continuousDeviation.button')}</BaseButton>
                  </S.SpecialCase>
                </BaseCol>
              </BaseRow>
            </BaseCard>
          </BaseCol>
          <BaseCol xs={24} lg={8}>
            <BaseCard title={t('polarization.trend.title')}>
              {deviationData.length > 0 ? (
                <BaseChart
                  option={polarizationTrendOption}
                  height="300px"
                />
              ) : (
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                  {t('polarization.trend.noData')}
                </div>
              )}
              <div style={{ marginTop: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', borderLeft: '3px solid #722ed1', paddingLeft: '12px' }}>{t('polarization.trend.realtimeMonitoring')}</div>
                <div style={{ background: '#fafafa', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: '#666' }}>{t('polarization.trend.marketPolarization')}</span>
                    <span style={{ fontWeight: 600 }}>{t('polarization.trend.moderate')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: '#666' }}>{t('polarization.trend.operationSuggestion')}</span>
                    <span style={{ fontWeight: 600, color: '#1890ff' }}>{t('polarization.trend.normalOperation')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#666' }}>{t('polarization.trend.riskLevel')}</span>
                    <span style={{ fontWeight: 600, color: '#52c41a' }}>{t('polarization.trend.lowRisk')}</span>
                  </div>
                </div>
              </div>
            </BaseCard>
          </BaseCol>
        </BaseRow>
      </S.Container>
    </>
  );
};

export default PolarizationModelPage;

