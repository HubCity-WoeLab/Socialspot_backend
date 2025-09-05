import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const saveRefreshToken = async (userId: number, token: string, days = 7) => {
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return prisma.refreshToken.create({
    data: { token, expiresAt, userId }
  });
};

export const findRefreshToken = async (token: string) => {
  return prisma.refreshToken.findUnique({ where: { token } });
};

export const revokeRefreshToken = async (token: string) => {
  return prisma.refreshToken.updateMany({
    where: { token, revokedAt: null },
    data: { revokedAt: new Date() }
  });
};
