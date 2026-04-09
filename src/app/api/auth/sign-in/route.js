import { NextResponse } from 'next/server';
import { checkRateLimit, recordFailedAttempt, clearAttempts } from 'src/lib/rate-limiter';
import { sanitizeEmail, isValidEmail } from 'src/lib/password';

// Mock user credentials (in production, use database with hashed passwords)
const ADMIN_EMAIL = 'admin@hsibs.id';
const ADMIN_PASSWORD = 'admin@123';

// Simple JWT generator with HMAC signature
function generateJWT(email) {
  const crypto = require('crypto');
  
  // Header
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  // Payload
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: 'hsibs-inventory',
    sub: email,
    email,
    iat: now,
    exp: now + 86400 * 7, // 7 days
  };

  // Encode header and payload to base64
  const headerEncoded = Buffer.from(JSON.stringify(header))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  const payloadEncoded = Buffer.from(JSON.stringify(payload))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  // Create HMAC signature
  const secret = process.env.JWT_SECRET || 'hsibs-secret-key-change-in-production';
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${headerEncoded}.${payloadEncoded}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  // Combine all parts
  return `${headerEncoded}.${payloadEncoded}.${signature}`;
}

export async function POST(request) {
  try {
    // Get client IP for additional security logging
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    const { email, password } = await request.json();

    // Validate input exists
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Sanitize and validate email
    const sanitizedEmail = sanitizeEmail(email);
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check rate limiting
    const rateLimitCheck = checkRateLimit(sanitizedEmail);
    if (!rateLimitCheck.allowed) {
      if (rateLimitCheck.reason === 'ACCOUNT_LOCKED') {
        return NextResponse.json(
          { 
            error: `Account locked. Try again in ${rateLimitCheck.remainingTime} seconds`,
            code: 'ACCOUNT_LOCKED'
          },
          { status: 429 }
        );
      }
      if (rateLimitCheck.reason === 'TOO_MANY_ATTEMPTS') {
        return NextResponse.json(
          { 
            error: `Too many login attempts. Account locked for ${rateLimitCheck.remainingTime} seconds`,
            code: 'TOO_MANY_ATTEMPTS'
          },
          { status: 429 }
        );
      }
    }

    // Validate credentials
    if (sanitizedEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Clear failed attempts on successful login
      clearAttempts(sanitizedEmail);
      
      const accessToken = generateJWT(sanitizedEmail);
      
      // Set secure cookie
      const response = NextResponse.json(
        { 
          accessToken, 
          user: { 
            email: sanitizedEmail, 
            displayName: 'Admin HSIBS',
            role: 'admin'
          } 
        },
        { status: 200 }
      );

      // Set secure HTTP-only cookie
      response.cookies.set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400 * 7, // 7 days
        path: '/',
      });

      return response;
    }

    // Record failed attempt
    recordFailedAttempt(sanitizedEmail);

    // Log failed attempt (in production, log to security monitoring)
    console.warn(`Failed login attempt for ${sanitizedEmail} from IP: ${clientIp}`);

    // Generic error message (don't reveal if email exists)
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
