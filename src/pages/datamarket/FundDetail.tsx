import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import { Descriptions } from 'antd';
import { FundBasic, getFundBasicList, getFundFactorList, FundFactor } from '@app/api/datamarket/fund.api';
import { BaseChart } from '@app/components/common/charts/BaseChart';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';
import { Dates } from '@app/constants/Dates';
import dayjs, { Dayjs } from 'dayjs';

const FundDetail: React.FC = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const theme = useAppSelector((state) => state.theme.theme);
  
  const [basicInfo, setBasicInfo] = useState<FundBasic | null>(null);
  const [factors, setFactors] = useState<FundFactor[]>([]);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    dayjs().subtract(1, 'year'),
    dayjs(),
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (code) {
      fetchBasicInfo();
    }
  }, [code]);

  useEffect(() => {
    if (code) {
      fetchFactors();
    }
  }, [code, dateRange]);

  const fetchBasicInfo = async () => {
    if (!code) return;
    try {
      // Use keyword search to find the fund. 
      // Ideally we should have a getFundDetail API, but this works if code is unique.
      const res = await getFundBasicList({ keyword: code, limit: 1 });
      if (res.data && res.data.length > 0) {
        setBasicInfo(res.data[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchFactors = async () => {
    if (!code) return;
    setLoading(true);
    try {
      const start = dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : undefined;
      const end = dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : undefined;
      const res = await getFundFactorList(code, start, end);
      // Data comes sorted by date DESC, reverse for chart
      setFactors([...res.data].reverse());
    } finally {
      setLoading(false);
    }
  };

  const chartOption = useMemo(() => {
    if (!factors.length) return {};

    const dates = factors.map(f => f.trade_date);
    const klineData = factors.map(f => [f.open, f.close, f.low, f.high]);
    const pctChangeData = factors.map(f => f.pct_change);

    const upColor = '#ec0000';
    const upBorderColor = '#8A0000';
    const downColor = '#00da3c';
    const downBorderColor = '#008F28';

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      legend: {
        data: ['日K', '涨跌幅'],
        textStyle: {
            color: themeObject[theme].textMain,
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: dates,
        scale: true,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: false },
        min: 'dataMin',
        max: 'dataMax',
      },
      yAxis: [
        {
          type: 'value',
          scale: true,
          name: '价格',
          splitArea: {
            show: true,
          },
        },
        {
          type: 'value',
          scale: true,
          name: '涨跌幅(%)',
          splitLine: { show: false },
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          start: 50,
          end: 100,
        },
        {
          show: true,
          type: 'slider',
          top: '90%',
          start: 50,
          end: 100,
        },
      ],
      series: [
        {
          name: '日K',
          type: 'candlestick',
          data: klineData,
          itemStyle: {
            color: upColor,
            color0: downColor,
            borderColor: upBorderColor,
            borderColor0: downBorderColor,
          },
        },
        {
          name: '涨跌幅',
          type: 'line',
          yAxisIndex: 1,
          data: pctChangeData,
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
      ],
    };
  }, [factors, theme]);

  return (
    <>
      <PageTitle>{`基金详情 - ${basicInfo?.name || code || ''}`}</PageTitle>
      <BaseSpace direction="vertical" size="large" style={{ width: '100%' }}>
        <BaseCard>
            <BaseRow justify="space-between" align="middle" style={{marginBottom: 16}}>
                <BaseCol>
                     <BaseButton onClick={() => navigate(-1)}>返回列表</BaseButton>
                </BaseCol>
            </BaseRow>
            {basicInfo && (
                <Descriptions title="基础信息" bordered column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
                    <Descriptions.Item label="代码">{basicInfo.ts_code}</Descriptions.Item>
                    <Descriptions.Item label="简称">{basicInfo.name}</Descriptions.Item>
                    <Descriptions.Item label="管理人">{basicInfo.management}</Descriptions.Item>
                    <Descriptions.Item label="托管人">{basicInfo.custodian}</Descriptions.Item>
                    <Descriptions.Item label="类型">{basicInfo.fund_type}</Descriptions.Item>
                    <Descriptions.Item label="投资类型">{basicInfo.invest_type}</Descriptions.Item>
                    <Descriptions.Item label="成立日期">{basicInfo.found_date}</Descriptions.Item>
                    <Descriptions.Item label="上市日期">{basicInfo.list_date}</Descriptions.Item>
                    <Descriptions.Item label="管理费">{basicInfo.m_fee}</Descriptions.Item>
                    <Descriptions.Item label="托管费">{basicInfo.c_fee}</Descriptions.Item>
                    <Descriptions.Item label="市场">{basicInfo.market === 'E' ? '场内' : '场外'}</Descriptions.Item>
                    <Descriptions.Item label="状态">{basicInfo.status === 'L' ? '上市' : '其他'}</Descriptions.Item>
                </Descriptions>
            )}
        </BaseCard>

        <BaseCard title="技术面因子 (K线 + 涨跌幅)">
           <BaseRow style={{marginBottom: 16}}>
               <BaseCol>
                    <BaseSpace>
                        <span>日期范围:</span>
                        <DayjsDatePicker.RangePicker 
                            value={dateRange}
                            onChange={(dates) => setDateRange([dates?.[0] || null, dates?.[1] || null])}
                        />
                    </BaseSpace>
               </BaseCol>
           </BaseRow>
           <BaseChart option={chartOption} height="500px" />
        </BaseCard>
      </BaseSpace>
    </>
  );
};

export default FundDetail;
