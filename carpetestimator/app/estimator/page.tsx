import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { EstimatorDashboard } from '../../components/estimator/EstimatorDashboard';

/**
 * Server component — reads the session cookie directly on the server.
 * This eliminates the client-side GET /api/auth-status fetch that was
 * previously fired on every page mount, saving one Vercel invocation
 * per user session.
 */
export default async function EstimatorPage() {
  let isLicensed = false;

  if (process.env.JWT_SECRET) {
    const cookieStore = await cookies();
    const token = cookieStore.get('estimating_session')?.value;

    if (token) {
      try {
        await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
        isLicensed = true;
      } catch {
        // Invalid / expired token — treat as unlicensed
      }
    }
  }

  return <EstimatorDashboard serverIsLicensed={isLicensed} />;
}
