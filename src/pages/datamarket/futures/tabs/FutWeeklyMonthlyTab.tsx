import React from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import { Dates } from '@app/constants/Dates';
import { ColumnsType } from 'antd/es/table';
import { FutWeeklyMonthly, getFutWeeklyMonthlyList, FutWeeklyMonthlyQuery } from '@app/api/futures.api';
import { useFuturesData } from '../hooks/useFuturesData';
import { useFuturesSync } from '../hooks/useFuturesSync';
import { formatNumber, formatNumberLocale, formatDate, getDateRanges, EXCHANGE_OPTIONS, FREQ_OPTIONS } from '../utils';
import dayjs from 'dayjs';

export const FutWeeklyMonthlyTab: React.FC = () => {
  const { query, setQuery, rows, loading, pagination, total, fetchData } = useFuturesData<
    FutWeeklyMonthly,
    FutWeeklyMonthlyQuery
  >({
    fetchFn: async (params) => {
      const res = await getFutWeeklyMonthlyList({
        skip: params.skip,
        limit: params.limit,
        ts_code: params.ts_code || undefined,
        trade_date: params.trade_date || undefined,
        freq: params.freq || undefined,
        exchange: params.exchange || undefined,
        start_date: params.start_date || undefined,
        end_date: params.end_date || undefined,
      });
      return res;
    },
    initialQuery: {
      ts_code: undefined,
      trade_date: undefined,
      freq: undefined,
      exchange: undefined,
      start_date: undefined,
      end_date: undefined,
    },
  });

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync, openSync } = useFuturesSync({
    onSuccess: () => fetchData(pagination.current, pagination.pageSize),
  });

  const columns: ColumnsType<FutWeeklyMonthly> = [
    { title: '合约代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center', width: 150 },
    { title: '交易日期', dataIndex: 'trade_date', key: 'trade_date', align: 'center', width: 120, render: formatDate },
    {
      title: '频率',
      dataIndex: 'freq',
      key: 'freq',
      align: 'center',
      width: 80,
      render: (v: string) => (v === 'week' ? '周线' : v === 'month' ? '月线' : v),
    },
    {
      title: '计算截至日期',
      dataIndex: 'end_date',
      key: 'end_date',
      align: 'center',
      width: 120,
      render: formatDate,
    },
    {
      title: '开盘价',
      dataIndex: 'open',
      key: 'open',
      align: 'right',
      width: 120,
      render: (v: number) => formatNumber(v, 4),
    },
    {
      title: '最高价',
      dataIndex: 'high',
      key: 'high',
      align: 'right',
      width: 120,
      render: (v: number) => formatNumber(v, 4),
    },
    {
      title: '最低价',
      dataIndex: 'low',
      key: 'low',
      align: 'right',
      width: 120,
      render: (v: number) => formatNumber(v, 4),
    },
    {
      title: '收盘价',
      dataIndex: 'close',
      key: 'close',
      align: 'right',
      width: 120,
      render: (v: number) => formatNumber(v, 4),
    },
    {
      title: '结算价',
      dataIndex: 'settle',
      key: 'settle',
      align: 'right',
      width: 120,
      render: (v: number) => formatNumber(v, 4),
    },
    {
      title: '涨跌1',
      dataIndex: 'change1',
      key: 'change1',
      align: 'right',
      width: 100,
      render: (v: number) => {
        if (v === null || v === undefined) return '-';
        const color = v >= 0 ? '#f5222d' : '#52c41a';
        return <span style={{ color }}>{formatNumber(v, 4)}</span>;
      },
    },
    {
      title: '涨跌2',
      dataIndex: 'change2',
      key: 'change2',
      align: 'right',
      width: 100,
      render: (v: number) => {
        if (v === null || v === undefined) return '-';
        const color = v >= 0 ? '#f5222d' : '#52c41a';
        return <span style={{ color }}>{formatNumber(v, 4)}</span>;
      },
    },
    {
      title: '成交量(手)',
      dataIndex: 'vol',
      key: 'vol',
      align: 'right',
      width: 120,
      render: (v: number) => formatNumberLocale(v),
    },
    {
      title: '成交金额(万元)',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      width: 140,
      render: (v: number) => formatNumberLocale(v),
    },
    {
      title: '持仓量(手)',
      dataIndex: 'oi',
      key: 'oi',
      align: 'right',
      width: 120,
      render: (v: number) => formatNumberLocale(v),
    },
    {
      title: '持仓量变化',
      dataIndex: 'oi_chg',
      key: 'oi_chg',
      align: 'right',
      width: 120,
      render: (v: number) => {
        if (v === null || v === undefined) return '-';
        const color = v >= 0 ? '#f5222d' : '#52c41a';
        return <span style={{ color }}>{formatNumberLocale(v)}</span>;
      },
    },
  ];

  return (
    <>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <BaseInput
          placeholder="合约代码（如：CU1811.SHF）"
          value={query.ts_code || ''}
          onChange={(e) => setQuery({ ...query, ts_code: e.target.value || undefined })}
          style={{ width: 200 }}
          allowClear
        />
        <BaseSelect
          placeholder="选择频率"
          allowClear
          value={query.freq || undefined}
          onChange={(value) => setQuery({ ...query, freq: value || undefined })}
          style={{ width: 120 }}
        >
          {FREQ_OPTIONS.map((opt) => (
            <Option key={opt.value} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </BaseSelect>
        <BaseSelect
          placeholder="选择交易所"
          allowClear
          value={query.exchange || undefined}
          onChange={(value) => setQuery({ ...query, exchange: value || undefined })}
          style={{ width: 180 }}
        >
          {EXCHANGE_OPTIONS.map((opt) => (
            <Option key={opt.value} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </BaseSelect>
        <DayjsDatePicker
          format="YYYY-MM-DD"
          placeholder="选择交易日期"
          value={query.trade_date ? dayjs(query.trade_date) : null}
          onChange={(date) => setQuery({ ...query, trade_date: date ? Dates.format(date, 'YYYY-MM-DD') : undefined })}
          style={{ width: 200 }}
        />
        <DayjsDatePicker.RangePicker
          format="YYYY-MM-DD"
          placeholder={['开始日期', '结束日期']}
          value={
            query.start_date && query.end_date ? [dayjs(query.start_date), dayjs(query.end_date)] : null
          }
          onChange={(dates) => {
            setQuery({
              ...query,
              start_date: dates?.[0] ? Dates.format(dates[0], 'YYYY-MM-DD') : undefined,
              end_date: dates?.[1] ? Dates.format(dates[1], 'YYYY-MM-DD') : undefined,
            });
          }}
          style={{ width: 300 }}
        />
        <BaseButton onClick={() => fetchData(1, pagination.pageSize)}>查询</BaseButton>
        <BaseButton
          onClick={() => {
            setQuery({
              ts_code: undefined,
              trade_date: undefined,
              freq: undefined,
              exchange: undefined,
              start_date: undefined,
              end_date: undefined,
            });
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
            openSync('fut_weekly_monthly', {
              ts_code: query.ts_code,
              exchange: query.exchange,
              freq: query.freq,
              start_date: query.start_date,
              end_date: query.end_date,
            });
          }}
        >
          同步数据
        </BaseButton>
      </BaseSpace>

      <BaseModal
        title="期货周/月线行情数据同步"
        open={syncOpen}
        onCancel={() => setSyncOpen(false)}
        confirmLoading={syncLoading}
        onOk={handleSync}
      >
        <BaseForm layout="vertical">
          <BaseForm.Item label="合约代码">
            <BaseInput
              placeholder="如：CU1811.SHF"
              value={syncPayload.ts_code || ''}
              onChange={(e) => setSyncPayload({ ...syncPayload, ts_code: e.target.value || undefined })}
              allowClear
            />
          </BaseForm.Item>
          <BaseForm.Item label="频率">
            <BaseSelect
              placeholder="选择频率"
              allowClear
              value={syncPayload.freq || undefined}
              onChange={(value) => setSyncPayload({ ...syncPayload, freq: value || undefined })}
            >
              {FREQ_OPTIONS.filter((opt) => opt.value).map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </BaseSelect>
          </BaseForm.Item>
          <BaseForm.Item label="交易所">
            <BaseSelect
              placeholder="选择交易所"
              allowClear
              value={syncPayload.exchange || undefined}
              onChange={(value) => setSyncPayload({ ...syncPayload, exchange: value || undefined })}
            >
              {EXCHANGE_OPTIONS.filter((opt) => opt.value).map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </BaseSelect>
          </BaseForm.Item>
          <BaseForm.Item label="日期范围">
            <DayjsDatePicker.RangePicker
              format="YYYY-MM-DD"
              value={
                syncPayload.start_date && syncPayload.end_date
                  ? [dayjs(syncPayload.start_date), dayjs(syncPayload.end_date)]
                  : null
              }
              onChange={(dates) => {
                setSyncPayload({
                  ...syncPayload,
                  start_date: dates?.[0] ? Dates.format(dates[0], 'YYYY-MM-DD') : undefined,
                  end_date: dates?.[1] ? Dates.format(dates[1], 'YYYY-MM-DD') : undefined,
                });
              }}
              ranges={getDateRanges()}
              style={{ width: '100%' }}
            />
          </BaseForm.Item>
        </BaseForm>
      </BaseModal>

      <BaseTable
        columns={columns}
        dataSource={rows}
        rowKey={(record) => `${record.ts_code}-${record.trade_date}-${record.freq}`}
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
        scroll={{ x: 1500 }}
      />
    </>
  );
};

