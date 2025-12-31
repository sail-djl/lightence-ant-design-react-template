# 数据市场模块编码规范

## 目录结构规范

### 标准目录结构

每个数据子模块（如 bond、forex、futures、index、macro、option、spot、stock、us_stock）必须遵循以下目录结构：

```
{module}/
├── hooks/
│   ├── use{Module}Data.ts      # 数据查询 Hook
│   └── use{Module}Sync.ts       # 数据同步 Hook
├── tabs/
│   └── {TabName}Tab.tsx         # Tab 页面组件
├── utils.ts                     # 工具函数
└── {Module}ListPage.tsx         # 列表页面（位于 datamarket 根目录）
```

### 命名规范

- **Hook 文件**：`use{Module}Data.ts`、`use{Module}Sync.ts`
- **Tab 组件**：`{TabName}Tab.tsx`（PascalCase）
- **ListPage 组件**：`{Module}ListPage.tsx`（PascalCase）

## ListPage 组件规范

### 标准结构

所有 ListPage 组件必须遵循以下结构：

```typescript
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseTabs } from '@app/components/common/BaseTabs/BaseTabs';
import { XxxTab } from './{module}/tabs/XxxTab';

const StyledTabs = styled(BaseTabs)`
  .ant-tabs-nav {
    margin-bottom: 16px;
    
    &::before {
      display: none;
    }
  }

  .ant-tabs-nav-wrap {
    overflow: visible !important;
  }

  .ant-tabs-nav-list {
    flex-wrap: wrap !important;
    overflow: visible !important;
    width: 100%;
  }

  .ant-tabs-tab {
    margin: 0 4px 8px 0 !important;
    flex-shrink: 0;
  }

  .ant-tabs-content-holder {
    padding-top: 0;
  }
`;

const {Module}ListPage: React.FC = () => {
  const tabItems = useMemo(
    () => [
      {
        key: 'xxx',
        label: '标签名称',
        children: <XxxTab />,
      },
      // ... 更多 tabs
    ],
    []
  );

  return (
    <>
      <PageTitle>数据市场 · {模块名称}数据</PageTitle>
      <StyledTabs defaultActiveKey="xxx" items={tabItems} type="card" />
    </>
  );
};

export default {Module}ListPage;
```

### 规范要点

1. **样式组件**：必须使用 `StyledTabs` 样式组件，样式规则统一
2. **Tab 配置**：使用 `useMemo` 定义 `tabItems`，避免重复渲染
3. **默认激活**：`defaultActiveKey` 设置为第一个 tab 的 key
4. **页面标题**：格式为 `数据市场 · {模块名称}数据`

## useXxxData Hook 规范

### 标准接口定义

```typescript
interface Use{Module}DataOptions<T, Q> {
  fetchFn: (params: Q & { skip?: number; limit?: number }) => Promise<{ data: T[]; count?: number }>;
  initialQuery: Q;
  autoFetch?: boolean;
  enablePagination?: boolean;
}
```

### 标准实现结构

```typescript
export const use{Module}Data = <T, Q extends Record<string, any>>({
  fetchFn,
  initialQuery,
  autoFetch = true,
  enablePagination = true,
}: Use{Module}DataOptions<T, Q>) => {
  const [query, setQuery] = useState(initialQuery);
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(
    async (page = 1, pageSize = initialPagination.pageSize, overrideQuery?: Q) => {
      setLoading(true);
      try {
        const params: any = { ...(overrideQuery || query) };
        if (enablePagination) {
          params.skip = (page - 1) * pageSize;
          params.limit = pageSize;
        }
        const res = await fetchFn(params);
        setRows(res.data);
        if (res.count !== undefined) {
          setTotal(res.count);
        }
        if (enablePagination) {
          setPagination({ current: page, pageSize });
        }
      } finally {
        setLoading(false);
      }
    },
    [query, fetchFn, enablePagination]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
    // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

  return {
    query,
    setQuery,
    rows,
    loading,
    pagination,
    total,
    fetchData,
  };
};
```

### 规范要点

1. **泛型参数**：`T` 为数据项类型，`Q` 为查询参数类型
2. **状态管理**：统一使用 `query`、`rows`、`loading`、`pagination`、`total`
3. **分页处理**：通过 `enablePagination` 控制是否启用分页
4. **自动获取**：通过 `autoFetch` 控制是否自动获取数据
5. **返回值**：必须返回 `query`、`setQuery`、`rows`、`loading`、`pagination`、`total`、`fetchData`

## useXxxSync Hook 规范

### 标准实现结构（类型1：固定同步函数）

