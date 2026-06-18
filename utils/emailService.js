const nodemailer = require('nodemailer');

const createTransporter = async () => {
  try {
    // For production with Gmail
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    }
    
    // For development with Ethereal (fake email service)
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (error) {
    console.error('Email transporter error:', error);
    return null;
  }
};

const sendInquiryConfirmation = async (inquiry) => {
  try {
    const transporter = await createTransporter();
    if (!transporter) return false;
    
    const mailOptions = {
      from: `"ZERO BY CINEVIV" <${process.env.EMAIL_FROM || 'noreply@zerobycineviv.com'}>`,
      to: inquiry.email,
      subject: 'Thank you for contacting ZERO BY CINEVIV',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ff3366; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .btn { display: inline-block; padding: 10px 20px; background: #ff3366; color: white; text-decoration: none; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>ZERO BY CINEVIV</h1>
              <p>Content-Led Marketing Agency</p>
            </div>
            <div class="content">
              <h2>Thank you for reaching out, ${inquiry.name}!</h2>
              <p>We have received your inquiry and our team will get back to you within 24 hours.</p>
              <h3>Your Inquiry Summary:</h3>
              <ul>
                <li><strong>Name:</strong> ${inquiry.name}</li>
                <li><strong>Email:</strong> ${inquiry.email}</li>
                <li><strong>Phone:</strong> ${inquiry.phone}</li>
                ${inquiry.company ? `<li><strong>Company:</strong> ${inquiry.company}</li>` : ''}
                ${inquiry.service ? `<li><strong>Service Interest:</strong> ${inquiry.service}</li>` : ''}
              </ul>
              <p>Our team will contact you shortly to discuss how we can help grow your brand.</p>
              <p>In the meantime, feel free to explore our work at: <a href="${process.env.FRONTEND_URL}/work">View Our Portfolio</a></p>
            </div>
            <div class="footer">
              <p>&copy; 2024 ZERO BY CINEVIV. All rights reserved.</p>
              <p>Noida, Uttar Pradesh, India</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

const sendAdminNotification = async (inquiry) => {
  try {
    const transporter = await createTransporter();
    if (!transporter) return false;
    
    const mailOptions = {
      from: `"ZERO BY CINEVIV" <${process.env.EMAIL_FROM || 'noreply@zerobycineviv.com'}>`,
      to: process.env.ADMIN_EMAIL || 'admin@zerobycineviv.com',
      subject: 'New Inquiry Received - ZERO BY CINEVIV',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ff3366; color: white; padding: 20px; }
            .content { padding: 20px; background: #f9f9f9; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Client Inquiry</h1>
            </div>
            <div class="content">
              <h3>Inquiry Details:</h3>
              <p><strong>Name:</strong> ${inquiry.name}</p>
              <p><strong>Email:</strong> ${inquiry.email}</p>
              <p><strong>Phone:</strong> ${inquiry.phone}</p>
              ${inquiry.company ? `<p><strong>Company:</strong> ${inquiry.company}</p>` : ''}
              ${inquiry.budget ? `<p><strong>Budget:</strong> ${inquiry.budget}</p>` : ''}
              ${inquiry.service ? `<p><strong>Service:</strong> ${inquiry.service}</p>` : ''}
              <p><strong>Message:</strong></p>
              <p>${inquiry.message}</p>
              <hr>
              <p><a href="${process.env.FRONTEND_URL}/admin/inquiries" class="btn">View in Admin Panel</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Admin notification sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return false;
  }
};

module.exports = { sendInquiryConfirmation, sendAdminNotification };