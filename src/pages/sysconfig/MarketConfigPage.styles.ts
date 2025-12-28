import styled from 'styled-components';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';

export const Wrapper = styled.div`
  padding: 24px;
  background: #f0f2f5;
  min-height: 100vh;
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1f1f1f;
  margin: 0;
`;

export const ActionBar = styled.div`
  display: flex;
  gap: 12px;
`;

export const ConfigSection = styled(BaseCard)`
  margin-bottom: 24px;
  scroll-margin-top: 24px;

  .ant-card-body {
    padding: 24px;
  }
`;

export const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 12px;

  &::before {
    content: '';
    display: block;
    width: 4px;
    height: 16px;
    background: #1890ff;
    border-radius: 2px;
  }
`;

export const SectionDescription = styled.p`
  color: #999;
  font-size: 13px;
  margin-bottom: 16px;
`;

export const ConfigGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

export const FormItem = styled.div`
  margin-bottom: 16px;
`;

export const FormLabel = styled.label`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  display: block;
`;

export const FormHint = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 4px;
`;

export const PhaseCard = styled.div<{ $isActive?: boolean }>`
  border: 1px solid #f0f0f0;
  padding: 16px;
  border-radius: 4px;
  border-left: ${(props) => (props.$isActive ? '4px solid #1890ff' : '1px solid #f0f0f0')};
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const PhaseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  align-items: center;
`;

export const PhaseName = styled.span`
  font-weight: 600;
  color: #333;
`;

export const PhaseTag = styled.span`
  display: inline-block;
  padding: 2px 8px;
  background: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  font-size: 12px;
`;

export const ConstraintTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background: #fafafa;
    border-bottom: 1px solid #f0f0f0;
  }

  th {
    padding: 12px;
    text-align: left;
    font-weight: 600;
    color: #333;
    font-size: 14px;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid #f0f0f0;
    color: #666;
    font-size: 14px;
  }

  tbody tr:hover {
    background: #fafafa;
  }
`;

export const JsonPreview = styled.pre`
  background: #fafafa;
  border: 1px solid #f0f0f0;
  padding: 16px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  color: #333;
  overflow-x: auto;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

export const PermissionRuleRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const PermissionLabel = styled.span`
  font-size: 12px;
  color: #666;
  min-width: 40px;
`;

export const TemplatePreview = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 4px;
`;

export const AnchorMenu = styled.div`
  position: fixed;
  right: 24px;
  top: 100px;
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 180px;
  z-index: 100;
`;

export const AnchorLink = styled.a<{ $active?: boolean }>`
  display: block;
  padding: 8px 12px;
  color: ${(props) => (props.$active ? '#1890ff' : '#666')};
  text-decoration: none;
  border-left: 2px solid ${(props) => (props.$active ? '#1890ff' : 'transparent')};
  font-size: 13px;
  background: ${(props) => (props.$active ? '#e6f7ff' : 'transparent')};
  transition: all 0.2s;

  &:hover {
    color: #1890ff;
    border-left-color: #1890ff;
    background: #e6f7ff;
  }
`;

export const ViewAllLink = styled.div`
  margin-top: 12px;
  text-align: center;
  color: #1890ff;
  cursor: pointer;
  font-size: 13px;

  &:hover {
    color: #40a9ff;
  }
`;
