import React from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import { Dates } from '@app/constants/Dates';
import { ColumnsType } from 'antd/es/table';
import { USTreasuryYieldCurve, getUSTreasuryYieldCurveList, USTreasuryYieldCurveQuery } from '@app/api/datamarket/macro.api';
import { useMacroData } from '../hooks/useMacroData';
import { useMacroSync } from '../hooks/useMacroSync';
import { formatNumber, getDateRanges } from '../utils';
import dayjs from 'dayjs';

export const USTreasuryYieldCurveTab: React.FC = () => {
  const { query, setQuery, rows, loading, pagination, total, fetchData } = useMacroData<USTreasuryYieldCurve, USTreasuryYieldCurveQuery>({
    fetchFn: async (params) => {
      const res = await getUSTreasuryYieldCurveList({
        skip: params.skip,
        limit: params.limit,
        date: params.date,
        start_date: params.start_date,
        end_date: params.end_date,
      });
      return res;
    },
    initialQuery: { date: undefined, start_date: undefined, end_date: undefined },
  });

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync, openSync } = useMacroSync({
    onSuccess: () => fetchData(pagination.current, pagination.pageSize),
  });

  const columns: ColumnsType<USTreasuryYieldCurve> = [
    { title: '日期', dataIndex: 'date', key: 'date', align: 'center', width: 120 },
    { title: '1月期（%）', dataIndex: 'm1', key: 'm1', align: 'right', render: (v) => formatNumber(v, 2) },
    { title: '3月期（%）', dataIndex: 'm3', key: 'm3', align: 'right', render: (v) => formatNumber(v, 2) },
    { title: '6月期（%）', dataIndex: 'm6', key: 'm6', align: 'right', render: (v) => formatNumber(v, 2) },
    { title: '1年期（%）', dataIndex: 'y1', key: 'y1', align: 'right', render: (v) => formatNumber(v, 2) },
    { title: '2年期（%）', dataIndex: 'y2', key: 'y2', align: 'right', render: (v) => formatNumber(v, 2) },
    { title: '5年期（%）', dataIndex: 'y5', key: 'y5', align: 'right', render: (v) => formatNumber(v, 2) },
    { title: '10年期（%）', dataIndex: 'y10', key: 'y10', align: 'right', render: (v) => formatNumber(v, 2) },
    { title: '30年期（%）', dataIndex: 'y30', key: 'y30', align: 'right', render: (v) => formatNumber(v, 2) },
  ];

  return (
    <>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <DayjsDatePicker
          format="YYYY-MM-DD"
          placeholder="选择日期"
          value={query.date ? dayjs(query.date) : null}
          onChange={(date) => setQuery({ ...query, date: date ? Dates.format(date, 'YYYY-MM-DD') : undefined })}
          style={{ width: 200 }}
        />
        <DayjsDatePicker.RangePicker
          format="YYYY-MM-DD"
          placeholder={['开始日期', '结束日期']}
          value={
            query.start_date && query.end_date
              ? [dayjs(query.start_date), dayjs(query.end_date)]
              : null
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
            setQuery({ date: undefined, start_date: undefined, end_date: undefined });
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
            openSync('us_treasury_yield_curve', {
              start_date: query.start_date,
              end_date: query.end_date,
            });
          }}
        >
          同步数据
        </BaseButton>
      </BaseSpace>

      <BaseModal
        title="美国国债收益率曲线同步"
        open={syncOpen}
        onCancel={() => setSyncOpen(false)}
        confirmLoading={syncLoading}
        onOk={handleSync}
      >
        <BaseForm layout="vertical">
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
        rowKey="date"
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


