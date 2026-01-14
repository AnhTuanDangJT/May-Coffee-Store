import { Schema, model, type Document, type Types } from "mongoose";

export interface EmailVerificationCodeDocument extends Document {
  user: Types.ObjectId;
  code: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const emailVerificationCodeSchema =
  new Schema<EmailVerificationCodeDocument>(
    {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      code: { type: String, required: true },
      expiresAt: { type: Date, required: true },
    },
    {
      timestamps: true,
    },
  );

emailVerificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const EmailVerificationCode = model<EmailVerificationCodeDocument>(
  "EmailVerificationCode",
  emailVerificationCodeSchema,
);

