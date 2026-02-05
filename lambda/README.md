# Vigotsky Reynosa Contact Form - Lambda Backend

Secure serverless contact form implementation using AWS Lambda, API Gateway, and SES.

## 🔒 Security Features

- **Rate Limiting**: 5 submissions per hour per IP
- **Bot Protection**: Honeypot field
- **Input Sanitization**: XSS and injection prevention
- **Duplicate Detection**: Prevents spam submissions
- **API Throttling**: 5 req/sec, 10 burst limit
- **Email Validation**: Format and length checks
- **CORS Protection**: Domain-specific access

## 📁 Structure

```
lambda/
├── contact-form/
│   ├── index.js          # Lambda function code
│   ├── package.json      # Dependencies
│   └── template.yaml     # SAM/CloudFormation template
├── DEPLOYMENT_GUIDE.md   # Detailed setup instructions
└── README.md             # This file
```

## 🚀 Quick Start

1. **Verify emails in SES**:
   ```bash
   aws ses verify-email-identity --email-address noreply@vigotskyreynosa.edu.mx
   aws ses verify-email-identity --email-address info@vigotskyreynosa.edu.mx
   ```

2. **Deploy with SAM**:
   ```bash
   cd lambda/contact-form
   npm install
   sam build
   sam deploy --guided
   ```

3. **Update frontend**:
   Add API endpoint to `.env.local`:
   ```
   NEXT_PUBLIC_CONTACT_API_ENDPOINT=https://your-api-url.amazonaws.com/prod/contact
   ```

## 📖 Full Documentation

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete setup instructions.

## 💰 Cost

~$0.05/month for typical usage (< 500 submissions/month)

## 📊 Monitoring

View logs:
```bash
aws logs tail /aws/lambda/vigotsky-contact-form --follow
```

## 🛠️ Tech Stack

- AWS Lambda (Node.js 20.x)
- AWS SES (Simple Email Service)
- AWS API Gateway
- AWS SAM (Serverless Application Model)
