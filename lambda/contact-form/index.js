const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const crypto = require('crypto');

// Initialize SES client
const ses = new SESClient({ region: process.env.AWS_REGION || 'us-east-1' });

// In-memory rate limiting (for Lambda)
// For production, consider using DynamoDB or ElastiCache
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_IP = 5; // Max 5 submissions per hour per IP

// Input validation and sanitization
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  // Remove any HTML tags and trim
  return input.replace(/<[^>]*>/g, '').trim().substring(0, 5000);
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  if (!phone) return true; // Optional field
  // Allow common phone formats
  const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/;
  return phoneRegex.test(phone);
};

// Check rate limit
const checkRateLimit = (ip) => {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];

  // Clean old requests
  const recentRequests = userRequests.filter(
    timestamp => now - timestamp < RATE_LIMIT_WINDOW
  );

  if (recentRequests.length >= MAX_REQUESTS_PER_IP) {
    return false;
  }

  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);

  // Clean up old entries periodically
  if (rateLimitMap.size > 1000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.length === 0 || now - value[value.length - 1] > RATE_LIMIT_WINDOW) {
        rateLimitMap.delete(key);
      }
    }
  }

  return true;
};

// Generate hash for duplicate detection
const generateSubmissionHash = (data) => {
  const content = `${data.email}-${data.message}`;
  return crypto.createHash('sha256').update(content).digest('hex');
};

// Store recent submission hashes
const recentSubmissions = new Map();
const DUPLICATE_WINDOW = 5 * 60 * 1000; // 5 minutes

const isDuplicate = (hash) => {
  const now = Date.now();

  // Clean old hashes
  for (const [key, timestamp] of recentSubmissions.entries()) {
    if (now - timestamp > DUPLICATE_WINDOW) {
      recentSubmissions.delete(key);
    }
  }

  if (recentSubmissions.has(hash)) {
    return true;
  }

  recentSubmissions.set(hash, now);
  return false;
};

exports.handler = async (event) => {
  console.log('Contact form submission received');

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Get client IP for rate limiting
    const clientIp = event.requestContext?.identity?.sourceIp ||
                     event.headers['x-forwarded-for']?.split(',')[0] ||
                     'unknown';

    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      console.log(`Rate limit exceeded for IP: ${clientIp}`);
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Demasiadas solicitudes. Por favor, intenta más tarde.'
        })
      };
    }

    // Parse request body
    const body = JSON.parse(event.body);

    // Check honeypot field (should be empty)
    if (body.website) {
      console.log('Honeypot triggered - bot detected');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Mensaje enviado exitosamente.'
        })
      };
    }

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Todos los campos requeridos deben completarse.'
        })
      };
    }

    // Sanitize inputs
    const name = sanitizeInput(body.name);
    const email = sanitizeInput(body.email);
    const phone = sanitizeInput(body.phone || '');
    const subject = sanitizeInput(body.subject);
    const message = sanitizeInput(body.message);

    // Validate email format
    if (!validateEmail(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Formato de email inválido.'
        })
      };
    }

    // Validate phone format
    if (!validatePhone(phone)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Formato de teléfono inválido.'
        })
      };
    }

    // Check for duplicate submissions
    const submissionHash = generateSubmissionHash({ email, message });
    if (isDuplicate(submissionHash)) {
      console.log('Duplicate submission detected');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Mensaje enviado exitosamente.'
        })
      };
    }

    // Validate field lengths
    if (name.length < 2 || name.length > 100) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'El nombre debe tener entre 2 y 100 caracteres.'
        })
      };
    }

    if (message.length < 10 || message.length > 5000) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'El mensaje debe tener entre 10 y 5000 caracteres.'
        })
      };
    }

    // Get subject label
    const subjectLabels = {
      'informacion-general': 'Información General',
      'inscripciones': 'Inscripciones',
      'visita': 'Agendar Visita',
      'otro': 'Otro'
    };
    const subjectLabel = subjectLabels[subject] || subject;

    // Prepare email content
    const emailParams = {
      Source: process.env.SES_FROM_EMAIL,
      Destination: {
        ToAddresses: [process.env.SES_TO_EMAIL]
      },
      Message: {
        Subject: {
          Data: `Contacto Web: ${subjectLabel}`,
          Charset: 'UTF-8'
        },
        Body: {
          Html: {
            Data: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background-color: #16a34a; color: white; padding: 20px; text-align: center; }
                  .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
                  .field { margin-bottom: 15px; }
                  .label { font-weight: bold; color: #16a34a; }
                  .value { margin-top: 5px; }
                  .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h2>Nuevo Mensaje de Contacto</h2>
                  </div>
                  <div class="content">
                    <div class="field">
                      <div class="label">Nombre:</div>
                      <div class="value">${name}</div>
                    </div>
                    <div class="field">
                      <div class="label">Email:</div>
                      <div class="value"><a href="mailto:${email}">${email}</a></div>
                    </div>
                    ${phone ? `
                    <div class="field">
                      <div class="label">Teléfono:</div>
                      <div class="value"><a href="tel:${phone}">${phone}</a></div>
                    </div>
                    ` : ''}
                    <div class="field">
                      <div class="label">Asunto:</div>
                      <div class="value">${subjectLabel}</div>
                    </div>
                    <div class="field">
                      <div class="label">Mensaje:</div>
                      <div class="value">${message.replace(/\n/g, '<br>')}</div>
                    </div>
                  </div>
                  <div class="footer">
                    <p>Este mensaje fue enviado desde el formulario de contacto de Vigotsky Reynosa</p>
                    <p>IP: ${clientIp} | Fecha: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}</p>
                  </div>
                </div>
              </body>
              </html>
            `,
            Charset: 'UTF-8'
          },
          Text: {
            Data: `
Nuevo Mensaje de Contacto

Nombre: ${name}
Email: ${email}
${phone ? `Teléfono: ${phone}\n` : ''}Asunto: ${subjectLabel}

Mensaje:
${message}

---
IP: ${clientIp}
Fecha: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}
            `,
            Charset: 'UTF-8'
          }
        }
      },
      ReplyToAddresses: [email]
    };

    // Send email via SES
    const command = new SendEmailCommand(emailParams);
    await ses.send(command);

    console.log('Email sent successfully');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Mensaje enviado exitosamente. Nos pondremos en contacto pronto.'
      })
    };

  } catch (error) {
    console.error('Error processing contact form:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Error al enviar el mensaje. Por favor, intenta nuevamente.'
      })
    };
  }
};
