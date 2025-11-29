# 金融项目改造文档

## 项目概述

本项目基于 Lightence React 管理模板改造为金融数据展示和交易系统，支持查看股票、加密货币、外汇等金融数据，并提供 K 线图、投资组合等核心功能。

## 改造内容

### 一、API 接口层

#### 1. K线数据接口 (`src/api/kline.api.ts`)

**功能**：获取 K 线图数据

**接口定义**：
```typescript
interface KlineData {
  time: string;      // 时间
  open: number;       // 开盘价
  high: number;       // 最高价
  low: number;        // 最低价
  close: number;      // 收盘价
  volume: number;     // 成交量
}
```

**主要方法**：
- `getKlineData(symbol: string, interval: string)`: 获取指定交易对的 K 线数据
  - `symbol`: 交易对代码（如 'AAPL', 'BTC/USDT'）
  - `interval`: 时间周期（'1m', '5m', '15m', '1h', '4h', '1d', '1w'）

**说明**：
- 当前使用模拟数据，需要连接真实数据源时替换 `httpApi.get()` 调用
- 模拟数据生成 30 天的历史数据

#### 2. 市场数据接口 (`src/api/market.api.ts`)

**功能**：获取市场行情数据

**接口定义**：
```typescript
interface MarketData {
  symbol: string;           // 交易对代码
  name: string;             // 名称
  price: number;            // 当前价格
  change: number;           // 涨跌额
  changePercent: number;    // 涨跌幅
  volume: number;           // 成交量
  marketCap?: number;       // 市值（可选）
}
```

**主要方法**：
- `getMarketData()`: 获取市场数据列表

**说明**：
- 支持股票、加密货币等多种资产类型
- 当前返回模拟数据，包含常见股票和加密货币

#### 3. 金融数据接口 (`src/api/finance.api.ts`)

**功能**：获取金融指标和投资组合数据

**接口定义**：
```typescript
// 金融指标
interface FinancialIndicator {
  name: string;        // 指标名称
  value: number;       // 当前值
  unit: string;        // 单位
  change?: number;     // 变化值
  trend?: 'up' | 'down' | 'stable';  // 趋势
}

// 投资组合
interface PortfolioData {
  totalValue: number;           // 总资产
  totalProfit: number;          // 总盈亏
  totalProfitPercent: number;   // 总盈亏率
  positions: Array<{            // 持仓列表
    symbol: string;
    name: string;
    quantity: number;
    avgPrice: number;
    currentPrice: number;
    profit: number;
    profitPercent: number;
  }>;
}
```

**主要方法**：
- `getFinancialIndicators()`: 获取金融指标（上证指数、深证成指、创业板指等）
- `getPortfolioData()`: 获取投资组合数据

### 二、金融组件

#### 1. K线图组件 (`src/components/finance-dashboard/kline-chart/`)

**组件路径**：`KlineChart.tsx`

**功能特性**：
- 基于 ECharts candlestick 类型实现
- 支持切换交易对（AAPL, MSFT, GOOGL, TSLA, BTC/USDT, ETH/USDT）
- 支持切换时间周期（1分钟、5分钟、15分钟、1小时、4小时、1天、1周）
- 显示成交量柱状图
- 支持数据缩放和拖拽
- 响应式设计，适配移动端

**Props**：
```typescript
interface KlineChartProps {
  symbol?: string;      // 交易对代码，默认 'AAPL'
  interval?: string;    // 时间周期，默认 '1d'
  height?: string | number;  // 图表高度，默认 '600px'
}
```

**使用示例**：
```tsx
<KlineChart symbol="AAPL" interval="1d" height="500px" />
```

#### 2. 市场概览组件 (`src/components/finance-dashboard/market-overview/`)

**组件路径**：`MarketOverview.tsx`

**功能特性**：
- 显示主要市场数据（默认显示前 6 个）
- 实时显示价格、涨跌额、涨跌幅
- 颜色标识涨跌（绿色上涨，红色下跌）
- 卡片式布局

#### 3. 股票列表组件 (`src/components/finance-dashboard/stock-list/`)

**组件路径**：`StockList.tsx`

**功能特性**：
- 表格形式展示所有市场数据
- 支持按价格、涨跌、涨跌幅、成交量、市值排序
- 涨跌用颜色和图标标识
- 分页显示（每页 10 条）

**表格列**：
- 代码
- 名称
- 价格
- 涨跌
- 涨跌幅
- 成交量
- 市值

#### 4. 金融指标组件 (`src/components/finance-dashboard/financial-indicators/`)

**组件路径**：`FinancialIndicators.tsx`

**功能特性**：
- 网格布局展示多个金融指标
- 显示指标名称、当前值、单位
- 显示变化值和趋势图标
- 响应式布局（移动端单列，桌面端多列）

**显示指标**：
- 上证指数
- 深证成指
- 创业板指
- 沪深300
- 美元指数
- 黄金价格

