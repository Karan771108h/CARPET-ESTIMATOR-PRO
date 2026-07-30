import { NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * POST /api/logout
 * Clears the estimating_session cookie, ending the Pro session.
 */
export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set('estimating_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
  return res;
}
