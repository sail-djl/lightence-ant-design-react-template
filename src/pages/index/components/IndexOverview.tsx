/**
 * 指数概览组件 (Index Overview Component)
 * 
 * 功能说明：
 * - 从用户配置加载要显示的指数列表
 * - 加载真实的市场数据（价格、涨跌幅、成交量等）
 * - 根据配置的显示选项控制显示内容
 * - 按配置的排序顺序显示指数
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Spin } from 'antd';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { notificationController } from '@app/controllers/notificationController';
import { getDefaultConfig } from '@app/api/userconfig.api';
import {
  getIndexBasicList,
  getIndexDailyList,
  getIndexDailybasicList,
  IndexBasic,
  IndexDaily,
  IndexDailybasic,
} from '@app/api/index.api';
import { IndexData } from '../types';
import * as S from '../IndexDashboardPage.styles';

interface IndexOverviewProps {
  // 可选：如果传入配置则使用，否则从API加载默认配置
  config?: {
    ts_codes: string[];
    sort_order?: Record<string, number>;
    display_options?: {
      show_volume?: boolean;
      show_turnover?: boolean;
      show_pe?: boolean;
      show_pb?: boolean;
      show_ytd?: boolean;
    };
  };
}

/**
 * 格式化成交量
 */
const formatVolume = (vol: number): string => {
  if (vol >= 100000000) {
    return `${(vol / 100000000).toFixed(1)}亿`;
  } else if (vol >= 10000) {
    return `${(vol / 10000).toFixed(1)}万`;
  }
  return vol.toFixed(0);
};

/**
 * 格式化成交额（亿元）
 */
