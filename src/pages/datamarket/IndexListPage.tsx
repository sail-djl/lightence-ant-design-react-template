import React, { useMemo } from 'react';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseTabs } from '@app/components/common/BaseTabs/BaseTabs';
import { IndexBasicTab } from './index/tabs/IndexBasicTab';
import { IndexDailyTab } from './index/tabs/IndexDailyTab';
import { IndexDailybasicTab } from './index/tabs/IndexDailybasicTab';
import { IndexWeeklyTab } from './index/tabs/IndexWeeklyTab';
import { IndexClassifyTab } from './index/tabs/IndexClassifyTab';
import { IndexMemberTab } from './index/tabs/IndexMemberTab';
import { SwDailyTab } from './index/tabs/SwDailyTab';
import { IndexGlobalTab } from './index/tabs/IndexGlobalTab';
import { IndexFactorTab } from './index/tabs/IndexFactorTab';

const IndexListPage: React.FC = () => {
  const tabItems = useMemo(
    () => [
      {
        key: 'basic',
        label: '指数基础信息',
        children: <IndexBasicTab />,
      },
      {
        key: 'daily',
        label: '日线行情',
        children: <IndexDailyTab />,
      },
      {
        key: 'dailybasic',
        label: '大盘指数每日指标',
        children: <IndexDailybasicTab />,
      },
      {
        key: 'weekly',
        label: '指数周线行情',
        children: <IndexWeeklyTab />,
      },
      {
        key: 'classify',
        label: '申万行业分类',
        children: <IndexClassifyTab />,
      },
      {
        key: 'member',
        label: '申万行业成分构成',
        children: <IndexMemberTab />,
      },
      {
        key: 'swdaily',
        label: '申万行业日线行情',
        children: <SwDailyTab />,
      },
      {
        key: 'global',
        label: '国际指数',
        children: <IndexGlobalTab />,
      },
      {
        key: 'factor',
        label: '指数技术因子',
        children: <IndexFactorTab />,
      },
    ],
    [],
  );

  return (
    <>
      <PageTitle>数据市场 · 指数数据</PageTitle>
      <BaseTabs defaultActiveKey="basic" items={tabItems} type="card" />
    </>
  );
};

export default IndexListPage;
