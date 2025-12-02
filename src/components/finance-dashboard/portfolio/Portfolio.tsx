import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Statistic, Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { getPortfolioData, PortfolioData } from '@app/api/finance.api';
import { Loading } from '@app/components/common/Loading/Loading';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import type { ColumnsType } from 'antd/es/table';
import * as S from './Portfolio.styles';

export const Portfolio: React.FC = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getPortfolioData();
        setPortfolioData(data);
      } catch (error) {
        console.error('加载投资组合失败:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !portfolioData) {
    return <Loading />;
  }

  const columns: ColumnsType<PortfolioData['positions'][0]> = [
    {
      title: '代码',
      dataIndex: 'symbol',
      key: 'symbol',
      width: 100,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
    },
    {
      title: '平均成本',
      dataIndex: 'avgPrice',
      key: 'avgPrice',
      width: 120,
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: '当前价格',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      width: 120,
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: '盈亏',
      dataIndex: 'profit',
      key: 'profit',
      width: 120,
      render: (profit: number) => (
        <span style={{ color: profit >= 0 ? '#52c41a' : '#ff4d4f' }}>
          {profit >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}${profit >= 0 ? '+' : ''}
          {profit.toFixed(2)}
        </span>
      ),
    },
    {
      title: '盈亏率',
      dataIndex: 'profitPercent',
      key: 'profitPercent',
      width: 120,
      render: (percent: number) => (
        <Tag color={percent >= 0 ? 'success' : 'error'}>
          {percent >= 0 ? '+' : ''}
          {percent.toFixed(2)}%
        </Tag>
      ),
    },
  ];

  return (
    <S.PortfolioWrapper>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="总资产"
              value={portfolioData.totalValue}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="总盈亏"
              value={portfolioData.totalProfit}
              precision={2}
              prefix="$"
              valueStyle={{
                color: portfolioData.totalProfit >= 0 ? '#52c41a' : '#ff4d4f',
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="总盈亏率"
              value={portfolioData.totalProfitPercent}
              precision={2}
              suffix="%"
              valueStyle={{
                color: portfolioData.totalProfitPercent >= 0 ? '#52c41a' : '#ff4d4f',
              }}
            />
          </Card>
        </Col>
      </Row>
      <BaseCard title="持仓明细" padding="1.25rem 1.25rem 0" style={{ marginTop: 16 }}>
        <Table columns={columns} dataSource={portfolioData.positions} rowKey="symbol" pagination={false} />
      </BaseCard>
    </S.PortfolioWrapper>
  );
};
