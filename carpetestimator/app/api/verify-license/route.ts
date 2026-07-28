import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export const runtime = 'edge';

// ── Rate Limiter ─────────────────────────────────────────────────────────────
// Sliding-window: max 5 attempts per IP per 60-second window.
// Map resets on cold start (acceptable for edge/serverless).
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count++;
  return false;
}

// ── Security Headers ──────────────────────────────────────────────────────────
function withSecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  return res;
}

// ── JWT Secret ───────────────────────────────────────────────────────────────
const jwtSecretRaw = process.env.JWT_SECRET;
if (!jwtSecretRaw) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set');
}
const JWT_SECRET_KEY = new TextEncoder().encode(jwtSecretRaw);

// ── Handler ───────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // x-real-ip is injected by Vercel infrastructure and cannot be spoofed by
  // the client. Fall back to x-forwarded-for only for local dev.
  const ip =
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown';

  if (isRateLimited(ip)) {
    return withSecurityHeaders(
      NextResponse.json(
        { success: false, message: 'Too many attempts. Please wait before retrying.' },
        { status: 429 }
      )
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { licenseKey } = body as { licenseKey?: unknown };

    if (!licenseKey || typeof licenseKey !== 'string' || licenseKey.trim() === '') {
      return withSecurityHeaders(
        NextResponse.json(
          { success: false, message: 'License key is required' },
          { status: 400 }
        )
      );
    }

    const trimmedKey = licenseKey.trim();

    // ── Gumroad Verification ──────────────────────────────────────────────────
    // Product IDs come from env vars only — no hardcoded values in source.
    // Set GUMROAD_PRODUCT_ID_MONTHLY, _ANNUAL, _LIFETIME in Vercel dashboard.
    const productIdsToCheck = [
      process.env.GUMROAD_PRODUCT_ID_MONTHLY,
      process.env.GUMROAD_PRODUCT_ID_ANNUAL,
      process.env.GUMROAD_PRODUCT_ID_LIFETIME,
    ].filter(Boolean) as string[];

    if (productIdsToCheck.length === 0) {
      return withSecurityHeaders(
        NextResponse.json(
          { success: false, message: 'Server configuration error' },
          { status: 500 }
        )
      );
    }

    let isValid = false;

    for (const productId of productIdsToCheck) {
      try {
        const gumroadRes = await fetch('https://api.gumroad.com/v2/licenses/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            product_id: productId,
            license_key: trimmedKey,
            // Tells Gumroad to count this activation against the seat limit
            // configured on the product. Required for Gumroad's native
            // per-license use-count enforcement to work correctly.
            increment_uses_count: 'true',
          }),
        });

        if (gumroadRes.ok) {
          const gumroadData = (await gumroadRes.json()) as {
            success: boolean;
            purchase?: { refunded?: boolean };
          };
          if (gumroadData.success && !gumroadData.purchase?.refunded) {
            isValid = true;
            break;
          }
        }
      } catch {
        // Continue checking next product_id
      }
    }

    if (!isValid) {
      return withSecurityHeaders(
        NextResponse.json(
          { success: false, message: 'Invalid or expired license key' },
          { status: 401 }
        )
      );
    }

    // ── Mint JWT (8-day session) ───────────────────────────────────────────────
    // Only store the access grant — no PII (email) in the payload.
    const jwt = await new SignJWT({ licensed: true })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8d')
      .sign(JWT_SECRET_KEY);

    const response = NextResponse.json({
      success: true,
      message: 'License verified successfully',
    });

    response.cookies.set('estimating_session', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 24 * 60 * 60,
      path: '/',
    });

    return withSecurityHeaders(response);
  } catch {
    return withSecurityHeaders(
      NextResponse.json(
        { success: false, message: 'Verification error. Please try again.' },
        { status: 500 }
      )
    );
  }
}
