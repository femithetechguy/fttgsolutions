# Backend API Setup Guide

Your FormService is now configured to send form data to a backend API endpoint. Here's how to set it up:

## API Endpoint Requirements

The FormService expects a `POST` endpoint at `/api/send-email` (configurable) that:
- Accepts JSON data with: `name`, `email`, `phone`, `company`, `subject`, `message`, `timestamp`
- Returns a JSON response: `{ success: true }` or `{ success: false, error: "message" }`

## Example Implementations

### Node.js + Express + Nodemailer

```bash
npm install express nodemailer dotenv
```

Create `backend/server.js`:

```javascript
const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(express.json());

// Configure your email service
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Email endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, phone, company, subject, message, timestamp } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'dev@fttgsolutions.com',
      replyTo: email,
      subject: `New Contact: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Company:</strong> ${company || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <p><small>Submitted at: ${timestamp}</small></p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email sent from ${email}`);
    res.json({ success: true, message: 'Email sent successfully' });

  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send email' 
    });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

Create `.env`:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Python + Flask + Flask-Mail

```bash
pip install flask flask-mail python-dotenv
```

Create `backend/app.py`:

```python
from flask import Flask, request, jsonify
from flask_mail import Mail, Message
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

# Configure Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('EMAIL_USER')
app.config['MAIL_PASSWORD'] = os.getenv('EMAIL_PASSWORD')

mail = Mail(app)

@app.route('/api/send-email', methods=['POST'])
def send_email():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(k in data for k in ['name', 'email', 'subject', 'message']):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400

        # Create message
        msg = Message(
            subject=f"New Contact: {data['subject']}",
            recipients=['dev@fttgsolutions.com'],
            reply_to=data['email'],
            html=f"""
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> {data['name']}</p>
            <p><strong>Email:</strong> {data['email']}</p>
            <p><strong>Phone:</strong> {data.get('phone', 'Not provided')}</p>
            <p><strong>Company:</strong> {data.get('company', 'Not provided')}</p>
            <p><strong>Subject:</strong> {data['subject']}</p>
            <p><strong>Message:</strong></p>
            <p>{data['message'].replace(chr(10), '<br>')}</p>
            <p><small>Submitted at: {data['timestamp']}</small></p>
            """
        )

        # Send email
        mail.send(msg)
        print(f"✅ Email sent from {data['email']}")
        return jsonify({'success': True, 'message': 'Email sent successfully'})

    except Exception as error:
        print(f"❌ Error sending email: {error}")
        return jsonify({'success': False, 'error': 'Failed to send email'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=3000)
```

Create `.env`:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### PHP (Native)

Create `backend/send-email.php`:

```php
<?php
header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate required fields
    if (empty($data['name']) || empty($data['email']) || empty($data['subject']) || empty($data['message'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing required fields']);
        exit;
    }

    // Prepare email
    $to = 'dev@fttgsolutions.com';
    $subject = "New Contact: " . $data['subject'];
    $reply_to = $data['email'];
    
    $message = "
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> {$data['name']}</p>
    <p><strong>Email:</strong> {$data['email']}</p>
    <p><strong>Phone:</strong> {$data['phone'] ?? 'Not provided'}</p>
    <p><strong>Company:</strong> {$data['company'] ?? 'Not provided'}</p>
    <p><strong>Subject:</strong> {$data['subject']}</p>
    <p><strong>Message:</strong></p>
    <p>" . nl2br($data['message']) . "</p>
    <p><small>Submitted at: {$data['timestamp']}</small></p>
    ";

    // Headers
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "Reply-To: {$reply_to}\r\n";

    // Send email
    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
    } else {
        throw new Exception('Failed to send email');
    }

} catch (Exception $error) {
    http_response_code(500);
    error_log("Email error: " . $error->getMessage());
    echo json_encode(['success' => false, 'error' => 'Failed to send email']);
}
?>
```

## Configuration

Update the apiEndpoint in your FormService initialization in `js/app.js`:

```javascript
formService = new FormService({
  formSelector: '#contactForm',
  apiEndpoint: '/api/send-email'  // Change this to your endpoint
});
```

## Security Considerations

1. **CORS**: If your frontend and backend are on different domains, enable CORS:
   ```javascript
   // Express
   const cors = require('cors');
   app.use(cors());
   ```

2. **Rate Limiting**: Prevent spam with rate limiting:
   ```javascript
   const rateLimit = require('express-rate-limit');
   app.use('/api/send-email', rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 5 // limit each IP to 5 requests per windowMs
   }));
   ```

3. **Input Validation**: Always validate and sanitize input on the backend

4. **Environment Variables**: Never hardcode credentials - use `.env` files

## Testing

Test your endpoint with curl:

```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "123-456-7890",
    "company": "Acme Corp",
    "subject": "Website Inquiry",
    "message": "Hello, I am interested in your services.",
    "timestamp": "2025-11-27 10:30:00"
  }'
```

## Deployment

Once your backend is ready:

1. Deploy to your server or cloud platform
2. Update `apiEndpoint` in FormService to point to your live endpoint
3. Test the form submission end-to-end

That's it! Your form will now use your custom backend instead of EmailJS.
