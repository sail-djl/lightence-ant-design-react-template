import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1920px;
  margin: 0 auto;
  padding: 20px;
`;

export const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 30px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  h1 {
    font-size: 28px;
    margin-bottom: 8px;
  }

  p {
    opacity: 0.9;
    font-size: 14px;
  }
`;

export const EtfSelectorCard = styled.div<{ $active?: boolean }>`
  background: ${(props) =>
    props.$active
      ? 'linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%)'
      : 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)'};
  border: 2px solid ${(props) => (props.$active ? '#ffd591' : '#91d5ff')};
  border-radius: 8px;
  padding: 20px;
`;

export const EtfSelectorLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 12px;
`;

export const EtfInfo = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

export const EtfInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  flex-wrap: wrap;

  span {
    color: #666;
  }

  strong {
    font-weight: 600;
    color: #262626;
  }
`;

export const DeviationDisplay = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
`;

export const SectionTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #262626;
  border-left: 4px solid #1890ff;
  padding-left: 12px;
`;

export const TimeRangeSelector = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

export const DeviationSummaryCard = styled.div`
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  border: 1px solid #e8e8e8;

  div:first-child {
    font-size: 12px;
    color: #666;
    margin-bottom: 8px;
  }
`;

export const DeviationValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1890ff;
`;

export const PolarCard = styled.div`
  background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const PolarValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  margin: 8px 0;
`;

export const PolarStatus = styled.div`
  font-size: 14px;
  padding: 4px 12px;
  border-radius: 12px;
  display: inline-block;
  font-weight: 600;
  background: #f6ffed;
  color: #389e0d;
`;

export const BasketItem = styled.div`
  background: #fafafa;
  border: 2px solid #e8e8e8;
  border-radius: 6px;
  padding: 8px;
  text-align: center;
  transition: all 0.2s;

  &:hover {
    border-color: #1890ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
  }

  div:first-child {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 4px;
    color: #262626;
  }
`;

export const BasketMultiplier = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #1890ff;
  margin: 4px 0;
`;

export const CalcCard = styled.div<{ $highlight?: boolean }>`
  background: #fafafa;
  border-radius: 6px;
  padding: 10px;
  border: 1px solid #e8e8e8;
`;

export const CalcRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  gap: 8px;
  font-size: 12px;
`;

export const CalcInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const CalcValue = styled.span<{ $highlight?: boolean }>`
  font-size: ${(props) => (props.$highlight ? '16px' : '14px')};
  font-weight: 600;
  color: ${(props) => (props.$highlight ? '#1890ff' : '#262626')};
`;

export const SpecialCase = styled.div<{ $warning?: boolean }>`
  background: ${(props) => (props.$warning ? '#fff1f0' : '#fff7e6')};
  border: 1px solid ${(props) => (props.$warning ? '#ffccc7' : '#ffd591')};
  border-radius: 8px;
  padding: 16px;
`;

export const SpecialCaseTitle = styled.div<{ $warning?: boolean }>`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${(props) => (props.$warning ? '#cf1322' : '#d46b08')};
`;

export const SpecialCaseContent = styled.div`
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 8px;
`;
