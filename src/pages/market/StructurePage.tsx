import React from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { Card, Typography, Statistic, Tag, Alert } from 'antd';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts-for-react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { currentMarketData, subRadarConfigs, historyData } from './mocks/marketData.mock';

const { Title, Text, Paragraph } = Typography;

const StructurePage: React.FC = () => {
  const config = subRadarConfigs.Structure;
  const currentSubData = currentMarketData.subRadar.Structure;

  // Mock 数据：300/1000/2000 结构张力数据
  const structureTensionData = {
    index300: {
      name: '沪深300',
      code: '000300.SH',
      changePercent: 0.22,
      strength: 75, // 结构强度 0-100
      role: '核心定价层',
    },
    index1000: {
      name: '中证1000',
      code: '000852.SH',
      changePercent: 1.10,
      strength: 85,
      role: '次级博弈层',
    },
    index2000: {
      name: '中证2000',
      code: '000932.SH',
      changePercent: 0.85,
      strength: 70,
      role: '尾部波动层',
    },
  };

  // 计算结构健康度评分 (0-100)
  const calculateHealthScore = () => {
    const { index300, index1000, index2000 } = structureTensionData;
    // 梯度顺畅度：1000 > 300 且 2000 > 1000 为理想状态
    const gradientScore =
      index1000.changePercent > index300.changePercent && index2000.changePercent > index1000.changePercent
        ? 100
        : index1000.changePercent > index300.changePercent
          ? 70
          : 50;
    // 强度均衡度
    const strengthAvg = (index300.strength + index1000.strength + index2000.strength) / 3;
    // 综合评分
    return Math.round((gradientScore * 0.6 + strengthAvg * 0.4));
  };

  const healthScore = calculateHealthScore();

  // 判断结构状态
  const getStructureStatus = () => {
    const { index300, index1000, index2000 } = structureTensionData;
    if (index1000.changePercent > index300.changePercent && index2000.changePercent > index1000.changePercent) {
      return { label: '真扩散', color: '#52c41a', desc: '行情健康扩散，具备可持续性' };
    } else if (index1000.changePercent > index300.changePercent) {
      return { label: '部分扩散', color: '#faad14', desc: '扩散至次级层，需观察尾部层' };
    } else if (index300.changePercent > 0 && index1000.changePercent < 0) {
      return { label: '假扩散', color: '#ff4d4f', desc: '仅核心层上涨，结构不健康' };
    } else {
      return { label: '抱团行情', color: '#1890ff', desc: '资金集中在核心资产' };
    }
  };

  const structureStatus = getStructureStatus();

  const subRadarOption: EChartsOption = {
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
            name: '市场广度',
            itemStyle: { color: '#52c41a' },
            areaStyle: { opacity: 0.3 },
          },
        ],
      },
    ],
  };

  const trendOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['涨跌比', '集中度', '扩散指数'] },
    xAxis: {
      type: 'category',
      data: historyData.map((d) => d.date),
    },
    yAxis: [
      { type: 'value', name: '涨跌比 / 集中度 (%)', position: 'left' },
      { type: 'value', name: '扩散指数', position: 'right' },
    ],
    series: [
      {
        name: '涨跌比',
        type: 'line',
        data: [0.5, 0.6, 1.2, 1.5, 1.85, 1.8],
        smooth: true,
        itemStyle: { color: '#3f8600' },
      },
      {
        name: '集中度',
        type: 'line',
        data: [60, 55, 45, 40, 35, 36],
        smooth: true,
        itemStyle: { color: '#cf1322' },
      },
      {
        name: '扩散指数',
        type: 'line',
        yAxisIndex: 1,
        data: [30, 35, 50, 60, 68, 67],
        smooth: true,
        itemStyle: { color: '#1890ff' },
      },
    ],
  };

  // 结构张力雷达图
  const tensionRadarOption: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const data = structureTensionData[params.name as keyof typeof structureTensionData];
        return `${data.name} (${data.code})<br/>涨跌幅: ${data.changePercent > 0 ? '+' : ''}${data.changePercent.toFixed(2)}%<br/>结构强度: ${data.strength}<br/>角色: ${data.role}`;
      },
    },
    radar: {
      indicator: [
        { name: '沪深300\n(核心定价层)', max: 2 },
        { name: '中证1000\n(次级博弈层)', max: 2 },
        { name: '中证2000\n(尾部波动层)', max: 2 },
      ],
      shape: 'circle',
      splitNumber: 4,
      radius: '70%',
      axisName: { color: '#666', fontSize: 12, fontWeight: 'bold' },
      splitArea: { areaStyle: { color: ['#fff', '#f7f9fc'] } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [
              structureTensionData.index300.changePercent,
              structureTensionData.index1000.changePercent,
              structureTensionData.index2000.changePercent,
            ],
            name: '结构张力',
            itemStyle: { color: structureStatus.color },
            areaStyle: { opacity: 0.3, color: structureStatus.color },
            symbolSize: 8,
          },
        ],
      },
    ],
  };

  // 结构张力历史趋势图（300/1000/2000对比）
  const tensionTrendOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['沪深300', '中证1000', '中证2000'] },
    xAxis: {
      type: 'category',
      data: historyData.map((d) => d.date),
    },
    yAxis: {
      type: 'value',
      name: '涨跌幅 (%)',
    },
    series: [
      {
        name: '沪深300',
        type: 'line',
        data: [0.15, 0.18, 0.25, 0.20, 0.22, 0.22],
        smooth: true,
        itemStyle: { color: '#1890ff' },
        lineStyle: { width: 2 },
      },
      {
        name: '中证1000',
        type: 'line',
        data: [0.85, 0.92, 1.05, 0.98, 1.10, 1.08],
        smooth: true,
        itemStyle: { color: '#52c41a' },
        lineStyle: { width: 2 },
      },
      {
        name: '中证2000',
        type: 'line',
        data: [0.65, 0.72, 0.88, 0.82, 0.85, 0.83],
        smooth: true,
        itemStyle: { color: '#faad14' },
        lineStyle: { width: 2 },
      },
    ],
  };

  return (
    <>
      <PageTitle>市场结构与广度</PageTitle>
      <BaseRow gutter={[16, 16]}>
        <BaseCol span={24}>
          <Card>
            <Title level={2}>市场结构与广度 (Structure)</Title>
            <Text type="secondary">行情质量检测页 - 回答&ldquo;行情健康吗？&rdquo;</Text>
          </Card>
        </BaseCol>

        <BaseCol xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="涨跌比" value={1.85} precision={2} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </BaseCol>
        <BaseCol xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="集中度" value={35} suffix="%" valueStyle={{ color: '#333' }} />
          </Card>
        </BaseCol>
        <BaseCol xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="扩散指数" value={68} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </BaseCol>

        <BaseCol xs={24} lg={12}>
          <Card title="市场广度结构雷达">
            <ReactECharts option={subRadarOption} style={{ height: '400px' }} />
          </Card>
        </BaseCol>

        <BaseCol xs={24} lg={12}>
          <Card title="市场结构历史趋势">
            <ReactECharts option={trendOption} style={{ height: '400px' }} />
          </Card>
        </BaseCol>

        {/* 结构张力雷达 - 关键新增模块 */}
        <BaseCol span={24}>
          <Card
            title={
              <div>
                <Title level={4} style={{ margin: 0, display: 'inline' }}>
                  结构张力雷达 (Risk–Volatility Gradient)
                </Title>
                <Tag color={structureStatus.color} style={{ marginLeft: 12 }}>
                  {structureStatus.label}
                </Tag>
              </div>
            }
            extra={
              <Statistic
                title="结构健康度"
                value={healthScore}
                suffix="/ 100"
                valueStyle={{ color: healthScore >= 80 ? '#52c41a' : healthScore >= 60 ? '#faad14' : '#ff4d4f' }}
              />
            }
          >
            <Alert
              message="结构张力说明"
              description="本模块通过核心定价层（300）、次级博弈层（1000）与尾部波动层（2000）的相对表现，判断行情是否具备内部扩散与承接能力，而非判断市场情绪。"
              type="info"
              icon={<InfoCircleOutlined />}
              style={{ marginBottom: 16 }}
            />
            <BaseRow gutter={[16, 16]}>
              <BaseCol xs={24} lg={12}>
                <ReactECharts option={tensionRadarOption} style={{ height: '400px' }} />
              </BaseCol>
              <BaseCol xs={24} lg={12}>
                <ReactECharts option={tensionTrendOption} style={{ height: '400px' }} />
              </BaseCol>
            </BaseRow>
            <BaseRow gutter={[16, 16]} style={{ marginTop: 16 }}>
              <BaseCol xs={24} sm={8}>
                <Card size="small">
                  <Statistic
                    title={
                      <div>
                        <Text strong>沪深300</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {structureTensionData.index300.role}
                        </Text>
                      </div>
                    }
                    value={structureTensionData.index300.changePercent}
                    precision={2}
                    prefix={structureTensionData.index300.changePercent >= 0 ? '+' : ''}
                    suffix="%"
                    valueStyle={{
                      color: structureTensionData.index300.changePercent >= 0 ? '#ff4d4f' : '#52c41a',
                    }}
                  />
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      结构强度: {structureTensionData.index300.strength}
                    </Text>
                  </div>
                </Card>
              </BaseCol>
              <BaseCol xs={24} sm={8}>
                <Card size="small">
                  <Statistic
                    title={
                      <div>
                        <Text strong>中证1000</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {structureTensionData.index1000.role}
                        </Text>
                      </div>
                    }
                    value={structureTensionData.index1000.changePercent}
                    precision={2}
                    prefix={structureTensionData.index1000.changePercent >= 0 ? '+' : ''}
                    suffix="%"
                    valueStyle={{
                      color: structureTensionData.index1000.changePercent >= 0 ? '#ff4d4f' : '#52c41a',
                    }}
                  />
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      结构强度: {structureTensionData.index1000.strength}
                    </Text>
                  </div>
                </Card>
              </BaseCol>
              <BaseCol xs={24} sm={8}>
                <Card size="small">
                  <Statistic
                    title={
                      <div>
                        <Text strong>中证2000</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {structureTensionData.index2000.role}
                        </Text>
                      </div>
                    }
                    value={structureTensionData.index2000.changePercent}
                    precision={2}
                    prefix={structureTensionData.index2000.changePercent >= 0 ? '+' : ''}
                    suffix="%"
                    valueStyle={{
                      color: structureTensionData.index2000.changePercent >= 0 ? '#ff4d4f' : '#52c41a',
                    }}
                  />
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      结构强度: {structureTensionData.index2000.strength}
                    </Text>
                  </div>
                </Card>
              </BaseCol>
            </BaseRow>
            <div style={{ marginTop: 16, padding: 12, background: '#f0f2f5', borderRadius: 4 }}>
              <Paragraph style={{ margin: 0 }}>
                <Text strong>结构状态：</Text>
                <Text style={{ color: structureStatus.color }}>{structureStatus.label}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {structureStatus.desc}
                </Text>
              </Paragraph>
            </div>
          </Card>
        </BaseCol>

        {/* 结构耦合分析 */}
        <BaseCol span={24}>
          <Card title="结构耦合分析">
            <Paragraph>
              <Text strong>结构张力与现有指标的耦合关系：</Text>
            </Paragraph>
            <ul style={{ paddingLeft: 20 }}>
              <li>
                <Text>
                  <Text strong>涨跌比高 + 扩散指数高 + 仅在300内部</Text> → 假扩散（结构不健康）
                </Text>
              </li>
              <li>
                <Text>
                  <Text strong>扩散指数走高 + 1000/2000 接力</Text> → 真扩散（结构健康）
                </Text>
              </li>
              <li>
                <Text>
                  <Text strong>指数涨 + 集中度升 + 2000 不动</Text> → 抱团行情（结构分化）
                </Text>
              </li>
              <li>
                <Text>
                  <Text strong>300/1000/2000 梯度顺畅</Text> → 行情具备内部扩散与承接能力
                </Text>
              </li>
            </ul>
            <Paragraph style={{ marginTop: 16, marginBottom: 0 }}>
              <Text type="secondary">
                300/1000/2000 不是并列指标，而是结构坐标轴。它们一起决定的不是"涨跌"，而是行情能不能"站得住、铺得开、传得远"。
              </Text>
            </Paragraph>
          </Card>
        </BaseCol>

        <BaseCol span={24}>
          <Card title="维度说明">
            <Text>
              行情质量检测页。包含：涨跌比、集中度、扩散指数、结构张力（300/1000/2000）、抱团vs普涨、与融资/北向的背离分析。
              这是A股特色+你体系优势的集中体现。
            </Text>
          </Card>
        </BaseCol>
      </BaseRow>
    </>
  );
};

export default StructurePage;

