import fs from 'fs';
import path from 'path';

export interface BlogPost {
  slug: string;
  title: string;
  meta_title: string;
  meta_description: string;
  target_keywords: string[];
  date: string;
  content: string;
  faqSchema?: object;
  articleSchema: object;
}

const ARTICLES_DIR = path.join(process.cwd(), 'assets', 'seo_articles');

const FAQ_SCHEMAS: Record<string, object> = {
  'planswift-alternative-for-mac': {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {"@type": "Question", "name": "Does PlanSwift work on a Mac?", "acceptedAnswer": {"@type": "Answer", "text": "There is no native macOS version of PlanSwift. It is a 32-bit Windows desktop app. To run it on a Mac you need a Windows virtual machine and a Windows license. Carpet Estimator Pro runs in any browser on a Mac with nothing to install."}},
      {"@type": "Question", "name": "How much does PlanSwift cost?", "acceptedAnswer": {"@type": "Answer", "text": "$1,749 to $2,000 per user per year on annual subscription. It is sold per user, so a three-estimator crew is over $5,000 a year. Since ConstructConnect acquired PlanSwift, the old perpetual license is gone."}},
      {"@type": "Question", "name": "Is there a free PlanSwift alternative for Mac?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. Carpet Estimator Pro has a free tier: on-screen takeoff with net area, strips, linear feet, square yards, accessories, and an interactive seam layout. Free users do not get PDF export. That starts at $19 a month."}},
      {"@type": "Question", "name": "Does Carpet Estimator Pro handle pattern match?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. Choose plain, straight, or half-drop and enter the vertical repeat. Straight match rounds every cut up to the next full repeat. Half-drop pads the cut by 1.5 times the repeat. Pattern-match waste optimization is included on the annual plan."}},
      {"@type": "Question", "name": "Do I need to install anything?", "acceptedAnswer": {"@type": "Answer", "text": "No. Carpet Estimator Pro is a web app. Open the URL in any browser on your Mac, PC, phone, or tablet and it runs. No downloads, no updates to manage."}},
      {"@type": "Question", "name": "Can I export a client-ready quote?", "acceptedAnswer": {"@type": "Answer", "text": "The free tier is on-screen only. Unbranded PDF quotes start at $19 a month. The lifetime tier at $199 one-time gives you unwatermarked PDFs and all future updates."}}
    ]
  },
  'free-broadloom-pattern-repeat-calculator': {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {"@type": "Question", "name": "What is a pattern repeat, and why does it change how much carpet I order?", "acceptedAnswer": {"@type": "Answer", "text": "The repeat is the vertical distance between matching points in the pattern. On patterned broadloom, every cut has to be rounded up to a full number of repeats so the pattern lines up across seams. A 20.5 ft cut on a 1.5 ft repeat becomes a 21 ft cut — that half a foot per cut is exactly what the naive square-foot method misses."}},
      {"@type": "Question", "name": "Straight match or half-drop — how do I know which my carpet is?", "acceptedAnswer": {"@type": "Answer", "text": "Check the sample, the roll ticket, or the supplier's spec sheet. Straight match lines the pattern up at the same point on every seam. Half-drop offsets adjacent strips by half a repeat. When in doubt, ask the supplier before ordering — the tool lets you run both and compare the yardage."}},
      {"@type": "Question", "name": "Is the calculator really free?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. The on-screen takeoff — strips, matched cut lengths, yardage, waste, seams and accessories — is free, in any browser, with no account and no credit card. The paid tiers ($19/mo, $149/yr, or $199 lifetime) unlock the itemized PDF quote for client handoff."}},
      {"@type": "Question", "name": "Can I use it for L-shaped rooms?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. Split the L into rectangles, enter each as a section, and the tool handles the rest — including how the strips lay across the combined shape."}},
      {"@type": "Question", "name": "Does it work in metric?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. Toggle to UK Metric and you get metres, m², and 4 m or 5 m roll widths, with the same pattern-repeat math."}},
      {"@type": "Question", "name": "How do I get a PDF quote for a client?", "acceptedAnswer": {"@type": "Answer", "text": "The free tier is on-screen only. The paid tiers export an itemized, unbranded PDF quote (carpet, pad, tackless, seam tape) — $19/mo, $149/yr (save 35%), or $199 one-time lifetime."}}
    ]
  },
  'how-much-carpet-do-i-need': {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {"@type": "Question", "name": "How much carpet do I need for a 12x12 room?", "acceptedAnswer": {"@type": "Answer", "text": "About 18 sq yd of plain carpet on a 12 ft roll, or about 20 sq yd if the carpet has a 1.5 ft straight-match repeat. The room is 16 sq yd net — the difference is trim, pattern rounding and waste."}},
      {"@type": "Question", "name": "Why is my square-foot estimate always short on patterned carpet?", "acceptedAnswer": {"@type": "Answer", "text": "Because the mill doesn't sell patterned carpet by the square foot. It sells by the strip, and every strip has to be a whole number of pattern repeats so the seams line up. That rounding, plus roll-width offcut, is real yardage you pay for."}},
      {"@type": "Question", "name": "Can I use a 15 ft roll to avoid seams?", "acceptedAnswer": {"@type": "Answer", "text": "Sometimes. If the room is 15 ft wide or less, one 15 ft strip can replace two 12 ft strips and kill the seam — but check the pattern direction and the supplier's stock first. The calculator lets you switch roll widths and compare yardage and seams before you commit."}},
      {"@type": "Question", "name": "What's a good waste factor?", "acceptedAnswer": {"@type": "Answer", "text": "5–10% for a clean rectangle, up to 15–20% for rooms with angles, alcoves, or tricky fitting. On patterned carpet, don't pile waste on top of the repeat rounding — the tool shows both, so you can see what's pattern and what's fitting loss."}},
      {"@type": "Question", "name": "Do I need to make an account to use the calculator?", "acceptedAnswer": {"@type": "Answer", "text": "No. It's free and open in any browser — no account, no credit card. The paid tiers ($19/mo, $149/yr, or $199 lifetime) add the itemized, unbranded PDF quote for client handoff."}},
      {"@type": "Question", "name": "How do I order carpet for an L-shaped room?", "acceptedAnswer": {"@type": "Answer", "text": "Split it into rectangles, enter each section, and add the doorways. The calculator lays the strips across the combined shape, so you see the real strip count instead of double-ordering two separate rectangles."}}
    ]
  },
  'measuresquare-pricing-alternative': {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {"@type": "Question", "name": "How much does MeasureSquare cost?", "acceptedAnswer": {"@type": "Answer", "text": "MeasureSquare sells separate products: Mobile at $54 a month, Multi-family at $164 a month, and Commercial at $197 a month. A full desktop plus mobile plus CRM setup runs past $2,000 per user per year."}},
      {"@type": "Question", "name": "Is MeasureSquare cheaper than Carpet Estimator Pro?", "acceptedAnswer": {"@type": "Answer", "text": "No. The cheapest MeasureSquare product is $54 a month, or $648 a year. Carpet Estimator Pro's takeoff is free. Paid plans are $19 a month, $149 a year, or $199 one-time for lifetime access."}},
      {"@type": "Question", "name": "Does MeasureSquare have a Mac version?", "acceptedAnswer": {"@type": "Answer", "text": "The MeasureSquare desktop app is built for Windows. Mobile measurement runs through its separate mobile apps. Carpet Estimator Pro runs in any browser, so it works on a Mac, PC, tablet, or phone with nothing to install."}},
      {"@type": "Question", "name": "What is the cheapest flooring takeoff software?", "acceptedAnswer": {"@type": "Answer", "text": "Carpet Estimator Pro's takeoff is free: net area, strips, linear feet, square yards or square metres, accessories, and a seam layout. PDF quotes start at $19 a month. A handful of lighter general takeoff tools are cheaper, but none are built around carpet roll math."}},
      {"@type": "Question", "name": "What do I get on the free tier?", "acceptedAnswer": {"@type": "Answer", "text": "Full on-screen takeoff: net room area, carpet required in strips, linear feet and square yards or square metres, pad, tackless strips, and seam tape, plus an interactive seam layout visualizer. No PDF export on the free tier."}},
      {"@type": "Question", "name": "Do I need a subscription to try it?", "acceptedAnswer": {"@type": "Answer", "text": "No. Open the calculator in your browser and take off a room in minutes. If you want client-ready PDFs, that is $19 a month, $149 a year, or $199 lifetime."}}
    ]
  },
  'straight-match-vs-half-drop': {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {"@type": "Question", "name": "What's the difference between straight match and half-drop?", "acceptedAnswer": {"@type": "Answer", "text": "Straight match lines the pattern up at the same point on every strip. Half-drop shifts every alternating strip down by half a repeat so the motif lands between the motifs on the strip beside it. Half-drop looks better on big geometries and costs more — every cut gets padded by 1.5x the repeat."}},
      {"@type": "Question", "name": "Why does half-drop cost more than straight match?", "acceptedAnswer": {"@type": "Answer", "text": "Because of the shift. Alternating strips need half a repeat of extra at the top, plus a full repeat at the bottom to finish the motif — 1.5x the repeat per cut. On a 2 ft repeat that's 3 ft of mandatory padding per cut before any other waste."}},
      {"@type": "Question", "name": "Do I really have to round every cut up to a full repeat?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. A seam cut between repeats doesn't match — you'd see it immediately and so would the client. The repeat rounding is a hard constraint of the material, not a waste factor you can negotiate down."}},
      {"@type": "Question", "name": "What waste factor should I use?", "acceptedAnswer": {"@type": "Answer", "text": "5% for plain simple rooms, 10% standard, 15% patterned or complex layouts, 20% heavy pattern plus irregular layout. The repeat rounding is separate from the waste factor — the calculator applies both, so don't stack a second pattern surcharge on top."}},
      {"@type": "Question", "name": "Will a 15 ft roll save me money?", "acceptedAnswer": {"@type": "Answer", "text": "Often yes. If the room width is 12–15 ft, a 15 ft roll cuts your strip count from 2 to 1 — in the third example that was 37% less carpet on the same room. Check roll availability and price per sq yd first; a wider roll usually wins."}},
      {"@type": "Question", "name": "What's free in Carpet Estimator Pro?", "acceptedAnswer": {"@type": "Answer", "text": "The full cut math — strips, cut lengths, lin ft, sq yd, seam layout, and accessory counts — runs free in the browser, no account, no credit card. The PDF proposal export is the paid tier: $19/mo, $149/yr (save 35%), or $199 lifetime."}}
    ]
  }
};

