import dayjs from "dayjs";
import { Event } from "../models/Event";
import { User } from "../models/User";
import { emailService } from "./email.service";
import { enqueueEmailJob } from "./emailQueue.service";
import { auditService } from "./audit.service";
import { AppError } from "../utils/appError";

const EMAIL_BATCH_SIZE = 25;

type EventInput = {
  title: string;
  description: string;
  date?: Date;
  location?: string;
  isPublished?: boolean;
};

const chunk = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const formatSchedule = (date: Date | undefined, location?: string) => {
  if (date) {
    const dateStr = dayjs(date).format("DD/MM/YYYY • HH:mm");
    if (location) {
      return `${dateStr} • ${location}`;
    }
    return dateStr;
  }
  // For announcements without dates
  if (location) {
    return location;
  }
  return "";
};

const sendEventNotifications = async (event: typeof Event.prototype) => {
  const verifiedUsers = await User.find({
    isEmailVerified: true,
  }).select("email name");

  const schedule = formatSchedule(event.date, event.location);

  const batches = chunk(verifiedUsers, EMAIL_BATCH_SIZE);
  batches.forEach((batch) => {
    enqueueEmailJob(async () => {
      await Promise.allSettled(
        batch.map((user) =>
          emailService.sendEventAnnouncement(
            user.email,
            event.title,
            event.description,
            schedule,
          ),
        ),
      );
    });
  });
};

export const eventService = {
  create: async (adminId: string, input: EventInput) => {
    const event = await Event.create({
      ...input,
      isPublished: input.isPublished ?? false,
      createdBy: adminId,
    });

    await auditService.log(adminId, "event_create", event._id.toString());

    // Send notifications only if published
    if (event.isPublished) {
      await sendEventNotifications(event);
    }

    return event;
  },

  update: async (adminId: string, eventId: string, input: Partial<EventInput>) => {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new AppError("Event not found", 404);
    }

    const wasPublished = event.isPublished;
    const willBePublished = input.isPublished ?? event.isPublished;

    Object.assign(event, input);
    await event.save();

    await auditService.log(adminId, "event_update", eventId);

    // Send notifications if:
    // 1. Event is being published for the first time (wasn't published, now is)
    // 2. Event was already published and is being updated (send update notification)
    if (willBePublished) {
      await sendEventNotifications(event);
    }

    return event;
  },

  delete: async (adminId: string, eventId: string) => {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new AppError("Event not found", 404);
    }

    await Event.deleteOne({ _id: eventId });
    await auditService.log(adminId, "event_delete", eventId);
  },

  listAll: async () => {
    return Event.find().sort({ createdAt: -1 });
  },

  listPublic: async () => {
    return Event.find({ isPublished: true }).sort({ createdAt: -1 });
  },
};


