import React from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { ColumnsType } from 'antd/es/table';
import { StockMargin, getStockMarginList, syncStockMargin, StockMarginSyncPayload } from '@app/api/stock.api';
import { useStockData } from '../hooks/useStockData';
import { useStockSync } from '../hooks/useStockSync';
import { trim, formatNumberLocale } from '../utils';

export const StockMarginTab: React.FC = () => {
  const { query, setQuery, rows, loading, pagination, total, fetchData } = useStockData<
    StockMargin,
    { trade_date?: string; start_date?: string; end_date?: string; exchange_id?: string }
  >({
    fetchFn: async (params) => {
      const res = await getStockMarginList({
        skip: params.skip,
        limit: params.limit,
        trade_date: params.trade_date,
        start_date: params.start_date,
        end_date: params.end_date,
        exchange_id: params.exchange_id,
      });
      return res;
    },
    initialQuery: { trade_date: undefined, start_date: undefined, end_date: undefined, exchange_id: undefined },
  });

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync } = useStockSync<
    StockMarginSyncPayload
  >({
    syncFn: syncStockMargin,
    onSuccess: () => fetchData(pagination.current, pagination.pageSize),
  });

  const columns: ColumnsType<StockMargin> = [
    { title: '交易日期', dataIndex: 'trade_date', key: 'trade_date', align: 'center', render: (v: string) => {
      if (!v) return '-';
      if (v.length === 8 && !v.includes('-')) {
        return `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`;
      }
      return v;
    }},
    { title: '交易所', dataIndex: 'exchange_id', key: 'exchange_id', align: 'center', render: (v: string) => {
      const exchangeMap: Record<string, string> = { 'SSE': '上交所', 'SZSE': '深交所', 'BSE': '北交所' };
      return exchangeMap[v] || v || '-';
    }},
    { title: '融资余额(元)', dataIndex: 'rzye', key: 'rzye', align: 'right', render: (v: any) => formatNumberLocale(v) },
    { title: '融资买入额(元)', dataIndex: 'rzmre', key: 'rzmre', align: 'right', render: (v: any) => formatNumberLocale(v) },
    { title: '融资偿还额(元)', dataIndex: 'rzche', key: 'rzche', align: 'right', render: (v: any) => formatNumberLocale(v) },
    { title: '融券余额(元)', dataIndex: 'rqye', key: 'rqye', align: 'right', render: (v: any) => formatNumberLocale(v) },
    { title: '融券卖出量', dataIndex: 'rqmcl', key: 'rqmcl', align: 'right', render: (v: any) => formatNumberLocale(v) },
    { title: '融资融券余额(元)', dataIndex: 'rzrqye', key: 'rzrqye', align: 'right', render: (v: any) => formatNumberLocale(v) },
  ];

  return (
    <>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem', flexWrap: 'wrap' }}>
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
        <BaseButton onClick={() => { setQuery({ trade_date: undefined, start_date: undefined, end_date: undefined, exchange_id: undefined }); fetchData(1, pagination.pageSize); }}>重置</BaseButton>
      </BaseSpace>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem' }}>
        <BaseButton type="primary" onClick={() => { setSyncPayload({ trade_date: query.trade_date, start_date: query.start_date, end_date: query.end_date, exchange_id: query.exchange_id }); setSyncOpen(true); }}>同步数据</BaseButton>
      </BaseSpace>
      <BaseModal title="融资融券交易汇总同步" open={syncOpen} onCancel={() => setSyncOpen(false)} confirmLoading={syncLoading} onOk={() => handleSync()}>
        <BaseForm layout="vertical">
          <BaseForm.Item label="交易日期（可选）">
            <BaseInput
              type="date"
              value={syncPayload.trade_date ? syncPayload.trade_date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : undefined}
              onChange={(e) => setSyncPayload({ ...syncPayload, trade_date: e.target.value ? e.target.value.replace(/-/g, '') : undefined })}
            />
          </BaseForm.Item>
          <BaseForm.Item label="开始日期（可选）">
            <BaseInput
              type="date"
              value={syncPayload.start_date ? syncPayload.start_date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : undefined}
              onChange={(e) => setSyncPayload({ ...syncPayload, start_date: e.target.value ? e.target.value.replace(/-/g, '') : undefined })}
            />
          </BaseForm.Item>
          <BaseForm.Item label="结束日期（可选）">
            <BaseInput
              type="date"
              value={syncPayload.end_date ? syncPayload.end_date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : undefined}
              onChange={(e) => setSyncPayload({ ...syncPayload, end_date: e.target.value ? e.target.value.replace(/-/g, '') : undefined })}
            />
          </BaseForm.Item>
          <BaseForm.Item label="交易所（可选）">
            <BaseSelect
              allowClear
              placeholder="选择交易所"
              value={syncPayload.exchange_id}
              onChange={(val) => setSyncPayload({ ...syncPayload, exchange_id: val as string | undefined })}
            >
              <Option value="SSE">上交所(SSE)</Option>
              <Option value="SZSE">深交所(SZSE)</Option>
              <Option value="BSE">北交所(BSE)</Option>
            </BaseSelect>
          </BaseForm.Item>
        </BaseForm>
      </BaseModal>
      <BaseTable
        columns={columns}
        dataSource={rows}
        rowKey={(record) => `${record.trade_date}-${record.exchange_id}`}
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

