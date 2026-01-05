import React, { useCallback, useEffect, useState } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { ColumnsType } from 'antd/es/table';
import { EtfBasic, getEtfBasicList } from '@app/api/datamarket/etf.api';
import { notificationController } from '@app/controllers/notificationController';
import { getUserConfigList, createUserConfig, updateUserConfig, UserConfig } from '@app/api/userconfig.api';
import { generateConfigKey } from '@app/pages/userconfig/constants';

interface MarketEtfItem extends EtfBasic {
  latestPrice?: number;
  dailyChangePercent?: number;
  yearChangePercent?: number;
  isInWatchlist?: boolean;
}

interface MarketEtfTabProps {
  keyword?: string;
  searchTrigger?: number;
}

const initialPagination = { current: 1, pageSize: 10 };

export const MarketEtfTab: React.FC<MarketEtfTabProps> = ({ keyword = '', searchTrigger = 0 }) => {
  const [rows, setRows] = useState<MarketEtfItem[]>([]);
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
      const etfCodes = config.config_value?.etf_codes || [];
      setWatchlistCodes(new Set(etfCodes));
    } catch (error) {
      console.error('加载自选列表失败:', error);
    }
  }, []);

  useEffect(() => {
    loadWatchlist();
  }, [loadWatchlist]);

  const fetchData = useCallback(
    async (page = 1, pageSize = 10, searchKeyword?: string) => {
      setLoading(true);
      const searchKey = searchKeyword !== undefined ? searchKeyword : keyword;
      try {
        const res = await getEtfBasicList({
          skip: (page - 1) * pageSize,
          limit: pageSize,
          keyword: searchKey || undefined,
          list_status: 'L', // 只显示上市状态
        });

        const mergedData: MarketEtfItem[] = res.data.map((etf) => ({
          ...etf,
          latestPrice: 0, // TODO: 从ETF行情接口获取
          dailyChangePercent: 0, // TODO: 从ETF行情接口获取
          yearChangePercent: 0, // TODO: 计算近1年涨跌幅
          isInWatchlist: watchlistCodes.has(etf.ts_code),
        }));

        setRows(mergedData);
        setTotal(res.count);
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

  const handleAddToWatchlist = useCallback(
    async (code: string) => {
      if (!watchlistConfig) {
        notificationController.warning({ message: '请先初始化自选配置' });
        return;
      }

      try {
        const currentCodes = watchlistConfig.config_value?.etf_codes || [];
        if (currentCodes.includes(code)) {
          notificationController.info({ message: '已在自选中' });
          return;
        }

        const newCodes = [...currentCodes, code];
        const newConfigValue = {
          ...watchlistConfig.config_value,
          etf_codes: newCodes,
        };

        await updateUserConfig(watchlistConfig.id, {
          config_value: newConfigValue,
        });

        setWatchlistCodes(new Set(newCodes));
        setWatchlistConfig({ ...watchlistConfig, config_value: newConfigValue });
        setRows((prev) => prev.map((row) => (row.ts_code === code ? { ...row, isInWatchlist: true } : row)));

        notificationController.success({ message: '已添加到自选' });
      } catch (error) {
        notificationController.error({ message: '添加失败' });
      }
    },
    [watchlistConfig],
  );

  const columns: ColumnsType<MarketEtfItem> = [
    {
      title: '名称/代码',
      key: 'name_code',
      align: 'center',
      render: (_, record) => (
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontWeight: 500 }}>{record.extname || record.csname || '-'}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>{record.ts_code || '-'}</div>
        </div>
      ),
    },
    {
      title: '最新价',
      dataIndex: 'latestPrice',
      key: 'latestPrice',
      align: 'center',
      render: (v: number) => (v > 0 ? v.toFixed(2) : '--'),
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
    },
    {
      title: '成分股数量',
      key: 'constituentCount',
      align: 'center',
      render: () => '--',
    },
    {
      title: '相关基金个数',
      key: 'relatedFundCount',
      align: 'center',
      render: () => '--',
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

