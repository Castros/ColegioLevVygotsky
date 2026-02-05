# Contact Form Lambda Deployment Guide

This guide will help you deploy the secure contact form with AWS Lambda, API Gateway, and SES.

## Prerequisites

- AWS Account
- AWS CLI installed and configured
- AWS SAM CLI installed (for easy deployment)
- Node.js 20.x or later

## Security Features Implemented

✅ **Rate Limiting**: Max 5 submissions per hour per IP address
✅ **Input Validation**: All fields validated and sanitized
✅ **Bot Protection**: Honeypot field to catch automated bots
✅ **Duplicate Detection**: Prevents duplicate submissions within 5 minutes
✅ **API Throttling**: API Gateway limits to 5 requests/second, burst of 10
✅ **CORS Protection**: Only allows requests from your domain
✅ **Length Validation**: Prevents excessive data submission
✅ **HTML Injection Prevention**: All inputs sanitized
✅ **Email Validation**: Proper email format checking

## Step 1: Verify Email Addresses in SES

Before deploying, you need to verify the email addresses in Amazon SES.

### 1.1. Go to AWS Console → Simple Email Service (SES)

### 1.2. Verify FROM email address
```bash
aws ses verify-email-identity --email-address noreply@vigotskyreynosa.edu.mx
```

### 1.3. Verify TO email address (where submissions will be sent)
```bash
aws ses verify-email-identity --email-address info@vigotskyreynosa.edu.mx
```

### 1.4. Check your email inbox
You'll receive verification emails at both addresses. Click the verification links.

### 1.5. Request Production Access (Optional but Recommended)

If you're in the SES Sandbox, you can only send to verified addresses. To send to any address:

1. Go to SES Console
2. Click "Request Production Access"
3. Fill out the form explaining your use case
4. Approval usually takes 24 hours

## Step 2: Install Dependencies

```bash
cd lambda/contact-form
npm install
```

## Step 3: Deploy with AWS SAM (Recommended)

### 3.1. Install AWS SAM CLI if not already installed

```bash
# macOS
brew install aws-sam-cli

# Linux
pip install aws-sam-cli

# Windows
choco install aws-sam-cli
```

### 3.2. Build the application

```bash
cd lambda/contact-form
sam build
```

### 3.3. Deploy with guided deployment (first time)

```bash
sam deploy --guided
```

You'll be prompted for:
- **Stack Name**: `vigotsky-contact-form`
- **AWS Region**: `us-east-1` (or your preferred region)
- **SESFromEmail**: `noreply@vigotskyreynosa.edu.mx`
- **SESToEmail**: `info@vigotskyreynosa.edu.mx`
- **AllowedOrigin**: `https://www.vigotskyreynosa.edu.mx`
- Confirm changes: `Y`
- Allow SAM CLI to create IAM roles: `Y`
- Save arguments to configuration file: `Y`

### 3.4. Get the API endpoint

After deployment, SAM will output the API endpoint URL. Copy this URL.

```
Outputs:
ApiEndpoint: https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/contact
```

## Step 4: Alternative Deployment (Manual)

If you prefer manual deployment:

### 4.1. Create deployment package

```bash
cd lambda/contact-form
npm install
zip -r function.zip index.js node_modules package.json
```

### 4.2. Create Lambda function

```bash
aws lambda create-function \
  --function-name vigotsky-contact-form \
  --runtime nodejs20.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-ses-role \
  --handler index.handler \
  --zip-file fileb://function.zip \
  --timeout 30 \
  --memory-size 256 \
  --environment Variables="{SES_FROM_EMAIL=noreply@vigotskyreynosa.edu.mx,SES_TO_EMAIL=info@vigotskyreynosa.edu.mx,ALLOWED_ORIGIN=https://www.vigotskyreynosa.edu.mx}"
```

### 4.3. Create API Gateway (REST API)

1. Go to AWS Console → API Gateway
2. Create new REST API
3. Create resource: `/contact`
4. Create method: `POST`
5. Integration type: Lambda Function
6. Select your Lambda function
7. Enable CORS
8. Deploy to stage: `prod`

### 4.4. Configure throttling

1. In API Gateway → Stages → prod
2. Settings tab
3. Set Rate: 5 requests/second
4. Set Burst: 10 requests

## Step 5: Update Frontend with API Endpoint

### 5.1. Create environment variable file

Create `.env.local` in the root of your Next.js project:

```bash
NEXT_PUBLIC_CONTACT_API_ENDPOINT=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/contact
```

