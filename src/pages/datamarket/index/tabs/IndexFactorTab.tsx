import React, { useState, useCallback, useEffect } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { AppDate, Dates } from '@app/constants/Dates';
import { notificationController } from '@app/controllers/notificationController';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { IndexFactor, getIndexFactorList, syncIndexFactor, IndexFactorSyncPayload, IndexBasic, getIndexBasicList } from '@app/api/index.api';
import { trim } from '../utils';

export const IndexFactorTab: React.FC = () => {
  const [query, setQuery] = useState({ ts_code: [] as string[], start_date: '', end_date: '' });
  const [rows, setRows] = useState<IndexFactor[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncPayload, setSyncPayload] = useState<IndexFactorSyncPayload>({});
  const [syncRange, setSyncRange] = useState<[AppDate | null, AppDate | null]>([null, null]);
  
  // 查询区域的指数选项列表
  const [indexOptions, setIndexOptions] = useState<IndexBasic[]>([]);
  const [indexOptionsLoading, setIndexOptionsLoading] = useState(false);

  // 加载查询区域的指数选项列表（加载前500条）
  const fetchIndexOptions = useCallback(async () => {
    setIndexOptionsLoading(true);
    try {
      const res = await getIndexBasicList({
        skip: 0,
        limit: 500,
      });
      setIndexOptions(res.data);
    } finally {
      setIndexOptionsLoading(false);
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (query.ts_code.length === 0) {
      setRows([]);
      return;
    }
    setLoading(true);
    try {
      const res = await getIndexFactorList({
        ts_code: query.ts_code.join(','),
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
    fetchIndexOptions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (query.ts_code.length > 0) {
      fetchData();
    }
    // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

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
        <BaseSelect
          mode="multiple"
          placeholder="选择指数代码"
          allowClear
          value={query.ts_code}
          onChange={(val) => setQuery((prev) => ({ ...prev, ts_code: val as string[] }))}
          style={{ width: 300 }}
          maxTagCount="responsive"
          showSearch
          loading={indexOptionsLoading}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) ||
            (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
          }
        >
          {indexOptions.map((item) => (
            <Option key={item.ts_code} value={item.ts_code} label={`${item.ts_code} - ${item.name || ''}`}>
              {item.ts_code} - {item.name || ''}
            </Option>
          ))}
        </BaseSelect>
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
            setQuery({ ts_code: [], start_date: '', end_date: '' });
          }}
        >
          重置
        </BaseButton>
      </BaseSpace>

      <BaseSpace style={{ display: 'flex', marginBottom: '1rem' }}>
        <BaseButton
          type="primary"
          onClick={() => {
            setSyncPayload({ ts_code: query.ts_code.length > 0 ? query.ts_code.join(',') : undefined });
            setSyncRange([query.start_date ? dayjs(query.start_date) : null, query.end_date ? dayjs(query.end_date) : null]);
            setSyncOpen(true);
          }}
        >
          同步数据
        </BaseButton>
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

