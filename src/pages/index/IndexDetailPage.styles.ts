import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 20px;
  max-width: 1920px;
  margin: 0 auto;
  background: #f0f2f5;
  min-height: 100vh;
`;

// 页面头部 - 指数基本信息
export const IndexHeader = styled.div`
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  color: white;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const IndexHeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

export const IndexTitle = styled.div`
  flex: 1;

  h1 {
    font-size: 32px;
    margin-bottom: 8px;
    font-weight: 600;
    color: white;
  }

  .code {
    font-size: 16px;
    opacity: 0.9;
    font-weight: normal;
  }

  p {
    opacity: 0.9;
    font-size: 14px;
    margin-top: 4px;
  }
`;

export const IndexPrice = styled.div`
  text-align: right;

  @media (max-width: 768px) {
    text-align: left;
  }
`;

export const CurrentPrice = styled.div`
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 8px;
  line-height: 1;
`;

interface PriceChangeProps {
  $positive: boolean;
}

export const PriceChange = styled.div<PriceChangeProps>`
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
  color: ${(props) => (props.$positive ? '#ff4d4f' : '#52c41a')};

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

export const IndexStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

export const StatItem = styled.div`
  text-align: center;
`;

export const StatLabel = styled.div`
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 4px;
`;

export const StatValue = styled.div`
  font-size: 20px;
  font-weight: 600;
`;

// Tab 容器
export const TabsContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 20px;
`;

export const TabsHeader = styled.div`
  display: flex;
  border-bottom: 2px solid #f0f0f0;
  background: #fafafa;
  padding: 0 20px;
  overflow-x: auto;
`;

interface TabItemProps {
  $active: boolean;
}

export const TabItem = styled.div<TabItemProps>`
  padding: 16px 24px;
  cursor: pointer;
  border-bottom: 2px solid ${(props) => (props.$active ? '#1890ff' : 'transparent')};
  margin-bottom: -2px;
  transition: all 0.3s;
  white-space: nowrap;
  font-size: 14px;
  color: ${(props) => (props.$active ? '#1890ff' : '#666')};
  font-weight: ${(props) => (props.$active ? 600 : 400)};
  position: relative;

  &:hover {
    color: #1890ff;
    background: rgba(24, 144, 255, 0.05);
  }
`;

export const TabContent = styled.div`
  padding: 24px;
`;

// K线图区域
export const ChartSection = styled.div`
  margin-bottom: 24px;
`;

export const ChartToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const ChartPeriods = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

interface PeriodBtnProps {
  $active: boolean;
}

export const PeriodBtn = styled.button<PeriodBtnProps>`
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: ${(props) => (props.$active ? '#1890ff' : 'white')};
  color: ${(props) => (props.$active ? 'white' : '#333')};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  border-color: ${(props) => (props.$active ? '#1890ff' : '#d9d9d9')};

  &:hover {
    border-color: #1890ff;
    color: #1890ff;
  }
`;

export const ChartIndicators = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const ChartContainer = styled.div`
  height: 500px;
  background: #fafafa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  border: 1px solid #e8e8e8;
`;

// 关键指标卡片
export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

export const MetricCard = styled.div`
  background: #fafafa;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
`;

export const MetricLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

export const MetricValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #262626;
`;

export const MetricTrend = styled.div<{ $positive?: boolean }>`
  font-size: 12px;
  margin-top: 4px;
  color: ${(props) => {
    if (props.$positive === true) return '#ff4d4f';
    if (props.$positive === false) return '#52c41a';
    return '#999';
  }};
`;

// 数据表格
export const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;

  thead {
    background: #fafafa;
  }

  th {
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
    color: #262626;
    border-bottom: 2px solid #e8e8e8;
    cursor: pointer;
    user-select: none;

    &:hover {
      background: #f0f0f0;
    }
  }

  td {
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    font-size: 14px;
  }

  tbody tr:hover {
    background: #fafafa;
  }

  .number {
    text-align: right;
    font-family: 'Monaco', 'Menlo', monospace;
  }

  .positive {
    color: #ff4d4f;
  }

  .negative {
    color: #52c41a;
  }
`;

// 成分股列表
export const ConstituentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
`;

export const ConstituentItem = styled.div`
  background: #fafafa;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #f0f0f0;
    border-color: #1890ff;
  }
`;

export const ConstituentName = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

export const ConstituentWeight = styled.div`
  font-size: 14px;
  color: #666;
`;

// 对比图表
export const ComparisonChart = styled.div`
  height: 300px;
  background: #fafafa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  border: 1px solid #e8e8e8;
  margin-bottom: 24px;
`;

// 新闻列表
export const NewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const NewsItem = styled.div`
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #f0f0f0;
    border-color: #1890ff;
  }
`;

export const NewsTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #262626;
`;

export const NewsMeta = styled.div`
  font-size: 12px;
  color: #999;
  display: flex;
  gap: 16px;
`;


