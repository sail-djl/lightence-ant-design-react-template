/**
 * 指数面板页面 (Index Dashboard Page)
 * 
 * 功能说明：
 * - 展示主要指数的实时概览信息（涨跌幅、成交量、估值分位等）
 * - 提供风格与行业轮动分析（热力图、雷达图）
 * - 显示资金流向与市场情绪（北向资金、ETF资金流）
 * - 展示指数详情K线图和策略信号
 * 
 * 组件结构：
 * - IndexOverview: 指数概览卡片区域
 * - StyleRotation: 风格与行业轮动分析
 * - FlowSentiment: 资金流向与情绪分析
 * - IndexDetail: 指数详情K线图
 * - StrategySignals: 策略信号卡片
 */
import React, { useState } from 'react';
import { Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { IndexOverview } from './components/IndexOverview';
import { StyleRotation } from './components/StyleRotation';
import { FlowSentiment } from './components/FlowSentiment';
import { IndexDetail } from './components/IndexDetail';
import { StrategySignals } from './components/StrategySignals';
import * as S from './IndexDashboardPage.styles';

const { Text } = Typography;

/**
 * 指数面板主页面组件
 * 
 * @returns {JSX.Element} 指数面板页面
 */
const IndexDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  
  // 当前选中的指数代码，用于指数详情图表展示
  const [selectedIndex, setSelectedIndex] = useState('000300');

  return (
    <>
      <PageTitle>{t('common.index-dashboard')}</PageTitle>
      <S.Wrapper>
        {/* 页面头部：标题和描述 */}
        <S.Header>
          <Typography.Title level={2}>📊 指数面板 - 指挥中枢</Typography.Title>
          <Text type="secondary">市场风格判断 · 仓位指导 · 策略信号</Text>
        </S.Header>

        {/* 指数概览区域：展示主要指数的实时数据卡片（从用户配置加载） */}
        <IndexOverview />

        {/* 第二行：风格轮动和资金流向（左右分栏） */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          {/* 左侧：风格与行业轮动分析 */}
          <BaseCol xs={24} lg={12}>
            <StyleRotation />
          </BaseCol>
          {/* 右侧：资金流向与情绪分析 */}
          <BaseCol xs={24} lg={12}>
            <FlowSentiment />
          </BaseCol>
        </Row>

        {/* 第三行：指数详情和策略信号（左右分栏） */}
        <Row gutter={[16, 16]}>
          {/* 左侧：指数详情K线图（占14列） */}
          <BaseCol xs={24} lg={14}>
            <IndexDetail selectedIndex={selectedIndex} onIndexChange={setSelectedIndex} />
          </BaseCol>
          {/* 右侧：策略信号卡片（占10列） */}
          <BaseCol xs={24} lg={10}>
            <StrategySignals />
          </BaseCol>
        </Row>
      </S.Wrapper>
    </>
  );
};

export default IndexDashboardPage;
