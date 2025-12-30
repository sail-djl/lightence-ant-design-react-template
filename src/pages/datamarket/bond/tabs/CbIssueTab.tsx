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
import { CbIssue, getCbIssueList, CbIssueQuery } from '@app/api/datamarket/bond.api';
import { useBondData } from '../hooks/useBondData';
import { useBondSync } from '../hooks/useBondSync';
import { formatNumber, formatNumberLocale, formatDate, getDateRanges } from '../utils';
import dayjs from 'dayjs';

export const CbIssueTab: React.FC = () => {
  const { query, setQuery, rows, loading, pagination, total, fetchData } = useBondData<CbIssue, CbIssueQuery>({
    fetchFn: async (params) => {
      const res = await getCbIssueList({
        skip: params.skip,
        limit: params.limit,
        ts_code: params.ts_code || undefined,
        ann_date: params.ann_date || undefined,
        start_date: params.start_date || undefined,
        end_date: params.end_date || undefined,
      });
      return res;
    },
    initialQuery: {
      ts_code: undefined,
      ann_date: undefined,
      start_date: undefined,
      end_date: undefined,
    },
  });

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync, openSync } = useBondSync({
    onSuccess: () => fetchData(pagination.current, pagination.pageSize),
  });

  const columns: ColumnsType<CbIssue> = [
    { title: '转债代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center', width: 120 },
    { title: '发行公告日', dataIndex: 'ann_date', key: 'ann_date', align: 'center', width: 120, render: formatDate },
    {
      title: '发行结果公告日',
      dataIndex: 'res_ann_date',
      key: 'res_ann_date',
      align: 'center',
      width: 140,
      render: formatDate,
    },
    {
      title: '计划发行总额(元)',
      dataIndex: 'plan_issue_size',
      key: 'plan_issue_size',
      align: 'right',
      width: 150,
      render: (v: number) => formatNumberLocale(v),
    },
    {
      title: '发行总额(元)',
      dataIndex: 'issue_size',
      key: 'issue_size',
      align: 'right',
      width: 150,
      render: (v: number) => formatNumberLocale(v),
    },
    {
      title: '发行价格',
      dataIndex: 'issue_price',
      key: 'issue_price',
      align: 'right',
      width: 120,
      render: (v: number) => formatNumber(v, 2),
    },
    { title: '发行方式', dataIndex: 'issue_type', key: 'issue_type', align: 'center', width: 120 },
    {
      title: '网上发行总额(张)',
      dataIndex: 'onl_size',
      key: 'onl_size',
      align: 'right',
      width: 150,
      render: (v: number) => formatNumberLocale(v),
    },
    {
      title: '网上中签率(%)',
      dataIndex: 'onl_winning_rate',
      key: 'onl_winning_rate',
      align: 'right',
      width: 130,
      render: (v: number) => (v ? formatNumber(v, 6) : '-'),
    },
    {
      title: '老股东配售数量(张)',
      dataIndex: 'shd_ration_size',
      key: 'shd_ration_size',
      align: 'right',
      width: 160,
      render: (v: number) => formatNumberLocale(v),
    },
    { title: '主承销商', dataIndex: 'lead_underwriter', key: 'lead_underwriter', align: 'center', width: 150 },
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
          placeholder="发行公告日"
          value={query.ann_date ? dayjs(query.ann_date) : null}
          onChange={(date) => setQuery({ ...query, ann_date: date ? Dates.format(date, 'YYYY-MM-DD') : undefined })}
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
              ann_date: undefined,
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
            openSync('cb_issue', {
              ts_code: query.ts_code,
              ann_date: query.ann_date,
              start_date: query.start_date,
              end_date: query.end_date,
            });
          }}
        >
          同步数据
        </BaseButton>
      </BaseSpace>

      <BaseModal
        title="可转债发行数据同步"
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
          <BaseForm.Item label="发行公告日">
            <DayjsDatePicker
              format="YYYY-MM-DD"
              placeholder="发行公告日"
              value={syncPayload.ann_date ? dayjs(syncPayload.ann_date) : null}
              onChange={(date) =>
                setSyncPayload({ ...syncPayload, ann_date: date ? Dates.format(date, 'YYYY-MM-DD') : undefined })
              }
              style={{ width: '100%' }}
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
        rowKey={(record) => `${record.ts_code}-${record.ann_date}`}
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

