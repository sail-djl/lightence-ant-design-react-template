import React from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { ColumnsType } from 'antd/es/table';
import { StockLhb, getStockLhbList, syncStockLhb, StockLhbSyncPayload } from '@app/api/stock.api';
import { useStockData } from '../hooks/useStockData';
import { useStockSync } from '../hooks/useStockSync';
import { useStockOptions } from '../hooks/useStockOptions';
import { notificationController } from '@app/controllers/notificationController';
import { trim, formatNumber, formatNumberLocale, toNumber } from '../utils';

export const StockLhbTab: React.FC = () => {
  const { stockOptions, stockOptionsLoading, fetchStockOptions } = useStockOptions();

  const { query, setQuery, rows, loading, pagination, total, fetchData } = useStockData<
    StockLhb,
    { ts_code?: string; trade_date?: string; start_date?: string; end_date?: string }
  >({
    fetchFn: async (params) => {
      const res = await getStockLhbList({
        skip: params.skip,
        limit: params.limit,
        ts_code: params.ts_code,
        trade_date: params.trade_date,
        start_date: params.start_date,
        end_date: params.end_date,
      });
      return res;
    },
    initialQuery: { ts_code: undefined, trade_date: undefined, start_date: undefined, end_date: undefined },
  });

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync } = useStockSync<
    StockLhbSyncPayload
  >({
    syncFn: syncStockLhb,
    onSuccess: () => {
      const syncedTsCode = syncPayload.ts_code;
      if (syncedTsCode) {
        const newQuery = { ts_code: syncedTsCode, trade_date: undefined, start_date: undefined, end_date: undefined };
        setQuery(newQuery);
        fetchData(1, pagination.pageSize, newQuery);
      } else {
        fetchData(1, pagination.pageSize);
      }
    },
  });

  const columns: ColumnsType<StockLhb> = [
    { title: '交易日期', dataIndex: 'trade_date', key: 'trade_date', align: 'center', render: (v: string) => {
      if (!v) return '-';
      if (v.length === 8 && !v.includes('-')) {
        return `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`;
      }
      return v;
    }},
    { title: '股票代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center' },
    { title: '名称', dataIndex: 'name', key: 'name', align: 'left' },
    { title: '收盘价', dataIndex: 'close', key: 'close', align: 'right', render: (v: any) => formatNumber(v, 2) },
    { title: '涨跌幅(%)', dataIndex: 'pct_change', key: 'pct_change', align: 'right', render: (v: any) => {
      const num = toNumber(v);
      if (num === null) return '-';
      const color = num >= 0 ? '#f5222d' : '#52c41a';
      return <span style={{ color }}>{num >= 0 ? '+' : ''}{num.toFixed(2)}%</span>;
    }},
    { title: '换手率(%)', dataIndex: 'turnover_rate', key: 'turnover_rate', align: 'right', render: (v: any) => formatNumber(v, 2) },
    { title: '总成交额', dataIndex: 'amount', key: 'amount', align: 'right', render: (v: any) => formatNumberLocale(v) },
    { title: '龙虎榜买入额', dataIndex: 'l_buy', key: 'l_buy', align: 'right', render: (v: any) => formatNumberLocale(v) },
    { title: '龙虎榜卖出额', dataIndex: 'l_sell', key: 'l_sell', align: 'right', render: (v: any) => formatNumberLocale(v) },
    { title: '净买入额', dataIndex: 'net_amount', key: 'net_amount', align: 'right', render: (v: any) => {
      const num = toNumber(v);
      if (num === null) return '-';
      const color = num >= 0 ? '#f5222d' : '#52c41a';
      return <span style={{ color }}>{num >= 0 ? '+' : ''}{num.toLocaleString()}</span>;
    }},
    { title: '上榜理由', dataIndex: 'reason', key: 'reason', align: 'left', ellipsis: true },
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
        <BaseButton onClick={() => { setQuery({ ts_code: undefined, trade_date: undefined, start_date: undefined, end_date: undefined }); fetchData(1, pagination.pageSize); }}>重置</BaseButton>
      </BaseSpace>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem' }}>
        <BaseButton type="primary" onClick={() => { setSyncPayload({ ts_code: query.ts_code, trade_date: query.trade_date || '' }); setSyncOpen(true); }}>同步数据</BaseButton>
      </BaseSpace>
      <BaseModal 
        title="龙虎榜每日明细同步" 
        open={syncOpen} 
        onCancel={() => setSyncOpen(false)} 
        confirmLoading={syncLoading} 
        onOk={() => handleSync(() => {
          if (!syncPayload.trade_date) {
            notificationController.error({ message: '请选择交易日期' });
            return false;
          }
          return true;
        })}
      >
        <BaseForm layout="vertical">
          <BaseForm.Item label="交易日期（必填）" required>
            <BaseInput
              type="date"
              value={syncPayload.trade_date ? syncPayload.trade_date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : undefined}
              onChange={(e) => setSyncPayload({ ...syncPayload, trade_date: e.target.value ? e.target.value.replace(/-/g, '') : '' })}
            />
          </BaseForm.Item>
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
        rowKey={(record) => `${record.trade_date}-${record.ts_code}`}
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

