/**
 * Service definitions powering both the homepage scroller and the detail pages.
 *
 * Each service carries the copy for a full detail-page scaffold:
 *   hero → intro → stats → quote → deliverables grid → testimonials →
 *   core principles → closing CTA → cross-sell to the other services.
 *
 * Copy source: rough draft in Google Doc (2026-04-21).
 * TODO markers flag places where copy is still a placeholder or incomplete.
 */

export interface Deliverable {
  /** Short display name, e.g. "Pitch Decks" */
  name: string;
  /** Public path to the hand-drawn base icon */
  icon: string;
  /** Optional overlay PNG (yellow line layer) for hover reveal. */
  overlay?: string;
}

export interface TestimonialEntry {
  /** Client/company name, e.g. "Fiverr" */
  client: string;
  /** Approved quote. Omit for portfolio samples that carry no testimonial. */
  quote?: string;
  /** Optional logo path */
  logo?: string;
  /**
   * Work screenshot shown inside the yellow scribble frame. Portrait crop,
   * min 640×804 (2× the render box). Falls back to the empty frame.
   */
  image?: string;
  /**
   * One or two lines on what the work actually was. Renders with or without a
   * quote — it's what makes a sample-only card worth showing.
   */
  blurb?: string;
  /** Quote author. Omit alongside `quote` for sample-only entries. */
  author?: string;
  /**
   * Author's job title only, e.g. "Executive Director" — the template appends
   * `client` after it, so repeating the company here reads as a duplicate.
   */
  role?: string;
}

export interface Principle {
  title: string;
  /** One-liner kept for reference; the page doesn't render it. */
  tagline?: string;
  description: string;
}

export interface Service {
  slug: string;
  /** Display title in nav + cards */
  title: string;
  /**
   * Short label shown in the topbar nav tooltip (under each icon). Title is
   * usually too long to feel right at that size — e.g. "Brand Strategy"
   * reads as "Strategy" in the nav, "Pitch Decks" reads as "Presentations".
   * Falls back to `title` if not set.
   */
  navTooltip?: string;
  /** Multi-line hero headline (use `\n` for visual line breaks) — used on the homepage scroller */
  headline: string;
  /** Handwritten accent word — "confidence", "curiosity", "connection" */
  description: string;
  /**
   * Short descriptive title shown in the services-page Topbar next to the ✕ close button.
   * E.g. "Pitch decks, Presentations, and Collateral".
   */
  navTitle: string;
  /**
   * Short catchy hero headline for the detail page. A pun-like 1-2 word play on
   * the service name, e.g. "Pitch perfect.", "Brand perfect.", "Web perfect."
   * TODO: confirm final copy — currently following the Figma placeholder pattern.
   */
  heroTagline: string;
  /** Big hand-drawn artwork for the homepage scroller hero */
  heroImage: string;
  /** Theme color used across the detail page */
  accentColor: string;
  /**
   * Darker companion to `accentColor` for TEXT on light surfaces (lavender
   * #f2f1fa, cream #f7f5ee, white). Same hue, darkened just enough to meet
   * WCAG AA 4.5:1 for small text — the raw accents only reach 2.6–3.9:1.
   */
  accentText: string;
  /** Background color for the deliverables grid section. Defaults to the shared DARK value in the template. */
  deliverablesBg?: string;
  /** Longer-form intro paragraph shown below the hero headline */
  heroIntro: string;
  /** Stat tiles — 2-3 items. Values can be precise or approximate. */
  stats: { label: string; value: string }[];
  /** Pull-quote shown between intro and deliverables */
  quote: { text: string; attribution: string };
  /** Icon grid — target 6 items per service */
  deliverables: Deliverable[];
  /** Selected projects / testimonials — 3-4 entries */
  testimonials: TestimonialEntry[];
  /** Core principles — 6 items, numbered */
  principles: Principle[];
  /**
   * Noun used in the "Principles of the ___." heading. `title` reads wrong
   * there ("the Websites", "the Pitch Decks"), so each service names its own
   * singular form. Falls back to `title`.
   */
  principlesLabel?: string;
  /** One-line intro above the principles grid. */
  principlesIntro: string;
  /** CTA on the homepage card and at the bottom of the detail page */
  cta: { text: string; href: string };
  /** Slugs of the other 2 services to cross-sell at the bottom */
  relatedServices: string[];
  /**
   * Large hand-drawn artwork shown in the closing CTA section on the service
   * detail page. Should be a "reversed" variant of the hero artwork per the
   * Figma wireframe. Falls back to `heroImage` when not provided.
   */
  ctaArt?: string;
  /** If true, the ctaArt image is flipped horizontally and tinted blue via CSS. */
  ctaArtFlipped?: boolean;
  /** Copy for the closing CTA ("Curiosity piqued?" pattern). */
  closingCta: { title: string; body: string; button: string };
}

/* ─── Services ────────────────────────────────────────────────────────── */

