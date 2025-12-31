import React, { useState, useCallback, useEffect } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { ColumnsType } from 'antd/es/table';
import { Tag } from 'antd';
import { mockWatchlistEtfData, WatchlistEtfItem } from './mocks/watchlistMock';

export const WatchlistEtfTab: React.FC = () => {
  const [rows, setRows] = useState<WatchlistEtfItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      // 模拟 API 调用
      const data = mockWatchlistEtfData;
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
    console.log('Remove ETF:', code);
  };

  const exchangeText = (exchange: string) => {
    if (exchange === 'SH') return '上交所';
    if (exchange === 'SZ') return '深交所';
    return exchange;
  };

  const columns: ColumnsType<WatchlistEtfItem> = [
    { title: '代码', dataIndex: 'code', key: 'code', align: 'center' },
    { title: '简称', dataIndex: 'name', key: 'name', align: 'center' },
    {
      title: '交易所',
      dataIndex: 'exchange',
      key: 'exchange',
      align: 'center',
      render: (v) => exchangeText(v),
    },
    {
      title: '指数代码',
      dataIndex: 'indexCode',
      key: 'indexCode',
      align: 'center',
      render: (v) => v || '-',
    },
    {
      title: '指数名称',
      dataIndex: 'indexName',
      key: 'indexName',
      align: 'center',
      render: (v) => v || '-',
    },
    {
      title: '最新价',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (v) => (v ? v.toFixed(3) : '-'),
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

