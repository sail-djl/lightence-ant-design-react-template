import React from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Portfolio } from '@app/components/finance-dashboard/portfolio/Portfolio';

const PortfolioPage: React.FC = () => {
  return (
    <>
      <PageTitle>投资组合</PageTitle>
      <Portfolio />
    </>
  );
};

export default PortfolioPage;
