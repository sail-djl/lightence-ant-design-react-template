import React, { useCallback, useEffect, useState } from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseAutoComplete } from '@app/components/common/BaseAutoComplete/BaseAutoComplete';
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import { Dates } from '@app/constants/Dates';
import { ColumnsType } from 'antd/es/table';
import { EtfBasic, getEtfBasicList } from '@app/api/datamarket/etf.api';
import { useDispatch, useSelector } from 'react-redux';
import { addEntry } from '@app/store/slices/searchHistorySlice';
import dayjs from 'dayjs';

const initialPagination = { current: 1, pageSize: 10 };

const statusText = (v?: 'L' | 'D' | 'P') => {
  if (v === 'L') return '上市';
  if (v === 'D') return '退市';
  if (v === 'P') return '待上市';
  return '-';
};

const exchangeText = (v?: 'SH' | 'SZ') => {
  if (v === 'SH') return '上交所';
  if (v === 'SZ') return '深交所';
  return '-';
};

// 日期范围快捷选项
const getDateRanges = (): Record<string, [dayjs.Dayjs, dayjs.Dayjs]> => {
  const today = dayjs();
  return {
    '最近一周': [dayjs().subtract(7, 'day'), today],
    '最近一月': [dayjs().subtract(1, 'month'), today],
    '最近一年': [dayjs().subtract(1, 'year'), today],
    '最近五年': [dayjs().subtract(5, 'year'), today],
    '最近十年': [dayjs().subtract(10, 'year'), today],
  };
};

