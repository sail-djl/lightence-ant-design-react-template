import React from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { Typography } from 'antd';

const { Title, Text } = Typography;

const PortfolioPage: React.FC = () => {
  return (
    <>
      <PageTitle>投资组合</PageTitle>
      <BaseRow gutter={[16, 16]}>
        <BaseCol span={24}>
          <BaseCard>
            <Title level={4}>投资组合</Title>
            <Text type="secondary">投资组合功能开发中...</Text>
          </BaseCard>
        </BaseCol>
      </BaseRow>
    </>
  );
};

export default PortfolioPage;
