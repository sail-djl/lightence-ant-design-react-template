import { useState } from 'react';
import { notificationController } from '@app/controllers/notificationController';

interface UseIndexSyncOptions<P> {
  syncFn: (payload: P) => Promise<{ success: number; failed: number }>;
  onSuccess?: () => void;
}

export const useIndexSync = <P extends Record<string, any>>({
  syncFn,
  onSuccess,
}: UseIndexSyncOptions<P>) => {
  const [syncOpen, setSyncOpen] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncPayload, setSyncPayload] = useState<Partial<P>>({});

  const handleSync = async (validateFn?: () => boolean) => {
    if (validateFn && !validateFn()) {
      return;
    }
    setSyncLoading(true);
    try {
      const result = await syncFn(syncPayload as P);
      notificationController.success({
        message: `同步完成：成功 ${result.success} 条，失败 ${result.failed} 条`,
      });
      setSyncOpen(false);
      onSuccess?.();
    } catch (e: any) {
      notificationController.error({ message: e?.message || '同步失败' });
    } finally {
      setSyncLoading(false);
    }
  };

  return {
    syncOpen,
    setSyncOpen,
    syncLoading,
    syncPayload,
    setSyncPayload,
    handleSync,
  };
};



