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
import { StockStrongest, getStockStrongestList, syncStockStrongest, StockStrongestSyncPayload } from '@app/api/datamarket/stock.api';
import { useStockData } from '../hooks/useStockData';
import { useStockSync } from '../hooks/useStockSync';
import { trim, formatNumber, toNumber } from '../utils';
import dayjs from 'dayjs';

// 最强板块统计
export const StockStrongestTab: React.FC = () => {
  const { query, setQuery, rows, loading, pagination, total, fetchData } = useStockData<
    StockStrongest,
    { ts_code?: string; trade_date?: string; start_date?: string; end_date?: string }
  >({
    fetchFn: async (params) => {
      const res = await getStockStrongestList({
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
    StockStrongestSyncPayload
  >({
    syncFn: syncStockStrongest,
    onSuccess: () => fetchData(pagination.current, pagination.pageSize),
  });

  const columns: ColumnsType<StockStrongest> = [
    { title: '交易日期', dataIndex: 'trade_date', key: 'trade_date', align: 'center', render: (v: string) => {
      if (!v) return '-';
      if (v.length === 8 && !v.includes('-')) {
        return `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`;
      }
      return v;
    }},
    { title: '板块代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center' },
    { title: '板块名称', dataIndex: 'name', key: 'name', align: 'left' },
    { title: '上榜天数', dataIndex: 'days', key: 'days', align: 'right', render: (v: number) => v ?? '-' },
    { title: '连板高度', dataIndex: 'up_stat', key: 'up_stat', align: 'center' },
    { title: '连板家数', dataIndex: 'cons_nums', key: 'cons_nums', align: 'right', render: (v: number) => v ?? '-' },
    { title: '涨停家数', dataIndex: 'up_nums', key: 'up_nums', align: 'center' },
    { title: '涨跌幅(%)', dataIndex: 'pct_chg', key: 'pct_chg', align: 'right', render: (v: any) => {
      const num = toNumber(v);
      if (num === null) return '-';
      const color = num >= 0 ? '#f5222d' : '#52c41a';
      return <span style={{ color }}>{num >= 0 ? '+' : ''}{num.toFixed(2)}%</span>;
    }},
    { title: '板块热点排名', dataIndex: 'rank', key: 'rank', align: 'center' },
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
          placeholder="板块代码"
          allowClear
          value={query.ts_code}
          onChange={(e) => setQuery((prev) => ({ ...prev, ts_code: trim(e.target.value) || undefined }))}
          style={{ width: 200 }}
          onPressEnter={() => fetchData(1, pagination.pageSize)}
        />
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
        <BaseButton onClick={() => { setQuery({ ts_code: undefined, trade_date: undefined, start_date: undefined, end_date: undefined }); fetchData(1, pagination.pageSize); }}>重置</BaseButton>
      </BaseSpace>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem' }}>
        <BaseButton type="primary" onClick={() => { setSyncPayload({ ts_code: query.ts_code, trade_date: query.trade_date, start_date: query.start_date, end_date: query.end_date }); setSyncOpen(true); }}>同步数据</BaseButton>
      </BaseSpace>
      <BaseModal title="最强板块统计同步" open={syncOpen} onCancel={() => setSyncOpen(false)} confirmLoading={syncLoading} onOk={() => handleSync()}>
        <BaseForm layout="vertical">
          <BaseForm.Item label="板块代码（可选）">
            <BaseInput
              placeholder="输入板块代码"
              value={syncPayload.ts_code}
              onChange={(e) => setSyncPayload({ ...syncPayload, ts_code: trim(e.target.value) || undefined })}
            />
          </BaseForm.Item>
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
        </BaseForm>
      </BaseModal>
      <BaseTable
        columns={columns}
        dataSource={rows}
        rowKey={(record) => `${record.ts_code}-${record.trade_date}`}
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

