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

/** 获取权限树（菜单树） */
export const getMenuTree = async (): Promise<MenuItem[]> => {
  const response = await httpApi.get<MenuItem[]>('permissions/tree');
  return response.data;
};

/** 获取全部权限（菜单，平铺，用于管理页） */
export const getAllMenus = async (skip = 0, limit = 100): Promise<{ data: MenuItem[]; count: number }> => {
  const response = await httpApi.get<{ data: MenuItem[]; count: number }>('permissions/', {
    params: { skip, limit },
  });
  return response.data;
};

/** 根据 ID 获取权限（菜单） */
export const getMenuById = async (id: number): Promise<MenuItem> => {
  const response = await httpApi.get<MenuItem>(`permissions/${id}`);
  return response.data;
};

/** 创建权限（菜单） */
export const createMenu = async (menu: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
  const response = await httpApi.post<MenuItem>('permissions/', menu);
  return response.data;
};

/** 更新权限（菜单） */
export const updateMenu = async (id: number, menu: Partial<MenuItem>): Promise<MenuItem> => {
  const response = await httpApi.put<MenuItem>(`permissions/${id}`, menu);
  return response.data;
};

/** 删除权限（菜单） */
export const deleteMenu = async (id: number): Promise<void> => {
  await httpApi.delete(`permissions/${id}`);
};
