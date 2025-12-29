import React from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { Typography } from 'antd';

const { Title, Text } = Typography;

/**
 * 个人自选页面
 */
const WatchlistPage: React.FC = () => {
  return (
    <>
      <PageTitle>个人自选</PageTitle>
      <BaseCard>
        <Title level={4}>我的自选</Title>
        <Text type="secondary">管理您的自选股票、指数、ETF等</Text>
        {/* TODO: 实现自选列表功能 */}
      </BaseCard>
    </>
  );
};

export default WatchlistPage;
