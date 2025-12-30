import React from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import { AppDate } from '@app/constants/Dates';
import { ColumnsType } from 'antd/es/table';
import { GDP, getGDPList, GDPQuery } from '@app/api/datamarket/macro.api';
import { useMacroData } from '../hooks/useMacroData';
import { useMacroSync } from '../hooks/useMacroSync';
import { formatNumber, formatNumberLocale, formatQuarter, parseQuarter, getQuarterRanges } from '../utils';

export const GDPTab: React.FC = () => {
  const { query, setQuery, rows, loading, pagination, total, fetchData } = useMacroData<GDP, GDPQuery>({
    fetchFn: async (params) => {
      const res = await getGDPList({
        skip: params.skip,
        limit: params.limit,
        quarter: params.quarter,
        start_q: params.start_q,
        end_q: params.end_q,
      });
      return res;
    },
    initialQuery: { quarter: undefined, start_q: undefined, end_q: undefined },
  });

  const { syncOpen, setSyncOpen, syncLoading, syncPayload, setSyncPayload, handleSync, openSync } = useMacroSync({
    onSuccess: () => fetchData(pagination.current, pagination.pageSize),
  });

  const columns: ColumnsType<GDP> = [
    { title: '季度', dataIndex: 'quarter', key: 'quarter', align: 'center', width: 100 },
    { title: 'GDP累计值（亿元）', dataIndex: 'gdp', key: 'gdp', align: 'right', render: (v) => formatNumberLocale(v) },
    { title: '当季同比增速（%）', dataIndex: 'gdp_yoy', key: 'gdp_yoy', align: 'right', render: (v) => formatNumber(v, 2) },
    { title: '第一产业累计值（亿元）', dataIndex: 'pi', key: 'pi', align: 'right', render: (v) => formatNumberLocale(v) },
    { title: '第一产业同比增速（%）', dataIndex: 'pi_yoy', key: 'pi_yoy', align: 'right', render: (v) => formatNumber(v, 2) },
    { title: '第二产业累计值（亿元）', dataIndex: 'si', key: 'si', align: 'right', render: (v) => formatNumberLocale(v) },
    { title: '第二产业同比增速（%）', dataIndex: 'si_yoy', key: 'si_yoy', align: 'right', render: (v) => formatNumber(v, 2) },
    { title: '第三产业累计值（亿元）', dataIndex: 'ti', key: 'ti', align: 'right', render: (v) => formatNumberLocale(v) },
    { title: '第三产业同比增速（%）', dataIndex: 'ti_yoy', key: 'ti_yoy', align: 'right', render: (v) => formatNumber(v, 2) },
  ];

  return (
    <>
      <BaseSpace style={{ display: 'flex', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <DayjsDatePicker
          picker="quarter"
          format="YYYY[Q]Q"
          placeholder="选择季度"
          value={query.quarter ? parseQuarter(query.quarter) : null}
          onChange={(date) => setQuery({ ...query, quarter: date ? formatQuarter(date) : undefined })}
          style={{ width: 200 }}
        />
        <DayjsDatePicker.RangePicker
          picker="quarter"
          format="YYYY[Q]Q"
          placeholder={['开始季度', '结束季度']}
          value={
            query.start_q && query.end_q
              ? (() => {
                  const start = parseQuarter(query.start_q);
                  const end = parseQuarter(query.end_q);
                  return start && end ? [start, end] as [AppDate, AppDate] : null;
                })()
              : null
          }
          onChange={(dates) => {
            setQuery({
              ...query,
              start_q: dates?.[0] ? formatQuarter(dates[0]) : undefined,
              end_q: dates?.[1] ? formatQuarter(dates[1]) : undefined,
            });
          }}
          style={{ width: 300 }}
        />
        <BaseButton onClick={() => fetchData(1, pagination.pageSize)}>查询</BaseButton>
        <BaseButton
          onClick={() => {
            setQuery({ quarter: undefined, start_q: undefined, end_q: undefined });
            fetchData(1, pagination.pageSize);
          }}
        >
          重置
        </BaseButton>
      </BaseSpace>

      <BaseSpace style={{ display: 'flex', marginBottom: '1rem' }}>
        <BaseButton
          type="primary"
          onClick={() => {
            openSync('gdp', {
              start_q: query.start_q,
              end_q: query.end_q,
            });
          }}
        >
          同步数据
        </BaseButton>
      </BaseSpace>

      <BaseModal
        title="GDP数据同步"
        open={syncOpen}
        onCancel={() => setSyncOpen(false)}
        confirmLoading={syncLoading}
        onOk={handleSync}
      >
        <BaseForm layout="vertical">
          <BaseForm.Item label="季度范围">
            <DayjsDatePicker.RangePicker
              picker="quarter"
              format="YYYY[Q]Q"
              value={
                syncPayload.start_q && syncPayload.end_q
                  ? (() => {
                      const start = parseQuarter(syncPayload.start_q);
                      const end = parseQuarter(syncPayload.end_q);
                      return start && end ? [start, end] as [AppDate, AppDate] : null;
                    })()
                  : null
              }
              onChange={(dates) => {
                setSyncPayload({
                  ...syncPayload,
                  start_q: dates?.[0] ? formatQuarter(dates[0]) : undefined,
                  end_q: dates?.[1] ? formatQuarter(dates[1]) : undefined,
                });
              }}
              ranges={getQuarterRanges()}
              style={{ width: '100%' }}
            />
          </BaseForm.Item>
        </BaseForm>
      </BaseModal>

      <BaseTable
        columns={columns}
        dataSource={rows}
        rowKey="quarter"
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
          const size = pageConfig.pageSize || 20;
          fetchData(current, size);
        }}
      />
    </>
  );
};


