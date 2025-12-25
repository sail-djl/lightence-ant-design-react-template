import React from 'react';
import { Card, Typography } from 'antd';
import * as S from '../IndexDashboardPage.styles';

const { Text } = Typography;

export const StrategySignals: React.FC = () => {
  return (
    <Card title="策略信号 (Strategy Signals)">
      <S.SignalCard>
        <S.SignalItem>
          <S.SignalLabel>仓位建议</S.SignalLabel>
          <S.SignalValue>偏多</S.SignalValue>
        </S.SignalItem>
        <S.SignalItem>
          <S.SignalLabel>风格倾向</S.SignalLabel>
          <S.SignalValue>成长 / 高弹性</S.SignalValue>
        </S.SignalItem>
        <S.SignalItem>
          <S.SignalLabel>风险灯</S.SignalLabel>
          <S.SignalValue>
            <S.RiskLight $color="yellow" />
            <span>中等风险</span>
          </S.SignalValue>
        </S.SignalItem>
        <S.SignalItem>
          <S.SignalLabel>估值分位</S.SignalLabel>
          <S.SignalValue>65.3%</S.SignalValue>
        </S.SignalItem>
        <S.SignalItem>
          <S.SignalLabel>偏离度</S.SignalLabel>
          <S.SignalValue>+2.3σ</S.SignalValue>
        </S.SignalItem>
        <S.SignalItem>
          <S.SignalLabel>策略建议</S.SignalLabel>
          <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.6, display: 'block', marginTop: 8 }}>
            当前成长风格累计超额收益偏高，资金流放缓，建议减仓高弹性成长，保留部分核心资产。
          </Text>
        </S.SignalItem>
      </S.SignalCard>
    </Card>
  );
};





