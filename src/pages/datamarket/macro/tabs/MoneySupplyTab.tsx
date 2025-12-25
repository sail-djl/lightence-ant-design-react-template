import React from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import { Dates } from '@app/constants/Dates';
import { ColumnsType } from 'antd/es/table';
import { MoneySupply, getMoneySupplyList, MoneySupplyQuery } from '@app/api/macro.api';
import { useMacroData } from '../hooks/useMacroData';
import { useMacroSync } from '../hooks/useMacroSync';
import { formatNumber, formatNumberLocale, getMonthRanges } from '../utils';
import dayjs from 'dayjs';

export const MoneySupplyTab: React.FC = () => {
  const { query, setQuery, rows, loading, pagination, total, fetchData } = useMacroData<MoneySupply, MoneySupplyQuery>({
    fetchFn: async (params) => {
      const res = await getMoneySupplyList({
        skip: params.skip,
        limit: params.limit,
        month: params.month,
        start_m: params.start_m,
        end_m: params.end_m,
      });
      return res;
    },
    initialQuery: { month: undefined, start_m: undefined, end_m: undefined },
  });

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync, openSync } = useMacroSync({
    onSuccess: () => fetchData(pagination.current, pagination.pageSize),
  });

  const columns: ColumnsType<MoneySupply> = [
    { title: '月份', dataIndex: 'month', key: 'month', align: 'center', width: 120 },
    { title: 'M0（亿元）', dataIndex: 'm0', key: 'm0', align: 'right', render: (v) => formatNumberLocale(v) },
    { title: 'M0同比（%）', dataIndex: 'm0_yoy', key: 'm0_yoy', align: 'right', render: (v) => formatNumber(v, 2) },
    { title: 'M1（亿元）', dataIndex: 'm1', key: 'm1', align: 'right', render: (v) => formatNumberLocale(v) },
    { title: 'M1同比（%）', dataIndex: 'm1_yoy', key: 'm1_yoy', align: 'right', render: (v) => formatNumber(v, 2) },
    { title: 'M2（亿元）', dataIndex: 'm2', key: 'm2', align: 'right', render: (v) => formatNumberLocale(v) },
    { title: 'M2同比（%）', dataIndex: 'm2_yoy', key: 'm2_yoy', align: 'right', render: (v) => formatNumber(v, 2) },
  ];

  return (
    <>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <DayjsDatePicker
          picker="month"
          format="YYYY-MM"
          placeholder="选择月份"
          value={query.month ? dayjs(query.month, 'YYYYMM') : null}
          onChange={(date) => setQuery({ ...query, month: date ? Dates.format(date, 'YYYYMM') : undefined })}
          style={{ width: 200 }}
        />
        <DayjsDatePicker.RangePicker
          picker="month"
          format="YYYY-MM"
          placeholder={['开始月份', '结束月份']}
          value={
            query.start_m && query.end_m
              ? [dayjs(query.start_m, 'YYYYMM'), dayjs(query.end_m, 'YYYYMM')]
              : null
          }
          onChange={(dates) => {
            setQuery({
              ...query,
              start_m: dates?.[0] ? Dates.format(dates[0], 'YYYYMM') : undefined,
              end_m: dates?.[1] ? Dates.format(dates[1], 'YYYYMM') : undefined,
            });
          }}
          style={{ width: 300 }}
        />
        <BaseButton onClick={() => fetchData(1, pagination.pageSize)}>查询</BaseButton>
        <BaseButton
          onClick={() => {
            setQuery({ month: undefined, start_m: undefined, end_m: undefined });
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
            openSync('money_supply', {
              start_m: query.start_m,
              end_m: query.end_m,
            });
          }}
        >
          同步数据
        </BaseButton>
      </BaseSpace>

      <BaseModal
        title="货币供应量数据同步"
        open={syncOpen}
        onCancel={() => setSyncOpen(false)}
        confirmLoading={syncLoading}
        onOk={handleSync}
      >
        <BaseForm layout="vertical">
          <BaseForm.Item label="月份范围">
            <DayjsDatePicker.RangePicker
              picker="month"
              format="YYYY-MM"
              value={
                syncPayload.start_m && syncPayload.end_m
                  ? [dayjs(syncPayload.start_m, 'YYYYMM'), dayjs(syncPayload.end_m, 'YYYYMM')]
                  : null
              }
              onChange={(dates) => {
                setSyncPayload({
                  ...syncPayload,
                  start_m: dates?.[0] ? Dates.format(dates[0], 'YYYYMM') : undefined,
                  end_m: dates?.[1] ? Dates.format(dates[1], 'YYYYMM') : undefined,
                });
              }}
              ranges={getMonthRanges()}
              style={{ width: '100%' }}
            />
          </BaseForm.Item>
        </BaseForm>
      </BaseModal>

      <BaseTable
        columns={columns}
        dataSource={rows}
        rowKey="month"
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
          const size = pageConfig.pageSize || 20;
          fetchData(current, size);
        }}
      />
    </>
  );
};


