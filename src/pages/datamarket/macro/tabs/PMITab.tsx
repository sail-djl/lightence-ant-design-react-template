import React from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import { Dates } from '@app/constants/Dates';
import { ColumnsType } from 'antd/es/table';
import { PMI, getPMIList, PMIQuery } from '@app/api/datamarket/macro.api';
import { useMacroData } from '../hooks/useMacroData';
import { useMacroSync } from '../hooks/useMacroSync';
import { formatNumber, getMonthRanges } from '../utils';
import dayjs from 'dayjs';

export const PMITab: React.FC = () => {
  const { query, setQuery, rows, loading, pagination, total, fetchData } = useMacroData<PMI, PMIQuery>({
    fetchFn: async (params) => {
      const res = await getPMIList({
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

  const columns: ColumnsType<PMI> = [
    { title: '月份', dataIndex: 'month', key: 'month', align: 'center', width: 120 },
    { title: '制造业PMI', dataIndex: 'pmi010000', key: 'pmi010000', align: 'right', render: (v) => formatNumber(v, 2) },
    { title: '大型企业PMI', dataIndex: 'pmi010100', key: 'pmi010100', align: 'right', render: (v) => formatNumber(v, 2) },
    { title: '中型企业PMI', dataIndex: 'pmi010200', key: 'pmi010200', align: 'right', render: (v) => formatNumber(v, 2) },
    { title: '小型企业PMI', dataIndex: 'pmi010300', key: 'pmi010300', align: 'right', render: (v) => formatNumber(v, 2) },
    { title: '生产指数', dataIndex: 'pmi010400', key: 'pmi010400', align: 'right', render: (v) => formatNumber(v, 2) },
    { title: '新订单指数', dataIndex: 'pmi010500', key: 'pmi010500', align: 'right', render: (v) => formatNumber(v, 2) },
    { title: '非制造业PMI', dataIndex: 'pmi020100', key: 'pmi020100', align: 'right', render: (v) => formatNumber(v, 2) },
    { title: '综合PMI', dataIndex: 'pmi030000', key: 'pmi030000', align: 'right', render: (v) => formatNumber(v, 2) },
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
            openSync('pmi', {
              start_m: query.start_m,
              end_m: query.end_m,
            });
          }}
        >
          同步数据
        </BaseButton>
      </BaseSpace>

      <BaseModal
        title="PMI数据同步"
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


