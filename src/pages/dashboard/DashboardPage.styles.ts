import styled from 'styled-components';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';

export const Wrapper = styled.div`
  padding: 24px;
  max-width: 1280px;
  margin: 0 auto;
  background: #f0f2f5;
  min-height: 100vh;
`;

// Hero Section - 市场环境快照
export const HeroSection = styled.div`
  background: linear-gradient(135deg, #001529 0%, #003a8c 100%);
  border-radius: 16px;
  padding: 32px 48px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 58, 140, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }
`;

export const HeroContent = styled.div`
  flex: 1;
  z-index: 1;
`;

export const HeroTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
`;

export const HeroMainStatus = styled.div`
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 24px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

export const PhaseBadge = styled.span`
  font-size: 16px;
  background: rgba(24, 144, 255, 0.3);
  padding: 4px 12px;
  border-radius: 20px;
  vertical-align: middle;
  border: 1px solid #1890ff;
`;

export const HeroMetrics = styled.div`
  display: flex;
  gap: 40px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 24px;
  }
`;

export const HeroMetricItem = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MetricLabel = styled.span`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 4px;
`;

export const MetricValue = styled.span<{ $color?: string }>`
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.$color || 'white'};
`;

export const HeroCta = styled.div`
  z-index: 1;
  text-align: right;

  @media (max-width: 768px) {
    text-align: left;
    width: 100%;
  }
`;

// Section Header
export const SectionHeader = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1f1f1f;
  width: 100%;

  &::before {
    content: '';
    display: block;
    width: 4px;
    height: 18px;
    background: #1890ff;
    border-radius: 2px;
    flex-shrink: 0;
  }
`;

// Index Board
export const IndexBoardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const IndexCard = styled(BaseCard)`
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-color: #d9d9d9;
    transform: translateY(-2px);
  }

  .ant-card-body {
    padding: 16px;
  }
`;

export const IndexName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
`;

export const IndexCode = styled.div`
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
`;

export const IndexPriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
`;

export const IndexPrice = styled.div<{ $isUp: boolean }>`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => (props.$isUp ? '#ff4d4f' : '#52c41a')};
`;

export const IndexChange = styled.div<{ $isUp: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.$isUp ? '#ff4d4f' : '#52c41a')};
`;

export const IndexTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

export const TagBadge = styled.span<{ $type?: 'hot' | 'cold' | 'blue' | 'default' }>`
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  background: #f5f5f5;
  color: #666;
  border: 1px solid transparent;

  ${(props) => {
    switch (props.$type) {
      case 'hot':
        return 'background: #fff1f0; color: #cf1322; border-color: #ffa39e;';
      case 'cold':
        return 'background: #f6ffed; color: #389e0d; border-color: #b7eb8f;';
      case 'blue':
        return 'background: #e6f7ff; color: #096dd9; border-color: #91d5ff;';
      default:
        return '';
    }
  }}
`;

// Constraints Grid
export const ConstraintsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const ConstraintCard = styled(BaseCard)`
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-color: #d9d9d9;
  }

  .ant-card-body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
`;

export const ConstraintTitle = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

export const ConstraintValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ConstraintArrow = styled.span<{ $direction: 'up' | 'down' | 'flat' }>`
  font-size: 18px;
  color: ${(props) => {
    switch (props.$direction) {
      case 'up':
        return '#ff4d4f';
      case 'down':
        return '#52c41a';
      case 'flat':
        return '#faad14';
      default:
        return '#666';
    }
  }};
`;

export const ConstraintDesc = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px dashed #f0f0f0;
  line-height: 1.4;
`;

export const ConstraintImplication = styled.span`
  color: #1890ff;
  font-weight: 500;
`;

// Main Grid - 左右分栏
export const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

// Participation List
export const ParticipationCard = styled(BaseCard)<{ $borderColor: string }>`
  border-radius: 8px;
  border-left: 4px solid ${(props) => props.$borderColor};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  transition: all 0.2s;
  cursor: pointer;
  margin-bottom: 12px;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .ant-card-body {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const PartStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const PartIcon = styled.div<{ $status: 'check' | 'warn' }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;

  ${(props) => {
    if (props.$status === 'check') {
      return 'background: #f6ffed; color: #52c41a; border: 1px solid #b7eb8f;';
    } else {
      return 'background: #fffbe6; color: #faad14; border: 1px solid #ffe58f;';
    }
  }}
`;

export const PartInfo = styled.div`
  h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 4px;
    color: #333;
  }

  p {
    font-size: 13px;
    color: #666;
    margin: 0;
  }
`;

export const PartAction = styled.div`
  color: #1890ff;
  font-size: 14px;
  font-weight: 500;
`;

// Watchlist
export const WatchlistCard = styled(BaseCard)`
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  overflow: hidden;

  .ant-card-body {
    padding: 0;
  }
`;

export const WatchlistTabs = styled.div`
  display: flex;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
`;

export const TabItem = styled.div<{ $active: boolean }>`
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 14px;
  cursor: pointer;
  color: ${(props) => (props.$active ? '#1890ff' : '#666')};
  background: ${(props) => (props.$active ? 'white' : '#fafafa')};
  border-bottom: 2px solid ${(props) => (props.$active ? '#1890ff' : 'transparent')};
  font-weight: ${(props) => (props.$active ? '500' : '400')};
  transition: all 0.2s;
`;

export const WatchlistContent = styled.div`
  padding: 0 20px 20px 20px;
`;

export const AnchorRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 20px;
  background: #f9f9f9;
  border-bottom: 1px solid #eee;
  font-size: 12px;
`;

export const AnchorItem = styled.span`
  span:first-child {
    color: #999;
    margin-right: 4px;
  }
`;

export const WatchlistItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

export const TickerInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TickerSymbol = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: #333;
`;

export const TickerName = styled.span`
  font-size: 12px;
  color: #999;
`;

export const TickerPrice = styled.div`
  text-align: right;
`;

export const PriceVal = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #333;
`;

export const PriceChange = styled.div<{ $isUp: boolean }>`
  font-size: 12px;
  color: ${(props) => (props.$isUp ? '#ff4d4f' : '#52c41a')};
`;

// Alert Bar
export const AlertBar = styled.div`
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  color: #0050b3;
  padding: 12px 16px;
  border-radius: 6px;
  margin-top: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
`;

export const AlertIcon = styled.span`
  font-size: 18px;
`;
