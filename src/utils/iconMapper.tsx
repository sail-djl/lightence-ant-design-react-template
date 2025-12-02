import React from 'react';
import {
  CompassOutlined,
  DashboardOutlined,
  FormOutlined,
  HomeOutlined,
  LayoutOutlined,
  LineChartOutlined,
  TableOutlined,
  UserOutlined,
  BlockOutlined,
} from '@ant-design/icons';
import { ReactComponent as NftIcon } from '@app/assets/icons/nft-icon.svg';

/**
 * 图标名称到 React 组件的映射
 */
const iconMap: Record<string, React.ReactNode> = {
  CompassOutlined: <CompassOutlined />,
  DashboardOutlined: <DashboardOutlined />,
  FormOutlined: <FormOutlined />,
  HomeOutlined: <HomeOutlined />,
  LayoutOutlined: <LayoutOutlined />,
  LineChartOutlined: <LineChartOutlined />,
  TableOutlined: <TableOutlined />,
  UserOutlined: <UserOutlined />,
  BlockOutlined: <BlockOutlined />,
  NftIcon: <NftIcon />,
};

/**
 * 根据图标名称获取 React 组件
 * @param iconName 图标名称（如 'LineChartOutlined'）
 * @returns React 组件或 undefined
 */
export const getIconComponent = (iconName?: string | null): React.ReactNode | undefined => {
  if (!iconName) {
    return undefined;
  }
  return iconMap[iconName] || undefined;
};

/**
 * 注册新的图标映射
 * @param name 图标名称
 * @param component React 组件
 */
export const registerIcon = (name: string, component: React.ReactNode): void => {
  iconMap[name] = component;
};



