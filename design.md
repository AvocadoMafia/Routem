# Design System

## Philosophy
Vivid but precise. Two accent colors — warm coral and cold cyan — create tension that keeps the interface alive.
Dark and light modes are equal citizens; neither is an afterthought.

---

## Color Tokens

```css
/* Light mode */
.light {
    --background-0: #f8f9ff;   /* page background */
    --background-1: #ffffff;   /* surface (card, modal) */
    --foreground-0: #48484e;   /* primary text */
    --foreground-1: #63636e;   /* secondary text, labels */
    --accent-0: #ff6363;       /* primary CTA, highlights */
    --accent-1: #0cecfa;       /* secondary accent, links, tags */
    --grass: #e6e8ed;          /* dividers, subtle fills */
    --accent-warning: #fb123e; /* errors, destructive actions */
}

/* Dark mode */
.dark {
    --background-0: #292929;
    --background-1: #232323;
    --foreground-0: #ededed;
    --foreground-1: #aeaeae;
    --accent-0: #ff6363;
    --accent-1: #0cecfa;
    --grass: #474747;
    --accent-warning: #fb123e;
}

/* Reversed surface (dark card inside light page, or vice versa) */
.theme-reversed {
    --background-1: #232323;
    --background-0: #292929;
    --foreground-0: #ededed;
    --foreground-1: #aeaeae;
    --accent-0: #ff6363;
    --accent-1: #0cecfa;
    --grass: #474747;
    --accent-warning: #fb123e;
}
```

### Usage Rules
- `--background-0`: page/canvas background only
- `--background-1`: surfaces that sit on background-0 (cards, inputs, modals)
- `--foreground-0`: headings and primary body copy
- `--foreground-1`: metadata, placeholder text, captions
- `--accent-0` (#ff6363): one dominant CTA per screen maximum; hover = 10% darker
- `--accent-1` (#0cecfa): links, active states, badges, progress indicators
- `--grass`: borders, dividers, skeleton loaders — never text
- `--accent-warning`: errors and destructive states only; never decorative

---

## Typography

- **Font family**: Inter (fallback: -apple-system, BlinkMacSystemFont, sans-serif)
- **Mono**: JetBrains Mono (fallback: monospace) — code, tags, timestamps

| Role         | Size  | Weight | Line height | Letter spacing |
|--------------|-------|--------|-------------|----------------|
| Display      | 48px  | 700    | 1.1         | -0.02em        |
| Heading 1    | 32px  | 700    | 1.2         | -0.01em        |
| Heading 2    | 24px  | 600    | 1.3         | 0              |
| Heading 3    | 18px  | 600    | 1.4         | 0              |
| Body         | 16px  | 400    | 1.6         | 0              |
| Small        | 14px  | 400    | 1.5         | 0              |
| Caption/Mono | 12px  | 400    | 1.4         | 0.01em         |

### Rules
- Never mix more than 2 weights on a single screen
- Accent-colored text (`--accent-0` or `--accent-1`) only for interactive elements
- `--foreground-0` for headings; `--foreground-1` for supporting text

---

## Spacing

Base unit: **8px**

| Token | Value | Use |
|-------|-------|-----|
| xs    | 4px   | icon gaps, tight inline spacing |
| sm    | 8px   | component internal padding |
| md    | 16px  | card padding, form gaps |
| lg    | 24px  | section internal spacing |
| xl    | 40px  | between major sections |
| 2xl   | 80px  | page-level vertical rhythm |

---

## Shape & Elevation

- **Border radius**: 8px (default) / 12px (cards) / 999px (pills/badges)
- **Border**: 1px solid `var(--grass)` — use instead of shadow where possible
- **Shadow** (dark surfaces on light bg only):
  ```
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 0 1px rgba(0, 0, 0, 0.08);
  ```
- No shadow in dark mode — rely on `background-1` vs `background-0` contrast

---

## Components

### Button
```
Primary:   bg=accent-0, text=white, radius=8px, height=40px, px=20px
Secondary: bg=transparent, border=1px grass, text=foreground-0
Ghost:     bg=transparent, text=accent-1, no border
Danger:    bg=accent-warning, text=white
Disabled:  opacity: 0.4, cursor: not-allowed
```
- Minimum touch target: 44px
- Icon buttons: 40×40px, icon 20px

### Input / Form
```
bg: background-1
border: 1px solid var(--grass)
border-focus: 1px solid var(--accent-1)
text: foreground-0
placeholder: foreground-1
radius: 8px, height: 40px, px: 12px
error-border: accent-warning
```

### Card
```
bg: background-1
border: 1px solid var(--grass)
radius: 12px
padding: 20px
```
- Use `.theme-reversed` on a card to create contrast sections (hero callouts, feature blocks)

### Badge / Tag
```
bg: accent-1 at 12% opacity
text: accent-1
radius: 999px
font: 12px mono, uppercase, 0.06em tracking
px: 8px, py: 3px
```

### Divider
```
border: 1px solid var(--grass)
```
No decorative dividers — use spacing first; divider only when visual separation is essential.

---

## Motion

- **Easing**: `cubic-bezier(0.22, 1, 0.36, 1)` (snappy out)
- **Duration**:
  - Micro (hover, focus): 120ms
  - Element transitions: 220ms
  - Page / modal entry: 320ms
- **Hover lift** (cards): `transform: translateY(-2px)` + shadow increase
- **Accent glow** (optional, use sparingly):
  ```css
  box-shadow: 0 0 12px rgba(12, 236, 250, 0.35); /* accent-1 */
  ```
- No bounce, no spring physics — keep motion purposeful

---

## Do / Don't

| Do | Don't |
|----|-------|
| Use `--grass` for structural lines | Use `--accent-warning` for anything non-error |
| Pair `accent-0` and `accent-1` for contrast | Use both accents on the same element |
| Let background-0 / background-1 create depth | Add heavy shadows in dark mode |
| Use mono font for data, timestamps, codes | Use decorative fonts |
| Default to spacing over dividers | Add borders everywhere "just in case" |
