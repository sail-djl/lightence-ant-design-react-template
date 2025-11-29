import { httpApi } from '@app/api/http.api';
// 注释掉 mock，使用真实 API
// import './mocks/auth.api.mock';
import { UserModel } from '@app/domain/UserModel';

export interface AuthData {
  email: string;
  password: string;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface SecurityCodePayload {
  code: string;
}

export interface NewPasswordData {
  newPassword: string;
  token?: string; // FastAPI 需要 token 来重置密码
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserModel;
}

// FastAPI 后端接口类型
interface FastAPITokenResponse {
  access_token: string;
  token_type: string;
}

interface FastAPIUserPublic {
  id: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  full_name: string | null;
}

/**
 * 将 FastAPI 的用户模型转换为 Lightence 的 UserModel
 */
const convertToUserModel = (fastApiUser: FastAPIUserPublic): UserModel => {
  const nameParts = fastApiUser.full_name?.split(' ') || [];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return {
    id: parseInt(fastApiUser.id.replace(/-/g, '').substring(0, 10), 16) || 1,
    firstName,
    lastName,
    imgUrl: process.env.REACT_APP_ASSETS_BUCKET + '/avatars/avatar5.webp' || '',
    userName: `@${fastApiUser.email.split('@')[0]}`,
    email: {
      name: fastApiUser.email,
      verified: true,
    },
    phone: {
      number: '',
      verified: false,
    },
    sex: 'male',
    birthday: '',
    lang: 'en',
    country: '',
    city: '',
    address1: '',
    zipcode: 0,
  };
};

/**
 * 登录接口 - 适配 FastAPI 后端
 * FastAPI 使用 OAuth2PasswordRequestForm，需要 FormData 格式
 */
export const login = async (loginPayload: LoginRequest): Promise<LoginResponse> => {
  // FastAPI 后端使用 FormData 格式（OAuth2PasswordRequestForm）
  const formData = new FormData();
  formData.append('username', loginPayload.email); // FastAPI 使用 username 字段，但实际是 email
  formData.append('password', loginPayload.password);

  // 先获取 token
  const tokenResponse = await httpApi.post<FastAPITokenResponse>('login/access-token', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const token = tokenResponse.data.access_token;

  // 临时设置 token 到请求头，用于获取用户信息
  const originalToken = localStorage.getItem('accessToken');
  localStorage.setItem('accessToken', token);

  try {
    // 获取用户信息
    const userResponse = await httpApi.get<FastAPIUserPublic>('users/me');
    const user = convertToUserModel(userResponse.data);

    return {
      token,
      user,
    };
  } finally {
    // 恢复原始 token（如果有）
    if (originalToken) {
      localStorage.setItem('accessToken', originalToken);
    }
  }
};

/**
 * 注册接口 - 适配 FastAPI 后端
 */
export const signUp = async (signUpData: SignUpRequest): Promise<undefined> => {
  // FastAPI 后端注册接口
  await httpApi.post<FastAPIUserPublic>('users/signup', {
    email: signUpData.email,
    password: signUpData.password,
    full_name: `${signUpData.firstName} ${signUpData.lastName}`.trim(),
  });
  return undefined;
};

/**
 * 重置密码 - 适配 FastAPI 后端
 */
export const resetPassword = async (resetPasswordPayload: ResetPasswordRequest): Promise<undefined> => {
  // FastAPI 后端密码重置接口
  await httpApi.post<{ message: string }>(`password-recovery/${resetPasswordPayload.email}`);
  return undefined;
};

/**
 * 验证安全码 - 这个功能在 FastAPI 中可能需要自定义实现
 * 目前先保留接口，后续可以根据实际需求实现
 */
export const verifySecurityCode = async (securityCodePayload: SecurityCodePayload): Promise<undefined> => {
  // TODO: 根据 FastAPI 后端的实际实现来调整
  // 如果 FastAPI 没有这个接口，可能需要自定义实现
  await httpApi.post<undefined>('verifySecurityCode', { ...securityCodePayload });
  return undefined;
};

/**
 * 设置新密码 - 适配 FastAPI 后端
 */
export const setNewPassword = async (newPasswordData: NewPasswordData): Promise<undefined> => {
  if (!newPasswordData.token) {
    throw new Error('Token is required for password reset');
  }
  
  // FastAPI 后端重置密码接口
  await httpApi.post<{ message: string }>('reset-password/', {
    token: newPasswordData.token,
    new_password: newPasswordData.newPassword,
  });
  return undefined;
};
