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

export const PermissionsContainer = styled.div`
  max-height: 500px;
  overflow-y: auto;
  padding: 1rem;
`;

export const PermissionGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const ResourceTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--primary-color);
`;

export const PermissionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-left: 1rem;
`;