const formatAmount = (amount: number): string => {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(1)}亿`;
  } else if (amount >= 10000) {
    return `${(amount / 10000).toFixed(1)}万`;
  }
  return amount.toFixed(0);
};

export const IndexOverview: React.FC<IndexOverviewProps> = ({ config }) => {
  const navigate = useNavigate();
  const [data, setData] = useState<IndexData[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayOptions, setDisplayOptions] = useState({
    show_volume: true,
    show_turnover: true,
    show_pe: true,
    show_pb: true,
    show_ytd: true,
  });

  // 加载用户配置和真实数据
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. 获取用户配置
      let userConfig;
      if (config) {
        userConfig = config;
      } else {
        try {
          const configData = await getDefaultConfig('dashboard_index_overview');
          userConfig = configData.config_value;
        } catch (error: any) {
          // 如果配置不存在，使用默认配置
          console.warn('未找到用户配置，使用默认配置', error);
          userConfig = {
            ts_codes: ['000001.SH', '000300.SH', '000905.SH', '399006.SZ', '000016.SH', '000688.SH'],
            sort_order: {
              '000001.SH': 1,
              '000300.SH': 2,
              '000905.SH': 3,
              '399006.SZ': 4,
              '000016.SH': 5,
              '000688.SH': 6,
            },
            display_options: {
              show_volume: true,
              show_turnover: true,
              show_pe: true,
              show_pb: true,
              show_ytd: true,
            },
          };
        }
      }

      // 设置显示选项
      if (userConfig.display_options) {
        setDisplayOptions({
          show_volume: userConfig.display_options.show_volume !== false,
          show_turnover: userConfig.display_options.show_turnover !== false,
          show_pe: userConfig.display_options.show_pe !== false,
          show_pb: userConfig.display_options.show_pb !== false,
          show_ytd: userConfig.display_options.show_ytd !== false,
        });
      }

      const tsCodes = userConfig.ts_codes || [];
      if (tsCodes.length === 0) {
        setData([]);
        setLoading(false);
        return;
      }

      // 2. 按 sort_order 排序
      const sortedCodes = [...tsCodes].sort((a, b) => {
        const orderA = userConfig.sort_order?.[a] || 999;
        const orderB = userConfig.sort_order?.[b] || 999;
        return orderA - orderB;
      });

      // 3. 获取年初日期（用于计算年初至今涨跌幅）
      const currentYear = new Date().getFullYear();
      const yearStartDate = `${currentYear}0101`;

      // 4. 并行获取数据
      const [basicRes] = await Promise.all([
        // 获取指数基础信息（名称等）
        getIndexBasicList({ ts_code: sortedCodes.join(','), limit: 100 }),
      ]);

      // 创建基础信息映射
      const basicMap: Record<string, IndexBasic> = {};
      basicRes.data.forEach((basic) => {
        basicMap[basic.ts_code] = basic;
      });

      // 5. 获取每个指数的最新日线行情和年初数据
      const dailyPromises = sortedCodes.map((code) =>
        getIndexDailyList({ ts_code: code, limit: 1 })
      );
      const ytdPromises = sortedCodes.map((code) =>
        getIndexDailyList({ ts_code: code, start_date: yearStartDate, limit: 1 })
      );

      const [dailyResults, ytdResults] = await Promise.all([
        Promise.all(dailyPromises),
        Promise.all(ytdPromises),
      ]);

      // 6. 获取每日指标（PE、PB）
      const dailybasicPromises = sortedCodes.map((code) =>
        getIndexDailybasicList({ ts_code: code, limit: 1 })
      );
      const dailybasicResults = await Promise.all(dailybasicPromises);

      // 7. 数据合并和转换
      const result: IndexData[] = [];

      sortedCodes.forEach((code, index) => {
        const basic = basicMap[code];
        if (!basic) {
          console.warn(`未找到指数基础信息: ${code}`);
          return;
        }

        const daily = dailyResults[index]?.data?.[0];
        const ytdDaily = ytdResults[index]?.data?.[0];
        const dailybasic = dailybasicResults[index]?.data?.[0];

        if (!daily) {
          console.warn(`未找到指数日线数据: ${code}`);
          return;
        }

        // 计算年初至今涨跌幅
        let ytd = 0;
        if (ytdDaily && daily.close && ytdDaily.close && ytdDaily.close > 0) {
          ytd = ((daily.close - ytdDaily.close) / ytdDaily.close) * 100;
        }

        // 判断趋势（根据涨跌幅）
        const trend: 'strong' | 'weak' = (daily.pct_chg || 0) >= 0 ? 'strong' : 'weak';

        // 格式化成交量
        const volumeStr = daily.vol ? formatVolume(daily.vol) : '0';

        result.push({
          name: basic.name,
          code: code,
          value: daily.close || 0,
          change: daily.change || 0,
          changePercent: daily.pct_chg || 0,
          ytd: ytd,
          volume: volumeStr,
          turnover: daily.amount || 0,
          // 注意：PE/PB分位数需要历史数据计算，这里暂时使用当前值
          // 实际项目中应该从专门的分位数接口获取
          pePercentile: dailybasic?.pe || 0,
          pbPercentile: dailybasic?.pb || 0,
          trend: trend,
        });
      });

      setData(result);
    } catch (error: any) {
      console.error('加载指数数据失败:', error);
      notificationController.error({
        message: error?.message || '加载指数数据失败',
      });
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 处理卡片点击，跳转到详情页
  const handleCardClick = (code: string) => {
    navigate(`/index/detail/${code}`);
  };

  if (loading) {
    return (
      <Card title="指数概览 (Market Overview)" style={{ marginBottom: 16 }}>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card title="指数概览 (Market Overview)" style={{ marginBottom: 16 }}>
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          暂无配置的指数数据，请前往用户配置页面设置
        </div>
      </Card>
    );
  }

  return (
    <Card title="指数概览 (Market Overview)" style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]}>
        {data.map((index) => (
          <BaseCol key={index.code} xs={24} sm={12} md={8} lg={6}>
            <S.IndexCard $trend={index.trend} onClick={() => handleCardClick(index.code)}>
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
                {displayOptions.show_ytd && (
                  <div>
                    年内: {index.ytd >= 0 ? '+' : ''}
                    {index.ytd.toFixed(2)}%
                  </div>
                )}
                {displayOptions.show_volume && <div>成交: {index.volume}</div>}
                {(displayOptions.show_pe || displayOptions.show_pb) && (
                  <div>
                    {displayOptions.show_pe && `PE: ${index.pePercentile.toFixed(1)}`}
                    {displayOptions.show_pe && displayOptions.show_pb && ' | '}
                    {displayOptions.show_pb && `PB: ${index.pbPercentile.toFixed(1)}`}
                  </div>
                )}
              </S.IndexMeta>
            </S.IndexCard>
          </BaseCol>
        ))}
      </Row>
    </Card>
  );
};
