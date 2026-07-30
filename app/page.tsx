import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { Hero } from '../components/landing/Hero';
import { EstimatorDashboard } from '../components/estimator/EstimatorDashboard';

export default async function Home() {
  let isLicensed = false;

  if (process.env.JWT_SECRET) {
    const cookieStore = await cookies();
    const token = cookieStore.get('estimating_session')?.value;
    if (token) {
      try {
        await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
        isLicensed = true;
      } catch {
        // Invalid / expired token
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Hero />
      <div id="tool">
        <EstimatorDashboard serverIsLicensed={isLicensed} />
      </div>
      <footer className="py-8 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
        © 2026 Carpet Estimator Pro. All rights reserved.
      </footer>
    </div>
  );
}
