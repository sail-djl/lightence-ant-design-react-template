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
import { FutBasic, getFutBasicList, FutBasicQuery } from '@app/api/futures.api';
import { useFuturesData } from '../hooks/useFuturesData';
import { useFuturesSync } from '../hooks/useFuturesSync';
import { formatNumber, formatDate, getDateRanges, EXCHANGE_OPTIONS, FUT_TYPE_OPTIONS } from '../utils';
import dayjs from 'dayjs';

export const FutBasicTab: React.FC = () => {
  const { query, setQuery, rows, loading, pagination, total, fetchData } = useFuturesData<FutBasic, FutBasicQuery>({
    fetchFn: async (params) => {
      const res = await getFutBasicList({
        skip: params.skip,
        limit: params.limit,
        exchange: params.exchange || undefined,
        fut_type: params.fut_type || undefined,
        fut_code: params.fut_code || undefined,
        list_date: params.list_date || undefined,
      });
      return res;
    },
    initialQuery: { exchange: undefined, fut_type: undefined, fut_code: undefined, list_date: undefined },
  });

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync, openSync } = useFuturesSync({
    onSuccess: () => fetchData(pagination.current, pagination.pageSize),
  });

  const columns: ColumnsType<FutBasic> = [
    { title: '合约代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center', width: 150 },
    { title: '交易标识', dataIndex: 'symbol', key: 'symbol', align: 'center', width: 120 },
    { title: '交易所', dataIndex: 'exchange', key: 'exchange', align: 'center', width: 100 },
    { title: '中文简称', dataIndex: 'name', key: 'name', align: 'center', width: 150 },
    { title: '产品代码', dataIndex: 'fut_code', key: 'fut_code', align: 'center', width: 100 },
    { title: '上市日期', dataIndex: 'list_date', key: 'list_date', align: 'center', width: 120, render: formatDate },
    {
      title: '最后交易日期',
      dataIndex: 'delist_date',
      key: 'delist_date',
      align: 'center',
      width: 120,
      render: formatDate,
    },
    { title: '交割月份', dataIndex: 'd_month', key: 'd_month', align: 'center', width: 100 },
    {
      title: '交易单位',
      dataIndex: 'trade_unit',
      key: 'trade_unit',
      align: 'center',
      width: 120,
      render: (v: string) => v || '-',
    },
    {
      title: '每手',
      dataIndex: 'per_unit',
      key: 'per_unit',
      align: 'right',
      width: 100,
      render: (v: number) => formatNumber(v, 4),
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
        <BaseSelect
          placeholder="选择合约类型"
          allowClear
          value={query.fut_type || undefined}
          onChange={(value) => setQuery({ ...query, fut_type: value || undefined })}
          style={{ width: 150 }}
        >
          {FUT_TYPE_OPTIONS.map((opt) => (
            <Option key={opt.value} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </BaseSelect>
        <BaseInput
          placeholder="合约产品代码（如：P、CU）"
          value={query.fut_code || ''}
          onChange={(e) => setQuery({ ...query, fut_code: e.target.value || undefined })}
          style={{ width: 200 }}
          allowClear
        />
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
            setQuery({ exchange: undefined, fut_type: undefined, fut_code: undefined, list_date: undefined });
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
            openSync('fut_basic', {
              exchange: query.exchange,
              fut_code: query.fut_code,
            });
          }}
        >
          同步数据
        </BaseButton>
      </BaseSpace>

      <BaseModal
        title="期货合约信息数据同步"
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
          <BaseForm.Item label="合约产品代码">
            <BaseInput
              placeholder="如：P、CU、AG"
              value={syncPayload.fut_code || ''}
              onChange={(e) => setSyncPayload({ ...syncPayload, fut_code: e.target.value || undefined })}
              allowClear
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
        scroll={{ x: 1200 }}
      />
    </>
  );
};

