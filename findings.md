# 🔍 Findings — Bonded Bazar

> **Purpose:** Research, discoveries, constraints, and gotchas collected during development.  
> **Last Updated:** 2026-07-30

---

## Discovery Phase — ANSWERED ✅

### 1. North Star
A **premium, dark-themed e-commerce storefront** called "BONDED" for digital gift-code products (streaming subscriptions, Discord Nitro, similar official gift codes). Must feel international, high-end, and trustworthy — not a typical Discord shop template.

### 2. Integrations
- **Payment:** bKash / mobile banking (informational flow — no live API integration specified yet)
- **Community:** Discord server link
- **Social:** Social media links in footer
- No backend API or database integration at this stage — static storefront.

### 3. Source of Truth
- Product catalog is static (defined in code/data file)
- Categories: Streaming subscriptions, Discord Nitro, and similar gift codes
- Products have: icon/logo, name, price, "Buy Now" CTA

### 4. Delivery Payload
- A web-based storefront (HTML/CSS/JS)
- Single-page design with sections: Hero → Products → How It Works → Trust → Footer

### 5. Behavioral Rules
- **Tone:** International, minimal, confident
- **Do NOT:** Use clutter, neon-gamer aesthetic, emoji-heavy copy, casual gaming fonts
- **Language:** English throughout
- **Brand Feel:** Luxury tech brand — think premium, not playful

---

## Visual Design System

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#0a0a0f` | Deep black base |
| `--accent-primary` | `#2d4fff` | Electric/royal blue — light end |
| `--accent-deep` | `#1a2eb8` | Royal blue — dark end |
| `--glow` | `rgba(45, 79, 255, 0.15–0.4)` | Blue glow effects |
| `--glass-bg` | `rgba(255, 255, 255, 0.03–0.06)` | Frosted glass cards |
| `--glass-border` | `rgba(45, 79, 255, 0.2)` | Glass card borders |
| `--text-primary` | `#ffffff` | Headings |
| `--text-secondary` | `#8a8a9a` | Body/muted text |

### Typography
- **Headings:** Premium display serif or modern geometric sans-serif (bold, wide letter-spacing, all-caps for brand)
- **Body:** Clean readable sans-serif
- **Reference:** Luxury tech brand aesthetic

### Visual Effects
- Topographic/wave line textures on background
- Soft radial glow behind hero content
- Ornamental corner flourishes (used sparingly)
- Glassmorphism/frosted-glass cards
- Blue border glow on hover
- Micro-animations: fade-ins, subtle parallax, glow pulse on CTAs

---

## Constraints
- No framework required — vanilla HTML/CSS/JS is sufficient for a static storefront
- Must be responsive (mobile-first for the bKash user demographic)
- Performance: minimal dependencies, fast load times
- No backend — product data is static JSON embedded in JS
