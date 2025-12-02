import { httpApi } from '@app/api/http.api';
import { MenuItem } from './menu.api';

// ============================================
// Role (角色) 接口类型定义
// ============================================
export interface Role {
  id: string;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface RoleCreate {
  name: string;
  code: string;
  description?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface RoleUpdate {
  name?: string;
  code?: string;
  description?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface RolesResponse {
  data: Role[];
  count: number;
}

// ============================================
// Permission (权限) 接口类型定义 - 使用菜单结构
// ============================================
// 权限现在就是菜单，直接使用 MenuItem 类型
export type Permission = MenuItem;

// ============================================
// Role API
// ============================================

/**
 * 获取所有角色
 */
export const getRoles = async (skip = 0, limit = 100): Promise<RolesResponse> => {
  const response = await httpApi.get<RolesResponse>('roles/', {
    params: { skip, limit },
  });
  return response.data;
};

/**
 * 根据ID获取角色
 */
export const getRoleById = async (id: string): Promise<Role> => {
  const response = await httpApi.get<Role>(`roles/${id}`);
  return response.data;
};

/**
 * 创建角色
 */
export const createRole = async (role: RoleCreate): Promise<Role> => {
  const response = await httpApi.post<Role>('roles/', role);
  return response.data;
};

/**
 * 更新角色
 */
export const updateRole = async (id: string, role: RoleUpdate): Promise<Role> => {
  const response = await httpApi.patch<Role>(`roles/${id}`, role);
  return response.data;
};

/**
 * 删除角色
 */
export const deleteRole = async (id: string): Promise<void> => {
  await httpApi.delete(`roles/${id}`);
};

// ============================================
// Role-Permission API
// ============================================

/**
 * 获取角色的所有权限
 */
export const getRolePermissions = async (roleId: string): Promise<Permission[]> => {
  const response = await httpApi.get<Permission[]>(`roles/${roleId}/permissions`);
  return response.data;
};

/**
 * 为角色分配权限（替换所有现有权限）
 * permissionIds 改为 number[] 类型
 */
export const assignPermissionsToRole = async (roleId: string, permissionIds: number[]): Promise<void> => {
  await httpApi.post(`roles/${roleId}/permissions`, permissionIds);
};

/**
 * 为角色添加单个权限
 * permissionId 改为 number 类型
 */
export const assignPermissionToRole = async (roleId: string, permissionId: number): Promise<void> => {
  await httpApi.post(`roles/${roleId}/permissions/${permissionId}`);
};

/**
 * 从角色移除权限
 * permissionId 改为 number 类型
 */
export const removePermissionFromRole = async (roleId: string, permissionId: number): Promise<void> => {
  await httpApi.delete(`roles/${roleId}/permissions/${permissionId}`);
};
