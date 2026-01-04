import React, { useState } from 'react';
import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import {
  Wrapper,
  HeroSection,
  HeroContent,
  HeroTitle,
  HeroMainStatus,
  PhaseBadge,
  HeroMetrics,
  HeroMetricItem,
  MetricLabel,
  MetricValue,
  HeroCta,
  SectionHeader,
  IndexBoardGrid,
  IndexCard,
  IndexName,
  IndexCode,
  IndexPriceRow,
  IndexPrice,
  IndexChange,
  IndexTags,
  TagBadge,
  ConstraintsGrid,
  ConstraintCard,
  ConstraintTitle,
  ConstraintValue,
  ConstraintArrow,
  ConstraintDesc,
  ConstraintImplication,
  MainGrid,
  ParticipationCard,
  PartStatus,
  PartIcon,
  PartInfo,
  PartAction,
  WatchlistCard,
  WatchlistTabs,
  TabItem,
  WatchlistContent,
  AnchorRow,
  AnchorItem,
  WatchlistItem,
  TickerInfo,
  TickerSymbol,
  TickerName,
  TickerPrice,
  PriceVal,
  PriceChange,
  AlertBar,
  AlertIcon,
} from './DashboardPage.styles';
import {
  mockMarketRegime,
  mockIndexData,
  mockConstraintData,
  mockParticipationData,
  mockWatchlistData,
  mockAnchorData,
  mockAlertData,
} from './mockData';

const { Text } = Typography;