function parseFrontmatter(rawContent: string) {
  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, markdown: rawContent };
  }

  const yamlStr = match[1];
  const markdown = match[2];
  const frontmatter: Record<string, any> = {};

  const lines = yamlStr.split('\n');
  let currentKey = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('- ') && currentKey) {
      if (!Array.isArray(frontmatter[currentKey])) {
        frontmatter[currentKey] = [];
      }
      frontmatter[currentKey].push(trimmed.slice(2).trim());
    } else if (trimmed.includes(':')) {
      const parts = trimmed.split(':');
      const key = parts[0].trim();
      let val = parts.slice(1).join(':').trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      frontmatter[key] = val;
      currentKey = key;
    }
  }

  return { frontmatter, markdown };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  const files = fs.readdirSync(ARTICLES_DIR);
  return files
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .map((f) => f.replace('.md', ''));
}

export function getArticleBySlug(slug: string): BlogPost | null {
  const filePath = path.join(ARTICLES_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { frontmatter, markdown } = parseFrontmatter(raw);

  const title = frontmatter.meta_title || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const meta_description = frontmatter.meta_description || title;
  const date = frontmatter.date || '2026-08-01';
  const target_keywords = frontmatter.target_keywords || [];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": meta_description,
    "datePublished": date,
    "dateModified": date,
    "author": { "@type": "Person", "name": "Carpet Estimator Pro" },
    "publisher": {
      "@type": "Organization",
      "name": "Carpet Estimator Pro",
      "url": "https://carpet-estimator-pro.vercel.app/"
    }
  };

  return {
    slug,
    title,
    meta_title: title,
    meta_description,
    target_keywords,
    date,
    content: markdown,
    faqSchema: FAQ_SCHEMAS[slug],
    articleSchema,
  };
}

export function getAllArticles(): BlogPost[] {
  const slugs = getAllSlugs();
  const articles = slugs
    .map((s) => getArticleBySlug(s))
    .filter((a): a is BlogPost => a !== null);
  
  return articles.sort((a, b) => (a.date < b.date ? 1 : -1));
}
