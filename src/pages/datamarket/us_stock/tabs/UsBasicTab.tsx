import React from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { ColumnsType } from 'antd/es/table';
import { UsBasic, getUsBasicList, UsBasicQuery } from '@app/api/datamarket/us_stock.api';
import { useUsStockData } from '../hooks/useUsStockData';
import { useUsStockSync } from '../hooks/useUsStockSync';
import { formatDate, CLASSIFY_OPTIONS } from '../utils';

export const UsBasicTab: React.FC = () => {
  const { query, setQuery, rows, loading, pagination, total, fetchData } = useUsStockData<UsBasic, UsBasicQuery>({
    fetchFn: async (params) => {
      const res = await getUsBasicList({
        skip: params.skip,
        limit: params.limit,
        ts_code: params.ts_code || undefined,
        classify: params.classify || undefined,
      });
      return res;
    },
    initialQuery: { ts_code: undefined, classify: undefined },
  });

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync, openSync } = useUsStockSync({
    onSuccess: () => fetchData(pagination.current, pagination.pageSize),
  });

  const columns: ColumnsType<UsBasic> = [
    { title: '美股代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center', width: 120 },
    { title: '中文名称', dataIndex: 'name', key: 'name', align: 'center', width: 200 },
    { title: '英文名称', dataIndex: 'enname', key: 'enname', align: 'left', width: 300 },
    {
      title: '分类',
      dataIndex: 'classify',
      key: 'classify',
      align: 'center',
      width: 100,
      render: (v: string) => {
        const map: Record<string, string> = { ADR: 'ADR', GDR: 'GDR', EQ: 'EQ' };
        return map[v] || v;
      },
    },
    { title: '上市日期', dataIndex: 'list_date', key: 'list_date', align: 'center', width: 120, render: formatDate },
    { title: '退市日期', dataIndex: 'delist_date', key: 'delist_date', align: 'center', width: 120, render: formatDate },
  ];

  return (
    <>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <BaseInput
          placeholder="股票代码（如：AAPL）"
          value={query.ts_code || ''}
          onChange={(e) => setQuery({ ...query, ts_code: e.target.value || undefined })}
          style={{ width: 200 }}
          allowClear
        />
        <BaseSelect
          placeholder="选择分类"
          allowClear
          value={query.classify || undefined}
          onChange={(value) => setQuery({ ...query, classify: value || undefined })}
          style={{ width: 150 }}
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
            setQuery({ ts_code: undefined, classify: undefined });
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
            openSync('us_basic', {
              ts_code: query.ts_code,
              classify: query.classify,
            });
          }}
        >
          同步数据
        </BaseButton>
      </BaseSpace>

      <BaseModal
        title="美股列表数据同步"
        open={syncOpen}
        onCancel={() => setSyncOpen(false)}
        confirmLoading={syncLoading}
        onOk={handleSync}
      >
        <BaseForm layout="vertical">
          <BaseForm.Item label="股票代码">
            <BaseInput
              placeholder="如：AAPL（不输入为获取全部）"
              value={syncPayload.ts_code || ''}
              onChange={(e) => setSyncPayload({ ...syncPayload, ts_code: e.target.value || undefined })}
              allowClear
            />
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
        scroll={{ x: 1200 }}
      />
    </>
  );
};

