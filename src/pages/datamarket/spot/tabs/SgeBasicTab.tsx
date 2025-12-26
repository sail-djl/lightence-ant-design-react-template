import React from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { ColumnsType } from 'antd/es/table';
import { SgeBasic, getSgeBasicList, SgeBasicQuery } from '@app/api/spot.api';
import { useSpotData } from '../hooks/useSpotData';
import { useSpotSync } from '../hooks/useSpotSync';
import { formatNumber, formatNumberLocale, formatDate } from '../utils';

export const SgeBasicTab: React.FC = () => {
  const { query, setQuery, rows, loading, pagination, total, fetchData } = useSpotData<SgeBasic, SgeBasicQuery>({
    fetchFn: async (params) => {
      const res = await getSgeBasicList({
        skip: params.skip,
        limit: params.limit,
        ts_code: params.ts_code || undefined,
      });
      return res;
    },
    initialQuery: { ts_code: undefined },
  });

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync, openSync } = useSpotSync({
    onSuccess: () => fetchData(pagination.current, pagination.pageSize),
  });

  const columns: ColumnsType<SgeBasic> = [
    { title: '品种代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center', width: 150 },
    { title: '品种名称', dataIndex: 'ts_name', key: 'ts_name', align: 'center', width: 150 },
    { title: '交易类型', dataIndex: 'trade_type', key: 'trade_type', align: 'center', width: 120 },
    {
      title: '交易单位(克/手)',
      dataIndex: 't_unit',
      key: 't_unit',
      align: 'right',
      width: 140,
      render: (v: number) => formatNumber(v, 4),
    },
    {
      title: '报价单位',
      dataIndex: 'p_unit',
      key: 'p_unit',
      align: 'right',
      width: 120,
      render: (v: number) => formatNumber(v, 4),
    },
    {
      title: '最小变动价位',
      dataIndex: 'min_change',
      key: 'min_change',
      align: 'right',
      width: 130,
      render: (v: number) => formatNumber(v, 4),
    },
    {
      title: '价格波动限制',
      dataIndex: 'price_limit',
      key: 'price_limit',
      align: 'right',
      width: 130,
      render: (v: number) => formatNumber(v, 4),
    },
    {
      title: '最小报价量(手)',
      dataIndex: 'min_vol',
      key: 'min_vol',
      align: 'right',
      width: 130,
      render: (v: number) => formatNumberLocale(v),
    },
    {
      title: '最大报价量(手)',
      dataIndex: 'max_vol',
      key: 'max_vol',
      align: 'right',
      width: 130,
      render: (v: number) => formatNumberLocale(v),
    },
    { title: '交易期限', dataIndex: 'trade_mode', key: 'trade_mode', align: 'center', width: 100 },
    {
      title: '保证金比例',
      dataIndex: 'margin_rate',
      key: 'margin_rate',
      align: 'right',
      width: 120,
      render: (v: number) => (v ? `${formatNumber(v, 2)}%` : '-'),
    },
    {
      title: '违约金比例(%)',
      dataIndex: 'liq_rate',
      key: 'liq_rate',
      align: 'right',
      width: 140,
      render: (v: number) => formatNumber(v, 2),
    },
    { title: '上市日期', dataIndex: 'list_date', key: 'list_date', align: 'center', width: 120, render: formatDate },
  ];

  return (
    <>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <BaseInput
          placeholder="品种代码（如：Au99.95, Au99.99）"
          value={query.ts_code || ''}
          onChange={(e) => setQuery({ ...query, ts_code: e.target.value || undefined })}
          style={{ width: 250 }}
          allowClear
        />
        <BaseButton onClick={() => fetchData(1, pagination.pageSize)}>查询</BaseButton>
        <BaseButton
          onClick={() => {
            setQuery({ ts_code: undefined });
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
            openSync('sge_basic', {
              ts_code: query.ts_code,
            });
          }}
        >
          同步数据
        </BaseButton>
      </BaseSpace>

      <BaseModal
        title="黄金现货基础信息数据同步"
        open={syncOpen}
        onCancel={() => setSyncOpen(false)}
        confirmLoading={syncLoading}
        onOk={handleSync}
      >
        <BaseForm layout="vertical">
          <BaseForm.Item label="品种代码">
            <BaseInput
              placeholder="如：Au99.95, Au99.99（多个用逗号分隔，不输入为获取全部）"
              value={syncPayload.ts_code || ''}
              onChange={(e) => setSyncPayload({ ...syncPayload, ts_code: e.target.value || undefined })}
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
        scroll={{ x: 1500 }}
      />
    </>
  );
};

