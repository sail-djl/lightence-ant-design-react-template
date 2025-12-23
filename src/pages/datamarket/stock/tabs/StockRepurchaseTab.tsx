import React from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { ColumnsType } from 'antd/es/table';
import { StockRepurchase, getStockRepurchaseList, syncStockRepurchase, StockRepurchaseSyncPayload } from '@app/api/stock.api';
import { useStockData } from '../hooks/useStockData';
import { useStockSync } from '../hooks/useStockSync';
import { useStockOptions } from '../hooks/useStockOptions';
import { trim, formatNumber, formatNumberLocale } from '../utils';

export const StockRepurchaseTab: React.FC = () => {
  const { stockOptions, stockOptionsLoading, fetchStockOptions } = useStockOptions();

  const { query, setQuery, rows, loading, pagination, total, fetchData } = useStockData<
    StockRepurchase,
    { ts_code?: string; start_date?: string; end_date?: string }
  >({
    fetchFn: async (params) => {
      const res = await getStockRepurchaseList({
        skip: params.skip,
        limit: params.limit,
        ts_code: params.ts_code,
        start_date: params.start_date,
        end_date: params.end_date,
      });
      return res;
    },
    initialQuery: { ts_code: undefined, start_date: undefined, end_date: undefined },
  });

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync } = useStockSync<
    StockRepurchaseSyncPayload
  >({
    syncFn: syncStockRepurchase,
    onSuccess: () => {
      const syncedTsCode = syncPayload.ts_code;
      if (syncedTsCode) {
        const newQuery = { ts_code: syncedTsCode, start_date: undefined, end_date: undefined };
        setQuery(newQuery);
        fetchData(1, pagination.pageSize, newQuery);
      } else {
        fetchData(1, pagination.pageSize);
      }
    },
  });

  const columns: ColumnsType<StockRepurchase> = [
    { title: '股票代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center' },
    { title: '公告日期', dataIndex: 'ann_date', key: 'ann_date', align: 'center', render: (v: string) => {
      if (!v) return '-';
      if (v.length === 8 && !v.includes('-')) {
        return `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`;
      }
      return v;
    }},
    { title: '截止日期', dataIndex: 'end_date', key: 'end_date', align: 'center', render: (v: string) => {
      if (!v) return '-';
      if (v.length === 8 && !v.includes('-')) {
        return `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`;
      }
      return v;
    }},
    { title: '进度', dataIndex: 'proc', key: 'proc', align: 'center' },
    { title: '回购股数(万股)', dataIndex: 'vol', key: 'vol', align: 'right', render: (v: any) => formatNumberLocale(v) },
    { title: '回购金额(万元)', dataIndex: 'amount', key: 'amount', align: 'right', render: (v: any) => formatNumberLocale(v) },
    { title: '价格上限', dataIndex: 'high_limit', key: 'high_limit', align: 'right', render: (v: any) => formatNumber(v, 2) },
    { title: '价格下限', dataIndex: 'low_limit', key: 'low_limit', align: 'right', render: (v: any) => formatNumber(v, 2) },
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
        <BaseButton onClick={() => { setQuery({ ts_code: undefined, start_date: undefined, end_date: undefined }); fetchData(1, pagination.pageSize); }}>重置</BaseButton>
      </BaseSpace>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem' }}>
        <BaseButton type="primary" onClick={() => { setSyncPayload({ ts_code: query.ts_code, start_date: query.start_date, end_date: query.end_date }); setSyncOpen(true); }}>同步数据</BaseButton>
      </BaseSpace>
      <BaseModal 
        title="股票回购同步" 
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
        rowKey={(record) => `${record.ts_code}-${record.ann_date}`}
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

