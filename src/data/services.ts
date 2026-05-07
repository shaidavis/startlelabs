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
  /** Optional long-form quote. Placeholder until approved copy lands. */
  quote?: string;
  /** Optional logo path */
  logo?: string;
}

export interface Principle {
  title: string;
  tagline: string;
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
  /** Copy for the closing CTA ("Curiosity piqued?" pattern). */
  closingCta: { title: string; body: string; button: string };
}

/* ─── Shared placeholders ─────────────────────────────────────────────── */

const PLACEHOLDER_QUOTE = "Placeholder testimonial — real copy coming soon.";

/* ─── Services ────────────────────────────────────────────────────────── */

export const services: Record<string, Service> = {
  "brand-strategy": {
    slug: "brand-strategy",
    title: "Brand Strategy",
    navTooltip: "Strategy",
    headline: "Creative strategy\nbrand identity,\nand messaging",
    description: "confidence",
    navTitle: "Creative strategy, Brand identity, and Messaging",
    heroTagline: "Creative Solutions",
    heroImage: "/images/icons/branding.png",
    accentColor: "#05AB8A",
    deliverablesBg: "#203C2B",
    heroIntro:
      "Your brand is the face of your business. It needs to exude confidence, setting the tone for how your market perceives you. Just like wearing your best outfit, your brand should make you feel unstoppable, ready to engage with customers and stand out from competitors. When your brand looks and feels right, you walk into any room (or market) with swagger.",
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
      { name: "Storyboards", icon: "/images/icons/wireframes.png" },
    ],
    testimonials: [
      { client: "Clalit", quote: PLACEHOLDER_QUOTE },
      { client: "Corpora", quote: PLACEHOLDER_QUOTE },
      { client: "PointFive", quote: PLACEHOLDER_QUOTE },
    ],
    principles: [
      {
        title: "Memorability",
        tagline: "A brand that's easily recognized and remembered has staying power.",
        description:
          "We ensure your brand leaves a lasting impression that sticks with your audience long after the first encounter.",
      },
      {
        title: "Relevance",
        tagline: "A strong brand speaks directly to the needs and aspirations of its target audience.",
        description:
          "We craft brands that connect deeply with your market, making sure you resonate with the right people.",
      },
      {
        title: "Distinctiveness",
        tagline: "Standing out in a crowded market is key to being noticed.",
        description:
          "We design brands that differentiate you from competitors and position you as unique in your space.",
      },
      {
        title: "Resonance",
        tagline: "Great brands evoke feelings that create deeper customer connections.",
        description:
          "We focus on building brands that spark emotions and foster loyalty through authentic storytelling.",
      },
      {
        title: "Timelessness",
        tagline: "Your brand should endure, growing stronger over time.",
        description:
          "We create brands that can evolve with your business without feeling outdated or tied to fleeting trends.",
      },
      {
        title: "Scalability",
        tagline: "Your brand must be flexible enough to grow alongside your business.",
        description:
          "We develop brands that can expand across platforms and markets while maintaining a cohesive identity.",
      },
    ],
    cta: { text: "Explore Brand Strategy", href: "/services/brand-strategy" },
    relatedServices: ["creative-direction", "digital-design"],
    ctaArt: "/images/icons/branding.png",
    closingCta: {
      title: "Confidence building?",
      body: "Placeholder body — real closing copy coming soon.",
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
    heroIntro:
      "Your pitch deck isn't just about presenting facts—it's about sparking curiosity. You need to make your investors or audience lean in, asking for more. When your message is compelling and thought-provoking, it ignites curiosity, pushing them to want to explore your vision and become part of your journey. It's not just what you show; it's what they want to learn next.",
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
      { client: "Bananaz", quote: PLACEHOLDER_QUOTE },
      { client: "Naboo", quote: PLACEHOLDER_QUOTE },
      { client: "Tastewise", quote: PLACEHOLDER_QUOTE },
      { client: "SodaStream", quote: PLACEHOLDER_QUOTE },
    ],
    principles: [
      {
        title: "Narrative Flow",
        tagline: "A great presentation tells a compelling story, not just a sequence of slides.",
        description:
          "We ensure every pitch deck has a clear, engaging storyline that guides your audience effortlessly from start to finish.",
      },
      {
        title: "Visual Clarity",
        tagline: "Visuals should enhance your message, not distract from it.",
        description:
          "We prioritize clear, impactful design that supports your key points, ensuring investors focus on your message.",
      },
      {
        title: "Persuasion",
        tagline: "Every slide should compel action or inspire confidence.",
        description:
          "We craft presentations that make investors eager to learn more, encouraging them to take the next step with you.",
      },
      {
        title: "Brevity",
        tagline: "Less is more—say enough to captivate, but leave them wanting more.",
        description:
          "We refine your message to its essentials, keeping the content concise yet powerful.",
      },
      {
        title: "Engagement",
        tagline: "Investors should feel intrigued and involved, not just informed.",
        description:
          "We create presentations that foster dialogue, encouraging curiosity and interaction from the audience.",
      },
      {
        title: "Credibility",
        tagline: "Your deck should make investors feel secure in your vision.",
        description:
          "We emphasize data, facts, and realistic projections that build trust and make investors confident in your business.",
      },
    ],
    cta: { text: "Explore Pitch Decks", href: "/services/creative-direction" },
    relatedServices: ["digital-design", "brand-strategy"],
    ctaArt: "/images/icons/presentations-hero-alt.svg",
    closingCta: {
      title: "Curiosity piqued?",
      body: "Placeholder body — real closing copy coming soon.",
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
    heroTagline: "Web perfect.",
    heroImage: "/images/icons/artdirection.png",
    accentColor: "#F84267",
    deliverablesBg: "#6A0000",
    heroIntro:
      "Your website is where your brand builds meaningful connections. It's more than just a digital presence—it's a space where your audience should feel immediately at home. When done right, your website creates a lasting bond, making visitors feel like they've found what they've been looking for, fostering engagement, loyalty, and trust.",
    stats: [
      { label: "First Site Built", value: "in 1999" },
      { label: "Tools Used", value: "Dozens" },
      { label: "Pixels Perfected", value: "All the Pixels" },
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
      { client: "Bamah", quote: PLACEHOLDER_QUOTE },
      { client: "Fiverr", quote: PLACEHOLDER_QUOTE },
      { client: "R2", quote: PLACEHOLDER_QUOTE },
    ],
    principles: [
      {
        title: "User-Centric Design",
        tagline: "Your website should be built for the people using it, not just for show.",
        description:
          "We prioritize intuitive navigation and usability, ensuring visitors can find what they need effortlessly.",
      },
      {
        title: "Speed & Performance",
        tagline: "A slow website loses visitors—speed is key to keeping their attention.",
        description:
          "We focus on optimizing site performance to provide a seamless, fast experience that keeps users engaged.",
      },
      {
        title: "Mobile Responsiveness",
        tagline: "Your website should look great and function perfectly on any device.",
        description:
          "We ensure that your site is fully responsive, adapting to mobile, tablet, and desktop seamlessly.",
      },
      {
        title: "SEO Optimization",
        tagline: "What's the point of a great website if no one can find it?",
        description:
          "We design websites that are not only beautiful but also optimized for search engines, ensuring visibility.",
      },
      {
        title: "Conversion-Driven",
        tagline: "A website's ultimate goal is to convert visitors into customers.",
        description:
          "We strategically design websites that guide users toward taking action—whether it's making a purchase, signing up, or reaching out.",
      },
      {
        title: "Security & Stability",
        tagline: "Trust is built on a secure and stable website that keeps data safe.",
        description:
          "We implement the highest security standards, protecting both your business and your visitors, ensuring peace of mind.",
      },
    ],
    cta: { text: "Explore Websites", href: "/services/digital-design" },
    relatedServices: ["brand-strategy", "creative-direction"],
    // ctaArt: TODO — export reversed Websites hero artwork from Figma
    closingCta: {
      title: "Ready to connect?",
      body: "Placeholder body — real closing copy coming soon.",
      button: "Let's Connect",
    },
  },
};

export const servicesList = Object.values(services);
