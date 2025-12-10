import styled from 'styled-components';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';

export const Card = styled(BaseCard)`
  width: 100%;
  margin-bottom: 2rem;
  .ant-card-head-title {
    font-size: 1rem;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`;

export const Label = styled.span`
  margin-left: 0.5rem;
`;









