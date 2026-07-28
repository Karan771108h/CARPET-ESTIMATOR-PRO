import { Hero } from '../components/landing/Hero';
import { EstimatorDashboard } from '../components/estimator/EstimatorDashboard';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Hero />
      <div id="tool">
        <EstimatorDashboard />
      </div>
      <footer className="py-8 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
        © 2026 Carpet Estimator Pro. All rights reserved.
      </footer>
    </div>
  );
}
