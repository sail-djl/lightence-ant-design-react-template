import React from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { ColumnsType } from 'antd/es/table';
import { StockRecommend, getStockRecommendList, syncStockRecommend, StockRecommendSyncPayload } from '@app/api/stock.api';
import { useStockData } from '../hooks/useStockData';
import { useStockSync } from '../hooks/useStockSync';
import { useStockOptions } from '../hooks/useStockOptions';
import { trim } from '../utils';

export const StockRecommendTab: React.FC = () => {
  const { stockOptions, stockOptionsLoading, fetchStockOptions } = useStockOptions();

  const { query, setQuery, rows, loading, pagination, total, fetchData } = useStockData<
    StockRecommend,
    { month?: string; broker?: string; ts_code?: string }
  >({
    fetchFn: async (params) => {
      const res = await getStockRecommendList({
        skip: params.skip,
        limit: params.limit,
        month: params.month,
        broker: params.broker,
        ts_code: params.ts_code,
      });
      return res;
    },
    initialQuery: { month: undefined, broker: undefined, ts_code: undefined },
  });

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync } = useStockSync<
    StockRecommendSyncPayload
  >({
    syncFn: syncStockRecommend,
    onSuccess: () => {
      fetchData(1, pagination.pageSize);
    },
  });

  const columns: ColumnsType<StockRecommend> = [
    { title: '月份', dataIndex: 'month', key: 'month', align: 'center', render: (v: string) => {
      if (!v) return '-';
      if (v.length === 6) {
        return `${v.slice(0, 4)}-${v.slice(4, 6)}`;
      }
      return v;
    }},
    { title: '券商', dataIndex: 'broker', key: 'broker', align: 'left' },
    { title: '股票代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center' },
    { title: '股票名称', dataIndex: 'name', key: 'name', align: 'left' },
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
          type="month"
          placeholder="月份"
          value={query.month ? `${query.month.slice(0, 4)}-${query.month.slice(4, 6)}` : undefined}
          onChange={(e) => setQuery((prev) => ({ ...prev, month: e.target.value ? e.target.value.replace(/-/g, '') : undefined }))}
          style={{ width: 200 }}
        />
        <BaseInput
          placeholder="券商"
          allowClear
          value={query.broker}
          onChange={(e) => setQuery((prev) => ({ ...prev, broker: trim(e.target.value) || undefined }))}
          style={{ width: 200 }}
        />
        <BaseButton onClick={() => fetchData(1, pagination.pageSize)}>查询</BaseButton>
        <BaseButton onClick={() => { setQuery({ month: undefined, broker: undefined, ts_code: undefined }); fetchData(1, pagination.pageSize); }}>重置</BaseButton>
      </BaseSpace>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem' }}>
        <BaseButton type="primary" onClick={() => { setSyncPayload({ month: query.month }); setSyncOpen(true); }}>同步数据</BaseButton>
      </BaseSpace>
      <BaseModal title="券商每月荐股同步" open={syncOpen} onCancel={() => setSyncOpen(false)} confirmLoading={syncLoading} onOk={() => handleSync()}>
        <BaseForm layout="vertical">
          <BaseForm.Item label="月份" required>
            <BaseInput type="month" value={syncPayload.month ? `${syncPayload.month.slice(0, 4)}-${syncPayload.month.slice(4, 6)}` : undefined} onChange={(e) => setSyncPayload({ ...syncPayload, month: e.target.value ? e.target.value.replace(/-/g, '') : undefined })} />
          </BaseForm.Item>
        </BaseForm>
      </BaseModal>
      <BaseTable
        columns={columns}
        dataSource={rows}
        rowKey={(record) => `${record.month}-${record.broker}-${record.ts_code}`}
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

