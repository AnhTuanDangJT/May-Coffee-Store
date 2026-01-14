import { Schema, model, type Document, type Types } from "mongoose";

export type AdminActionType =
  | "add_admin"
  | "invite_admin"
  | "revoke_admin"
  | "delete_user"
  | "feedback_approve"
  | "feedback_reject"
  | "event_create"
  | "event_update"
  | "event_delete";

export interface AdminActionLogDocument extends Document {
  admin: Types.ObjectId;
  action: AdminActionType;
  targetId: string;
  reason?: string;
  meta?: Record<string, unknown>;
  createdAt: Date;
}

const adminActionLogSchema = new Schema<AdminActionLogDocument>(
  {
    admin: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    targetId: { type: String, required: true },
    reason: { type: String },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const AdminActionLog = model<AdminActionLogDocument>(
  "AdminActionLog",
  adminActionLogSchema,
);














