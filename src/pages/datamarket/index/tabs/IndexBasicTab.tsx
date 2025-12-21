import React from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { ColumnsType } from 'antd/es/table';
import { IndexBasic, getIndexBasicList, syncIndexBasic, IndexBasicSyncPayload } from '@app/api/index.api';
import { useIndexData } from '../hooks/useIndexData';
import { useIndexSync } from '../hooks/useIndexSync';
import { trim } from '../utils';

export const IndexBasicTab: React.FC = () => {
  const { query, setQuery, rows, loading, pagination, total, fetchData } = useIndexData<
    IndexBasic,
    { keyword: string; market?: string; publisher?: string }
  >({
    fetchFn: async (params) => {
      const res = await getIndexBasicList({
        skip: params.skip,
        limit: params.limit,
        keyword: trim(params.keyword) || undefined,
        market: params.market,
        publisher: trim(params.publisher) || undefined,
      });
      return res;
    },
    initialQuery: { keyword: '', market: undefined, publisher: undefined },
  });

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync } = useIndexSync<
    IndexBasicSyncPayload
  >({
    syncFn: syncIndexBasic,
    onSuccess: () => fetchData(pagination.current, pagination.pageSize),
  });

  const columns: ColumnsType<IndexBasic> = [
    { title: '指数代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center' },
    { title: '指数名称', dataIndex: 'name', key: 'name', align: 'center' },
    { title: '全称', dataIndex: 'fullname', key: 'fullname', align: 'center', render: (v: string) => v || '-' },
    { title: '市场', dataIndex: 'market', key: 'market', align: 'center', render: (v: string) => v || '-' },
    { title: '发布机构', dataIndex: 'publisher', key: 'publisher', align: 'center', render: (v: string) => v || '-' },
    { title: '指数类型', dataIndex: 'index_type', key: 'index_type', align: 'center', render: (v: string) => v || '-' },
    { title: '类别', dataIndex: 'category', key: 'category', align: 'center', render: (v: string) => v || '-' },
    { title: '发布日期', dataIndex: 'list_date', key: 'list_date', align: 'center', render: (v: string) => v || '-' },
  ];

  return (
    <>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <BaseInput
          placeholder="关键词（代码/名称）"
          allowClear
          value={query.keyword}
          onChange={(e) => setQuery((prev) => ({ ...prev, keyword: trim(e.target.value) }))}
          style={{ width: 200 }}
          onPressEnter={() => fetchData(1, pagination.pageSize)}
        />
        <BaseSelect
          placeholder="市场"
          allowClear
          value={query.market}
          onChange={(val) => {
            setQuery((prev) => ({ ...prev, market: val as string | undefined }));
            fetchData(1, pagination.pageSize);
          }}
          options={[
            { value: 'MSCI', label: 'MSCI' },
            { value: 'CSI', label: 'CSI' },
            { value: 'SSE', label: 'SSE' },
            { value: 'SZSE', label: 'SZSE' },
          ]}
          style={{ width: 150 }}
        />
        <BaseInput
          placeholder="发布机构"
          allowClear
          value={query.publisher}
          onChange={(e) => setQuery((prev) => ({ ...prev, publisher: trim(e.target.value) }))}
          style={{ width: 200 }}
          onPressEnter={() => fetchData(1, pagination.pageSize)}
        />
        <BaseButton onClick={() => fetchData(1, pagination.pageSize)}>查询</BaseButton>
        <BaseButton
          onClick={() => {
            setQuery({ keyword: '', market: undefined, publisher: undefined });
            fetchData(1, pagination.pageSize);
          }}
        >
          重置
        </BaseButton>
        <BaseButton
          type="primary"
          onClick={() => {
            setSyncPayload({ keyword: query.keyword || undefined, market: query.market });
            setSyncOpen(true);
          }}
        >
          同步数据
        </BaseButton>
      </BaseSpace>

      <BaseModal
        title="指数基础信息同步"
        open={syncOpen}
        onCancel={() => setSyncOpen(false)}
        confirmLoading={syncLoading}
        onOk={() => handleSync()}
      >
        <BaseForm layout="vertical">
          <BaseForm.Item label="关键词（可选）">
            <BaseInput
              value={syncPayload.keyword || ''}
              onChange={(e) => setSyncPayload({ ...syncPayload, keyword: trim(e.target.value) || undefined })}
              placeholder="输入指数代码或名称"
            />
          </BaseForm.Item>
          <BaseForm.Item label="市场（可选）">
            <BaseSelect
              value={syncPayload.market}
              onChange={(val) => setSyncPayload({ ...syncPayload, market: val as string | undefined })}
              allowClear
              options={[
                { value: 'MSCI', label: 'MSCI' },
                { value: 'CSI', label: 'CSI' },
                { value: 'SSE', label: 'SSE' },
                { value: 'SZSE', label: 'SZSE' },
              ]}
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
          const size = pageConfig.pageSize || 10;
          fetchData(current, size);
        }}
      />
    </>
  );
};

