import { httpApi } from '@app/api/http.api';
import { Role } from './roles.api';

// ============================================
// User 接口类型定义
// ============================================
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_superuser: boolean;
}

export interface UserCreate {
  email: string;
  password: string;
  full_name?: string;
  is_active?: boolean;
  is_superuser?: boolean;
}

export interface UserUpdate {
  email?: string;
  password?: string;
  full_name?: string;
  is_active?: boolean;
  is_superuser?: boolean;
}

export interface UsersResponse {
  data: User[];
  count: number;
}

export interface UserWithRoles extends User {
  roles?: Role[];
}

// ============================================
// User API
// ============================================

/**
 * 获取所有用户
 */
export const getUsers = async (skip = 0, limit = 100): Promise<UsersResponse> => {
  const response = await httpApi.get<UsersResponse>('users/', {
    params: { skip, limit },
  });
  return response.data;
};

/**
 * 根据ID获取用户
 */
export const getUserById = async (id: string): Promise<User> => {
  const response = await httpApi.get<User>(`users/${id}`);
  return response.data;
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await httpApi.get<User>('users/me');
  return response.data;
};

/**
 * 创建用户
 */
export const createUser = async (user: UserCreate): Promise<User> => {
  const response = await httpApi.post<User>('users/', user);
  return response.data;
};

/**
 * 更新用户
 */
export const updateUser = async (id: string, user: UserUpdate): Promise<User> => {
  const response = await httpApi.patch<User>(`users/${id}`, user);
  return response.data;
};

/**
 * 删除用户
 */
export const deleteUser = async (id: string): Promise<void> => {
  await httpApi.delete(`users/${id}`);
};

/**
 * 更新当前用户信息
 */
export const updateCurrentUser = async (user: { full_name?: string; email?: string }): Promise<User> => {
  const response = await httpApi.patch<User>('users/me', user);
  return response.data;
};

/**
 * 更新当前用户密码
 */
export const updateCurrentUserPassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  await httpApi.patch('users/me/password', {
    current_password: currentPassword,
    new_password: newPassword,
  });
};

/**
 * 删除当前用户
 */
export const deleteCurrentUser = async (): Promise<void> => {
  await httpApi.delete('users/me');
};

// ============================================
// User-Role API
// ============================================

/**
 * 获取用户的所有角色
 */
export const getUserRoles = async (userId: string): Promise<Role[]> => {
  const response = await httpApi.get<Role[]>(`users/${userId}/roles`);
  return response.data;
};

/**
 * 为用户分配角色（替换所有现有角色）
 */
export const assignRolesToUser = async (userId: string, roleIds: string[]): Promise<void> => {
  await httpApi.post(`users/${userId}/roles`, roleIds);
};

/**
 * 为用户添加单个角色
 */
export const assignRoleToUser = async (userId: string, roleId: string): Promise<void> => {
  await httpApi.post(`users/${userId}/roles/${roleId}`);
};

/**
 * 从用户移除角色
 */
export const removeRoleFromUser = async (userId: string, roleId: string): Promise<void> => {
  await httpApi.delete(`users/${userId}/roles/${roleId}`);
};