/**
 * 首页面板 - A股决策启动页
 */
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [watchlistTab, setWatchlistTab] = useState<'default' | 'global'>('default');

  const handleIndexCardClick = (indexName: string) => {
    // TODO: 跳转到指数详情页
    console.log(`进入 ${indexName} 指数详情页`);
  };

  const handleParticipationCardClick = (title: string) => {
    // TODO: 跳转到对应的页面
    console.log(`进入 ${title} 专属页面`);
  };

  const handleMarketOverviewClick = () => {
    navigate('/macro/overview');
  };

  return (
    <>
      <PageTitle>A股决策启动页</PageTitle>
      <Wrapper>
        {/* 模块一：市场环境快照 */}
        <HeroSection>
          <HeroContent>
            <HeroTitle>当前市场环境（A股 Market Regime）</HeroTitle>
            <HeroMainStatus>
              {mockMarketRegime.phase} | {mockMarketRegime.phaseName}
              <PhaseBadge>{mockMarketRegime.badge}</PhaseBadge>
            </HeroMainStatus>
            <HeroMetrics>
              <HeroMetricItem>
                <MetricLabel>宏观状态</MetricLabel>
                <MetricValue>{mockMarketRegime.macroStatus}</MetricValue>
              </HeroMetricItem>
              <HeroMetricItem>
                <MetricLabel>环境许可度</MetricLabel>
                <MetricValue $color={mockMarketRegime.environmentColor}>
                  {mockMarketRegime.environment}
                </MetricValue>
              </HeroMetricItem>
              <HeroMetricItem>
                <MetricLabel>建议风险敞口</MetricLabel>
                <MetricValue>{mockMarketRegime.riskExposure}</MetricValue>
              </HeroMetricItem>
              <HeroMetricItem>
                <MetricLabel>适用市场</MetricLabel>
                <MetricValue style={{ fontSize: '16px', marginTop: '4px' }}>
                  {mockMarketRegime.applicableMarket}
                </MetricValue>
              </HeroMetricItem>
            </HeroMetrics>
          </HeroContent>
          <HeroCta>
            <Button
              type="primary"
              size="large"
              onClick={handleMarketOverviewClick}
              style={{
                padding: '16px 48px',
                fontSize: '18px',
                height: 'auto',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(24, 144, 255, 0.4)',
              }}
            >
              进入市场总览
              <div style={{ fontSize: '14px', fontWeight: 400, marginTop: '4px', opacity: 0.9 }}>
                Macro Linkage Radar →
              </div>
            </Button>
          </HeroCta>
        </HeroSection>

        {/* 模块：A股指数快照 */}
        <div>
          <SectionHeader>A股指数快照 (Core Index Board)</SectionHeader>
          <IndexBoardGrid>
            {mockIndexData.map((index) => {
              const isUp = index.changePercent >= 0;
              return (
                <IndexCard
                  key={index.code}
                  onClick={() => handleIndexCardClick(index.name)}
                >
                  <IndexName>{index.name}</IndexName>
                  <IndexCode>{index.code}</IndexCode>
                  <IndexPriceRow>
                    <IndexPrice $isUp={isUp}>
                      {index.price.toLocaleString('zh-CN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </IndexPrice>
                    <IndexChange $isUp={isUp}>
                      {isUp ? '+' : ''}
                      {index.changePercent.toFixed(2)}%
                    </IndexChange>
                  </IndexPriceRow>
                  <IndexTags>
                    {index.tags.map((tag, idx) => (
                      <TagBadge key={idx} $type={tag.type}>
                        {tag.text}
                      </TagBadge>
                    ))}
                  </IndexTags>
                </IndexCard>
              );
            })}
          </IndexBoardGrid>
        </div>

        {/* 模块二：关键约束信号 */}
        <div>
          <SectionHeader>关键约束信号 (Key Constraints) - A股定价口径</SectionHeader>
          <ConstraintsGrid>
            {mockConstraintData.map((constraint, idx) => (
              <ConstraintCard
                key={idx}
                onClick={() => {
                  // TODO: 跳转到对应的约束详情页
                  console.log(`查看 ${constraint.title} 详情`);
                }}
              >
                <ConstraintTitle>{constraint.title}</ConstraintTitle>
                <ConstraintValue>
                  {constraint.value}
                  <ConstraintArrow $direction={constraint.direction}>
                    {constraint.direction === 'up' && '↗'}
                    {constraint.direction === 'down' && '↘'}
                    {constraint.direction === 'flat' && '→'}
                  </ConstraintArrow>
                </ConstraintValue>
                <ConstraintDesc>
                  {constraint.description}
                  <br />
                  <ConstraintImplication>{constraint.implication}</ConstraintImplication>
                </ConstraintDesc>
              </ConstraintCard>
            ))}
          </ConstraintsGrid>
        </div>

        {/* 模块三和四：可参与方向和关注列表 */}
        <MainGrid>
          {/* 左侧：当前可参与方向 */}
          <div>
            <SectionHeader>当前可参与方向 (A-Share Actionable Focus)</SectionHeader>
            <div>
              {mockParticipationData.map((part, idx) => (
                <ParticipationCard
                  key={idx}
                  $borderColor={part.borderColor}
                  onClick={() => handleParticipationCardClick(part.title)}
                >
                  <PartStatus>
                    <PartIcon $status={part.status}>
                      {part.status === 'check' ? '✔' : '⚠'}
                    </PartIcon>
                    <PartInfo>
                      <h3>{part.title}</h3>
                      <p>{part.description}</p>
                    </PartInfo>
                  </PartStatus>
                  <PartAction>{part.action}</PartAction>
                </ParticipationCard>
              ))}
            </div>

            {/* 模块五：A股结构异动 */}
            <AlertBar>
              <AlertIcon>{mockAlertData.icon}</AlertIcon>
              <div style={{ flex: 1 }}>
                <strong>{mockAlertData.title}</strong>
                <span style={{ marginLeft: 8 }}>{mockAlertData.content}</span>
                {mockAlertData.detail && (
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                    {mockAlertData.detail}
                  </div>
                )}
              </div>
              <a
                href={mockAlertData.link || '#'}
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: 跳转到异动详情
                  console.log('查看异动详情');
                }}
                style={{ fontSize: '12px', color: '#1890ff' }}
              >
                查看异动详情 →
              </a>
            </AlertBar>
          </div>

          {/* 右侧：我的关注 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <SectionHeader>我的关注 (A股 Watchlist)</SectionHeader>
              <span
                style={{
                  fontSize: '12px',
                  color: '#1890ff',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  // TODO: 管理关注列表
                  console.log('管理关注列表');
                }}
              >
                Manage
              </span>
            </div>
            <WatchlistCard>
              <WatchlistTabs>
                <TabItem
                  $active={watchlistTab === 'default'}
                  onClick={() => setWatchlistTab('default')}
                >
                  A股 (Default)
                </TabItem>
                <TabItem
                  $active={watchlistTab === 'global'}
                  onClick={() => setWatchlistTab('global')}
                >
                  全球 (Global)
                </TabItem>
              </WatchlistTabs>
              <AnchorRow>
                <AnchorItem>
                  <span>上证:</span>
                  <span style={{ color: mockAnchorData.shanghai.changePercent >= 0 ? '#ff4d4f' : '#52c41a' }}>
                    {mockAnchorData.shanghai.changePercent >= 0 ? '+' : ''}
                    {mockAnchorData.shanghai.changePercent.toFixed(2)}%
                  </span>
                </AnchorItem>
                <AnchorItem>
                  <span>创业板:</span>
                  <span style={{ color: mockAnchorData.chuangyeban.changePercent >= 0 ? '#ff4d4f' : '#52c41a' }}>
                    {mockAnchorData.chuangyeban.changePercent >= 0 ? '+' : ''}
                    {mockAnchorData.chuangyeban.changePercent.toFixed(2)}%
                  </span>
                </AnchorItem>
                <AnchorItem>
                  <span>沪深300:</span>
                  <span style={{ color: mockAnchorData.hushen300.changePercent >= 0 ? '#ff4d4f' : '#52c41a' }}>
                    {mockAnchorData.hushen300.changePercent >= 0 ? '+' : ''}
                    {mockAnchorData.hushen300.changePercent.toFixed(2)}%
                  </span>
                </AnchorItem>
              </AnchorRow>
              <WatchlistContent>
                {mockWatchlistData.map((item, idx) => {
                  const isUp = item.changePercent >= 0;
                  return (
                    <WatchlistItem key={idx}>
                      <TickerInfo>
                        <TickerSymbol>{item.symbol}</TickerSymbol>
                        <TickerName>{item.name}</TickerName>
                      </TickerInfo>
                      <TickerPrice>
                        <PriceVal>{item.price.toFixed(3)}</PriceVal>
                        <PriceChange $isUp={isUp}>
                          {isUp ? '+' : ''}
                          {item.changePercent.toFixed(2)}%
                        </PriceChange>
                      </TickerPrice>
                    </WatchlistItem>
                  );
                })}
              </WatchlistContent>
            </WatchlistCard>
          </div>
        </MainGrid>
      </Wrapper>
    </>
  );
};

export default DashboardPage;
