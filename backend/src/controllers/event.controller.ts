import type { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { eventService } from "../services/event.service";

export const createEvent = catchAsync(async (req: Request, res: Response) => {
  const event = await eventService.create(req.user!._id.toString(), req.body);
  res.status(201).json({
    message: event.isPublished 
      ? "Đã tạo và xuất bản sự kiện, email thông báo đã được gửi"
      : "Đã tạo sự kiện (chưa xuất bản)",
    data: event,
  });
});

export const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const event = await eventService.update(req.user!._id.toString(), id, req.body);
  res.json({
    message: event.isPublished
      ? "Đã cập nhật sự kiện, email thông báo đã được gửi"
      : "Đã cập nhật sự kiện",
    data: event,
  });
});

export const deleteEvent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  await eventService.delete(req.user!._id.toString(), id);
  res.json({
    message: "Đã xóa sự kiện",
  });
});

export const listAllEvents = catchAsync(async (_req: Request, res: Response) => {
  const events = await eventService.listAll();
  res.json({ data: events });
});

export const listPublicEvents = catchAsync(
  async (_req: Request, res: Response) => {
    const events = await eventService.listPublic();
    res.json({ data: events });
  },
);


