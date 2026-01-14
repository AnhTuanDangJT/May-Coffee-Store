const baseStyles = `
  font-family: 'Manrope', Arial, sans-serif;
  background-color:#120705;
  color:#f5f1ed;
  padding:32px;
`;

const cardStyles = `
  background:#1f0c08;
  border-radius:24px;
  padding:24px;
  border:1px solid rgba(255,255,255,0.08);
`;

const headingStyles = `
  font-size:20px;
  margin-bottom:12px;
  letter-spacing:0.05em;
  text-transform:uppercase;
  color:#f7c27c;
`;

const paragraphStyles = `
  font-size:15px;
  line-height:1.6;
  color:#fef7f0;
`;

const divider = `<hr style="border:none;border-top:1px solid rgba(255,255,255,0.1);margin:24px 0;" />`;

export const verifyEmailTemplate = (name: string, code: string, verifyUrl?: string) => `
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
                  Xác nhận email
                </h1>
                
                <!-- Greeting -->
                <p style="margin:0 0 20px 0;font-size:16px;line-height:1.6;color:#5A4638;font-family:'Manrope',Arial,sans-serif;">
                  Chào ${name},
                </p>
                
                <!-- Main Message -->
                <p style="margin:0 0 24px 0;font-size:16px;line-height:1.6;color:#5A4638;font-family:'Manrope',Arial,sans-serif;">
                  Mã xác nhận của bạn là
                </p>
                
                <!-- Verification Code Box -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:0 0 24px 0;">
                  <tr>
                    <td align="center">
                      <div style="display:inline-block;padding:20px 32px;background-color:#F5E6D8;border-radius:16px;border:2px solid #C38E5A;box-shadow:0 4px 12px rgba(195,142,90,0.15);">
                        <span style="font-size:32px;font-weight:700;letter-spacing:0.3em;color:#3A1F16;font-family:'Manrope',Arial,sans-serif;line-height:1;">
                          ${code}
                        </span>
                      </div>
                    </td>
                  </tr>
                </table>
                
                <!-- Expiry Notice -->
                <p style="margin:0 0 24px 0;font-size:16px;line-height:1.6;color:#5A4638;font-family:'Manrope',Arial,sans-serif;">
                  Mã có hiệu lực trong 10 phút. Đừng chia sẻ cho người khác nhé.
                </p>
                
                ${verifyUrl ? `
                <!-- Verify Link Button -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:0 0 32px 0;">
                  <tr>
                    <td align="center">
                      <a href="${verifyUrl}" style="display:inline-block;padding:14px 32px;background-color:#C38E5A;color:#FFFFFF;text-decoration:none;border-radius:12px;font-weight:600;font-size:16px;font-family:'Manrope',Arial,sans-serif;box-shadow:0 4px 12px rgba(195,142,90,0.3);">
                        Xác nhận email ngay
                      </a>
                    </td>
                  </tr>
                </table>
                ` : ""}
                
                <!-- Divider -->
                <hr style="margin:32px 0;border:none;border-top:1px solid #F4D4B6;background:none;height:1px;">
                
                <!-- English Version -->
                <p style="margin:0;font-size:14px;line-height:1.6;color:#6F4633;font-family:'Manrope',Arial,sans-serif;">
                  <strong style="color:#3A1F16;">EN</strong> — Hi ${name}, your verification code is <strong style="color:#3A1F16;font-weight:600;">${code}</strong>. It expires in 10 minutes.
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

export const feedbackThanksTemplate = (name: string) => `
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
                  Cảm ơn vì feedback!
                </h1>
                
                <!-- Greeting -->
                <p style="margin:0 0 32px 0;font-size:16px;line-height:1.6;color:#5A4638;font-family:'Manrope',Arial,sans-serif;">
                  ${name}, cảm ơn bạn đã chia sẻ cảm nhận. Đội ngũ May Coffee sẽ đọc từng feedback và chỉ hiển thị những câu chữ phù hợp vibe R&B nhất.
                </p>
                
                <!-- Divider -->
                <hr style="margin:32px 0;border:none;border-top:1px solid #F4D4B6;background:none;height:1px;">
                
                <!-- English Version -->
                <p style="margin:0;font-size:14px;line-height:1.6;color:#6F4633;font-family:'Manrope',Arial,sans-serif;">
                  <strong style="color:#3A1F16;">EN</strong> — Thank you for sending love!
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

