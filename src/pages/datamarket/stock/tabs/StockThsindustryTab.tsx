import React from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import { Dates } from '@app/constants/Dates';
import { ColumnsType } from 'antd/es/table';
import { StockThsindustry, getStockThsindustryList, syncStockThsindustry, StockThsindustrySyncPayload } from '@app/api/stock.api';
import { useStockData } from '../hooks/useStockData';
import { useStockSync } from '../hooks/useStockSync';
import { trim, formatNumber, formatNumberLocale, toNumber } from '../utils';
import dayjs from 'dayjs';

// 同花顺行业资金流向
export const StockThsindustryTab: React.FC = () => {
  const { query, setQuery, rows, loading, pagination, total, fetchData } = useStockData<
    StockThsindustry,
    { trade_date?: string; start_date?: string; end_date?: string }
  >({
    fetchFn: async (params) => {
      const res = await getStockThsindustryList({
        skip: params.skip,
        limit: params.limit,
        trade_date: params.trade_date,
        start_date: params.start_date,
        end_date: params.end_date,
      });
      return res;
    },
    initialQuery: { trade_date: undefined, start_date: undefined, end_date: undefined },
  });

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync } = useStockSync<
    StockThsindustrySyncPayload
  >({
    syncFn: syncStockThsindustry,
    onSuccess: () => fetchData(pagination.current, pagination.pageSize),
  });

  const columns: ColumnsType<StockThsindustry> = [
    { title: '交易日期', dataIndex: 'trade_date', key: 'trade_date', align: 'center', render: (v: string) => {
      if (!v) return '-';
      if (v.length === 8 && !v.includes('-')) {
        return `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`;
      }
      return v;
    }},
    { title: '行业代码', dataIndex: 'code', key: 'code', align: 'center' },
    { title: '行业名称', dataIndex: 'name', key: 'name', align: 'left' },
    { title: '净流入(亿元)', dataIndex: 'net_mf_amount', key: 'net_mf_amount', align: 'right', render: (v: any) => {
      const num = toNumber(v);
      if (num === null) return '-';
      const color = num >= 0 ? '#f5222d' : '#52c41a';
      return <span style={{ color }}>{num >= 0 ? '+' : ''}{num.toLocaleString()}</span>;
    }},
    { title: '净流入占比(%)', dataIndex: 'net_mf_ratio', key: 'net_mf_ratio', align: 'right', render: (v: any) => formatNumber(v, 2) },
  ];

  // 日期范围快捷选项
  const dateRanges: Record<string, [dayjs.Dayjs, dayjs.Dayjs]> = {
    '最近一周': [dayjs().subtract(7, 'day'), dayjs()],
    '最近一月': [dayjs().subtract(1, 'month'), dayjs()],
    '最近一年': [dayjs().subtract(1, 'year'), dayjs()],
    '最近五年': [dayjs().subtract(5, 'year'), dayjs()],
    '最近十年': [dayjs().subtract(10, 'year'), dayjs()],
  };

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
        <DayjsDatePicker.RangePicker
          format="YYYY-MM-DD"
          placeholder={['开始日期', '结束日期']}
          value={
            query.start_date && query.end_date
              ? [dayjs(query.start_date, 'YYYYMMDD'), dayjs(query.end_date, 'YYYYMMDD')]
              : null
          }
          onChange={(dates) => {
            setQuery({
              ...query,
              start_date: dates?.[0] ? Dates.format(dates[0], 'YYYYMMDD') : undefined,
              end_date: dates?.[1] ? Dates.format(dates[1], 'YYYYMMDD') : undefined,
            });
          }}
          ranges={dateRanges}
          style={{ width: 300 }}
        />
        <BaseButton onClick={() => fetchData(1, pagination.pageSize)}>查询</BaseButton>
        <BaseButton onClick={() => { setQuery({ trade_date: undefined, start_date: undefined, end_date: undefined }); fetchData(1, pagination.pageSize); }}>重置</BaseButton>
      </BaseSpace>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem' }}>
        <BaseButton type="primary" onClick={() => { setSyncPayload({ trade_date: query.trade_date, start_date: query.start_date, end_date: query.end_date }); setSyncOpen(true); }}>同步数据</BaseButton>
      </BaseSpace>
      <BaseModal title="同花顺行业资金流向同步" open={syncOpen} onCancel={() => setSyncOpen(false)} confirmLoading={syncLoading} onOk={() => handleSync()}>
        <BaseForm layout="vertical">
          <BaseForm.Item label="交易日期（可选）">
            <BaseInput
              type="date"
              value={syncPayload.trade_date ? syncPayload.trade_date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : undefined}
              onChange={(e) => setSyncPayload({ ...syncPayload, trade_date: e.target.value ? e.target.value.replace(/-/g, '') : undefined })}
            />
          </BaseForm.Item>
          <BaseForm.Item label="日期范围（可选）">
            <DayjsDatePicker.RangePicker
              format="YYYY-MM-DD"
              placeholder={['开始日期', '结束日期']}
              value={
                syncPayload.start_date && syncPayload.end_date
                  ? [dayjs(syncPayload.start_date, 'YYYYMMDD'), dayjs(syncPayload.end_date, 'YYYYMMDD')]
                  : null
              }
              onChange={(dates) => {
                setSyncPayload({
                  ...syncPayload,
                  start_date: dates?.[0] ? Dates.format(dates[0], 'YYYYMMDD') : undefined,
                  end_date: dates?.[1] ? Dates.format(dates[1], 'YYYYMMDD') : undefined,
                });
              }}
              ranges={dateRanges}
              style={{ width: '100%' }}
            />
          </BaseForm.Item>
          <BaseForm.Item label="代码（可选）">
            <BaseInput
              placeholder="输入代码"
              value={syncPayload.ts_code}
              onChange={(e) => setSyncPayload({ ...syncPayload, ts_code: trim(e.target.value) || undefined })}
            />
          </BaseForm.Item>
        </BaseForm>
      </BaseModal>
      <BaseTable
        columns={columns}
        dataSource={rows}
        rowKey={(record) => `${record.trade_date}-${record.code}`}
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

