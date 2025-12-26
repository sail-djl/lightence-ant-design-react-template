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
import { OptBasic, getOptBasicList, OptBasicQuery } from '@app/api/option.api';
import { useOptionData } from '../hooks/useOptionData';
import { useOptionSync } from '../hooks/useOptionSync';
import { formatNumber, formatDate, EXCHANGE_OPTIONS, CALL_PUT_OPTIONS } from '../utils';
import dayjs from 'dayjs';

export const OptBasicTab: React.FC = () => {
  const { query, setQuery, rows, loading, pagination, total, fetchData } = useOptionData<OptBasic, OptBasicQuery>({
    fetchFn: async (params) => {
      const res = await getOptBasicList({
        skip: params.skip,
        limit: params.limit,
        ts_code: params.ts_code || undefined,
        exchange: params.exchange || undefined,
        list_date: params.list_date || undefined,
        opt_code: params.opt_code || undefined,
        call_put: params.call_put || undefined,
      });
      return res;
    },
    initialQuery: {
      ts_code: undefined,
      exchange: undefined,
      list_date: undefined,
      opt_code: undefined,
      call_put: undefined,
    },
  });

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync, openSync } = useOptionSync({
    onSuccess: () => fetchData(pagination.current, pagination.pageSize),
  });

  const columns: ColumnsType<OptBasic> = [
    { title: 'TS代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center', width: 180 },
    { title: '交易市场', dataIndex: 'exchange', key: 'exchange', align: 'center', width: 100 },
    { title: '合约名称', dataIndex: 'name', key: 'name', align: 'center', width: 200 },
    { title: '标的合约代码', dataIndex: 'opt_code', key: 'opt_code', align: 'center', width: 150 },
    {
      title: '期权类型',
      dataIndex: 'call_put',
      key: 'call_put',
      align: 'center',
      width: 100,
      render: (v: string) => (v === 'C' ? '认购' : v === 'P' ? '认沽' : '-'),
    },
    { title: '行权方式', dataIndex: 'exercise_type', key: 'exercise_type', align: 'center', width: 100 },
    {
      title: '行权价格',
      dataIndex: 'exercise_price',
      key: 'exercise_price',
      align: 'right',
      width: 120,
      render: (v: number) => formatNumber(v, 4),
    },
    { title: '结算月', dataIndex: 's_month', key: 's_month', align: 'center', width: 100 },
    { title: '上市日期', dataIndex: 'list_date', key: 'list_date', align: 'center', width: 120, render: formatDate },
    { title: '最后交易日期', dataIndex: 'delist_date', key: 'delist_date', align: 'center', width: 120, render: formatDate },
    { title: '到期日', dataIndex: 'maturity_date', key: 'maturity_date', align: 'center', width: 120, render: formatDate },
    {
      title: '挂牌基准价',
      dataIndex: 'list_price',
      key: 'list_price',
      align: 'right',
      width: 120,
      render: (v: number) => formatNumber(v, 4),
    },
  ];

  return (
    <>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <BaseInput
          placeholder="TS代码（如：M1707-C-2400.DCE）"
          value={query.ts_code || ''}
          onChange={(e) => setQuery({ ...query, ts_code: e.target.value || undefined })}
          style={{ width: 250 }}
          allowClear
        />
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
          placeholder="选择期权类型"
          allowClear
          value={query.call_put || undefined}
          onChange={(value) => setQuery({ ...query, call_put: value || undefined })}
          style={{ width: 150 }}
        >
          {CALL_PUT_OPTIONS.map((opt) => (
            <Option key={opt.value} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </BaseSelect>
        <BaseInput
          placeholder="标的合约代码"
          value={query.opt_code || ''}
          onChange={(e) => setQuery({ ...query, opt_code: e.target.value || undefined })}
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
            setQuery({
              ts_code: undefined,
              exchange: undefined,
              list_date: undefined,
              opt_code: undefined,
              call_put: undefined,
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
            openSync('opt_basic', {
              exchange: query.exchange,
              opt_code: query.opt_code,
              call_put: query.call_put,
              list_date: query.list_date,
            });
          }}
        >
          同步数据
        </BaseButton>
      </BaseSpace>

      <BaseModal
        title="期权合约信息数据同步"
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
          <BaseForm.Item label="标的合约代码">
            <BaseInput
              placeholder="如：OPP2207.DCE"
              value={syncPayload.opt_code || ''}
              onChange={(e) => setSyncPayload({ ...syncPayload, opt_code: e.target.value || undefined })}
              allowClear
            />
          </BaseForm.Item>
          <BaseForm.Item label="期权类型">
            <BaseSelect
              placeholder="选择期权类型"
              allowClear
              value={syncPayload.call_put || undefined}
              onChange={(value) => setSyncPayload({ ...syncPayload, call_put: value || undefined })}
            >
              {CALL_PUT_OPTIONS.filter((opt) => opt.value).map((opt) => (
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
        scroll={{ x: 1500 }}
      />
    </>
  );
};

