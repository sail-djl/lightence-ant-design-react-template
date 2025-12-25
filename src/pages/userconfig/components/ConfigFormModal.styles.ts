import styled from 'styled-components';

export const ModalContent = styled.div`
  display: flex;
  gap: 24px;
  min-height: 500px;
`;

export const ConfigFormArea = styled.div`
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  max-height: calc(90vh - 200px);
  padding-right: 8px;
`;

export const JsonPreviewArea = styled.div`
  width: 400px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #f0f0f0;
  padding-left: 24px;
`;

export const JsonPreviewHeader = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #262626;
`;

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





