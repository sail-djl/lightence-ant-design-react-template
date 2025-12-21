import React, { useState, useCallback, useEffect } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import { AppDate, Dates } from '@app/constants/Dates';
import { notificationController } from '@app/controllers/notificationController';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { IndexGlobal, getIndexGlobalList, syncIndexGlobal, IndexGlobalSyncPayload } from '@app/api/index.api';
import { trim } from '../utils';

export const IndexGlobalTab: React.FC = () => {
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
    // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

  const columns: ColumnsType<IndexGlobal> = [
    { title: '指数代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center' },
    { title: '交易日期', dataIndex: 'trade_date', key: 'trade_date', align: 'center' },
    { title: '收盘点位', dataIndex: 'close', key: 'close', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: '开盘点位', dataIndex: 'open', key: 'open', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: '最高点位', dataIndex: 'high', key: 'high', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: '最低点位', dataIndex: 'low', key: 'low', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: '涨跌幅(%)', dataIndex: 'pct_chg', key: 'pct_chg', align: 'right', render: (v: number) => (v ? `${v.toFixed(2)}%` : '-') },
    { title: '振幅', dataIndex: 'swing', key: 'swing', align: 'right', render: (v: number) => (v ? `${v.toFixed(2)}%` : '-') },
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
        <BaseButton
          onClick={() => {
            setQuery({ ts_code: '', start_date: '', end_date: '' });
          }}
        >
          重置
        </BaseButton>
      </BaseSpace>

      <BaseSpace style={{ display: 'flex', marginBottom: '1rem' }}>
        <BaseButton
          type="primary"
          onClick={() => {
            setSyncPayload({ ts_code: query.ts_code || undefined });
            setSyncRange([query.start_date ? dayjs(query.start_date) : null, query.end_date ? dayjs(query.end_date) : null]);
            setSyncOpen(true);
          }}
        >
          同步数据
        </BaseButton>
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

