# API 接口文档

## 📋 目录

- [HTTP 客户端配置](#http-客户端配置)
- [认证机制](#认证机制)
- [错误处理](#错误处理)
- [API 模块列表](#api-模块列表)
- [使用示例](#使用示例)

---

## HTTP 客户端配置

### 基础配置

**文件**: `src/api/http.api.ts`

```typescript
// Base URL 配置
const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000/api/v1';

export const httpApi = axios.create({
  baseURL,
});
```

### 请求拦截器

自动添加 Authorization Header：

```typescript
httpApi.interceptors.request.use((config) => {
  config.headers = { 
    ...config.headers, 
    Authorization: `Bearer ${readToken()}` 
  };
  return config;
});
```

### 响应拦截器

统一错误处理：

```typescript
httpApi.interceptors.response.use(
  undefined, 
  (error: AxiosError) => {
    throw new ApiError(
      error.response?.data.message || error.message, 
      error.response?.data
    );
  }
);
```

---

## 认证机制

### Token 管理

- **存储位置**: `localStorage` (key: `accessToken`)
- **格式**: `Bearer <token>`
- **自动添加**: 通过请求拦截器自动添加到所有请求

### 登录流程

1. 发送 FormData 到 `/login/access-token`
2. 获取 `access_token`
3. 存储到 `localStorage`
4. 调用 `/users/me` 获取用户信息
5. 转换用户模型格式

**文件**: `src/api/auth.api.ts`

```typescript
export const login = async (loginPayload: LoginRequest): Promise<LoginResponse> => {
  // 1. 构建 FormData（FastAPI OAuth2 要求）
  const formData = new FormData();
  formData.append('username', loginPayload.email);
  formData.append('password', loginPayload.password);

  // 2. 获取 Token
  const tokenResponse = await httpApi.post('login/access-token', formData);
  const token = tokenResponse.data.access_token;

  // 3. 获取用户信息
  localStorage.setItem('accessToken', token);
  const userResponse = await httpApi.get('users/me');
  const user = convertToUserModel(userResponse.data);

  return { token, user };
};
```

---

## 错误处理

### ApiError 类

**文件**: `src/api/ApiError.ts`

```typescript
export class ApiError<T> extends Error {
  options?: T;
  
  constructor(message: string, options?: T) {
    super(message);
    this.options = options;
  }
}
```

### 错误处理流程

1. 响应拦截器捕获错误
2. 转换为 `ApiError` 实例
3. 抛出错误，由调用方处理

---

## API 模块列表

### 1. 认证模块 (`auth.api.ts`)

| 函数 | 说明 | 端点 |
|------|------|------|
| `login()` | 用户登录 | `POST /login/access-token` |
| `signUp()` | 用户注册 | `POST /users/signup` |
| `resetPassword()` | 重置密码请求 | `POST /password-recovery/{email}` |
| `setNewPassword()` | 设置新密码 | `POST /reset-password/` |
| `verifySecurityCode()` | 验证安全码 | `POST /verifySecurityCode` |

### 2. 金融模块 (`finance.api.ts`)

| 函数 | 说明 | 端点 |
|------|------|------|
| `getFinancialIndicators()` | 获取金融指标 | `GET /api/finance/indicators` |
| `getPortfolioData()` | 获取投资组合 | `GET /api/finance/portfolio` |

**降级方案**: 如果 API 失败，返回模拟数据

### 3. K线模块 (`kline.api.ts`)

| 函数 | 说明 | 端点 |
|------|------|------|
| `getKlineData(symbol, interval)` | 获取K线数据 | `GET /api/kline/{symbol}` |

**参数**:
- `symbol`: 交易对符号（如 'AAPL', 'BTC/USDT'）
- `interval`: 时间间隔（'1m', '5m', '1h', '1d' 等）

**降级方案**: 返回模拟数据

### 4. 市场模块 (`market.api.ts`)

| 函数 | 说明 | 端点 |
|------|------|------|
| `getMarketData()` | 获取市场数据 | `GET /api/market` |

**降级方案**: 返回模拟数据

### 5. 其他模块

| 模块 | 文件 | 说明 |
|------|------|------|
| 活动 | `activity.api.ts` | 用户活动记录 |
| 日历 | `calendar.api.ts` | 日历事件 |
| 医生 | `doctors.api.ts` | 医生信息（医疗模块） |
| 收益 | `earnings.api.ts` | 收益数据 |
| 新闻 | `news.api.ts` | 新闻资讯 |
| NFT | `nftDashboard.api.ts` | NFT 仪表板 |
| 通知 | `notifications.api.ts` | 通知消息 |
| 支付卡 | `paymentCards.api.ts` | 支付卡片 |
| 支付历史 | `paymentHistory.api.ts` | 支付历史 |
| 筛查 | `screenings.api.ts` | 医疗筛查 |
| 统计 | `statistics.api.ts` | 统计数据 |
| 表格 | `table.api.ts` | 表格数据 |
| 趋势创作者 | `trendingCreators.ts` | 趋势创作者 |

---

## 使用示例

### 1. 基本 GET 请求

```typescript
import { httpApi } from '@app/api/http.api';

// 获取数据
const response = await httpApi.get('/users/me');
const user = response.data;
```

### 2. POST 请求（JSON）

```typescript
import { httpApi } from '@app/api/http.api';

// 创建数据
const response = await httpApi.post('/users/signup', {
  email: 'user@example.com',
  password: 'password123',
  full_name: 'John Doe',
});
```

### 3. POST 请求（FormData）

```typescript
import { httpApi } from '@app/api/http.api';

// 登录（OAuth2 格式）
const formData = new FormData();
formData.append('username', 'user@example.com');
formData.append('password', 'password123');

const response = await httpApi.post('login/access-token', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
```

### 4. 带参数请求

```typescript
import { httpApi } from '@app/api/http.api';

// 查询参数
const response = await httpApi.get('/api/kline/AAPL', {
  params: { interval: '1d' },
});
```

### 5. 错误处理

```typescript
import { httpApi } from '@app/api/http.api';
import { ApiError } from '@app/api/ApiError';

try {
  const response = await httpApi.get('/users/me');
  return response.data;
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API 错误:', error.message);
    console.error('错误详情:', error.options);
  }
  throw error;
}
```

### 6. 使用 API 函数

```typescript
import { login } from '@app/api/auth.api';
import { getKlineData } from '@app/api/kline.api';

// 登录
const loginResult = await login({
  email: 'admin@example.com',
  password: 'changethis',
});

// 获取K线数据
const klineData = await getKlineData('AAPL', '1d');
```

---

## 环境变量配置

### `.env` 文件

```env
# API 基础地址
REACT_APP_BASE_URL=http://localhost:8000/api/v1
```

### 默认值

如果未设置 `REACT_APP_BASE_URL`，默认使用：
```
http://localhost:8000/api/v1
```

---

## 数据模型转换

### FastAPI 用户模型 → Lightence 用户模型

**文件**: `src/api/auth.api.ts`

```typescript
const convertToUserModel = (fastApiUser: FastAPIUserPublic): UserModel => {
  const nameParts = fastApiUser.full_name?.split(' ') || [];
  
  return {
    id: parseInt(fastApiUser.id.replace(/-/g, '').substring(0, 10), 16) || 1,
    firstName: nameParts[0] || '',
    lastName: nameParts.slice(1).join(' ') || '',
    userName: `@${fastApiUser.email.split('@')[0]}`,
    email: {
      name: fastApiUser.email,
      verified: true,
    },
    // ... 其他字段
  };
};
```

---

## Mock 数据

### Mock 文件位置

- `src/api/mocks/auth.api.mock.ts` - 认证 Mock
- `src/api/mocks/http.api.mock.ts` - HTTP Mock

### 使用 Mock

在开发环境中，可以取消注释 Mock 导入：

```typescript
// import './mocks/auth.api.mock';
```

### 降级方案

部分 API 函数内置了降级方案，当 API 调用失败时自动返回模拟数据：

- `getKlineData()` - 生成模拟K线数据
- `getMarketData()` - 生成模拟市场数据
- `getFinancialIndicators()` - 返回模拟金融指标
- `getPortfolioData()` - 返回模拟投资组合

---

## 最佳实践

### 1. 统一使用 httpApi

```typescript
// ✅ 正确
import { httpApi } from '@app/api/http.api';
await httpApi.get('/users/me');

// ❌ 错误
import axios from 'axios';
await axios.get('/users/me');
```

### 2. 使用类型定义

```typescript
// ✅ 正确
interface UserResponse {
  id: string;
  email: string;
}

const response = await httpApi.get<UserResponse>('/users/me');
const user = response.data; // 类型安全
```

### 3. 错误处理

```typescript
// ✅ 正确
try {
  const data = await httpApi.get('/users/me');
  return data;
} catch (error) {
  if (error instanceof ApiError) {
    // 处理 API 错误
  }
  throw error;
}
```

### 4. 异步操作

```typescript
// ✅ 使用 async/await
const fetchData = async () => {
  const response = await httpApi.get('/data');
  return response.data;
};

// ✅ 使用 Promise
httpApi.get('/data')
  .then(response => response.data)
  .catch(error => console.error(error));
```

---

## 相关文件

| 文件 | 说明 |
|------|------|
| `src/api/http.api.ts` | HTTP 客户端配置 |
| `src/api/ApiError.ts` | 错误处理类 |
| `src/api/auth.api.ts` | 认证相关 API |
| `src/services/localStorage.service.ts` | Token 存储服务 |
| `src/store/slices/authSlice.ts` | Redux 认证状态 |

---

**最后更新**: 2025-01-29




