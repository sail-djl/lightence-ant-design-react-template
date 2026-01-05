import React, { useCallback, useEffect, useState } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { ColumnsType } from 'antd/es/table';
import { FundBasic, getFundBasicList } from '@app/api/datamarket/fund.api';
import { notificationController } from '@app/controllers/notificationController';

interface MarketOtcItem extends FundBasic {
  latestPrice?: number;
  dailyChangePercent?: number;
  yearChangePercent?: number;
  isInWatchlist?: boolean;
}

interface MarketOtcTabProps {
  keyword?: string;
  searchTrigger?: number;
}

const initialPagination = { current: 1, pageSize: 10 };

export const MarketOtcTab: React.FC<MarketOtcTabProps> = ({ keyword = '', searchTrigger = 0 }) => {
  const [rows, setRows] = useState<MarketOtcItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(
    async (page = 1, pageSize = 10, searchKeyword?: string) => {
      setLoading(true);
      const searchKey = searchKeyword !== undefined ? searchKeyword : keyword;
      try {
        const res = await getFundBasicList({
          skip: (page - 1) * pageSize,
          limit: pageSize,
          keyword: searchKey || undefined,
          market: 'O', // 场外基金
          status: 'L', // 上市中
        });

        const mergedData: MarketOtcItem[] = res.data.map((fund) => ({
          ...fund,
          latestPrice: 0, // TODO: 从基金净值接口获取
          dailyChangePercent: 0, // TODO: 从基金净值接口获取
          yearChangePercent: 0, // TODO: 计算近1年涨跌幅
          isInWatchlist: false, // TODO: 从自选列表获取
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
    [keyword],
  );

  useEffect(() => {
    fetchData(1, pagination.pageSize, keyword);
  }, [searchTrigger, keyword]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddToWatchlist = useCallback(async (code: string) => {
    // TODO: 实现添加场外基金到自选
    notificationController.info({ message: '功能开发中' });
  }, []);

  const columns: ColumnsType<MarketOtcItem> = [
    {
      title: '名称/代码',
      key: 'name_code',
      align: 'center',
      render: (_, record) => (
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontWeight: 500 }}>{record.name || '-'}</div>
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

