# Quickstart & Validation Guide

## Runnable Verification Scenario: PDF Stepped L-Shape Benchmark

### Input Benchmark
- **Section 1**: 15 ft wide × 20 ft long ($X \in [0, 15], Y \in [0, 20]$).
- **Section 2**: 15 ft wide × 25 ft long ($X \in [15, 30], Y \in [0, 25]$).
- **Roll Width**: 15 ft.
- **Pattern**: $R_y = 3$ ft, Straight Match.
- **Bleed**: $L_{\text{bleed}} = 0.25$ ft per end ($0.5$ ft total addition per cut).

### Execution Command
```bash
npm test
```

### Expected Benchmark Results
| Metric | Naive Legacy Method | New Takeoff Engine | Savings / Delta |
|---|---|---|---|
| **Strip 1 Roll Range** | [2.75 ft, 28.25 ft] | [2.75 ft, 23.25 ft] | Localized length: 20.5 ft raw cut |
| **Strip 2 Roll Range** | [29.75 ft, 55.25 ft] | [23.75 ft, 49.25 ft] | Localized length: 25.5 ft raw cut |
| **Total Linear Usage** | **55.25 ft** | **49.25 ft** | **6.0 linear ft saved** |
| **Square Footage** | 828.75 sq ft | 738.75 sq ft | **90.0 sq ft saved (10.0 sq yd)** |
| **Financial Impact ($45/sq yd)** | $4,143.75 | $3,693.75 | **$450.00 saved (10.86% cost reduction)** |
