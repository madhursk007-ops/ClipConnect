const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Email sending failed:', error);
    throw error;
  }
};

// Email templates
const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to ClipConnect!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7F5AF0;">Welcome to ClipConnect, ${name}!</h2>
        <p>Thank you for joining our community of talented video editors and clients.</p>
        <p>Get started by completing your profile and exploring our marketplace.</p>
        <a href="${process.env.FRONTEND_URL}/dashboard" style="background: #7F5AF0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Get Started</a>
        <p>Best regards,<br>The ClipConnect Team</p>
      </div>
    `,
  }),

  projectProposal: (editorName, clientName, projectTitle) => ({
    subject: `New Proposal for Your Project: ${projectTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7F5AF0;">New Project Proposal</h2>
        <p>Hello ${clientName},</p>
        <p><strong>${editorName}</strong> has submitted a proposal for your project "<strong>${projectTitle}</strong>".</p>
        <p>Log in to your dashboard to review the proposal and respond.</p>
        <a href="${process.env.FRONTEND_URL}/dashboard" style="background: #7F5AF0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Proposal</a>
        <p>Best regards,<br>The ClipConnect Team</p>
      </div>
    `,
  }),

  passwordReset: (resetUrl) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7F5AF0;">Password Reset</h2>
        <p>You requested a password reset for your ClipConnect account.</p>
        <p>Click the link below to reset your password. This link is valid for 10 minutes.</p>
        <a href="${resetUrl}" style="background: #7F5AF0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The ClipConnect Team</p>
      </div>
    `,
  }),
};

module.exports = {
  sendEmail,
  emailTemplates,
  createTransporter,
};
