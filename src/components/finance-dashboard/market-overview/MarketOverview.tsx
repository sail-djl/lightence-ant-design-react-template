import React, { useEffect, useState } from 'react';
import { Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { getMarketData, MarketData } from '@app/api/market.api';
import { Loading } from '@app/components/common/Loading/Loading';
import * as S from './MarketOverview.styles';

export const MarketOverview: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getMarketData();
        setMarketData(data.slice(0, 6)); // 只显示前6个
      } catch (error) {
        console.error('加载市场数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <S.MarketOverviewWrapper>
      <Card title="市场概览" size="small">
        <S.MarketList>
          {marketData.map((item) => (
            <S.MarketItem key={item.symbol}>
              <S.MarketInfo>
                <S.Symbol>{item.symbol}</S.Symbol>
                <S.Name>{item.name}</S.Name>
              </S.MarketInfo>
              <S.MarketPrice>
                <Statistic
                  value={item.price}
                  precision={2}
                  valueStyle={{ fontSize: '16px', fontWeight: 'bold' }}
                  prefix={item.change >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                />
                <S.ChangeText isPositive={item.change >= 0}>
                  {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%)
                </S.ChangeText>
              </S.MarketPrice>
            </S.MarketItem>
          ))}
        </S.MarketList>
      </Card>
    </S.MarketOverviewWrapper>
  );
};

