import React from 'react';
import * as S from './JsonPreview.styles';

interface JsonPreviewProps {
  config: {
    config_category?: string;
    config_type?: string;
    config_key?: string;
    config_value?: Record<string, any>;
    is_active?: boolean;
    is_default?: boolean;
    description?: string;
    version?: number;
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

  const isEmpty = !config.config_category || !config.config_type;

  if (isEmpty) {
    return (
      <S.JsonPreviewContent className="empty">
        请选择配置分类和配置类型后，填写表单内容，JSON配置将实时生成并显示在这里...
      </S.JsonPreviewContent>
    );
  }

  const fullConfig = {
    config_category: config.config_category,
    config_type: config.config_type,
    config_key: config.config_key || 'default',
    config_value: config.config_value || {},
    is_active: config.is_active ?? true,
    is_default: config.is_default ?? false,
    description: config.description || null,
    version: config.version || 1,
  };

  return (
    <S.JsonPreviewContent>
      <pre>{formatJson(fullConfig)}</pre>
    </S.JsonPreviewContent>
  );
};
