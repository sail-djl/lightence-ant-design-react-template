import React from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import { Dates } from '@app/constants/Dates';
import { ColumnsType } from 'antd/es/table';
import { TradeCal, getTradeCalList, TradeCalQuery } from '@app/api/futures.api';
import { useFuturesData } from '../hooks/useFuturesData';
import { useFuturesSync } from '../hooks/useFuturesSync';
import { formatDate, getDateRanges, EXCHANGE_OPTIONS, IS_OPEN_OPTIONS } from '../utils';
import dayjs from 'dayjs';

export const TradeCalTab: React.FC = () => {
  const { query, setQuery, rows, loading, pagination, total, fetchData } = useFuturesData<TradeCal, TradeCalQuery>({
    fetchFn: async (params) => {
      const res = await getTradeCalList({
        skip: params.skip,
        limit: params.limit,
        exchange: params.exchange || undefined,
        cal_date: params.cal_date || undefined,
        start_date: params.start_date || undefined,
        end_date: params.end_date || undefined,
        is_open: params.is_open !== undefined ? Number(params.is_open) : undefined,
      });
      return res;
    },
    initialQuery: {
      exchange: undefined,
      cal_date: undefined,
      start_date: undefined,
      end_date: undefined,
      is_open: undefined,
    },
  });

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync, openSync } = useFuturesSync({
    onSuccess: () => fetchData(pagination.current, pagination.pageSize),
  });

  const columns: ColumnsType<TradeCal> = [
    { title: '交易所', dataIndex: 'exchange', key: 'exchange', align: 'center', width: 120 },
    { title: '日历日期', dataIndex: 'cal_date', key: 'cal_date', align: 'center', width: 120, render: formatDate },
    {
      title: '是否交易',
      dataIndex: 'is_open',
      key: 'is_open',
      align: 'center',
      width: 100,
      render: (v: number) => (v === 1 ? <span style={{ color: '#52c41a' }}>交易</span> : <span style={{ color: '#999' }}>休市</span>),
    },
    {
      title: '上一个交易日',
      dataIndex: 'pretrade_date',
      key: 'pretrade_date',
      align: 'center',
      width: 120,
      render: formatDate,
    },
  ];

  return (
    <>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem', flexWrap: 'wrap' }}>
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
          placeholder="选择日期"
          value={query.cal_date ? dayjs(query.cal_date) : null}
          onChange={(date) => setQuery({ ...query, cal_date: date ? Dates.format(date, 'YYYY-MM-DD') : undefined })}
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
        <BaseSelect
          placeholder="是否交易"
          allowClear
          value={query.is_open !== undefined ? String(query.is_open) : undefined}
          onChange={(value) => setQuery({ ...query, is_open: value ? Number(value) : undefined })}
          style={{ width: 120 }}
        >
          {IS_OPEN_OPTIONS.map((opt) => (
            <Option key={opt.value} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </BaseSelect>
        <BaseButton onClick={() => fetchData(1, pagination.pageSize)}>查询</BaseButton>
        <BaseButton
          onClick={() => {
            setQuery({
              exchange: undefined,
              cal_date: undefined,
              start_date: undefined,
              end_date: undefined,
              is_open: undefined,
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
            openSync('trade_cal', {
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
        title="交易日历数据同步"
        open={syncOpen}
        onCancel={() => setSyncOpen(false)}
        confirmLoading={syncLoading}
        onOk={handleSync}
      >
        <BaseForm layout="vertical">
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
        rowKey={(record) => `${record.exchange}-${record.cal_date}`}
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

