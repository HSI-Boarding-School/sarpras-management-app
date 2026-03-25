import { NextResponse } from 'next/server';

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
    const { email, password, firstName, lastName } = await request.json();

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // For demo, just generate a token
    const accessToken = generateJWT(email);
    return NextResponse.json(
      {
        accessToken,
        user: {
          email,
          displayName: `${firstName} ${lastName}`,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
