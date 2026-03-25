import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    // Decode JWT token
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return NextResponse.json(
          { error: 'Invalid token format' },
          { status: 401 }
        );
      }

      // Decode payload (second part)
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(Buffer.from(base64, 'base64').toString());

      // Check if token is expired
      if (payload.exp < Math.floor(Date.now() / 1000)) {
        return NextResponse.json(
          { error: 'Token expired' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          user: {
            email: payload.email,
            displayName: 'Admin HSIBS',
            role: 'admin',
          },
        },
        { status: 200 }
      );
    } catch (decodeError) {
      console.error('Token decode error:', decodeError);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Me endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
