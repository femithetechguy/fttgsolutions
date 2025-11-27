/**
 * Vercel Serverless Function: Send Contact Email
 * 
 * Handles contact form submissions and sends emails
 * Endpoint: POST /api/send-email
 * 
 * Required Environment Variables:
 * - EMAIL_USER: Gmail address (e.g., your-email@gmail.com)
 * - EMAIL_PASSWORD: Gmail App Password (not regular password)
 */

const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Validate environment variables
const validateEnv = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error('Missing required environment variables: EMAIL_USER, EMAIL_PASSWORD');
  }
};

// Validate request data
const validateFormData = (data) => {
  const { name, email, subject, message } = data;
  
  if (!name || name.trim() === '') {
    return { valid: false, error: 'Name is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { valid: false, error: 'Valid email is required' };
  }
  
  if (!subject || subject.trim() === '') {
    return { valid: false, error: 'Subject is required' };
  }
  
  if (!message || message.trim() === '') {
    return { valid: false, error: 'Message is required' };
  }
  
  return { valid: true };
};

// Format email HTML
const formatEmailHtml = (data) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #0891b2; padding-bottom: 10px;">
        New Contact Form Submission
      </h2>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 12px 0;"><strong style="color: #0891b2;">Name:</strong> ${sanitizeHtml(data.name)}</p>
        <p style="margin: 12px 0;"><strong style="color: #0891b2;">Email:</strong> <a href="mailto:${sanitizeHtml(data.email)}">${sanitizeHtml(data.email)}</a></p>
        ${data.phone ? `<p style="margin: 12px 0;"><strong style="color: #0891b2;">Phone:</strong> ${sanitizeHtml(data.phone)}</p>` : ''}
        ${data.company ? `<p style="margin: 12px 0;"><strong style="color: #0891b2;">Company:</strong> ${sanitizeHtml(data.company)}</p>` : ''}
        <p style="margin: 12px 0;"><strong style="color: #0891b2;">Subject:</strong> ${sanitizeHtml(data.subject)}</p>
      </div>
      
      <div style="background-color: #fff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Message:</h3>
        <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${sanitizeHtml(data.message)}</p>
      </div>
      
      <div style="color: #999; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
        <p>Submitted at: ${data.timestamp}</p>
        <p>From: <strong>FTTG Solutions Contact Form</strong></p>
      </div>
    </div>
  `;
};

// Sanitize HTML to prevent injection
const sanitizeHtml = (text) => {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Main Handler Function
 */
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    // Validate environment variables
    validateEnv();

    // Parse request body
    const data = req.body;
    console.log('📧 Received form submission:', {
      name: data.name,
      email: data.email,
      subject: data.subject
    });

    // Validate form data
    const validation = validateFormData(data);
    if (!validation.valid) {
      console.warn('⚠️ Validation error:', validation.error);
      return res.status(400).json({ 
        success: false, 
        error: validation.error 
      });
    }

    // Create transporter
    const transporter = createTransporter();

    // Send email to business
    await transporter.sendMail({
      from: `"FTTG Solutions" <${process.env.EMAIL_USER}>`,
      to: 'dev@fttgsolutions.com',
      replyTo: data.email,
      subject: `New Contact: ${data.subject}`,
      html: formatEmailHtml(data)
    });

    console.log('✅ Email sent successfully to dev@fttgsolutions.com');

    // Optional: Send confirmation email to user
    try {
      await transporter.sendMail({
        from: `"FTTG Solutions" <${process.env.EMAIL_USER}>`,
        to: data.email,
        subject: 'We received your message - FTTG Solutions',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0891b2;">Thank you for contacting FTTG Solutions!</h2>
            <p>Hi ${sanitizeHtml(data.name)},</p>
            <p>We've received your message and will get back to you as soon as possible.</p>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Your Message Summary:</strong></p>
              <p><strong>Subject:</strong> ${sanitizeHtml(data.subject)}</p>
              <p>We'll contact you at <strong>${sanitizeHtml(data.email)}</strong>${data.phone ? ` or <strong>${sanitizeHtml(data.phone)}</strong>` : ''}.</p>
            </div>
            <p>Best regards,<br><strong>FTTG Solutions Team</strong></p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            <p style="color: #999; font-size: 12px;">
              This is an automated response. Please do not reply to this email.
            </p>
          </div>
        `
      });
      console.log('✅ Confirmation email sent to', data.email);
    } catch (confirmError) {
      console.warn('⚠️ Failed to send confirmation email:', confirmError.message);
      // Don't fail the request if confirmation email fails
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Email sent successfully. We will get back to you soon!'
    });

  } catch (error) {
    console.error('❌ Error handling request:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });

    // Return error response
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email. Please try again later.'
    });
  }
};
