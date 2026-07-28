# Carpet Estimator Pro

## Overview
A mobile-responsive, math-heavy web application designed for professional carpet estimators and fitters in the US, UK, Canada, and Australia. It bridges the gap between "dumb" free online calculators that ignore roll-width geometry, and bloated enterprise CAD software. The app calculates exact broadloom strip allocations, pattern repeat penalties, seam placements, and accessory materials. It operates entirely serverless with zero database costs, gating premium features (like client-facing PDF exports) behind stateless Gumroad license validation.

## Goals
1. Provide exact strip allocation and cutting lengths based on standard roll widths (12/15ft for US, 4/5m for UK).
2. Accurately calculate material penalties for straight match and half-drop pattern repeats.
3. Automatically calculate accessory materials (pad, tackless strips/gripper rods, seam tape).
4. Allow estimators to generate itemized, professional PDF proposals on-site directly from their mobile device.
5. Validate one-time Gumroad license keys using a 100% database-free, stateless JWT architecture.

## Core User Flow
1. User opens the web app on a mobile browser on-site.
2. User selects regional standard (US Imperial or UK Metric).
3. User inputs room dimensions (Length x Width, supporting L-shapes via rectangular decomposition).
4. User inputs carpet specs: Roll Width, Pattern Match Type (None, Straight, Half-Drop), Vertical Repeat, and Waste Factor %.
5. App instantly calculates and displays raw installation numbers: Number of strips, cut lengths, total linear footage/yardage, seam locations, and accessory counts.
6. (Premium) User clicks "Generate PDF Proposal" -> Client-side library compiles data into printable PDF.

## Features
### Estimation Engine
- Regional unit selection (US: ft/yd/sq yd; UK: m/sqm).
- Net floor area calculation supporting complex layouts via rectangular polygon decomposition.
- Broadloom strip allocation using ceiling math against fixed roll widths.
- Trim allowance calculation (3-6 inches US, 10cm UK).
- Pattern repeat alignment logic (Straight Match and Half-Drop Match).
- Construction waste factor application (5% to 20%+ based on complexity).

### Accessories Calculation
- Carpet pad/underlay area (Net Area + 5% buffer, divided by roll size).
- Tackless strips/gripper rods (Perimeter minus doorways).
- Hot-melt seam tape (Total seam length + 10% overlap).

### Monetization & Output
- Free tier: Raw calculation numbers only.
- Premium tier: Itemized PDF quote generation (client-facing).
- Gumroad license key verification API.

## Scope
### In Scope
- Next.js App Router deployment on Vercel free tier.
- Client-side mathematical processing via React state.
- Gumroad API integration via Next.js Edge Functions.
- Client-side PDF generation via `jspdf` and `html2canvas`.
- Mobile-first, responsive UI.

### Out of Scope
- 3D CAD modeling or visual floorplan drawing tools.
- Built-in CRM, inventory management, or scheduling.
- Server-side database for user management (using stateless JWT only).
- Multi-user team collaboration.

## Success Criteria
1. US Imperial Case Study: 20x15ft room, 12ft roll, 1.5ft straight pattern repeat -> Outputs exactly 2 strips, 21ft matched cuts, 61.6 sq yds total order.
2. UK Metric Case Study: L-shape room, 4m roll, 0.4m repeat -> Outputs exactly 35.84 sqm.
3. User enters Gumroad license key, receives secure HTTP-only cookie, successfully generates PDF.
4. 100% database-free, runs on free hosting tiers.
