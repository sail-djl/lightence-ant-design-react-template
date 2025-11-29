import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { getFinancialIndicators, FinancialIndicator } from '@app/api/finance.api';
import { Loading } from '@app/components/common/Loading/Loading';
import * as S from './FinancialIndicators.styles';

export const FinancialIndicators: React.FC = () => {
  const [indicators, setIndicators] = useState<FinancialIndicator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getFinancialIndicators();
        setIndicators(data);
      } catch (error) {
        console.error('加载金融指标失败:', error);
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
    <S.IndicatorsWrapper>
      <Card title="金融指标" size="small">
        <Row gutter={[16, 16]}>
          {indicators.map((indicator) => (
            <Col xs={24} sm={12} md={8} lg={6} key={indicator.name}>
              <Card size="small">
                <Statistic
                  title={indicator.name}
                  value={indicator.value}
                  precision={2}
                  suffix={indicator.unit}
                  valueStyle={{ fontSize: '18px' }}
                  prefix={
                    indicator.change !== undefined && indicator.change !== 0 ? (
                      indicator.change > 0 ? (
                        <ArrowUpOutlined style={{ color: '#52c41a' }} />
                      ) : (
                        <ArrowDownOutlined style={{ color: '#ff4d4f' }} />
                      )
                    ) : null
                  }
                />
                {indicator.change !== undefined && (
                  <S.ChangeText isPositive={indicator.change >= 0}>
                    {indicator.change >= 0 ? '+' : ''}{indicator.change.toFixed(2)}
                  </S.ChangeText>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </S.IndicatorsWrapper>
  );
};


