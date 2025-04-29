// utils/sendEmail.js
const nodemailer = require('nodemailer');

exports.sendVerificationEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"DigiteX" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: 'Your DigiteX OTP Code - Verify Your Email',
        html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eaeaea; border-radius: 10px; padding: 30px; background-color: #ffffff;">
                <div style="text-align: center;">
                  <h2 style="color: #1E90FF; margin-bottom: 10px;">Welcome to DigiteX 👋</h2>
                  <p style="font-size: 16px; color: #555;">You're one step away from accessing the best laptops in Sri Lanka.</p>
                </div>
                <div style="text-align: center; margin: 30px 0;">
                  <p style="font-size: 16px; color: #333;">Here is your One-Time Password (OTP):</p>
                  <div style="font-size: 28px; font-weight: bold; color: #1E90FF; letter-spacing: 4px; margin: 10px 0;">
                    ${otp}
                  </div>
                  <p style="font-size: 14px; color: #777;">This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
                </div>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                <p style="font-size: 14px; color: #888;">If you did not request this, you can safely ignore this email.</p>
                <p style="font-size: 14px; color: #888;">- The DigiteX Team</p>
                <div style="text-align: center; margin-top: 20px;">
                  <img src="https://i.imgur.com/EVqJ2Aj.png" alt="DigiteX Logo" style="width: 100px; opacity: 0.6;" />
                </div>
              </div>
              `
    });

};
