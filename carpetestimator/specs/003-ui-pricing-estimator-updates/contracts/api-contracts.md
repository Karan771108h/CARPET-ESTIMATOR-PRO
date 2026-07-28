# Interface & Component Contracts

## 1. License Verification API Contract

**Endpoint**: `POST /api/verify-license`

**Request Body**:
```json
{
  "licenseKey": "string"
}
```

**Response (Success 200)**:
```json
{
  "valid": true,
  "licenseKey": "string",
  "expiresAt": null
}
```
Set-Cookie header: `estimating_session=<jwt>; HttpOnly; Secure; SameSite=Strict; Path=/`

**Response (Failure 400/401)**:
```json
{
  "valid": false,
  "error": "Invalid or expired license key"
}
```

---

## 2. SVG Visualizer Component Contract (`ProposalPDF.tsx`)

```typescript
export interface RoomVisualizerProps {
  sections: RoomSection[];
  rollWidth: number;
  unitSystem: 'us' | 'uk';
  widthPx?: number;
  heightPx?: number;
}
```

Output: Valid inline SVG string or element rendering rectangular room section outlines and dashed seam placement lines according to roll width.
