const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendVerificationEmail = async (email, otp) => {
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

exports.sendResetPasswordEmail = async (email, url) => {
    await transporter.sendMail({
        from: `"DigiteX Support" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: 'Reset Your Password - DigiteX',
        html: `
            <div style="font-family: Arial; padding: 20px;">
                <h2>Password Reset Request</h2>
                <p>You requested a password reset. Click the button below to reset your password:</p>
                <a href="${url}" style="background-color:#1E90FF;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">Reset Password</a>
                <p style="margin-top:20px;">If you didn’t request this, you can ignore this email.</p>
                <hr>
                <small>This link will expire in 10 minutes.</small>
            </div>
        `,
    });
};

exports.sendResetPasswordEmailLoggedIn = async (email, url) => {
    await transporter.sendMail({
        from: `"DigiteX Support" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: 'Reset Your Password - DigiteX',
        html: `
            <div style="font-family: Arial; padding: 20px;">
                <h2>Password Reset Request</h2>
                <p>You requested a password reset. Click the button below to reset your password:</p>
                <a href="${url}" style="background-color:#1E90FF;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">Reset Password</a>
                <p style="margin-top:20px;">If you didn’t request this, you can ignore this email.</p>
                <hr>
                <small>This link will expire in 10 minutes.</small>
            </div>
        `,
    });
};

exports.resendVerificationEmail = async (email, otp) => {
    const html = `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Verify your Email – DigiteX</h2>
            <p>Thanks for signing up! Use the OTP below to verify your email:</p>
            <div style="font-size: 24px; font-weight: bold; color: #1E90FF;">${otp}</div>
            <p>This code will expire in 10 minutes.</p>
            <br />
            <p style="font-size: 12px; color: #888;">If you didn't request this, you can safely ignore it.</p>
        </div>
    `;

    await transporter.sendMail({
        from: `"DigiteX" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: 'Verify your Email - DigiteX',
        html
    });
};

exports.sendOrderConfirmationEmail = async (email, orderData) => {
    const {
        _id: orderId,
        items,
        shippingAddress,
        totalAmount,
        paymentMethod,
        status,
        createdAt
    } = orderData;

    // Generate items HTML
    const itemsHTML = items.map(item => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 15px 0;">
                <div style="display: flex; align-items: center;">
                    ${item.selectedVariant?.variantImage ?
        `<img src="${item.selectedVariant.variantImage}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px;" />`
        : ''
    }
                    <div>
                        <h4 style="margin: 0; color: #333; font-size: 16px;">${item.name}</h4>
                        ${item.selectedVariant?.color ?
        `<p style="margin: 5px 0; color: #666; font-size: 14px;">Color: ${item.selectedVariant.color}</p>`
        : ''
    }
                        <p style="margin: 0; color: #888; font-size: 14px;">Quantity: ${item.quantity}</p>
                    </div>
                </div>
            </td>
            <td style="text-align: right; padding: 15px 0;">
                <p style="margin: 0; font-weight: bold; color: #333; font-size: 16px;">LKR ${item.price.toLocaleString()}</p>
            </td>
        </tr>
    `).join('');

    // Format order date
    const orderDate = new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    await transporter.sendMail({
        from: `"DigiteX" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: `Order Confirmation #${orderId} - DigiteX`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; border: 1px solid #eaeaea; border-radius: 10px; padding: 0; background-color: #ffffff;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #1E90FF, #4169E1); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="margin: 0; font-size: 28px;">Order Confirmed! 🎉</h1>
                    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Thank you for your purchase</p>
                </div>

                <div style="padding: 30px;">
                    <!-- Order Details -->
                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                        <h2 style="margin: 0 0 15px 0; color: #333; font-size: 20px;">Order Details</h2>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <p style="margin: 0; color: #666;"><strong>Order Number:</strong></p>
                            <p style="margin: 0; color: #333; font-weight: bold;">#${orderId}</p>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <p style="margin: 0; color: #666;"><strong>Order Date:</strong></p>
                            <p style="margin: 0; color: #333;">${orderDate}</p>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <p style="margin: 0; color: #666;"><strong>Status:</strong></p>
                            <p style="margin: 0; color: #1E90FF; font-weight: bold;">${status}</p>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <p style="margin: 0; color: #666;"><strong>Payment Method:</strong></p>
                            <p style="margin: 0; color: #333;">${paymentMethod === 'COD' ? 'Cash on Delivery' : paymentMethod}</p>
                        </div>
                    </div>

                    <!-- Items -->
                    <div style="margin-bottom: 30px;">
                        <h2 style="margin: 0 0 20px 0; color: #333; font-size: 20px;">Items Ordered</h2>
                        <table style="width: 100%; border-collapse: collapse;">
                            ${itemsHTML}
                        </table>
                    </div>

                    <!-- Total -->
                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h3 style="margin: 0; color: #333; font-size: 20px;">Total Amount</h3>
                            <h3 style="margin: 0; color: #1E90FF; font-size: 24px; font-weight: bold;">LKR ${totalAmount.toLocaleString()}</h3>
                        </div>
                    </div>

                    <!-- Shipping Address -->
                    <div style="margin-bottom: 30px;">
                        <h2 style="margin: 0 0 15px 0; color: #333; font-size: 20px;">Shipping Address</h2>
                        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px;">
                            <p style="margin: 0 0 5px 0; color: #333; font-weight: bold;">${shippingAddress.firstName} ${shippingAddress.lastName}</p>
                            <p style="margin: 0 0 5px 0; color: #666;">${shippingAddress.addressLine1}</p>
                            ${shippingAddress.addressLine2 ? `<p style="margin: 0 0 5px 0; color: #666;">${shippingAddress.addressLine2}</p>` : ''}
                            <p style="margin: 0 0 5px 0; color: #666;">${shippingAddress.city}, ${shippingAddress.postalCode}</p>
                            <p style="margin: 0 0 5px 0; color: #666;">${shippingAddress.country}</p>
                            <p style="margin: 0; color: #666;"><strong>Phone:</strong> ${shippingAddress.phone}</p>
                        </div>
                    </div>

                    <!-- What's Next -->
                    <div style="background: linear-gradient(135deg, #e3f2fd, #f1f8e9); border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                        <h3 style="margin: 0 0 15px 0; color: #333;">What happens next?</h3>
                        <ul style="margin: 0; padding-left: 20px; color: #666;">
                            <li style="margin-bottom: 8px;">We'll process your order within 1-2 business days</li>
                            <li style="margin-bottom: 8px;">You'll receive a shipping confirmation email with tracking details</li>
                            <li style="margin-bottom: 8px;">Expected delivery: 3-5 business days within Colombo, 5-7 days for other areas</li>
                            ${paymentMethod === 'COD' ? '<li style="margin-bottom: 8px;">Please keep the exact amount ready for cash on delivery</li>' : '<li style="margin-bottom: 8px;">Your payment has been processed successfully</li>'}
                        </ul>
                    </div>

                    <!-- Support -->
                    <div style="text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
                        <p style="margin: 0 0 10px 0; color: #666;">Need help with your order?</p>
                        <p style="margin: 0 0 20px 0; color: #1E90FF; font-weight: bold;">Contact us at support@digitex.lk or call +94 11 123 4567</p>
                        
                        <!-- Logo -->
                        <img src="https://i.imgur.com/EVqJ2Aj.png" alt="DigiteX Logo" style="width: 100px; opacity: 0.6;" />
                        
                        <p style="margin: 15px 0 0 0; color: #888; font-size: 14px;">Thank you for choosing DigiteX - Your trusted laptop partner in Sri Lanka</p>
                    </div>
                </div>
            </div>
        `
    });
};

exports.sendContactConfirmationEmail = async (email, name, subject) => {
    await transporter.sendMail({
        from: `"DigiteX Support" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: 'We received your message - DigiteX Support',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eaeaea; border-radius: 10px; padding: 30px; background-color: #ffffff;">
                <div style="text-align: center;">
                    <h2 style="color: #1E90FF; margin-bottom: 10px;">Thank you for contacting us! 📧</h2>
                    <p style="font-size: 16px; color: #555;">We have received your message and will get back to you soon.</p>
                </div>
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #333; margin-top: 0;">Your Message Details:</h3>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Email:</strong> ${email}</p>
                </div>
                <div style="text-align: center; margin: 30px 0;">
                    <p style="font-size: 16px; color: #333;">Our support team typically responds within <strong>24 hours</strong>.</p>
                    <p style="font-size: 14px; color: #777;">Reference ID: #${Date.now()}</p>
                </div>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                <p style="font-size: 14px; color: #888;">If you have any urgent concerns, feel free to call us directly.</p>
                <p style="font-size: 14px; color: #888;">- The DigiteX Support Team</p>
                <div style="text-align: center; margin-top: 20px;">
                    <img src="https://i.imgur.com/EVqJ2Aj.png" alt="DigiteX Logo" style="width: 100px; opacity: 0.6;" />
                </div>
            </div>
        `
    });
};

exports.sendContactNotificationEmail = async (contact) => {
    const adminEmail = process.env.EMAIL_USER;

    await transporter.sendMail({
        from: `"DigiteX System" <${process.env.SMTP_EMAIL}>`,
        to: adminEmail,
        subject: `New Contact Form Submission - ${contact.subject}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f9fa;">
                <h2 style="color: #dc3545;">🔔 New Contact Form Submission</h2>
                <div style="background-color: white; padding: 20px; border-radius: 8px; border-left: 4px solid #1E90FF;">
                    <h3>Contact Details:</h3>
                    <p><strong>Name:</strong> ${contact.name}</p>
                    <p><strong>Email:</strong> ${contact.email}</p>
                    <p><strong>Phone:</strong> ${contact.phone || 'Not provided'}</p>
                    <p><strong>Subject:</strong> ${contact.subject}</p>
                    <p><strong>Priority:</strong> ${contact.priority}</p>
                    <p><strong>Submitted:</strong> ${new Date(contact.createdAt).toLocaleString()}</p>
                    <p><strong>IP Address:</strong> ${contact.ipAddress}</p>
                </div>
                <div style="background-color: white; padding: 20px; border-radius: 8px; margin-top: 10px;">
                    <h3>Message:</h3>
                    <p style="white-space: pre-wrap; background-color: #f8f9fa; padding: 15px; border-radius: 4px;">${contact.message}</p>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <p style="font-size: 14px; color: #666;">Login to admin panel to respond to this message.</p>
                </div>
            </div>
        `
    });
};

// utils/sendEmail.js - Add this new template
exports.sendContactReplyEmail = async (email, customerName, originalSubject, replyMessage) => {
    await transporter.sendMail({
        from: `"DigiteX Support" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: `Re: ${originalSubject}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eaeaea; border-radius: 10px; padding: 30px; background-color: #ffffff;">
                <div style="text-align: center;">
                    <h2 style="color: #1E90FF; margin-bottom: 10px;">Response from DigiteX Support 💬</h2>
                    <p style="font-size: 16px; color: #555;">Hello ${customerName}, here's our response to your inquiry.</p>
                </div>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Regarding:</strong> ${originalSubject}</p>
                </div>

                <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1E90FF;">
                    <h3 style="color: #1E90FF; margin-top: 0;">Our Response:</h3>
                    <div style="white-space: pre-wrap; color: #333; line-height: 1.6;">
                        ${replyMessage}
                    </div>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <p style="font-size: 14px; color: #666;">Need further assistance? Reply to this email or contact us directly.</p>
                    <p style="font-size: 14px; color: #888;">- The DigiteX Support Team</p>
                </div>
                
                <div style="text-align: center; margin-top: 20px;">
                    <img src="https://i.imgur.com/EVqJ2Aj.png" alt="DigiteX Logo" style="width: 100px; opacity: 0.6;" />
                </div>
            </div>
        `
    });
};