import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllArticles } from '@/lib/blog/articles';

export const metadata: Metadata = {
  title: 'Carpet Takeoff & Flooring Guides | Carpet Estimator Pro',
  description: 'Free guides, pattern repeat calculators, software pricing comparisons, and cheat sheets for carpet estimators and fitters.',
};

export default function BlogIndexPage() {
  const articles = getAllArticles();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navbar */}
      <nav className="border-b border-slate-100 bg-white/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-lg text-slate-900 flex items-center gap-2 tracking-tight">
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-black">PRO</span>
            <span>Carpet Estimator Pro</span>
          </Link>
          <Link href="/" className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-full font-medium transition text-xs sm:text-sm">
            Use Calculator
          </Link>
        </div>
      </nav>

      {/* Header */}
      <header className="border-b border-slate-100 py-16 px-4 sm:px-6">
        <div className="max-w-[680px] mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 mb-4 inline-block">
            Publications & Guides
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] mb-4">
            Carpet Estimating Guides
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed font-normal">
            Articles on broadloom pattern repeat math, waste optimization, software pricing comparisons, and estimator cheat sheets.
          </p>
        </div>
      </header>

      {/* Medium-style List Articles */}
      <main className="max-w-[680px] mx-auto px-4 sm:px-6 py-12">
        <div className="divide-y divide-slate-100">
          {articles.map((post) => {
            const wordCount = post.content.split(/\s+/).length;
            const readTime = Math.max(2, Math.ceil(wordCount / 200));

            return (
              <article key={post.slug} className="py-8 first:pt-0 last:pb-0 group">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-slate-900">Carpet Estimator Pro</span>
                  <span>&bull;</span>
                  <span>{post.date}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition leading-snug">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                <p className="text-slate-600 text-base leading-relaxed line-clamp-2 mb-4 font-normal">
                  {post.meta_description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium">
                    {readTime} min read
                  </span>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-blue-600 font-semibold group-hover:underline flex items-center gap-1"
                  >
                    Read article &rarr;
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 text-center text-xs text-slate-400">
        <p>&copy; {new Date().getFullYear()} Carpet Estimator Pro. All rights reserved.</p>
      </footer>
    </div>
  );
}