const EtfListPage: React.FC = () => {
  // 设置默认日期范围为最近一年
  const defaultDateRange = [dayjs().subtract(1, 'year'), dayjs()] as [dayjs.Dayjs, dayjs.Dayjs];
  const defaultStartDate = Dates.format(defaultDateRange[0], 'YYYY-MM-DD');
  const defaultEndDate = Dates.format(defaultDateRange[1], 'YYYY-MM-DD');

  const initialQuery = {
    keyword: '',
    exchange: undefined as 'SH' | 'SZ' | undefined,
    list_status: 'L' as 'L' | 'D' | 'P' | undefined,
    etf_type: undefined as string | undefined,
    mgr_name: undefined as string | undefined,
    start_date: defaultStartDate,
    end_date: defaultEndDate,
  };

  const [query, setQuery] = useState(initialQuery);
  const [rows, setRows] = useState<EtfBasic[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);
  const [total, setTotal] = useState(0);

  const dispatch = useDispatch();
  const keywordHistory = useSelector((state: any) => state.searchHistory?.pages?.etfList?.keyword || []);
  const typeHistory = useSelector((state: any) => state.searchHistory?.pages?.etfList?.etf_type || []);
  const mgrHistory = useSelector((state: any) => state.searchHistory?.pages?.etfList?.mgr_name || []);
  const [keywordOpen, setKeywordOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [mgrOpen, setMgrOpen] = useState(false);

  const fetchEtfs = useCallback(
    async (page = 1, pageSize = 10, params?: typeof query) => {
      setLoading(true);
      const q = params || query;
      try {
        const res = await getEtfBasicList({
          skip: (page - 1) * pageSize,
          limit: pageSize,
          keyword: q.keyword || undefined,
          exchange: q.exchange,
          list_status: q.list_status,
          etf_type: q.etf_type,
          mgr_name: q.mgr_name,
          start_date: q.start_date,
          end_date: q.end_date,
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
    fetchEtfs();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReset = () => {
    setQuery(initialQuery);
    fetchEtfs(1, pagination.pageSize, initialQuery);
  };

  const columns: ColumnsType<EtfBasic> = [
    { title: '代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center' },
    { title: '简称', dataIndex: 'extname', key: 'extname', align: 'center', render: (v: string) => v || '-' },
    { title: '指数代码', dataIndex: 'index_code', key: 'index_code', align: 'center', render: (v: string) => v || '-' },
    { title: '指数名称', dataIndex: 'index_name', key: 'index_name', align: 'center', render: (v: string) => v || '-' },
    { title: '交易所', dataIndex: 'exchange', key: 'exchange', align: 'center', render: (v) => exchangeText(v) },
    { title: '状态', dataIndex: 'list_status', key: 'list_status', align: 'center', render: (v) => statusText(v) },
    { title: '管理人', dataIndex: 'mgr_name', key: 'mgr_name', align: 'center', render: (v: string) => v || '-' },
    {
      title: '管理费',
      dataIndex: 'mgt_fee',
      key: 'mgt_fee',
      align: 'center',
      render: (v?: number | string) => (typeof v === 'number' || typeof v === 'string' ? `${v}%` : '-'),
    },
    { title: '类型', dataIndex: 'etf_type', key: 'etf_type', align: 'center', render: (v: string) => v || '-' },
    { title: '上市日期', dataIndex: 'list_date', key: 'list_date', align: 'center', render: (v: string) => v || '-' },
  ];

  return (
    <>
      <PageTitle>数据市场 · ETF</PageTitle>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem' }}>
        <BaseAutoComplete
          placeholder="关键词（代码/简称/指数）"
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
                dispatch(addEntry({ page: 'etfList', field: 'keyword', value: query.keyword }));
              }
              fetchEtfs(1, pagination.pageSize);
            }
          }}
          style={{ width: 240 }}
        />
        <BaseSelect
          placeholder="交易所"
          allowClear
          value={query.exchange}
          onChange={(val) => {
            const exchange = val as 'SH' | 'SZ' | undefined;
            const nextQuery = { ...query, exchange };
            setQuery(nextQuery);
            fetchEtfs(1, pagination.pageSize, nextQuery);
          }}
          options={[
            { value: 'SH', label: '上交所(SH)' },
            { value: 'SZ', label: '深交所(SZ)' },
          ]}
          style={{ width: 160 }}
        />
        <BaseSelect
          placeholder="状态"
          allowClear
          value={query.list_status}
          onChange={(val) => {
            const list_status = val as 'L' | 'D' | 'P' | undefined;
            const nextQuery = { ...query, list_status };
            setQuery(nextQuery);
            fetchEtfs(1, pagination.pageSize, nextQuery);
          }}
          options={[
            { value: 'L', label: '上市(L)' },
            { value: 'D', label: '退市(D)' },
            { value: 'P', label: '待上市(P)' },
          ]}
          style={{ width: 160 }}
        />
        <BaseAutoComplete
          placeholder="类型（境内/QDII）"
          allowClear
          value={query.etf_type}
          options={typeHistory.map((v: string) => ({ value: v, label: v }))}
          onChange={(val) => setQuery((prev) => ({ ...prev, etf_type: (val as string) || undefined }))}
          onSelect={(val) => setQuery((prev) => ({ ...prev, etf_type: (val as string) || undefined }))}
          open={typeOpen}
          onFocus={() => setTypeOpen(typeHistory.length > 0)}
          onBlur={() => setTypeOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (query.etf_type) {
                dispatch(addEntry({ page: 'etfList', field: 'etf_type', value: query.etf_type }));
              }
              fetchEtfs(1, pagination.pageSize);
            }
          }}
          style={{ width: 180 }}
        />
        <BaseAutoComplete
          placeholder="管理人"
          allowClear
          value={query.mgr_name}
          options={mgrHistory.map((v: string) => ({ value: v, label: v }))}
          onChange={(val) => setQuery((prev) => ({ ...prev, mgr_name: (val as string) || undefined }))}
          onSelect={(val) => setQuery((prev) => ({ ...prev, mgr_name: (val as string) || undefined }))}
          open={mgrOpen}
          onFocus={() => setMgrOpen(mgrHistory.length > 0)}
          onBlur={() => setMgrOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (query.mgr_name) {
                dispatch(addEntry({ page: 'etfList', field: 'mgr_name', value: query.mgr_name }));
              }
              fetchEtfs(1, pagination.pageSize);
            }
          }}
          style={{ width: 180 }}
        />
        <DayjsDatePicker.RangePicker
          format="YYYY-MM-DD"
          placeholder={['开始日期', '结束日期']}
          value={
            query.start_date && query.end_date
              ? [dayjs(query.start_date), dayjs(query.end_date)]
              : null
          }
          onChange={(dates) => {
            setQuery({
              ...query,
              start_date: dates?.[0] ? Dates.format(dates[0], 'YYYY-MM-DD') : undefined,
              end_date: dates?.[1] ? Dates.format(dates[1], 'YYYY-MM-DD') : undefined,
            });
          }}
          ranges={getDateRanges()}
          style={{ width: 300 }}
        />
        <BaseButton
          onClick={() => {
            if (query.keyword) dispatch(addEntry({ page: 'etfList', field: 'keyword', value: query.keyword }));
            if (query.etf_type) dispatch(addEntry({ page: 'etfList', field: 'etf_type', value: query.etf_type }));
            if (query.mgr_name) dispatch(addEntry({ page: 'etfList', field: 'mgr_name', value: query.mgr_name }));
            fetchEtfs(1, pagination.pageSize);
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
          fetchEtfs(current, size);
        }}
      />
    </>
  );
};

export default EtfListPage;
