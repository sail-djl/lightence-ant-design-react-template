import React, { useCallback, useEffect, useState } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { ColumnsType } from 'antd/es/table';
import { IndexBasic, getIndexBasicList } from '@app/api/datamarket/index.api';
import { getIndexDailyList, IndexDaily } from '@app/api/datamarket/index.api';
import { notificationController } from '@app/controllers/notificationController';
import { getUserConfigList, createUserConfig, updateUserConfig, UserConfig } from '@app/api/userconfig.api';
import { generateConfigKey } from '@app/pages/userconfig/constants';
import dayjs from 'dayjs';

interface MarketIndexItem extends IndexBasic {
  latestPrice?: number;
  dailyChange?: number;
  dailyChangePercent?: number;
  yearChangePercent?: number;
  constituentCount?: number;
  relatedFundCount?: number;
  isInWatchlist?: boolean;
}

interface MarketIndexTabProps {
  keyword?: string;
  searchTrigger?: number;
}

const initialPagination = { current: 1, pageSize: 10 };

export const MarketIndexTab: React.FC<MarketIndexTabProps> = ({ keyword = '', searchTrigger = 0 }) => {
  const [rows, setRows] = useState<MarketIndexItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);
  const [total, setTotal] = useState(0);
  const [watchlistCodes, setWatchlistCodes] = useState<Set<string>>(new Set());
  const [watchlistConfig, setWatchlistConfig] = useState<UserConfig | null>(null);

  // 加载自选列表
  const loadWatchlist = useCallback(async () => {
    try {
      const response = await getUserConfigList({
        module: 'watchlist',
        config_type: 'base',
        limit: 1,
      });

      let config: UserConfig | null = response.data.length > 0 ? response.data[0] : null;

      if (!config || !config.config_value || Object.keys(config.config_value).length === 0) {
        config = await createUserConfig({
          module: 'watchlist',
          config_type: 'base',
          config_key: generateConfigKey('watchlist', 'base'),
          config_value: { index_codes: [], etf_codes: [] },
          is_active: true,
          is_default: true,
        });
      }

      setWatchlistConfig(config);
      const indexCodes = config.config_value?.index_codes || [];
      setWatchlistCodes(new Set(indexCodes));
    } catch (error) {
      console.error('加载自选列表失败:', error);
    }
  }, []);

  useEffect(() => {
    loadWatchlist();
  }, [loadWatchlist]);

  // 获取指数数据（包含行情数据）
  const fetchData = useCallback(
    async (page = 1, pageSize = 10, searchKeyword?: string) => {
      setLoading(true);
      const searchKey = searchKeyword !== undefined ? searchKeyword : keyword;
      try {
        // 1. 获取指数基础信息
        const basicRes = await getIndexBasicList({
          skip: (page - 1) * pageSize,
          limit: pageSize,
          keyword: searchKey || undefined,
        });

        // 2. 获取每个指数的最新日线行情
        const dailyPromises = basicRes.data.map((basic) =>
          getIndexDailyList({ ts_code: basic.ts_code, limit: 1 }).catch(() => ({ data: [] as IndexDaily[] }))
        );
        const dailyResults = await Promise.all(dailyPromises);

        // 3. 获取一年前的日期
        const oneYearAgo = dayjs().subtract(1, 'year').format('YYYYMMDD');
        const yearAgoPromises = basicRes.data.map((basic) =>
          getIndexDailyList({ ts_code: basic.ts_code, start_date: oneYearAgo, limit: 1 }).catch(() => ({
            data: [] as IndexDaily[],
          }))
        );
        const yearAgoResults = await Promise.all(yearAgoPromises);

        // 4. 合并数据
        const mergedData: MarketIndexItem[] = basicRes.data.map((basic, index) => {
          const latestDaily = dailyResults[index]?.data?.[0];
          const yearAgoDaily = yearAgoResults[index]?.data?.[0];

          const latestPrice = latestDaily?.close || 0;
          const dailyChange = latestDaily?.change || 0;
          const dailyChangePercent = latestDaily?.pct_chg || 0;

          // 计算近1年涨跌幅
          let yearChangePercent = 0;
          if (latestPrice > 0 && yearAgoDaily?.close) {
            yearChangePercent = ((latestPrice - yearAgoDaily.close) / yearAgoDaily.close) * 100;
          }

          return {
            ...basic,
            latestPrice,
            dailyChange,
            dailyChangePercent,
            yearChangePercent,
            constituentCount: 0, // TODO: 从指数成分股接口获取
            relatedFundCount: 0, // TODO: 从相关基金接口获取
            isInWatchlist: watchlistCodes.has(basic.ts_code),
          };
        });

        setRows(mergedData);
        setTotal(basicRes.count);
        setPagination({ current: page, pageSize });
      } catch (error) {
        notificationController.error({ message: '加载数据失败' });
        setRows([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [keyword, watchlistCodes],
  );

  useEffect(() => {
    fetchData(1, pagination.pageSize, keyword);
  }, [searchTrigger, keyword]); // eslint-disable-line react-hooks/exhaustive-deps

  // 添加自选
  const handleAddToWatchlist = useCallback(
    async (code: string) => {
      if (!watchlistConfig) {
        notificationController.warning({ message: '请先初始化自选配置' });
        return;
      }

      try {
        const currentCodes = watchlistConfig.config_value?.index_codes || [];
        if (currentCodes.includes(code)) {
          notificationController.info({ message: '已在自选中' });
          return;
        }

        const newCodes = [...currentCodes, code];
        const newConfigValue = {
          ...watchlistConfig.config_value,
          index_codes: newCodes,
        };

        await updateUserConfig(watchlistConfig.id, {
          config_value: newConfigValue,
        });

        setWatchlistCodes(new Set(newCodes));
        setWatchlistConfig({ ...watchlistConfig, config_value: newConfigValue });

        // 更新当前行的状态
        setRows((prev) =>
          prev.map((row) => (row.ts_code === code ? { ...row, isInWatchlist: true } : row))
        );

        notificationController.success({ message: '已添加到自选' });
      } catch (error) {
        notificationController.error({ message: '添加失败' });
      }
    },
    [watchlistConfig],
  );

  const columns: ColumnsType<MarketIndexItem> = [
    {
      title: '名称/代码',
      key: 'name_code',
      align: 'center',
      render: (_, record) => (
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontWeight: 500 }}>{record.name || '-'}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>{record.ts_code || '-'}</div>
          {record.fullname && (
            <div style={{ fontSize: '12px', color: '#999' }}>{record.fullname}</div>
          )}
        </div>
      ),
    },
    {
      title: '最新价',
      dataIndex: 'latestPrice',
      key: 'latestPrice',
      align: 'center',
      render: (v: number) => (v > 0 ? v.toFixed(2) : '--'),
      sorter: (a, b) => (a.latestPrice || 0) - (b.latestPrice || 0),
    },
    {
      title: '日涨跌幅',
      key: 'dailyChange',
      align: 'center',
      render: (_, record) => {
        const pct = record.dailyChangePercent || 0;
        const color = pct >= 0 ? '#ff4d4f' : '#52c41a';
        return (
          <span style={{ color }}>
            {pct >= 0 ? '+' : ''}
            {pct.toFixed(2)}%
          </span>
        );
      },
      sorter: (a, b) => (a.dailyChangePercent || 0) - (b.dailyChangePercent || 0),
    },
    {
      title: '近1年',
      key: 'yearChange',
      align: 'center',
      render: (_, record) => {
        const pct = record.yearChangePercent || 0;
        const color = pct >= 0 ? '#ff4d4f' : '#52c41a';
        return (
          <span style={{ color }}>
            {pct >= 0 ? '+' : ''}
            {pct.toFixed(2)}%
          </span>
        );
      },
      sorter: (a, b) => (a.yearChangePercent || 0) - (b.yearChangePercent || 0),
    },
    {
      title: '成分股数量',
      dataIndex: 'constituentCount',
      key: 'constituentCount',
      align: 'center',
      render: (v: number) => (v > 0 ? v : '--'),
      sorter: (a, b) => (a.constituentCount || 0) - (b.constituentCount || 0),
    },
    {
      title: '相关基金个数',
      dataIndex: 'relatedFundCount',
      key: 'relatedFundCount',
      align: 'center',
      render: (v: number) => (v > 0 ? v : '--'),
      sorter: (a, b) => (a.relatedFundCount || 0) - (b.relatedFundCount || 0),
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <BaseButton
          type={record.isInWatchlist ? 'default' : 'primary'}
          size="small"
          disabled={record.isInWatchlist}
          onClick={() => handleAddToWatchlist(record.ts_code)}
        >
          {record.isInWatchlist ? '已添加' : '+自选'}
        </BaseButton>
      ),
    },
  ];

  return (
    <>
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
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        onChange={(pageConfig) => {
          const current = pageConfig.current || 1;
          const size = pageConfig.pageSize || 10;
          fetchData(current, size, keyword);
        }}
      />
    </>
  );
};