### 5.2. Update the ContactForm component

The form is already configured to use this environment variable. Just add it to your `.env.local`.

### 5.3. For production build

Add the environment variable to your build process or hosting platform:

```bash
# If using AWS Amplify or similar
NEXT_PUBLIC_CONTACT_API_ENDPOINT=https://your-api-url.amazonaws.com/prod/contact
```

## Step 6: Test the Contact Form

### 6.1. Test locally first

```bash
npm run dev
# Visit http://localhost:3000/contacto
```

### 6.2. Test the Lambda directly (optional)

```bash
aws lambda invoke \
  --function-name vigotsky-contact-form \
  --payload '{"httpMethod":"POST","body":"{\"name\":\"Test\",\"email\":\"test@example.com\",\"subject\":\"inscripciones\",\"message\":\"Test message\"}"}' \
  response.json

cat response.json
```

### 6.3. Test through API Gateway

```bash
curl -X POST https://your-api-url.amazonaws.com/prod/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "inscripciones",
    "message": "This is a test message"
  }'
```

## Step 7: Monitor and Maintain

### 7.1. View Lambda logs

```bash
aws logs tail /aws/lambda/vigotsky-contact-form --follow
```

Or use CloudWatch in AWS Console.

### 7.2. Monitor SES sending

Go to AWS Console → SES → Sending Statistics

### 7.3. Set up alerts (optional but recommended)

Create CloudWatch alarms for:
- Lambda errors
- Lambda throttles
- API Gateway 4xx/5xx errors
- SES bounce rate

## Costs Estimate

Based on typical school website traffic (100-500 submissions/month):

- **Lambda**: ~$0.00 (within free tier: 1M requests/month, 400,000 GB-seconds)
- **API Gateway**: ~$0.00 (within free tier: 1M requests/month for first 12 months)
- **SES**: ~$0.01 (at $0.10 per 1,000 emails)
- **CloudWatch Logs**: ~$0.01

**Total: < $0.05/month** (essentially free)

After the first year when free tier expires:
- **Total: ~$0.50/month** (still very cheap)

## Troubleshooting

### Issue: Emails not sending

**Solution**:
1. Check SES email verification status
2. Verify you're not in SES Sandbox mode (or verify recipient email)
3. Check Lambda logs for errors

### Issue: CORS errors

**Solution**:
1. Verify `ALLOWED_ORIGIN` environment variable matches your domain exactly
2. Ensure API Gateway CORS is enabled
3. Check browser console for exact error

### Issue: Rate limiting triggering too early

**Solution**:
1. The Lambda function stores rate limits in memory
2. If Lambda instances scale, each gets its own memory
3. For production with high traffic, consider using DynamoDB for rate limiting

### Issue: Getting 403 errors

**Solution**:
1. Check IAM role has SES send permissions
2. Verify SES emails are verified
3. Check Lambda logs for specific error

## Security Best Practices Checklist

✅ Email addresses verified in SES
✅ Environment variables used for sensitive data
✅ CORS configured with specific origin (not *)
✅ API Gateway throttling enabled
✅ Rate limiting in Lambda code
✅ Input validation and sanitization
✅ Honeypot field for bot protection
✅ CloudWatch logging enabled
✅ IAM role with least privilege (only SES send permission)

## Additional Security Enhancements (Optional)

### 1. Add reCAPTCHA

For even better bot protection, consider adding Google reCAPTCHA v3:

1. Get reCAPTCHA keys from Google
2. Add to frontend form
3. Verify token in Lambda function

### 2. Add WAF (Web Application Firewall)

For production with high traffic:

1. Go to AWS WAF
2. Create web ACL
3. Attach to API Gateway
4. Add rate-based rules

### 3. Use DynamoDB for Rate Limiting

For production scalability:

1. Create DynamoDB table for tracking requests
2. Update Lambda to use DynamoDB instead of in-memory map
3. Add TTL for automatic cleanup

## Support

If you encounter issues:

1. Check CloudWatch logs first
2. Verify all emails are verified in SES
3. Test Lambda function directly before testing through API Gateway
4. Ensure environment variables are set correctly

## Updating the Lambda Function

To update the code after making changes:

```bash
cd lambda/contact-form
npm install
sam build
sam deploy
```

Or with manual deployment:

```bash
zip -r function.zip index.js node_modules package.json
aws lambda update-function-code \
  --function-name vigotsky-contact-form \
  --zip-file fileb://function.zip
```
