import { logger } from "../config/logger";

type EmailJob = () => Promise<void>;

const queue: EmailJob[] = [];
let processing = false;

const processQueue = async () => {
  if (processing) return;
  processing = true;
  while (queue.length > 0) {
    const job = queue.shift();
    if (!job) continue;
    try {
      await job();
    } catch (error) {
      logger.error("[EmailQueue] Job failed", error);
    }
  }
  processing = false;
};

export const enqueueEmailJob = (job: EmailJob) => {
  queue.push(job);
  void processQueue();
};















