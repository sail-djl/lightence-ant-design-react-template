import React, { useState, useCallback, useEffect } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import { BaseCollapse } from '@app/components/common/BaseCollapse/BaseCollapse';
import { BaseTag } from '@app/components/common/BaseTag/BaseTag';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { AppDate, Dates } from '@app/constants/Dates';
import { notificationController } from '@app/controllers/notificationController';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { IndexGlobal, getIndexGlobalList, syncIndexGlobal, IndexGlobalSyncPayload } from '@app/api/datamarket/index.api';
import { trim } from '../utils';

export const IndexGlobalTab: React.FC = () => {
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

  const [query, setQuery] = useState({ ts_code: [] as string[], start_date: '', end_date: '' });
  const [rows, setRows] = useState<IndexGlobal[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncPayload, setSyncPayload] = useState<IndexGlobalSyncPayload>({});
  const [syncRange, setSyncRange] = useState<[AppDate | null, AppDate | null]>([null, null]);
  
  // 同步弹框中的指数列表选择器相关
  const [syncCollapseOpen, setSyncCollapseOpen] = useState<string[]>([]);
  const [selectedSyncCodes, setSelectedSyncCodes] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // 国际指数选项列表（根据 Tushare Pro 文档）
  const globalIndexOptions = [
    { value: 'XIN9', label: '富时中国A50指数 (富时A50)' },
    { value: 'HSI', label: '恒生指数' },
    { value: 'HKTECH', label: '恒生科技指数' },
    { value: 'HKAH', label: '恒生AH股H指数' },
    { value: 'DJI', label: '道琼斯工业指数' },
    { value: 'SPX', label: '标普500指数' },
    { value: 'IXIC', label: '纳斯达克指数' },
    { value: 'FTSE', label: '富时100指数' },
    { value: 'FCHI', label: '法国CAC40指数' },
    { value: 'GDAXI', label: '德国DAX指数' },
    { value: 'N225', label: '日经225指数' },
    { value: 'KS11', label: '韩国综合指数' },
    { value: 'AS51', label: '澳大利亚标普200指数' },
    { value: 'SENSEX', label: '印度孟买SENSEX指数' },
    { value: 'IBOVESPA', label: '巴西IBOVESPA指数' },
    { value: 'RTS', label: '俄罗斯RTS指数' },
    { value: 'TWII', label: '台湾加权指数' },
    { value: 'CKLSE', label: '马来西亚指数' },
    { value: 'SPTSX', label: '加拿大S&P/TSX指数' },
    { value: 'CSX5P', label: 'STOXX欧洲50指数' },
    { value: 'RUT', label: '罗素2000指数' },
  ];

  // 指数代码到名称的映射字典
  const indexNameMap: Record<string, string> = Object.fromEntries(
    globalIndexOptions.map(item => [item.value, item.label])
  );

  // 过滤后的选项列表（用于折叠面板中的表格）
  const filteredOptions = globalIndexOptions.filter(
    (item) =>
      !searchKeyword ||
      item.value.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.label.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getIndexGlobalList({
        ts_code: query.ts_code.length > 0 ? query.ts_code.join(',') : undefined,
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
    // 如果有 ts_code 或日期范围，就触发查询
    if (query.ts_code.length > 0 || query.start_date || query.end_date) {
      fetchData();
    }
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [query.ts_code, query.start_date, query.end_date]);

  const columns: ColumnsType<IndexGlobal> = [
    { title: '指数代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center' },
    { 
      title: '指数名称', 
      dataIndex: 'ts_code', 
      key: 'index_name', 
      align: 'left',
      width: 200,
      render: (ts_code: string) => indexNameMap[ts_code] || '-'
    },
    { title: '交易日期', dataIndex: 'trade_date', key: 'trade_date', align: 'center' },
    { title: '收盘点位', dataIndex: 'close', key: 'close', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: '开盘点位', dataIndex: 'open', key: 'open', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: '最高点位', dataIndex: 'high', key: 'high', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: '最低点位', dataIndex: 'low', key: 'low', align: 'right', render: (v: number) => v?.toFixed(4) || '-' },
    { title: '涨跌幅(%)', dataIndex: 'pct_chg', key: 'pct_chg', align: 'right', render: (v: number) => (v ? `${v.toFixed(2)}%` : '-') },
    { title: '振幅', dataIndex: 'swing', key: 'swing', align: 'right', render: (v: number) => (v ? `${v.toFixed(2)}%` : '-') },
  ];

  // 同步弹框中的表格列定义
  const indexSelectColumns: ColumnsType<typeof globalIndexOptions[0]> = [
    { title: '指数代码', dataIndex: 'value', key: 'value', align: 'center', width: 120 },
    { title: '指数名称', dataIndex: 'label', key: 'label', align: 'left' },
  ];

  // 同步弹框打开时初始化已选择的代码
  const handleSyncOpen = () => {
    const currentCodes = query.ts_code.length > 0 ? query.ts_code : selectedSyncCodes;
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
          options={globalIndexOptions}
          style={{ width: 300 }}
          maxTagCount="responsive"
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) ||
            (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
          }
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
            setQuery({ ts_code: [], start_date: '', end_date: '' });
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
        title="国际指数同步"
        open={syncOpen}
        onCancel={() => {
          setSyncOpen(false);
          setSyncCollapseOpen([]);
          setSearchKeyword('');
        }}
        confirmLoading={syncLoading}
        width={800}
        onOk={async () => {
          setSyncLoading(true);
          try {
            const payload: IndexGlobalSyncPayload = {
              ts_code: selectedSyncCodes.length > 0 ? selectedSyncCodes.join(',') : undefined,
              start_date: syncRange[0] ? Dates.format(syncRange[0], 'YYYY-MM-DD') : undefined,
              end_date: syncRange[1] ? Dates.format(syncRange[1], 'YYYY-MM-DD') : undefined,
            };
            const result = await syncIndexGlobal(payload);
            notificationController.success({ message: `同步完成：成功 ${result.success} 条，失败 ${result.failed} 条` });
            setSyncOpen(false);
            setSyncCollapseOpen([]);
            setSearchKeyword('');
            fetchData();
          } catch (e: any) {
            notificationController.error({ message: e?.message || '同步失败' });
          } finally {
            setSyncLoading(false);
          }
        }}
      >
        <BaseForm layout="vertical">
          <BaseForm.Item label="指数代码">
            <BaseSpace direction="vertical" style={{ width: '100%' }} size="middle">
              {/* 已选择的指数标签 */}
              {selectedSyncCodes.length > 0 && (
                <div style={{ marginBottom: '8px' }}>
                  <BaseSpace wrap>
                    {selectedSyncCodes.map((code) => {
                      const indexInfo = globalIndexOptions.find(item => item.value === code);
                      return (
                        <BaseTag
                          key={code}
                          closable
                          onClose={() => handleRemoveSyncCode(code)}
                          color="blue"
                        >
                          {code} {indexInfo?.label ? `- ${indexInfo.label}` : ''}
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
                    <BaseInput
                      placeholder="搜索指数代码或名称"
                      allowClear
                      value={searchKeyword}
                      onChange={(e) => {
                        setSearchKeyword(e.target.value);
                      }}
                      style={{ width: '100%' }}
                    />
                    <BaseTable
                      columns={indexSelectColumns}
                      dataSource={filteredOptions}
                      rowKey="value"
                      rowSelection={{
                        selectedRowKeys: selectedSyncCodes,
                        onChange: (keys) => handleSyncCodesChange(keys as string[]),
                      }}
                      pagination={false}
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

