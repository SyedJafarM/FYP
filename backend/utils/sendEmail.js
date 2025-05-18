const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (to, subject, htmlBody, attachmentPath) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: `"Econest Bedding Inc." <${process.env.SMTP_USER}>`,
    to,
    subject,
    html: htmlBody,
    attachments: attachmentPath ? [{
      filename: attachmentPath.split('/').pop(),
      path: attachmentPath
    }] : []
  });
};

module.exports = sendEmail;
