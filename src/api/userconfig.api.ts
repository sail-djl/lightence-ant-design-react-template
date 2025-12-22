import { httpApi } from './http.api';

export interface UserConfig {
  id: number;
  user_id?: string;
  module?: string;
  config_type: string;
  config_key: string;
  config_value: Record<string, any>;
  is_active: boolean;
  is_default: boolean;
  description?: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface UserConfigCreate {
  module?: string;
  config_type: string;
  config_key?: string;
  config_value: Record<string, any>;
  is_active?: boolean;
  is_default?: boolean;
  description?: string;
  version?: number;
}

export interface UserConfigUpdate {
  module?: string;
  config_type?: string;
  config_key?: string;
  config_value?: Record<string, any>;
  is_active?: boolean;
  is_default?: boolean;
  description?: string;
  version?: number;
}

export interface UserConfigQuery {
  skip?: number;
  limit?: number;
  user_id?: string;
  module?: string;
  config_type?: string;
  is_active?: boolean;
}

export interface UserConfigListResponse {
  data: UserConfig[];
  count: number;
}

export const getUserConfigList = async (params?: UserConfigQuery): Promise<UserConfigListResponse> => {
  const response = await httpApi.get<UserConfigListResponse>('user-config/', { params });
  return response.data;
};

export const getUserConfigById = async (configId: number): Promise<UserConfig> => {
  const response = await httpApi.get<UserConfig>(`user-config/${configId}`);
  return response.data;
};

export const createUserConfig = async (payload: UserConfigCreate): Promise<UserConfig> => {
  const response = await httpApi.post<UserConfig>('user-config/', payload);
  return response.data;
};

export const updateUserConfig = async (configId: number, payload: UserConfigUpdate): Promise<UserConfig> => {
  const response = await httpApi.patch<UserConfig>(`user-config/${configId}`, payload);
  return response.data;
};

export const deleteUserConfig = async (configId: number): Promise<void> => {
  await httpApi.delete(`user-config/${configId}`);
};

export const getDefaultConfig = async (configType: string): Promise<UserConfig> => {
  const response = await httpApi.get<UserConfig>(`user-config/default/${configType}`);
  return response.data;
};

