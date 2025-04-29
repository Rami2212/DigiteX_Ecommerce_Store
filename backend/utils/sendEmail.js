// utils/sendEmail.js
const nodemailer = require('nodemailer');

exports.sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    await transporter.sendMail({
        from: `"DigiteX" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: 'Verify your email',
        html: `<h3>Welcome to DigiteX!</h3>
           <p>Please verify your email by clicking the link below:</p>
           <a href="${url}">Verify Email</a>`,
    });
};
