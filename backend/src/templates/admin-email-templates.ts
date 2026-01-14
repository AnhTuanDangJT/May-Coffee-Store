import { buildFrontendUrl } from "../utils/urlBuilder";

export const adminInvitationTemplate = (
  email: string,
  registerUrl: string,
) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
  </head>
  <body style="margin:0;padding:0;background-color:#FFF8F0;font-family:'Manrope',Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#FFF8F0;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:600px;background-color:#FFFFFF;border-radius:24px;box-shadow:0 8px 32px rgba(195,142,90,0.12);overflow:hidden;">
            <tr>
              <td style="padding:40px 32px;">
                <!-- Main Heading -->
                <h1 style="margin:0 0 24px 0;font-size:28px;font-weight:600;line-height:1.3;color:#3A1F16;font-family:'Manrope',Arial,sans-serif;">
                  Lời mời làm Admin
                </h1>
                
                <!-- Greeting -->
                <p style="margin:0 0 20px 0;font-size:16px;line-height:1.6;color:#5A4638;font-family:'Manrope',Arial,sans-serif;">
                  Chào bạn,
                </p>
                
                <!-- Main Message -->
                <p style="margin:0 0 24px 0;font-size:16px;line-height:1.6;color:#5A4638;font-family:'Manrope',Arial,sans-serif;">
                  Bạn đã được mời trở thành Admin của May Coffee. Để bắt đầu, vui lòng đăng ký tài khoản với email <strong style="color:#3A1F16;">${email}</strong>.
                </p>
                
                <p style="margin:0 0 24px 0;font-size:16px;line-height:1.6;color:#5A4638;font-family:'Manrope',Arial,sans-serif;">
                  Sau khi đăng ký và xác nhận email, bạn sẽ tự động được cấp quyền Admin.
                </p>
                
                <!-- CTA Button -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:0 0 32px 0;">
                  <tr>
                    <td align="center">
                      <a href="${registerUrl}" style="display:inline-block;padding:14px 32px;background-color:#C38E5A;color:#FFFFFF;text-decoration:none;border-radius:12px;font-weight:600;font-size:16px;font-family:'Manrope',Arial,sans-serif;box-shadow:0 4px 12px rgba(195,142,90,0.3);">
                        Đăng ký ngay
                      </a>
                    </td>
                  </tr>
                </table>
                
                <!-- Divider -->
                <hr style="margin:32px 0;border:none;border-top:1px solid #F4D4B6;background:none;height:1px;">
                
                <!-- English Version -->
                <p style="margin:0;font-size:14px;line-height:1.6;color:#6F4633;font-family:'Manrope',Arial,sans-serif;">
                  <strong style="color:#3A1F16;">EN</strong> — You've been invited to become an Admin of May Coffee. Please register an account with email <strong style="color:#3A1F16;">${email}</strong>. After registration and email verification, you will automatically be granted Admin privileges.
                </p>
              </td>
            </tr>
          </table>
          
          <!-- Footer Spacing -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:600px;margin-top:24px;">
            <tr>
              <td style="padding:0 32px;">
                <p style="margin:0;font-size:12px;line-height:1.5;color:#8B6F5A;text-align:center;font-family:'Manrope',Arial,sans-serif;">
                  This email was sent from May Coffee. Please do not reply to this message.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;

export const adminPromotionNotificationTemplate = (
  name: string,
  adminUrl: string,
) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
  </head>
  <body style="margin:0;padding:0;background-color:#FFF8F0;font-family:'Manrope',Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#FFF8F0;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:600px;background-color:#FFFFFF;border-radius:24px;box-shadow:0 8px 32px rgba(195,142,90,0.12);overflow:hidden;">
            <tr>
              <td style="padding:40px 32px;">
                <!-- Main Heading -->
                <h1 style="margin:0 0 24px 0;font-size:28px;font-weight:600;line-height:1.3;color:#3A1F16;font-family:'Manrope',Arial,sans-serif;">
                  Chúc mừng!
                </h1>
                
                <!-- Greeting -->
                <p style="margin:0 0 20px 0;font-size:16px;line-height:1.6;color:#5A4638;font-family:'Manrope',Arial,sans-serif;">
                  Chào ${name},
                </p>
                
                <!-- Main Message -->
                <p style="margin:0 0 24px 0;font-size:16px;line-height:1.6;color:#5A4638;font-family:'Manrope',Arial,sans-serif;">
                  Bạn đã được cấp quyền Admin của May Coffee. Bây giờ bạn có thể truy cập trang quản trị để quản lý người dùng, sự kiện và feedback.
                </p>
                
                <!-- CTA Button -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:0 0 32px 0;">
                  <tr>
                    <td align="center">
                      <a href="${adminUrl}" style="display:inline-block;padding:14px 32px;background-color:#C38E5A;color:#FFFFFF;text-decoration:none;border-radius:12px;font-weight:600;font-size:16px;font-family:'Manrope',Arial,sans-serif;box-shadow:0 4px 12px rgba(195,142,90,0.3);">
                        Truy cập Admin Dashboard
                      </a>
                    </td>
                  </tr>
                </table>
                
                <!-- Divider -->
                <hr style="margin:32px 0;border:none;border-top:1px solid #F4D4B6;background:none;height:1px;">
                
                <!-- English Version -->
                <p style="margin:0;font-size:14px;line-height:1.6;color:#6F4633;font-family:'Manrope',Arial,sans-serif;">
                  <strong style="color:#3A1F16;">EN</strong> — Congratulations! You've been granted Admin privileges for May Coffee. You can now access the admin dashboard to manage users, events, and feedback.
                </p>
              </td>
            </tr>
          </table>
          
          <!-- Footer Spacing -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:600px;margin-top:24px;">
            <tr>
              <td style="padding:0 32px;">
                <p style="margin:0;font-size:12px;line-height:1.5;color:#8B6F5A;text-align:center;font-family:'Manrope',Arial,sans-serif;">
                  This email was sent from May Coffee. Please do not reply to this message.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;

