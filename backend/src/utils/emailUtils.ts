/**
 * Shared email utility functions for consistent email templates
 */

/**
 * Generates the logo HTML snippet for email templates
 * @param logoUrl - Absolute public URL to the logo image
 * @returns HTML string for the logo section
 */
export function getEmailLogoHtml(logoUrl: string): string {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:0 0 40px 0;">
      <tr>
        <td align="center" style="padding:0;">
          <img src="${logoUrl}" alt="May Coffee" width="120" style="display:block;margin:0 auto;max-width:200px;width:100%;height:auto;" />
        </td>
      </tr>
    </table>
  `;
}







