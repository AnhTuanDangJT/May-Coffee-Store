import { AdminActionLog, type AdminActionType } from "../models/AdminActionLog";

export const auditService = {
  log: async (
    adminId: string,
    action: AdminActionType,
    targetId: string,
    reason?: string,
    meta?: Record<string, unknown>,
  ) => {
    const payload: Record<string, unknown> = {
      admin: adminId,
      action,
      targetId,
    };
    if (reason) payload.reason = reason;
    if (meta) payload.meta = meta;
    await AdminActionLog.create(payload);
  },
};

