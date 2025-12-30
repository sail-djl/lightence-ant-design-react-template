import styled from 'styled-components';

export const JsonPreviewContent = styled.div`
  flex: 1;
  background: #1e1e1e;
  border: 1px solid #3c3c3c;
  border-radius: 4px;
  padding: 16px;
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.6;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
  color: #d4d4d4;
  min-height: 400px;

  pre {
    margin: 0;
    color: inherit;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  &.empty {
    color: #858585;
    font-style: italic;
    background: #fafafa;
    border-color: #e8e8e8;
  }
`;
