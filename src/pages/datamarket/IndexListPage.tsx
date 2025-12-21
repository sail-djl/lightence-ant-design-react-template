import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseAutoComplete } from '@app/components/common/BaseAutoComplete/BaseAutoComplete';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { AppDate, Dates } from '@app/constants/Dates';
import { notificationController } from '@app/controllers/notificationController';
import { ColumnsType } from 'antd/es/table';
import { BaseTabs } from '@app/components/common/BaseTabs/BaseTabs';
import dayjs from 'dayjs';
import {
  IndexBasic,
  getIndexBasicList,
  syncIndexBasic,
  IndexBasicSyncPayload,
  IndexDaily,
  getIndexDailyList,
  syncIndexDaily,
  IndexDailySyncPayload,
  IndexDailybasic,
  getIndexDailybasicList,
  syncIndexDailybasic,
  IndexDailybasicSyncPayload,
  IndexWeekly,
  getIndexWeeklyList,
  syncIndexWeekly,
  IndexWeeklySyncPayload,
  IndexClassify,
  getIndexClassifyList,
  syncIndexClassify,
  IndexClassifySyncPayload,
  IndexMember,
  getIndexMemberList,
  syncIndexMember,
  IndexMemberSyncPayload,
  SwDaily,
  getSwDailyList,
  syncSwDaily,
  SwDailySyncPayload,
  IndexGlobal,
  getIndexGlobalList,
  syncIndexGlobal,
  IndexGlobalSyncPayload,
  IndexFactor,
  getIndexFactorList,
  syncIndexFactor,
  IndexFactorSyncPayload,
} from '@app/api/index.api';

const initialPagination = { current: 1, pageSize: 10 };

const trim = (s?: string) => (s ?? '').trim();

