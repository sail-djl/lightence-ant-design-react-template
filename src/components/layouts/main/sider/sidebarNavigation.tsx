import React from 'react';
import { getIconComponent } from '@app/utils/iconMapper';
import { MenuItem } from '@app/api/menu.api';

export interface SidebarNavigationItem {
  title: string;
  key: string;
  url?: string;
  children?: SidebarNavigationItem[];
  icon?: React.ReactNode;
}

/**
 * 将后端菜单数据转换为前端菜单格式
 */
export const convertMenuToSidebarNavigation = (menus: MenuItem[]): SidebarNavigationItem[] => {
  return menus.map((menu) => ({
    title: menu.title,
    key: menu.key,
    url: menu.url || undefined,
    icon: getIconComponent(menu.icon),
    children: menu.children ? convertMenuToSidebarNavigation(menu.children) : undefined,
  }));
};

// 默认空数组，实际数据从后端获取
export const sidebarNavigation: SidebarNavigationItem[] = [];
