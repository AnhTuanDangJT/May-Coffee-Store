import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export const hashPassword = async (plain: string) => {
  return bcrypt.hash(plain, SALT_ROUNDS);
};

export const verifyPassword = async (plain: string, hash: string) => {
  return bcrypt.compare(plain, hash);
};

