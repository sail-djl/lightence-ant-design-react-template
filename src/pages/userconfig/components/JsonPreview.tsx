import React from 'react';
import * as S from './JsonPreview.styles';

interface JsonPreviewProps {
  config: {
    module?: string;
    config_type?: string;
    config_key?: string;
    config_value?: Record<string, any>;
    is_active?: boolean;
    is_default?: boolean;
    description?: string;
  };
}

export const JsonPreview: React.FC<JsonPreviewProps> = ({ config }) => {
  const formatJson = (obj: any): string => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return '{}';
    }
  };

  const isEmpty = !config.config_type;

  if (isEmpty) {
    return (
      <S.JsonPreviewContent className="empty">
        请选择配置类型后，填写表单内容，JSON配置将实时生成并显示在这里...
      </S.JsonPreviewContent>
    );
  }

  const fullConfig = {
    module: config.module || null,
    config_type: config.config_type,
    config_key: config.config_key || 'default',
    config_value: config.config_value || {},
    is_active: config.is_active ?? true,
    is_default: config.is_default ?? false,
    description: config.description || null,
  };

  return (
    <S.JsonPreviewContent>
      <pre>{formatJson(fullConfig)}</pre>
    </S.JsonPreviewContent>
  );
};


