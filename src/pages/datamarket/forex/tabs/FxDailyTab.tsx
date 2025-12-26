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
import { FxDaily, getFxDailyList, FxDailyQuery } from '@app/api/forex.api';
import { useForexData } from '../hooks/useForexData';
import { useForexSync } from '../hooks/useForexSync';
import { formatNumber, formatNumberLocale, formatDate, getDateRanges, EXCHANGE_OPTIONS } from '../utils';
import dayjs from 'dayjs';

export const FxDailyTab: React.FC = () => {
  const { query, setQuery, rows, loading, pagination, total, fetchData } = useForexData<FxDaily, FxDailyQuery>({
    fetchFn: async (params) => {
      const res = await getFxDailyList({
        skip: params.skip,
        limit: params.limit,
        ts_code: params.ts_code || undefined,
        trade_date: params.trade_date || undefined,
        exchange: params.exchange || undefined,
        start_date: params.start_date || undefined,
        end_date: params.end_date || undefined,
      });
      return res;
    },
    initialQuery: {
      ts_code: undefined,
      trade_date: undefined,
      exchange: undefined,
      start_date: undefined,
      end_date: undefined,
    },
  });

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync, openSync } = useForexSync({
    onSuccess: () => fetchData(pagination.current, pagination.pageSize),
  });

  const columns: ColumnsType<FxDaily> = [
    { title: '外汇代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center', width: 180 },
    { title: '交易日期(GMT)', dataIndex: 'trade_date', key: 'trade_date', align: 'center', width: 140, render: formatDate },
    {
      title: '买入开盘价',
      dataIndex: 'bid_open',
      key: 'bid_open',
      align: 'right',
      width: 120,
      render: (v: number) => formatNumber(v, 6),
    },
    {
      title: '买入收盘价',
      dataIndex: 'bid_close',
      key: 'bid_close',
      align: 'right',
      width: 120,
      render: (v: number) => formatNumber(v, 6),
    },
    {
      title: '买入最高价',
      dataIndex: 'bid_high',
      key: 'bid_high',
      align: 'right',
      width: 120,
      render: (v: number) => formatNumber(v, 6),
    },
    {
      title: '买入最低价',
      dataIndex: 'bid_low',
      key: 'bid_low',
      align: 'right',
      width: 120,
      render: (v: number) => formatNumber(v, 6),
    },
    {
      title: '卖出开盘价',
      dataIndex: 'ask_open',
      key: 'ask_open',
      align: 'right',
      width: 120,
      render: (v: number) => formatNumber(v, 6),
    },
    {
      title: '卖出收盘价',
      dataIndex: 'ask_close',
      key: 'ask_close',
      align: 'right',
      width: 120,
      render: (v: number) => formatNumber(v, 6),
    },
    {
      title: '卖出最高价',
      dataIndex: 'ask_high',
      key: 'ask_high',
      align: 'right',
      width: 120,
      render: (v: number) => formatNumber(v, 6),
    },
    {
      title: '卖出最低价',
      dataIndex: 'ask_low',
      key: 'ask_low',
      align: 'right',
      width: 120,
      render: (v: number) => formatNumber(v, 6),
    },
    {
      title: '报价笔数',
      dataIndex: 'tick_qty',
      key: 'tick_qty',
      align: 'right',
      width: 100,
      render: (v: number) => formatNumberLocale(v),
    },
    { title: '交易商', dataIndex: 'exchange', key: 'exchange', align: 'center', width: 100 },
  ];

  return (
    <>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <BaseInput
          placeholder="外汇代码（如：USDCNH.FXCM）"
          value={query.ts_code || ''}
          onChange={(e) => setQuery({ ...query, ts_code: e.target.value || undefined })}
          style={{ width: 250 }}
          allowClear
        />
        <BaseSelect
          placeholder="选择交易商"
          allowClear
          value={query.exchange || undefined}
          onChange={(value) => setQuery({ ...query, exchange: value || undefined })}
          style={{ width: 150 }}
        >
          {EXCHANGE_OPTIONS.map((opt) => (
            <Option key={opt.value} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </BaseSelect>
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
            openSync('fx_daily', {
              ts_code: query.ts_code,
              exchange: query.exchange,
              start_date: query.start_date,
              end_date: query.end_date,
            });
          }}
        >
          同步数据
        </BaseButton>
      </BaseSpace>

      <BaseModal
        title="外汇日线行情数据同步"
        open={syncOpen}
        onCancel={() => setSyncOpen(false)}
        confirmLoading={syncLoading}
        onOk={handleSync}
      >
        <BaseForm layout="vertical">
          <BaseForm.Item label="外汇代码">
            <BaseInput
              placeholder="如：USDCNH.FXCM（不输入为获取全部）"
              value={syncPayload.ts_code || ''}
              onChange={(e) => setSyncPayload({ ...syncPayload, ts_code: e.target.value || undefined })}
              allowClear
            />
          </BaseForm.Item>
          <BaseForm.Item label="交易商">
            <BaseSelect
              placeholder="选择交易商"
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

