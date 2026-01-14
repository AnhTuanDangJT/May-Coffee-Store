import { sign, verify, type Secret, type SignOptions } from "jsonwebtoken";
import ms from "ms";
import env from "../config/env";

export type JwtPayload = {
  sub: string;
  role: string;
};

const resolveExpiresIn = (): SignOptions["expiresIn"] => {
  const raw = env.jwtAccessExpiresIn;
  const numeric = Number(raw);
  if (!Number.isNaN(numeric)) {
    return numeric;
  }
  const msValue = ms(raw as ms.StringValue);
  if (typeof msValue === "number") {
    return Math.floor(msValue / 1000);
  }
  return undefined;
};

export const signAccessToken = (payload: JwtPayload) => {
  const secret = env.jwtAccessSecret as Secret;
  const options: SignOptions = {};
  const expiresIn = resolveExpiresIn();
  if (expiresIn) {
    options.expiresIn = expiresIn;
  }
  return sign(payload, secret, options);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  const secret = env.jwtAccessSecret as Secret;
  return verify(token, secret) as JwtPayload;
};

