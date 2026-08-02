import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { marked } from 'marked';
import { getArticleBySlug, getAllSlugs } from '@/lib/blog/articles';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: `${article.title} | Carpet Estimator Pro`,
    description: article.meta_description,
    keywords: article.target_keywords,
    openGraph: {
      title: article.title,
      description: article.meta_description,
      type: 'article',
      publishedTime: article.date,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Parse markdown with marked and wrap tables for responsive overflow
  let rawHtml = await marked.parse(article.content);
  
  // Strip top h1 from markdown content if present (as title is rendered in header)
  rawHtml = rawHtml.replace(/<h1[^>]*>.*?<\/h1>/i, '');

  const renderedHtml = rawHtml
    .replace(/<table>/g, '<div class="table-wrapper"><table>')
    .replace(/<\/table>/g, '</table></div>');

  const wordCount = article.content.split(/\s+/).length;
  const readTime = Math.max(2, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Article Typography Styles */}
      <style>{`
        .article-body p {
          margin-bottom: 1.5rem;
          color: #334155;
          font-size: 1.125rem;
          line-height: 1.8;
          font-weight: 400;
        }
        .article-body h2 {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          margin-top: 2.75rem;
          margin-bottom: 1rem;
          line-height: 1.3;
          letter-spacing: -0.02em;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 0.5rem;
        }
        .article-body h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          line-height: 1.4;
          letter-spacing: -0.01em;
        }
        .article-body ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
          color: #334155;
        }
        .article-body ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
          color: #334155;
        }
        .article-body li {
          margin-bottom: 0.5rem;
          font-size: 1.125rem;
          line-height: 1.8;
          padding-left: 0.25rem;
        }
        .article-body blockquote {
          border-left: 4px solid #0f172a;
          padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          font-size: 1.25rem;
          color: #1e293b;
          background: #f8fafc;
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
          border-radius: 0 0.5rem 0.5rem 0;
        }
        .article-body .table-wrapper {
          overflow-x: auto;
          margin: 2rem 0;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .article-body table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
          text-align: left;
        }
        .article-body th {
          background-color: #f8fafc;
          font-weight: 700;
          color: #0f172a;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          padding: 0.875rem 1rem;
          border-bottom: 1px solid #e2e8f0;
        }
        .article-body td {
          padding: 0.875rem 1rem;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
          font-weight: 500;
        }
        .article-body tr:nth-child(even) td {
          background-color: #f8fafc;
        }
        .article-body tr:last-child td {
          border-bottom: none;
        }
        .article-body a {
          color: #2563eb;
          text-decoration: underline;
          text-underline-offset: 4px;
          text-decoration-color: #93c5fd;
          font-weight: 500;
          transition: color 0.15s ease;
        }
        .article-body a:hover {
          color: #1e40af;
        }
        .article-body hr {
          margin: 2.5rem 0;
          border: 0;
          border-top: 1px solid #e2e8f0;
        }
        .article-body strong {
          font-weight: 700;
          color: #0f172a;
        }
      `}</style>

      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article.articleSchema) }}
      />
      {article.faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(article.faqSchema) }}
        />
      )}

      {/* Navbar */}
      <nav className="border-b border-slate-100 bg-white/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-[1040px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-lg text-slate-900 flex items-center gap-2 tracking-tight">
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-black">PRO</span>
            <span>Carpet Estimator Pro</span>
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/blog" className="text-slate-600 hover:text-slate-900 transition font-medium">
              Guides
            </Link>
            <Link href="/" className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-full font-medium transition text-xs sm:text-sm">
              Use Calculator
            </Link>
          </div>
        </div>
      </nav>

      {/* Medium-style Article Container */}
      <article className="max-w-[680px] mx-auto px-4 sm:px-6 pt-12 pb-20">
        {/* Category Pill */}
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Flooring Takeoff Guide
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 tracking-tight leading-[1.18] mb-6">
          {article.title}
        </h1>

        {/* Author & Metadata */}
        <div className="flex items-center gap-3.5 pb-8 mb-10 border-b border-slate-100 text-sm">
          <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
            CE
          </div>
          <div>
            <div className="font-semibold text-slate-900 flex items-center gap-2">
              <span>Carpet Estimator Pro</span>
            </div>
            <div className="text-slate-500 text-xs flex items-center gap-2 mt-0.5">
              <span>{readTime} min read</span>
              <span>&bull;</span>
              <span>Published {article.date}</span>
            </div>
          </div>
        </div>

        {/* Formatted Markdown Content */}
        <div 
          className="article-body font-sans"
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />

        {/* Call to Action Box */}
        <div className="mt-16 p-8 bg-slate-50 rounded-2xl border border-slate-200 text-center">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-sm">
            &sum;
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            Calculate Broadloom Takeoff Free
          </h3>
          <p className="text-slate-600 text-base max-w-md mx-auto mb-6 leading-relaxed">
            Run room dimensions, pattern repeat math, roll width strips, and seam diagrams instantly in your browser.
          </p>
          <Link 
            href="/" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-full transition shadow-md hover:shadow-lg"
          >
            Open Calculator &rarr;
          </Link>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 text-center text-xs text-slate-400">
        <p>&copy; {new Date().getFullYear()} Carpet Estimator Pro. All rights reserved.</p>
      </footer>
    </div>
  );
}
