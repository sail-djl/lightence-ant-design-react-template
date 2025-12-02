import styled from 'styled-components';

export const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 12px;
  padding: 16px;
  max-height: 500px;
  overflow-y: auto;

  /* 滚动条样式 */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--text-light-color);
  }
`;

export const IconItem = styled.div<{ $selected?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 8px;
  border: 1px solid ${(props) => (props.$selected ? 'var(--primary-color)' : 'var(--border-color)')};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${(props) => (props.$selected ? 'rgba(var(--primary-rgb-color), 0.1)' : 'transparent')};

  &:hover {
    border-color: var(--primary-color);
    background-color: rgba(var(--primary-rgb-color), 0.1);
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const IconWrapper = styled.div`
  font-size: 24px;
  margin-bottom: 8px;
  color: var(--text-main-color);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const IconName = styled.div`
  font-size: 10px;
  text-align: center;
  word-break: break-all;
  color: var(--text-main-color);
  line-height: 1.2;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
