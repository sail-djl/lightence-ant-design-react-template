import React from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import { Dates } from '@app/constants/Dates';
import { ColumnsType } from 'antd/es/table';
import { SocialFinancing, getSocialFinancingList, SocialFinancingQuery } from '@app/api/datamarket/macro.api';
import { useMacroData } from '../hooks/useMacroData';
import { useMacroSync } from '../hooks/useMacroSync';
import { formatNumber, formatNumberLocale, getMonthRanges } from '../utils';
import dayjs from 'dayjs';

export const SocialFinancingTab: React.FC = () => {
  const { query, setQuery, rows, loading, pagination, total, fetchData } = useMacroData<SocialFinancing, SocialFinancingQuery>({
    fetchFn: async (params) => {
      const res = await getSocialFinancingList({
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

  const columns: ColumnsType<SocialFinancing> = [
    { title: '月份', dataIndex: 'month', key: 'month', align: 'center', width: 120 },
    { title: '社融增量当月值（亿元）', dataIndex: 'inc_month', key: 'inc_month', align: 'right', render: (v) => formatNumberLocale(v) },
    { title: '社融增量累计值（亿元）', dataIndex: 'inc_cumval', key: 'inc_cumval', align: 'right', render: (v) => formatNumberLocale(v) },
    { title: '社融存量期末值（万亿元）', dataIndex: 'stk_endval', key: 'stk_endval', align: 'right', render: (v) => formatNumber(v, 2) },
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
            openSync('social_financing', {
              start_m: query.start_m,
              end_m: query.end_m,
            });
          }}
        >
          同步数据
        </BaseButton>
      </BaseSpace>

      <BaseModal
        title="社融增量数据同步"
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


