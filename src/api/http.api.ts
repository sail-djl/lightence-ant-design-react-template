import axios from 'axios';
import { AxiosError } from 'axios';
import { ApiError } from '@app/api/ApiError';
import { readToken } from '@app/services/localStorage.service';

// 确保 baseURL 正确设置
const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000/api/v1';

// 开发环境下打印 baseURL 以便调试
if (process.env.NODE_ENV === 'development') {
  console.log('API Base URL:', baseURL);
}

export const httpApi = axios.create({
  baseURL,
});

httpApi.interceptors.request.use((config) => {
  const token = readToken();
  if (token) {
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  }

  return config;
});

httpApi.interceptors.response.use(undefined, (error: AxiosError) => {
  throw new ApiError<ApiErrorData>(error.response?.data.message || error.message, error.response?.data);
});

export interface ApiErrorData {
  message: string;
}
