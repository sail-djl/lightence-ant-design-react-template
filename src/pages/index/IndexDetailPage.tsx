/**
 * 指数详情页面 (Index Detail Page)
 * 
 * 功能说明：
 * - 展示指数的详细信息（价格、涨跌幅、关键指标等）
 * - K线图展示（支持多周期切换）
 * - 历史数据查询和展示
 * - 成分股列表
 * - 估值分析
 * - 指数对比
 * - 新闻公告
 */
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Select, DatePicker, Space, Input, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { notificationController } from '@app/controllers/notificationController';
import { getIndexBasicList, getIndexDailyList } from '@app/api/index.api';
import {
  mockIndexMetrics,
  mockKlineMetrics,
  mockHistoryData,
  mockConstituents,
  mockNews,
  mockComparison,
} from './mockDetailData';
import { IndexDetailInfo } from './types';
import * as S from './IndexDetailPage.styles';

const { RangePicker } = DatePicker;
const { Option } = Select;

/**
 * Tab 类型定义
 * 定义页面中所有可用的标签页类型
 */
type TabType = 'kline' | 'metrics' | 'history' | 'constituents' | 'valuation' | 'comparison' | 'news';

/**
 * 指数详情页面主组件
 * 
 * 功能说明：
 * - 通过路由参数获取指数代码
 * - 展示指数的详细信息（价格、涨跌幅、关键指标等）
 * - 提供多个 Tab 标签页切换不同内容
 * - 支持 K线图多周期切换和技术指标选择
 * - 提供历史数据查询、成分股列表、估值分析等功能
 */
