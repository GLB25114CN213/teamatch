import nodemailer from 'nodemailer';

export interface SendOtpEmailParams {
  toEmail: string;
  studentName: string;
  otp: string;
}

export async function sendOtpEmail({ toEmail, studentName, otp }: SendOtpEmailParams): Promise<{ success: boolean; error?: string }> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || `"TeamMatch GLBITM" <no-reply@glbitm.ac.in>`;

  // If SMTP is configured, send real email via Nodemailer
  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #051A14; color: #F8F7F5; border-radius: 16px; border: 1px solid rgba(183,243,74,0.2);">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <h1 style="color: #B7F34A; margin: 0; font-size: 24px; letter-spacing: -0.5px;">TeamMatch GLBITM</h1>
            <p style="color: #9BB0A6; font-size: 12px; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px;">Evidence-Based Student Discovery</p>
          </div>
          
          <div style="padding: 24px 0;">
            <p style="font-size: 16px; color: #F8F7F5; margin-bottom: 16px;">Hello <strong>${studentName}</strong>,</p>
            <p style="font-size: 14px; color: #9BB0A6; line-height: 1.6; margin-bottom: 24px;">
              Your 6-digit verification code to complete your GLBITM TeamMatch registration is:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #051A14; background-color: #B7F34A; padding: 12px 28px; border-radius: 12px; display: inline-block;">
                ${otp}
              </span>
            </div>
            
            <p style="font-size: 12px; color: #9BB0A6; text-align: center; margin-top: 24px;">
              This code will expire in <strong>10 minutes</strong>. Please do not share this verification code with anyone.
            </p>
          </div>
          
          <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px; text-align: center;">
            <p style="font-size: 11px; color: #5A6963; margin: 0;">
              GLB Bajaj Institute of Technology & Management — Greater Noida
            </p>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: smtpFrom,
        to: toEmail,
        subject: `${otp} is your TeamMatch GLBITM Verification Code`,
        html: htmlContent,
      });

      console.log(`✉️ OTP email sent successfully to ${toEmail}`);
      return { success: true };
    } catch (err) {
      const errorMsg = (err as Error).message || 'Failed to send email via SMTP';
      console.error(`❌ SMTP Email dispatch failed for ${toEmail}:`, errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  // Fallback log if SMTP credentials are not yet set in .env
  console.log(`ℹ️ SMTP credentials not configured in .env.local. OTP for ${toEmail} is ${otp}`);
  return { success: true };
}
