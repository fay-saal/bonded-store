# 📜 Project Constitution — Bonded Bazar

> **This file is LAW.** All schemas, rules, and architectural invariants live here.  
> Only update when: a schema changes, a rule is added, or architecture is modified.  
> **Last Updated:** 2026-07-30

---

## 1. Data Schemas

### Product Schema (Input — Static Catalog)
```json
{
  "id": "string",
  "name": "string",
  "category": "streaming | gaming | social | utility",
  "description": "string",
  "price": {
    "amount": "number",
    "currency": "BDT",
    "display": "string (e.g. '৳850')"
  },
  "icon": "string (SVG inline or emoji fallback)",
  "badge": "string | null (e.g. 'Popular', 'New')",
  "available": "boolean"
}
```

### Product Grid Schema (Output — Rendered)
```json
{
  "categories": [
    {
      "slug": "string",
      "label": "string",
      "products": ["Product[]"]
    }
  ],
  "howItWorks": [
    { "step": "number", "title": "string", "description": "string", "icon": "string" }
  ],
  "trustSignals": [
    { "icon": "string", "title": "string", "description": "string" }
  ]
}
```

---

## 2. Behavioral Rules

1. **Tone:** International, minimal, confident — premium tech brand voice
2. **Language:** English only, no regional slang
3. **DO NOT:** Use neon/gamer aesthetic, emoji-heavy copy, cluttered layouts, casual fonts
4. **DO NOT:** Use placeholder images — generate or use SVG/CSS-based icons
5. **Prices:** Display in BDT (৳) — always show currency symbol before amount
6. **CTAs:** Clear, single-action ("Buy Now", "Browse Store") — no ambiguity
7. **Responsiveness:** Must work on mobile (primary user base uses bKash on mobile)

---

## 3. Architectural Invariants

- **Layer 1 (Architecture):** SOPs in `architecture/` — updated BEFORE code changes.
- **Layer 2 (Navigation):** Reasoning & routing — no complex logic executed directly.
- **Layer 3 (Tools):** Deterministic scripts — atomic and testable.
- **Intermediates** go in `.tmp/` — ephemeral and deletable.
- **Credentials** live in `.env` — never hardcoded.
- **Frontend:** Static HTML/CSS/JS — no framework dependency for the storefront.

---

## 4. Integration Registry

| Service | Status | Key Location |
|---------|--------|-------------|
| Discord (community link) | ✅ Static link | N/A |
| bKash (payment info) | ℹ️ Informational | N/A |
| Social links | ✅ Static links | N/A |

---

## 5. Maintenance Log

_Will be populated during Trigger phase._