```typescript
import { useState } from 'react';
import { notificationController } from '@app/controllers/notificationController';
import { {Module}SyncPayload, sync{Module}Data } from '@app/api/datamarket/{module}.api';

interface Use{Module}SyncOptions {
  onSuccess?: () => void;
}

export const use{Module}Sync = ({ onSuccess }: Use{Module}SyncOptions = {}) => {
  const [syncOpen, setSyncOpen] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncType, setSyncType] = useState<string>('');
  const [syncPayload, setSyncPayload] = useState<{Module}SyncPayload>({});

  const handleSync = async () => {
    if (!syncType) {
      notificationController.warning({ message: '请选择同步类型' });
      return;
    }

    setSyncLoading(true);
    try {
      const result = await sync{Module}Data(syncType, syncPayload);
      notificationController.success({
        message: `同步完成：成功 ${result.success} 条，失败 ${result.failed} 条`,
      });
      setSyncOpen(false);
      onSuccess?.();
    } catch (e: any) {
      notificationController.error({ message: e?.message || '同步失败' });
    } finally {
      setSyncLoading(false);
    }
  };

  const openSync = (type: string, payload?: {Module}SyncPayload) => {
    setSyncType(type);
    setSyncPayload(payload || {});
    setSyncOpen(true);
  };

  return {
    syncOpen,
    setSyncOpen,
    syncLoading,
    syncType,
    syncPayload,
    setSyncPayload,
    handleSync,
    openSync,
  };
};
```

### 标准实现结构（类型2：通用同步函数）

```typescript
interface Use{Module}SyncOptions<P> {
  syncFn: (payload: P) => Promise<{ success: number; failed: number }>;
  onSuccess?: () => void;
}

export const use{Module}Sync = <P extends Record<string, any>>({
  syncFn,
  onSuccess,
}: Use{Module}SyncOptions<P>) => {
  const [syncOpen, setSyncOpen] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncPayload, setSyncPayload] = useState<Partial<P>>({});

  const handleSync = async (validateFn?: () => boolean) => {
    if (validateFn && !validateFn()) {
      return;
    }
    setSyncLoading(true);
    try {
      const result = await syncFn(syncPayload as P);
      notificationController.success({
        message: `同步完成：成功 ${result.success} 条，失败 ${result.failed} 条`,
      });
      setSyncOpen(false);
      onSuccess?.();
    } catch (e: any) {
      notificationController.error({ message: e?.message || '同步失败' });
    } finally {
      setSyncLoading(false);
    }
  };

  return {
    syncOpen,
    setSyncOpen,
    syncLoading,
    syncPayload,
    setSyncPayload,
    handleSync,
  };
};
```

### 规范要点

1. **状态管理**：统一使用 `syncOpen`、`syncLoading`、`syncPayload`
2. **错误处理**：使用 `notificationController` 统一处理成功/失败提示
3. **成功回调**：通过 `onSuccess` 支持同步成功后的回调
4. **消息格式**：成功消息格式为 `同步完成：成功 {success} 条，失败 {failed} 条`

## Tab 组件规范

### 标准结构

```typescript
import React from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import { Dates } from '@app/constants/Dates';
import { ColumnsType } from 'antd/es/table';
import { DataType, getDataList, DataQuery } from '@app/api/datamarket/{module}.api';
import { use{Module}Data } from '../hooks/use{Module}Data';
import { use{Module}Sync } from '../hooks/use{Module}Sync';
import { formatNumber, formatNumberLocale, formatDate, getDateRanges, EXCHANGE_OPTIONS } from '../utils';
import dayjs from 'dayjs';

export const {TabName}Tab: React.FC = () => {
  // 1. 使用 use{Module}Data Hook
  const { query, setQuery, rows, loading, pagination, total, fetchData } = use{Module}Data<DataType, DataQuery>({
    fetchFn: async (params) => {
      const res = await getDataList({
        skip: params.skip,
        limit: params.limit,
        // ... 其他查询参数
      });
      return res;
    },
    initialQuery: { /* 初始查询参数 */ },
  });

  // 2. 使用 use{Module}Sync Hook
  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync, openSync } = use{Module}Sync({
    onSuccess: () => fetchData(pagination.current, pagination.pageSize),
  });

  // 3. 定义表格列
  const columns: ColumnsType<DataType> = [
    // ... 列定义
  ];

  return (
    <>
      {/* 4. 查询表单区域 */}
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {/* 查询输入框 */}
        <BaseButton onClick={() => fetchData(1, pagination.pageSize)}>查询</BaseButton>
        <BaseButton onClick={() => { /* 重置逻辑 */ }}>重置</BaseButton>
      </BaseSpace>

      {/* 5. 同步按钮区域 */}
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem' }}>
        <BaseButton type="primary" onClick={() => openSync('sync_type', { /* payload */ })}>
          同步数据
        </BaseButton>
      </BaseSpace>

      {/* 6. 同步模态框 */}
      <BaseModal
        title="数据同步"
        open={syncOpen}
        onCancel={() => setSyncOpen(false)}
        confirmLoading={syncLoading}
        onOk={handleSync}
      >
        <BaseForm layout="vertical">
          {/* 同步表单字段 */}
        </BaseForm>
      </BaseModal>

      {/* 7. 数据表格 */}
      <BaseTable
        columns={columns}
        dataSource={rows}
        rowKey="key"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: total,
          showSizeChanger: true,
          showTotal: (v) => `共 ${v} 条`,
        }}
        onChange={(pageConfig) => {
          const current = pageConfig.current || 1;
          const size = pageConfig.pageSize || 15;
          fetchData(current, size);
        }}
        scroll={{ x: 1200 }}
      />
    </>
  );
};
```