#### 5. 投资组合组件 (`src/components/finance-dashboard/portfolio/`)

**组件路径**：`Portfolio.tsx`

**功能特性**：
- 显示总资产、总盈亏、总盈亏率统计卡片
- 表格展示持仓明细
- 显示每只股票的盈亏情况
- 颜色标识盈亏（绿色盈利，红色亏损）

**显示内容**：
- 总资产统计
- 总盈亏统计
- 总盈亏率统计
- 持仓明细表格（代码、名称、数量、平均成本、当前价格、盈亏、盈亏率）

### 三、页面组件

#### 1. 金融仪表盘 (`src/pages/DashboardPages/FinanceDashboardPage.tsx`)

**路由**：`/`（首页）

**布局**：
- 桌面端：K线图（左侧 16 列）+ 市场概览（右侧 8 列），下方金融指标和股票列表
- 移动端：垂直堆叠布局

**包含组件**：
- K线图
- 市场概览
- 金融指标
- 股票列表

#### 2. K线图页面 (`src/pages/trading/KlinePage.tsx`)

**路由**：`/trading/kline`

**功能**：全屏显示 K 线图，高度 700px

#### 3. 投资组合页面 (`src/pages/trading/PortfolioPage.tsx`)

**路由**：`/trading/portfolio`

**功能**：显示完整的投资组合信息

#### 4. 股票市场页面 (`src/pages/market/StockMarketPage.tsx`)

**路由**：`/market/stock`

**布局**：市场概览（左侧）+ 股票列表（右侧）

#### 5. 加密货币市场页面 (`src/pages/market/CryptoMarketPage.tsx`)

**路由**：`/market/crypto`

**布局**：K线图（BTC/USDT）+ 股票列表

#### 6. 外汇市场页面 (`src/pages/market/ForexMarketPage.tsx`)

**路由**：`/market/forex`

**布局**：金融指标 + 股票列表

### 四、菜单配置

**文件路径**：`src/components/layouts/main/sider/sidebarNavigation.tsx`

**当前菜单结构**：
```
├── 金融仪表盘 (/)
├── 市场
│   ├── 股票市场 (/market/stock)
│   ├── 加密货币市场 (/market/crypto)
│   └── 外汇市场 (/market/forex)
└── 交易
    ├── K线图 (/trading/kline)
    └── 投资组合 (/trading/portfolio)
```

**已注释的菜单**（不相关功能）：
- 医疗仪表盘
- 应用（Feed）
- 认证页面（登录等功能仍可通过路由访问）
- 表单
- 数据表格
- 图表
- 地图
- 页面（个人资料等）
- UI组件展示

### 五、路由配置

**文件路径**：`src/components/router/AppRouter.tsx`

**新增路由**：
```typescript
// 市场相关
<Route path="market">
  <Route path="stock" element={<StockMarket />} />
  <Route path="crypto" element={<CryptoMarket />} />
  <Route path="forex" element={<ForexMarket />} />
</Route>

// 交易相关
<Route path="trading">
  <Route path="kline" element={<Kline />} />
  <Route path="portfolio" element={<Portfolio />} />
</Route>
```

**首页路由**：已从 NFT Dashboard 改为 Finance Dashboard

### 六、国际化配置

**文件路径**：
- `src/locales/zh/translation.json`（中文）
- `src/locales/en/translation.json`（英文）

**新增翻译键**：
```json
{
  "common": {
    "finance-dashboard": "金融仪表盘",
    "market": "市场",
    "stock-market": "股票市场",
    "crypto-market": "加密货币市场",
    "forex-market": "外汇市场",
    "trading": "交易",
    "kline": "K线图",
    "portfolio": "投资组合"
  }
}
```

## 项目结构

```
src/
├── api/
│   ├── kline.api.ts          # K线数据接口
│   ├── market.api.ts         # 市场数据接口
│   └── finance.api.ts        # 金融数据接口
├── components/
│   └── finance-dashboard/    # 金融仪表盘组件
│       ├── kline-chart/       # K线图组件
│       ├── market-overview/   # 市场概览组件
│       ├── stock-list/        # 股票列表组件
│       ├── financial-indicators/  # 金融指标组件
│       └── portfolio/         # 投资组合组件
├── pages/
│   ├── DashboardPages/
│   │   └── FinanceDashboardPage.tsx  # 金融仪表盘主页
│   ├── trading/
│   │   ├── KlinePage.tsx      # K线图页面
│   │   └── PortfolioPage.tsx  # 投资组合页面
│   └── market/
│       ├── StockMarketPage.tsx    # 股票市场页面
│       ├── CryptoMarketPage.tsx   # 加密货币市场页面
│       └── ForexMarketPage.tsx    # 外汇市场页面
└── locales/
    ├── zh/translation.json    # 中文翻译（已添加金融相关）
    └── en/translation.json    # 英文翻译（已添加金融相关）
```

## 技术实现

