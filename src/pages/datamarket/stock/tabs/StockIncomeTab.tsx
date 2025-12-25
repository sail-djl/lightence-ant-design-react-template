import React from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { Empty } from 'antd';
import { StockIncome, getStockIncomeList, syncStockIncome, StockIncomeSyncPayload } from '@app/api/stock.api';
import { useStockData } from '../hooks/useStockData';
import { useStockSync } from '../hooks/useStockSync';
import { useStockOptions } from '../hooks/useStockOptions';
import { notificationController } from '@app/controllers/notificationController';
import { trim, formatNumber, formatNumberLocale } from '../utils';

export const StockIncomeTab: React.FC = () => {
  const { stockOptions, stockOptionsLoading, fetchStockOptions } = useStockOptions();

  const { query, setQuery, rows, loading, pagination, total, fetchData } = useStockData<
    StockIncome,
    { ts_code?: string; period?: string; start_date?: string; end_date?: string; report_type?: string }
  >({
    fetchFn: async (params) => {
      const res = await getStockIncomeList({
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
    StockIncomeSyncPayload
  >({
    syncFn: syncStockIncome,
    onSuccess: () => {
      // 同步成功后，将同步的股票代码设置到查询条件中，然后查询
      const syncedTsCode = syncPayload.ts_code;
      if (syncedTsCode) {
        // 更新查询条件并立即查询
        const newQuery = { ts_code: syncedTsCode, period: undefined, start_date: undefined, end_date: undefined, report_type: undefined };
        setQuery(newQuery);
        // 使用新的查询条件查询
        fetchData(1, pagination.pageSize, newQuery);
      } else {
        fetchData(1, pagination.pageSize);
      }
    },
  });

  const columns = [
    { title: '股票代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center' as const },
    { title: '公告日期', dataIndex: 'ann_date', key: 'ann_date', align: 'center' as const, render: (v: string) => {
      if (!v) return '-';
      if (v.length === 8 && !v.includes('-')) {
        return `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`;
      }
      return v;
    }},
    { title: '报告期', dataIndex: 'end_date', key: 'end_date', align: 'center' as const, render: (v: string) => {
      if (!v) return '-';
      if (v.length === 8 && !v.includes('-')) {
        return `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`;
      }
      return v;
    }},
    { title: '基本每股收益', dataIndex: 'basic_eps', key: 'basic_eps', align: 'right' as const, render: (v: any) => formatNumber(v, 4) },
    { title: '营业总收入', dataIndex: 'total_revenue', key: 'total_revenue', align: 'right' as const, render: (v: any) => formatNumberLocale(v) },
    { title: '净利润', dataIndex: 'n_income', key: 'n_income', align: 'right' as const, render: (v: any) => formatNumberLocale(v) },
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
          placeholder="报告期"
          value={query.period}
          onChange={(e) => setQuery((prev) => ({ ...prev, period: e.target.value ? e.target.value.replace(/-/g, '') : undefined }))}
          style={{ width: 200 }}
        />
        <BaseButton onClick={() => fetchData(1, pagination.pageSize)}>查询</BaseButton>
        <BaseButton onClick={() => { setQuery({ ts_code: undefined, period: undefined, start_date: undefined, end_date: undefined, report_type: undefined }); fetchData(1, pagination.pageSize); }}>重置</BaseButton>
      </BaseSpace>

      <BaseSpace style={{ display: 'flex', marginBottom: '1rem' }}>
        <BaseButton type="primary" onClick={() => { setSyncPayload({ ts_code: query.ts_code, period: query.period }); setSyncOpen(true); }}>同步数据</BaseButton>
      </BaseSpace>

      <BaseModal 
        title="利润表同步" 
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

      {rows.length === 0 && !loading ? (
        <Empty description="暂无数据，请先同步数据" />
      ) : (
        <BaseTable
          columns={columns}
          dataSource={rows}
          rowKey={(record) => `${record.ts_code}-${record.end_date}`}
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
      )}
    </>
  );
};