export const services: Record<string, Service> = {
  "brand-strategy": {
    slug: "brand-strategy",
    title: "Brand Strategy",
    navTooltip: "Strategy",
    headline: "Creative strategy,\nbrand identity,\nand messaging",
    description: "confidence",
    navTitle: "Creative strategy, Brand identity, and Messaging",
    heroTagline: "Meaningful confidence.",
    heroImage: "/images/icons/branding.png",
    // #05A787 (vs. the original #05AB8A) is darkened ~2% so white headline
    // text on this background clears WCAG AA's 3:1 large-text minimum.
    accentColor: "#05A787",
    accentText: "#047D65",
    deliverablesBg: "#203C2B",
    heroIntro:
      "You have a story to tell. Your audience needs a reason to care. You don't need to be noisy to be noticed. If we start with a meaningful story, we'll end with a memorable brand.",
    stats: [
      { label: "Companies Named", value: "192" },
      { label: "Taglines Written", value: "2,148" },
      { label: "Pixels Perfected", value: "All of them" },
    ],
    quote: {
      text: "Confidence is key. If you don't believe in yourself, why should anyone else?",
      attribution: "RuPaul",
    },
    deliverables: [
      { name: "Creative Strategy", icon: "/images/icons/arrows.png" },
      { name: "Naming & Branding", icon: "/images/icons/crown.png" },
      { name: "Positioning & Ads", icon: "/images/icons/magnet.png" },
      { name: "Taglines & Messaging", icon: "/images/icons/speech.png" },
      { name: "Logos & Identity", icon: "/images/icons/stamp.png" },
      { name: "Projects & Campaigns", icon: "/images/icons/wireframes.png" },
    ],
    testimonials: [
      {
        client: "LGBTech",
        image: "/images/work/lgbtech.jpg",
        author: "Shachar Grembek",
        role: "Founder & Chair",
        quote:
          "Not only is Shai uniquely creative, he's also seriously methodical. He commits himself fully to our success, and is a joy to work with.",
      },
      {
        client: "WINN.AI",
        author: "Oren Hacohen",
        role: "Head of Growth",
        quote:
          "Shai helped us develop our brand and website from scratch. He had great ideas and a professional attitude. I couldn't be happier with the outcome.",
      },
      { client: "Clalit" },
      { client: "PointFive" },
    ],
    principlesLabel: "Brand",
    principlesIntro: "Six questions I ask on every brand build",
    principles: [
      {
        title: "Is it sticky?",
        description:
          "Will audiences remember the brand? What's its hook? What keeps it memorable?",
      },
      {
        title: "Is it relevant?",
        description:
          "What catches your audience's ear? Are the right people hearing you?",
      },
      {
        title: "Is it distinct?",
        description:
          "What does your voice add to the conversation? How does it reflect your brand's uniqueness?",
      },
      {
        title: "Is it meaningful?",
        description:
          "Does your story connect to something deeper? Is it human? What emotions does it poke?",
      },
      {
        title: "Is it timeless?",
        description:
          "Will the brand resonate in a year? In a decade? In a century?",
      },
      {
        title: "Is it scalable?",
        description:
          "Can your brand grow with your business? Can it shift and adapt as your story evolves?",
      },
    ],
    cta: { text: "Explore Brand Strategy", href: "/services/brand-strategy" },
    relatedServices: ["creative-direction", "digital-design"],
    ctaArt: "/images/icons/branding.png",
    closingCta: {
      title: "Confidence building?",
      body: "Tell me what success looks like to you, and let's imagine how your brand and creative strategies can get you there.",
      button: "Let's Connect",
    },
  },

  "creative-direction": {
    slug: "creative-direction",
    title: "Pitch Decks",
    navTooltip: "Presentations",
    headline: "Pitch decks,\npresentations,\nand collateral",
    description: "curiosity",
    navTitle: "Pitch decks, Presentations, and Collateral",
    heroTagline: "Pitch perfect.",
    heroImage: "/images/icons/presentations.png",
    accentColor: "#137FBF",
    accentText: "#1174AE",
    heroIntro:
      "You have a pitch. Your audience has a short attention span. What you don't put in the deck is just as important as what you do. Let's build a presentation that invites genuine curiosity.",
    stats: [
      { label: "Funds Raised", value: "Hundreds\nof Millions" },
      { label: "Slides Created", value: "At Least Ten\nThousand" },
      { label: "Transition Effects", value: "Never\nUse \u2018Em" },
    ],
    quote: {
      text: "The important thing is not to stop questioning. Curiosity has its own reason for existing.",
      attribution: "Albert Einstein",
    },
    deliverables: [
      { name: "Pitch Decks", icon: "/images/icons/decks.png" },
      { name: "Presentations", icon: "/images/icons/graph.png" },
      { name: "One-Pagers", icon: "/images/icons/doc.png" },
      { name: "Sales Decks", icon: "/images/icons/poster.png" },
      { name: "Storytelling", icon: "/images/icons/copy.png" },
      { name: "Infographics", icon: "/images/icons/chart.png" },
    ],
    testimonials: [
      {
        client: "bananaz",
        author: "Or Israel",
        role: "CEO",
        quote:
          "Shai quickly understood our vision, making adjustments on the fly and delivering content that not only aided in securing key investments but also elevated our branding. He felt like a true teammate throughout.",
      },
      {
        client: "Abe's Market",
        author: "Richard Demb",
        role: "Founder",
        quote:
          "My hesitation with recommending Shai is I want to be sure he still has time for my companies. I've worked with him over the past 10 years and he has consistently impressed me with how he can transform a conversation into a standout written and visual presentation.",
      },
      { client: "Tastewise" },
      { client: "SodaStream" },
    ],
    principlesLabel: "Pitch",
    principlesIntro: "Six questions I ask to make every deck sing",
    principles: [
      {
        title: "Does it flow?",
        description:
          "Is there a story, or just a sequence of slides? Does each slide earn the next one?",
      },
      {
        title: "Is it clear?",
        description:
          "Can they get each slide in three seconds? Does the design carry your point, or compete with it?",
      },
      {
        title: "Is it persuasive?",
        description:
          "What do you want them to do when the lights come on? Does every slide move them toward it?",
      },
      {
        title: "Is it concise?",
        description:
          "What can you cut? Are you leaving them wanting more, or wanting out?",
      },
      {
        title: "Is it engaging?",
        description:
          "Are they leaning in or checking their phones? What will they ask you afterwards?",
      },
      {
        title: "Is it credible?",
        description:
          "Do your numbers hold up? Will your projections survive the first hard question?",
      },
    ],
    cta: { text: "Explore Pitch Decks", href: "/services/creative-direction" },
    relatedServices: ["digital-design", "brand-strategy"],
    ctaArt: "/images/icons/presentations-new.png",
    closingCta: {
      title: "Curiosity piqued?",
      body: "Tell me who's in the room and what you need from them, and let's build the story that gets you a yes.",
      button: "Let's Connect",
    },
  },

  "digital-design": {
    slug: "digital-design",
    title: "Websites",
    navTooltip: "Websites",
    headline: "Websites,\nart direction,\nand product",
    description: "connection",
    navTitle: "Websites, Art direction, and Product",
    heroTagline: "Site specific.",
    heroImage: "/images/icons/artdirection.png",
    accentColor: "#F84267",
    accentText: "#C83553",
    deliverablesBg: "#6A0000",
    heroIntro:
      "You have a funnel. Your visitors have twenty other tabs open. People stay on a site that gets them. Let's build one that makes a real connection.",
    stats: [
      { label: "First Site Built", value: "in 1999" },
      { label: "Tools Used", value: "Dozens" },
      { label: "Pixels Perfected", value: "ALL THE PIXELS" },
    ],
    quote: {
      text: "Connection isn't a skill. It's a choice.",
      attribution: "Star Trek",
    },
    deliverables: [
      { name: "Art Direction", icon: "/images/icons/director.png" },
      { name: "Websites", icon: "/images/icons/screen.png" },
      { name: "Copywriting", icon: "/images/icons/text.png" },
      { name: "Project Management", icon: "/images/icons/clipboard.png" },
      { name: "Applications", icon: "/images/icons/select.png" },
      { name: "Wireframes", icon: "/images/icons/mockup.png" },
    ],
    testimonials: [
      {
        client: "BAMAH",
        author: "Flo Low",
        role: "Executive Director",
        quote:
          "Shai is the first person I want to collaborate with — his strategic mind and keen sense of visual design mean he's always thinking ahead on how to capture a brand's essence. Thanks to Shai, BAMAH not only has a beautiful website, we have a clearer understanding of how to talk about what we do.",
      },
      { client: "Fiverr" },
      { client: "Corpora" },
    ],
    principlesLabel: "Website",
    principlesIntro: "Six questions I ask before any site goes live",
    principles: [
      {
        title: "Is it intuitive?",
        description:
          "Can visitors find what they came for without thinking? Does it work the way they expect it to?",
      },
      {
        title: "Is it fast?",
        description:
          "Does it load before they reach for the back button? Does every page feel instant?",
      },
      {
        title: "Is it responsive?",
        description:
          "Is it just as good on a phone as on a big screen? What about on a slow train?",
      },
      {
        title: "Is it accessible?",
        description:
          "Can everyone use it, whatever their eyesight, device or connection?",
      },
      {
        title: "Does it convert?",
        description:
          "Does every page have a next step? Is it the one you want them to take?",
      },
      {
        title: "Is it measurable?",
        description:
          "Do you know what visitors do once they land? Can you tell which pages are earning their keep?",
      },
    ],
    cta: { text: "Explore Websites", href: "/services/digital-design" },
    relatedServices: ["brand-strategy", "creative-direction"],
    // ctaArt: TODO — export reversed Websites hero artwork from Figma
    closingCta: {
      title: "Ready to connect?",
      body: "Tell me who you want to reach and how you want them to feel, and let's build a site that'll make them click.",
      button: "Let's Connect",
    },
  },
};

export const servicesList = Object.values(services);