### 图表库
- **ECharts 5.1.2**：用于 K 线图绘制
- **echarts-for-react 3.0.1**：React ECharts 封装

### 数据获取
- 当前使用模拟数据（Mock Data）
- API 接口已预留真实数据源接入点
- 支持错误处理和降级方案

### 样式方案
- **styled-components**：组件样式
- **CSS 变量**：主题颜色（`var(--text-main-color)`, `var(--border-color)` 等）
- **响应式设计**：使用 Ant Design Grid 系统

## 使用说明

### 启动项目

```bash
# 安装依赖
yarn install

# 启动开发服务器
yarn start

# 构建生产版本
yarn build
```

### 访问页面

- **首页（金融仪表盘）**：`http://localhost:3000/`
- **股票市场**：`http://localhost:3000/market/stock`
- **加密货币市场**：`http://localhost:3000/market/crypto`
- **外汇市场**：`http://localhost:3000/market/forex`
- **K线图**：`http://localhost:3000/trading/kline`
- **投资组合**：`http://localhost:3000/trading/portfolio`

## 后续开发建议

### 1. 连接真实数据源

**替换模拟数据**：
- 修改 `kline.api.ts`、`market.api.ts`、`finance.api.ts` 中的 API 调用
- 推荐数据源：
  - **股票数据**：Alpha Vantage、Yahoo Finance API、聚宽、Tushare
  - **加密货币**：CoinGecko API、Binance API、Coinbase API
  - **外汇数据**：ExchangeRate API、Fixer.io

**示例**：
```typescript
// 替换 getKlineData 中的模拟数据
export const getKlineData = async (symbol: string, interval: string) => {
  const response = await httpApi.get(`/api/v1/kline`, {
    params: { symbol, interval },
  });
  return response.data;
};
```

### 2. WebSocket 实时数据

**实现实时行情推送**：
- 安装 `socket.io-client`
- 在组件中建立 WebSocket 连接
- 实时更新价格和 K 线数据

**示例**：
```typescript
import io from 'socket.io-client';

useEffect(() => {
  const socket = io('ws://your-api-server');
  socket.on('market-update', (data) => {
    setMarketData(data);
  });
  return () => socket.close();
}, []);
```

### 3. 技术指标

**添加技术分析指标**：
- MA（移动平均线）
- MACD（指数平滑移动平均线）
- RSI（相对强弱指标）
- BOLL（布林带）
- KDJ（随机指标）

**实现方式**：
- 使用 ECharts 的 `markLine`、`markArea` 等功能
- 或使用第三方库如 `technicalindicators`

### 4. 交易功能

**添加交易操作**：
- 买入/卖出界面
- 订单管理
- 持仓管理
- 交易历史

### 5. 数据缓存和状态管理

**使用 Redux 管理金融数据**：
- 创建 `financeSlice` 管理市场数据
- 实现数据缓存和自动刷新
- 优化性能，减少重复请求

### 6. 性能优化

**建议优化点**：
- 虚拟滚动（股票列表数据量大时）
- 图表数据采样（减少渲染数据点）
- 防抖和节流（搜索、筛选操作）
- 懒加载（路由级别的代码分割）

### 7. 移动端优化

**移动端体验优化**：
- 触摸手势支持（K线图缩放、拖拽）
- 响应式布局优化
- 移动端专用交互设计

## 注意事项

1. **数据源限制**：当前使用模拟数据，生产环境需要连接真实数据源
2. **API 认证**：真实数据源通常需要 API Key，注意安全存储
3. **数据更新频率**：根据数据源限制合理设置刷新频率
4. **错误处理**：已实现基础错误处理，建议根据实际需求完善
5. **性能考虑**：大量数据时注意性能优化，避免页面卡顿

## 常见问题

### Q: 如何切换不同的交易对？
A: 在 K线图组件中，使用顶部的下拉选择框选择不同的交易对。

### Q: 如何修改时间周期？
A: 在 K线图组件中，使用时间周期选择器（1分钟、5分钟、1小时、1天等）。

### Q: 数据是实时的吗？
A: 当前使用模拟数据，不是实时的。需要连接真实数据源并实现 WebSocket 才能获得实时数据。

### Q: 如何添加新的交易对？
A: 在 `KlineChart.tsx` 组件的 `SymbolSelect` 中添加新的 `Option`，并在 API 中支持该交易对。

### Q: 如何自定义样式？
A: 修改对应的 `.styles.ts` 文件，使用 styled-components 语法，或修改 CSS 变量。

## 更新日志

### 2024-01-XX - 初始版本
- ✅ 创建金融仪表盘基础结构
- ✅ 实现 K 线图组件（基于 ECharts）
- ✅ 实现市场概览、股票列表、金融指标、投资组合组件
- ✅ 创建所有金融相关页面
- ✅ 更新菜单和路由配置
- ✅ 添加国际化支持
- ✅ 注释不相关的菜单项

---

**文档维护**：请根据项目实际开发情况及时更新本文档。


