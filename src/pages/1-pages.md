# Pages 页面梳理

## 📋 目录结构

```
pages/
├── 1-pages.md                    # 本文件 - 页面梳理文档
├── DashboardPages/               # 仪表板页面
├── index/                        # 首页仪表板
├── market/                       # 市场相关页面
├── trading/                      # 交易相关页面
├── system/                       # 系统管理页面
├── uiComponentsPages/            # UI组件展示页面
├── maps/                         # 地图页面
└── [其他独立页面]
```

---

## 🔐 认证相关页面

### 登录注册
- **LoginPage.tsx** - 登录页面
- **SignUpPage.tsx** - 注册页面
- **ForgotPasswordPage.tsx** - 忘记密码页面
- **NewPasswordPage.tsx** - 新密码设置页面
- **SecurityCodePage.tsx** - 安全验证码页面

### 安全设置
- **SecuritySettingsPage.tsx** - 安全设置页面
- **LockPage.tsx** - 锁定页面

---

## 📊 仪表板页面 (DashboardPages/)

### 金融仪表板
- **FinanceDashboardPage.tsx** - 金融仪表板
  - 包含：K线图、市场概览、股票列表、财务指标

### 其他仪表板
- **MedicalDashboardPage.tsx** - 医疗仪表板
- **NftDashboardPage.tsx** - NFT仪表板
- **DashboardPage.styles.ts** - 仪表板样式文件

### 首页仪表板 (index/)
- **IndexDashboardPage.tsx** - 首页仪表板
- **IndexDashboardPage.styles.ts** - 首页仪表板样式

---

## 📈 市场页面 (market/)

- **StockMarketPage.tsx** - 股票市场页面
  - 包含：市场概览、股票列表
- **CryptoMarketPage.tsx** - 加密货币市场页面
- **ForexMarketPage.tsx** - 外汇市场页面

---

## 💹 交易页面 (trading/)

- **KlinePage.tsx** - K线图页面
  - 显示K线图表，支持不同时间周期
- **PortfolioPage.tsx** - 投资组合页面

---

## ⚙️ 系统管理页面 (system/)

- **UserManagementPage.tsx** - 用户管理页面
  - 功能：用户列表、创建、编辑、删除、角色分配
  - 样式：UserManagementPage.styles.ts
- **RoleManagementPage.tsx** - 角色管理页面
  - 样式：RoleManagementPage.styles.ts
- **MenuManagementPage.tsx** - 菜单管理页面
  - 样式：MenuManagementPage.styles.ts

---

## 📝 数据表格和表单页面

- **DataTablesPage.tsx** - 数据表格页面
- **AdvancedFormsPage.tsx** - 高级表单页面

---

## 📊 图表和可视化

- **ChartsPage.tsx** - 图表页面

---

## 🗺️ 地图页面 (maps/)

- **GoogleMapsPage/GoogleMapsPage.tsx** - Google地图页面
- **LeafletMapsPage/LeafletMapsPage.tsx** - Leaflet地图页面
- **PigeonsMapsPage/PigeonsMapsPage.tsx** - Pigeons地图页面
- **ReactSimpleMapsPage/ReactSimpleMapsPage.tsx** - React Simple Maps页面
- **maps.styles.ts** - 地图样式文件

---

## 🎨 UI组件展示页面 (uiComponentsPages/)

### 按钮和导航
- **ButtonsPage.tsx** - 按钮组件展示
- **DropdownsPage.tsx** - 下拉菜单组件展示
- **SpinnersPage.tsx** - 加载动画组件展示

### 数据展示 (dataDisplay/)
- **AvatarsPage.tsx** - 头像组件展示
- **BadgesPage.tsx** - 徽章组件展示
- **CollapsePage.tsx** - 折叠面板组件展示
- **PaginationPage.tsx** - 分页组件展示

### 反馈组件 (feedback/)
- **AlertsPage.tsx** - 警告提示组件展示
- **NotificationsPage.tsx** - 通知组件展示
- **ProgressPage.tsx** - 进度条组件展示
- **ResultsPage.tsx** - 结果页组件展示
- **SkeletonsPage.tsx** - 骨架屏组件展示

### 表单组件 (forms/)
- **AutoCompletesPage.tsx** - 自动完成组件展示
- **CheckboxesPage.tsx** - 复选框组件展示
- **DateTimePickersPage.tsx** - 日期时间选择器组件展示
- **InputsPage.tsx** - 输入框组件展示
- **RadiosPage.tsx** - 单选框组件展示
- **RatesPage.tsx** - 评分组件展示
- **SelectsPage.tsx** - 选择器组件展示
- **StepsPage.tsx** - 步骤条组件展示
- **SwitchesPage.tsx** - 开关组件展示
- **UploadsPage.tsx** - 上传组件展示

### 模态框和弹出层 (modals/)
- **ModalsPage.tsx** - 模态框组件展示
- **PopconfirmsPage.tsx** - 确认弹出框组件展示
- **PopoversPage.tsx** - 弹出层组件展示

### 导航组件 (navigation/)
- **BreadcrumbsPage.tsx** - 面包屑组件展示
- **TabsPage.tsx** - 标签页组件展示

### 样式文件
- **UIComponentsPage.styles.ts** - UI组件页面样式

---

## 📰 其他功能页面

- **NewsFeedPage.tsx** - 新闻动态页面
- **NotificationsPage.tsx** - 通知页面
- **PaymentsPage.tsx** - 支付页面
- **PersonalInfoPage.tsx** - 个人信息页面

---

## ❌ 错误页面

- **Error404Page.tsx** - 404错误页面
- **ServerErrorPage.tsx** - 服务器错误页面

---

## 📌 页面分类统计

| 分类 | 数量 | 说明 |
|------|------|------|
| 认证相关 | 7 | 登录、注册、密码、安全设置等 |
| 仪表板 | 5 | 金融、医疗、NFT等不同主题的仪表板 |
| 市场 | 3 | 股票、加密货币、外汇市场 |
| 交易 | 2 | K线图、投资组合 |
| 系统管理 | 3 | 用户、角色、菜单管理 |
| UI组件展示 | 25+ | 各种UI组件的展示页面 |
| 地图 | 4 | 不同地图库的集成 |
| 其他功能 | 4 | 新闻、通知、支付、个人信息 |
| 错误页面 | 2 | 404、500错误页面 |

---

## 🔍 页面路由说明

> 注意：实际路由配置需要查看路由配置文件（通常是 `routes.tsx` 或 `AppRouter.tsx`）

主要页面路径推测：
- `/login` - 登录页
- `/sign-up` - 注册页
- `/dashboard` - 仪表板
- `/finance-dashboard` - 金融仪表板
- `/market/stock` - 股票市场
- `/market/crypto` - 加密货币市场
- `/market/forex` - 外汇市场
- `/trading/kline` - K线图
- `/trading/portfolio` - 投资组合
- `/system/users` - 用户管理
- `/system/roles` - 角色管理
- `/system/menus` - 菜单管理
- `/ui-components/*` - UI组件展示
- `/maps/*` - 地图页面

---

## 📝 备注

- 所有页面都使用 React + TypeScript 开发
- 页面通常包含 `PageTitle` 组件用于显示标题
- 使用 `@app/components` 下的公共组件
- 样式文件通常使用 `.styles.ts` 命名
- 支持响应式布局（使用 `useResponsive` hook）

---

*最后更新：根据当前 pages 目录结构整理*

