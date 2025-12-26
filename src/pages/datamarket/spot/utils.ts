// 现货数据分页默认值设为15
export const initialPagination = { current: 1, pageSize: 15 };

// 安全地将值转换为数字
export const toNumber = (v: any): number | null => {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'number') return isNaN(v) ? null : v;
  if (typeof v === 'string') {
    const num = parseFloat(v);
    return isNaN(num) ? null : num;
  }
  return null;
};

// 格式化数字为固定小数位
export const formatNumber = (v: any, decimals: number = 2): string => {
  const num = toNumber(v);
  return num !== null ? num.toFixed(decimals) : '-';
};

// 格式化数字为千分位
export const formatNumberLocale = (v: any): string => {
  const num = toNumber(v);
  return num !== null ? num.toLocaleString() : '-';
};

// 格式化日期字符串 (YYYYMMDD -> YYYY-MM-DD)
export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '-';
  if (dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
  }
  return dateStr;
};

// 日期范围快捷选项（用于日期类型 RangePicker，格式：YYYY-MM-DD）
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

