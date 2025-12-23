import React from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { ColumnsType } from 'antd/es/table';
import { StockDaily, getStockDailyList, syncStockDaily, StockDailySyncPayload } from '@app/api/stock.api';
import { useStockData } from '../hooks/useStockData';
import { useStockSync } from '../hooks/useStockSync';
import { useStockOptions } from '../hooks/useStockOptions';
import { trim, formatNumber, formatNumberLocale, toNumber } from '../utils';

export const StockDailyTab: React.FC = () => {
  const { stockOptions, stockOptionsLoading, fetchStockOptions } = useStockOptions();

  const { query, setQuery, rows, loading, pagination, total, fetchData } = useStockData<
    StockDaily,
    { ts_code?: string; trade_date?: string; start_date?: string; end_date?: string }
  >({
    fetchFn: async (params) => {
      const res = await getStockDailyList({
        ts_code: params.ts_code,
        trade_date: params.trade_date,
        start_date: params.start_date,
        end_date: params.end_date,
        limit: params.limit,
      });
      return res;
    },
    initialQuery: { ts_code: undefined, trade_date: undefined, start_date: undefined, end_date: undefined },
    enablePagination: false, // 日线行情使用limit而不是分页
  });

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync } = useStockSync<
    StockDailySyncPayload
  >({
    syncFn: syncStockDaily,
    onSuccess: () => fetchData(1, pagination.pageSize),
  });

  const columns: ColumnsType<StockDaily> = [
    { title: '股票代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center' },
    { title: '交易日期', dataIndex: 'trade_date', key: 'trade_date', align: 'center', render: (v: string) => {
      if (!v) return '-';
      // 处理 YYYYMMDD 或 YYYY-MM-DD 格式
      if (v.length === 8 && !v.includes('-')) {
        return `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`;
      }
      return v;
    }},
    { title: '开盘价', dataIndex: 'open', key: 'open', align: 'right', render: (v: any) => formatNumber(v, 2) },
    { title: '最高价', dataIndex: 'high', key: 'high', align: 'right', render: (v: any) => formatNumber(v, 2) },
    { title: '最低价', dataIndex: 'low', key: 'low', align: 'right', render: (v: any) => formatNumber(v, 2) },
    { title: '收盘价', dataIndex: 'close', key: 'close', align: 'right', render: (v: any) => formatNumber(v, 2) },
    { title: '昨收价', dataIndex: 'pre_close', key: 'pre_close', align: 'right', render: (v: any) => formatNumber(v, 2) },
    { title: '涨跌额', dataIndex: 'change', key: 'change', align: 'right', render: (v: any) => {
      const num = toNumber(v);
      if (num === null) return '-';
      const color = num >= 0 ? '#f5222d' : '#52c41a';
      return <span style={{ color }}>{num >= 0 ? '+' : ''}{num.toFixed(2)}</span>;
    }},
    { title: '涨跌幅(%)', dataIndex: 'pct_chg', key: 'pct_chg', align: 'right', render: (v: any) => {
      const num = toNumber(v);
      if (num === null) return '-';
      const color = num >= 0 ? '#f5222d' : '#52c41a';
      return <span style={{ color }}>{num >= 0 ? '+' : ''}{num.toFixed(2)}%</span>;
    }},
    { title: '成交量(手)', dataIndex: 'vol', key: 'vol', align: 'right', render: (v: any) => formatNumberLocale(v) },
    { title: '成交额(千元)', dataIndex: 'amount', key: 'amount', align: 'right', render: (v: any) => formatNumberLocale(v) },
  ];

  return (
    <>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <BaseSelect
          placeholder="选择股票代码"
          allowClear
          showSearch
          loading={stockOptionsLoading}
          value={query.ts_code}
          onChange={(val) => setQuery((prev) => ({ ...prev, ts_code: val as string | undefined }))}
          style={{ width: 300 }}
          onSearch={(value) => {
            if (value) {
              fetchStockOptions(value);
            } else {
              fetchStockOptions();
            }
          }}
          filterOption={false}
        >
          {stockOptions.map((item) => (
            <Option key={item.ts_code} value={item.ts_code} label={`${item.ts_code} - ${item.name || ''}`}>
              {item.ts_code} - {item.name || ''}
            </Option>
          ))}
        </BaseSelect>
        <BaseInput
          type="date"
          placeholder="交易日期"
          value={query.trade_date ? query.trade_date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : undefined}
          onChange={(e) => setQuery((prev) => ({ ...prev, trade_date: e.target.value ? e.target.value.replace(/-/g, '') : undefined }))}
          style={{ width: 200 }}
        />
        <BaseInput
          type="date"
          placeholder="开始日期"
          value={query.start_date ? query.start_date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : undefined}
          onChange={(e) => setQuery((prev) => ({ ...prev, start_date: e.target.value ? e.target.value.replace(/-/g, '') : undefined }))}
          style={{ width: 200 }}
        />
        <BaseInput
          type="date"
          placeholder="结束日期"
          value={query.end_date ? query.end_date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : undefined}
          onChange={(e) => setQuery((prev) => ({ ...prev, end_date: e.target.value ? e.target.value.replace(/-/g, '') : undefined }))}
          style={{ width: 200 }}
        />
        <BaseButton onClick={() => fetchData(1, pagination.pageSize)}>查询</BaseButton>
        <BaseButton
          onClick={() => {
            setQuery({ ts_code: undefined, trade_date: undefined, start_date: undefined, end_date: undefined });
            fetchData(1, pagination.pageSize);
          }}
        >
          重置
        </BaseButton>
      </BaseSpace>

      <BaseSpace style={{ display: 'flex', marginBottom: '1rem' }}>
        <BaseButton
          type="primary"
          onClick={() => {
            setSyncPayload({ ts_code: query.ts_code, trade_date: query.trade_date, start_date: query.start_date, end_date: query.end_date });
            setSyncOpen(true);
          }}
        >
          同步数据
        </BaseButton>
      </BaseSpace>

      <BaseModal
        title="A股日线行情同步"
        open={syncOpen}
        onCancel={() => setSyncOpen(false)}
        confirmLoading={syncLoading}
        onOk={() => handleSync()}
      >
        <BaseForm layout="vertical">
          <BaseForm.Item label="股票代码（可选）">
            <BaseSelect
              placeholder="选择股票代码"
              allowClear
              showSearch
              loading={stockOptionsLoading}
              value={syncPayload.ts_code}
              onChange={(val) => setSyncPayload({ ...syncPayload, ts_code: val as string | undefined })}
              onSearch={(value) => {
                if (value) {
                  fetchStockOptions(value);
                } else {
                  fetchStockOptions();
                }
              }}
              filterOption={false}
            >
              {stockOptions.map((item) => (
                <Option key={item.ts_code} value={item.ts_code} label={`${item.ts_code} - ${item.name || ''}`}>
                  {item.ts_code} - {item.name || ''}
                </Option>
              ))}
            </BaseSelect>
          </BaseForm.Item>
          <BaseForm.Item label="交易日期（可选）">
            <BaseInput
              type="date"
              value={syncPayload.trade_date}
              onChange={(e) => setSyncPayload({ ...syncPayload, trade_date: e.target.value ? e.target.value.replace(/-/g, '') : undefined })}
            />
          </BaseForm.Item>
          <BaseForm.Item label="开始日期（可选）">
            <BaseInput
              type="date"
              value={syncPayload.start_date}
              onChange={(e) => setSyncPayload({ ...syncPayload, start_date: e.target.value ? e.target.value.replace(/-/g, '') : undefined })}
            />
          </BaseForm.Item>
          <BaseForm.Item label="结束日期（可选）">
            <BaseInput
              type="date"
              value={syncPayload.end_date}
              onChange={(e) => setSyncPayload({ ...syncPayload, end_date: e.target.value ? e.target.value.replace(/-/g, '') : undefined })}
            />
          </BaseForm.Item>
        </BaseForm>
      </BaseModal>

      <BaseTable
        columns={columns}
        dataSource={rows}
        rowKey={(record) => `${record.ts_code}-${record.trade_date}`}
        loading={loading}
        pagination={false}
      />
    </>
  );
};

