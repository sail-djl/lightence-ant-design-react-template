import { useCallback, useEffect, useState } from 'react';
import { initialPagination } from '../utils';

interface UseOptionDataOptions<T, Q> {
  fetchFn: (params: Q & { skip?: number; limit?: number }) => Promise<{ data: T[]; count?: number }>;
  initialQuery: Q;
  autoFetch?: boolean;
  enablePagination?: boolean;
}

export const useOptionData = <T, Q extends Record<string, any>>({
  fetchFn,
  initialQuery,
  autoFetch = true,
  enablePagination = true,
}: UseOptionDataOptions<T, Q>) => {
  const [query, setQuery] = useState(initialQuery);
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(
    async (page = 1, pageSize = initialPagination.pageSize, overrideQuery?: Q) => {
      setLoading(true);
      try {
        const params: any = { ...(overrideQuery || query) };
        if (enablePagination) {
          params.skip = (page - 1) * pageSize;
          params.limit = pageSize;
        }
        const res = await fetchFn(params);
        setRows(res.data);
        if (res.count !== undefined) {
          setTotal(res.count);
        }
        if (enablePagination) {
          setPagination({ current: page, pageSize });
        }
      } finally {
        setLoading(false);
      }
    },
    [query, fetchFn, enablePagination]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
    // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

  return {
    query,
    setQuery,
    rows,
    loading,
    pagination,
    total,
    fetchData,
  };
};

