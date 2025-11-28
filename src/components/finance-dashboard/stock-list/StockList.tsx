import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { getMarketData, MarketData } from '@app/api/market.api';
import { Loading } from '@app/components/common/Loading/Loading';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import type { ColumnsType } from 'antd/es/table';

export const StockList: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getMarketData();
        setMarketData(data);
      } catch (error) {
        console.error('加载股票列表失败:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns: ColumnsType<MarketData> = [
    {
      title: '代码',
      dataIndex: 'symbol',
      key: 'symbol',
      width: 120,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price: number) => `$${price.toFixed(2)}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: '涨跌',
      dataIndex: 'change',
      key: 'change',
      width: 120,
      render: (change: number, record: MarketData) => (
        <span style={{ color: change >= 0 ? '#52c41a' : '#ff4d4f' }}>
          {change >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          {change >= 0 ? '+' : ''}{change.toFixed(2)}
        </span>
      ),
      sorter: (a, b) => a.change - b.change,
    },
    {
      title: '涨跌幅',
      dataIndex: 'changePercent',
      key: 'changePercent',
      width: 120,
      render: (changePercent: number) => (
        <Tag color={changePercent >= 0 ? 'success' : 'error'}>
          {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
        </Tag>
      ),
      sorter: (a, b) => a.changePercent - b.changePercent,
    },
    {
      title: '成交量',
      dataIndex: 'volume',
      key: 'volume',
      render: (volume: number) => volume.toLocaleString(),
      sorter: (a, b) => a.volume - b.volume,
    },
    {
      title: '市值',
      dataIndex: 'marketCap',
      key: 'marketCap',
      render: (marketCap?: number) => 
        marketCap ? `$${(marketCap / 1000000000).toFixed(2)}B` : '-',
      sorter: (a, b) => (a.marketCap || 0) - (b.marketCap || 0),
    },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <BaseCard title="股票列表" padding="1.25rem 1.25rem 0">
      <Table
        columns={columns}
        dataSource={marketData}
        rowKey="symbol"
        pagination={{ pageSize: 10 }}
        loading={loading}
      />
    </BaseCard>
  );
};

