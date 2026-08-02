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

const FAQ_SCHEMAS: Record<string, object> = {
  "planswift-alternative-for-mac": {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Does PlanSwift work on a Mac?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "There is no native macOS version of PlanSwift. It is a 32-bit Windows desktop app. To run it on a Mac you need a Windows virtual machine and a Windows license. Carpet Estimator Pro runs in any browser on a Mac with nothing to install."
        }
      },
      {
        "@type": "Question",
        "name": "How much does PlanSwift cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "$1,749 to $2,000 per user per year on annual subscription. It is sold per user, so a three-estimator crew is over $5,000 a year. Since ConstructConnect acquired PlanSwift, the old perpetual license is gone."
        }
      },
      {
        "@type": "Question",
        "name": "Is there a free PlanSwift alternative for Mac?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Carpet Estimator Pro has a free tier: on-screen takeoff with net area, strips, linear feet, square yards, accessories, and an interactive seam layout. Free users do not get PDF export. That starts at $19 a month."
        }
      },
      {
        "@type": "Question",
        "name": "Does Carpet Estimator Pro handle pattern match?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Choose plain, straight, or half-drop and enter the vertical repeat. Straight match rounds every cut up to the next full repeat. Half-drop pads the cut by 1.5 times the repeat. Pattern-match waste optimization is included on the annual plan."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need to install anything?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Carpet Estimator Pro is a web app. Open the URL in any browser on your Mac, PC, phone, or tablet and it runs. No downloads, no updates to manage."
        }
      },
      {
        "@type": "Question",
        "name": "Can I export a client-ready quote?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The free tier is on-screen only. Unbranded PDF quotes start at $19 a month. The lifetime tier at $199 one-time gives you unwatermarked PDFs and all future updates."
        }
      }
    ]
  },
  "free-broadloom-pattern-repeat-calculator": {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a pattern repeat, and why does it change how much carpet I order?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The repeat is the vertical distance between matching points in the pattern. On patterned broadloom, every cut has to be rounded up to a full number of repeats so the pattern lines up across seams. A 20.5 ft cut on a 1.5 ft repeat becomes a 21 ft cut — that half a foot per cut is exactly what the naive square-foot method misses."
        }
      },
      {
        "@type": "Question",
        "name": "Straight match or half-drop — how do I know which my carpet is?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Check the sample, the roll ticket, or the supplier's spec sheet. Straight match lines the pattern up at the same point on every seam. Half-drop offsets adjacent strips by half a repeat. When in doubt, ask the supplier before ordering — the tool lets you run both and compare the yardage."
        }
      },
      {
        "@type": "Question",
        "name": "Is the calculator really free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. The on-screen takeoff — strips, matched cut lengths, yardage, waste, seams and accessories — is free, in any browser, with no account and no credit card. The paid tiers ($19/mo, $149/yr, or $199 lifetime) unlock the itemized PDF quote for client handoff."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use it for L-shaped rooms?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Split the L into rectangles, enter each as a section, and the tool handles the rest — including how the strips lay across the combined shape."
        }
      },
      {
        "@type": "Question",
        "name": "Does it work in metric?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Toggle to UK Metric and you get metres, m², and 4 m or 5 m roll widths, with the same pattern-repeat math."
        }
      },
      {
        "@type": "Question",
        "name": "How do I get a PDF quote for a client?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The free tier is on-screen only. The paid tiers export an itemized, unbranded PDF quote (carpet, pad, tackless, seam tape) — $19/mo, $149/yr (save 35%), or $199 one-time lifetime."
        }
      }
    ]
  },
  "how-much-carpet-do-i-need": {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much carpet do I need for a 12x12 room?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "About 18 sq yd of plain carpet on a 12 ft roll, or about 20 sq yd if the carpet has a 1.5 ft straight-match repeat. The room is 16 sq yd net — the difference is trim, pattern rounding and waste."
        }
      },
      {
        "@type": "Question",
        "name": "Why is my square-foot estimate always short on patterned carpet?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Because the mill doesn't sell patterned carpet by the square foot. It sells by the strip, and every strip has to be a whole number of pattern repeats so the seams line up. That rounding, plus roll-width offcut, is real yardage you pay for."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use a 15 ft roll to avoid seams?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sometimes. If the room width is 15 ft wide or less, one 15 ft strip can replace two 12 ft strips and kill the seam — but check the pattern direction and the supplier's stock first. The calculator lets you switch roll widths and compare yardage and seams before you commit."
        }
      },
      {
        "@type": "Question",
        "name": "What's a good waste factor?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "5–10% for a clean rectangle, up to 15–20% for rooms with angles, alcoves, or tricky fitting. On patterned carpet, don't pile waste on top of the repeat rounding — the tool shows both, so you can see what's pattern and what's fitting loss."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need to make an account to use the calculator?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. It's free and open in any browser — no account, no credit card. The paid tiers ($19/mo, $149/yr, or $199 lifetime) add the itemized, unbranded PDF quote for client handoff."
        }
      },
      {
        "@type": "Question",
        "name": "How do I order carpet for an L-shaped room?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Split it into rectangles, enter each section, and add the doorways. The calculator lays the strips across the combined shape, so you see the real strip count instead of double-ordering two separate rectangles."
        }
      }
    ]
  },
  "measuresquare-pricing-alternative": {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much does MeasureSquare cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MeasureSquare sells separate products: Mobile at $54 a month, Multi-family at $164 a month, and Commercial at $197 a month. A full desktop plus mobile plus CRM setup runs past $2,000 per user per year."
        }
      },
      {
        "@type": "Question",
        "name": "Is MeasureSquare cheaper than Carpet Estimator Pro?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. The cheapest MeasureSquare product is $54 a month, or $648 a year. Carpet Estimator Pro's takeoff is free. Paid plans are $19 a month, $149 a year, or $199 one-time for lifetime access."
        }
      },
      {
        "@type": "Question",
        "name": "Does MeasureSquare have a Mac version?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The MeasureSquare desktop app is built for Windows. Mobile measurement runs through its separate mobile apps. Carpet Estimator Pro runs in any browser, so it works on a Mac, PC, tablet, or phone with nothing to install."
        }
      },
      {
        "@type": "Question",
        "name": "What is the cheapest flooring takeoff software?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Carpet Estimator Pro's takeoff is free: net area, strips, linear feet, square yards or square metres, accessories, and a seam layout. PDF quotes start at $19 a month. A handful of lighter general takeoff tools are cheaper, but none are built around carpet roll math."
        }
      },
      {
        "@type": "Question",
        "name": "What do I get on the free tier?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Full on-screen takeoff: net room area, carpet required in strips, linear feet and square yards or square metres, pad, tackless strips, and seam tape, plus an interactive seam layout visualizer. No PDF export on the free tier."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need a subscription to try it?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Open the calculator in your browser and take off a room in minutes. If you want client-ready PDFs, that is $19 a month, $149 a year, or $199 lifetime."
        }
      }
    ]
  },
  "straight-match-vs-half-drop": {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What's the difference between straight match and half-drop?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Straight match lines the pattern up at the same point on every strip. Half-drop shifts every alternating strip down by half a repeat so the motif lands between the motifs on the strip beside it. Half-drop looks better on big geometries and costs more — every cut gets padded by 1.5x the repeat."
        }
      },
      {
        "@type": "Question",
        "name": "Why does half-drop cost more than straight match?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Because of the shift. Alternating strips need half a repeat of extra at the top, plus a full repeat at the bottom to finish the motif — 1.5x the repeat per cut. On a 2 ft repeat that's 3 ft of mandatory padding per cut before any other waste."
        }
      },
      {
        "@type": "Question",
        "name": "Do I really have to round every cut up to a full repeat?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. A seam cut between repeats doesn't match — you'd see it immediately and so would the client. The repeat rounding is a hard constraint of the material, not a waste factor you can negotiate down."
        }
      },
      {
        "@type": "Question",
        "name": "What waste factor should I use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "5% for plain simple rooms, 10% standard, 15% patterned or complex layouts, 20% heavy pattern plus irregular layout. The repeat rounding is separate from the waste factor — the calculator applies both, so don't stack a second pattern surcharge on top."
        }
      },
      {
        "@type": "Question",
        "name": "Will a 15 ft roll save me money?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Often yes. If the room width is 12–15 ft, a 15 ft roll cuts your strip count from 2 to 1 — in the third example that was 37% less carpet on the same room. Check roll availability and price per sq yd first; a wider roll usually wins."
        }
      },
      {
        "@type": "Question",
        "name": "What's free in Carpet Estimator Pro?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The full cut math — strips, cut lengths, lin ft, sq yd, seam layout, and accessory counts — runs free in the browser, no account, no credit card. The PDF proposal export is the paid tier: $19/mo, $149/yr (save 35%), or $199 lifetime."
        }
      }
    ]
  }
};

