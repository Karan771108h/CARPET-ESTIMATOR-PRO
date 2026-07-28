# UI Context

## Theme
Light mode only. The design language is a clean, professional, high-contrast technical workspace. Estimators will use this on-site on mobile devices in varying lighting conditions, so contrast and readability are more important than dark aesthetics.

## Colors
| Role | CSS Variable | Value |
|---|---|---|
| Page background | `--bg-base` | `#F8FAFC` (Slate 50) |
| Surface | `--bg-surface` | `#FFFFFF` |
| Primary text | `--text-primary` | `#0F172A` (Slate 900) |
| Muted text | `--text-muted` | `#64748B` (Slate 500) |
| Primary accent | `--accent-primary` | `#2563EB` (Blue 600) |
| Border | `--border-default` | `#E2E8F0` (Slate 200) |
| Error | `--state-error` | `#DC2626` (Red 600) |
| Success | `--state-success` | `#16A34A` (Green 600) |

## Typography
| Role | Font | Variable |
|---|---|---|
| UI text | Inter | `--font-sans` |
| Numbers/Math | Geist Mono | `--font-mono` |

## Border Radius
| Context | Class |
|---|---|
| Inline / small UI | `rounded-md` |
| Cards / panels | `rounded-xl` |
| Buttons / inputs | `rounded-lg` |

## Component Library
`shadcn/ui` on top of Tailwind. Components live in `components/ui/`. Use the CLI to add new components rather than writing from scratch.

## Layout Patterns
- **Mobile-First Flow**: Single column layout. Users scroll down step-by-step: 1. Room Details -> 2. Carpet Specs -> 3. Results.
- **Sticky Bottom Bar**: On mobile, a sticky bar at the bottom displays the "Total Carpet Required" and the "Generate PDF" button.
- **Cards**: Input sections (Room, Carpet) should be contained in white surface cards with subtle borders.
- **Modals**: License key entry prompt should be a centered overlay with backdrop blur.

## Icons
Lucide React. Stroke-based icons only. Sizes: `h-4 w-4` for inline, `h-5 w-5` for buttons and form labels.
