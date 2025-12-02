import { httpApi } from '@app/api/http.api';

export interface MenuItem {
  id: number;
  key: string;
  title: string;
  url?: string;
  parent_id?: number | null;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  children?: MenuItem[];
}

/**
 * 获取菜单树
 */
export const getMenuTree = async (): Promise<MenuItem[]> => {
  const response = await httpApi.get<MenuItem[]>('menu/tree');
  return response.data;
};

/**
 * 获取所有菜单（扁平列表，用于管理）
 */
export const getAllMenus = async (skip: number = 0, limit: number = 100): Promise<{ data: MenuItem[]; count: number }> => {
  const response = await httpApi.get<{ data: MenuItem[]; count: number }>('menu/', {
    params: { skip, limit },
  });
  return response.data;
};

/**
 * 根据ID获取菜单
 */
export const getMenuById = async (id: number): Promise<MenuItem> => {
  const response = await httpApi.get<MenuItem>(`menu/${id}`);
  return response.data;
};

/**
 * 创建菜单
 */
export const createMenu = async (menu: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
  const response = await httpApi.post<MenuItem>('menu/', menu);
  return response.data;
};

/**
 * 更新菜单
 */
export const updateMenu = async (id: number, menu: Partial<MenuItem>): Promise<MenuItem> => {
  const response = await httpApi.put<MenuItem>(`menu/${id}`, menu);
  return response.data;
};

/**
 * 删除菜单
 */
export const deleteMenu = async (id: number): Promise<void> => {
  await httpApi.delete(`menu/${id}`);
};



