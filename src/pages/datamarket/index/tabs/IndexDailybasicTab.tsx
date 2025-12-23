import React, { useState, useCallback, useEffect } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseCollapse } from '@app/components/common/BaseCollapse/BaseCollapse';
import { BaseTag } from '@app/components/common/BaseTag/BaseTag';
import { AppDate, Dates } from '@app/constants/Dates';
import { notificationController } from '@app/controllers/notificationController';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { IndexDailybasic, getIndexDailybasicList, syncIndexDailybasic, IndexDailybasicSyncPayload, IndexBasic, getIndexBasicList } from '@app/api/index.api';
import { trim } from '../utils';

export const IndexDailybasicTab: React.FC = () => {
  // 日期范围快捷选项（函数形式，每次调用时重新计算，确保日期是最新的）
  const getDateRanges = useCallback(() => {
    const today = dayjs();
    return {
      '最近一周': [dayjs().subtract(7, 'day'), today] as [AppDate, AppDate],
      '最近一月': [dayjs().subtract(1, 'month'), today] as [AppDate, AppDate],
      '最近一年': [dayjs().subtract(1, 'year'), today] as [AppDate, AppDate],
      '最近五年': [dayjs().subtract(5, 'year'), today] as [AppDate, AppDate],
      '最近十年': [dayjs().subtract(10, 'year'), today] as [AppDate, AppDate],
    };
  }, []);

  const [query, setQuery] = useState({ ts_code: [] as string[], trade_date: '', start_date: '', end_date: '' });
  const [rows, setRows] = useState<IndexDailybasic[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncPayload, setSyncPayload] = useState<IndexDailybasicSyncPayload>({});
  const [syncRange, setSyncRange] = useState<[AppDate | null, AppDate | null]>([null, null]);
  
  // 查询区域的指数选项列表
  const [indexOptions, setIndexOptions] = useState<IndexBasic[]>([]);
  const [indexOptionsLoading, setIndexOptionsLoading] = useState(false);
  
  // 同步弹框中的指数列表选择器相关
  const [syncCollapseOpen, setSyncCollapseOpen] = useState<string[]>([]);
  const [indexBasicList, setIndexBasicList] = useState<IndexBasic[]>([]);
  const [indexBasicLoading, setIndexBasicLoading] = useState(false);
  const [indexBasicKeyword, setIndexBasicKeyword] = useState('');
  const [selectedSyncCodes, setSelectedSyncCodes] = useState<string[]>([]);
  const [indexBasicPagination, setIndexBasicPagination] = useState({ current: 1, pageSize: 20 });
  const [indexBasicTotal, setIndexBasicTotal] = useState(0);

  // 加载查询区域的指数选项列表（支持关键词搜索）
  const fetchIndexOptions = useCallback(async (keyword?: string) => {
    setIndexOptionsLoading(true);
    try {
      const res = await getIndexBasicList({
        skip: 0,
        limit: 500,
        keyword: keyword || undefined,
      });
      setIndexOptions(res.data);
    } finally {
      setIndexOptionsLoading(false);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getIndexDailybasicList({
        ts_code: query.ts_code.length > 0 ? query.ts_code.join(',') : undefined,
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

  // 获取指数基础信息列表（用于同步弹框的选择器）
  const fetchIndexBasicList = useCallback(async (page = 1, pageSize = 20, keyword = '') => {
    setIndexBasicLoading(true);
    try {
      const res = await getIndexBasicList({
        skip: (page - 1) * pageSize,
        limit: pageSize,
        keyword: keyword || undefined,
      });
      setIndexBasicList(res.data);
      setIndexBasicTotal(res.count);
      setIndexBasicPagination({ current: page, pageSize });
    } finally {
      setIndexBasicLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIndexOptions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 当折叠面板展开时加载指数列表
  useEffect(() => {
    if (syncCollapseOpen.includes('select')) {
      fetchIndexBasicList(1, indexBasicPagination.pageSize, indexBasicKeyword);
    }
  }, [syncCollapseOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (query.ts_code.length > 0 || query.trade_date || query.start_date || query.end_date) {
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

  const indexBasicColumns: ColumnsType<IndexBasic> = [
    { title: '指数代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center', width: 120 },
    { title: '指数名称', dataIndex: 'name', key: 'name', align: 'left' },
    { title: '市场', dataIndex: 'market', key: 'market', align: 'center', width: 80 },
  ];

  // 同步弹框打开时初始化已选择的代码
  const handleSyncOpen = () => {
    const currentCodes = query.ts_code.length > 0 ? query.ts_code : 
      (syncPayload.ts_code ? syncPayload.ts_code.split(',').map(c => c.trim()).filter(Boolean) : []);
    setSelectedSyncCodes(currentCodes);
    setSyncPayload({ ts_code: currentCodes.length > 0 ? currentCodes.join(',') : undefined });
    setSyncRange([query.start_date ? dayjs(query.start_date) : null, query.end_date ? dayjs(query.end_date) : null]);
    setSyncOpen(true);
  };

  // 更新已选择的代码
  const handleSyncCodesChange = (codes: string[]) => {
    setSelectedSyncCodes(codes);
    setSyncPayload({ ...syncPayload, ts_code: codes.length > 0 ? codes.join(',') : undefined });
  };

  // 删除已选择的代码
  const handleRemoveSyncCode = (code: string) => {
    const newCodes = selectedSyncCodes.filter(c => c !== code);
    handleSyncCodesChange(newCodes);
  };

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
            setQuery({ ts_code: [], trade_date: '', start_date: '', end_date: '' });
          }}
        >
          重置
        </BaseButton>
      </BaseSpace>

      <BaseSpace style={{ display: 'flex', marginBottom: '1rem' }}>
        <BaseButton
          type="primary"
          onClick={handleSyncOpen}
        >
          同步数据
        </BaseButton>
      </BaseSpace>

      <BaseModal
        title="大盘指数每日指标同步"
        open={syncOpen}
        onCancel={() => {
          setSyncOpen(false);
          setSyncCollapseOpen([]);
          setIndexBasicKeyword('');
        }}
        confirmLoading={syncLoading}
        width={800}
        onOk={async () => {
          if (selectedSyncCodes.length === 0) {
            notificationController.warning({ message: '请至少选择一个指数代码' });
            return;
          }
          setSyncLoading(true);
          try {
            const payload: IndexDailybasicSyncPayload = {
              ts_code: selectedSyncCodes.join(','),
              start_date: syncRange[0] ? Dates.format(syncRange[0], 'YYYY-MM-DD') : undefined,
              end_date: syncRange[1] ? Dates.format(syncRange[1], 'YYYY-MM-DD') : undefined,
            };
            const result = await syncIndexDailybasic(payload);
            notificationController.success({ message: `同步完成：成功 ${result.success} 条，失败 ${result.failed} 条` });
            setSyncOpen(false);
            setSyncCollapseOpen([]);
            setIndexBasicKeyword('');
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
            <BaseSpace direction="vertical" style={{ width: '100%' }} size="middle">
              {/* 已选择的指数标签 */}
              {selectedSyncCodes.length > 0 && (
                <div style={{ marginBottom: '8px' }}>
                  <BaseSpace wrap>
                    {selectedSyncCodes.map((code) => {
                      const indexInfo = indexOptions.find(item => item.ts_code === code) || 
                                       indexBasicList.find(item => item.ts_code === code);
                      return (
                        <BaseTag
                          key={code}
                          closable
                          onClose={() => handleRemoveSyncCode(code)}
                          color="blue"
                        >
                          {code} {indexInfo?.name ? `- ${indexInfo.name}` : ''}
                        </BaseTag>
                      );
                    })}
                  </BaseSpace>
                </div>
              )}
              {/* 折叠面板 */}
              <BaseCollapse
                activeKey={syncCollapseOpen}
                onChange={(keys) => setSyncCollapseOpen(keys as string[])}
              >
                <BaseCollapse.Panel
                  header={`从列表选择${selectedSyncCodes.length > 0 ? `（已选择 ${selectedSyncCodes.length} 个）` : ''}`}
                  key="select"
                >
                  <BaseSpace direction="vertical" style={{ width: '100%' }} size="middle">
                    <BaseSpace>
                      <BaseInput
                        placeholder="搜索指数代码或名称"
                        allowClear
                        value={indexBasicKeyword}
                        onChange={(e) => {
                          setIndexBasicKeyword(e.target.value);
                        }}
                        onPressEnter={() => fetchIndexBasicList(1, indexBasicPagination.pageSize, indexBasicKeyword)}
                        style={{ flex: 1 }}
                      />
                      <BaseButton
                        onClick={() => fetchIndexBasicList(1, indexBasicPagination.pageSize, indexBasicKeyword)}
                      >
                        搜索
                      </BaseButton>
                    </BaseSpace>
                    <BaseTable
                      columns={indexBasicColumns}
                      dataSource={indexBasicList}
                      rowKey="ts_code"
                      loading={indexBasicLoading}
                      rowSelection={{
                        selectedRowKeys: selectedSyncCodes,
                        onChange: (keys) => handleSyncCodesChange(keys as string[]),
                      }}
                      pagination={{
                        current: indexBasicPagination.current,
                        pageSize: indexBasicPagination.pageSize,
                        total: indexBasicTotal,
                        showSizeChanger: true,
                        showTotal: (total) => `共 ${total} 条`,
                        onChange: (page, pageSize) => fetchIndexBasicList(page, pageSize, indexBasicKeyword),
                      }}
                    />
                  </BaseSpace>
                </BaseCollapse.Panel>
              </BaseCollapse>
            </BaseSpace>
          </BaseForm.Item>
          <BaseForm.Item label="日期范围">
            <DayjsDatePicker.RangePicker
              format="YYYY-MM-DD"
              value={syncRange}
              onChange={(val) => setSyncRange([val?.[0] || null, val?.[1] || null])}
              ranges={getDateRanges()}
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

