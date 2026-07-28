import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const jwtSecretRaw = process.env.JWT_SECRET;
if (!jwtSecretRaw) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set');
}
const JWT_SECRET_KEY = new TextEncoder().encode(jwtSecretRaw);

export async function proxy(req: NextRequest) {
  const token = req.cookies.get('estimating_session')?.value;

  let isAuthenticated = false;
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET_KEY);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  const response = NextResponse.next();
  // Propagate auth state to server components via header (not trusted as auth — use cookie for that)
  response.headers.set('x-estimating-auth', isAuthenticated ? 'true' : 'false');

  // Global security headers on every response
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
