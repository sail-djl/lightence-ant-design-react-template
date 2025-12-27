import React, { useState, useCallback, useEffect } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { ColumnsType } from 'antd/es/table';
import { StockBasic, getStockBasicList, syncStockBasic, StockBasicSyncPayload } from '@app/api/stock.api';
import { useStockData } from '../hooks/useStockData';
import { useStockSync } from '../hooks/useStockSync';
import { trim } from '../utils';

// 股票基础信息
export const StockBasicTab: React.FC = () => {
  // 查询区域的股票选项列表
  const [stockOptions, setStockOptions] = useState<StockBasic[]>([]);
  const [stockOptionsLoading, setStockOptionsLoading] = useState(false);

  // 加载查询区域的股票选项列表（支持关键词搜索）
  const fetchStockOptions = useCallback(async (keyword?: string) => {
    setStockOptionsLoading(true);
    try {
      const res = await getStockBasicList({
        skip: 0,
        limit: 500,
        keyword: keyword || undefined,
      });
      setStockOptions(res.data);
    } finally {
      setStockOptionsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStockOptions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { query, setQuery, rows, loading, pagination, total, fetchData } = useStockData<
    StockBasic,
    { ts_code: string[]; market?: string; exchange?: string; list_status?: string; keyword?: string }
  >({
    fetchFn: async (params) => {
      const res = await getStockBasicList({
        skip: params.skip,
        limit: params.limit,
        ts_code: params.ts_code.length > 0 ? params.ts_code.join(',') : undefined,
        market: params.market,
        exchange: params.exchange,
        list_status: params.list_status,
        keyword: trim(params.keyword) || undefined,
      });
      return res;
    },
    initialQuery: { ts_code: [], market: undefined, exchange: undefined, list_status: 'L', keyword: undefined },
  });

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync } = useStockSync<
    StockBasicSyncPayload
  >({
    syncFn: syncStockBasic,
    onSuccess: () => fetchData(pagination.current, pagination.pageSize),
  });

  const columns: ColumnsType<StockBasic> = [
    { title: 'TS代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center' },
    { title: '股票代码', dataIndex: 'symbol', key: 'symbol', align: 'center' },
    { title: '股票名称', dataIndex: 'name', key: 'name', align: 'center' },
    { title: '地域', dataIndex: 'area', key: 'area', align: 'center' },
    { title: '所属行业', dataIndex: 'industry', key: 'industry', align: 'center' },
    { title: '市场类型', dataIndex: 'market', key: 'market', align: 'center' },
    { title: '交易所', dataIndex: 'exchange', key: 'exchange', align: 'center', render: (v: string) => {
      const exchangeMap: Record<string, string> = {
        'SSE': '上交所',
        'SZSE': '深交所',
        'BSE': '北交所',
      };
      return exchangeMap[v] || v || '-';
    }},
    { title: '上市日期', dataIndex: 'list_date', key: 'list_date', align: 'center', render: (v: string) => {
      if (!v) return '-';
      return `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`;
    }},
    { title: '是否沪深港通', dataIndex: 'is_hs', key: 'is_hs', align: 'center', render: (v: string) => {
      const hsMap: Record<string, string> = {
        'H': '沪股通',
        'S': '深股通',
        'N': '否',
      };
      return hsMap[v] || '-';
    }},
  ];

  return (
    <>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <BaseInput
          placeholder="股票代码/名称"
          allowClear
          value={query.keyword}
          onChange={(e) => setQuery((prev) => ({ ...prev, keyword: trim(e.target.value) }))}
          style={{ width: 200 }}
          onPressEnter={() => fetchData(1, pagination.pageSize)}
        />
        <BaseSelect
          mode="multiple"
          placeholder="选择股票代码"
          allowClear
          value={query.ts_code}
          onChange={(val) => setQuery((prev) => ({ ...prev, ts_code: val as string[] }))}
          style={{ width: 300 }}
          maxTagCount="responsive"
          showSearch
          loading={stockOptionsLoading}
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
          placeholder="市场类别"
          allowClear
          value={query.market}
          onChange={(val) => {
            const newMarket = val as string | undefined;
            setQuery((prev) => ({ ...prev, market: newMarket }));
            fetchData(1, pagination.pageSize, {
              ...query,
              market: newMarket,
            });
          }}
          options={[
            { value: '主板', label: '主板' },
            { value: '创业板', label: '创业板' },
            { value: '科创板', label: '科创板' },
            { value: 'CDR', label: 'CDR' },
            { value: '北交所', label: '北交所' },
          ]}
          style={{ width: 150 }}
        />
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
        <BaseSelect
          placeholder="上市状态"
          value={query.list_status}
          onChange={(val) => {
            const newStatus = val as string | undefined;
            setQuery((prev) => ({ ...prev, list_status: newStatus }));
            fetchData(1, pagination.pageSize, {
              ...query,
              list_status: newStatus,
            });
          }}
          options={[
            { value: 'L', label: '上市' },
            { value: 'D', label: '退市' },
            { value: 'P', label: '暂停上市' },
          ]}
          style={{ width: 150 }}
        />
        <BaseButton onClick={() => fetchData(1, pagination.pageSize)}>查询</BaseButton>
        <BaseButton
          onClick={() => {
            setQuery({ ts_code: [], market: undefined, exchange: undefined, list_status: 'L', keyword: undefined });
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
              keyword: query.keyword,
              market: query.market,
              exchange: query.exchange,
              list_status: query.list_status,
            });
            setSyncOpen(true);
          }}
        >
          同步数据
        </BaseButton>
      </BaseSpace>

      <BaseModal
        title="股票基础信息同步"
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
              placeholder="输入股票代码或名称"
            />
          </BaseForm.Item>
          <BaseForm.Item label="市场类别（可选）">
            <BaseSelect
              value={syncPayload.market}
              onChange={(val) => setSyncPayload({ ...syncPayload, market: val as string | undefined })}
              allowClear
              options={[
                { value: '主板', label: '主板' },
                { value: '创业板', label: '创业板' },
                { value: '科创板', label: '科创板' },
                { value: 'CDR', label: 'CDR' },
                { value: '北交所', label: '北交所' },
              ]}
            />
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

