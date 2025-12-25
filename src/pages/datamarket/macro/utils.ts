// 复用index模块的工具函数
export { trim } from '../index/utils';

import type { AppDate } from '@app/constants/Dates';
import dayjs from 'dayjs';

// 宏观经济数据分页默认值设为20
export const initialPagination = { current: 1, pageSize: 20 };

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

// 格式化月份字符串 (YYYYMM -> YYYY-MM)
export const formatMonth = (monthStr?: string): string => {
  if (!monthStr) return '-';
  if (monthStr.length === 6) {
    return `${monthStr.slice(0, 4)}-${monthStr.slice(4, 6)}`;
  }
  return monthStr;
};

// 日期范围快捷选项（用于日期类型 RangePicker，格式：YYYY-MM-DD）
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

// 月份范围快捷选项（用于月份类型 RangePicker，格式：YYYYMM）
export const getMonthRanges = (): Record<string, [AppDate, AppDate]> => {
  const today = dayjs();
  return {
    '最近3个月': [dayjs().subtract(3, 'month').startOf('month'), today.endOf('month')] as [AppDate, AppDate],
    '最近6个月': [dayjs().subtract(6, 'month').startOf('month'), today.endOf('month')] as [AppDate, AppDate],
    '最近一年': [dayjs().subtract(1, 'year').startOf('month'), today.endOf('month')] as [AppDate, AppDate],
    '最近三年': [dayjs().subtract(3, 'year').startOf('month'), today.endOf('month')] as [AppDate, AppDate],
    '最近五年': [dayjs().subtract(5, 'year').startOf('month'), today.endOf('month')] as [AppDate, AppDate],
  };
};

// 季度格式转换：将 dayjs 季度对象转换为 YYYYQ1 格式（如：2024Q1）
export const formatQuarter = (date: AppDate): string => {
  const year = date.year();
  // 季度计算：月份 0-2 -> Q1, 3-5 -> Q2, 6-8 -> Q3, 9-11 -> Q4
  const month = date.month();
  const quarter = Math.floor(month / 3) + 1;
  return `${year}Q${quarter}`;
};

// 解析季度字符串为 dayjs 对象（将 YYYYQ1 格式转换为 dayjs）
export const parseQuarter = (quarterStr: string | undefined): AppDate | null => {
  if (!quarterStr) return null;
  const match = quarterStr.match(/^(\d{4})Q([1-4])$/);
  if (!match) return null;
  const year = parseInt(match[1], 10);
  const quarter = parseInt(match[2], 10);
  // 季度转换为月份：Q1->0月(1月)，Q2->3月(4月)，Q3->6月(7月)，Q4->9月(10月)
  const month = (quarter - 1) * 3;
  return dayjs().year(year).month(month).startOf('month');
};

// 季度范围快捷选项（用于季度类型 RangePicker，格式：YYYYQ1）
export const getQuarterRanges = (): Record<string, [AppDate, AppDate]> => {
  const today = dayjs();
  // 季度计算：月份 0-2 -> Q1, 3-5 -> Q2, 6-8 -> Q3, 9-11 -> Q4
  const currentMonth = today.month();
  const currentQuarter = Math.floor(currentMonth / 3) + 1;
  const currentYear = today.year();
  
  // 获取指定年份和季度的开始日期（该季度的第一个月）
  const getQuarterStart = (year: number, quarter: number) => {
    const month = (quarter - 1) * 3;
    return dayjs().year(year).month(month).startOf('month');
  };
  
  // 获取指定年份和季度的结束日期（该季度的最后一个月）
  const getQuarterEnd = (year: number, quarter: number) => {
    const month = (quarter - 1) * 3 + 2;
    return dayjs().year(year).month(month).endOf('month');
  };
  
  return {
    '最近一年': [getQuarterStart(currentYear - 1, currentQuarter), getQuarterEnd(currentYear, currentQuarter)] as [AppDate, AppDate],
    '最近两年': [getQuarterStart(currentYear - 2, currentQuarter), getQuarterEnd(currentYear, currentQuarter)] as [AppDate, AppDate],
    '最近三年': [getQuarterStart(currentYear - 3, currentQuarter), getQuarterEnd(currentYear, currentQuarter)] as [AppDate, AppDate],
    '最近五年': [getQuarterStart(currentYear - 5, currentQuarter), getQuarterEnd(currentYear, currentQuarter)] as [AppDate, AppDate],
    '最近十年': [getQuarterStart(currentYear - 10, currentQuarter), getQuarterEnd(currentYear, currentQuarter)] as [AppDate, AppDate],
  };
};

