import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const listAds = async (req: Request, res: Response) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const offset = (page - 1) * limit;
  const total = await prisma.ad.count();
  const ads = await prisma.ad.findMany({ skip: offset, take: limit, orderBy: { createdAt: 'desc' }});
  res.json({ data: ads, page, limit, total });
};

export const getAd = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const ad = await prisma.ad.findUnique({ where: { id } });
  if (!ad) return res.status(404).json({ message: "Ad not found" });
  res.json({ data: ad });
};

export const createAd = async (req: Request, res: Response) => {
  const { adType, content, userId } = req.body;
  const created = await prisma.ad.create({ data: { adType, content, userId }});
  res.status(201).json({ data: created });
};

export const updateAd = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { adType, content } = req.body;
  const updated = await prisma.ad.update({ where: { id }, data: { adType, content }});
  res.json({ data: updated });
};

export const deleteAd = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await prisma.ad.delete({ where: { id }});
  res.json({ message: "Deleted" });
};
