import styled from 'styled-components';

export const IndicatorsWrapper = styled.div`
  width: 100%;
`;

export const ChangeText = styled.div<{ isPositive: boolean }>`
  margin-top: 8px;
  font-size: 12px;
  color: ${(props) => (props.isPositive ? '#52c41a' : '#ff4d4f')};
`;

