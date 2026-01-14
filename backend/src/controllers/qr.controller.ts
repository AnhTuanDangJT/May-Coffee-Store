import type { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { qrService } from "../services/qr.service";

export const getMenuQr = catchAsync(async (_req: Request, res: Response) => {
  const buffer = await qrService.getMenuQr();
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(buffer);
});















