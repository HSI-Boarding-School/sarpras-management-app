import { NextResponse } from 'next/server';

// Mock user credentials
const ADMIN_EMAIL = 'admin@hsibs.id';
const ADMIN_PASSWORD = 'admin@123';

// Simple JWT generator
function generateJWT(email) {
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
  const headerEncoded = Buffer.from(JSON.stringify(header)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  // Create signature (simplified - just concatenate for demo)
  const signature = Buffer.from('hsibs-secret-key').toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  // Combine all parts
  return `${headerEncoded}.${payloadEncoded}.${signature}`;
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const accessToken = generateJWT(email);
      return NextResponse.json(
        { accessToken, user: { email, displayName: 'Admin HSIBS' } },
        { status: 200 }
      );
    }

    // Invalid credentials
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
