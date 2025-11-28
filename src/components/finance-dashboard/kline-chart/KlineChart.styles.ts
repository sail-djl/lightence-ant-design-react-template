import styled from 'styled-components';
import { Select } from 'antd';

export const KlineChartWrapper = styled.div`
  width: 100%;
`;

export const ChartControls = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  align-items: center;
`;

export const SymbolSelect = styled(Select)`
  min-width: 120px;
`;

