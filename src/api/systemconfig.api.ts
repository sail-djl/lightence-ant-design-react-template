import { httpApi } from './http.api';

export interface SystemConfig {
  id: number;
  config_category: string;
  config_type: string;
  config_key: string;
  config_value: Record<string, any>;
  is_active: boolean;
  is_default: boolean;
  description?: string;
  version: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface SystemConfigCreate {
  config_category: string;
  config_type: string;
  config_key?: string;
  config_value: Record<string, any>;
  is_active?: boolean;
  is_default?: boolean;
  description?: string;
  version?: number;
  created_by?: string;
}

export interface SystemConfigUpdate {
  config_category?: string;
  config_type?: string;
  config_key?: string;
  config_value?: Record<string, any>;
  is_active?: boolean;
  is_default?: boolean;
  description?: string;
  version?: number;
  updated_by?: string;
}

export interface SystemConfigQuery {
  skip?: number;
  limit?: number;
  config_category?: string;
  config_type?: string;
  is_active?: boolean;
  is_default?: boolean;
}

export interface SystemConfigListResponse {
  data: SystemConfig[];
  count: number;
}

export const getSystemConfigList = async (params?: SystemConfigQuery): Promise<SystemConfigListResponse> => {
  const response = await httpApi.get<SystemConfigListResponse>('system-config/', { params });
  return response.data;
};

export const getSystemConfigById = async (configId: number): Promise<SystemConfig> => {
  const response = await httpApi.get<SystemConfig>(`system-config/${configId}`);
  return response.data;
};

export const createSystemConfig = async (payload: SystemConfigCreate): Promise<SystemConfig> => {
  const response = await httpApi.post<SystemConfig>('system-config/', payload);
  return response.data;
};

export const updateSystemConfig = async (configId: number, payload: SystemConfigUpdate): Promise<SystemConfig> => {
  const response = await httpApi.patch<SystemConfig>(`system-config/${configId}`, payload);
  return response.data;
};

export const deleteSystemConfig = async (configId: number): Promise<void> => {
  await httpApi.delete(`system-config/${configId}`);
};

export const getDefaultConfig = async (configCategory: string, configType: string): Promise<SystemConfig> => {
  const response = await httpApi.get<SystemConfig>(`system-config/default/${configCategory}/${configType}`);
  return response.data;
};
