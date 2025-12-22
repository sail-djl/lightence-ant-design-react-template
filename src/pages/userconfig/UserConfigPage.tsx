import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { notificationController } from '@app/controllers/notificationController';
import { ColumnsType } from 'antd/es/table';
import { Tag } from 'antd';
import {
  UserConfig,
  getUserConfigList,
  deleteUserConfig,
  UserConfigQuery,
} from '@app/api/userconfig.api';
import { ConfigFormModal } from './components/ConfigFormModal';
import * as S from './UserConfigPage.styles';

const initialPagination = {
  current: 1,
  pageSize: 10,
};

const MODULE_OPTIONS = [
  { label: '全部模块', value: '' },
  { label: '看板模块', value: 'dashboard' },
  { label: '指数模块', value: 'index' },
  { label: 'ETF模块', value: 'etf' },
  { label: '基金模块', value: 'fund' },
  { label: '股票模块', value: 'stock' },
  { label: '系统模块', value: 'system' },
];

const CONFIG_TYPE_OPTIONS = [
  { label: '全部类型', value: '' },
  { label: '看板指数概览', value: 'dashboard_index_overview' },
  { label: '指数日线查询', value: 'index_daily_query' },
  { label: '指数周线查询', value: 'index_weekly_query' },
  { label: '大盘指数每日指标查询', value: 'index_dailybasic_query' },
  { label: '国际指数查询', value: 'index_global_query' },
  { label: '指数技术因子查询', value: 'index_factor_query' },
  { label: '申万行业日线查询', value: 'sw_daily_query' },
  { label: '指数同步设置', value: 'index_sync_settings' },
];

const UserConfigPage: React.FC = () => {
  const { t } = useTranslation();
  const [configs, setConfigs] = useState<UserConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);
  const [total, setTotal] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingConfig, setEditingConfig] = useState<UserConfig | null>(null);
  const [filters, setFilters] = useState<UserConfigQuery>({
    module: undefined,
    config_type: undefined,
    is_active: undefined,
  });

  const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;

  const fetchConfigs = useCallback(
    async (page = 1, pageSize = 10) => {
      setLoading(true);
      try {
        const skip = (page - 1) * pageSize;
        const params: UserConfigQuery = {
          skip,
          limit: pageSize,
          ...filters,
        };
        const response = await getUserConfigList(params);
        setConfigs(response.data);
        setTotal(response.count);
        setPagination({ current: page, pageSize });
      } catch (error: unknown) {
        notificationController.error({
          message: getErrorMessage(error, '获取配置列表失败'),
        });
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  const handleTableChange = (page: number, pageSize: number) => {
    fetchConfigs(page, pageSize);
  };

  const handleCreate = () => {
    setEditingConfig(null);
    setIsModalVisible(true);
  };

  const handleEdit = (config: UserConfig) => {
    setEditingConfig(config);
    setIsModalVisible(true);
  };

  const handleDelete = async (config: UserConfig) => {
    try {
      await deleteUserConfig(config.id);
      notificationController.success({ message: '配置已删除' });
      fetchConfigs(pagination.current, pagination.pageSize);
    } catch (error: unknown) {
      notificationController.error({
        message: getErrorMessage(error, '删除配置失败'),
      });
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingConfig(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    fetchConfigs(pagination.current, pagination.pageSize);
  };

  const handleFilterChange = (key: keyof UserConfigQuery, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
    setPagination(initialPagination);
  };

  const handleRefresh = () => {
    fetchConfigs(pagination.current, pagination.pageSize);
  };

  const columns: ColumnsType<UserConfig> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      width: 120,
      render: (module: string) =>
        module ? <Tag color="blue">{module}</Tag> : <Tag>通用</Tag>,
    },
    {
      title: '配置类型',
      dataIndex: 'config_type',
      key: 'config_type',
      width: 200,
      render: (type: string) => <Tag color="green">{type}</Tag>,
    },
    {
      title: '配置键',
      dataIndex: 'config_key',
      key: 'config_key',
      width: 120,
    },
    {
      title: '是否默认',
      dataIndex: 'is_default',
      key: 'is_default',
      width: 100,
      render: (isDefault: boolean) =>
        isDefault ? <Tag color="orange">是</Tag> : <Tag>否</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 80,
      render: (isActive: boolean) =>
        isActive ? (
          <Tag color="success">启用</Tag>
        ) : (
          <Tag color="error">禁用</Tag>
        ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_: any, record: UserConfig) => (
        <BaseSpace>
          <BaseButton type="link" size="small" onClick={() => handleEdit(record)}>
            编辑
          </BaseButton>
          <BaseButton
            type="link"
            size="small"
            danger
            onClick={() => handleDelete(record)}
          >
            删除
          </BaseButton>
        </BaseSpace>
      ),
    },
  ];

  return (
    <>
      <PageTitle>用户配置管理</PageTitle>
      <S.Card>
        <S.FilterBar>
          <BaseSpace wrap>
            <S.FilterItem>
              <span>模块：</span>
              <BaseSelect
                style={{ width: 150 }}
                value={filters.module}
                onChange={(value) => handleFilterChange('module', value)}
                options={MODULE_OPTIONS}
              />
            </S.FilterItem>
            <S.FilterItem>
              <span>配置类型：</span>
              <BaseSelect
                style={{ width: 200 }}
                value={filters.config_type}
                onChange={(value) => handleFilterChange('config_type', value)}
                options={CONFIG_TYPE_OPTIONS}
              />
            </S.FilterItem>
            <S.FilterItem>
              <span>状态：</span>
              <BaseSelect
                style={{ width: 120 }}
                value={filters.is_active}
                onChange={(value) => handleFilterChange('is_active', value)}
                options={[
                  { label: '全部状态', value: undefined },
                  { label: '启用', value: true },
                  { label: '禁用', value: false },
                ]}
              />
            </S.FilterItem>
            <BaseButton onClick={handleRefresh}>刷新</BaseButton>
          </BaseSpace>
        </S.FilterBar>
        <BaseSpace style={{ display: 'flex', marginBottom: '1rem' }}>
          <BaseButton type="primary" onClick={handleCreate}>
            + 新增配置
          </BaseButton>
        </BaseSpace>
        <BaseTable
          columns={columns}
          dataSource={configs}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: handleTableChange,
            onShowSizeChange: handleTableChange,
          }}
          scroll={{ x: 'max-content' }}
        />
      </S.Card>
      <ConfigFormModal
        visible={isModalVisible}
        editingConfig={editingConfig}
        onCancel={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </>
  );
};

export default UserConfigPage;

