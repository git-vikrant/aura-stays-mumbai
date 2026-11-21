import prisma from "../prisma.js";
import { logger } from "../logger.js";
import { sendBookingConfirmationEmail, sendEnquiryAcknowledgmentEmail } from "./emailService.js";

class BackgroundJobQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.concurrency = 2;
    this.activeWorkers = 0;
  }

  /**
   * Enqueue a new background task
   */
  async enqueue(type, payload) {
    try {
      const jobRecord = await prisma.jobLog.create({
        data: {
          type,
          payload: JSON.stringify(payload),
          status: "PENDING",
          attempts: 0
        }
      });

      this.queue.push(jobRecord.id);
      logger.info(`[JOB_QUEUE] Enqueued job ${jobRecord.id} of type ${type}`);

      // Trigger background processing asynchronously
      setImmediate(() => this.processNext());

      return jobRecord;
    } catch (err) {
      logger.error(`[JOB_QUEUE_ERROR] Failed to enqueue job: ${err.message}`);
      throw err;
    }
  }

  async processNext() {
    if (this.activeWorkers >= this.concurrency || this.queue.length === 0) {
      return;
    }

    const jobId = this.queue.shift();
    if (!jobId) return;

    this.activeWorkers++;

    try {
      const job = await prisma.jobLog.findUnique({ where: { id: jobId } });
      if (!job || job.status === "COMPLETED") {
        this.activeWorkers--;
        return;
      }

      await prisma.jobLog.update({
        where: { id: jobId },
        data: { status: "PROCESSING", attempts: { increment: 1 } }
      });

      const payload = JSON.parse(job.payload);
      logger.info(`[JOB_QUEUE] Processing job ${job.id} (${job.type}) attempt ${job.attempts + 1}`);

      // Route execution by job type
      await this.executeJobTask(job.type, payload);

      await prisma.jobLog.update({
        where: { id: jobId },
        data: { status: "COMPLETED", updatedAt: new Date() }
      });

      logger.info(`[JOB_QUEUE] Successfully completed job ${job.id} (${job.type})`);
    } catch (err) {
      logger.error(`[JOB_QUEUE_TASK_FAILED] Job ${jobId} failed: ${err.message}`);
      await prisma.jobLog.update({
        where: { id: jobId },
        data: {
          status: "FAILED",
          error: err.message,
          updatedAt: new Date()
        }
      });
    } finally {
      this.activeWorkers--;
      // Continue processing remaining items in queue
      if (this.queue.length > 0) {
        setImmediate(() => this.processNext());
      }
    }
  }

  async executeJobTask(type, payload) {
    switch (type) {
      case "SEND_BOOKING_EMAIL": {
        const { bookingId } = payload;
        const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          include: { hotel: true, room: true }
        });
        if (booking) {
          await sendBookingConfirmationEmail(booking, booking.hotel, booking.room);
        }
        break;
      }

      case "SEND_ENQUIRY_EMAIL": {
        const { enquiryId } = payload;
        const enquiry = await prisma.enquiry.findUnique({
          where: { id: enquiryId },
          include: { hotel: true }
        });
        if (enquiry) {
          await sendEnquiryAcknowledgmentEmail(enquiry, enquiry.hotel?.name);
        }
        break;
      }

      case "AUDIT_INVENTORY_METRICS": {
        logger.info("[JOB_QUEUE] Running audit inventory metrics background pass...");
        // Fast inventory consistency check
        const totalRooms = await prisma.room.count();
        const totalBookings = await prisma.booking.count();
        logger.info(`[JOB_QUEUE] Audit complete: ${totalRooms} rooms, ${totalBookings} historical bookings.`);
        break;
      }

      default:
        logger.warn(`[JOB_QUEUE] Unknown task type: ${type}`);
    }
  }

  async getRecentJobs(limit = 10) {
    return prisma.jobLog.findMany({
      take: limit,
      orderBy: { createdAt: "desc" }
    });
  }
}

export const jobQueue = new BackgroundJobQueue();
