# Startle Labs Website — Build Plan

## Context
Startle Labs is a branding/creative agency building a portfolio website. The Figma mockup (Startle Labs Wireframe) contains ~8+ desktop page designs with bold colors, project showcases, service pages, team/about content, testimonials, and FAQs. The visual inspiration is the Haze Framer template — fullscreen immersive sections with scroll-snap, dramatic transitions, and large imagery. Goal: launch a polished, animation-rich site in 3-4 weeks on Vercel's free tier.

---

## Tech Stack
- **Next.js 15** (App Router) — SSG for performance + SEO
- **TypeScript** — type safety
- **Tailwind CSS v4** — design system mapped from Figma tokens
- **Framer Motion** — scroll animations, page transitions, parallax
- **Vercel** — hosting + CI/CD from git

---

## Site Architecture

### Pages
```
/                   → Homepage (fullscreen hero + scroll-snap sections)
/services/[slug]    → Service pages (templated — 3 services, 1 component)
/work               → Portfolio/case studies grid
/work/[slug]        → Individual case study (templated)
/about              → About / team page
/contact            → Contact page (if in mockup)
```

### Project Structure
```
src/
├── app/
│   ├── layout.tsx              ← Root layout (nav, footer, page transitions)
│   ├── page.tsx                ← Homepage
│   ├── services/
│   │   └── [slug]/
│   │       └── page.tsx        ← Service template page
│   ├── work/
│   │   ├── page.tsx            ← Portfolio grid
│   │   └── [slug]/
│   │       └── page.tsx        ← Case study template
│   ├── about/
│   │   └── page.tsx
│   └── contact/
│       └── page.tsx
├── components/
│   ├── layout/
│   │   ├── Navigation.tsx      ← Hamburger menu overlay (Haze-style)
│   │   ├── Footer.tsx
│   │   └── PageTransition.tsx  ← Framer Motion page wrapper
│   ├── sections/               ← Reusable fullscreen sections
│   │   ├── HeroSection.tsx
│   │   ├── StatsSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── FAQSection.tsx
│   │   └── CTASection.tsx
│   ├── ui/                     ← Shared UI primitives
│   │   ├── Button.tsx
│   │   ├── ScrollProgress.tsx  ← Dot/progress nav (Haze-style)
│   │   └── AnimatedText.tsx    ← Text reveal animations
│   └── templates/
│       ├── ServicePageTemplate.tsx  ← Shared service page layout
│       └── CaseStudyTemplate.tsx   ← Shared case study layout
├── data/
│   ├── services.ts             ← Service page content (copy, stats, images)
│   ├── projects.ts             ← Case study content
│   └── team.ts                 ← Team member data
├── lib/
│   ├── animations.ts           ← Shared Framer Motion variants
│   └── utils.ts
└── styles/
    └── globals.css             ← Tailwind base + custom fonts
```

---

## Templating System (Service Pages)

The 3 service pages share a single `ServicePageTemplate` component. Content is driven by a data file:

```ts
// data/services.ts
export const services = {
  "brand-strategy": {
    slug: "brand-strategy",
    title: "Brand Strategy",
    headline: "...",
    description: "...",
    heroImage: "/images/services/brand-strategy-hero.png",
    accentColor: "#...",       // per-service color accent
    stats: [{ label: "...", value: "..." }],
    features: [...],
    testimonial: { quote: "...", author: "..." },
    cta: { text: "...", href: "..." }
  },
  // ... repeat for other services
}
```

The dynamic route `/services/[slug]/page.tsx` looks up the data by slug and passes it to `ServicePageTemplate`. Adding a 4th service = adding an object to the data file. Same pattern for case studies.

---

## Animation Strategy (Haze-Level)

### Homepage
- **Scroll-snap sections** — each section is `100vh`, snaps into place
- **Dot/progress navigation** — fixed sidebar dots showing current section
- **Hero text reveal** — words animate in sequentially on load
- **Background parallax** — images shift at different scroll speeds
- **Section transitions** — crossfade/slide between fullscreen sections

### Global
- **Page transitions** — Framer Motion `AnimatePresence` wrapping route changes (fade + slide)
- **Navigation overlay** — fullscreen menu slides in from right, links stagger-animate in
- **Scroll-triggered entrances** — elements fade/slide up as they enter viewport (using `useInView`)
- **Hover interactions** — buttons scale, project cards lift with shadow, images zoom subtly
- **Cursor effects** — optional custom cursor on project hover (stretch goal)

### Shared Animation Variants
All animation configs live in `lib/animations.ts` for consistency:
- `fadeInUp`, `fadeIn`, `staggerContainer`, `slideInFromRight`, `scaleOnHover`, `parallaxY`

---

## Design System (from Figma)

### Setup from Figma palette
- Extract exact hex values from the color strip in Figma (greens, blues, pinks, oranges, reds, teals)
- Map to Tailwind `theme.extend.colors` with semantic names (`brand.primary`, `brand.accent`, etc.)
- Extract typography (font family, sizes, weights) from the mockup frames
- Define spacing scale matching Figma's grid

### Tailwind Config
```ts
// tailwind.config.ts
{
  theme: {
    extend: {
      colors: {
        brand: { primary, secondary, accent, ... },
        surface: { dark, light, muted, ... }
      },
      fontFamily: {
        heading: ['...'],
        body: ['...']
      }
    }
  }
}
```

---

## Build Phases

### Phase 1: Foundation (Week 1)
1. Scaffold Next.js 15 project with TypeScript + Tailwind + Framer Motion
2. Set up design system in Tailwind config (colors, fonts, spacing from Figma)
3. Build root layout with `PageTransition` wrapper
4. Build `Navigation` component (hamburger overlay, Haze-style)
5. Build shared animation variants in `lib/animations.ts`
6. Build UI primitives: `Button`, `AnimatedText`, `ScrollProgress`

### Phase 2: Core Pages (Week 2)
1. Build Homepage with fullscreen scroll-snap sections (hero, services overview, featured work, testimonials, CTA)
2. Build `ServicePageTemplate` and populate data for all 3 services
3. Build About page with team section
4. Build Work/portfolio grid page
5. Build `CaseStudyTemplate` and at least 1-2 case studies

### Phase 3: Animation + Polish (Week 3)
1. Implement scroll-triggered animations across all pages
2. Add page transition animations between routes
3. Add parallax effects to hero/project images
4. Add hover interactions (buttons, cards, images)
5. Fine-tune scroll-snap behavior and timing
6. Add loading/intro animation

### Phase 4: Responsive + Launch (Week 4)
1. Responsive breakpoints (mobile, tablet, desktop)
2. Mobile navigation (touch-friendly)
3. Performance optimization (image optimization, lazy loading, bundle analysis)
4. SEO meta tags + Open Graph
5. Deploy to Vercel
6. Domain setup

---

## CMS-Ready Architecture

Even without a CMS now, the data-driven approach means adding one later is straightforward:
- Replace `data/services.ts` with CMS API calls
- Replace `data/projects.ts` with CMS API calls
- Page templates stay identical
- Recommended future CMS: **Sanity** (generous free tier, great with Next.js) or **MDX files** for a simpler approach

---

## Verification / Testing

- `npm run dev` — local development with hot reload
- Preview deployments on every git push (Vercel)
- Lighthouse audit targeting 90+ performance score
- Test responsive layouts at mobile (375px), tablet (768px), desktop (1440px)
- Test animations at 60fps (Chrome DevTools Performance tab)
- Cross-browser check: Chrome, Safari, Firefox

