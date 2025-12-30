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
import { CbBasic, getCbBasicList, CbBasicQuery } from '@app/api/datamarket/bond.api';
import { useBondData } from '../hooks/useBondData';
import { useBondSync } from '../hooks/useBondSync';
import { formatNumber, formatNumberLocale, formatDate, EXCHANGE_OPTIONS } from '../utils';
import dayjs from 'dayjs';

export const CbBasicTab: React.FC = () => {
  const { query, setQuery, rows, loading, pagination, total, fetchData } = useBondData<CbBasic, CbBasicQuery>({
    fetchFn: async (params) => {
      const res = await getCbBasicList({
        skip: params.skip,
        limit: params.limit,
        ts_code: params.ts_code || undefined,
        list_date: params.list_date || undefined,
        exchange: params.exchange || undefined,
      });
      return res;
    },
    initialQuery: { ts_code: undefined, list_date: undefined, exchange: undefined },
  });

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync, openSync } = useBondSync({
    onSuccess: () => fetchData(pagination.current, pagination.pageSize),
  });

  const columns: ColumnsType<CbBasic> = [
    { title: '转债代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center', width: 120 },
    { title: '转债简称', dataIndex: 'bond_short_name', key: 'bond_short_name', align: 'center', width: 150 },
    { title: '正股代码', dataIndex: 'stk_code', key: 'stk_code', align: 'center', width: 120 },
    { title: '正股简称', dataIndex: 'stk_short_name', key: 'stk_short_name', align: 'center', width: 150 },
    {
      title: '发行期限(年)',
      dataIndex: 'maturity',
      key: 'maturity',
      align: 'right',
      width: 120,
      render: (v: number) => formatNumber(v, 2),
    },
    {
      title: '面值',
      dataIndex: 'par',
      key: 'par',
      align: 'right',
      width: 100,
      render: (v: number) => formatNumber(v, 2),
    },
    {
      title: '发行价格',
      dataIndex: 'issue_price',
      key: 'issue_price',
      align: 'right',
      width: 120,
      render: (v: number) => formatNumber(v, 2),
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
      title: '票面利率(%)',
      dataIndex: 'coupon_rate',
      key: 'coupon_rate',
      align: 'right',
      width: 120,
      render: (v: number) => (v ? formatNumber(v, 2) : '-'),
    },
    { title: '上市日期', dataIndex: 'list_date', key: 'list_date', align: 'center', width: 120, render: formatDate },
    { title: '到期日期', dataIndex: 'maturity_date', key: 'maturity_date', align: 'center', width: 120, render: formatDate },
    {
      title: '最新转股价',
      dataIndex: 'conv_price',
      key: 'conv_price',
      align: 'right',
      width: 120,
      render: (v: number) => formatNumber(v, 4),
    },
    { title: '上市地点', dataIndex: 'exchange', key: 'exchange', align: 'center', width: 100 },
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
        <BaseSelect
          placeholder="选择上市地点"
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
          placeholder="上市日期"
          value={query.list_date ? dayjs(query.list_date) : null}
          onChange={(date) => setQuery({ ...query, list_date: date ? Dates.format(date, 'YYYY-MM-DD') : undefined })}
          style={{ width: 200 }}
        />
        <BaseButton onClick={() => fetchData(1, pagination.pageSize)}>查询</BaseButton>
        <BaseButton
          onClick={() => {
            setQuery({ ts_code: undefined, list_date: undefined, exchange: undefined });
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
            openSync('cb_basic', {
              ts_code: query.ts_code,
              exchange: query.exchange,
              list_date: query.list_date,
            });
          }}
        >
          同步数据
        </BaseButton>
      </BaseSpace>

      <BaseModal
        title="可转债基本信息数据同步"
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
          <BaseForm.Item label="上市地点">
            <BaseSelect
              placeholder="选择上市地点"
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
          <BaseForm.Item label="上市日期">
            <DayjsDatePicker
              format="YYYY-MM-DD"
              placeholder="上市日期"
              value={syncPayload.list_date ? dayjs(syncPayload.list_date) : null}
              onChange={(date) =>
                setSyncPayload({ ...syncPayload, list_date: date ? Dates.format(date, 'YYYY-MM-DD') : undefined })
              }
              style={{ width: '100%' }}
            />
          </BaseForm.Item>
        </BaseForm>
      </BaseModal>

      <BaseTable
        columns={columns}
        dataSource={rows}
        rowKey="ts_code"
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
        scroll={{ x: 1600 }}
      />
    </>
  );
};

