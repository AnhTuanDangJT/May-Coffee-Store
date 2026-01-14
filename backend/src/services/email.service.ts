import sgMail from "@sendgrid/mail";
import env from "../config/env";
import { logger } from "../config/logger";
import {
  verifyEmailTemplate,
  feedbackThanksTemplate,
  accountDeletedTemplate,
  eventAnnouncementTemplate,
} from "../templates/emailTemplates";
import {
  adminInvitationTemplate,
  adminPromotionNotificationTemplate,
} from "../templates/admin-email-templates";
import { buildFrontendUrlWithQuery, buildFrontendUrl } from "../utils/urlBuilder";

if (env.sendGridApiKey) {
  sgMail.setApiKey(env.sendGridApiKey);
} else {
  logger.warn("SENDGRID_API_KEY missing, emails will be skipped");
}

const sendEmail = async (to: string, subject: string, html: string) => {
  if (!env.sendGridApiKey) {
    logger.debug("[Email Service] Skipping email (no SendGrid API key)");
    return;
  }
  
  try {
    await sgMail.send({
      to,
      from: env.sendGridFromEmail,
      subject,
      html,
    });
    logger.info(`[Email Service] Email sent successfully to ${to}`);
  } catch (error) {
    logger.error(`[Email Service] Failed to send email to ${to}`, error);
    // Don't throw - allow registration to succeed even if email fails
    // The error is logged for debugging
  }
};

export const emailService = {
  sendVerificationEmail: async (
    to: string,
    name: string,
    code: string,
    locale?: string | null
  ) => {
    const verifyUrl = buildFrontendUrlWithQuery(
      "/auth/verify",
      { email: to },
      locale
    );
    logger.info(`[Email Service] Sending verification email to ${to} with locale: ${locale || "vi (default)"}, verifyUrl: ${verifyUrl}`);
    return sendEmail(
      to,
      "May Coffee • Xác nhận email",
      verifyEmailTemplate(name, code, verifyUrl),
    );
  },
  sendFeedbackThankYou: async (to: string, name: string) => {
    return sendEmail(
      to,
      "May Coffee • Cảm ơn vì feedback",
      feedbackThanksTemplate(name),
    );
  },
  sendAccountDeleted: async (to: string, name: string, reason: string) => {
    return sendEmail(
      to,
      "May Coffee • Thông báo tài khoản",
      accountDeletedTemplate(name, reason),
    );
  },
  sendEventAnnouncement: async (
    to: string,
    title: string,
    description: string,
    schedule: string,
  ) => {
    const eventsUrl = buildFrontendUrl("/events", "vi");
    return sendEmail(
      to,
      `May Coffee • ${title}`,
      eventAnnouncementTemplate(title, description, schedule, eventsUrl),
    );
  },
  sendAdminInvitation: async (to: string, registerUrl: string) => {
    return sendEmail(
      to,
      "May Coffee • Lời mời làm Admin",
      adminInvitationTemplate(to, registerUrl),
    );
  },
  sendAdminPromotionNotification: async (to: string, name: string) => {
    const adminUrl = buildFrontendUrl("/admin", "vi");
    return sendEmail(
      to,
      "May Coffee • Bạn đã trở thành Admin",
      adminPromotionNotificationTemplate(name, adminUrl),
    );
  },
};

