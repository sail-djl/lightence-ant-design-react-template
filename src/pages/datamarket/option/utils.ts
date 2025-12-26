export const initialPagination = { current: 1, pageSize: 15 };

export const toNumber = (v: any): number | null => {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'number') return isNaN(v) ? null : v;
  if (typeof v === 'string') {
    const num = parseFloat(v);
    return isNaN(num) ? null : num;
  }
  return null;
};

export const formatNumber = (v: any, decimals: number = 2): string => {
  const num = toNumber(v);
  return num !== null ? num.toFixed(decimals) : '-';
};

export const formatNumberLocale = (v: any): string => {
  const num = toNumber(v);
  return num !== null ? num.toLocaleString() : '-';
};

export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '-';
  if (dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
  }
  return dateStr;
};

import type { AppDate } from '@app/constants/Dates';
import dayjs from 'dayjs';

export const getDateRanges = (): Record<string, [AppDate, AppDate]> => {
  const today = dayjs();
  return {
    '最近一周': [dayjs().subtract(7, 'day'), today] as [AppDate, AppDate],
    '最近一月': [dayjs().subtract(1, 'month'), today] as [AppDate, AppDate],
    '最近一年': [dayjs().subtract(1, 'year'), today] as [AppDate, AppDate],
    '最近五年': [dayjs().subtract(5, 'year'), today] as [AppDate, AppDate],
    '最近十年': [dayjs().subtract(10, 'year'), today] as [AppDate, AppDate],
  };
};

export const EXCHANGE_OPTIONS = [
  { label: '全部', value: '' },
  { label: '上交所', value: 'SSE' },
  { label: '深交所', value: 'SZSE' },
  { label: '中金所', value: 'CFFEX' },
  { label: '大商所', value: 'DCE' },
  { label: '上期所', value: 'SHFE' },
  { label: '郑商所', value: 'CZCE' },
];

export const CALL_PUT_OPTIONS = [
  { label: '全部', value: '' },
  { label: '认购', value: 'C' },
  { label: '认沽', value: 'P' },
];

