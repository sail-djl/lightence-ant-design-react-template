import React, { useState, useCallback, useEffect } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { AppDate, Dates } from '@app/constants/Dates';
import { notificationController } from '@app/controllers/notificationController';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { IndexDailybasic, getIndexDailybasicList, syncIndexDailybasic, IndexDailybasicSyncPayload } from '@app/api/index.api';
import { trim } from '../utils';

export const IndexDailybasicTab: React.FC = () => {
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
    // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

  const columns: ColumnsType<IndexDailybasic> = [
    { title: '指数代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center' },
    { title: '交易日期', dataIndex: 'trade_date', key: 'trade_date', align: 'center' },
    { title: '总市值(元)', dataIndex: 'total_mv', key: 'total_mv', align: 'right', render: (v: number) => v?.toLocaleString() || '-' },
    { title: '流通市值(元)', dataIndex: 'float_mv', key: 'float_mv', align: 'right', render: (v: number) => v?.toLocaleString() || '-' },
    { title: '换手率', dataIndex: 'turnover_rate', key: 'turnover_rate', align: 'right', render: (v: number) => (v ? `${v.toFixed(2)}%` : '-') },
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
        <BaseButton
          onClick={() => {
            setQuery({ ts_code: '', trade_date: '', start_date: '', end_date: '' });
          }}
        >
          重置
        </BaseButton>
      </BaseSpace>

      <BaseSpace style={{ display: 'flex', marginBottom: '1rem' }}>
        <BaseButton
          type="primary"
          onClick={() => {
            setSyncPayload({ ts_code: query.ts_code || undefined, trade_date: query.trade_date || undefined });
            setSyncRange([query.start_date ? dayjs(query.start_date) : null, query.end_date ? dayjs(query.end_date) : null]);
            setSyncOpen(true);
          }}
        >
          同步数据
        </BaseButton>
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

