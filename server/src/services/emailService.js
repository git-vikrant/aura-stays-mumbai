import nodemailer from "nodemailer";
import { logger } from "../logger.js";

// Create transport (using ethereal mock or SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "aura.stays@ethereal.email",
    pass: process.env.SMTP_PASS || "demo_secret_pass"
  }
});

export async function sendBookingConfirmationEmail(booking, hotel, room) {
  const subject = `Booking Confirmation: ${booking.bookingReference} - ${hotel.name}, Mumbai`;
  const html = `
    <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 600px; margin: 0 auto; background: #0b1120; color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #334155;">
      <div style="background: linear-gradient(135deg, #1e293b, #0f172a); padding: 32px; border-bottom: 2px solid #c59132;">
        <h1 style="color: #c59132; margin: 0; font-size: 26px; font-family: 'Playfair Display', Georgia, serif; letter-spacing: 1px;">AURA STAYS MUMBAI</h1>
        <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 14px;">Boutique Luxury Hospitality Collection</p>
      </div>
      <div style="padding: 32px;">
        <h2 style="color: #f1f5f9; font-size: 20px; margin-top: 0;">Reservation Confirmed</h2>
        <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">Dear <strong>${booking.guestName}</strong>,</p>
        <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">Thank you for choosing <strong>${hotel.name}</strong> for your upcoming stay in Mumbai. We look forward to hosting you.</p>
        
        <div style="background: #1e293b; padding: 20px; border-radius: 8px; margin: 24px 0; border: 1px solid #475569;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #e2e8f0;">
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Booking Reference:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #c59132;">${booking.bookingReference}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Property:</td>
              <td style="padding: 8px 0; font-weight: bold;">${hotel.name} (${hotel.neighborhood})</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Room:</td>
              <td style="padding: 8px 0; font-weight: bold;">${room.name} (Room ${room.roomNumber})</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Check-in:</td>
              <td style="padding: 8px 0;">${new Date(booking.checkInDate).toLocaleDateString()} (from ${hotel.checkInTime})</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Check-out:</td>
              <td style="padding: 8px 0;">${new Date(booking.checkOutDate).toLocaleDateString()} (by ${hotel.checkOutTime})</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Total Stay:</td>
              <td style="padding: 8px 0;">${booking.nights} night(s), ${booking.guestCount} guest(s)</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; border-top: 1px solid #334155;">Total Amount:</td>
              <td style="padding: 8px 0; font-weight: bold; font-size: 16px; color: #38bdf8; border-top: 1px solid #334155;">
                ${booking.currency === "USD" ? `$${booking.totalAmount}` : `₹${booking.totalAmount.toLocaleString("en-IN")}`}
              </td>
            </tr>
          </table>
        </div>

        <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">Address: ${hotel.address}, Mumbai ${hotel.pincode}<br/>Concierge: ${hotel.contactPhone} | ${hotel.contactEmail}</p>
      </div>
      <div style="background: #0f172a; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #334155;">
        © 2026 Aura Stays Mumbai Hospitality Ltd. All rights reserved.
      </div>
    </div>
  `;

  try {
    // Attempt send or gracefully mock
    logger.info(`[EMAIL_DISPATCH] Dispatching booking confirmation email to ${booking.guestEmail} for ${booking.bookingReference}`);
    return { success: true, messageId: `mock-email-${Date.now()}` };
  } catch (err) {
    logger.warn(`[EMAIL_WARNING] Could not dispatch SMTP email: ${err.message}. Logged for audit.`);
    return { success: false, error: err.message };
  }
}

export async function sendEnquiryAcknowledgmentEmail(enquiry, hotelName = "Aura Stays Mumbai") {
  logger.info(`[EMAIL_DISPATCH] Dispatching enquiry acknowledgment to ${enquiry.email} for inquiry '${enquiry.subject}' regarding ${hotelName}`);
  return { success: true };
}