const ARTICLES_DATA: Record<string, Omit<BlogPost, 'faqSchema' | 'articleSchema'>> = {
  "flooring-estimators-pattern-repeat-cheat-sheet": {
    "slug": "flooring-estimators-pattern-repeat-cheat-sheet",
    "title": "Flooring Estimators Pattern Repeat Cheat Sheet",
    "meta_title": "flooring-estimators-pattern-repeat-cheat-sheet",
    "meta_description": "",
    "target_keywords": [],
    "date": "2026-08-01",
    "content": "# Flooring Estimator's Pattern Repeat Cheat Sheet\r\n\r\n**One page. Print it, laminate it, keep it in the truck.** All rules match Carpet Estimator Pro (free at carpet-estimator-pro.vercel.app). Trim allowance: 3–6 in (US) / 10 cm (UK). Convert sq ft to sq yd: divide by 9.\r\n\r\n---\r\n\r\n## 1. CUT-LENGTH RULES (straight vs half-drop)\r\n\r\n| Pattern | Cut length formula | Example (16 ft room + 6 in trim) |\r\n|---|---|---|\r\n| Plain | room length + trim | 16.5 ft |\r\n| Straight match | round UP (room length + trim) to next full repeat | 2 ft repeat: 16.5 -> 18 ft (9 repeats) |\r\n| Half-drop | round UP (room length + trim + **1.5 x repeat**) to next full repeat | 2 ft repeat: 16.5 + 3 = 19.5 -> 20 ft (10 repeats) |\r\n\r\n**Why 1.5x for half-drop:** 0.5 repeat shift at the top of alternating strips + 1.0 full repeat at the bottom to finish the motif. Never cut between repeats — the seam won't match.\r\n\r\n---\r\n\r\n## 2. STRIPS PER ROLL WIDTH\r\n\r\nStrips = room width across the roll, rounded UP.\r\n\r\n**US (ft)**\r\n\r\n| Room width | 12 ft roll | 15 ft roll |\r\n|---|---|---|\r\n| up to 12 ft | 1 | 1 |\r\n| 12–15 ft | 2 | 1 |\r\n| 15–24 ft | 2 | 2 |\r\n| 24–30 ft | 3 | 2 |\r\n| 30–36 ft | 3 | 3 |\r\n| 36–45 ft | 4 | 3 |\r\n| 45–48 ft | 4 | 4 |\r\n\r\n**Metric (m)**\r\n\r\n| Room width | 4 m roll | 5 m roll |\r\n|---|---|---|\r\n| up to 4 m | 1 | 1 |\r\n| 4–5 m | 2 | 1 |\r\n| 5–8 m | 2 | 2 |\r\n| 8–10 m | 3 | 2 |\r\n| 10–12 m | 3 | 3 |\r\n| 12–15 m | 4 | 3 |\r\n\r\nWidths at exactly the roll width fit on one strip (e.g., a 12 ft room on a 12 ft roll = 1 strip).\r\n\r\n---\r\n\r\n## 3. ACCESSORY FORMULAS\r\n\r\n| Accessory | Formula | Roll size |\r\n|---|---|---|\r\n| Pad | net area x 1.05 | 270 sq ft |\r\n| Tackless / gripper | perimeter – doorway widths | 4 lin ft battens |\r\n| Seam tape | (strips – 1) x room length x 1.10 | 66 lin ft |\r\n\r\n---\r\n\r\n## 4. WASTE FACTOR TABLE (on top of pattern rounding — don't double-count)\r\n\r\n| Factor | Use it for |\r\n|---|---|\r\n| 5% | Plain, simple rectangle |\r\n| 10% | Standard install, minor cuts |\r\n| 15% | Patterned or complex layout (L-shapes, angles) |\r\n| 20% | Heavy pattern + irregular layout |\r\n\r\n---\r\n\r\n## 5. QUICK REFERENCE — COMMON ROOM SIZES (12 ft roll, 6 in trim)\r\n\r\n| Room L x W | Net sq yd | Strips @ 12 ft | Straight cut (2 ft rep) | Half-drop cut (2 ft rep) | Lin ft ordered (straight, +10%) |\r\n|---|---|---|---|---|---|\r\n| 10 x 12 | 13.3 | 1 | 12 ft | 14 ft | 13.2 |\r\n| 12 x 14 | 18.7 | 2 | 14 ft | 16 ft | 30.8 |\r\n| 14 x 16 | 24.9 | 2 | 16 ft | 18 ft | 35.2 |\r\n| 16 x 13 | 23.1 | 2 | 18 ft | 20 ft | 39.6 |\r\n| 18 x 20 | 40.0 | 2 | 20 ft | 22 ft | 44.0 |\r\n| 20 x 15 | 33.3 | 2 | 22 ft | 24 ft | 48.4 |\r\n\r\n**Lin ft ordered = strips x straight cut x 1.10. Sq yd = lin ft x roll width / 9.**\r\n\r\n---\r\n\r\n## THE RULE\r\n\r\n**Broadloom orders in strips and repeats, not square feet.** Pattern waste is per-cut; width waste is per-strip. A 15 ft roll can beat a pattern penalty — check roll width before you blame the repeat.\r\n\r\nFree cut schedule + seam layout: **carpet-estimator-pro.vercel.app** · Client-ready PDF proposal: **carpet-estimator-pro.vercel.app/checkout** ($19/mo, $149/yr save 35%, $199 lifetime)\r\n"
  },
  "free-broadloom-pattern-repeat-calculator": {
    "slug": "free-broadloom-pattern-repeat-calculator",
    "title": "Free Broadloom Pattern Repeat Calculator",
    "meta_title": "Free Broadloom Pattern Repeat Calculator",
    "meta_description": "Free broadloom pattern repeat calculator for carpet fitters: enter room size, roll width and repeat length to get strips, matched cut lengths and waste.",
    "target_keywords": [
      "broadloom pattern repeat calculator",
      "carpet pattern repeat calculator",
      "straight match vs half drop calculator"
    ],
    "date": "2026-08-01",
    "content": "\r\n# Free Broadloom Pattern Repeat Calculator\r\n\r\nIf you price or fit broadloom for a living, you know the trap: you can measure a room in square feet all day and still under-order by 40% the moment the carpet carries a pattern. Broadloom is ordered in strips and pattern repeats, not square feet. This free broadloom pattern repeat calculator works the way the mill and the installer actually do — it turns your room into strips, rounds every cut up to a full pattern repeat, and tells you the yardage to order.\r\n\r\nIt runs in any browser: phone, tablet, Mac or PC. No account, no credit card, nothing to install. If you've been hunting for a carpet pattern repeat calculator that doesn't make you sign up before it shows you the answer, this is it. The math happens on your device, and the free tier gives you the full on-screen takeoff.\r\n\r\n## What This Calculator Does\r\n\r\nThis isn't a length-times-width box. It's a broadloom takeoff tool:\r\n\r\n- **Room sections.** Enter length and width for each section. L-shaped rooms are handled by splitting them into rectangles — add every section, plus doorway count and widths.\r\n- **Roll width.** Standard 12 ft and 15 ft broadloom, or a custom width. UK and metric users get 4 m and 5 m rolls with the unit toggle.\r\n- **Pattern matching.** Plain (no repeat), straight match, or half-drop, plus the vertical repeat length in feet, inches or cm.\r\n- **Waste and trim.** Waste factor from 5% to 20%, plus a trim allowance for the cut taken off each end.\r\n- **Output.** Net room area in sq ft, sq yd and m²; total carpet in strips and linear feet; waste percentage; and an interactive seam layout that shows where every strip lands before you cut.\r\n- **Accessories.** Pad, tackless strips (gripper rods in the UK) and seam tape sized from the room — not guessed at.\r\n\r\n## How to Use It\r\n\r\nFive steps, about ninety seconds.\r\n\r\n### Step 1: Enter the Room\r\n\r\nPick feet (US Imperial) or metres (UK Metric). Enter the length and width of the first section, then add sections for any L-shape or alcove. Enter your doorways — their widths come out of the perimeter for the tackless calculation later.\r\n\r\n### Step 2: Set the Roll Width\r\n\r\n12 ft is the default for US residential broadloom; 15 ft is common for commercial. Most UK rolls are 4 m, with 5 m for commercial work. If you're cutting from a specific roll, enter its exact width.\r\n\r\n### Step 3: Set the Pattern Match and Repeat\r\n\r\nThis is the step that saves the money. Plain means no repeat math. Straight match means every cut gets rounded up to the next full pattern repeat. Half-drop means the tool pads each cut by one and a half repeats. You'll need the vertical repeat length — it's printed on the sample or the roll ticket. If you're not sure, call the supplier before you order. Guessing here is how jobs end up a strip short.\r\n\r\n### Step 4: Set Waste and Trim\r\n\r\nWaste factor covers fitting losses, and 5–10% is typical for a clean rectangle. Drop the trim allowance at 0.5 ft (about 15 cm) or whatever your crew actually takes off each end. On patterned carpet, the repeat rounding already adds length — don't double-count by cranking waste to 20% on top.\r\n\r\n### Step 5: Read the Takeoff\r\n\r\nIgnore the temptation to only look at the area. Read the strips and the linear feet: how many strips, how long each matched cut is, total linear feet, square yards to order, waste percentage, and the seam layout. That last screen is worth a look — it shows the offcut from each strip so you can see where the waste is coming from before you cut anything.\r\n\r\n## Straight Match vs Half Drop, in Plain Language\r\n\r\n**Straight match** means the pattern lines up at the same point across every seam. Because each strip has to start at the same place in the repeat, every cut length gets rounded up to the next full repeat. If your cut needs 20.5 ft and the repeat is 1.5 ft, you buy 21 ft. You can't buy 20.5 — the pattern wouldn't line up across the seam.\r\n\r\n**Half-drop** means the pattern on the adjacent strip is offset by half a repeat — the design \"drops\" as it moves across the room. That offset eats extra carpet: each cut needs one and a half repeats of padding on top of the straight-match rounding, which is where the 1.5× rule comes from. You'll see half-drop on a lot of textured and geometric broadloom.\r\n\r\nWhich one is yours? Read the label or the supplier's spec sheet. If the carpet is a straight match, round to the repeat. If it's a half-drop, budget 1.5× the repeat per cut. Get it wrong and you're ordering a second roll, hoping the dye lot matches.\r\n\r\n## Worked Example: 20×15 ft Room, 12 ft Roll, 1.5 ft Repeat\r\n\r\nThis is a real takeoff, and it's the reason this tool exists. Room: 20×15 ft. Roll: 12 ft. Pattern: straight match, 1.5 ft repeat. Waste factor: 10%. Trim: 0.5 ft.\r\n\r\n**The naive calculation.** 20 × 15 = 300 sq ft = 33.3 sq yd. Add 10% waste: 330 sq ft = **36.7 sq yd ordered**. On paper that looks generous. It isn't.\r\n\r\n**The correct broadloom takeoff.** The 15 ft width needs two 12 ft strips — 24 ft covers it, and the leftover 9 ft of roll width becomes offcut. Each strip: 20 ft room length + 0.5 ft trim = 20.5 ft. Divide by the 1.5 ft repeat: 20.5 ÷ 1.5 = 13.7, so round up to 14 full repeats = **21 ft per cut**. Two strips × 21 ft = 42 linear feet × 12 ft wide = 504 sq ft = **56 sq yd**. Add the 10% waste factor: **61.6 sq yd ordered**.\r\n\r\n**The gap.** 61.6 − 36.7 = 24.9, call it **25 sq yd short — roughly 46% of the carpet the room actually needs**. At $30–40 per sq yd installed, that's **$750 to $1,000 a room**, before you count the run-out, the second roll, and the dye-lot mismatch that comes with it.\r\n\r\n## Accessories It Sizes for You\r\n\r\nThe tool doesn't stop at the carpet:\r\n\r\n- **Pad:** net area × 1.05, sold in 270 sq ft rolls (6 ft × 45 ft). The 20×15 room: 300 × 1.05 = 315 sq ft — so **2 rolls**.\r\n- **Tackless strips:** perimeter minus doorway widths, in 4 ft battens. Perimeter of 20×15 is 70 ft; minus a 3 ft door = 67 ft — **17 battens**.\r\n- **Seam tape:** (strips − 1) × room length × 1.10, sold in 66 ft rolls. (2 − 1) × 20 × 1.10 = 22 ft — **1 roll**.\r\n\r\n## Frequently Asked Questions\r\n\r\n**What is a pattern repeat, and why does it change how much carpet I order?**\r\nThe repeat is the vertical distance between matching points in the pattern. On patterned broadloom, every cut has to be rounded up to a full number of repeats so the pattern lines up across seams. A 20.5 ft cut on a 1.5 ft repeat becomes a 21 ft cut — that half a foot per cut is exactly what the naive square-foot method misses.\r\n\r\n**Straight match or half-drop — how do I know which my carpet is?**\r\nCheck the sample, the roll ticket, or the supplier's spec sheet. Straight match lines the pattern up at the same point on every seam. Half-drop offsets adjacent strips by half a repeat. When in doubt, ask the supplier before ordering — the tool lets you run both and compare the yardage.\r\n\r\n**Is the calculator really free?**\r\nYes. The on-screen takeoff — strips, matched cut lengths, yardage, waste, seams and accessories — is free, in any browser, with no account and no credit card. The paid tiers ($19/mo, $149/yr, or $199 lifetime) unlock the itemized PDF quote for client handoff.\r\n\r\n**Can I use it for L-shaped rooms?**\r\nYes. Split the L into rectangles, enter each as a section, and the tool handles the rest — including how the strips lay across the combined shape.\r\n\r\n**Does it work in metric?**\r\nYes. Toggle to UK Metric and you get metres, m², and 4 m or 5 m roll widths, with the same pattern-repeat math.\r\n\r\n**How do I get a PDF quote for a client?**\r\nThe free tier is on-screen only. The paid tiers export an itemized, unbranded PDF quote (carpet, pad, tackless, seam tape) — $19/mo, $149/yr (save 35%), or $199 one-time lifetime.\r\n\r\n## Get the Numbers Before You Order\r\n\r\nStop estimating by square feet. Run the takeoff in strips and repeats, see the seam layout, and order once. The calculator is free, and it's already open:\r\n\r\n- **Use the free calculator:** [carpet-estimator-pro.vercel.app](https://carpet-estimator-pro.vercel.app/)\r\n- **Need client-ready PDF quotes?** Grab the paid tier at [carpet-estimator-pro.vercel.app/checkout](https://carpet-estimator-pro.vercel.app/checkout)\r\n"
  },
  "how-much-carpet-do-i-need": {
    "slug": "how-much-carpet-do-i-need",
    "title": "How Much Carpet Do I Need? Free Carpet Yardage Calculator",
    "meta_title": "How Much Carpet Do I Need? Free Carpet Yardage Calculator",
    "meta_description": "Find out how much carpet you need with this free yardage calculator. Strips and pattern repeats matter more than square feet.",
    "target_keywords": [
      "how much carpet do i need",
      "carpet yardage calculator",
      "how much carpet for a 12x12 room"
    ],
    "date": "2026-08-01",
    "content": "\r\n# How Much Carpet Do I Need? Use the Free Carpet Yardage Calculator\r\n\r\nShort version: you need to know how many strips of broadloom fit your room and how long each matched cut has to be — not just the square footage. The old \"length × width, add 10%\" method works fine for plain carpet in a perfect rectangle. The moment there's a pattern repeat, a 12 ft roll, or an odd width, it under-orders by a shocking amount. This free carpet yardage calculator does the takeoff the way the mill actually sells carpet: in strips, matched cut lengths, and square yards.\r\n\r\nIt runs in any browser — phone, tablet, Mac or PC — with no account and no credit card. Enter the room, pick the roll width and pattern match, and you get the strips, linear feet, yardage, waste percentage and accessories on screen in about a minute.\r\n\r\n## The Short Answer\r\n\r\nFor a rectangular room, the answer is always: **strips × matched cut length**, expressed in square yards.\r\n\r\n- Count how many roll-widths cover the room (a 12 ft roll covers rooms up to 12 ft wide with one strip, up to 24 ft with two).\r\n- Add trim to the cut length, then round up to a full pattern repeat if the carpet is patterned.\r\n- Multiply strips by cut length by roll width, add waste, and convert to sq yd.\r\n\r\nThat's the whole job. Most under-orders happen because people skip the rounding-up step.\r\n\r\n## Why \"Length × Width + 10%\" Under-Orders\r\n\r\nThe flat method is popular because it's easy: 15 × 20 = 300 sq ft, add 10% = 330 sq ft, done. It's wrong on patterned broadloom for three reasons.\r\n\r\n**Rolls are wide, rooms are arbitrary.** A 12 ft roll covering a 15 ft room means two strips — 24 ft of roll width for 15 ft of room. That 9 ft of offcut width is waste you just paid for, and the flat method never sees it.\r\n\r\n**Pattern repeats force you to buy extra length.** Every cut has to be a whole number of repeats, or the pattern won't line up across the seam. A 20.5 ft cut on a 1.5 ft repeat is a 21 ft cut, full stop. You can't buy 20.5 ft of patterned carpet.\r\n\r\n**Waste compounds.** Add the pattern rounding on top of the roll-width offcut and the 10% buffer, and \"a bit extra\" becomes 40% short. The flat method doesn't just miss the waste — it understates the room.\r\n\r\nThat's why the honest answer to \"how much carpet do I need?\" is never a single square-foot number. It's a strip count and a matched cut length.\r\n\r\n## How Much Carpet for a 12x12 Room?\r\n\r\nA 12×12 room is the classic example, because it fits neatly on a 12 ft roll: **one strip**. 12 × 12 = 144 sq ft = 16 sq yd net. Add 0.5 ft trim: cut length 12.5 ft, so the strip is 12.5 ft × 12 ft = 150 sq ft = 16.7 sq yd. With a 10% waste factor, order roughly **18 sq yd** of plain carpet.\r\n\r\nNow put a 1.5 ft straight-match repeat on it. 12.5 ft ÷ 1.5 = 8.3, so round up to 9 repeats = **13.5 ft cut**. One strip of 13.5 ft × 12 ft = 162 sq ft = 18 sq yd, plus 10% = **about 20 sq yd**. Same room, same roll, four extra square yards just from the pattern. That's the difference between \"how much carpet do I need?\" answered from the floor plan and answered from the roll.\r\n\r\n## The Worked Example That Proves It: 20×15 ft on a 12 ft Roll\r\n\r\nRoom: 20×15 ft. Roll: 12 ft. Pattern: straight match, 1.5 ft repeat. Waste: 10%. Trim: 0.5 ft.\r\n\r\n**The naive order:** 20 × 15 = 300 sq ft = 33.3 sq yd. Add 10% → **36.7 sq yd**.\r\n\r\n**The correct order:** The 15 ft width takes two 12 ft strips. Each cut: 20 ft + 0.5 ft trim = 20.5 ft, rounded up to 14 full repeats = **21 ft**. Two strips × 21 ft = 42 linear ft × 12 ft = 504 sq ft = **56 sq yd**. Add 10% → **61.6 sq yd**.\r\n\r\n**The shortfall:** 61.6 − 36.7 = 24.9, call it **25 sq yd — about 46% of what the room actually needed**. At $30–40 per sq yd installed, that's **$750–$1,000 lost on one room**, plus the run-out, the second roll, and the dye-lot mismatch when you try to match it.\r\n\r\n## Quick Reference: Common Room Sizes on a 12 ft Roll\r\n\r\nStrips below assume the roll runs along the longer side of the room. Patterned carpet adds length per cut (see the notes), and these numbers are before your waste factor.\r\n\r\n| Room size | Floor area | Strips on 12 ft roll | Note |\r\n|---|---|---|---|\r\n| 10×10 | 100 sq ft | 1 | Fits with a full strip to spare |\r\n| 12×12 | 144 sq ft | 1 | One strip, 12.5 ft + repeat |\r\n| 12×15 | 180 sq ft | 1 | One strip, 15.5 ft + repeat |\r\n| 13×15 | 195 sq ft | 2 | Second strip mostly offcut |\r\n| 14×18 | 252 sq ft | 2 | ~10 ft of offcut width per strip |\r\n| 15×20 | 300 sq ft | 2 | 9 ft of offcut width per strip |\r\n| 18×22 | 396 sq ft | 2 | 6 ft of offcut width per strip |\r\n| 24×24 | 576 sq ft | 2 | Two strips fill it exactly |\r\n| 26×30 | 780 sq ft | 3 | 6 ft of offcut width per strip |\r\n\r\nThe pattern repeats can push the cut length up by a foot or more per strip. Run the room through the calculator with your actual repeat before you commit to a number from a table.\r\n\r\n## What Else Goes On the Order\r\n\r\nThe carpet is only half the order. A proper takeoff includes:\r\n\r\n- **Pad:** net area × 1.05, sold in 270 sq ft rolls (6 ft × 45 ft). The 20×15 room needs 315 sq ft — two rolls.\r\n- **Tackless strips (gripper rods):** room perimeter minus doorway widths, sold in 4 ft battens.\r\n- **Seam tape:** (strips − 1) × room length × 1.10, sold in 66 ft rolls. For the 20×15 example: one 66 ft roll covers the 22 ft of seam.\r\n\r\nThe calculator sizes all of these from your actual room, so you're not guessing on the truck.\r\n\r\n## Frequently Asked Questions\r\n\r\n**How much carpet do I need for a 12x12 room?**\r\nAbout 18 sq yd of plain carpet on a 12 ft roll, or about 20 sq yd if the carpet has a 1.5 ft straight-match repeat. The room is 16 sq yd net — the difference is trim, pattern rounding and waste.\r\n\r\n**Why is my square-foot estimate always short on patterned carpet?**\r\nBecause the mill doesn't sell patterned carpet by the square foot. It sells by the strip, and every strip has to be a whole number of pattern repeats so the seams line up. That rounding, plus roll-width offcut, is real yardage you pay for.\r\n\r\n**Can I use a 15 ft roll to avoid seams?**\r\nSometimes. If the room is 15 ft wide or less, one 15 ft strip can replace two 12 ft strips and kill the seam — but check the pattern direction and the supplier's stock first. The calculator lets you switch roll widths and compare yardage and seams before you commit.\r\n\r\n**What's a good waste factor?**\r\n5–10% for a clean rectangle, up to 15–20% for rooms with angles, alcoves, or tricky fitting. On patterned carpet, don't pile waste on top of the repeat rounding — the tool shows both, so you can see what's pattern and what's fitting loss.\r\n\r\n**Do I need to make an account to use the calculator?**\r\nNo. It's free and open in any browser — no account, no credit card. The paid tiers ($19/mo, $149/yr, or $199 lifetime) add the itemized, unbranded PDF quote for client handoff.\r\n\r\n**How do I order carpet for an L-shaped room?**\r\nSplit it into rectangles, enter each section, and add the doorways. The calculator lays the strips across the combined shape, so you see the real strip count instead of double-ordering two separate rectangles.\r\n\r\n## Run the Numbers Before You Call the Supplier\r\n\r\nOne takeoff in the calculator beats an afternoon of second-guessing — and it's free:\r\n\r\n- **Use the free carpet yardage calculator:** [carpet-estimator-pro.vercel.app](https://carpet-estimator-pro.vercel.app/)\r\n- **Need a client-ready PDF quote?** Paid tiers start at [carpet-estimator-pro.vercel.app/checkout](https://carpet-estimator-pro.vercel.app/checkout)\r\n"
  },
  "measuresquare-pricing-alternative": {
    "slug": "measuresquare-pricing-alternative",
    "title": "MeasureSquare Pricing vs Carpet Estimator Pro (2026)",
    "meta_title": "MeasureSquare Pricing vs Carpet Estimator Pro (2026)",
    "meta_description": "MeasureSquare pricing adds up fast: Mobile $54/mo, Multi-family $164/mo, Commercial $197/mo. Carpet Estimator Pro is one tool, from $19/mo.",
    "target_keywords": [
      "measuresquare pricing",
      "measuresquare alternative",
      "flooring takeoff software cost"
    ],
    "date": "2026-08-01",
    "content": "\r\n# MeasureSquare Pricing: What It Costs, and a Cheaper Alternative for Carpet Takeoff\r\n\r\nLook up MeasureSquare pricing and you will find three price tags, not one. MeasureSquare Mobile at $54 a month. Multi-family at $164 a month. Commercial at $197 a month. Each one is a separate product with its own invoice, its own app, and its own workflow.\r\n\r\nAdd up what a working shop actually needs and you are past $2,000 per user per year before you have measured a room. For a solo fitter or a showroom rep, that is a heavy lift for a takeoff.\r\n\r\nThis article breaks down what MeasureSquare really costs, what the market charges for flooring takeoff software, and a cheaper alternative built for carpet specialists: Carpet Estimator Pro.\r\n\r\n## MeasureSquare Pricing: Three Products, Three Invoices\r\n\r\nMeasureSquare sells its suite in pieces:\r\n\r\n- Mobile: $54 a month.\r\n- Multi-family: $164 a month.\r\n- Commercial: $197 a month.\r\n\r\nEach product covers a slice of the business, and they do not share one workflow. The desktop app is Windows-based. The mobile apps are separate. The CRM is another piece. The recurring complaint in flooring forums is the learning curve: you are not learning one tool, you are learning three.\r\n\r\n### What the full stack runs to\r\n\r\nRun the stack the way MeasureSquare sells it, desktop plus mobile plus CRM, and the total exceeds $2,000 per user per year. Scale to a crew of three estimators and you are past $6,000 a year in software before anyone walks a room.\r\n\r\nThat is the real MeasureSquare pricing story. The headline number looks like $54 a month. The actual number is whatever it takes to buy the pieces that fit your shop, every year, forever.\r\n\r\n## What You Are Paying For\r\n\r\nHere is what the money buys: mobile measurement capture, desktop takeoff, and CRM for leads and jobs. If you run a multi-crew commercial operation with sales staff, that stack does real work.\r\n\r\nHere is what it buys a solo fitter: a takeoff. You measure a room, you order carpet, you quote the job. You do not need a CRM to run three jobs a week. You need the math right, the accessories counted, and a quote the client can read.\r\n\r\nThat gap is why Carpet Estimator Pro exists.\r\n\r\n## Carpet Estimator Pro: One Tool, One Price\r\n\r\nCarpet Estimator Pro is a browser-based carpet estimating app for professional fitters, estimators, and showroom reps in the US, UK, Canada, and Australia.\r\n\r\nOne tool does the whole job. Net room area. Total carpet in strips, linear feet, and square yards or square metres. Pad, tackless strips (gripper rods in the UK), and seam tape. An interactive seam layout visualizer shows where every strip lands before you order.\r\n\r\nIt runs in any browser. Phone, tablet, Mac, PC. Nothing to install. US Imperial is built in: feet, 12 ft and 15 ft rolls. UK Metric is built in too: metres, 4 m and 5 m rolls. L-shaped rooms, doorway count and width, roll width, pattern match (plain, straight, half-drop), vertical repeat, waste factor, and trim allowance are all inputs, not afterthoughts.\r\n\r\n### Pricing\r\n\r\n- Free: full on-screen takeoff. Net area, strips, yardage, accessories, seam diagram. No PDF export.\r\n- Monthly: $19 a month. Unbranded PDF export.\r\n- Annual: $149 a year, 35% off. Pattern-match waste optimization, unlimited field-crew PDFs, priority support.\r\n- Lifetime: $199 one-time. Unwatermarked PDFs, tax-deductible, all future updates.\r\n\r\nThe numbers are small on purpose. $149 a year is less than three months of MeasureSquare Mobile. $199 lifetime is roughly one month of MeasureSquare Commercial, paid once.\r\n\r\nSee the pricing in action first. The free takeoff runs in your browser: https://carpet-estimator-pro.vercel.app/\r\n\r\n## Cost Comparison: MeasureSquare vs Carpet Estimator Pro\r\n\r\n| | MeasureSquare | Carpet Estimator Pro |\r\n|---|---|---|\r\n| How it is sold | Separate products: Mobile $54/mo, Multi-family $164/mo, Commercial $197/mo | One tool: free, $19/mo, $149/yr, $199 lifetime |\r\n| Entry price | $648/yr (Mobile) | Free |\r\n| Single user, year 1 | $2,000+ for the full stack | $0 to $199 |\r\n| Single user, year 5 | $10,000+ | $0 to $745, or $199 once on lifetime |\r\n| 3-user crew, year 1 | $6,000+ | $0 to $597 |\r\n| Products to buy | 3+: mobile, desktop, CRM | 1 |\r\n| Platform | Windows desktop + separate mobile apps | Any browser: phone, tablet, Mac, PC |\r\n| Learning curve | Steep, one workflow per product | One tool, built for estimators |\r\n| Carpet/broadloom focus | Full flooring suite | Carpet and broadloom: pattern match, repeats, seam layout |\r\n| PDF quote | Part of the paid stack | $19/mo unbranded; $149/yr; $199 lifetime unwatermarked |\r\n\r\n## Flooring Takeoff Software Cost: What the Market Charges\r\n\r\nTo see where Carpet Estimator Pro sits, here is what the rest of the market charges:\r\n\r\n- PlanSwift: $1,749 to $2,000 per user per year. Windows desktop, no Mac version.\r\n- STACK: $2,599 to $5,499 a year. General multi-trade cloud takeoff, and no carpet roll or pattern-match math.\r\n- RFMS: $809 to $2,700 a year, with support slowdowns since Cyncly acquired it.\r\n- zzTakeoff: $50 a month or $500 to $600 a year. Browser-based, but it stops at takeoff. No quoting, no PDF proposals.\r\n- Budget general tools: Mint Takeoff at $15 a month, ProTakeoff around $200 a year. Cheap, but they are not built around carpet rolls, repeats, and seam layout.\r\n\r\nThe pattern is obvious. General takeoff software costs serious money, and none of it ends in a carpet order the way a fitter needs: correct roll math, pattern match, accessories, and a quote the client can read.\r\n\r\nThe carpet-specific tool with the correct math costs $0 to try, $149 a year, or $199 once. Even zzTakeoff at $500 a year is more than three times the annual plan, and zzTakeoff cannot produce a quote.\r\n\r\n## When MeasureSquare Still Makes Sense\r\n\r\nTo be fair: MeasureSquare is a serious flooring suite. If you run a multi-crew commercial operation with dedicated estimators and sales staff, the desktop app plus CRM does work a solo tool will not. If you measure tile, LVT, hardwood, and carpet across a dozen jobs a week, a broad flooring suite is a legitimate choice.\r\n\r\nThat is a business decision for a shop with overhead. A solo fitter, a two-person crew, a showroom rep: you do not need three products and a CRM. You need the takeoff right and the quote out the door. That is the gap Carpet Estimator Pro fills, and it costs a fraction of the stack.\r\n\r\n## FAQ\r\n\r\n### How much does MeasureSquare cost?\r\n\r\nMeasureSquare sells separate products: Mobile at $54 a month, Multi-family at $164 a month, and Commercial at $197 a month. A full desktop plus mobile plus CRM setup runs past $2,000 per user per year.\r\n\r\n### Is MeasureSquare cheaper than Carpet Estimator Pro?\r\n\r\nNo. The cheapest MeasureSquare product is $54 a month, or $648 a year. Carpet Estimator Pro's takeoff is free. Paid plans are $19 a month, $149 a year, or $199 one-time for lifetime access.\r\n\r\n### Does MeasureSquare have a Mac version?\r\n\r\nThe MeasureSquare desktop app is built for Windows. Mobile measurement runs through its separate mobile apps. Carpet Estimator Pro runs in any browser, so it works on a Mac, PC, tablet, or phone with nothing to install.\r\n\r\n### What is the cheapest flooring takeoff software?\r\n\r\nCarpet Estimator Pro's takeoff is free: net area, strips, linear feet, square yards or square metres, accessories, and a seam layout. PDF quotes start at $19 a month. A handful of lighter general takeoff tools are cheaper, but none are built around carpet roll math.\r\n\r\n### What do I get on the free tier?\r\n\r\nFull on-screen takeoff: net room area, carpet required in strips, linear feet and square yards or square metres, pad, tackless strips, and seam tape, plus an interactive seam layout visualizer. No PDF export on the free tier.\r\n\r\n### Do I need a subscription to try it?\r\n\r\nNo. Open the calculator in your browser and take off a room in minutes. If you want client-ready PDFs, that is $19 a month, $149 a year, or $199 lifetime. The checkout is a single page: https://carpet-estimator-pro.vercel.app/checkout\r\n\r\n## Try It Before You Buy Anything\r\n\r\nTake your next room off for free and see where the numbers land: https://carpet-estimator-pro.vercel.app/\r\n\r\nWhen you want the quote on paper, the checkout is one page: https://carpet-estimator-pro.vercel.app/checkout\r\n"
  },
  "planswift-alternative-for-mac": {
    "slug": "planswift-alternative-for-mac",
    "title": "PlanSwift Alternative for Mac: Carpet Takeoff That Works",
    "meta_title": "PlanSwift Alternative for Mac: Carpet Takeoff That Works",
    "meta_description": "PlanSwift has no Mac version and costs $1,749+/yr. Carpet Estimator Pro is browser-based carpet takeoff that runs on any Mac, from $19/mo.",
    "target_keywords": [
      "planswift alternative for mac",
      "planswift pricing",
      "planswift on mac"
    ],
    "date": "2026-08-01",
    "content": "\r\n# PlanSwift Alternative for Mac: Carpet Takeoff That Runs in Your Browser\r\n\r\nIf you price carpet for a living and you work on a Mac, you have hit the same wall I hit. Everyone names PlanSwift first. It is the takeoff tool the trades have used for two decades. And it has no Mac version.\r\n\r\nPlanSwift is a 32-bit Windows desktop app. On a Mac, that means a virtual machine, a Windows license, and extra cost before you have measured a single room. Then the subscription itself lands: $1,749 to $2,000 per user per year.\r\n\r\nThere is a better path for carpet and broadloom specialists. Carpet Estimator Pro is a browser-based estimating app built for carpet takeoff. It runs on any Mac. No VM. No install. The takeoff is free. This article covers what PlanSwift costs, why it fights you on a Mac, and what changes when you switch.\r\n\r\n## Why PlanSwift Is a Pain on a Mac\r\n\r\nPlanSwift has no native macOS version. That is not an oversight. It is a 32-bit Windows desktop application that was never ported. ConstructConnect acquired PlanSwift, and the roadmap since then has been about subscription pricing, not new platforms. As of 2026, there is still no Mac version. The workarounds all cost money and patience.\r\n\r\n### The virtual machine tax\r\n\r\nTo run PlanSwift on a Mac you need a Windows virtual machine. Parallels or VMware Fusion, plus a Windows license, plus enough RAM to run two operating systems at once. Every update becomes two updates: Windows updates, then PlanSwift updates. Every crash becomes two places to look for the problem. Support questions bounce between two vendors, and neither one owns the setup.\r\n\r\n### Desktop habits, desktop limits\r\n\r\nPlanSwift is a mouse-and-monitor desktop app. It lags on large PDF plan sets, and crashes are not rare. For a tool priced at $1,749 a year, that is a bad trade. None of it runs on the tablet you carry into a showroom or the phone you use on site. The measuring happens in the field. The software should not chain you to a desk.\r\n\r\n## What PlanSwift Costs in 2026\r\n\r\nPlanSwift now sells on annual subscription: $1,749 to $2,000 per user per year. The old perpetual license is gone, and the price has climbed since the ConstructConnect acquisition.\r\n\r\nThat price is per user. Put three estimators on it and you are past $5,000 a year before anyone measures a room. You are also paying that every year, whether you take off two jobs a week or twenty.\r\n\r\nNow compare Carpet Estimator Pro:\r\n\r\n- Free: full on-screen takeoff. Net area, strips, linear feet, square yards, accessories, seam layout.\r\n- Monthly: $19 a month for unbranded PDF export.\r\n- Annual: $149 a year, a 35% saving, with pattern-match waste optimization, unlimited field-crew PDFs, and priority support.\r\n- Lifetime: $199 one-time. Unwatermarked PDFs, tax-deductible, all future updates included.\r\n\r\nThe annual plan is about 91% less than the low end of PlanSwift. The lifetime price is roughly 1.4 months of PlanSwift, paid once. You also skip the VM tax: no Windows license, no Parallels, no RAM upgrade.\r\n\r\nSee it for yourself. The free calculator runs in your browser right now: https://carpet-estimator-pro.vercel.app/\r\n\r\n## What Carpet Estimator Pro Does\r\n\r\nCarpet Estimator Pro is built for carpet and broadloom, not for drywall. The output is a real order: net room area, carpet required in strips, linear feet and square yards or square metres, plus pad, tackless strips (gripper rods in the UK), and seam tape. An interactive seam layout visualizer shows where every strip lands before you cut anything.\r\n\r\nIt runs in any browser. Phone, tablet, Mac, PC. Nothing to install, no virtual machine. It is mobile-first, so it works on a tablet at the counter or a phone in a customer's living room.\r\n\r\n### Inputs that match real jobs\r\n\r\n- Room width and length, with L-shaped rooms handled by rectangular sections.\r\n- Doorways: count and width, subtracted from the perimeter for tackless.\r\n- Roll width: 12 ft and 15 ft standard, 4 m and 5 m metric, or custom.\r\n- Pattern match: plain, straight, or half-drop, with the vertical repeat length.\r\n- Waste factor from 5% to 20% and trim allowance.\r\n\r\n### The math is the point\r\n\r\nStraight match rounds every cut length up to the next full pattern repeat. Half-drop pads each cut by 1.5 times the repeat. That is the difference between ordering enough carpet and ordering a second roll mid-job from a different dye lot. Generic takeoff tools do not know what a repeat is. Carpet Estimator Pro was built around it.\r\n\r\n## PlanSwift vs Carpet Estimator Pro: Mac Compatibility\r\n\r\n| | PlanSwift | Carpet Estimator Pro |\r\n|---|---|---|\r\n| macOS support | None. Windows VM required | Any browser on macOS. No VM, no install |\r\n| What you need on a Mac | Parallels/VMware + Windows license + RAM | A browser |\r\n| Install | Windows installer | Nothing |\r\n| Phone or tablet | No | Yes, mobile-first web app |\r\n| Windows support | Native | Browser on Windows too |\r\n| Price | $1,749-$2,000/user/yr | Free takeoff; $19/mo, $149/yr, $199 lifetime |\r\n| Carpet math | Generic multi-trade takeoff | Strips, pattern repeats, half-drop, accessories |\r\n| PDF quote on a Mac | Windows VM workflow | Paid tiers: unbranded or unwatermarked |\r\n| Learning curve | Legacy Windows UI | Built for estimators; takeoff in minutes |\r\n\r\n## The Carpet Math That Generic Takeoff Misses\r\n\r\nHere is the number that matters. I ran a real room through the tool: 20 ft by 15 ft, 12 ft roll, straight pattern match with a 1.5 ft repeat, 10% waste.\r\n\r\nNet area: 300 sq ft, which is 33.3 sq yd.\r\n\r\nA naive calculator adds 10% and says 36.7 sq yd. A generic takeoff tool stops there. That order is short, and here is why.\r\n\r\nBroadloom orders in strips and pattern repeats. Two strips, each cut to 21 ft to land on the repeat (20 ft rounds up to the next 1.5 ft repeat). That is 42 linear feet by 12 ft wide: 504 sq ft, or 56 sq yd. Add the 10% waste and the correct order is 61.6 sq yd.\r\n\r\nThe shortfall is about 25 sq yd, roughly 46%. At carpet prices that is $750 to $1,000 on one room. Run out of the right dye lot and you are buying a whole new roll anyway, plus the labor to redo the job. On a half-drop match it gets worse, because each cut has to be padded by 1.5 times the repeat to stay in step.\r\n\r\nThe same run gives you the full accessory list: pad at 315 sq ft (two 270 sq ft rolls), 67 linear feet of tackless, and 22 linear feet of seam tape. You walk onto the job with a complete order, not a guess.\r\n\r\nRun the same room yourself. The free takeoff does the full calculation, including accessories: https://carpet-estimator-pro.vercel.app/\r\n\r\n## Who Should Stay on PlanSwift\r\n\r\nAn honest answer: general contractors doing multi-trade takeoff on Windows workstations have a reason to keep it. PlanSwift does framing, drywall, roofing, and electrical counts. If that is your business and your office runs Windows, this article is not about talking you out of a tool that works.\r\n\r\nBut if you price carpet and broadloom, you are paying for a multi-trade tool, using a fraction of it, on hardware it was not designed for, at $1,749 a year. A purpose-built carpet takeoff tool is cheaper, runs on your Mac, and gets the carpet math right.\r\n\r\n## FAQ\r\n\r\n### Does PlanSwift work on a Mac?\r\n\r\nThere is no native macOS version of PlanSwift. It is a 32-bit Windows desktop app. To run it on a Mac you need a Windows virtual machine and a Windows license. Carpet Estimator Pro runs in any browser on a Mac with nothing to install.\r\n\r\n### How much does PlanSwift cost?\r\n\r\n$1,749 to $2,000 per user per year on annual subscription. It is sold per user, so a three-estimator crew is over $5,000 a year. Since ConstructConnect acquired PlanSwift, the old perpetual license is gone.\r\n\r\n### Is there a free PlanSwift alternative for Mac?\r\n\r\nYes. Carpet Estimator Pro has a free tier: on-screen takeoff with net area, strips, linear feet, square yards, accessories, and an interactive seam layout. Free users do not get PDF export. That starts at $19 a month.\r\n\r\n### Does Carpet Estimator Pro handle pattern match?\r\n\r\nYes. Choose plain, straight, or half-drop and enter the vertical repeat. Straight match rounds every cut up to the next full repeat. Half-drop pads the cut by 1.5 times the repeat. Pattern-match waste optimization is included on the annual plan.\r\n\r\n### Do I need to install anything?\r\n\r\nNo. Carpet Estimator Pro is a web app. Open the URL in any browser on your Mac, PC, phone, or tablet and it runs. No downloads, no updates to manage.\r\n\r\n### Can I export a client-ready quote?\r\n\r\nThe free tier is on-screen only. Unbranded PDF quotes start at $19 a month. The lifetime tier at $199 one-time gives you unwatermarked PDFs and all future updates.\r\n\r\n## Try It on Your Mac\r\n\r\nTake your next room off for free and see where the numbers land. The calculator runs in your browser: https://carpet-estimator-pro.vercel.app/\r\n\r\nWhen the takeoff matches the job and you want client-ready PDFs, the paid tiers start at $19 a month: https://carpet-estimator-pro.vercel.app/checkout\r\n"
  },
  "straight-match-vs-half-drop": {
    "slug": "straight-match-vs-half-drop",
    "title": "Straight Match vs Half Drop: Carpet Pattern Waste Math",
    "meta_title": "Straight Match vs Half Drop: Carpet Pattern Waste Math",
    "meta_description": "Straight match rounds every cut to a full pattern repeat; half-drop pads cuts by 1.5x. Worked waste math plus a free broadloom calculator.",
    "target_keywords": [
      "straight match vs half drop",
      "carpet pattern repeat calculator",
      "carpet waste factor",
      "half drop carpet",
      "broadloom pattern repeat"
    ],
    "date": "2026-08-01",
    "content": "\r\n# Straight Match vs Half Drop: What a Pattern Repeat Really Costs You\r\n\r\nQuote broadloom the way you quote tile — room area, add 10%, done — and you'll run short on the first patterned job you take. Broadloom doesn't order in square feet. It orders in strips cut from a roll, and every strip has to land on a full pattern repeat. That's the whole game, and it's why the same room can come out at 36.7 sq yd by flat math and 61.6 sq yd once the pattern is in the picture.\r\n\r\nHere's the straight match vs half drop question answered with numbers — what each pattern costs per cut, and how to price it before you run out.\r\n\r\n## What Straight Match and Half-Drop Actually Mean\r\n\r\n**Straight match** lines the pattern up at the same point across every seam. Strip two's motif sits at the same height as strip one's across the room. It's the most common residential setup and the cheapest patterned option — but every cut still has to end on a full repeat.\r\n\r\n**Half-drop** repeats diagonally: every alternating strip shifts half a repeat down so the motif lands in the gap between the motifs beside it — brick-laid, like wallpaper. It hides seams better on large geometrics, but the shift costs you.\r\n\r\n## The Two Rules That Do All the Work\r\n\r\nTrim allowance is 3–6 in (US) or 10 cm (UK), added to the room length.\r\n\r\n| Pattern | Cut length |\r\n|---|---|\r\n| Plain (no match) | room length + trim |\r\n| Straight match | round up (room length + trim) to next full repeat |\r\n| Half-drop | round up (room length + trim + 1.5 x repeat) to next full repeat |\r\n\r\nThe 1.5x padding covers half a repeat for the shift at the top of the alternating strip plus one full repeat at the bottom so the motif completes — 3 ft on a 2 ft repeat. And rounding up to a full repeat isn't optional: a seam cut between repeats doesn't match.\r\n\r\n## Worked Example 1 — Straight Match, 1.5 ft Repeat\r\n\r\nRoom: **20 ft long x 15 ft wide**. Roll: **12 ft**. Pattern: **straight match, 1.5 ft repeat**.\r\n\r\n**Step 1 — strips.** 15 ft of width on a 12 ft roll means two strips, no choice. The second strip is 12 ft wide for 9 ft of use — width waste flat math can't see.\r\n\r\n**Step 2 — cut length.** 20 ft + 6 in trim = 20.5 ft. Round up to a multiple of 1.5 ft: 13 repeats is 19.5 ft, not enough. 14 repeats = **21 ft per cut**. The pattern just added 1 ft per strip.\r\n\r\n**Step 3 — the tally.**\r\n- Naive flat calc: 20 x 15 = 300 sq ft = 33.3 sq yd, +10% = **36.7 sq yd ordered**\r\n- Correct broadloom calc: 2 strips x 21 ft x 12 ft = 504 sq ft = 56 sq yd, +10% = **61.6 sq yd ordered**\r\n\r\nThat's a **shortfall of ~25 sq yd (~46%)**. On mid-range broadloom at $30–40/sq yd installed, that's **$750–$1,000 per room** — or worse: run-out mid-job, a second roll from a different dye lot, and a seam the client finds for years.\r\n\r\n## Worked Example 2 — Half-Drop, 2 ft Repeat\r\n\r\nRoom: **16 ft long x 13 ft wide**. Roll: **12 ft**. Pattern: **half-drop, 2 ft repeat**.\r\n\r\n**Step 1 — strips.** 13 ft on a 12 ft roll = 2 strips — the second strip is 12 ft wide for 1 ft of use. Worst-case width, and a common bedroom size.\r\n\r\n**Step 2 — cut length.** 16 ft + 6 in trim = 16.5 ft. Half-drop padding = 1.5 x 2 ft = **3 ft**. 16.5 + 3 = 19.5 ft, round up to a multiple of 2 ft = **20 ft per cut**.\r\n\r\n**Step 3 — the tally.**\r\n- Half-drop: 2 strips x 20 ft = 40 lin ft = 53.3 sq yd, +15% patterned waste = **61.3 sq yd ordered**\r\n- Same room, straight match on the same 2 ft repeat: cut = 16.5 ft rounds up to 18 ft; 2 x 18 = 36 lin ft = 48 sq yd, +15% = **55.2 sq yd ordered**\r\n\r\nThe half-drop costs **6.1 sq yd more than straight match on the identical room — about $180–$245 at $30–40/sq yd**. Trust the naive flat calc (208 sq ft = 23.1 sq yd, +10% = 25.4 sq yd) and you're short ~36 sq yd — **59% of the real order**. Half-drop is the most expensive pattern decision you can make without checking the math.\r\n\r\n## Worked Example 3 — Roll Width Beats Pattern Waste\r\n\r\nRoom: **20 ft long x 14 ft wide**. Pattern: **straight match, 1.5 ft repeat**. Now the roll width is the decision.\r\n\r\n- **12 ft roll:** 14 ft of width = 2 strips. Cut = 21 ft. 2 x 21 = 42 lin ft = 56 sq yd, +10% = **61.6 sq yd ordered**\r\n- **15 ft roll:** 14 ft of width = 1 strip. Cut = 21 ft. 21 lin ft x 15 ft = 315 sq ft = 35 sq yd, +10% = **38.5 sq yd ordered**\r\n\r\nSame room, same pattern — the 15 ft roll cuts the order by **23.1 sq yd: 37% less carpet, $700–$900 saved** — by killing the second strip. Before you blame the pattern, check whether a wider roll eliminates the width waste. Pattern waste is per-cut; width waste is per-strip, and a strip costs more.\r\n\r\n## Pick the Right Waste Factor\r\n\r\nThe waste factor sits on top of the pattern penalty — the repeat rounding is already in your cut lengths, so don't double-count.\r\n\r\n| Waste factor | Use it for |\r\n|---|---|\r\n| 5% | Plain carpet, simple rectangles, no pattern |\r\n| 10% | Standard installs, minor cuts, doorways |\r\n| 15% | Patterned or complex layouts (L-shapes, angled walls) |\r\n| 20% | Heavy pattern plus irregular layout, multiple obstructions |\r\n\r\n## If the Pattern Is Eating You Alive, Switch to Tile\r\n\r\nWhen straight match costs a foot per cut and half-drop costs 1.5x the repeat, price carpet tile instead. Tile has no repeat constraint — every 2 ft x 2 ft module stands alone — so waste drops to 5–10% and you cut in place. The look and seam pattern change, and the client has to sign off — but on a heavily patterned room, tile often wins on material alone.\r\n\r\n## Don't Forget the Accessories\r\n\r\nThe carpet is the headline; the accessories are where estimates quietly bleed. Three formulas, all in the free calculator:\r\n\r\n- **Pad:** net area x 1.05 (270 sq ft rolls); the buffer covers trimming and seaming.\r\n- **Tackless/gripper:** perimeter minus doorway widths (4 lin ft battens).\r\n- **Seam tape:** (strips - 1) x room length x 1.10 (66 lin ft rolls); the 10% covers overlap at every seam.\r\n\r\n## FAQ\r\n\r\n**Q: What's the difference between straight match and half-drop?**\r\nA: Straight match lines the pattern up at the same point on every strip; half-drop shifts every alternating strip down half a repeat so the motif lands between the motifs beside it. Half-drop suits big geometries and costs more — 1.5x the repeat per cut.\r\n\r\n**Q: Why does half-drop cost more than straight match?**\r\nA: The shift: half a repeat extra at the top, plus a full repeat at the bottom — 1.5x the repeat per cut. On a 2 ft repeat that's 3 ft per cut; in the worked example above, 6.1 sq yd on one room.\r\n\r\n**Q: Do I really have to round every cut up to a full repeat?**\r\nA: Yes. A seam cut between repeats doesn't match — you'd see it, and so would the client. It's a hard constraint of the material, not a negotiable waste factor.\r\n\r\n**Q: What waste factor should I use?**\r\nA: 5% plain simple rooms, 10% standard, 15% patterned or complex, 20% heavy pattern plus irregular layout. Repeat rounding is separate from the waste factor — the calculator applies both, so don't stack a surcharge on top.\r\n\r\n**Q: Will a 15 ft roll save me money?**\r\nA: Often. A 12–15 ft room width on a 15 ft roll drops you from 2 strips to 1 — 37% less carpet in the third example. Check availability and price per sq yd first, but a wider roll usually wins.\r\n\r\n**Q: What's free in Carpet Estimator Pro?**\r\nA: Strips, cut lengths, lin ft, sq yd, seam layout, and accessory counts — free in the browser, no account, no credit card. The PDF proposal export is the paid tier: $19/mo, $149/yr (save 35%), or $199 lifetime on the checkout page.\r\n\r\n## Run the Numbers Before You Order\r\n\r\nThe rule, one more time: **broadloom orders in strips and repeats, not square feet.** If a showroom rep or a spreadsheet quotes flat area plus waste on a patterned carpet, ask to see the cut schedule.\r\n\r\n[Run the free calculator](https://carpet-estimator-pro.vercel.app/) — enter the room, roll width, pattern type, and vertical repeat, and get the strip count, cut lengths, yardage, and seam layout on screen in seconds.\r\n\r\nWhen you need the client-ready version, the [PDF proposal export](https://carpet-estimator-pro.vercel.app/checkout) turns that same takeoff into an itemized quote — carpet, pad, tackless, seam tape, labor, tax — on letter or A4. $19/mo, $149/yr, or $199 lifetime. And grab the [one-page pattern repeat cheat sheet](./flooring-estimators-pattern-repeat-cheat-sheet.md) — strip counts per roll width, penalty rules, and accessory formulas, ready to print and keep in the truck.\r\n"
  }
};

export function getAllSlugs(): string[] {
  return Object.keys(ARTICLES_DATA);
}

export function getArticleBySlug(slug: string): BlogPost | null {
  const data = ARTICLES_DATA[slug];
  if (!data) return null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": data.title,
    "description": data.meta_description,
    "datePublished": data.date,
    "dateModified": data.date,
    "author": { "@type": "Person", "name": "Carpet Estimator Pro" },
    "publisher": {
      "@type": "Organization",
      "name": "Carpet Estimator Pro",
      "url": "https://carpet-estimator-pro.vercel.app/"
    }
  };

  return {
    ...data,
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
