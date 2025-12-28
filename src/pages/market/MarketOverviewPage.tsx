import React, { useState, useEffect } from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { Card, Typography, Button, Slider, Space, Tag } from 'antd';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts-for-react';
import {
  historyData,
  currentMarketData,
  PHASE_DEFINITIONS,
  subRadarConfigs,
  type HistoryDataItem,
} from './mocks/marketData.mock';
import { PlayCircleOutlined, PauseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const MarketOverviewPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(historyData.length - 1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playInterval, setPlayInterval] = useState<NodeJS.Timeout | null>(null);
  const [currentData, setCurrentData] = useState<HistoryDataItem>(currentMarketData);

  useEffect(() => {
    setCurrentData(historyData[currentIndex]);
  }, [currentIndex]);

  useEffect(() => {
    if (isPlaying && playInterval) {
      return () => {
        clearInterval(playInterval);
      };
    }
  }, [isPlaying, playInterval]);

  const togglePlay = () => {
    if (isPlaying) {
      if (playInterval) {
        clearInterval(playInterval);
        setPlayInterval(null);
      }
      setIsPlaying(false);
    } else {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => {
          const next = prev + 1;
          return next >= historyData.length ? 0 : next;
        });
      }, 2000);
      setPlayInterval(interval);
      setIsPlaying(true);
    }
  };

  const handleSliderChange = (value: number) => {
    if (isPlaying) {
      togglePlay();
    }
    setCurrentIndex(value);
  };

  // 主雷达图配置
  const mainRadarOption: EChartsOption = {
    tooltip: {
      trigger: 'axis',
    },
    radar: {
      indicator: [
        { name: '利率/资金成本\n(Rates)', max: 2, min: -2 },
        { name: '流动性/货币\n(Liquidity)', max: 2, min: -2 },
        { name: '外汇/跨境\n(FX)', max: 2, min: -2 },
        { name: '通胀/成本压力\n(Inflation)', max: 2, min: -2 },
        { name: '风险定价\n(Risk Pricing)', max: 2, min: -2 },
        { name: '市场结构/广度\n(Structure)', max: 2, min: -2 },
      ],
      splitNumber: 4,
      axisName: {
        color: '#666',
        fontSize: 14,
        fontWeight: 'bold',
        padding: [3, 5],
      },
      splitArea: {
        areaStyle: {
          color: ['#fff', '#f5f5f5'],
        },
      },
    },
    series: [
      {
        name: '市场环境评分',
        type: 'radar',
        data: [
          {
            value: currentData.mainRadar,
            name: '当前状态',
            itemStyle: { color: '#1890ff' },
            areaStyle: { opacity: 0.3 },
          },
          ...(currentIndex > 0
            ? [
                {
                  value: historyData[currentIndex - 1].mainRadar,
                  name: '上期状态',
                  itemStyle: { color: '#999' },
                  lineStyle: { type: 'dashed', opacity: 0.5 },
                  areaStyle: { opacity: 0 },
                  symbol: 'none',
                },
              ]
            : []),
        ],
      },
    ],
  };

  // Phase条渲染
  const renderPhaseStrip = () => {
    return (
      <div style={{ display: 'flex', height: '6px', width: '100%', marginTop: '8px', borderRadius: '3px', overflow: 'hidden' }}>
        {historyData.map((item, index) => (
          <div
            key={index}
            style={{
              width: `${100 / historyData.length}%`,
              backgroundColor: PHASE_DEFINITIONS[item.phaseId].color,
              opacity: index === currentIndex ? 1 : 0.4,
              transform: index === currentIndex ? 'scaleY(1.5)' : 'none',
              transition: 'all 0.3s',
              cursor: 'pointer',
            }}
            onClick={() => handleSliderChange(index)}
            title={`${item.date} | ${PHASE_DEFINITIONS[item.phaseId].name}`}
          />
        ))}
      </div>
    );
  };

  // 子雷达图配置
  const getSubRadarOption = (key: string, data: number[]): EChartsOption => {
    const config = subRadarConfigs[key];
    return {
      radar: {
        indicator: config.indicators,
        shape: 'circle',
        splitNumber: 3,
        radius: '65%',
        axisName: { color: '#666', fontSize: 10 },
        splitArea: { areaStyle: { color: ['#fff', '#f7f9fc'] } },
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: data,
              name: '结构强度',
              itemStyle: { color: '#1890ff' },
              areaStyle: { opacity: 0.2 },
              symbolSize: 4,
            },
          ],
        },
      ],
    };
  };

  const currentPhase = PHASE_DEFINITIONS[currentData.phaseId];

  return (
    <>
      <PageTitle>市场总览（宏观联动雷达）</PageTitle>
      <BaseRow gutter={[16, 16]}>
        {/* 标题和控制区 */}
        <BaseCol span={24}>
          <Card>
            <div style={{ marginBottom: 16 }}>
              <Title level={2} style={{ marginBottom: 8 }}>
                宏观联动雷达 (Macro-Linkage Radar)
              </Title>
              <Text type="secondary">基于六维约束模型的金融市场全景监控系统</Text>
            </div>

            {/* 历史回放控制 */}
            <Card size="small" style={{ backgroundColor: '#f0f5ff', border: '1px solid #adc6ff' }}>
              <Space style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                  icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                  onClick={togglePlay}
                  type={isPlaying ? 'default' : 'primary'}
                >
                  {isPlaying ? '暂停' : '播放'}
                </Button>
                <div style={{ flex: 1, margin: '0 24px' }}>
                  <Slider
                    min={0}
                    max={historyData.length - 1}
                    value={currentIndex}
                    onChange={handleSliderChange}
                    tooltip={{ formatter: (value) => historyData[value || 0].date }}
                  />
                  {renderPhaseStrip()}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#999', marginTop: 4 }}>
                    <span>{historyData[0].date}</span>
                    <span>{historyData[historyData.length - 1].date}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', minWidth: 180 }}>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: '#1890ff', fontFamily: 'monospace' }}>
                    {currentData.date}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                    <Tag color={currentPhase.color}>{currentPhase.name}</Tag>
                  </div>
                </div>
              </Space>
            </Card>
          </Card>
        </BaseCol>

        {/* 主雷达图 */}
        <BaseCol xs={24} lg={16}>
          <Card
            title={
              <Space>
                <span>核心雷达：六大市场约束</span>
                <Text type="secondary" style={{ fontSize: 14, fontWeight: 'normal' }}>
                  评分范围：-2 (极度紧缩/风险) ~ +2 (极度宽松/安全)
                </Text>
              </Space>
            }
            extra={
              <Button type="text" icon={<InfoCircleOutlined />} size="small">
                查看阶段特征
              </Button>
            }
          >
            {/* 状态栏 */}
            <Card size="small" style={{ marginBottom: 16, backgroundColor: '#f0f5ff', border: '1px solid #adc6ff' }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Space size="large">
                  <div>
                    <Text type="secondary">当前状态</Text>
                    <div>
                      <Text strong style={{ color: '#1890ff' }}>
                        {currentData.status.label}
                      </Text>
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">变化方向</Text>
                    <div>
                      <Text strong style={{ color: '#cf1322' }}>
                        {currentData.status.dir}
                      </Text>
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">持续时间</Text>
                    <div>
                      <Text strong>已持续 12 天</Text>
                    </div>
                  </div>
                </Space>
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 12 }}>
                  <Space size="large">
                    <Text strong style={{ color: '#faad14', marginRight: 12 }}>
                      🛡️ 环境许可度
                    </Text>
                    <div>
                      <Text type="secondary">风险容忍度</Text>
                      <div>
                        <Text strong style={{ color: '#faad14' }}>
                          {currentData.riskStance.tol}
                        </Text>
                      </div>
                    </div>
                    <div>
                      <Text type="secondary">仓位上限建议</Text>
                      <div>
                        <Text strong>{currentData.riskStance.cap}</Text>
                      </div>
                    </div>
                  </Space>
                </div>
              </Space>
            </Card>

            <ReactECharts option={mainRadarOption} style={{ height: '600px' }} />
          </Card>
        </BaseCol>

        {/* 图例说明 */}
        <BaseCol xs={24} lg={8}>
          <Card title="维度说明">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {Object.entries(subRadarConfigs).map(([key, config]) => (
                <div key={key}>
                  <Title level={5} style={{ color: '#1890ff', marginBottom: 8, fontSize: 15 }}>
                    ① {config.title.split(' · ')[0]}
                  </Title>
                  <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.6 }}>
                    {key === 'Rates' && '回答：资金贵不贵？(价格层)\n核心：Shibor, DR007, 国债收益率'}
                    {key === 'Liquidity' && '回答：资金松不松？(数量层)\n核心：M2, 社融, OMO净投放'}
                    {key === 'FX' && '回答：钱能不能进来？\n核心：USD/CNY, DXY'}
                    {key === 'Inflation' && '回答：实体压力在不在？\n核心：原油, 铜铝 (实体成本)'}
                    {key === 'Risk' && '回答：市场怕不怕？\n核心：VIX, PCR, 信用利差'}
                    {key === 'Structure' && '回答：行情健康吗？\n核心：涨跌比, 集中度, 投机热度'}
                  </Text>
                </div>
              ))}
            </Space>
          </Card>
        </BaseCol>

        {/* 子雷达全景 */}
        <BaseCol span={24}>
          <Card
            title={
              <Space>
                <span>子雷达全景：结构性证据</span>
                <Text type="secondary" style={{ fontSize: 14, fontWeight: 'normal' }}>
                  用于解释主雷达得分的内部结构
                </Text>
              </Space>
            }
          >
            <BaseRow gutter={[20, 20]}>
              {Object.entries(subRadarConfigs).map(([key, config]) => (
                <BaseCol xs={24} sm={12} lg={8} key={key}>
                  <Card size="small" title={config.title} style={{ height: '100%' }}>
                    <ReactECharts
                      option={getSubRadarOption(key, currentData.subRadar[key as keyof typeof currentData.subRadar])}
                      style={{ height: '250px' }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12, fontSize: 12 }}>
                      {config.metrics.map((metric, idx) => (
                        <div key={idx} style={{ textAlign: 'center', background: '#fafafa', padding: 4, borderRadius: 4 }}>
                          <div style={{ color: '#666' }}>{metric.label}</div>
                          <div style={{ fontWeight: 600, marginTop: 2, color: metric.color }}>{metric.val}</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </BaseCol>
              ))}
            </BaseRow>
          </Card>
        </BaseCol>

        {/* 行为与结果层 */}
        <BaseCol xs={24} lg={12}>
          <Card title="行为观察层 (Behavior)" extra={<Text type="secondary">趋势强化证据</Text>}>
            <BaseRow gutter={[16, 16]}>
              <BaseCol span={24}>
                <Card size="small">
                  <div style={{ color: '#666', marginBottom: 8 }}>北向资金 (Northbound)</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#cf1322', marginBottom: 4 }}>
                    {currentData.behavior.nb}
                  </div>
                  <div style={{ fontSize: 12, color: '#cf1322' }}>连续3日净流入</div>
                  <Tag color="success" style={{ marginTop: 8 }}>
                    ✔ 与 FX / Risk 一致
                  </Tag>
                </Card>
              </BaseCol>
              <BaseCol span={24}>
                <Card size="small">
                  <div style={{ color: '#666', marginBottom: 8 }}>融资余额 (Margin)</div>
                  <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>{currentData.behavior.mar}</div>
                  <div style={{ fontSize: 12, color: '#cf1322' }}>环比 +0.5%</div>
                  <Tag color="warning" style={{ marginTop: 8 }}>
                    ⚠ 与 Structure 略背离
                  </Tag>
                </Card>
              </BaseCol>
              <BaseCol span={24}>
                <Card size="small">
                  <div style={{ color: '#666', marginBottom: 8 }}>主力资金 (Main Force)</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#3f8600', marginBottom: 4 }}>
                    {currentData.behavior.mf}
                  </div>
                  <div style={{ fontSize: 12, color: '#3f8600' }}>净流出</div>
                  <Tag color="success" style={{ marginTop: 8 }}>
                    ✔ 与 Rates / Liquidity 一致
                  </Tag>
                </Card>
              </BaseCol>
            </BaseRow>
          </Card>
        </BaseCol>

        <BaseCol xs={24} lg={12}>
          <Card title="验证/结果层 (Result)" extra={<Text type="secondary">行情最终表现</Text>}>
            <BaseRow gutter={[16, 16]}>
              <BaseCol span={24}>
                <Card size="small">
                  <div style={{ color: '#666', marginBottom: 8 }}>上证指数</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#cf1322', marginBottom: 4 }}>
                    {currentData.result.sh}
                  </div>
                  <div style={{ fontSize: 12, color: '#cf1322' }}>+0.85%</div>
                </Card>
              </BaseCol>
              <BaseCol span={24}>
                <Card size="small">
                  <div style={{ color: '#666', marginBottom: 8 }}>全A PE (TTM)</div>
                  <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>{currentData.result.pe}</div>
                  <div style={{ fontSize: 12 }}>分位点: 45%</div>
                </Card>
              </BaseCol>
              <BaseCol span={24}>
                <Card size="small">
                  <div style={{ color: '#666', marginBottom: 8 }}>恒生指数</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#cf1322', marginBottom: 4 }}>17,800.50</div>
                  <div style={{ fontSize: 12, color: '#cf1322' }}>+1.20%</div>
                </Card>
              </BaseCol>
            </BaseRow>
          </Card>
        </BaseCol>
      </BaseRow>
    </>
  );
};

export default MarketOverviewPage;

