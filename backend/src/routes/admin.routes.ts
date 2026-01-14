import { Router } from "express";
import { z } from "zod";
import {
  addAdmin,
  revokeAdmin,
  deleteUser,
  listAdminFeedback,
  listUsers,
  ratingsSummary,
  updateFeedbackApproval,
  userFeedbackHistory,
  deleteFeedback,
} from "../controllers/admin.controller";
import { createEvent, updateEvent, deleteEvent, listAllEvents } from "../controllers/event.controller";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { validateRequest } from "../middleware/validateRequest";

const router = Router();

router.use(requireAuth, requireAdmin);

const approvalSchema = z.object({
  body: z.object({
    approved: z.coerce.boolean(),
  }),
  params: z.object({
    id: z.string(),
  }),
});

const addAdminSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

const deleteUserSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    reason: z.string().min(5),
  }),
});

const revokeAdminSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

const eventSchema = z.object({
  body: z.object({
    title: z.string().min(4).max(120),
    description: z.string().min(10).max(2000),
    location: z.string().max(200).optional(),
    isPublished: z.boolean().optional(),
  }),
});

const updateEventSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    title: z.string().min(4).max(120).optional(),
    description: z.string().min(10).max(2000).optional(),
    location: z.string().max(200).optional(),
    isPublished: z.boolean().optional(),
  }),
});

const deleteEventSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

const deleteFeedbackSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

router.get("/feedback", listAdminFeedback);
router.patch(
  "/feedback/:id/approve",
  validateRequest(approvalSchema),
  updateFeedbackApproval,
);
router.delete(
  "/feedback/:id",
  validateRequest(deleteFeedbackSchema),
  deleteFeedback,
);
router.get("/ratings/summary", ratingsSummary);
router.get("/users", listUsers);
router.get("/users/:id/feedback-history", userFeedbackHistory);
router.post("/add-admin", validateRequest(addAdminSchema), addAdmin);
router.post("/revoke-admin/:id", validateRequest(revokeAdminSchema), revokeAdmin);
router.delete(
  "/users/:id",
  validateRequest(deleteUserSchema),
  deleteUser,
);
router.get("/events", listAllEvents);
router.post("/events", validateRequest(eventSchema), createEvent);
router.patch("/events/:id", validateRequest(updateEventSchema), updateEvent);
router.delete("/events/:id", validateRequest(deleteEventSchema), deleteEvent);

export default router;

