import prisma from "../prisma.js";
import { apiSuccess, apiError } from "../utils/response.js";
import { jobQueue } from "../services/jobQueue.js";
import { logger } from "../logger.js";

export async function createEnquiry(req, res) {
  try {
    const { hotelId, name, email, phone, category = "GENERAL", subject, message } = req.body;

    let attachmentUrl = null;
    if (req.file) {
      attachmentUrl = `/uploads/${req.file.filename}`;
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        hotelId: hotelId || null,
        name,
        email,
        phone: phone || null,
        category,
        subject,
        message,
        attachmentUrl,
        status: "NEW"
      },
      include: {
        hotel: {
          select: { name: true, neighborhood: true }
        }
      }
    });

    // Enqueue background email notification
    await jobQueue.enqueue("SEND_ENQUIRY_EMAIL", { enquiryId: enquiry.id });

    logger.info(`[ENQUIRY_CREATED] New enquiry '${subject}' from ${email}`);

    return apiSuccess(res, enquiry, "Enquiry submitted successfully. Our concierge will contact you shortly.", 201);
  } catch (err) {
    logger.error(`[ENQUIRY_ERROR] Failed to submit enquiry: ${err.message}`);
    return apiError(res, "Failed to submit enquiry", 500, err.message);
  }
}

export async function getAllEnquiries(req, res) {
  try {
    const { status, category } = req.query;

    const where = {};
    if (status) where.status = status;
    if (category) where.category = category;

    const enquiries = await prisma.enquiry.findMany({
      where,
      include: {
        hotel: {
          select: { id: true, name: true, neighborhood: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return apiSuccess(res, enquiries, "Enquiries retrieved");
  } catch (err) {
    return apiError(res, "Failed to retrieve enquiries", 500, err.message);
  }
}

export async function updateEnquiry(req, res) {
  try {
    const { id } = req.params;
    const { status, staffNotes } = req.body;

    const updated = await prisma.enquiry.update({
      where: { id },
      data: {
        status,
        staffNotes
      },
      include: { hotel: true }
    });

    return apiSuccess(res, updated, "Enquiry updated");
  } catch (err) {
    return apiError(res, "Failed to update enquiry", 500, err.message);
  }
}

export async function deleteEnquiry(req, res) {
  try {
    const { id } = req.params;
    await prisma.enquiry.delete({ where: { id } });
    return apiSuccess(res, null, "Enquiry deleted successfully");
  } catch (err) {
    return apiError(res, "Failed to delete enquiry", 500, err.message);
  }
}
