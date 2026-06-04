const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async (options) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: `"E-Commerce" <${process.env.SMTP_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

const getWelcomeEmailHTML = (name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0;">Welcome to E-Commerce!</h1>
      </div>
      <div style="padding: 30px 0; line-height: 1.6; color: #333;">
        <p>Hi <strong>${name}</strong>,</p>
        <p>Thank you for creating an account with us! We're excited to have you on board.</p>
        <p>You can now browse our products, add items to your cart, and start shopping.</p>
        <p>If you have any questions, feel free to reply to this email.</p>
        <p>Happy Shopping!</p>
      </div>
      <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} E-Commerce. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};

const getVerificationEmailHTML = (name, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0;">Email Verification</h1>
      </div>
      <div style="padding: 30px 0; line-height: 1.6; color: #333;">
        <p>Hi <strong>${name}</strong>,</p>
        <p>Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 14px 40px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">Verify Email</a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not create an account, please ignore this email.</p>
      </div>
      <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} E-Commerce. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};

const getResetPasswordEmailHTML = (name, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0;">Password Reset</h1>
      </div>
      <div style="padding: 30px 0; line-height: 1.6; color: #333;">
        <p>Hi <strong>${name}</strong>,</p>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #ffffff; padding: 14px 40px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">Reset Password</a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #f5576c;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
      </div>
      <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} E-Commerce. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};

module.exports = { sendEmail, getWelcomeEmailHTML, getVerificationEmailHTML, getResetPasswordEmailHTML };
