import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Security Headers (applied to every route) ─────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Next.js requires unsafe-inline for styles; tighten once CSS is extracted
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              // Gumroad checkout redirect
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://gumroad.com",
              "img-src 'self' data: blob:",
              "connect-src 'self' https://api.gumroad.com",
              "frame-ancestors 'none'",
              "form-action 'self' https://gumroad.com",
            ].join('; '),
          },
        ],
      },
    ];
  },

  // ── Image Optimization ────────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
