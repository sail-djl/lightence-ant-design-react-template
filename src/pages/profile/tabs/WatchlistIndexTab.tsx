import React, { useState, useCallback, useEffect } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { ColumnsType } from 'antd/es/table';
import { getIndexBasicList, IndexBasic } from '@app/api/datamarket/index.api';
import { getUserConfigList, createUserConfig, UserConfig } from '@app/api/userconfig.api';
import { generateConfigKey } from '@app/pages/userconfig/constants';
import { notificationController } from '@app/controllers/notificationController';

export const WatchlistIndexTab: React.FC = () => {
  const [rows, setRows] = useState<IndexBasic[]>([]);
  const [loading, setLoading] = useState(false);
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

  // 获取指数代码数组
  const getIndexCodes = useCallback((userConfig: UserConfig): string[] => {
    return userConfig.config_value?.index_codes || [];
  }, []);

  // 获取排序顺序
  const getSortOrder = useCallback((userConfig: UserConfig): Record<string, number> => {
    return userConfig.config_value?.sort_order?.index || {};
  }, []);

  // 查询指数数据
  const fetchData = useCallback(
    async () => {
      setLoading(true);
      try {
        // 1. 获取或初始化配置
        const userConfig = await loadOrInitConfig();

        // 2. 获取 index_codes
        const indexCodes = getIndexCodes(userConfig);

        // 3. 如果没有指数代码，显示空列表
        if (indexCodes.length === 0) {
          setRows([]);
          setTotal(0);
          return;
        }

        // 4. 将数组转为逗号分隔字符串，使用 ts_code 查询指定的指数
        const indexResponse = await getIndexBasicList({
          ts_code: indexCodes.join(','), // 转为逗号分隔字符串
          skip: 0,
          limit: 1000, // 获取所有配置的指数
        });

        // 5. 根据配置中的排序顺序排序
        const sortOrder = getSortOrder(userConfig);
        const sortedData = [...indexResponse.data].sort((a, b) => {
          const orderA = sortOrder[a.ts_code] || 999;
          const orderB = sortOrder[b.ts_code] || 999;
          return orderA - orderB;
        });

        setRows(sortedData);
        setTotal(sortedData.length); // 总数就是配置的指数数量
      } catch (error) {
        notificationController.error({
          message: error instanceof Error ? error.message : '加载指数数据失败',
        });
        setRows([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [loadOrInitConfig, getIndexCodes, getSortOrder]
  );

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRemove = (code: string) => {
    // TODO: 实现移除逻辑
    console.log('Remove index:', code);
  };

  const handleRefresh = () => {
    fetchData();
  };

  const columns: ColumnsType<IndexBasic> = [
    { title: '指数代码', dataIndex: 'ts_code', key: 'ts_code', align: 'center' },
    { title: '指数名称', dataIndex: 'name', key: 'name', align: 'center' },
    { title: '市场', dataIndex: 'market', key: 'market', align: 'center' },
    { title: '发布机构', dataIndex: 'publisher', key: 'publisher', align: 'center' },
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
        pagination={false}
      />
    </>
  );
};

