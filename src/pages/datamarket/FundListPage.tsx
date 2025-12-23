import React, { useCallback, useEffect, useState } from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseAutoComplete } from '@app/components/common/BaseAutoComplete/BaseAutoComplete';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import { AppDate, Dates } from '@app/constants/Dates';
import { notificationController } from '@app/controllers/notificationController';
import { ColumnsType } from 'antd/es/table';
import { FundBasic, getFundBasicList, syncFundNav, FundSyncPayload, syncFundFactor, FundFactorSyncPayload } from '@app/api/fund.api';
import { useDispatch, useSelector } from 'react-redux';
import { addEntry } from '@app/store/slices/searchHistorySlice';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const initialPagination = { current: 1, pageSize: 15 };

import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';

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
  const navigate = useNavigate();
  const trim = (s?: string) => (s ?? '').trim();
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
  const [syncOpen, setSyncOpen] = useState(false);
  const [syncQuery, setSyncQuery] = useState(initialQuery);
  const [syncRange, setSyncRange] = useState<[AppDate | null, AppDate | null]>([null, null]);
  const [syncLoading, setSyncLoading] = useState(false);

  const [factorSyncOpen, setFactorSyncOpen] = useState(false);
  const [factorSyncRange, setFactorSyncRange] = useState<[AppDate | null, AppDate | null]>([null, null]);
  const [factorSyncCode, setFactorSyncCode] = useState('');
  const [factorSyncLoading, setFactorSyncLoading] = useState(false);

  const fetchFunds = useCallback(
    async (page = 1, pageSize = 15, params?: typeof query) => {
      setLoading(true);
      const q = params || query;
      try {
        const res = await getFundBasicList({
          skip: (page - 1) * pageSize,
          limit: pageSize,
          keyword: trim(q.keyword) || undefined,
          market: q.market,
          status: q.status,
          fund_type: trim(q.fund_type) || undefined,
          management: trim(q.management) || undefined,
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
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <BaseSpace>
           <BaseButton type="link" onClick={() => navigate(`/datamarket/fund/${record.ts_code}`)}>
             详情
           </BaseButton>
        </BaseSpace>
      ),
    },
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
          onChange={(val) => setQuery((prev) => ({ ...prev, keyword: trim(val as string) }))}
          onSelect={(val) => setQuery((prev) => ({ ...prev, keyword: trim(val as string) }))}
          open={keywordOpen}
          onFocus={() => setKeywordOpen(keywordHistory.length > 0)}
          onBlur={() => setKeywordOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (query.keyword && trim(query.keyword)) {
                dispatch(addEntry({ page: 'fundList', field: 'keyword', value: trim(query.keyword) }));
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
          onChange={(val) => {
            const s = trim(val as string);
            setQuery((prev) => ({ ...prev, fund_type: s || undefined }));
          }}
          onSelect={(val) => {
            const s = trim(val as string);
            setQuery((prev) => ({ ...prev, fund_type: s || undefined }));
          }}
          open={typeOpen}
          onFocus={() => setTypeOpen(typeHistory.length > 0)}
          onBlur={() => setTypeOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (query.fund_type && trim(query.fund_type)) {
                dispatch(addEntry({ page: 'fundList', field: 'fund_type', value: trim(query.fund_type) }));
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
          onChange={(val) => {
            const s = trim(val as string);
            setQuery((prev) => ({ ...prev, management: s || undefined }));
          }}
          onSelect={(val) => {
            const s = trim(val as string);
            setQuery((prev) => ({ ...prev, management: s || undefined }));
          }}
          open={mgmtOpen}
          onFocus={() => setMgmtOpen(mgmtHistory.length > 0)}
          onBlur={() => setMgmtOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (query.management && trim(query.management)) {
                dispatch(addEntry({ page: 'fundList', field: 'management', value: trim(query.management) }));
              }
              fetchFunds(1, pagination.pageSize);
            }
          }}
          style={{ width: 180 }}
        />
        <BaseButton
          onClick={() => {
            if (query.keyword && trim(query.keyword)) dispatch(addEntry({ page: 'fundList', field: 'keyword', value: trim(query.keyword) }));
            if (query.fund_type && trim(query.fund_type)) dispatch(addEntry({ page: 'fundList', field: 'fund_type', value: trim(query.fund_type) }));
            if (query.management && trim(query.management)) dispatch(addEntry({ page: 'fundList', field: 'management', value: trim(query.management) }));
            fetchFunds(1, pagination.pageSize);
          }}
        >
          查询
        </BaseButton>
        <BaseButton onClick={handleReset}>重置</BaseButton>
      </BaseSpace>

      <BaseSpace style={{ display: 'flex', marginBottom: '1rem', justifyContent: 'flex-start' }}>
        <BaseButton type="primary" onClick={() => {
          setSyncQuery(query);
          setSyncOpen(true);
        }}>同步净值</BaseButton>
        <BaseButton type="primary" onClick={() => {
          setFactorSyncOpen(true);
        }}>因子同步</BaseButton>
      </BaseSpace>

      <BaseModal
        title="基金净值同步"
        open={syncOpen}
        onCancel={() => setSyncOpen(false)}
        confirmLoading={syncLoading}
        onOk={async () => {
          const hasStart = !!syncRange[0];
          const hasEnd = !!syncRange[1];
          const kw = trim(syncQuery.keyword);
          if (!kw) {
            notificationController.warning({ message: '请输入基金代码或名称' });
            return;
          }
          if ((hasStart && !hasEnd) || (!hasStart && hasEnd)) {
            notificationController.warning({ message: '请选择完整的日期范围' });
            return;
          }
          setSyncLoading(true);
          try {
            const payload: FundSyncPayload = {
              start_date: syncRange[0] ? Dates.format(syncRange[0], 'YYYY-MM-DD') : undefined,
              end_date: syncRange[1] ? Dates.format(syncRange[1], 'YYYY-MM-DD') : undefined,
              keyword: kw,
            };
            dispatch(addEntry({ page: 'fundList', field: 'keyword', value: kw }));
            await syncFundNav(payload);
            notificationController.success({ message: '同步任务已触发' });
            setSyncOpen(false);
          } catch (e: any) {
            notificationController.error({ message: e?.message || '同步失败' });
          } finally {
            setSyncLoading(false);
          }
        }}
      >
        <BaseForm layout="vertical">
          <BaseForm.Item label="日期范围">
            <DayjsDatePicker.RangePicker
              format="YYYY-MM-DD"
              value={syncRange}
              disabledDate={(current) => current && current > dayjs().endOf('day')}
              onChange={(val) => setSyncRange([val?.[0] || null, val?.[1] || null])}
            />
          </BaseForm.Item>
          
          <BaseForm.Item label="基金代码/名称" required>
            <BaseInput 
              value={syncQuery.keyword} 
              onChange={(e) => setSyncQuery({...syncQuery, keyword: trim(e.target.value)})} 
              placeholder="输入代码或名称"
            />
          </BaseForm.Item>
        </BaseForm>
      </BaseModal>



      <BaseModal
        title="基金因子同步"
        open={factorSyncOpen}
        onCancel={() => setFactorSyncOpen(false)}
        confirmLoading={factorSyncLoading}
        onOk={async () => {
          const hasStart = !!factorSyncRange[0];
          const hasEnd = !!factorSyncRange[1];
          const code = trim(factorSyncCode);
          if (!code && ((hasStart && !hasEnd) || (!hasStart && hasEnd))) {
            notificationController.warning({ message: '请选择完整的日期范围' });
            return;
          }
          if (!code && !hasStart && !hasEnd) {
             notificationController.warning({ message: '请提供代码或日期范围' });
             return;
          }
          
          setFactorSyncLoading(true);
          try {
            const payload: FundFactorSyncPayload = {
              ts_code: code || undefined,
              start_date: factorSyncRange[0] ? Dates.format(factorSyncRange[0], 'YYYY-MM-DD') : undefined,
              end_date: factorSyncRange[1] ? Dates.format(factorSyncRange[1], 'YYYY-MM-DD') : undefined,
            };
            await syncFundFactor(payload);
            notificationController.success({ message: '因子同步任务已触发' });
            setFactorSyncOpen(false);
          } catch (e: any) {
            notificationController.error({ message: e?.message || '同步失败' });
          } finally {
            setFactorSyncLoading(false);
          }
        }}
      >
        <BaseForm layout="vertical">
          <BaseForm.Item label="日期范围">
            <DayjsDatePicker.RangePicker
              format="YYYY-MM-DD"
              value={factorSyncRange}
              onChange={(val) => setFactorSyncRange([val?.[0] || null, val?.[1] || null])}
            />
          </BaseForm.Item>
          <BaseForm.Item label="基金代码 (可选)">
             <BaseInput 
              value={factorSyncCode} 
              onChange={(e) => setFactorSyncCode(trim(e.target.value))} 
              placeholder="输入基金代码 (如: 510050.SH)"
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
          fetchFunds(current, size);
        }}
      />
    </>
  );
};

export default FundListPage;
