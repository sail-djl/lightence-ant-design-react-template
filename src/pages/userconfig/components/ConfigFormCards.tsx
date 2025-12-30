import React, { useEffect, useState, useCallback } from 'react';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseCheckbox } from '@app/components/common/BaseCheckbox/BaseCheckbox';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { getIndexBasicList, IndexBasic } from '@app/api/datamarket/index.api';
import * as S from './ConfigFormCards.styles';

interface ConfigFormCardsProps {
  configType: string;
  initialValue?: Record<string, any>;
  onConfigValueChange: (value: Record<string, any>) => void;
}

export const ConfigFormCards: React.FC<ConfigFormCardsProps> = ({
  configType,
  initialValue,
  onConfigValueChange,
}) => {
  const [form] = BaseForm.useForm();
  const [selectedIndexes, setSelectedIndexes] = useState<string[]>([]);
  const [indexOptions, setIndexOptions] = useState<IndexBasic[]>([]);
  const [indexSelectModalVisible, setIndexSelectModalVisible] = useState(false);
  const [indexSearchKeyword, setIndexSearchKeyword] = useState('');
  const [indexOptionsLoading, setIndexOptionsLoading] = useState(false);

  useEffect(() => {
    if (configType === 'dashboard_index_overview' && initialValue) {
      const tsCodes = initialValue.ts_codes || [];
      setSelectedIndexes(tsCodes);
      form.setFieldsValue({
        ts_codes: tsCodes,
        display_options: initialValue.display_options || {
          show_volume: true,
          show_turnover: true,
          show_pe: true,
          show_pb: true,
          show_ytd: true,
        },
      });
    } else if (
      (configType === 'index_daily_query' ||
        configType === 'index_weekly_query' ||
        configType === 'index_dailybasic_query' ||
        configType === 'index_global_query' ||
        configType === 'index_factor_query' ||
        configType === 'sw_daily_query') &&
      initialValue
    ) {
      form.setFieldsValue({
        default_ts_codes: (initialValue.default_ts_codes || []).join(','),
        start_days: initialValue.default_date_range?.start_days || 30,
        end_days: initialValue.default_date_range?.end_days || 0,
        default_limit: initialValue.default_limit || 1000,
        default_trade_date: initialValue.default_trade_date,
      });
    } else if (configType === 'index_sync_settings' && initialValue) {
      form.setFieldsValue({
        auto_sync: initialValue.auto_sync || false,
        sync_interval: initialValue.sync_interval || 3600,
        sync_start_days: initialValue.default_date_range?.start_days || 365,
        sync_end_days: initialValue.default_date_range?.end_days || 0,
        batch_size: initialValue.batch_size || 10,
      });
    }
  }, [configType, initialValue, form]);

  const updateConfigValue = React.useCallback(() => {
    const values = form.getFieldsValue();
    let configValue: Record<string, any> = {};

    if (configType === 'dashboard_index_overview') {
      const sortOrder: Record<string, number> = {};
      selectedIndexes.forEach((code, index) => {
        sortOrder[code] = index + 1;
      });
      configValue = {
        ts_codes: selectedIndexes,
        sort_order: sortOrder,
        display_options: values.display_options || {
          show_volume: true,
          show_turnover: true,
          show_pe: true,
          show_pb: true,
          show_ytd: true,
        },
      };
    } else if (
      configType === 'index_daily_query' ||
      configType === 'index_weekly_query'
    ) {
      const tsCodes = values.default_ts_codes
        ? values.default_ts_codes.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];
      configValue = {
        default_ts_codes: tsCodes,
        default_date_range: {
          start_days: parseInt(values.start_days) || 30,
          end_days: parseInt(values.end_days) || 0,
        },
        default_limit: parseInt(values.default_limit) || 1000,
      };
    } else if (
      configType === 'index_dailybasic_query' ||
      configType === 'index_global_query' ||
      configType === 'sw_daily_query'
    ) {
      const tsCodes = values.default_ts_codes
        ? values.default_ts_codes.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];
      configValue = {
        default_ts_codes: tsCodes,
        default_date_range: {
          start_days: parseInt(values.start_days) || 30,
          end_days: parseInt(values.end_days) || 0,
        },
      };
    } else if (configType === 'index_factor_query') {
      const tsCodes = values.default_ts_codes
        ? values.default_ts_codes.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];
      configValue = {
        default_ts_codes: tsCodes,
        default_trade_date: values.default_trade_date || null,
        default_date_range: {
          start_days: parseInt(values.start_days) || 30,
          end_days: parseInt(values.end_days) || 0,
        },
      };
    } else if (configType === 'index_sync_settings') {
      configValue = {
        auto_sync: values.auto_sync || false,
        sync_interval: parseInt(values.sync_interval) || 3600,
        default_date_range: {
          start_days: parseInt(values.sync_start_days) || 365,
          end_days: parseInt(values.sync_end_days) || 0,
        },
        batch_size: parseInt(values.batch_size) || 10,
      };
    }

    onConfigValueChange(configValue);
  }, [configType, form, selectedIndexes, onConfigValueChange]);

  useEffect(() => {
    const timer = setTimeout(updateConfigValue, 100);
    return () => clearTimeout(timer);
  }, [updateConfigValue]);

  const loadIndexOptions = useCallback(async (keyword?: string) => {
    setIndexOptionsLoading(true);
    try {
      const response = await getIndexBasicList({
        skip: 0,
        limit: 500,
        keyword: keyword || undefined,
      });
      setIndexOptions(response.data);
    } catch (error) {
      console.error('Failed to load index options:', error);
      setIndexOptions([]);
    } finally {
      setIndexOptionsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (indexSelectModalVisible) {
      // 打开弹窗时，如果有搜索关键词则使用关键词搜索，否则加载默认列表
      if (indexSearchKeyword) {
        loadIndexOptions(indexSearchKeyword);
      } else {
        loadIndexOptions();
      }
    }
  }, [indexSelectModalVisible, loadIndexOptions]);

  const handleAddIndex = () => {
    setIndexSelectModalVisible(true);
  };

  const handleRemoveIndex = (code: string) => {
    setSelectedIndexes((prev) => prev.filter((c) => c !== code));
  };

  const handleConfirmIndexSelection = (selectedCodes: string[]) => {
    setSelectedIndexes((prev) => {
      const newCodes = [...prev];
      selectedCodes.forEach((code) => {
        if (!newCodes.includes(code)) {
          newCodes.push(code);
        }
      });
      return newCodes;
    });
    setIndexSelectModalVisible(false);
  };

  // 处理搜索关键词变化，使用防抖
  useEffect(() => {
    if (!indexSelectModalVisible) {
      return;
    }

    const timer = setTimeout(() => {
      if (indexSearchKeyword) {
        loadIndexOptions(indexSearchKeyword);
      } else {
        loadIndexOptions();
      }
    }, 300); // 300ms 防抖

    return () => clearTimeout(timer);
  }, [indexSearchKeyword, indexSelectModalVisible, loadIndexOptions]);

  const indexTableColumns: ColumnsType<IndexBasic> = [
    {
      title: '指数代码',
      dataIndex: 'ts_code',
      key: 'ts_code',
    },
    {
      title: '指数名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: IndexBasic) => (
        <BaseButton
          type="link"
          size="small"
          onClick={() => handleConfirmIndexSelection([record.ts_code])}
        >
          选择
        </BaseButton>
      ),
    },
  ];

  if (configType === 'dashboard_index_overview') {
    return (
      <>
        <S.FormCard>
          <S.FormCardTitle>指数列表配置</S.FormCardTitle>
          <BaseForm form={form} layout="vertical" onValuesChange={updateConfigValue}>
            <S.IndexSelectSection>
              <div style={{ marginBottom: 12 }}>
                <span>已选指数（可拖拽排序）：</span>
              </div>
              <S.IndexList>
                {selectedIndexes.map((code, index) => {
                  const indexInfo = indexOptions.find((opt) => opt.ts_code === code);
                  return (
                    <S.IndexItem key={code}>
                      <span style={{ marginRight: 8 }}>☰</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{code}</div>
                        <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                          {indexInfo?.name || ''}
                        </div>
                      </div>
                      <BaseButton
                        type="link"
                        danger
                        size="small"
                        onClick={() => handleRemoveIndex(code)}
                      >
                        删除
                      </BaseButton>
                    </S.IndexItem>
                  );
                })}
                {selectedIndexes.length === 0 && (
                  <div style={{ textAlign: 'center', color: '#8c8c8c', padding: 20 }}>
                    暂无已选指数
                  </div>
                )}
              </S.IndexList>
              <BaseButton
                type="dashed"
                block
                onClick={handleAddIndex}
                style={{ marginTop: 8 }}
              >
                + 添加指数
              </BaseButton>
            </S.IndexSelectSection>
          </BaseForm>
        </S.FormCard>
        <S.FormCard>
          <S.FormCardTitle>显示选项</S.FormCardTitle>
          <BaseForm form={form} layout="vertical" onValuesChange={updateConfigValue}>
            <BaseForm.Item name={['display_options', 'show_volume']} valuePropName="checked">
              <BaseCheckbox>显示成交量</BaseCheckbox>
            </BaseForm.Item>
            <BaseForm.Item name={['display_options', 'show_turnover']} valuePropName="checked">
              <BaseCheckbox>显示成交额</BaseCheckbox>
            </BaseForm.Item>
            <BaseForm.Item name={['display_options', 'show_pe']} valuePropName="checked">
              <BaseCheckbox>显示PE分位数</BaseCheckbox>
            </BaseForm.Item>
            <BaseForm.Item name={['display_options', 'show_pb']} valuePropName="checked">
              <BaseCheckbox>显示PB分位数</BaseCheckbox>
            </BaseForm.Item>
            <BaseForm.Item name={['display_options', 'show_ytd']} valuePropName="checked">
              <BaseCheckbox>显示年初至今涨跌幅</BaseCheckbox>
            </BaseForm.Item>
          </BaseForm>
        </S.FormCard>
        <BaseModal
          title="选择指数"
          open={indexSelectModalVisible}
          onCancel={() => {
            setIndexSelectModalVisible(false);
            setIndexSearchKeyword(''); // 关闭时清空搜索关键词
          }}
          width={800}
          footer={null}
        >
          <BaseInput
            placeholder="搜索指数代码或名称..."
            value={indexSearchKeyword}
            onChange={(e) => setIndexSearchKeyword(e.target.value)}
            style={{ marginBottom: 16 }}
            allowClear
          />
          <BaseTable
            columns={indexTableColumns}
            dataSource={indexOptions}
            rowKey="ts_code"
            loading={indexOptionsLoading}
            pagination={{ pageSize: 10 }}
            scroll={{ y: 400 }}
          />
        </BaseModal>
      </>
    );
  }

  if (
    configType === 'index_daily_query' ||
    configType === 'index_weekly_query' ||
    configType === 'index_dailybasic_query' ||
    configType === 'index_global_query' ||
    configType === 'index_factor_query' ||
    configType === 'sw_daily_query'
  ) {
    const typeName = {
      index_daily_query: '指数日线查询',
      index_weekly_query: '指数周线查询',
      index_dailybasic_query: '大盘指数每日指标查询',
      index_global_query: '国际指数查询',
      index_factor_query: '指数技术因子查询',
      sw_daily_query: '申万行业日线查询',
    }[configType] || '查询配置';

    return (
      <S.FormCard>
        <S.FormCardTitle>{typeName}配置</S.FormCardTitle>
        <BaseForm form={form} layout="vertical" onValuesChange={updateConfigValue}>
          <BaseForm.Item name="default_ts_codes" label="默认指数代码（多个用逗号分隔）">
            <BaseInput.TextArea
              rows={3}
              placeholder="000001.SH,000300.SH"
            />
          </BaseForm.Item>
          <BaseSpace>
            <BaseForm.Item name="start_days" label="起始日期偏移（天数）">
              <BaseInput type="number" placeholder="30" />
            </BaseForm.Item>
            <BaseForm.Item name="end_days" label="结束日期偏移（天数）">
              <BaseInput type="number" placeholder="0" />
            </BaseForm.Item>
          </BaseSpace>
          {configType === 'index_factor_query' && (
            <BaseForm.Item name="default_trade_date" label="默认交易日期（可选）">
              <BaseInput type="date" />
            </BaseForm.Item>
          )}
          {(configType === 'index_daily_query' || configType === 'index_weekly_query') && (
            <BaseForm.Item name="default_limit" label="默认查询条数">
              <BaseInput type="number" placeholder="1000" />
            </BaseForm.Item>
          )}
        </BaseForm>
      </S.FormCard>
    );
  }

  if (configType === 'index_sync_settings') {
    return (
      <S.FormCard>
        <S.FormCardTitle>同步设置配置</S.FormCardTitle>
        <BaseForm form={form} layout="vertical" onValuesChange={updateConfigValue}>
          <BaseForm.Item name="auto_sync" valuePropName="checked">
            <BaseCheckbox>自动同步</BaseCheckbox>
          </BaseForm.Item>
          <BaseForm.Item name="sync_interval" label="同步间隔（秒）">
            <BaseInput type="number" placeholder="3600" />
          </BaseForm.Item>
          <BaseSpace>
            <BaseForm.Item name="sync_start_days" label="默认起始日期偏移（天数）">
              <BaseInput type="number" placeholder="365" />
            </BaseForm.Item>
            <BaseForm.Item name="sync_end_days" label="默认结束日期偏移（天数）">
              <BaseInput type="number" placeholder="0" />
            </BaseForm.Item>
          </BaseSpace>
          <BaseForm.Item name="batch_size" label="批量大小">
            <BaseInput type="number" placeholder="10" />
          </BaseForm.Item>
        </BaseForm>
      </S.FormCard>
    );
  }

  return null;
};

