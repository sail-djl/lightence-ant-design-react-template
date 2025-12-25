import styled from 'styled-components';

export const FormCard = styled.div`
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 16px;
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
`;

export const FormCardTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #262626;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 12px;
`;

export const IndexSelectSection = styled.div`
  background: #fafafa;
  padding: 16px;
  border-radius: 6px;
`;

export const IndexList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  max-height: 300px;
  overflow-y: auto;
`;

export const IndexItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  cursor: move;

  &:hover {
    border-color: #1890ff;
    box-shadow: 0 2px 4px rgba(24, 144, 255, 0.1);
  }
`;





