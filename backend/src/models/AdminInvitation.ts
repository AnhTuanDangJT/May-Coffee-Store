import { Schema, model, type Document, type Types } from "mongoose";

export interface AdminInvitationDocument extends Document {
  email: string;
  invitedBy: Types.ObjectId; // Admin user ID
  createdAt: Date;
}

const adminInvitationSchema = new Schema<AdminInvitationDocument>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    invitedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const AdminInvitation = model<AdminInvitationDocument>(
  "AdminInvitation",
  adminInvitationSchema,
);













