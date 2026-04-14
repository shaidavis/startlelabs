export interface Service {
  slug: string;
  title: string;
  headline: string;
  description: string;
  heroImage: string;
  accentColor: string;
  stats: { label: string; value: string }[];
  features: { title: string; description: string }[];
  testimonial: { quote: string; author: string; role: string };
  cta: { text: string; href: string };
}

export const services: Record<string, Service> = {
  "brand-strategy": {
    slug: "brand-strategy",
    title: "Brand Strategy",
    headline: "Strategy that moves markets.",
    description:
      "We craft brand strategies that align vision with action. From positioning to messaging, every decision is intentional.",
    heroImage: "/images/services/placeholder-strategy.jpg",
    accentColor: "#2563eb",
    stats: [
      { label: "Brands Launched", value: "40+" },
      { label: "Industries", value: "12" },
      { label: "Client Retention", value: "94%" },
    ],
    features: [
      { title: "Brand Positioning", description: "Define where you stand in the market." },
      { title: "Messaging Framework", description: "Words that resonate with your audience." },
      { title: "Competitive Analysis", description: "Understand the landscape before you enter." },
    ],
    testimonial: {
      quote: "They didn't just build our brand — they gave us a voice.",
      author: "Placeholder Name",
      role: "CEO, Company",
    },
    cta: { text: "Start a Project", href: "/contact" },
  },
  "creative-direction": {
    slug: "creative-direction",
    title: "Creative Direction",
    headline: "Vision brought to life.",
    description:
      "From concept to execution, we direct the creative vision that makes brands unmistakable.",
    heroImage: "/images/services/placeholder-creative.jpg",
    accentColor: "#9333ea",
    stats: [
      { label: "Campaigns", value: "120+" },
      { label: "Awards", value: "8" },
      { label: "Team Members", value: "15" },
    ],
    features: [
      { title: "Art Direction", description: "Visual systems that tell your story." },
      { title: "Content Strategy", description: "Every piece of content, purposeful." },
      { title: "Campaign Design", description: "Campaigns that cut through the noise." },
    ],
    testimonial: {
      quote: "The creative direction elevated everything we do.",
      author: "Placeholder Name",
      role: "CMO, Company",
    },
    cta: { text: "Start a Project", href: "/contact" },
  },
  "digital-design": {
    slug: "digital-design",
    title: "Digital Design",
    headline: "Experiences that connect.",
    description:
      "We design digital experiences that are beautiful, functional, and built to convert.",
    heroImage: "/images/services/placeholder-digital.jpg",
    accentColor: "#ea580c",
    stats: [
      { label: "Websites Built", value: "60+" },
      { label: "Avg. Performance", value: "95+" },
      { label: "Conversion Lift", value: "3x" },
    ],
    features: [
      { title: "Web Design", description: "Sites that look stunning and perform." },
      { title: "UI/UX Design", description: "Interfaces people actually enjoy using." },
      { title: "Prototyping", description: "Test before you build." },
    ],
    testimonial: {
      quote: "Our new site converts 3x better than the old one.",
      author: "Placeholder Name",
      role: "Founder, Company",
    },
    cta: { text: "Start a Project", href: "/contact" },
  },
};

export const servicesList = Object.values(services);