### 规范要点

1. **组件顺序**：
   - Hook 调用
   - 列定义
   - 查询表单区域
   - 同步按钮区域
   - 同步模态框
   - 数据表格

2. **查询表单**：
   - 使用 `BaseSpace` 包裹，设置 `flexWrap: 'wrap'` 支持换行
   - 查询按钮调用 `fetchData(1, pagination.pageSize)`
   - 重置按钮清空 `query` 并重新获取数据

3. **日期选择器**：
   - 使用 `DayjsDatePicker` 组件
   - 日期格式统一为 `YYYY-MM-DD`
   - 使用 `Dates.format(date, 'YYYY-MM-DD')` 格式化日期
   - 支持日期范围选择时使用 `DayjsDatePicker.RangePicker` 和 `getDateRanges()`

4. **表格配置**：
   - `pagination.showTotal` 统一格式为 `共 {total} 条`
   - `onChange` 处理分页变化
   - 根据表格宽度设置 `scroll.x`

5. **数据格式化**：
   - 数字使用 `formatNumber(value, decimals)` 或 `formatNumberLocale(value)`
   - 日期使用 `formatDate(dateStr)`
   - 空值统一显示为 `-`

## 工具函数规范

### utils.ts 标准内容

每个子模块的 `utils.ts` 应包含以下内容：

```typescript
// 分页初始值
export const initialPagination = { current: 1, pageSize: 15 };

// 数字转换
export const toNumber = (v: any): number | null => {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'number') return isNaN(v) ? null : v;
  if (typeof v === 'string') {
    const num = parseFloat(v);
    return isNaN(num) ? null : num;
  }
  return null;
};

// 数字格式化（固定小数位）
export const formatNumber = (v: any, decimals: number = 2): string => {
  const num = toNumber(v);
  return num !== null ? num.toFixed(decimals) : '-';
};

// 数字格式化（千分位）
export const formatNumberLocale = (v: any): string => {
  const num = toNumber(v);
  return num !== null ? num.toLocaleString() : '-';
};

// 日期格式化
export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '-';
  if (dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
  }
  return dateStr;
};

// 日期范围快捷选项
export const getDateRanges = (): Record<string, [AppDate, AppDate]> => {
  const today = dayjs();
  return {
    '最近一周': [dayjs().subtract(7, 'day'), today] as [AppDate, AppDate],
    '最近一月': [dayjs().subtract(1, 'month'), today] as [AppDate, AppDate],
    '最近一年': [dayjs().subtract(1, 'year'), today] as [AppDate, AppDate],
    '最近五年': [dayjs().subtract(5, 'year'), today] as [AppDate, AppDate],
    '最近十年': [dayjs().subtract(10, 'year'), today] as [AppDate, AppDate],
  };
};

// 交易所选项（根据模块需要）
export const EXCHANGE_OPTIONS = [
  { label: '全部', value: '' },
  { label: '上交所', value: 'SSE' },
  { label: '深交所', value: 'SZSE' },
];
```

### 规范要点

1. **工具函数复用**：如果多个模块使用相同的工具函数，应提取到公共位置
2. **类型安全**：所有工具函数应包含类型定义
3. **空值处理**：统一返回 `-` 表示空值

## 通用编码规范

### React Hooks 使用

1. **useState**：使用 `useState` 管理组件状态
2. **useCallback**：`fetchData` 等函数使用 `useCallback` 优化
3. **useMemo**：`tabItems` 等配置使用 `useMemo` 优化
4. **useEffect**：仅在必要时使用，注意依赖项

### 类型定义

1. **接口命名**：使用 `PascalCase`，如 `Use{Module}DataOptions`
2. **类型参数**：使用单字母大写，如 `T`、`Q`、`P`
3. **泛型约束**：查询参数类型约束为 `Q extends Record<string, any>`

### 组件导入顺序

1. React 相关
2. 样式相关（styled-components）
3. 公共组件（@app/components）
4. 类型定义（antd/es/table）
5. API 相关（@app/api）
6. Hooks（相对路径）
7. 工具函数（相对路径）
8. 第三方库（dayjs 等）

### 代码风格

1. **函数组件**：统一使用 `React.FC` 类型
2. **导出方式**：默认导出用于页面组件，命名导出用于 Tab 组件
3. **空值处理**：使用 `undefined` 而非 `null` 表示可选值
4. **条件渲染**：使用 `|| undefined` 将空字符串转为 `undefined`

### 错误处理

1. **API 调用**：使用 `try-catch` 包裹异步操作
2. **用户提示**：使用 `notificationController` 统一提示
3. **加载状态**：使用 `loading` 状态控制 UI 反馈

