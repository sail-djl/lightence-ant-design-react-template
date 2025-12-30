import styled from 'styled-components';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';

export const Card = styled(BaseCard)`
  width: 100%;
  margin-bottom: 2rem;
  .ant-card-head-title {
    font-size: 1rem;
  }
`;

export const FilterBar = styled.div`
  margin-bottom: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
`;

export const FilterItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    font-size: 14px;
    color: #666;
    white-space: nowrap;
  }
`;
