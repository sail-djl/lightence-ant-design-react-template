import React from 'react';
import * as Icons from '@ant-design/icons';
import { ReactComponent as NftIcon } from '@app/assets/icons/nft-icon.svg';

// 自定义图标映射（非 Ant Design Icons 的图标）
const customIconMap: Record<string, React.ReactNode> = {
  NftIcon: <NftIcon />,
};

/**
 * 根据图标名称获取 React 组件
 * 自动从 @ant-design/icons 中查找图标，无需手动注册
 * @param iconName 图标名称（如 'LineChartOutlined', 'MenuOutlined', 'SafetyOutlined'）
 * @returns React 组件或 undefined
 */
export const getIconComponent = (iconName?: string | null): React.ReactNode | undefined => {
  if (!iconName) {
    return undefined;
  }

  // 先检查自定义图标
  if (customIconMap[iconName]) {
    return customIconMap[iconName];
  }

  // 从 @ant-design/icons 中动态获取图标
  const IconComponent = (Icons as any)[iconName];
  if (IconComponent && typeof IconComponent === 'function') {
    return React.createElement(IconComponent);
  }

  return undefined;
};

/**
 * 注册新的图标映射（用于自定义图标）
 * @param name 图标名称
 * @param component React 组件
 */
export const registerIcon = (name: string, component: React.ReactNode): void => {
  customIconMap[name] = component;
};
