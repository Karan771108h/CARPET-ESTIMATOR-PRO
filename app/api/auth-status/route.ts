import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export const runtime = 'edge';

const jwtSecretRaw = process.env.JWT_SECRET;
if (!jwtSecretRaw) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set');
}
const JWT_SECRET_KEY = new TextEncoder().encode(jwtSecretRaw);

/**
 * GET /api/auth-status
 * Returns { licensed: true } if the estimating_session cookie contains a valid JWT.
 * Used by EstimatorDashboard on mount to check auth state server-side.
 */
export async function GET(req: NextRequest) {
  const token = req.cookies.get('estimating_session')?.value;

  if (!token) {
    return NextResponse.json({ licensed: false });
  }

  try {
    await jwtVerify(token, JWT_SECRET_KEY);
    return NextResponse.json({ licensed: true });
  } catch {
    return NextResponse.json({ licensed: false });
  }
}
