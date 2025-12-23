// 复用index模块的工具函数
export { trim } from '../index/utils';

// 股票数据分页默认值设为15
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

