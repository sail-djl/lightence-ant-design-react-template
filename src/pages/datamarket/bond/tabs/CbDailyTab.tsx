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
import { CbDaily, getCbDailyList, CbDailyQuery } from '@app/api/datamarket/bond.api';
import { useBondData } from '../hooks/useBondData';
import { useBondSync } from '../hooks/useBondSync';
import { formatNumber, formatNumberLocale, formatDate, getDateRanges } from '../utils';
import dayjs from 'dayjs';

export const CbDailyTab: React.FC = () => {
  const { query, setQuery, rows, loading, pagination, total, fetchData } = useBondData<CbDaily, CbDailyQuery>({
    fetchFn: async (params) => {
      const res = await getCbDailyList({
        skip: params.skip,
        limit: params.limit,
        ts_code: params.ts_code || undefined,
        trade_date: params.trade_date || undefined,
        start_date: params.start_date || undefined,
        end_date: params.end_date || undefined,
      });
      return res;
    },
    initialQuery: {
      ts_code: undefined,
      trade_date: undefined,
      start_date: undefined,
      end_date: undefined,
    },
  });

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync, openSync } = useBondSync({
    onSuccess: () => fetchData(pagination.current, pagination.pageSize),
  });

  const columns: ColumnsType<CbDaily> = [
    { title: '转债代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center', width: 120 },
    { title: '交易日期', dataIndex: 'trade_date', key: 'trade_date', align: 'center', width: 120, render: formatDate },
    {
      title: '昨收盘价(元)',
      dataIndex: 'pre_close',
      key: 'pre_close',
      align: 'right',
      width: 130,
      render: (v: number) => formatNumber(v, 4),
    },
    {
      title: '开盘价(元)',
      dataIndex: 'open',
      key: 'open',
      align: 'right',
      width: 120,
      render: (v: number) => formatNumber(v, 4),
    },
    {
      title: '最高价(元)',
      dataIndex: 'high',
      key: 'high',
      align: 'right',
      width: 120,
      render: (v: number) => formatNumber(v, 4),
    },
    {
      title: '最低价(元)',
      dataIndex: 'low',
      key: 'low',
      align: 'right',
      width: 120,
      render: (v: number) => formatNumber(v, 4),
    },
    {
      title: '收盘价(元)',
      dataIndex: 'close',
      key: 'close',
      align: 'right',
      width: 120,
      render: (v: number) => formatNumber(v, 4),
    },
    {
      title: '涨跌(元)',
      dataIndex: 'change',
      key: 'change',
      align: 'right',
      width: 100,
      render: (v: number) => {
        if (v === null || v === undefined) return '-';
        const color = v >= 0 ? '#f5222d' : '#52c41a';
        return <span style={{ color }}>{formatNumber(v, 4)}</span>;
      },
    },
    {
      title: '涨跌幅(%)',
      dataIndex: 'pct_chg',
      key: 'pct_chg',
      align: 'right',
      width: 100,
      render: (v: number) => {
        if (v === null || v === undefined) return '-';
        const color = v >= 0 ? '#f5222d' : '#52c41a';
        return <span style={{ color }}>{formatNumber(v, 2)}%</span>;
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
      title: '纯债价值',
      dataIndex: 'bond_value',
      key: 'bond_value',
      align: 'right',
      width: 120,
      render: (v: number) => (v ? formatNumber(v, 4) : '-'),
    },
    {
      title: '转股价值',
      dataIndex: 'cb_value',
      key: 'cb_value',
      align: 'right',
      width: 120,
      render: (v: number) => (v ? formatNumber(v, 4) : '-'),
    },
    {
      title: '转股溢价率(%)',
      dataIndex: 'cb_over_rate',
      key: 'cb_over_rate',
      align: 'right',
      width: 140,
      render: (v: number) => (v ? formatNumber(v, 2) : '-'),
    },
  ];

  return (
    <>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <BaseInput
          placeholder="转债代码（如：110030.SH）"
          value={query.ts_code || ''}
          onChange={(e) => setQuery({ ...query, ts_code: e.target.value || undefined })}
          style={{ width: 200 }}
          allowClear
        />
        <DayjsDatePicker
          format="YYYY-MM-DD"
          placeholder="交易日期"
          value={query.trade_date ? dayjs(query.trade_date) : null}
          onChange={(date) => setQuery({ ...query, trade_date: date ? Dates.format(date, 'YYYY-MM-DD') : undefined })}
          style={{ width: 200 }}
        />
        <DayjsDatePicker.RangePicker
          format="YYYY-MM-DD"
          placeholder={['开始日期', '结束日期']}
          value={query.start_date && query.end_date ? [dayjs(query.start_date), dayjs(query.end_date)] : null}
          onChange={(dates) => {
            setQuery({
              ...query,
              start_date: dates?.[0] ? Dates.format(dates[0], 'YYYY-MM-DD') : undefined,
              end_date: dates?.[1] ? Dates.format(dates[1], 'YYYY-MM-DD') : undefined,
            });
          }}
          ranges={getDateRanges()}
          style={{ width: 300 }}
        />
        <BaseButton onClick={() => fetchData(1, pagination.pageSize)}>查询</BaseButton>
        <BaseButton
          onClick={() => {
            setQuery({
              ts_code: undefined,
              trade_date: undefined,
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
            openSync('cb_daily', {
              ts_code: query.ts_code,
              start_date: query.start_date,
              end_date: query.end_date,
            });
          }}
        >
          同步数据
        </BaseButton>
      </BaseSpace>

      <BaseModal
        title="可转债行情数据同步"
        open={syncOpen}
        onCancel={() => setSyncOpen(false)}
        confirmLoading={syncLoading}
        onOk={handleSync}
      >
        <BaseForm layout="vertical">
          <BaseForm.Item label="转债代码">
            <BaseInput
              placeholder="如：110030.SH（不输入为获取全部）"
              value={syncPayload.ts_code || ''}
              onChange={(e) => setSyncPayload({ ...syncPayload, ts_code: e.target.value || undefined })}
              allowClear
            />
          </BaseForm.Item>
          <BaseForm.Item label="开始日期">
            <DayjsDatePicker
              format="YYYY-MM-DD"
              placeholder="开始日期"
              value={syncPayload.start_date ? dayjs(syncPayload.start_date) : null}
              onChange={(date) =>
                setSyncPayload({ ...syncPayload, start_date: date ? Dates.format(date, 'YYYY-MM-DD') : undefined })
              }
              style={{ width: '100%' }}
            />
          </BaseForm.Item>
          <BaseForm.Item label="结束日期">
            <DayjsDatePicker
              format="YYYY-MM-DD"
              placeholder="结束日期"
              value={syncPayload.end_date ? dayjs(syncPayload.end_date) : null}
              onChange={(date) =>
                setSyncPayload({ ...syncPayload, end_date: date ? Dates.format(date, 'YYYY-MM-DD') : undefined })
              }
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
        scroll={{ x: 1800 }}
      />
    </>
  );
};

