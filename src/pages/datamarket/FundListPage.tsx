import React, { useCallback, useEffect, useState } from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseAutoComplete } from '@app/components/common/BaseAutoComplete/BaseAutoComplete';
import { ColumnsType } from 'antd/es/table';
import { FundBasic, getFundBasicList } from '@app/api/fund.api';
import { useDispatch, useSelector } from 'react-redux';
import { addEntry } from '@app/store/slices/searchHistorySlice';

const initialPagination = { current: 1, pageSize: 10 };

const statusText = (v?: 'D' | 'I' | 'L') => {
  if (v === 'L') return '上市中';
  if (v === 'I') return '发行';
  if (v === 'D') return '摘牌';
  return '-';
};

const marketText = (v?: 'E' | 'O') => {
  if (v === 'E') return '场内';
  if (v === 'O') return '场外';
  return '-';
};

const FundListPage: React.FC = () => {
  const initialQuery = {
    keyword: '',
    market: undefined as 'E' | 'O' | undefined,
    status: 'L' as 'D' | 'I' | 'L' | undefined,
    fund_type: undefined as string | undefined,
    management: undefined as string | undefined,
  };

  const [query, setQuery] = useState(initialQuery);
  const [rows, setRows] = useState<FundBasic[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);
  const [total, setTotal] = useState(0);

  const dispatch = useDispatch();
  const keywordHistory = useSelector((state: any) => state.searchHistory?.pages?.fundList?.keyword || []);
  const typeHistory = useSelector((state: any) => state.searchHistory?.pages?.fundList?.fund_type || []);
  const mgmtHistory = useSelector((state: any) => state.searchHistory?.pages?.fundList?.management || []);
  const [keywordOpen, setKeywordOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [mgmtOpen, setMgmtOpen] = useState(false);

  const fetchFunds = useCallback(
    async (page = 1, pageSize = 10, params?: typeof query) => {
      setLoading(true);
      const q = params || query;
      try {
        const res = await getFundBasicList({
          skip: (page - 1) * pageSize,
          limit: pageSize,
          keyword: q.keyword || undefined,
          market: q.market,
          status: q.status,
          fund_type: q.fund_type,
          management: q.management,
        });
        setRows(res.data);
        setTotal(res.count);
        setPagination({ current: page, pageSize });
      } finally {
        setLoading(false);
      }
    },
    [query],
  );

  useEffect(() => {
    fetchFunds();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReset = () => {
    setQuery(initialQuery);
    fetchFunds(1, pagination.pageSize, initialQuery);
  };

  const columns: ColumnsType<FundBasic> = [
    { title: '代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center' },
    { title: '简称', dataIndex: 'name', key: 'name', align: 'center', render: (v: string) => v || '-' },
    { title: '管理人', dataIndex: 'management', key: 'management', align: 'center', render: (v: string) => v || '-' },
    { title: '市场', dataIndex: 'market', key: 'market', align: 'center', render: (v) => marketText(v) },
    { title: '状态', dataIndex: 'status', key: 'status', align: 'center', render: (v) => statusText(v) },
    { title: '类型', dataIndex: 'fund_type', key: 'fund_type', align: 'center', render: (v: string) => v || '-' },
    {
      title: '管理费',
      dataIndex: 'm_fee',
      key: 'm_fee',
      align: 'center',
      render: (v?: number | string) => (typeof v === 'number' || typeof v === 'string' ? `${v}%` : '-'),
    },
    {
      title: '托管费',
      dataIndex: 'c_fee',
      key: 'c_fee',
      align: 'center',
      render: (v?: number | string) => (typeof v === 'number' || typeof v === 'string' ? `${v}%` : '-'),
    },
    { title: '成立日期', dataIndex: 'found_date', key: 'found_date', align: 'center', render: (v: string) => v || '-' },
    { title: '上市日期', dataIndex: 'list_date', key: 'list_date', align: 'center', render: (v: string) => v || '-' },
  ];

  return (
    <>
      <PageTitle>数据市场 · 基金</PageTitle>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem' }}>
        <BaseAutoComplete
          placeholder="关键词（代码/简称/管理人）"
          allowClear
          value={query.keyword}
          options={keywordHistory.map((v: string) => ({ value: v, label: v }))}
          onChange={(val) => setQuery((prev) => ({ ...prev, keyword: val as string }))}
          onSelect={(val) => setQuery((prev) => ({ ...prev, keyword: val as string }))}
          open={keywordOpen}
          onFocus={() => setKeywordOpen(keywordHistory.length > 0)}
          onBlur={() => setKeywordOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (query.keyword) {
                dispatch(addEntry({ page: 'fundList', field: 'keyword', value: query.keyword }));
              }
              fetchFunds(1, pagination.pageSize);
            }
          }}
          style={{ width: 240 }}
        />
        <BaseSelect
          placeholder="市场"
          allowClear
          value={query.market}
          onChange={(val) => {
            const market = val as 'E' | 'O' | undefined;
            const nextQuery = { ...query, market };
            setQuery(nextQuery);
            fetchFunds(1, pagination.pageSize, nextQuery);
          }}
          options={[
            { value: 'E', label: '场内(E)' },
            { value: 'O', label: '场外(O)' },
          ]}
          style={{ width: 160 }}
        />
        <BaseSelect
          placeholder="状态"
          allowClear
          value={query.status}
          onChange={(val) => {
            const status = val as 'D' | 'I' | 'L' | undefined;
            const nextQuery = { ...query, status };
            setQuery(nextQuery);
            fetchFunds(1, pagination.pageSize, nextQuery);
          }}
          options={[
            { value: 'L', label: '上市中(L)' },
            { value: 'I', label: '发行(I)' },
            { value: 'D', label: '摘牌(D)' },
          ]}
          style={{ width: 160 }}
        />
        <BaseAutoComplete
          placeholder="类型（股票型/混合型等）"
          allowClear
          value={query.fund_type}
          options={typeHistory.map((v: string) => ({ value: v, label: v }))}
          onChange={(val) => setQuery((prev) => ({ ...prev, fund_type: (val as string) || undefined }))}
          onSelect={(val) => setQuery((prev) => ({ ...prev, fund_type: (val as string) || undefined }))}
          open={typeOpen}
          onFocus={() => setTypeOpen(typeHistory.length > 0)}
          onBlur={() => setTypeOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (query.fund_type) {
                dispatch(addEntry({ page: 'fundList', field: 'fund_type', value: query.fund_type }));
              }
              fetchFunds(1, pagination.pageSize);
            }
          }}
          style={{ width: 200 }}
        />
        <BaseAutoComplete
          placeholder="管理人"
          allowClear
          value={query.management}
          options={mgmtHistory.map((v: string) => ({ value: v, label: v }))}
          onChange={(val) => setQuery((prev) => ({ ...prev, management: (val as string) || undefined }))}
          onSelect={(val) => setQuery((prev) => ({ ...prev, management: (val as string) || undefined }))}
          open={mgmtOpen}
          onFocus={() => setMgmtOpen(mgmtHistory.length > 0)}
          onBlur={() => setMgmtOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (query.management) {
                dispatch(addEntry({ page: 'fundList', field: 'management', value: query.management }));
              }
              fetchFunds(1, pagination.pageSize);
            }
          }}
          style={{ width: 180 }}
        />
        <BaseButton
          onClick={() => {
            if (query.keyword) dispatch(addEntry({ page: 'fundList', field: 'keyword', value: query.keyword }));
            if (query.fund_type) dispatch(addEntry({ page: 'fundList', field: 'fund_type', value: query.fund_type }));
            if (query.management) dispatch(addEntry({ page: 'fundList', field: 'management', value: query.management }));
            fetchFunds(1, pagination.pageSize);
          }}
        >
          查询
        </BaseButton>
        <BaseButton onClick={handleReset}>重置</BaseButton>
      </BaseSpace>

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
          fetchFunds(current, size);
        }}
      />
    </>
  );
};

export default FundListPage;

