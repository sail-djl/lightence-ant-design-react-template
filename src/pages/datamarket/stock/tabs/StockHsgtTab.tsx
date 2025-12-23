import React from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { ColumnsType } from 'antd/es/table';
import { StockHsgt, getStockHsgtList, syncStockHsgt, StockHsgtSyncPayload } from '@app/api/stock.api';
import { useStockData } from '../hooks/useStockData';
import { useStockSync } from '../hooks/useStockSync';
import { useStockOptions } from '../hooks/useStockOptions';
import { trim, formatNumber, formatNumberLocale } from '../utils';

export const StockHsgtTab: React.FC = () => {
  const { stockOptions, stockOptionsLoading, fetchStockOptions } = useStockOptions();

  const { query, setQuery, rows, loading, pagination, total, fetchData } = useStockData<
    StockHsgt,
    { ts_code?: string; trade_date?: string; start_date?: string; end_date?: string; exchange?: string }
  >({
    fetchFn: async (params) => {
      const res = await getStockHsgtList({
        skip: params.skip,
        limit: params.limit,
        ts_code: params.ts_code,
        trade_date: params.trade_date,
        start_date: params.start_date,
        end_date: params.end_date,
        exchange: params.exchange,
      });
      return res;
    },
    initialQuery: { ts_code: undefined, trade_date: undefined, start_date: undefined, end_date: undefined, exchange: undefined },
  });

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync } = useStockSync<
    StockHsgtSyncPayload
  >({
    syncFn: syncStockHsgt,
    onSuccess: () => {
      const syncedTsCode = syncPayload.ts_code;
      if (syncedTsCode) {
        const newQuery = { ts_code: syncedTsCode, trade_date: undefined, start_date: undefined, end_date: undefined, exchange: undefined };
        setQuery(newQuery);
        fetchData(1, pagination.pageSize, newQuery);
      } else {
        fetchData(1, pagination.pageSize);
      }
    },
  });

  const columns: ColumnsType<StockHsgt> = [
    { title: '交易日期', dataIndex: 'trade_date', key: 'trade_date', align: 'center', render: (v: string) => {
      if (!v) return '-';
      if (v.length === 8 && !v.includes('-')) {
        return `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`;
      }
      return v;
    }},
    { title: '股票代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center' },
    { title: '股票名称', dataIndex: 'name', key: 'name', align: 'left' },
    { title: '持股数量(股)', dataIndex: 'vol', key: 'vol', align: 'right', render: (v: any) => formatNumberLocale(v) },
    { title: '持股占比(%)', dataIndex: 'ratio', key: 'ratio', align: 'right', render: (v: any) => formatNumber(v, 4) },
    { title: '类型', dataIndex: 'exchange', key: 'exchange', align: 'center', render: (v: string) => {
      const exchangeMap: Record<string, string> = { 'SH': '沪股通（北向）', 'SZ': '深股通（北向）', 'HK': '港股通（南向持股）' };
      return exchangeMap[v] || v || '-';
    }},
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
        <BaseButton onClick={() => { setQuery({ ts_code: undefined, trade_date: undefined, start_date: undefined, end_date: undefined, exchange: undefined }); fetchData(1, pagination.pageSize); }}>重置</BaseButton>
      </BaseSpace>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem' }}>
        <BaseButton type="primary" onClick={() => { setSyncPayload({ ts_code: query.ts_code, trade_date: query.trade_date, start_date: query.start_date, end_date: query.end_date, exchange: query.exchange }); setSyncOpen(true); }}>同步数据</BaseButton>
      </BaseSpace>
      <BaseModal 
        title="沪深港股通持股明细同步" 
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
        </BaseForm>
      </BaseModal>
      <BaseTable
        columns={columns}
        dataSource={rows}
        rowKey={(record) => `${record.ts_code}-${record.trade_date}-${record.exchange || ''}`}
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
      />
    </>
  );
};

