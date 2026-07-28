# Quickstart & Validation Guide

## Runnable Verification Scenario: Multi-Section Guillotine Nesting

### Input Test Case
- **Section 1**: 12 ft wide × 20 ft long ($W=12, L=20$)
- **Section 2**: 3 ft wide × 10 ft long ($W=3, L=10$) -> should nest inside Section 1's side off-cut ($W_{\text{rem}}=3$ ft, $L_{\text{rem}}=20$ ft)!
- **Roll Width**: 15 ft
- **Bleed Allowance**: 0.25 ft (0.5 ft total length addition)

### Execution Command
```bash
npx tsx __tests__/two-stage-optimizer.test.ts
```

### Expected Behavior
1. **Section 1** is placed on main roll ($L_{\text{cut}} = 20.5$ ft). Side off-cut remnant generated: $W_{\text{rem}} = 15 - 12 = 3$ ft, $L_{\text{rem}} = 20.5$ ft.
2. **Section 2** ($W_{\text{cut}} = 3$ ft, $L_{\text{cut}} = 10.5$ ft) fits inside Section 1's side off-cut ($3 \times 20.5$).
3. **Outcome**: Section 2 is **nested** inside Section 1's side off-cut. No additional master roll length pulled for Section 2! Total roll length = **20.5 linear feet**.
