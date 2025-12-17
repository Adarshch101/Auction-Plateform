const nodemailer = require('nodemailer');

// Creates a reusable transporter based on environment variables
// Required env:
//  SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL
// Optional:
//  SMTP_SECURE ("true" to use TLS)
function createTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }
  const secure = String(SMTP_SECURE || '').toLowerCase() === 'true';
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

async function sendMail({ to, subject, html, text }) {
  const transporter = createTransport();
  if (!transporter) {
    // Dev fallback: indicate that SMTP is not configured
    console.warn('[mailer] SMTP is not configured. Skipping actual send.');
    return { skipped: true };
  }
  const info = await transporter.sendMail({
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });
  return { messageId: info.messageId };
}

module.exports = { sendMail };
