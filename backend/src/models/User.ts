import { Schema, model, type Document } from "mongoose";

export type UserRole = "user" | "admin";

export interface UserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isEmailVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export const User = model<UserDocument>("User", userSchema);

