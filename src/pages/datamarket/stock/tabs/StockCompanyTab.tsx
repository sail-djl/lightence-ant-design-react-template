import React from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { ColumnsType } from 'antd/es/table';
import { StockCompany, getStockCompanyList, syncStockCompany, StockCompanySyncPayload } from '@app/api/stock.api';
import { useStockData } from '../hooks/useStockData';
import { useStockSync } from '../hooks/useStockSync';
import { useStockOptions } from '../hooks/useStockOptions';
import { trim, formatNumberLocale } from '../utils';

// 上市公司基本信息
export const StockCompanyTab: React.FC = () => {
  const { stockOptions, stockOptionsLoading, fetchStockOptions } = useStockOptions();

  const { query, setQuery, rows, loading, pagination, total, fetchData } = useStockData<
    StockCompany,
    { ts_code?: string; exchange?: string }
  >({
    fetchFn: async (params) => {
      const res = await getStockCompanyList({
        skip: params.skip,
        limit: params.limit,
        ts_code: params.ts_code,
        exchange: params.exchange,
      });
      return res;
    },
    initialQuery: { ts_code: undefined, exchange: undefined },
  });

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync } = useStockSync<
    StockCompanySyncPayload
  >({
    syncFn: syncStockCompany,
    onSuccess: () => fetchData(pagination.current, pagination.pageSize),
  });

  const columns: ColumnsType<StockCompany> = [
    { title: '股票代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center' },
    { title: '公司全称', dataIndex: 'com_name', key: 'com_name', align: 'center' },
    { title: '法人代表', dataIndex: 'chairman', key: 'chairman', align: 'center', render: (v: string) => v || '-' },
    { title: '总经理', dataIndex: 'manager', key: 'manager', align: 'center', render: (v: string) => v || '-' },
    { title: '董秘', dataIndex: 'secretary', key: 'secretary', align: 'center', render: (v: string) => v || '-' },
    { title: '注册资本(万元)', dataIndex: 'reg_capital', key: 'reg_capital', align: 'right', render: (v: any) => formatNumberLocale(v) },
    { title: '注册日期', dataIndex: 'setup_date', key: 'setup_date', align: 'center', render: (v: string) => {
      if (!v) return '-';
      // 处理 YYYYMMDD 或 YYYY-MM-DD 格式
      if (v.length === 8 && !v.includes('-')) {
        return `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`;
      }
      return v;
    }},
    { title: '所在省份', dataIndex: 'province', key: 'province', align: 'center', render: (v: string) => v || '-' },
    { title: '所在城市', dataIndex: 'city', key: 'city', align: 'center', render: (v: string) => v || '-' },
    { title: '员工人数', dataIndex: 'employees', key: 'employees', align: 'right', render: (v: any) => formatNumberLocale(v) },
  ];

  return (
    <>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <BaseSelect
          placeholder="选择股票代码"
          allowClear
          showSearch
          loading={stockOptionsLoading}
          value={query.ts_code}
          onChange={(val) => setQuery((prev) => ({ ...prev, ts_code: val as string | undefined }))}
          style={{ width: 300 }}
          onSearch={(value) => {
            if (value) {
              fetchStockOptions(value);
            } else {
              fetchStockOptions();
            }
          }}
          filterOption={false}
        >
          {stockOptions.map((item) => (
            <Option key={item.ts_code} value={item.ts_code} label={`${item.ts_code} - ${item.name || ''}`}>
              {item.ts_code} - {item.name || ''}
            </Option>
          ))}
        </BaseSelect>
        <BaseSelect
          placeholder="交易所"
          allowClear
          value={query.exchange}
          onChange={(val) => {
            const newExchange = val as string | undefined;
            setQuery((prev) => ({ ...prev, exchange: newExchange }));
            fetchData(1, pagination.pageSize, {
              ...query,
              exchange: newExchange,
            });
          }}
          options={[
            { value: 'SSE', label: '上交所' },
            { value: 'SZSE', label: '深交所' },
            { value: 'BSE', label: '北交所' },
          ]}
          style={{ width: 150 }}
        />
        <BaseButton onClick={() => fetchData(1, pagination.pageSize)}>查询</BaseButton>
        <BaseButton
          onClick={() => {
            setQuery({ ts_code: undefined, exchange: undefined });
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
            setSyncPayload({ ts_code: query.ts_code, exchange: query.exchange });
            setSyncOpen(true);
          }}
        >
          同步数据
        </BaseButton>
      </BaseSpace>

      <BaseModal
        title="上市公司基本信息同步"
        open={syncOpen}
        onCancel={() => setSyncOpen(false)}
        confirmLoading={syncLoading}
        onOk={() => handleSync()}
      >
        <BaseForm layout="vertical">
          <BaseForm.Item label="股票代码（可选）">
            <BaseSelect
              placeholder="选择股票代码"
              allowClear
              showSearch
              loading={stockOptionsLoading}
              value={syncPayload.ts_code}
              onChange={(val) => setSyncPayload({ ...syncPayload, ts_code: val as string | undefined })}
              onSearch={(value) => {
                if (value) {
                  fetchStockOptions(value);
                } else {
                  fetchStockOptions();
                }
              }}
              filterOption={false}
            >
              {stockOptions.map((item) => (
                <Option key={item.ts_code} value={item.ts_code} label={`${item.ts_code} - ${item.name || ''}`}>
                  {item.ts_code} - {item.name || ''}
                </Option>
              ))}
            </BaseSelect>
          </BaseForm.Item>
          <BaseForm.Item label="交易所（可选）">
            <BaseSelect
              value={syncPayload.exchange}
              onChange={(val) => setSyncPayload({ ...syncPayload, exchange: val as string | undefined })}
              allowClear
              options={[
                { value: 'SSE', label: '上交所' },
                { value: 'SZSE', label: '深交所' },
                { value: 'BSE', label: '北交所' },
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
          const size = pageConfig.pageSize || 15;
          fetchData(current, size);
        }}
      />
    </>
  );
};

