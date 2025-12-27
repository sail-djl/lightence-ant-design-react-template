import React from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { ColumnsType } from 'antd/es/table';
import { StockBalancesheet, getStockBalancesheetList, syncStockBalancesheet, StockBalancesheetSyncPayload } from '@app/api/stock.api';
import { useStockData } from '../hooks/useStockData';
import { useStockSync } from '../hooks/useStockSync';
import { useStockOptions } from '../hooks/useStockOptions';
import { notificationController } from '@app/controllers/notificationController';
import { trim, formatNumberLocale } from '../utils';

// 资产负债表
export const StockBalancesheetTab: React.FC = () => {
  const { stockOptions, stockOptionsLoading, fetchStockOptions } = useStockOptions();

  const { query, setQuery, rows, loading, pagination, total, fetchData } = useStockData<
    StockBalancesheet,
    { ts_code?: string; period?: string; start_date?: string; end_date?: string; report_type?: string }
  >({
    fetchFn: async (params) => {
      const res = await getStockBalancesheetList({
        skip: params.skip,
        limit: params.limit,
        ts_code: params.ts_code,
        period: params.period,
        start_date: params.start_date,
        end_date: params.end_date,
        report_type: params.report_type,
      });
      return res;
    },
    initialQuery: { ts_code: undefined, period: undefined, start_date: undefined, end_date: undefined, report_type: undefined },
  });

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync } = useStockSync<
    StockBalancesheetSyncPayload
  >({
    syncFn: syncStockBalancesheet,
    onSuccess: () => {
      const syncedTsCode = syncPayload.ts_code;
      if (syncedTsCode) {
        const newQuery = { ts_code: syncedTsCode, period: undefined, start_date: undefined, end_date: undefined, report_type: undefined };
        setQuery(newQuery);
        fetchData(1, pagination.pageSize, newQuery);
      } else {
        fetchData(1, pagination.pageSize);
      }
    },
  });

  const columns: ColumnsType<StockBalancesheet> = [
    { title: '股票代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center' },
    { title: '公告日期', dataIndex: 'ann_date', key: 'ann_date', align: 'center', render: (v: string) => {
      if (!v) return '-';
      if (v.length === 8 && !v.includes('-')) {
        return `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`;
      }
      return v;
    }},
    { title: '报告期', dataIndex: 'end_date', key: 'end_date', align: 'center', render: (v: string) => {
      if (!v) return '-';
      if (v.length === 8 && !v.includes('-')) {
        return `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`;
      }
      return v;
    }},
    { title: '总资产', dataIndex: 'total_assets', key: 'total_assets', align: 'right', render: (v: any) => formatNumberLocale(v) },
    { title: '流动资产合计', dataIndex: 'total_cur_assets', key: 'total_cur_assets', align: 'right', render: (v: any) => formatNumberLocale(v) },
    { title: '非流动资产合计', dataIndex: 'total_nca', key: 'total_nca', align: 'right', render: (v: any) => formatNumberLocale(v) },
    { title: '负债合计', dataIndex: 'total_liab', key: 'total_liab', align: 'right', render: (v: any) => formatNumberLocale(v) },
    { title: '流动负债合计', dataIndex: 'total_cur_liab', key: 'total_cur_liab', align: 'right', render: (v: any) => formatNumberLocale(v) },
    { title: '股东权益合计', dataIndex: 'total_hldr_eqy_exc_min_int', key: 'total_hldr_eqy_exc_min_int', align: 'right', render: (v: any) => formatNumberLocale(v) },
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
        <BaseButton onClick={() => fetchData(1, pagination.pageSize)}>查询</BaseButton>
        <BaseButton onClick={() => { setQuery({ ts_code: undefined, period: undefined, start_date: undefined, end_date: undefined, report_type: undefined }); fetchData(1, pagination.pageSize); }}>重置</BaseButton>
      </BaseSpace>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem' }}>
        <BaseButton type="primary" onClick={() => { setSyncPayload({ ts_code: query.ts_code, period: query.period }); setSyncOpen(true); }}>同步数据</BaseButton>
      </BaseSpace>
      <BaseModal 
        title="资产负债表同步" 
        open={syncOpen} 
        onCancel={() => setSyncOpen(false)} 
        confirmLoading={syncLoading} 
        onOk={() => handleSync(() => {
          if (!syncPayload.ts_code) {
            notificationController.error({ message: '请选择股票代码' });
            return false;
          }
          return true;
        })}
      >
        <BaseForm layout="vertical">
          <BaseForm.Item label="股票代码（必填）" required>
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
        rowKey={(record) => `${record.ts_code}-${record.end_date}-${record.report_type || '1'}`}
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

