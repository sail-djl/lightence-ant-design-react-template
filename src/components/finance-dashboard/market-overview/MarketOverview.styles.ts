import styled from 'styled-components';

export const MarketOverviewWrapper = styled.div`
  width: 100%;
`;

export const MarketList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const MarketItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
`;

export const MarketInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Symbol = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: var(--text-main-color);
`;

export const Name = styled.div`
  font-size: 12px;
  color: var(--text-light-color);
`;

export const MarketPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

export const ChangeText = styled.div<{ isPositive: boolean }>`
  font-size: 12px;
  color: ${(props) => (props.isPositive ? '#52c41a' : '#ff4d4f')};
`;

