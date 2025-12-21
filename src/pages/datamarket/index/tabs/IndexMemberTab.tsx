import React, { useEffect } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { notificationController } from '@app/controllers/notificationController';
import { ColumnsType } from 'antd/es/table';
import { IndexMember, getIndexMemberList, syncIndexMember, IndexMemberSyncPayload } from '@app/api/index.api';
import { useIndexData } from '../hooks/useIndexData';
import { useIndexSync } from '../hooks/useIndexSync';
import { trim } from '../utils';

export const IndexMemberTab: React.FC = () => {
  const { query, setQuery, rows, loading, pagination, total, fetchData } = useIndexData<
    IndexMember,
    { l1_code: string; l2_code: string; l3_code: string; ts_code: string; is_new: string }
  >({
    fetchFn: async (params) => {
      const res = await getIndexMemberList({
        skip: params.skip,
        limit: params.limit,
        l1_code: trim(params.l1_code) || undefined,
        l2_code: trim(params.l2_code) || undefined,
        l3_code: trim(params.l3_code) || undefined,
        ts_code: trim(params.ts_code) || undefined,
        is_new: params.is_new,
      });
      return res;
    },
    initialQuery: { l1_code: '', l2_code: '', l3_code: '', ts_code: '', is_new: 'Y' },
    autoFetch: false,
  });

  useEffect(() => {
    if (query.l1_code || query.l2_code || query.l3_code || query.ts_code) {
      fetchData(1, pagination.pageSize);
    }
    // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync } = useIndexSync<
    IndexMemberSyncPayload
  >({
    syncFn: syncIndexMember,
    onSuccess: () => fetchData(pagination.current, pagination.pageSize),
  });

  const columns: ColumnsType<IndexMember> = [
    { title: '一级行业', dataIndex: 'l1_name', key: 'l1_name', align: 'center', render: (v: string) => v || '-' },
    { title: '二级行业', dataIndex: 'l2_name', key: 'l2_name', align: 'center', render: (v: string) => v || '-' },
    { title: '三级行业', dataIndex: 'l3_name', key: 'l3_name', align: 'center', render: (v: string) => v || '-' },
    { title: '股票代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center' },
    { title: '股票名称', dataIndex: 'name', key: 'name', align: 'center', render: (v: string) => v || '-' },
    { title: '纳入日期', dataIndex: 'in_date', key: 'in_date', align: 'center', render: (v: string) => v || '-' },
    { title: '剔除日期', dataIndex: 'out_date', key: 'out_date', align: 'center', render: (v: string) => v || '-' },
  ];

  return (
    <>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <BaseInput
          placeholder="一级行业代码"
          allowClear
          value={query.l1_code}
          onChange={(e) => setQuery((prev) => ({ ...prev, l1_code: trim(e.target.value) }))}
          style={{ width: 150 }}
          onPressEnter={() => fetchData(1, pagination.pageSize)}
        />
        <BaseInput
          placeholder="二级行业代码"
          allowClear
          value={query.l2_code}
          onChange={(e) => setQuery((prev) => ({ ...prev, l2_code: trim(e.target.value) }))}
          style={{ width: 150 }}
          onPressEnter={() => fetchData(1, pagination.pageSize)}
        />
        <BaseInput
          placeholder="三级行业代码"
          allowClear
          value={query.l3_code}
          onChange={(e) => setQuery((prev) => ({ ...prev, l3_code: trim(e.target.value) }))}
          style={{ width: 150 }}
          onPressEnter={() => fetchData(1, pagination.pageSize)}
        />
        <BaseInput
          placeholder="股票代码"
          allowClear
          value={query.ts_code}
          onChange={(e) => setQuery((prev) => ({ ...prev, ts_code: trim(e.target.value) }))}
          style={{ width: 150 }}
          onPressEnter={() => fetchData(1, pagination.pageSize)}
        />
        <BaseSelect
          placeholder="是否最新"
          value={query.is_new}
          onChange={(val) => {
            setQuery((prev) => ({ ...prev, is_new: val as string }));
            fetchData(1, pagination.pageSize);
          }}
          options={[
            { value: 'Y', label: '最新' },
            { value: 'N', label: '历史' },
          ]}
          style={{ width: 120 }}
        />
        <BaseButton onClick={() => fetchData(1, pagination.pageSize)}>查询</BaseButton>
        <BaseButton
          onClick={() => {
            setQuery({ l1_code: '', l2_code: '', l3_code: '', ts_code: '', is_new: 'Y' });
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
              l1_code: query.l1_code || undefined,
              l2_code: query.l2_code || undefined,
              l3_code: query.l3_code || undefined,
              ts_code: query.ts_code || undefined,
              is_new: query.is_new,
            });
            setSyncOpen(true);
          }}
        >
          同步数据
        </BaseButton>
      </BaseSpace>

      <BaseModal
        title="申万行业成分构成同步"
        open={syncOpen}
        onCancel={() => setSyncOpen(false)}
        confirmLoading={syncLoading}
        onOk={() =>
          handleSync(() => {
            if (!syncPayload.l1_code && !syncPayload.l2_code && !syncPayload.l3_code && !syncPayload.ts_code) {
              notificationController.warning({ message: '必须指定 l1_code/l2_code/l3_code/ts_code 之一' });
              return false;
            }
            return true;
          })
        }
      >
        <BaseForm layout="vertical">
          <BaseForm.Item label="一级行业代码（可选）">
            <BaseInput
              value={syncPayload.l1_code || ''}
              onChange={(e) => setSyncPayload({ ...syncPayload, l1_code: trim(e.target.value) || undefined })}
              placeholder="输入一级行业代码"
            />
          </BaseForm.Item>
          <BaseForm.Item label="二级行业代码（可选）">
            <BaseInput
              value={syncPayload.l2_code || ''}
              onChange={(e) => setSyncPayload({ ...syncPayload, l2_code: trim(e.target.value) || undefined })}
              placeholder="输入二级行业代码"
            />
          </BaseForm.Item>
          <BaseForm.Item label="三级行业代码（可选）">
            <BaseInput
              value={syncPayload.l3_code || ''}
              onChange={(e) => setSyncPayload({ ...syncPayload, l3_code: trim(e.target.value) || undefined })}
              placeholder="输入三级行业代码"
            />
          </BaseForm.Item>
          <BaseForm.Item label="股票代码（可选）">
            <BaseInput
              value={syncPayload.ts_code || ''}
              onChange={(e) => setSyncPayload({ ...syncPayload, ts_code: trim(e.target.value) || undefined })}
              placeholder="输入股票代码"
            />
          </BaseForm.Item>
          <BaseForm.Item label="是否最新">
            <BaseSelect
              value={syncPayload.is_new}
              onChange={(val) => setSyncPayload({ ...syncPayload, is_new: val as string })}
              options={[
                { value: 'Y', label: '最新' },
                { value: 'N', label: '历史' },
              ]}
            />
          </BaseForm.Item>
        </BaseForm>
      </BaseModal>

      <BaseTable
        columns={columns}
        dataSource={rows}
        rowKey={(record) => `${record.l3_code}-${record.ts_code}-${record.is_new}`}
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

