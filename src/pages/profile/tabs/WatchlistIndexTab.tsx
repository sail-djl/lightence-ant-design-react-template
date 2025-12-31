import React, { useState, useCallback, useEffect } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { ColumnsType } from 'antd/es/table';
import { Tag } from 'antd';
import { mockWatchlistIndexData, WatchlistIndexItem } from './mocks/watchlistMock';

export const WatchlistIndexTab: React.FC = () => {
  const [rows, setRows] = useState<WatchlistIndexItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      // 模拟 API 调用
      const data = mockWatchlistIndexData;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      setRows(data.slice(start, end));
      setTotal(data.length);
      setPagination({ current: page, pageSize });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRemove = (code: string) => {
    // TODO: 实现移除逻辑
    console.log('Remove index:', code);
  };

  const columns: ColumnsType<WatchlistIndexItem> = [
    { title: '指数代码', dataIndex: 'code', key: 'code', align: 'center' },
    { title: '指数名称', dataIndex: 'name', key: 'name', align: 'center' },
    { title: '市场', dataIndex: 'market', key: 'market', align: 'center' },
    { title: '发布机构', dataIndex: 'publisher', key: 'publisher', align: 'center' },
    {
      title: '最新价',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (v) => (v ? v.toFixed(2) : '-'),
    },
    {
      title: '涨跌幅',
      dataIndex: 'changePercent',
      key: 'changePercent',
      align: 'center',
      render: (v) => {
        if (v === undefined || v === null) return '-';
        const color = v >= 0 ? '#cf1322' : '#3f8600';
        return <Tag color={color}>{v > 0 ? '+' : ''}{v.toFixed(2)}%</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <BaseButton size="small" danger onClick={() => handleRemove(record.code)}>
          移除
        </BaseButton>
      ),
    },
  ];

  return (
    <>
      <BaseTable
        columns={columns}
        dataSource={rows}
        rowKey="code"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: total,
          showSizeChanger: true,
          showTotal: (v) => `共 ${v} 条`,
        }}
        onChange={(pageConfig) => {
          const current = pageConfig.current || 1;
          const size = pageConfig.pageSize || 10;
          fetchData(current, size);
        }}
      />
    </>
  );
};