const IndexDetailPage: React.FC = () => {
  // ==================== 路由和导航 ====================
  /** 从路由参数中获取指数代码 */
  const { code } = useParams<{ code: string }>();
  /** 路由导航函数，用于页面跳转 */
  const navigate = useNavigate();

  // ==================== 状态管理 ====================
  /** 当前激活的 Tab 标签页 */
  const [activeTab, setActiveTab] = useState<TabType>('kline');
  /** K线图显示周期（1日/5日/1月/3月/6月/1年/3年/全部） */
  const [period, setPeriod] = useState<string>('5日');
  /** K线图主图技术指标（MA5/MA10/MA20、BOLL、MACD等） */
  const [indicator1, setIndicator1] = useState<string>('MA5/MA10/MA20');
  /** K线图副图技术指标（成交量、MACD、KDJ、RSI等） */
  const [indicator2, setIndicator2] = useState<string>('成交量');
  /** 成分股搜索关键词 */
  const [constituentKeyword, setConstituentKeyword] = useState<string>('');
  /** 成分股排序方式（weight: 权重, change: 涨跌幅, market: 市值） */
  const [constituentSort, setConstituentSort] = useState<string>('weight');
  /** 指数对比中选中的对比指数代码 */
  const [comparisonIndex, setComparisonIndex] = useState<string>('');
  /** K线图数据 */
  const [klineData, setKlineData] = useState<Array<{ date: string; value: number }>>([]);
  /** K线图加载状态 */
  const [klineLoading, setKlineLoading] = useState(false);

  // ==================== 数据状态管理 ====================
  /** 指数基本信息 */
  const [indexInfo, setIndexInfo] = useState<IndexDetailInfo | null>(null);
  /** 数据加载状态 */
  const [loading, setLoading] = useState(true);
  /** 判断涨跌方向（true: 上涨/红色, false: 下跌/绿色） */
  const isPositive = indexInfo ? indexInfo.change >= 0 : false;

  /**
   * 格式化日期：YYYYMMDD -> YYYY-MM-DD
   */
  const formatDate = (dateStr: string): string => {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
  };

  /**
   * 格式化成交量
   */
  const formatVolume = (vol: number | undefined): string => {
    if (!vol) return '0';
    if (vol >= 100000000) {
      return `${(vol / 100000000).toFixed(1)}亿`;
    } else if (vol >= 10000) {
      return `${(vol / 10000).toFixed(1)}万`;
    }
    return vol.toFixed(0);
  };

  // ==================== 数据加载 ====================
  /**
   * 加载指数详情数据
   * 获取指数基础信息和最近2条日线数据（最近一日和往前一个交易日）
   */
  useEffect(() => {
    const loadIndexDetail = async () => {
      if (!code) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // 1. 获取指数基础信息
        const basicRes = await getIndexBasicList({ ts_code: code, limit: 1 });
        const basic = basicRes.data[0];
        if (!basic) {
          throw new Error('未找到指数信息');
        }

        // 2. 获取最近2条日线数据（limit: 2，按 trade_date 降序）
        // 第一条：最近一日（今日）
        // 第二条：往前一个交易日（昨日）
        const dailyRes = await getIndexDailyList({ ts_code: code, limit: 2 });

        if (!dailyRes.data || dailyRes.data.length === 0) {
          throw new Error('未找到指数日线数据');
        }

        const todayData = dailyRes.data[0]; // 最近一日
        const yesterdayData = dailyRes.data[1]; // 往前一个交易日（如果存在）

        // 3. 构建 IndexDetailInfo
        const detailInfo: IndexDetailInfo = {
          name: basic.name,
          code: basic.ts_code,
          enName: basic.fullname || basic.name, // 如果没有英文名，使用中文名
          currentPrice: todayData.close || 0,
          change: todayData.change || 0,
          changePercent: todayData.pct_chg || 0,
          open: todayData.open || 0,
          prevClose: yesterdayData?.pre_close || todayData.pre_close || todayData.close || 0, // 昨日收盘
          high: todayData.high || 0,
          low: todayData.low || 0,
          volume: formatVolume(todayData.vol),
          turnover: todayData.amount || 0,
          tradeDate: todayData.trade_date || '', // 最近一日的交易日期
          prevTradeDate: yesterdayData?.trade_date, // 往前一个交易日的交易日期
        };

        setIndexInfo(detailInfo);
      } catch (error: any) {
        console.error('加载指数详情失败:', error);
        notificationController.error({
          message: error?.message || '加载指数详情失败',
        });
        setIndexInfo(null);
      } finally {
        setLoading(false);
      }
    };

    loadIndexDetail();
  }, [code]);

  // ==================== K线图数据处理 ====================
  /**
   * 根据周期计算开始日期
   * @param period 周期字符串
   * @returns 开始日期（YYYYMMDD格式）
   */
  const getStartDateByPeriod = (period: string): string | undefined => {
    if (period === '全部') return undefined; // 全部数据，不限制开始日期

    const today = new Date();
    let days = 0;

    switch (period) {
      case '1日':
        days = 1;
        break;
      case '5日':
        days = 5;
        break;
      case '1月':
        days = 30;
        break;
      case '3月':
        days = 90;
        break;
      case '6月':
        days = 180;
        break;
      case '1年':
        days = 365;
        break;
      case '3年':
        days = 1095;
        break;
      default:
        days = 30;
    }

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - days);
    const year = startDate.getFullYear();
    const month = String(startDate.getMonth() + 1).padStart(2, '0');
    const day = String(startDate.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  /**
   * 格式化日期：YYYYMMDD -> MM-DD
   */
  const formatKlineDate = (dateStr: string): string => {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    return `${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
  };

  /**
   * 加载 K线图数据
   * 根据选中的周期从 API 获取真实数据
   */
  useEffect(() => {
    const loadKlineData = async () => {
      if (!code || activeTab !== 'kline') return; // 只在 K线图 Tab 且有指数代码时加载

      setKlineLoading(true);
      try {
        const startDate = getStartDateByPeriod(period);
        const params: any = {
          ts_code: code,
          limit: period === '全部' ? 1000 : undefined, // 全部数据时限制最大数量
        };
        if (startDate) {
          params.start_date = startDate;
        }

        const dailyRes = await getIndexDailyList(params);

        if (!dailyRes.data || dailyRes.data.length === 0) {
          // 如果没有数据，清空图表数据
          setKlineData([]);
          notificationController.warning({
            message: '暂无 K线图数据',
          });
          return;
        }

        // 转换数据格式：按 trade_date 升序排列，然后转换为 ECharts 需要的格式
        const sortedData = [...dailyRes.data].sort((a, b) => {
          return (a.trade_date || '').localeCompare(b.trade_date || '');
        });

        const chartData = sortedData.map((item) => ({
          date: formatKlineDate(item.trade_date || ''),
          value: item.close || 0,
        }));

        setKlineData(chartData);
      } catch (error: any) {
        console.error('加载 K线图数据失败:', error);
        notificationController.error({
          message: error?.message || '加载 K线图数据失败',
        });
        setKlineData([]);
      } finally {
        setKlineLoading(false);
      }
    };

    loadKlineData();
  }, [code, period, activeTab]);

  /**
   * ECharts K线图配置选项
   * 配置图表的基础样式、坐标轴、数据系列等
   * 使用 useMemo 优化性能，只在 klineData 变化时重新计算
   */
  const klineChartOption: EChartsOption = useMemo(() => {
    return {
      // 提示框配置：鼠标悬停时显示数据
      tooltip: {
        trigger: 'axis', // 触发方式：坐标轴触发
        formatter: (params: any) => {
          if (Array.isArray(params) && params.length > 0) {
            const param = params[0];
            return `${param.axisValue}<br/>${param.seriesName}: ${param.value.toFixed(2)}`;
          }
          return '';
        },
      },
      // 图表网格配置：控制图表的位置和大小
      grid: {
        left: '3%', // 左边距
        right: '4%', // 右边距
        bottom: '3%', // 底边距
        containLabel: true, // 包含坐标轴标签
      },
      // X轴配置：显示日期
      xAxis: {
        type: 'category', // 类目轴，适用于离散的类目数据
        data: klineData.map((item) => item.date), // X轴数据：日期数组
        boundaryGap: false, // 不留白边距，数据点紧贴坐标轴
      },
      // Y轴配置：显示价格数值
      yAxis: {
        type: 'value', // 数值轴，适用于连续数据
        scale: false, // 不从0开始，更好地展示价格波动
      },
      // 数据系列配置
      series: [
        {
          name: '收盘价',
          type: 'line', // 折线图
          data: klineData.map((item) => item.value), // Y轴数据：价格数组
          smooth: true, // 平滑曲线
          lineStyle: { color: '#1890ff', width: 2 }, // 线条样式：蓝色，宽度2px
          // 区域填充样式：渐变填充，从蓝色半透明到浅蓝色
          areaStyle: {
            color: {
              type: 'linear', // 线性渐变
              x: 0,
              y: 0,
              x2: 0,
              y2: 1, // 从上到下的渐变
              colorStops: [
                { offset: 0, color: 'rgba(24, 144, 255, 0.3)' }, // 起始颜色：30%透明度蓝色
                { offset: 1, color: 'rgba(24, 144, 255, 0.1)' }, // 结束颜色：10%透明度蓝色
              ],
            },
          },
        },
      ],
    };
  }, [klineData]);

  // ==================== 成分股数据处理 ====================
  /**
   * 过滤和排序成分股列表
   * 根据搜索关键词和排序方式处理成分股数据
   * 使用 useMemo 优化性能，只在依赖项变化时重新计算
   */
  const filteredConstituents = useMemo(() => {
    let result = [...mockConstituents];

    // 根据关键词过滤：匹配股票名称或代码
    if (constituentKeyword) {
      result = result.filter(
        (item) =>
          item.name.includes(constituentKeyword) || item.code.includes(constituentKeyword)
      );
    }

    // 根据排序方式排序
    if (constituentSort === 'weight') {
      // 按权重降序排列
      result.sort((a, b) => b.weight - a.weight);
    } else if (constituentSort === 'change') {
      // 按涨跌幅降序排列
      result.sort((a, b) => b.changePercent - a.changePercent);
    }
    // 如果选择按市值排序，需要额外数据支持，这里暂时不处理

    return result;
  }, [constituentKeyword, constituentSort]);

  // ==================== Tab 内容渲染函数 ====================
  /**
   * 渲染 K线图 Tab 内容
   * 
   * 包含内容：
   * - K线图工具栏：周期切换按钮、技术指标选择器
   * - ECharts K线图：根据选中周期动态生成数据
   * - 关键指标卡片：PE、PB、股息率、52周最高/最低、年初至今等
   */
  const renderKlineTab = () => (
    <>
      <S.ChartSection>
        <S.ChartToolbar>
          <S.ChartPeriods>
            {['1日', '5日', '1月', '3月', '6月', '1年', '3年', '全部'].map((p) => (
              <S.PeriodBtn
                key={p}
                $active={period === p}
                onClick={() => setPeriod(p)}
              >
                {p}
              </S.PeriodBtn>
            ))}
          </S.ChartPeriods>
          <S.ChartIndicators>
            <Select
              value={indicator1}
              onChange={setIndicator1}
              style={{ minWidth: 150 }}
            >
              <Option value="MA5/MA10/MA20">MA5/MA10/MA20</Option>
              <Option value="MA5/MA10/MA30">MA5/MA10/MA30</Option>
              <Option value="MA5/MA10/MA60">MA5/MA10/MA60</Option>
              <Option value="BOLL">BOLL</Option>
              <Option value="MACD">MACD</Option>
              <Option value="KDJ">KDJ</Option>
              <Option value="RSI">RSI</Option>
            </Select>
            <Select
              value={indicator2}
              onChange={setIndicator2}
              style={{ minWidth: 150 }}
            >
              <Option value="成交量">成交量</Option>
              <Option value="MACD">MACD</Option>
              <Option value="KDJ">KDJ</Option>
              <Option value="RSI">RSI</Option>
              <Option value="无">无</Option>
            </Select>
          </S.ChartIndicators>
        </S.ChartToolbar>
        {klineLoading ? (
          <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spin size="large" />
          </div>
        ) : klineData.length === 0 ? (
          <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
            暂无 K线图数据
          </div>
        ) : (
          <ReactECharts option={klineChartOption} style={{ height: '500px' }} />
        )}
      </S.ChartSection>

      <S.MetricsGrid>
        {mockKlineMetrics.map((metric, index) => (
          <S.MetricCard key={index}>
            <S.MetricLabel>{metric.label}</S.MetricLabel>
            <S.MetricValue>{metric.value}</S.MetricValue>
            {metric.trend && (
              <S.MetricTrend
                $positive={
                  typeof metric.value === 'string' && metric.value.startsWith('+')
                }
              >
                {metric.trend}
              </S.MetricTrend>
            )}
          </S.MetricCard>
        ))}
      </S.MetricsGrid>
    </>
  );

  /**
   * 渲染关键指标 Tab 内容
   * 
   * 展示指数的各项关键财务和技术指标：
   * - PE (市盈率)、PB (市净率)、PS (市销率)
   * - 股息率、ROE (净资产收益率)、ROA (总资产收益率)
   * - 总市值、流通市值等
   */
  const renderMetricsTab = () => (
    <S.MetricsGrid>
      {mockIndexMetrics.map((metric, index) => (
        <S.MetricCard key={index}>
          <S.MetricLabel>{metric.label}</S.MetricLabel>
          <S.MetricValue>{metric.value}</S.MetricValue>
          {metric.trend && (
            <S.MetricTrend
              $positive={
                typeof metric.value === 'string' && metric.value.startsWith('+')
              }
            >
              {metric.trend}
            </S.MetricTrend>
          )}
        </S.MetricCard>
      ))}
    </S.MetricsGrid>
  );

  /**
   * 渲染历史数据 Tab 内容
   * 
   * 包含内容：
   * - 日期范围选择器和查询/导出按钮
   * - 历史数据表格：展示指定日期范围内的指数交易数据
   * - 表格列：交易日期、收盘价、涨跌额、涨跌幅、开盘价、最高价、最低价、成交量、成交额、换手率
   */
  const renderHistoryTab = () => (
    <>
      <Space style={{ marginBottom: 16 }} wrap>
        <RangePicker />
        <Button type="primary">查询</Button>
        <Button>导出</Button>
      </Space>
      <S.DataTable>
        <thead>
          <tr>
            <th>交易日期</th>
            <th>收盘价</th>
            <th>涨跌额</th>
            <th>涨跌幅</th>
            <th>开盘价</th>
            <th>最高价</th>
            <th>最低价</th>
            <th>成交量</th>
            <th>成交额</th>
            <th>换手率</th>
          </tr>
        </thead>
        <tbody>
          {mockHistoryData.map((item, index) => (
            <tr key={index}>
              <td>{item.tradeDate}</td>
              <td className="number">{item.close.toFixed(2)}</td>
              <td className={`number ${item.change >= 0 ? 'positive' : 'negative'}`}>
                {item.change >= 0 ? '+' : ''}
                {item.change.toFixed(2)}
              </td>
              <td className={`number ${item.changePercent >= 0 ? 'positive' : 'negative'}`}>
                {item.changePercent >= 0 ? '+' : ''}
                {item.changePercent.toFixed(2)}%
              </td>
              <td className="number">{item.open.toFixed(2)}</td>
              <td className="number">{item.high.toFixed(2)}</td>
              <td className="number">{item.low.toFixed(2)}</td>
              <td className="number">{item.volume}</td>
              <td className="number">{item.amount}</td>
              <td className="number">{item.turnover.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </S.DataTable>
    </>
  );

  /**
   * 渲染成分股 Tab 内容
   * 
   * 包含内容：
   * - 搜索框：支持按股票名称或代码搜索
   * - 排序选择器：支持按权重、涨跌幅、市值排序
   * - 成分股网格列表：展示股票名称、代码、权重、涨跌幅等信息
   */
  const renderConstituentsTab = () => (
    <>
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="搜索成分股..."
          value={constituentKeyword}
          onChange={(e) => setConstituentKeyword(e.target.value)}
          style={{ maxWidth: 300 }}
        />
        <Select
          value={constituentSort}
          onChange={setConstituentSort}
          style={{ minWidth: 150 }}
        >
          <Option value="weight">按权重排序</Option>
          <Option value="change">按涨跌幅排序</Option>
          <Option value="market">按市值排序</Option>
        </Select>
      </Space>
      <S.ConstituentsGrid>
        {filteredConstituents.map((item, index) => (
          <S.ConstituentItem key={index}>
            <div>
              <S.ConstituentName>
                {item.name} ({item.code})
              </S.ConstituentName>
              <div
                style={{
                  fontSize: 12,
                  color: item.changePercent >= 0 ? '#ff4d4f' : '#52c41a',
                  marginTop: 4,
                }}
              >
                {item.changePercent >= 0 ? '+' : ''}
                {item.changePercent.toFixed(2)}%
              </div>
            </div>
            <S.ConstituentWeight>{item.weight.toFixed(2)}%</S.ConstituentWeight>
          </S.ConstituentItem>
        ))}
      </S.ConstituentsGrid>
    </>
  );

  /**
   * 渲染估值分析 Tab 内容
   * 
   * 包含内容：
   * - 估值分位图占位区域（后续可集成 ECharts 图表）
   * - PE/PB 估值指标卡片：
   *   - 当前值、历史均值、历史最低、历史最高
   *   - 分位数信息、较均值变化等
   */
  const renderValuationTab = () => (
    <>
      <S.ComparisonChart>[估值分位图 - PE/PB 历史分位走势]</S.ComparisonChart>
      <S.MetricsGrid>
        <S.MetricCard>
          <S.MetricLabel>PE 当前值</S.MetricLabel>
          <S.MetricValue>12.35</S.MetricValue>
          <S.MetricTrend>分位: 65.3% (近5年)</S.MetricTrend>
        </S.MetricCard>
        <S.MetricCard>
          <S.MetricLabel>PE 历史均值</S.MetricLabel>
          <S.MetricValue>11.85</S.MetricValue>
          <S.MetricTrend $positive={true}>较均值 +4.2%</S.MetricTrend>
        </S.MetricCard>
        <S.MetricCard>
          <S.MetricLabel>PE 历史最低</S.MetricLabel>
          <S.MetricValue>8.95</S.MetricValue>
          <S.MetricTrend>2022-10-31</S.MetricTrend>
        </S.MetricCard>
        <S.MetricCard>
          <S.MetricLabel>PE 历史最高</S.MetricLabel>
          <S.MetricValue>18.65</S.MetricValue>
          <S.MetricTrend>2021-02-18</S.MetricTrend>
        </S.MetricCard>
        <S.MetricCard>
          <S.MetricLabel>PB 当前值</S.MetricLabel>
          <S.MetricValue>1.42</S.MetricValue>
          <S.MetricTrend>分位: 68.5% (近5年)</S.MetricTrend>
        </S.MetricCard>
        <S.MetricCard>
          <S.MetricLabel>PB 历史均值</S.MetricLabel>
          <S.MetricValue>1.35</S.MetricValue>
          <S.MetricTrend $positive={true}>较均值 +5.2%</S.MetricTrend>
        </S.MetricCard>
      </S.MetricsGrid>
    </>
  );

  /**
   * 渲染指数对比 Tab 内容
   * 
   * 包含内容：
   * - 对比指数选择器：选择要对比的其他指数
   * - 对比图表占位区域（后续可集成 ECharts 图表展示相对涨跌幅走势）
   * - 对比数据表格：展示多个指数的关键指标对比（点位、涨跌幅、年初至今、PE、PB等）
   */
  const renderComparisonTab = () => (
    <>
      <div style={{ marginBottom: 16 }}>
        <Select
          value={comparisonIndex}
          onChange={setComparisonIndex}
          placeholder="选择对比指数"
          style={{ minWidth: 200 }}
        >
          <Option value="000001">上证指数 (000001)</Option>
          <Option value="000905">中证500 (000905)</Option>
          <Option value="399006">创业板指 (399006)</Option>
          <Option value="000016">上证50 (000016)</Option>
        </Select>
      </div>
      <S.ComparisonChart>[指数对比图表 - 相对涨跌幅走势]</S.ComparisonChart>
      <S.DataTable>
        <thead>
          <tr>
            <th>指数名称</th>
            <th>当前点位</th>
            <th>涨跌幅</th>
            <th>年初至今</th>
            <th>PE</th>
            <th>PB</th>
          </tr>
        </thead>
        <tbody>
          {mockComparison.map((item, index) => (
            <tr key={index}>
              <td>
                {item.name} ({item.code})
              </td>
              <td className="number">{item.currentPrice.toFixed(2)}</td>
              <td
                className={`number ${item.changePercent >= 0 ? 'positive' : 'negative'}`}
              >
                {item.changePercent >= 0 ? '+' : ''}
                {item.changePercent.toFixed(2)}%
              </td>
              <td className={`number ${item.ytd >= 0 ? 'positive' : 'negative'}`}>
                {item.ytd >= 0 ? '+' : ''}
                {item.ytd.toFixed(2)}%
              </td>
              <td className="number">{item.pe.toFixed(2)}</td>
              <td className="number">{item.pb.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </S.DataTable>
    </>
  );

  /**
   * 渲染新闻公告 Tab 内容
   * 
   * 展示与当前指数相关的新闻和公告列表：
   * - 新闻标题
   * - 发布时间和来源
   */
  const renderNewsTab = () => (
    <S.NewsList>
      {mockNews.map((item, index) => (
        <S.NewsItem key={index}>
          <S.NewsTitle>{item.title}</S.NewsTitle>
          <S.NewsMeta>
            <span>{item.date}</span>
            <span>来源：{item.source}</span>
          </S.NewsMeta>
        </S.NewsItem>
      ))}
    </S.NewsList>
  );

  // ==================== 主组件渲染 ====================
  // Loading 状态
  if (loading) {
    return (
      <>
        <PageTitle>指数详情</PageTitle>
        <S.Wrapper>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        </S.Wrapper>
      </>
    );
  }

  // 数据为空状态
  if (!indexInfo) {
    return (
      <>
        <PageTitle>指数详情</PageTitle>
        <S.Wrapper>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{ marginBottom: 16 }}
          >
            返回
          </Button>
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            未找到指数数据
          </div>
        </S.Wrapper>
      </>
    );
  }

  return (
    <>
      <PageTitle>指数详情</PageTitle>
      <S.Wrapper>
        {/* ========== 返回按钮 ========== */}
        {/* 点击返回上一页 */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginBottom: 16 }}
        >
          返回
        </Button>

        {/* ========== 页面头部：指数基本信息 ========== */}
        {/* 展示指数的核心信息：名称、代码、当前价格、涨跌幅、关键统计数据 */}
        <S.IndexHeader>
          <S.IndexHeaderTop>
            <S.IndexTitle>
              <h1>
                {indexInfo.name} <span className="code">({indexInfo.code})</span>
              </h1>
              <p>{indexInfo.enName}</p>
              {/* 显示数据日期：标注为"今日（最近一日）" */}
              {indexInfo.tradeDate && (
                <p
                  style={{
                    fontSize: '12px',
                    opacity: 0.8,
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>数据日期：{formatDate(indexInfo.tradeDate)}</span>
                  <span style={{ color: '#ff9800', fontWeight: 500 }}>
                    （最近一日）
                  </span>
                </p>
              )}
            </S.IndexTitle>
            <S.IndexPrice>
              <S.CurrentPrice>{indexInfo.currentPrice.toFixed(2)}</S.CurrentPrice>
              <S.PriceChange $positive={isPositive}>
                <span>{isPositive ? '▲' : '▼'}</span>
                <span>
                  {isPositive ? '+' : ''}
                  {indexInfo.change.toFixed(2)}
                </span>
                <span>
                  ({isPositive ? '+' : ''}
                  {indexInfo.changePercent.toFixed(2)}%)
                </span>
              </S.PriceChange>
            </S.IndexPrice>
          </S.IndexHeaderTop>
          <S.IndexStats>
            <S.StatItem>
              <S.StatLabel>今日开盘</S.StatLabel>
              <S.StatValue>{indexInfo.open.toFixed(2)}</S.StatValue>
            </S.StatItem>
            <S.StatItem>
              <S.StatLabel>
                昨日收盘
                {indexInfo.prevTradeDate && (
                  <span
                    style={{
                      fontSize: '10px',
                      display: 'block',
                      opacity: 0.7,
                      marginTop: '2px',
                    }}
                  >
                    ({formatDate(indexInfo.prevTradeDate)})
                  </span>
                )}
                {!indexInfo.prevTradeDate && indexInfo.tradeDate && (
                  <span
                    style={{
                      fontSize: '10px',
                      display: 'block',
                      opacity: 0.7,
                      marginTop: '2px',
                    }}
                  >
                    （往前一个交易日）
                  </span>
                )}
              </S.StatLabel>
              <S.StatValue>{indexInfo.prevClose.toFixed(2)}</S.StatValue>
            </S.StatItem>
            <S.StatItem>
              <S.StatLabel>最高价</S.StatLabel>
              <S.StatValue>{indexInfo.high.toFixed(2)}</S.StatValue>
            </S.StatItem>
            <S.StatItem>
              <S.StatLabel>最低价</S.StatLabel>
              <S.StatValue>{indexInfo.low.toFixed(2)}</S.StatValue>
            </S.StatItem>
            <S.StatItem>
              <S.StatLabel>成交量</S.StatLabel>
              <S.StatValue>{indexInfo.volume}</S.StatValue>
            </S.StatItem>
            <S.StatItem>
              <S.StatLabel>换手率</S.StatLabel>
              <S.StatValue>{indexInfo.turnover.toFixed(2)}%</S.StatValue>
            </S.StatItem>
          </S.IndexStats>
        </S.IndexHeader>

        {/* ========== Tab 切换区域 ========== */}
        {/* 提供 7 个标签页切换不同内容：K线图、关键指标、历史数据、成分股、估值分析、指数对比、新闻公告 */}
        <S.TabsContainer>
          {/* Tab 标签头部 */}
          <S.TabsHeader>
            <S.TabItem
              $active={activeTab === 'kline'}
              onClick={() => setActiveTab('kline')}
            >
              K线图
            </S.TabItem>
            <S.TabItem
              $active={activeTab === 'metrics'}
              onClick={() => setActiveTab('metrics')}
            >
              关键指标
            </S.TabItem>
            <S.TabItem
              $active={activeTab === 'history'}
              onClick={() => setActiveTab('history')}
            >
              历史数据
            </S.TabItem>
            <S.TabItem
              $active={activeTab === 'constituents'}
              onClick={() => setActiveTab('constituents')}
            >
              成分股
            </S.TabItem>
            <S.TabItem
              $active={activeTab === 'valuation'}
              onClick={() => setActiveTab('valuation')}
            >
              估值分析
            </S.TabItem>
            <S.TabItem
              $active={activeTab === 'comparison'}
              onClick={() => setActiveTab('comparison')}
            >
              指数对比
            </S.TabItem>
            <S.TabItem
              $active={activeTab === 'news'}
              onClick={() => setActiveTab('news')}
            >
              新闻公告
            </S.TabItem>
          </S.TabsHeader>
          {/* Tab 内容区域：根据 activeTab 状态渲染对应的内容 */}
          <S.TabContent>
            {activeTab === 'kline' && renderKlineTab()}
            {activeTab === 'metrics' && renderMetricsTab()}
            {activeTab === 'history' && renderHistoryTab()}
            {activeTab === 'constituents' && renderConstituentsTab()}
            {activeTab === 'valuation' && renderValuationTab()}
            {activeTab === 'comparison' && renderComparisonTab()}
            {activeTab === 'news' && renderNewsTab()}
          </S.TabContent>
        </S.TabsContainer>
      </S.Wrapper>
    </>
  );
};

export default IndexDetailPage;

