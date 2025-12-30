import React, { useEffect, useState, useMemo } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { notificationController } from '@app/controllers/notificationController';
import { ColumnsType } from 'antd/es/table';
import { IndexMember, getIndexMemberList, syncIndexMember, IndexMemberSyncPayload, getIndexClassifyList, IndexClassify } from '@app/api/datamarket/index.api';
import { useIndexData } from '../hooks/useIndexData';
import { useIndexSync } from '../hooks/useIndexSync';
import { trim } from '../utils';

export const IndexMemberTab: React.FC = () => {
  // 行业代码选项（一次性加载）
  const [l1Options, setL1Options] = useState<IndexClassify[]>([]);
  const [l2Options, setL2Options] = useState<IndexClassify[]>([]);
  const [l3Options, setL3Options] = useState<IndexClassify[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);

  // 一次性加载所有行业分类数据
  useEffect(() => {
    const loadOptions = async () => {
      setOptionsLoading(true);
      try {
        const [l1Res, l2Res, l3Res] = await Promise.all([
          getIndexClassifyList({ level: 'L1', src: 'SW2021' }),
          getIndexClassifyList({ level: 'L2', src: 'SW2021' }),
          getIndexClassifyList({ level: 'L3', src: 'SW2021' }),
        ]);
        setL1Options(l1Res.data);
        setL2Options(l2Res.data);
        setL3Options(l3Res.data);
      } catch (e) {
        // 忽略错误
      } finally {
        setOptionsLoading(false);
      }
    };
    loadOptions();
  }, []);

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

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync } = useIndexSync<
    IndexMemberSyncPayload
  >({
    syncFn: syncIndexMember,
    onSuccess: () => fetchData(pagination.current, pagination.pageSize),
  });

  // 根据选择的上级行业过滤下级行业选项
  const filteredL2Options = useMemo(() => {
    if (!query.l1_code) {
      return l2Options;
    }
    const selectedL1 = l1Options.find(item => item.index_code === query.l1_code);
    if (!selectedL1?.industry_code) {
      return l2Options;
    }
    return l2Options.filter(item => item.parent_code === selectedL1.industry_code);
  }, [l2Options, l1Options, query.l1_code]);

  const filteredL3Options = useMemo(() => {
    if (!query.l2_code) {
      return l3Options;
    }
    const selectedL2 = l2Options.find(item => item.index_code === query.l2_code);
    if (!selectedL2?.industry_code) {
      return l3Options;
    }
    return l3Options.filter(item => item.parent_code === selectedL2.industry_code);
  }, [l3Options, l2Options, query.l2_code]);

  // 同步窗口中的过滤选项
  const syncFilteredL2Options = useMemo(() => {
    if (!syncPayload?.l1_code) {
      return l2Options;
    }
    const selectedL1 = l1Options.find(item => item.index_code === syncPayload.l1_code);
    if (!selectedL1?.industry_code) {
      return l2Options;
    }
    return l2Options.filter(item => item.parent_code === selectedL1.industry_code);
  }, [l2Options, l1Options, syncPayload]);

  const syncFilteredL3Options = useMemo(() => {
    if (!syncPayload?.l2_code) {
      return l3Options;
    }
    const selectedL2 = l2Options.find(item => item.index_code === syncPayload.l2_code);
    if (!selectedL2?.industry_code) {
      return l3Options;
    }
    return l3Options.filter(item => item.parent_code === selectedL2.industry_code);
  }, [l3Options, l2Options, syncPayload]);

  useEffect(() => {
    if (query.l1_code || query.l2_code || query.l3_code || query.ts_code) {
      fetchData(1, pagination.pageSize);
    }
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [query.l1_code, query.l2_code, query.l3_code, query.ts_code, query.is_new]);

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
        <BaseSelect
          placeholder="一级行业代码"
          allowClear
          showSearch
          value={query.l1_code || undefined}
          onChange={(val) => {
            setQuery((prev) => ({ 
              ...prev, 
              l1_code: val as string || '',
              l2_code: '', // 清空二级行业
              l3_code: '', // 清空三级行业
            }));
          }}
          loading={optionsLoading}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) ||
            (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
          }
          style={{ width: 200 }}
        >
          {l1Options.map((item) => (
            <Option key={item.index_code} value={item.index_code} label={`${item.index_code} - ${item.industry_name}`}>
              {item.index_code} - {item.industry_name}
            </Option>
          ))}
        </BaseSelect>
        <BaseSelect
          placeholder="二级行业代码"
          allowClear
          showSearch
          value={query.l2_code || undefined}
          onChange={(val) => {
            setQuery((prev) => ({ 
              ...prev, 
              l2_code: val as string || '',
              l3_code: '', // 清空三级行业
            }));
          }}
          loading={optionsLoading}
          disabled={!query.l1_code}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) ||
            (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
          }
          style={{ width: 200 }}
        >
          {filteredL2Options.map((item) => (
            <Option key={item.index_code} value={item.index_code} label={`${item.index_code} - ${item.industry_name}`}>
              {item.index_code} - {item.industry_name}
            </Option>
          ))}
        </BaseSelect>
        <BaseSelect
          placeholder="三级行业代码"
          allowClear
          showSearch
          value={query.l3_code || undefined}
          onChange={(val) => setQuery((prev) => ({ ...prev, l3_code: val as string || '' }))}
          loading={optionsLoading}
          disabled={!query.l2_code}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) ||
            (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
          }
          style={{ width: 200 }}
        >
          {filteredL3Options.map((item) => (
            <Option key={item.index_code} value={item.index_code} label={`${item.index_code} - ${item.industry_name}`}>
              {item.index_code} - {item.industry_name}
            </Option>
          ))}
        </BaseSelect>
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
            <BaseSelect
              placeholder="搜索一级行业代码"
              allowClear
              showSearch
              value={syncPayload.l1_code || undefined}
              onChange={(val) => {
                setSyncPayload({ 
                  ...syncPayload, 
                  l1_code: val as string || undefined,
                  l2_code: undefined, // 清空二级行业
                  l3_code: undefined, // 清空三级行业
                });
              }}
              loading={optionsLoading}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) ||
                (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {l1Options.map((item) => (
                <Option key={item.index_code} value={item.index_code} label={`${item.index_code} - ${item.industry_name}`}>
                  {item.index_code} - {item.industry_name}
                </Option>
              ))}
            </BaseSelect>
          </BaseForm.Item>
          <BaseForm.Item label="二级行业代码（可选）">
            <BaseSelect
              placeholder="搜索二级行业代码"
              allowClear
              showSearch
              value={syncPayload.l2_code || undefined}
              onChange={(val) => {
                setSyncPayload({ 
                  ...syncPayload, 
                  l2_code: val as string || undefined,
                  l3_code: undefined, // 清空三级行业
                });
              }}
              loading={optionsLoading}
              disabled={!syncPayload.l1_code}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) ||
                (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {syncFilteredL2Options.map((item) => (
                <Option key={item.index_code} value={item.index_code} label={`${item.index_code} - ${item.industry_name}`}>
                  {item.index_code} - {item.industry_name}
                </Option>
              ))}
            </BaseSelect>
          </BaseForm.Item>
          <BaseForm.Item label="三级行业代码（可选）">
            <BaseSelect
              placeholder="搜索三级行业代码"
              allowClear
              showSearch
              value={syncPayload.l3_code || undefined}
              onChange={(val) => setSyncPayload({ ...syncPayload, l3_code: val as string || undefined })}
              loading={optionsLoading}
              disabled={!syncPayload.l2_code}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) ||
                (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {syncFilteredL3Options.map((item) => (
                <Option key={item.index_code} value={item.index_code} label={`${item.index_code} - ${item.industry_name}`}>
                  {item.index_code} - {item.industry_name}
                </Option>
              ))}
            </BaseSelect>
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
        scroll={{ y: 'calc(90vh - 350px)', x: 1000 }}
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