// ==================== Tab 1: 指数基础信息 ====================
const IndexBasicTab: React.FC = () => {
  const [query, setQuery] = useState({ keyword: '', market: undefined as string | undefined, publisher: undefined as string | undefined });
  const [rows, setRows] = useState<IndexBasic[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);
  const [total, setTotal] = useState(0);
  const [syncOpen, setSyncOpen] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncPayload, setSyncPayload] = useState<IndexBasicSyncPayload>({});

  const fetchData = useCallback(async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res = await getIndexBasicList({
        skip: (page - 1) * pageSize,
        limit: pageSize,
        keyword: trim(query.keyword) || undefined,
        market: query.market,
        publisher: trim(query.publisher) || undefined,
      });
      setRows(res.data);
      setTotal(res.count);
      setPagination({ current: page, pageSize });
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        <BaseButton onClick={() => {
          setQuery({ keyword: '', market: undefined, publisher: undefined });
          fetchData(1, pagination.pageSize);
        }}>重置</BaseButton>
        <BaseButton type="primary" onClick={() => {
          setSyncPayload({ keyword: query.keyword || undefined, market: query.market });
          setSyncOpen(true);
        }}>同步数据</BaseButton>
      </BaseSpace>

      <BaseModal
        title="指数基础信息同步"
        open={syncOpen}
        onCancel={() => setSyncOpen(false)}
        confirmLoading={syncLoading}
        onOk={async () => {
          setSyncLoading(true);
          try {
            const result = await syncIndexBasic(syncPayload);
            notificationController.success({ message: `同步完成：成功 ${result.success} 条，失败 ${result.failed} 条` });
            setSyncOpen(false);
            fetchData(pagination.current, pagination.pageSize);
          } catch (e: any) {
            notificationController.error({ message: e?.message || '同步失败' });
          } finally {
            setSyncLoading(false);
          }
        }}
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

// ==================== Tab 2: 日线行情 ====================
const IndexDailyTab: React.FC = () => {
  const [query, setQuery] = useState({ ts_code: '', start_date: '', end_date: '' });
  const [rows, setRows] = useState<IndexDaily[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncPayload, setSyncPayload] = useState<IndexDailySyncPayload>({});
  const [syncRange, setSyncRange] = useState<[AppDate | null, AppDate | null]>([null, null]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getIndexDailyList({
        ts_code: trim(query.ts_code) || undefined,
        start_date: query.start_date || undefined,
        end_date: query.end_date || undefined,
        limit: 1000,
      });
      setRows(res.data);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (query.ts_code) {
      fetchData();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const columns: ColumnsType<IndexDaily> = [
    { title: '指数代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center' },
    { title: '交易日期', dataIndex: 'trade_date', key: 'trade_date', align: 'center' },
    { title: '收盘点位', dataIndex: 'close', key: 'close', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: '开盘点位', dataIndex: 'open', key: 'open', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: '最高点位', dataIndex: 'high', key: 'high', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: '最低点位', dataIndex: 'low', key: 'low', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: '涨跌点', dataIndex: 'change', key: 'change', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: '涨跌幅(%)', dataIndex: 'pct_chg', key: 'pct_chg', align: 'right', render: (v: number) => v ? `${v.toFixed(2)}%` : '-', },
    { title: '成交量(手)', dataIndex: 'vol', key: 'vol', align: 'right', render: (v: number) => v?.toLocaleString() || '-' },
    { title: '成交额(千元)', dataIndex: 'amount', key: 'amount', align: 'right', render: (v: number) => v?.toLocaleString() || '-' },
  ];

  return (
    <>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <BaseInput
          placeholder="指数代码（如：000001.SH）"
          allowClear
          value={query.ts_code}
          onChange={(e) => setQuery((prev) => ({ ...prev, ts_code: trim(e.target.value) }))}
          style={{ width: 200 }}
          onPressEnter={() => fetchData()}
        />
        <DayjsDatePicker
          format="YYYY-MM-DD"
          placeholder="开始日期"
          value={query.start_date ? dayjs(query.start_date) : null}
          onChange={(val) => setQuery((prev) => ({ ...prev, start_date: val ? Dates.format(val, 'YYYY-MM-DD') : '' }))}
          style={{ width: 150 }}
        />
        <DayjsDatePicker
          format="YYYY-MM-DD"
          placeholder="结束日期"
          value={query.end_date ? dayjs(query.end_date) : null}
          onChange={(val) => setQuery((prev) => ({ ...prev, end_date: val ? Dates.format(val, 'YYYY-MM-DD') : '' }))}
          style={{ width: 150 }}
        />
        <BaseButton onClick={() => fetchData()}>查询</BaseButton>
        <BaseButton onClick={() => {
          setQuery({ ts_code: '', start_date: '', end_date: '' });
        }}>重置</BaseButton>
        <BaseButton type="primary" onClick={() => {
          setSyncPayload({ ts_code: query.ts_code || undefined });
          setSyncRange([query.start_date ? dayjs(query.start_date) : null, query.end_date ? dayjs(query.end_date) : null]);
          setSyncOpen(true);
        }}>同步数据</BaseButton>
      </BaseSpace>

      <BaseModal
        title="指数日线行情同步"
        open={syncOpen}
        onCancel={() => setSyncOpen(false)}
        confirmLoading={syncLoading}
        onOk={async () => {
          if (!syncPayload.ts_code) {
            notificationController.warning({ message: '请输入指数代码' });
            return;
          }
          setSyncLoading(true);
          try {
            const payload: IndexDailySyncPayload = {
              ts_code: syncPayload.ts_code,
              start_date: syncRange[0] ? Dates.format(syncRange[0], 'YYYY-MM-DD') : undefined,
              end_date: syncRange[1] ? Dates.format(syncRange[1], 'YYYY-MM-DD') : undefined,
            };
            const result = await syncIndexDaily(payload);
            notificationController.success({ message: `同步完成：成功 ${result.success} 条，失败 ${result.failed} 条` });
            setSyncOpen(false);
            fetchData();
          } catch (e: any) {
            notificationController.error({ message: e?.message || '同步失败' });
          } finally {
            setSyncLoading(false);
          }
        }}
      >
        <BaseForm layout="vertical">
          <BaseForm.Item label="指数代码" required>
            <BaseInput
              value={syncPayload.ts_code || ''}
              onChange={(e) => setSyncPayload({ ...syncPayload, ts_code: trim(e.target.value) || undefined })}
              placeholder="输入指数代码（如：000001.SH）"
            />
          </BaseForm.Item>
          <BaseForm.Item label="日期范围">
            <DayjsDatePicker.RangePicker
              format="YYYY-MM-DD"
              value={syncRange}
              onChange={(val) => setSyncRange([val?.[0] || null, val?.[1] || null])}
            />
          </BaseForm.Item>
        </BaseForm>
      </BaseModal>

      <BaseTable
        columns={columns}
        dataSource={rows}
        rowKey={(record) => `${record.ts_code}-${record.trade_date}`}
        loading={loading}
        pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (v) => `共 ${v} 条` }}
      />
    </>
  );
};

// ==================== Tab 3: 大盘指数每日指标 ====================
const IndexDailybasicTab: React.FC = () => {
  const [query, setQuery] = useState({ ts_code: '', trade_date: '', start_date: '', end_date: '' });
  const [rows, setRows] = useState<IndexDailybasic[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncPayload, setSyncPayload] = useState<IndexDailybasicSyncPayload>({});
  const [syncRange, setSyncRange] = useState<[AppDate | null, AppDate | null]>([null, null]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getIndexDailybasicList({
        ts_code: trim(query.ts_code) || undefined,
        trade_date: query.trade_date || undefined,
        start_date: query.start_date || undefined,
        end_date: query.end_date || undefined,
        limit: 1000,
      });
      setRows(res.data);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (query.ts_code || query.trade_date) {
      fetchData();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const columns: ColumnsType<IndexDailybasic> = [
    { title: '指数代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center' },
    { title: '交易日期', dataIndex: 'trade_date', key: 'trade_date', align: 'center' },
    { title: '总市值(元)', dataIndex: 'total_mv', key: 'total_mv', align: 'right', render: (v: number) => v?.toLocaleString() || '-' },
    { title: '流通市值(元)', dataIndex: 'float_mv', key: 'float_mv', align: 'right', render: (v: number) => v?.toLocaleString() || '-' },
    { title: '换手率', dataIndex: 'turnover_rate', key: 'turnover_rate', align: 'right', render: (v: number) => v ? `${v.toFixed(2)}%` : '-' },
    { title: '市盈率', dataIndex: 'pe', key: 'pe', align: 'right', render: (v: number) => v?.toFixed(2) || '-' },
    { title: '市盈率TTM', dataIndex: 'pe_ttm', key: 'pe_ttm', align: 'right', render: (v: number) => v?.toFixed(2) || '-' },
    { title: '市净率', dataIndex: 'pb', key: 'pb', align: 'right', render: (v: number) => v?.toFixed(2) || '-' },
  ];

  return (
    <>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <BaseInput
          placeholder="指数代码（如：000001.SH）"
          allowClear
          value={query.ts_code}
          onChange={(e) => setQuery((prev) => ({ ...prev, ts_code: trim(e.target.value) }))}
          style={{ width: 200 }}
          onPressEnter={() => fetchData()}
        />
        <DayjsDatePicker
          format="YYYY-MM-DD"
          placeholder="交易日期"
          value={query.trade_date ? dayjs(query.trade_date) : null}
          onChange={(val) => setQuery((prev) => ({ ...prev, trade_date: val ? Dates.format(val, 'YYYY-MM-DD') : '' }))}
          style={{ width: 150 }}
        />
        <DayjsDatePicker
          format="YYYY-MM-DD"
          placeholder="开始日期"
          value={query.start_date ? dayjs(query.start_date) : null}
          onChange={(val) => setQuery((prev) => ({ ...prev, start_date: val ? Dates.format(val, 'YYYY-MM-DD') : '' }))}
          style={{ width: 150 }}
        />
        <DayjsDatePicker
          format="YYYY-MM-DD"
          placeholder="结束日期"
          value={query.end_date ? dayjs(query.end_date) : null}
          onChange={(val) => setQuery((prev) => ({ ...prev, end_date: val ? Dates.format(val, 'YYYY-MM-DD') : '' }))}
          style={{ width: 150 }}
        />
        <BaseButton onClick={() => fetchData()}>查询</BaseButton>
        <BaseButton onClick={() => {
          setQuery({ ts_code: '', trade_date: '', start_date: '', end_date: '' });
        }}>重置</BaseButton>
        <BaseButton type="primary" onClick={() => {
          setSyncPayload({ ts_code: query.ts_code || undefined, trade_date: query.trade_date || undefined });
          setSyncRange([query.start_date ? dayjs(query.start_date) : null, query.end_date ? dayjs(query.end_date) : null]);
          setSyncOpen(true);
        }}>同步数据</BaseButton>
      </BaseSpace>

      <BaseModal
        title="大盘指数每日指标同步"
        open={syncOpen}
        onCancel={() => setSyncOpen(false)}
        confirmLoading={syncLoading}
        onOk={async () => {
          if (!syncPayload.ts_code && !syncPayload.trade_date) {
            notificationController.warning({ message: '请输入指数代码或交易日期' });
            return;
          }
          setSyncLoading(true);
          try {
            const payload: IndexDailybasicSyncPayload = {
              ts_code: syncPayload.ts_code,
              trade_date: syncPayload.trade_date,
              start_date: syncRange[0] ? Dates.format(syncRange[0], 'YYYY-MM-DD') : undefined,
              end_date: syncRange[1] ? Dates.format(syncRange[1], 'YYYY-MM-DD') : undefined,
            };
            const result = await syncIndexDailybasic(payload);
            notificationController.success({ message: `同步完成：成功 ${result.success} 条，失败 ${result.failed} 条` });
            setSyncOpen(false);
            fetchData();
          } catch (e: any) {
            notificationController.error({ message: e?.message || '同步失败' });
          } finally {
            setSyncLoading(false);
          }
        }}
      >
        <BaseForm layout="vertical">
          <BaseForm.Item label="指数代码（可选）">
            <BaseInput
              value={syncPayload.ts_code || ''}
              onChange={(e) => setSyncPayload({ ...syncPayload, ts_code: trim(e.target.value) || undefined })}
              placeholder="输入指数代码"
            />
          </BaseForm.Item>
          <BaseForm.Item label="交易日期（可选）">
            <DayjsDatePicker
              format="YYYY-MM-DD"
              value={syncPayload.trade_date ? dayjs(syncPayload.trade_date) : null}
              onChange={(val) => setSyncPayload({ ...syncPayload, trade_date: val ? Dates.format(val, 'YYYY-MM-DD') : undefined })}
            />
          </BaseForm.Item>
          <BaseForm.Item label="日期范围（可选）">
            <DayjsDatePicker.RangePicker
              format="YYYY-MM-DD"
              value={syncRange}
              onChange={(val) => setSyncRange([val?.[0] || null, val?.[1] || null])}
            />
          </BaseForm.Item>
        </BaseForm>
      </BaseModal>

      <BaseTable
        columns={columns}
        dataSource={rows}
        rowKey={(record) => `${record.ts_code}-${record.trade_date}`}
        loading={loading}
        pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (v) => `共 ${v} 条` }}
      />
    </>
  );
};

// ==================== Tab 4: 指数周线行情 ====================
const IndexWeeklyTab: React.FC = () => {
  const [query, setQuery] = useState({ ts_code: '', start_date: '', end_date: '' });
  const [rows, setRows] = useState<IndexWeekly[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncPayload, setSyncPayload] = useState<IndexWeeklySyncPayload>({});
  const [syncRange, setSyncRange] = useState<[AppDate | null, AppDate | null]>([null, null]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getIndexWeeklyList({
        ts_code: trim(query.ts_code) || undefined,
        start_date: query.start_date || undefined,
        end_date: query.end_date || undefined,
        limit: 1000,
      });
      setRows(res.data);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (query.ts_code) {
      fetchData();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const columns: ColumnsType<IndexWeekly> = [
    { title: '指数代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center' },
    { title: '交易日期', dataIndex: 'trade_date', key: 'trade_date', align: 'center' },
    { title: '收盘点位', dataIndex: 'close', key: 'close', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: '开盘点位', dataIndex: 'open', key: 'open', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: '最高点位', dataIndex: 'high', key: 'high', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: '最低点位', dataIndex: 'low', key: 'low', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: '涨跌幅(%)', dataIndex: 'pct_chg', key: 'pct_chg', align: 'right', render: (v: number) => v ? `${v.toFixed(2)}%` : '-', },
    { title: '成交量(手)', dataIndex: 'vol', key: 'vol', align: 'right', render: (v: number) => v?.toLocaleString() || '-' },
  ];

  return (
    <>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <BaseInput
          placeholder="指数代码（如：000001.SH）"
          allowClear
          value={query.ts_code}
          onChange={(e) => setQuery((prev) => ({ ...prev, ts_code: trim(e.target.value) }))}
          style={{ width: 200 }}
          onPressEnter={() => fetchData()}
        />
        <DayjsDatePicker
          format="YYYY-MM-DD"
          placeholder="开始日期"
          value={query.start_date ? dayjs(query.start_date) : null}
          onChange={(val) => setQuery((prev) => ({ ...prev, start_date: val ? Dates.format(val, 'YYYY-MM-DD') : '' }))}
          style={{ width: 150 }}
        />
        <DayjsDatePicker
          format="YYYY-MM-DD"
          placeholder="结束日期"
          value={query.end_date ? dayjs(query.end_date) : null}
          onChange={(val) => setQuery((prev) => ({ ...prev, end_date: val ? Dates.format(val, 'YYYY-MM-DD') : '' }))}
          style={{ width: 150 }}
        />
        <BaseButton onClick={() => fetchData()}>查询</BaseButton>
        <BaseButton onClick={() => {
          setQuery({ ts_code: '', start_date: '', end_date: '' });
        }}>重置</BaseButton>
        <BaseButton type="primary" onClick={() => {
          setSyncPayload({ ts_code: query.ts_code || undefined });
          setSyncRange([query.start_date ? dayjs(query.start_date) : null, query.end_date ? dayjs(query.end_date) : null]);
          setSyncOpen(true);
        }}>同步数据</BaseButton>
      </BaseSpace>

      <BaseModal
        title="指数周线行情同步"
        open={syncOpen}
        onCancel={() => setSyncOpen(false)}
        confirmLoading={syncLoading}
        onOk={async () => {
          if (!syncPayload.ts_code) {
            notificationController.warning({ message: '请输入指数代码' });
            return;
          }
          setSyncLoading(true);
          try {
            const payload: IndexWeeklySyncPayload = {
              ts_code: syncPayload.ts_code,
              start_date: syncRange[0] ? Dates.format(syncRange[0], 'YYYY-MM-DD') : undefined,
              end_date: syncRange[1] ? Dates.format(syncRange[1], 'YYYY-MM-DD') : undefined,
            };
            const result = await syncIndexWeekly(payload);
            notificationController.success({ message: `同步完成：成功 ${result.success} 条，失败 ${result.failed} 条` });
            setSyncOpen(false);
            fetchData();
          } catch (e: any) {
            notificationController.error({ message: e?.message || '同步失败' });
          } finally {
            setSyncLoading(false);
          }
        }}
      >
        <BaseForm layout="vertical">
          <BaseForm.Item label="指数代码" required>
            <BaseInput
              value={syncPayload.ts_code || ''}
              onChange={(e) => setSyncPayload({ ...syncPayload, ts_code: trim(e.target.value) || undefined })}
              placeholder="输入指数代码（如：000001.SH）"
            />
          </BaseForm.Item>
          <BaseForm.Item label="日期范围">
            <DayjsDatePicker.RangePicker
              format="YYYY-MM-DD"
              value={syncRange}
              onChange={(val) => setSyncRange([val?.[0] || null, val?.[1] || null])}
            />
          </BaseForm.Item>
        </BaseForm>
      </BaseModal>

      <BaseTable
        columns={columns}
        dataSource={rows}
        rowKey={(record) => `${record.ts_code}-${record.trade_date}`}
        loading={loading}
        pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (v) => `共 ${v} 条` }}
      />
    </>
  );
};

// ==================== Tab 5: 申万行业分类 ====================
const IndexClassifyTab: React.FC = () => {
  const [query, setQuery] = useState({ 
    index_code: '', 
    level: undefined as string | undefined, 
    parent_code: '', 
    src: 'SW2021', 
    keyword: '' 
  });
  const [rows, setRows] = useState<IndexClassify[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);
  const [total, setTotal] = useState(0);
  const [syncOpen, setSyncOpen] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncPayload, setSyncPayload] = useState<IndexClassifySyncPayload>({ src: 'SW2021' });

  const fetchData = useCallback(async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res = await getIndexClassifyList({
        skip: (page - 1) * pageSize,
        limit: pageSize,
        index_code: trim(query.index_code) || undefined,
        level: query.level,
        parent_code: trim(query.parent_code) || undefined,
        src: query.src,
        keyword: trim(query.keyword) || undefined,
      });
      setRows(res.data);
      setTotal(res.count);
      setPagination({ current: page, pageSize });
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const columns: ColumnsType<IndexClassify> = [
    { title: '指数代码', dataIndex: 'index_code', key: 'index_code', align: 'center' },
    { title: '行业名称', dataIndex: 'industry_name', key: 'industry_name', align: 'center' },
    { title: '行业代码', dataIndex: 'industry_code', key: 'industry_code', align: 'center', render: (v: string) => v || '-' },
    { title: '父级代码', dataIndex: 'parent_code', key: 'parent_code', align: 'center', render: (v: string) => v || '-' },
    { title: '行业层级', dataIndex: 'level', key: 'level', align: 'center', render: (v: string) => {
      if (v === 'L1') return '一级行业';
      if (v === 'L2') return '二级行业';
      if (v === 'L3') return '三级行业';
      return v || '-';
    }},
    { title: '是否发布', dataIndex: 'is_pub', key: 'is_pub', align: 'center', render: (v: string) => v === '1' ? '是' : '否' },
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
        <BaseButton onClick={() => {
          setQuery({ index_code: '', level: undefined, parent_code: '', src: 'SW2021', keyword: '' });
          fetchData(1, pagination.pageSize);
        }}>重置</BaseButton>
        <BaseButton type="primary" onClick={() => {
          setSyncPayload({ 
            index_code: query.index_code || undefined, 
            level: query.level, 
            parent_code: query.parent_code || undefined,
            src: query.src 
          });
          setSyncOpen(true);
        }}>同步数据</BaseButton>
      </BaseSpace>

      <BaseModal
        title="申万行业分类同步"
        open={syncOpen}
        onCancel={() => setSyncOpen(false)}
        confirmLoading={syncLoading}
        onOk={async () => {
          setSyncLoading(true);
          try {
            const result = await syncIndexClassify(syncPayload);
            notificationController.success({ message: `同步完成：成功 ${result.success} 条，失败 ${result.failed} 条` });
            setSyncOpen(false);
            fetchData(pagination.current, pagination.pageSize);
          } catch (e: any) {
            notificationController.error({ message: e?.message || '同步失败' });
          } finally {
            setSyncLoading(false);
          }
        }}
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

// ==================== Tab 6: 申万行业成分构成 ====================
const IndexMemberTab: React.FC = () => {
  const [query, setQuery] = useState({ l1_code: '', l2_code: '', l3_code: '', ts_code: '', is_new: 'Y' });
  const [rows, setRows] = useState<IndexMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);
  const [total, setTotal] = useState(0);
  const [syncOpen, setSyncOpen] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncPayload, setSyncPayload] = useState<IndexMemberSyncPayload>({ is_new: 'Y' });

  const fetchData = useCallback(async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res = await getIndexMemberList({
        skip: (page - 1) * pageSize,
        limit: pageSize,
        l1_code: trim(query.l1_code) || undefined,
        l2_code: trim(query.l2_code) || undefined,
        l3_code: trim(query.l3_code) || undefined,
        ts_code: trim(query.ts_code) || undefined,
        is_new: query.is_new,
      });
      setRows(res.data);
      setTotal(res.count);
      setPagination({ current: page, pageSize });
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (query.l1_code || query.l2_code || query.l3_code || query.ts_code) {
      fetchData();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        <BaseButton onClick={() => {
          setQuery({ l1_code: '', l2_code: '', l3_code: '', ts_code: '', is_new: 'Y' });
        }}>重置</BaseButton>
        <BaseButton type="primary" onClick={() => {
          setSyncPayload({
            l1_code: query.l1_code || undefined,
            l2_code: query.l2_code || undefined,
            l3_code: query.l3_code || undefined,
            ts_code: query.ts_code || undefined,
            is_new: query.is_new,
          });
          setSyncOpen(true);
        }}>同步数据</BaseButton>
      </BaseSpace>

      <BaseModal
        title="申万行业成分构成同步"
        open={syncOpen}
        onCancel={() => setSyncOpen(false)}
        confirmLoading={syncLoading}
        onOk={async () => {
          if (!syncPayload.l1_code && !syncPayload.l2_code && !syncPayload.l3_code && !syncPayload.ts_code) {
            notificationController.warning({ message: '必须指定 l1_code/l2_code/l3_code/ts_code 之一' });
            return;
          }
          setSyncLoading(true);
          try {
            const result = await syncIndexMember(syncPayload);
            notificationController.success({ message: `同步完成：成功 ${result.success} 条，失败 ${result.failed} 条` });
            setSyncOpen(false);
            fetchData(pagination.current, pagination.pageSize);
          } catch (e: any) {
            notificationController.error({ message: e?.message || '同步失败' });
          } finally {
            setSyncLoading(false);
          }
        }}
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

// ==================== Tab 7: 申万行业日线行情 ====================
const SwDailyTab: React.FC = () => {
  const [query, setQuery] = useState({ ts_code: '', start_date: '', end_date: '' });
  const [rows, setRows] = useState<SwDaily[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncPayload, setSyncPayload] = useState<SwDailySyncPayload>({});
  const [syncRange, setSyncRange] = useState<[AppDate | null, AppDate | null]>([null, null]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSwDailyList({
        ts_code: trim(query.ts_code) || undefined,
        start_date: query.start_date || undefined,
        end_date: query.end_date || undefined,
        limit: 1000,
      });
      setRows(res.data);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (query.ts_code) {
      fetchData();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const columns: ColumnsType<SwDaily> = [
    { title: '指数代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center' },
    { title: '指数名称', dataIndex: 'name', key: 'name', align: 'center', render: (v: string) => v || '-' },
    { title: '交易日期', dataIndex: 'trade_date', key: 'trade_date', align: 'center' },
    { title: '收盘点位', dataIndex: 'close', key: 'close', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: '开盘点位', dataIndex: 'open', key: 'open', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: '涨跌幅(%)', dataIndex: 'pct_change', key: 'pct_change', align: 'right', render: (v: number) => v ? `${v.toFixed(2)}%` : '-', },
    { title: '成交量(万股)', dataIndex: 'vol', key: 'vol', align: 'right', render: (v: number) => v?.toLocaleString() || '-' },
    { title: '市盈率', dataIndex: 'pe', key: 'pe', align: 'right', render: (v: number) => v?.toFixed(2) || '-' },
    { title: '市净率', dataIndex: 'pb', key: 'pb', align: 'right', render: (v: number) => v?.toFixed(2) || '-' },
  ];

  return (
    <>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <BaseInput
          placeholder="行业代码（如：801010.SI）"
          allowClear
          value={query.ts_code}
          onChange={(e) => setQuery((prev) => ({ ...prev, ts_code: trim(e.target.value) }))}
          style={{ width: 200 }}
          onPressEnter={() => fetchData()}
        />
        <DayjsDatePicker
          format="YYYY-MM-DD"
          placeholder="开始日期"
          value={query.start_date ? dayjs(query.start_date) : null}
          onChange={(val) => setQuery((prev) => ({ ...prev, start_date: val ? Dates.format(val, 'YYYY-MM-DD') : '' }))}
          style={{ width: 150 }}
        />
        <DayjsDatePicker
          format="YYYY-MM-DD"
          placeholder="结束日期"
          value={query.end_date ? dayjs(query.end_date) : null}
          onChange={(val) => setQuery((prev) => ({ ...prev, end_date: val ? Dates.format(val, 'YYYY-MM-DD') : '' }))}
          style={{ width: 150 }}
        />
        <BaseButton onClick={() => fetchData()}>查询</BaseButton>
        <BaseButton onClick={() => {
          setQuery({ ts_code: '', start_date: '', end_date: '' });
        }}>重置</BaseButton>
        <BaseButton type="primary" onClick={() => {
          setSyncPayload({ ts_code: query.ts_code || undefined });
          setSyncRange([query.start_date ? dayjs(query.start_date) : null, query.end_date ? dayjs(query.end_date) : null]);
          setSyncOpen(true);
        }}>同步数据</BaseButton>
      </BaseSpace>

      <BaseModal
        title="申万行业日线行情同步"
        open={syncOpen}
        onCancel={() => setSyncOpen(false)}
        confirmLoading={syncLoading}
        onOk={async () => {
          if (!syncPayload.ts_code && (!syncRange[0] || !syncRange[1])) {
            notificationController.warning({ message: '请输入指数代码或选择日期范围' });
            return;
          }
          setSyncLoading(true);
          try {
            const payload: SwDailySyncPayload = {
              ts_code: syncPayload.ts_code,
              start_date: syncRange[0] ? Dates.format(syncRange[0], 'YYYY-MM-DD') : undefined,
              end_date: syncRange[1] ? Dates.format(syncRange[1], 'YYYY-MM-DD') : undefined,
            };
            const result = await syncSwDaily(payload);
            notificationController.success({ message: `同步完成：成功 ${result.success} 条，失败 ${result.failed} 条` });
            setSyncOpen(false);
            fetchData();
          } catch (e: any) {
            notificationController.error({ message: e?.message || '同步失败' });
          } finally {
            setSyncLoading(false);
          }
        }}
      >
        <BaseForm layout="vertical">
          <BaseForm.Item label="指数代码（可选）">
            <BaseInput
              value={syncPayload.ts_code || ''}
              onChange={(e) => setSyncPayload({ ...syncPayload, ts_code: trim(e.target.value) || undefined })}
              placeholder="输入行业代码（如：801010.SI）"
            />
          </BaseForm.Item>
          <BaseForm.Item label="日期范围">
            <DayjsDatePicker.RangePicker
              format="YYYY-MM-DD"
              value={syncRange}
              onChange={(val) => setSyncRange([val?.[0] || null, val?.[1] || null])}
            />
          </BaseForm.Item>
        </BaseForm>
      </BaseModal>

      <BaseTable
        columns={columns}
        dataSource={rows}
        rowKey={(record) => `${record.ts_code}-${record.trade_date}`}
        loading={loading}
        pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (v) => `共 ${v} 条` }}
      />
    </>
  );
};

// ==================== Tab 8: 国际指数 ====================
const IndexGlobalTab: React.FC = () => {
  const [query, setQuery] = useState({ ts_code: '', start_date: '', end_date: '' });
  const [rows, setRows] = useState<IndexGlobal[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncPayload, setSyncPayload] = useState<IndexGlobalSyncPayload>({});
  const [syncRange, setSyncRange] = useState<[AppDate | null, AppDate | null]>([null, null]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getIndexGlobalList({
        ts_code: trim(query.ts_code) || undefined,
        start_date: query.start_date || undefined,
        end_date: query.end_date || undefined,
        limit: 1000,
      });
      setRows(res.data);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (query.ts_code) {
      fetchData();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const columns: ColumnsType<IndexGlobal> = [
    { title: '指数代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center' },
    { title: '交易日期', dataIndex: 'trade_date', key: 'trade_date', align: 'center' },
    { title: '收盘点位', dataIndex: 'close', key: 'close', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: '开盘点位', dataIndex: 'open', key: 'open', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: '最高点位', dataIndex: 'high', key: 'high', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: '最低点位', dataIndex: 'low', key: 'low', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: '涨跌幅(%)', dataIndex: 'pct_chg', key: 'pct_chg', align: 'right', render: (v: number) => v ? `${v.toFixed(2)}%` : '-', },
    { title: '振幅', dataIndex: 'swing', key: 'swing', align: 'right', render: (v: number) => v ? `${v.toFixed(2)}%` : '-', },
  ];

  return (
    <>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <BaseSelect
          placeholder="指数代码"
          allowClear
          value={query.ts_code}
          onChange={(val) => setQuery((prev) => ({ ...prev, ts_code: val as string }))}
          options={[
            { value: 'XIN9', label: '富时中国A50指数' },
            { value: 'HSI', label: '恒生指数' },
            { value: 'HKTECH', label: '恒生科技指数' },
            { value: 'DJI', label: '道琼斯工业指数' },
            { value: 'SPX', label: '标普500指数' },
            { value: 'IXIC', label: '纳斯达克指数' },
            { value: 'FTSE', label: '富时100指数' },
            { value: 'N225', label: '日经225指数' },
          ]}
          style={{ width: 200 }}
        />
        <DayjsDatePicker
          format="YYYY-MM-DD"
          placeholder="开始日期"
          value={query.start_date ? dayjs(query.start_date) : null}
          onChange={(val) => setQuery((prev) => ({ ...prev, start_date: val ? Dates.format(val, 'YYYY-MM-DD') : '' }))}
          style={{ width: 150 }}
        />
        <DayjsDatePicker
          format="YYYY-MM-DD"
          placeholder="结束日期"
          value={query.end_date ? dayjs(query.end_date) : null}
          onChange={(val) => setQuery((prev) => ({ ...prev, end_date: val ? Dates.format(val, 'YYYY-MM-DD') : '' }))}
          style={{ width: 150 }}
        />
        <BaseButton onClick={() => fetchData()}>查询</BaseButton>
        <BaseButton onClick={() => {
          setQuery({ ts_code: '', start_date: '', end_date: '' });
        }}>重置</BaseButton>
        <BaseButton type="primary" onClick={() => {
          setSyncPayload({ ts_code: query.ts_code || undefined });
          setSyncRange([query.start_date ? dayjs(query.start_date) : null, query.end_date ? dayjs(query.end_date) : null]);
          setSyncOpen(true);
        }}>同步数据</BaseButton>
      </BaseSpace>

      <BaseModal
        title="国际指数同步"
        open={syncOpen}
        onCancel={() => setSyncOpen(false)}
        confirmLoading={syncLoading}
        onOk={async () => {
          if (!syncPayload.ts_code) {
            notificationController.warning({ message: '请选择指数代码' });
            return;
          }
          setSyncLoading(true);
          try {
            const payload: IndexGlobalSyncPayload = {
              ts_code: syncPayload.ts_code,
              start_date: syncRange[0] ? Dates.format(syncRange[0], 'YYYY-MM-DD') : undefined,
              end_date: syncRange[1] ? Dates.format(syncRange[1], 'YYYY-MM-DD') : undefined,
            };
            const result = await syncIndexGlobal(payload);
            notificationController.success({ message: `同步完成：成功 ${result.success} 条，失败 ${result.failed} 条` });
            setSyncOpen(false);
            fetchData();
          } catch (e: any) {
            notificationController.error({ message: e?.message || '同步失败' });
          } finally {
            setSyncLoading(false);
          }
        }}
      >
        <BaseForm layout="vertical">
          <BaseForm.Item label="指数代码" required>
            <BaseSelect
              value={syncPayload.ts_code}
              onChange={(val) => setSyncPayload({ ...syncPayload, ts_code: val as string | undefined })}
              options={[
                { value: 'XIN9', label: '富时中国A50指数' },
                { value: 'HSI', label: '恒生指数' },
                { value: 'HKTECH', label: '恒生科技指数' },
                { value: 'DJI', label: '道琼斯工业指数' },
                { value: 'SPX', label: '标普500指数' },
                { value: 'IXIC', label: '纳斯达克指数' },
                { value: 'FTSE', label: '富时100指数' },
                { value: 'N225', label: '日经225指数' },
              ]}
            />
          </BaseForm.Item>
          <BaseForm.Item label="日期范围">
            <DayjsDatePicker.RangePicker
              format="YYYY-MM-DD"
              value={syncRange}
              onChange={(val) => setSyncRange([val?.[0] || null, val?.[1] || null])}
            />
          </BaseForm.Item>
        </BaseForm>
      </BaseModal>

      <BaseTable
        columns={columns}
        dataSource={rows}
        rowKey={(record) => `${record.ts_code}-${record.trade_date}`}
        loading={loading}
        pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (v) => `共 ${v} 条` }}
      />
    </>
  );
};

// ==================== Tab 9: 指数技术因子 ====================
const IndexFactorTab: React.FC = () => {
  const [query, setQuery] = useState({ ts_code: '', start_date: '', end_date: '' });
  const [rows, setRows] = useState<IndexFactor[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncPayload, setSyncPayload] = useState<IndexFactorSyncPayload>({});
  const [syncRange, setSyncRange] = useState<[AppDate | null, AppDate | null]>([null, null]);

  const fetchData = useCallback(async () => {
    if (!query.ts_code) {
      return;
    }
    setLoading(true);
    try {
      const res = await getIndexFactorList({
        ts_code: query.ts_code,
        start_date: query.start_date || undefined,
        end_date: query.end_date || undefined,
        limit: 1000,
      });
      setRows(res.data);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (query.ts_code) {
      fetchData();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const columns: ColumnsType<IndexFactor> = [
    { title: '指数代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center' },
    { title: '交易日期', dataIndex: 'trade_date', key: 'trade_date', align: 'center' },
    { title: '收盘价', dataIndex: 'close', key: 'close', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: 'MACD', dataIndex: 'macd_bfq', key: 'macd_bfq', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: 'RSI(12)', dataIndex: 'rsi_bfq_12', key: 'rsi_bfq_12', align: 'right', render: (v: number) => v?.toFixed(2) || '-' },
    { title: 'KDJ_K', dataIndex: 'kdj_k_bfq', key: 'kdj_k_bfq', align: 'right', render: (v: number) => v?.toFixed(2) || '-' },
    { title: 'MA5', dataIndex: 'ma_bfq_5', key: 'ma_bfq_5', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: 'MA20', dataIndex: 'ma_bfq_20', key: 'ma_bfq_20', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: 'MA60', dataIndex: 'ma_bfq_60', key: 'ma_bfq_60', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
  ];

  return (
    <>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <BaseInput
          placeholder="指数代码（如：000001.SH）"
          allowClear
          value={query.ts_code}
          onChange={(e) => setQuery((prev) => ({ ...prev, ts_code: trim(e.target.value) }))}
          style={{ width: 200 }}
          onPressEnter={() => fetchData()}
        />
        <DayjsDatePicker
          format="YYYY-MM-DD"
          placeholder="开始日期"
          value={query.start_date ? dayjs(query.start_date) : null}
          onChange={(val) => setQuery((prev) => ({ ...prev, start_date: val ? Dates.format(val, 'YYYY-MM-DD') : '' }))}
          style={{ width: 150 }}
        />
        <DayjsDatePicker
          format="YYYY-MM-DD"
          placeholder="结束日期"
          value={query.end_date ? dayjs(query.end_date) : null}
          onChange={(val) => setQuery((prev) => ({ ...prev, end_date: val ? Dates.format(val, 'YYYY-MM-DD') : '' }))}
          style={{ width: 150 }}
        />
        <BaseButton onClick={() => fetchData()}>查询</BaseButton>
        <BaseButton onClick={() => {
          setQuery({ ts_code: '', start_date: '', end_date: '' });
        }}>重置</BaseButton>
        <BaseButton type="primary" onClick={() => {
          setSyncPayload({ ts_code: query.ts_code || undefined });
          setSyncRange([query.start_date ? dayjs(query.start_date) : null, query.end_date ? dayjs(query.end_date) : null]);
          setSyncOpen(true);
        }}>同步数据</BaseButton>
      </BaseSpace>

      <BaseModal
        title="指数技术因子同步"
        open={syncOpen}
        onCancel={() => setSyncOpen(false)}
        confirmLoading={syncLoading}
        onOk={async () => {
          if (!syncPayload.ts_code) {
            notificationController.warning({ message: '请输入指数代码' });
            return;
          }
          setSyncLoading(true);
          try {
            const payload: IndexFactorSyncPayload = {
              ts_code: syncPayload.ts_code,
              start_date: syncRange[0] ? Dates.format(syncRange[0], 'YYYY-MM-DD') : undefined,
              end_date: syncRange[1] ? Dates.format(syncRange[1], 'YYYY-MM-DD') : undefined,
            };
            const result = await syncIndexFactor(payload);
            notificationController.success({ message: `同步完成：成功 ${result.success} 条，失败 ${result.failed} 条` });
            setSyncOpen(false);
            fetchData();
          } catch (e: any) {
            notificationController.error({ message: e?.message || '同步失败' });
          } finally {
            setSyncLoading(false);
          }
        }}
      >
        <BaseForm layout="vertical">
          <BaseForm.Item label="指数代码" required>
            <BaseInput
              value={syncPayload.ts_code || ''}
              onChange={(e) => setSyncPayload({ ...syncPayload, ts_code: trim(e.target.value) || undefined })}
              placeholder="输入指数代码（如：000001.SH）"
            />
          </BaseForm.Item>
          <BaseForm.Item label="日期范围">
            <DayjsDatePicker.RangePicker
              format="YYYY-MM-DD"
              value={syncRange}
              onChange={(val) => setSyncRange([val?.[0] || null, val?.[1] || null])}
            />
          </BaseForm.Item>
        </BaseForm>
      </BaseModal>

      <BaseTable
        columns={columns}
        dataSource={rows}
        rowKey={(record) => `${record.ts_code}-${record.trade_date}`}
        loading={loading}
        pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (v) => `共 ${v} 条` }}
      />
    </>
  );
};

// ==================== 主页面组件 ====================
const IndexListPage: React.FC = () => {
  const tabItems = useMemo(
    () => [
      {
        key: 'basic',
        label: '指数基础信息',
        children: <IndexBasicTab />,
      },
      {
        key: 'daily',
        label: '日线行情',
        children: <IndexDailyTab />,
      },
      {
        key: 'dailybasic',
        label: '大盘指数每日指标',
        children: <IndexDailybasicTab />,
      },
      {
        key: 'weekly',
        label: '指数周线行情',
        children: <IndexWeeklyTab />,
      },
      {
        key: 'classify',
        label: '申万行业分类',
        children: <IndexClassifyTab />,
      },
      {
        key: 'member',
        label: '申万行业成分构成',
        children: <IndexMemberTab />,
      },
      {
        key: 'swdaily',
        label: '申万行业日线行情',
        children: <SwDailyTab />,
      },
      {
        key: 'global',
        label: '国际指数',
        children: <IndexGlobalTab />,
      },
      {
        key: 'factor',
        label: '指数技术因子',
        children: <IndexFactorTab />,
      },
    ],
    [],
  );

  return (
    <>
      <PageTitle>数据市场 · 指数数据</PageTitle>
      <BaseTabs defaultActiveKey="basic" items={tabItems} type="card" />
    </>
  );
};

export default IndexListPage;

