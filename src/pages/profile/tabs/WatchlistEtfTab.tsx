import React, { useState, useCallback, useEffect } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { ColumnsType } from 'antd/es/table';
import { Tag } from 'antd';
import { getEtfBasicList, EtfBasic } from '@app/api/datamarket/etf.api';
import { getUserConfigList, createUserConfig, UserConfig } from '@app/api/userconfig.api';
import { generateConfigKey } from '@app/pages/userconfig/constants';
import { notificationController } from '@app/controllers/notificationController';

export const WatchlistEtfTab: React.FC = () => {
  const [rows, setRows] = useState<EtfBasic[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [total, setTotal] = useState(0);
  const [config, setConfig] = useState<UserConfig | null>(null);

  // 获取或初始化用户配置
  const loadOrInitConfig = useCallback(async (): Promise<UserConfig> => {
    try {
      // 1. 读取配置
      const response = await getUserConfigList({
        module: 'watchlist',
        config_type: 'base',
        limit: 1,
      });

      let userConfig: UserConfig | null = response.data.length > 0 ? response.data[0] : null;

      // 2. 如果配置为空或 config_value 为空对象，初始化配置
      if (
        !userConfig ||
        !userConfig.config_value ||
        Object.keys(userConfig.config_value).length === 0
      ) {
        userConfig = await createUserConfig({
          module: 'watchlist',
          config_type: 'base',
          config_key: generateConfigKey('watchlist', 'base'),
          config_value: {}, // 空对象
          is_active: true,
          is_default: true,
          description: null,
        });
      }

      setConfig(userConfig);
      return userConfig;
    } catch (error) {
      notificationController.error({
        message: error instanceof Error ? error.message : '加载配置失败',
      });
      throw error;
    }
  }, []);

  // 获取 ETF 代码数组
  const getEtfCodes = useCallback((userConfig: UserConfig): string[] => {
    return userConfig.config_value?.etf_codes || [];
  }, []);

  // 获取排序顺序
  const getSortOrder = useCallback((userConfig: UserConfig): Record<string, number> => {
    return userConfig.config_value?.sort_order?.etf || {};
  }, []);

  // 查询 ETF 数据
  const fetchData = useCallback(
    async (page = 1, pageSize = 10) => {
      setLoading(true);
      try {
        // 1. 获取或初始化配置
        const userConfig = await loadOrInitConfig();

        // 2. 获取 etf_codes
        const etfCodes = getEtfCodes(userConfig);

        // 3. 如果没有 ETF 代码，显示空列表
        if (etfCodes.length === 0) {
          setRows([]);
          setTotal(0);
          setPagination({ current: page, pageSize });
          return;
        }

        // 4. 使用 ts_codes 查询指定的 ETF（不需要分页，因为是指定的 ETF 列表）
        const etfResponse = await getEtfBasicList({
          ts_codes: etfCodes,
          skip: 0,
          limit: 1000, // 获取所有配置的 ETF
        });

        // 5. 根据配置中的排序顺序排序
        const sortOrder = getSortOrder(userConfig);
        const sortedData = [...etfResponse.data].sort((a, b) => {
          const orderA = sortOrder[a.ts_code] || 999;
          const orderB = sortOrder[b.ts_code] || 999;
          return orderA - orderB;
        });

        setRows(sortedData);
        setTotal(sortedData.length); // 总数就是配置的 ETF 数量
        setPagination({ current: page, pageSize });
      } catch (error) {
        notificationController.error({
          message: error instanceof Error ? error.message : '加载ETF数据失败',
        });
        setRows([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [loadOrInitConfig, getEtfCodes, getSortOrder]
  );

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRemove = (code: string) => {
    // TODO: 实现移除逻辑
    console.log('Remove ETF:', code);
  };

  const handleRefresh = () => {
    fetchData(pagination.current, pagination.pageSize);
  };

  const exchangeText = (exchange?: string) => {
    if (exchange === 'SH') return '上交所';
    if (exchange === 'SZ') return '深交所';
    return exchange || '-';
  };

  const columns: ColumnsType<EtfBasic> = [
    { title: '代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center' },
    { title: '简称', dataIndex: 'csname', key: 'csname', align: 'center' },
    {
      title: '交易所',
      dataIndex: 'exchange',
      key: 'exchange',
      align: 'center',
      render: (v) => exchangeText(v),
    },
    {
      title: '指数代码',
      dataIndex: 'index_code',
      key: 'index_code',
      align: 'center',
      render: (v) => v || '-',
    },
    {
      title: '指数名称',
      dataIndex: 'index_name',
      key: 'index_name',
      align: 'center',
      render: (v) => v || '-',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <BaseButton size="small" danger onClick={() => handleRemove(record.ts_code)}>
          移除
        </BaseButton>
      ),
    },
  ];

  return (
    <>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem' }}>
        <BaseButton onClick={handleRefresh}>刷新</BaseButton>
      </BaseSpace>
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

