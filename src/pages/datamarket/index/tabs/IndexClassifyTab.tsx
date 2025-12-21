import React from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { ColumnsType } from 'antd/es/table';
import { IndexClassify, getIndexClassifyList, syncIndexClassify, IndexClassifySyncPayload } from '@app/api/index.api';
import { useIndexData } from '../hooks/useIndexData';
import { useIndexSync } from '../hooks/useIndexSync';
import { trim } from '../utils';

export const IndexClassifyTab: React.FC = () => {
  const { query, setQuery, rows, loading, pagination, total, fetchData } = useIndexData<
    IndexClassify,
    { index_code: string; level?: string; parent_code: string; src: string; keyword: string }
  >({
    fetchFn: async (params) => {
      const res = await getIndexClassifyList({
        skip: params.skip,
        limit: params.limit,
        index_code: trim(params.index_code) || undefined,
        level: params.level,
        parent_code: trim(params.parent_code) || undefined,
        src: params.src,
        keyword: trim(params.keyword) || undefined,
      });
      return res;
    },
    initialQuery: { index_code: '', level: undefined, parent_code: '', src: 'SW2021', keyword: '' },
  });

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync } = useIndexSync<
    IndexClassifySyncPayload
  >({
    syncFn: syncIndexClassify,
    onSuccess: () => fetchData(pagination.current, pagination.pageSize),
  });

  const columns: ColumnsType<IndexClassify> = [
    { title: '指数代码', dataIndex: 'index_code', key: 'index_code', align: 'center' },
    { title: '行业名称', dataIndex: 'industry_name', key: 'industry_name', align: 'center' },
    { title: '行业代码', dataIndex: 'industry_code', key: 'industry_code', align: 'center', render: (v: string) => v || '-' },
    { title: '父级代码', dataIndex: 'parent_code', key: 'parent_code', align: 'center', render: (v: string) => v || '-' },
    {
      title: '行业层级',
      dataIndex: 'level',
      key: 'level',
      align: 'center',
      render: (v: string) => {
        if (v === 'L1') return '一级行业';
        if (v === 'L2') return '二级行业';
        if (v === 'L3') return '三级行业';
        return v || '-';
      },
    },
    { title: '是否发布', dataIndex: 'is_pub', key: 'is_pub', align: 'center', render: (v: string) => (v === '1' ? '是' : '否') },
    { title: '版本', dataIndex: 'src', key: 'src', align: 'center', render: (v: string) => v || '-' },
  ];

  return (
    <>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <BaseInput
          placeholder="指数代码"
          allowClear
          value={query.index_code}
          onChange={(e) => setQuery((prev) => ({ ...prev, index_code: trim(e.target.value) }))}
          style={{ width: 150 }}
          onPressEnter={() => fetchData(1, pagination.pageSize)}
        />
        <BaseSelect
          placeholder="行业级别"
          allowClear
          value={query.level}
          onChange={(val) => {
            setQuery((prev) => ({ ...prev, level: val as string | undefined }));
            fetchData(1, pagination.pageSize);
          }}
          options={[
            { value: 'L1', label: '一级行业' },
            { value: 'L2', label: '二级行业' },
            { value: 'L3', label: '三级行业' },
          ]}
          style={{ width: 150 }}
        />
        <BaseInput
          placeholder="父级代码（一级为0）"
          allowClear
          value={query.parent_code}
          onChange={(e) => setQuery((prev) => ({ ...prev, parent_code: trim(e.target.value) }))}
          style={{ width: 150 }}
          onPressEnter={() => fetchData(1, pagination.pageSize)}
        />
        <BaseSelect
          placeholder="版本"
          value={query.src}
          onChange={(val) => {
            setQuery((prev) => ({ ...prev, src: val as string }));
            fetchData(1, pagination.pageSize);
          }}
          options={[
            { value: 'SW2021', label: '2021版本' },
            { value: 'SW2014', label: '2014版本' },
          ]}
          style={{ width: 150 }}
        />
        <BaseInput
          placeholder="关键词（行业名称）"
          allowClear
          value={query.keyword}
          onChange={(e) => setQuery((prev) => ({ ...prev, keyword: trim(e.target.value) }))}
          style={{ width: 200 }}
          onPressEnter={() => fetchData(1, pagination.pageSize)}
        />
        <BaseButton onClick={() => fetchData(1, pagination.pageSize)}>查询</BaseButton>
        <BaseButton
          onClick={() => {
            setQuery({ index_code: '', level: undefined, parent_code: '', src: 'SW2021', keyword: '' });
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
            setSyncPayload({
              index_code: query.index_code || undefined,
              level: query.level,
              parent_code: query.parent_code || undefined,
              src: query.src,
            });
            setSyncOpen(true);
          }}
        >
          同步数据
        </BaseButton>
      </BaseSpace>

      <BaseModal
        title="申万行业分类同步"
        open={syncOpen}
        onCancel={() => setSyncOpen(false)}
        confirmLoading={syncLoading}
        onOk={() => handleSync()}
      >
        <BaseForm layout="vertical">
          <BaseForm.Item label="指数代码（可选）">
            <BaseInput
              value={syncPayload.index_code || ''}
              onChange={(e) => setSyncPayload({ ...syncPayload, index_code: trim(e.target.value) || undefined })}
              placeholder="输入指数代码"
            />
          </BaseForm.Item>
          <BaseForm.Item label="行业级别（可选）">
            <BaseSelect
              value={syncPayload.level}
              onChange={(val) => setSyncPayload({ ...syncPayload, level: val as string | undefined })}
              allowClear
              options={[
                { value: 'L1', label: '一级行业' },
                { value: 'L2', label: '二级行业' },
                { value: 'L3', label: '三级行业' },
              ]}
            />
          </BaseForm.Item>
          <BaseForm.Item label="父级代码（可选）">
            <BaseInput
              value={syncPayload.parent_code || ''}
              onChange={(e) => setSyncPayload({ ...syncPayload, parent_code: trim(e.target.value) || undefined })}
              placeholder="输入父级代码（一级为0）"
            />
          </BaseForm.Item>
          <BaseForm.Item label="版本">
            <BaseSelect
              value={syncPayload.src}
              onChange={(val) => setSyncPayload({ ...syncPayload, src: val as string })}
              options={[
                { value: 'SW2021', label: '2021版本' },
                { value: 'SW2014', label: '2014版本' },
              ]}
            />
          </BaseForm.Item>
        </BaseForm>
      </BaseModal>

      <BaseTable
        columns={columns}
        dataSource={rows}
        rowKey="index_code"
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

