import type { UserDocument } from "../models/User";

export const serializeUser = (user: UserDocument) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