export const accountDeletedTemplate = (name: string, reason: string) => `
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
                  Tài khoản đã được gỡ
                </h1>
                
                <!-- Greeting -->
                <p style="margin:0 0 20px 0;font-size:16px;line-height:1.6;color:#5A4638;font-family:'Manrope',Arial,sans-serif;">
                  Chào ${name},<br/>Tài khoản May Coffee của bạn đã bị xóa vì lý do sau:
                </p>
                
                <!-- Reason Box -->
                <div style="margin:0 0 24px 0;padding:20px;background-color:#F5E6D8;border-radius:16px;border-left:4px solid #C38E5A;">
                  <p style="margin:0;font-size:16px;line-height:1.6;color:#3A1F16;font-family:'Manrope',Arial,sans-serif;">
                    ${reason}
                  </p>
                </div>
                
                <!-- Message -->
                <p style="margin:0 0 32px 0;font-size:16px;line-height:1.6;color:#5A4638;font-family:'Manrope',Arial,sans-serif;">
                  Nếu có thắc mắc, hãy phản hồi email này (VN/EN đều được).
                </p>
                
                <!-- Divider -->
                <hr style="margin:32px 0;border:none;border-top:1px solid #F4D4B6;background:none;height:1px;">
                
                <!-- English Version -->
                <p style="margin:0;font-size:14px;line-height:1.6;color:#6F4633;font-family:'Manrope',Arial,sans-serif;">
                  <strong style="color:#3A1F16;">EN</strong> — Hello ${name}, your account was removed for the reason above. Reply to this email if you need support.
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

export const eventAnnouncementTemplate = (
  title: string,
  description: string,
  schedule: string,
  eventsUrl: string,
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
                  ${title}
                </h1>
                
                <!-- Description -->
                <div style="margin:0 0 24px 0;font-size:16px;line-height:1.6;color:#5A4638;font-family:'Manrope',Arial,sans-serif;">
                  ${description.replace(/\n/g, "<br/>")}
                </div>
                
                ${schedule ? `
                <!-- Schedule Box -->
                <div style="margin:0 0 24px 0;padding:16px 20px;background-color:#F5E6D8;border-radius:16px;border:2px solid #C38E5A;">
                  <p style="margin:0;font-size:16px;font-weight:600;color:#3A1F16;font-family:'Manrope',Arial,sans-serif;">
                    📅 ${schedule}
                  </p>
                </div>
                ` : ''}
                
                <!-- CTA Button -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:0 0 32px 0;">
                  <tr>
                    <td align="center">
                      <a href="${eventsUrl}" style="display:inline-block;padding:14px 32px;background-color:#C38E5A;color:#FFFFFF;text-decoration:none;border-radius:12px;font-weight:600;font-size:16px;font-family:'Manrope',Arial,sans-serif;box-shadow:0 4px 12px rgba(195,142,90,0.3);">
                        Xem chi tiết sự kiện
                      </a>
                    </td>
                  </tr>
                </table>
                
                <!-- Divider -->
                <hr style="margin:32px 0;border:none;border-top:1px solid #F4D4B6;background:none;height:1px;">
                
                <!-- Footer Note -->
                <p style="margin:0;font-size:14px;line-height:1.6;color:#6F4633;font-family:'Manrope',Arial,sans-serif;">
                  <strong style="color:#3A1F16;">EN</strong> — ${title}. ${description.replace(/\n/g, " ")}${schedule ? ` Schedule: ${schedule}.` : ''} View event details on our website.
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

