# Lightence 前端 + FastAPI 后端集成指南

## 概述

本指南说明如何将 Lightence Ant Design React 前端模板与 Full Stack FastAPI Template 后端进行集成。

## 项目结构

```
finance/
├── lightence-ant-design-react-template/  # 前端项目
└── full-stack-fastapi-template/         # 后端项目（仅使用后端）
    └── backend/
```

## 第一步：配置后端 CORS

### 1. 修改后端 `.env` 文件

在 `full-stack-fastapi-template/.env` 文件中，添加或修改以下配置：

```env
# 前端地址（Lightence 默认运行在 3000 端口）
FRONTEND_HOST=http://localhost:3000

# CORS 允许的源（支持多个，用逗号分隔）
BACKEND_CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 2. 后端 API 路径

FastAPI 后端的 API 路径前缀为：`/api/v1`

- 登录接口：`POST /api/v1/login/access-token`
- 用户信息：`GET /api/v1/users/me`
- 注册接口：`POST /api/v1/users/signup`
- 密码重置：`POST /api/v1/password-recovery/{email}`

## 第二步：配置前端环境变量

### 1. 创建前端 `.env` 文件

在 `lightence-ant-design-react-template/` 目录下创建 `.env` 文件：

```env
# FastAPI 后端地址
REACT_APP_BASE_URL=http://localhost:8000/api/v1

# 可选：静态资源地址（如果需要）
REACT_APP_ASSETS_BUCKET=
```

### 2. 环境变量说明

- `REACT_APP_BASE_URL`: FastAPI 后端的完整 API 基础 URL
- 确保后端服务运行在 `http://localhost:8000`

## 第三步：修改前端 API 接口

### ✅ 已完成的修改

以下文件已经修改以适配 FastAPI 后端：

1. **`src/api/auth.api.ts`** ✅ 已修改
   - 登录接口已适配 FastAPI 的 OAuth2PasswordRequestForm 格式
   - 添加了用户模型转换函数 `convertToUserModel`
   - 注册、密码重置接口已适配
   - 注释掉了 mock 文件导入

2. **`src/components/auth/NewPasswordForm/NewPasswordForm.tsx`** ✅ 已修改
   - 添加了从 URL 查询参数获取 token 的功能
   - 适配 FastAPI 的密码重置流程

### 接口差异说明

**FastAPI 后端接口格式：**
- 登录：`POST /api/v1/login/access-token`
  - 请求体：`FormData` 格式（`username`=email, `password`=password）
  - 响应：`{ "access_token": "...", "token_type": "bearer" }`
  - 然后需要调用 `GET /api/v1/users/me` 获取用户信息

**Lightence 前端期望格式：**
- 登录：`POST login`
  - 请求体：`{ email, password }`
  - 响应：`{ token: string, user: UserModel }`

**已实现的适配：**
- 登录接口会自动处理 FormData 转换
- 登录成功后自动获取用户信息并转换为 UserModel
- 密码重置流程支持从 URL 获取 token

## 第四步：启动服务

### 启动后端

```bash
cd full-stack-fastapi-template
docker compose watch
```

后端将在 `http://localhost:8000` 启动

### 启动前端

```bash
cd lightence-ant-design-react-template
yarn install
yarn start
```

前端将在 `http://localhost:3000` 启动

## 第五步：测试集成

### 1. 检查后端 API 文档

访问 `http://localhost:8000/docs` 查看 Swagger 文档

### 2. 测试登录

使用后端创建的第一个超级用户：
- 邮箱：在 `.env` 中配置的 `FIRST_SUPERUSER`
- 密码：在 `.env` 中配置的 `FIRST_SUPERUSER_PASSWORD`

### 3. 检查 CORS

打开浏览器开发者工具，检查网络请求是否成功，没有 CORS 错误。

## 常见问题

### 1. CORS 错误

**问题**：浏览器控制台显示 CORS 错误

**解决**：
- 检查后端 `.env` 中的 `BACKEND_CORS_ORIGINS` 是否包含前端地址
- 确保 `FRONTEND_HOST` 配置正确
- 重启后端服务

### 2. 401 未授权错误

**问题**：登录后请求返回 401

**解决**：
- 检查 Token 是否正确存储在 localStorage
- 检查 `http.api.ts` 中的 Authorization header 格式
- 确保 Token 格式为 `Bearer {token}`

### 3. 接口路径不匹配

**问题**：404 错误或接口找不到

**解决**：
- 检查 `REACT_APP_BASE_URL` 是否正确
- 确保包含 `/api/v1` 路径前缀
- 检查后端路由配置

### 4. 用户模型不匹配

**问题**：登录后用户信息显示异常

**解决**：
- 需要在前端添加适配器，将 FastAPI 的用户模型转换为 Lightence 的 UserModel
- 参考 `src/api/auth.api.ts` 中的修改

## 已完成的适配工作

### ✅ 用户模型适配
- 已实现 `convertToUserModel` 函数，将 FastAPI 的 `UserPublic` 转换为 `UserModel`
- 自动处理用户姓名的拆分（full_name -> firstName + lastName）
- 自动生成用户名（基于邮箱）

### ✅ 认证流程适配
- 登录接口已完全适配 FastAPI 的 OAuth2 格式
- 自动获取用户信息并存储
- Token 自动存储到 localStorage

### ✅ 密码重置流程
- 支持从 URL 查询参数获取 token
- 适配 FastAPI 的密码重置接口格式

## 下一步

1. **测试完整流程**：测试登录、注册、密码重置等完整流程
2. **实现其他 API**：根据业务需求，逐步实现其他 API 接口（如 Items 管理）
3. **错误处理优化**：统一处理 API 错误响应，提供更好的用户体验
4. **Token 刷新**：如果需要，可以实现 Token 自动刷新机制
5. **用户信息更新**：实现用户信息编辑功能，适配 FastAPI 的更新接口

## 参考文档

- [FastAPI 文档](https://fastapi.tiangolo.com)
- [Lightence 文档](https://github.com/altence/lightence-ant-design-react-template)
- [Axios 文档](https://axios-http.com)

