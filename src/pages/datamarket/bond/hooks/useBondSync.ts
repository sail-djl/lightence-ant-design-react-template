import { useState } from 'react';
import { notificationController } from '@app/controllers/notificationController';
import { BondSyncPayload, syncBondData } from '@app/api/bond.api';

interface UseBondSyncOptions {
  onSuccess?: () => void;
}

export const useBondSync = ({ onSuccess }: UseBondSyncOptions = {}) => {
  const [syncOpen, setSyncOpen] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncType, setSyncType] = useState<string>('');
  const [syncPayload, setSyncPayload] = useState<BondSyncPayload>({});

  const handleSync = async () => {
    if (!syncType) {
      notificationController.warning({ message: '请选择同步类型' });
      return;
    }

    setSyncLoading(true);
    try {
      const result = await syncBondData(syncType, syncPayload);
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

  const openSync = (type: string, payload?: BondSyncPayload) => {
    setSyncType(type);
    setSyncPayload(payload || {});
    setSyncOpen(true);
  };

  return {
    syncOpen,
    setSyncOpen,
    syncLoading,
    syncType,
    syncPayload,
    setSyncPayload,
    handleSync,
    openSync,
  };
};

