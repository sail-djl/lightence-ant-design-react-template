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
import { SwDaily, getSwDailyList, syncSwDaily, SwDailySyncPayload, IndexBasic, getIndexBasicList } from '@app/api/datamarket/index.api';
import { trim } from '../utils';

export const SwDailyTab: React.FC = () => {
  const [query, setQuery] = useState({ ts_code: [] as string[], start_date: '', end_date: '' });
  const [rows, setRows] = useState<SwDaily[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncPayload, setSyncPayload] = useState<SwDailySyncPayload>({});
  const [syncRange, setSyncRange] = useState<[AppDate | null, AppDate | null]>([null, null]);
  
  // 查询区域的指数选项列表（申万行业代码）
  const [indexOptions, setIndexOptions] = useState<IndexBasic[]>([]);
  const [indexOptionsLoading, setIndexOptionsLoading] = useState(false);

  // 加载查询区域的指数选项列表（支持关键词搜索，过滤申万行业代码）
  const fetchIndexOptions = useCallback(async (keyword?: string) => {
    setIndexOptionsLoading(true);
    try {
      // 如果有关键词，使用关键词搜索；否则使用 'SI' 作为默认搜索
      const searchKeyword = keyword || 'SI';
      const res = await getIndexBasicList({
        skip: 0,
        limit: 500,
        keyword: searchKeyword,
      });
      // 过滤出申万行业代码（以 .SI 结尾）
      const swOptions = res.data.filter(item => item.ts_code.endsWith('.SI'));
      setIndexOptions(swOptions);
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
      const res = await getSwDailyList({
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

  const columns: ColumnsType<SwDaily> = [
    { title: '指数代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center' },
    { title: '指数名称', dataIndex: 'name', key: 'name', align: 'center', render: (v: string) => v || '-' },
    { title: '交易日期', dataIndex: 'trade_date', key: 'trade_date', align: 'center' },
    { title: '收盘点位', dataIndex: 'close', key: 'close', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: '开盘点位', dataIndex: 'open', key: 'open', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: '涨跌幅(%)', dataIndex: 'pct_change', key: 'pct_change', align: 'right', render: (v: number) => (v ? `${v.toFixed(2)}%` : '-') },
    { title: '成交量(万股)', dataIndex: 'vol', key: 'vol', align: 'right', render: (v: number) => v?.toLocaleString() || '-' },
    { title: '市盈率', dataIndex: 'pe', key: 'pe', align: 'right', render: (v: number) => v?.toFixed(2) || '-' },
    { title: '市净率', dataIndex: 'pb', key: 'pb', align: 'right', render: (v: number) => v?.toFixed(2) || '-' },
  ];

  return (
    <>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <BaseSelect
          mode="multiple"
          placeholder="选择行业代码"
          allowClear
          value={query.ts_code}
          onChange={(val) => setQuery((prev) => ({ ...prev, ts_code: val as string[] }))}
          style={{ width: 300 }}
          maxTagCount="responsive"
          showSearch
          loading={indexOptionsLoading}
          onSearch={(value) => {
            // 当用户输入时，使用远程搜索重新加载选项列表
            if (value) {
              fetchIndexOptions(value);
            } else {
              fetchIndexOptions();
            }
          }}
          filterOption={false}
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

