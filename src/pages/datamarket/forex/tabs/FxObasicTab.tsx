import React from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { ColumnsType } from 'antd/es/table';
import { FxObasic, getFxObasicList, FxObasicQuery } from '@app/api/datamarket/forex.api';
import { useForexData } from '../hooks/useForexData';
import { useForexSync } from '../hooks/useForexSync';
import { formatNumber, EXCHANGE_OPTIONS, CLASSIFY_OPTIONS } from '../utils';

export const FxObasicTab: React.FC = () => {
  const { query, setQuery, rows, loading, pagination, total, fetchData } = useForexData<FxObasic, FxObasicQuery>({
    fetchFn: async (params) => {
      const res = await getFxObasicList({
        skip: params.skip,
        limit: params.limit,
        ts_code: params.ts_code || undefined,
        exchange: params.exchange || undefined,
        classify: params.classify || undefined,
      });
      return res;
    },
    initialQuery: { ts_code: undefined, exchange: undefined, classify: undefined },
  });

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync, openSync } = useForexSync({
    onSuccess: () => fetchData(pagination.current, pagination.pageSize),
  });

  const columns: ColumnsType<FxObasic> = [
    { title: '外汇代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center', width: 180 },
    { title: '名称', dataIndex: 'name', key: 'name', align: 'center', width: 200 },
    { title: '分类', dataIndex: 'classify', key: 'classify', align: 'center', width: 150 },
    { title: '交易商', dataIndex: 'exchange', key: 'exchange', align: 'center', width: 100 },
    {
      title: '最小交易单位',
      dataIndex: 'min_unit',
      key: 'min_unit',
      align: 'right',
      width: 140,
      render: (v: number) => formatNumber(v, 4),
    },
    {
      title: '最大交易单位',
      dataIndex: 'max_unit',
      key: 'max_unit',
      align: 'right',
      width: 140,
      render: (v: number) => formatNumber(v, 4),
    },
    {
      title: '点',
      dataIndex: 'pip',
      key: 'pip',
      align: 'right',
      width: 100,
      render: (v: number) => formatNumber(v, 4),
    },
    {
      title: '点值',
      dataIndex: 'pip_cost',
      key: 'pip_cost',
      align: 'right',
      width: 100,
      render: (v: number) => formatNumber(v, 4),
    },
    {
      title: '目标差价',
      dataIndex: 'traget_spread',
      key: 'traget_spread',
      align: 'right',
      width: 120,
      render: (v: number) => formatNumber(v, 4),
    },
    {
      title: '最小止损距离',
      dataIndex: 'min_stop_distance',
      key: 'min_stop_distance',
      align: 'right',
      width: 140,
      render: (v: number) => formatNumber(v, 4),
    },
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
        <BaseSelect
          placeholder="选择分类"
          allowClear
          value={query.classify || undefined}
          onChange={(value) => setQuery({ ...query, classify: value || undefined })}
          style={{ width: 180 }}
        >
          {CLASSIFY_OPTIONS.map((opt) => (
            <Option key={opt.value} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </BaseSelect>
        <BaseButton onClick={() => fetchData(1, pagination.pageSize)}>查询</BaseButton>
        <BaseButton
          onClick={() => {
            setQuery({ ts_code: undefined, exchange: undefined, classify: undefined });
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
            openSync('fx_obasic', {
              ts_code: query.ts_code,
              exchange: query.exchange,
              classify: query.classify,
            });
          }}
        >
          同步数据
        </BaseButton>
      </BaseSpace>

      <BaseModal
        title="外汇基础信息数据同步"
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
          <BaseForm.Item label="分类">
            <BaseSelect
              placeholder="选择分类"
              allowClear
              value={syncPayload.classify || undefined}
              onChange={(value) => setSyncPayload({ ...syncPayload, classify: value || undefined })}
            >
              {CLASSIFY_OPTIONS.filter((opt) => opt.value).map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </BaseSelect>
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

