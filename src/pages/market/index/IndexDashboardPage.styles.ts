import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 20px;
  max-width: 1920px;
  margin: 0 auto;
`;

export const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 30px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  h2 {
    color: white;
    margin-bottom: 8px;
  }
`;

interface IndexCardProps {
  $trend: 'strong' | 'weak';
}

export const IndexCard = styled.div<IndexCardProps>`
  background: ${(props) =>
    props.$trend === 'strong'
      ? 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
      : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'};
  border-radius: 8px;
  padding: 16px;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  min-height: 180px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const IndexCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

export const IndexName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #262626;
`;

export const FlameIcon = styled.span`
  font-size: 20px;
`;

export const IndexValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
  color: #262626;
`;

interface IndexChangeProps {
  $positive: boolean;
}

export const IndexChange = styled.div<IndexChangeProps>`
  font-size: 14px;
  margin-bottom: 4px;
  color: ${(props) => (props.$positive ? '#f5222d' : '#52c41a')};
`;

export const IndexMeta = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 8px;
  line-height: 1.6;
`;

export const SignalCard = styled.div`
  background: #fafafa;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e8e8e8;
`;

export const SignalItem = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SignalLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

export const SignalValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  display: flex;
  align-items: center;
`;

interface RiskLightProps {
  $color: 'green' | 'yellow' | 'red';
}

export const RiskLight = styled.span<RiskLightProps>`
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 8px;
  background: ${(props) => {
    switch (props.$color) {
      case 'green':
        return '#52c41a';
      case 'yellow':
        return '#faad14';
      case 'red':
        return '#f5222d';
      default:
        return '#faad14';
    }
  }};
  box-shadow: 0 0 10px
    ${(props) => {
      switch (props.$color) {
        case 'green':
          return 'rgba(82, 196, 26, 0.5)';
        case 'yellow':
          return 'rgba(250, 173, 20, 0.5)';
        case 'red':
          return 'rgba(245, 34, 45, 0.5)';
        default:
          return 'rgba(250, 173, 20, 0.5)';
      }
    }};
`;
