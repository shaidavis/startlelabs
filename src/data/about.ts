export interface StoryCard {
  image: string;
  heading: string;
  body: string;
}

export interface Review {
  rating: number;
  quote: string;
  /** Unicode flag emoji representing the client's country */
  flag: string;
  /** Country name — used for hover/screen-reader context */
  country: string;
  /** Project category (mirrors service titles, e.g. "Pitch Decks & Presentations") */
  category: string;
}

export interface Value {
  heading: string;
  body: string;
}

export interface Milestone {
  date: string;
  heading: string;
  body: string;
  tag?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface AboutData {
  hero: {
    heading: string;
    body: string;
    image: string;
  };
  story: {
    started: { heading: string; cards: StoryCard[] };
    going: { heading: string; cards: StoryCard[] };
  };
  reviews: Review[];
  values: Value[];
  manifesto: {
    heading: string;
    body: string;
  };
  timeline: {
    heading: string;
    milestones: Milestone[];
  };
  portfolio: {
    heading: string;
    body: string;
    notionEmbedUrl: string;
  };
  faqs: FAQ[];
  cta: {
    heading: string;
    buttonLabel: string;
    buttonHref: string;
  };
}

export const aboutData: AboutData = {
  hero: {
    heading: "We make brands impossible to ignore.",
    body: "Startle Labs is a boutique branding studio helping founders and teams build identities that feel as good as they look — and land as hard as they should.",
    image: "/images/icons/selfie.png",
  },
  story: {
    started: {
      heading: "How It Started...",
      cards: [
        {
          image: "",
          heading: "Born from frustration",
          body: "Too many great ideas were falling flat because their packaging didn't match their ambition. We started Startle Labs to fix that.",
        },
        {
          image: "",
          heading: "A small team, big opinions",
          body: "From day one we operated on the belief that brand strategy and visual craft are inseparable — you can't do one without the other.",
        },
        {
          image: "",
          heading: "First client, first lesson",
          body: "Our first engagement taught us that the most valuable thing we could offer was a clear point of view, not just execution.",
        },
      ],
    },
    going: {
      heading: "How It's Going...",
      cards: [
        {
          image: "",
          heading: "Growing deliberately",
          body: "We take on a handful of projects at a time so every client gets our full attention. Quality over volume — always.",
        },
        {
          image: "",
          heading: "Studio + partners",
          body: "We've built a tight network of specialists — developers, photographers, copywriters — who plug in when projects need it.",
        },
        {
          image: "",
          heading: "Doing work we're proud of",
          body: "Every project ships with the same question: would we put this in our portfolio? If the answer is no, we keep going.",
        },
      ],
    },
  },
  // Real Fiverr reviews, curated from the full 290-review history.
  // Categories map: "Business Names & Slogans" + "Sales Copy" → Brand Strategy,
  // "Pitch Decks" → Pitch Decks & Presentations, "Website Content" → Websites & Digital Design.
  // "Repeat Client" entries use 🔁 since Fiverr hides the country for repeat buyers.
  reviews: [
    {
      rating: 5,
      flag: "🇮🇱",
      country: "Israel",
      category: "Brand Strategy",
      quote:
        "I truly enjoyed every step of working with Shai. He is a true expert, and his guidance throughout the entire process was a game changer for my project. He was extremely professional, with a remarkable ability to quickly understand our requirements and identify effective solutions.",
    },
    {
      rating: 5,
      flag: "🇺🇸",
      country: "United States",
      category: "Brand Strategy",
      quote:
        "Absolutely amazing experience naming my startup with Shai!! He exceeded my expectations in every way. Shai took the time to learn about my brand and invested himself deeply into the project as if he were a business partner. I am confident that I now have the perfect name for my business!",
    },
    {
      rating: 5,
      flag: "🇺🇸",
      country: "United States",
      category: "Pitch Decks & Presentations",
      quote:
        "Shai turned around an excellent institutional-level deck for our firm in 2 days. I would certainly recommend him to anyone that needs this type of work. Most importantly though is that he delivered what he said he would do and more. Very reliable, very professional, great quality of work.",
    },
    {
      rating: 5,
      flag: "🇮🇳",
      country: "India",
      category: "Websites & Digital Design",
      quote:
        "Shai is one of the best sellers I've worked with on Fiverr. He is super professional, his work is meticulous and his copy is just killer! I've worked with him on multiple occasions and he has always delivered right on time and right on point. Highly recommended!",
    },
    {
      rating: 5,
      flag: "🇮🇱",
      country: "Israel",
      category: "Brand Strategy",
      quote:
        "Shai was a real pleasure to work with. He understood our product and brand right away and managed to put all our thoughts into perfect names, titles and descriptions, all SEO optimised! Shai's creativity and way of thinking is truly unique and I can't wait to collaborate with him on more projects as we continue to grow our product.",
    },
    {
      rating: 5,
      flag: "🇩🇪",
      country: "Germany",
      category: "Websites & Digital Design",
      quote:
        "Shai did a fantastic job and put a lot of effort in understanding the industry and the message I wanted to convey. From branding, to copywriting and designing the website I was absolutely satisfied with the result.",
    },
    {
      rating: 5,
      flag: "🔁",
      country: "Repeat Client",
      category: "Pitch Decks & Presentations",
      quote:
        "Shai did an excellent job preparing our investor pitch deck. He met — and even exceeded — our expectations in all areas, showing strong cooperation, clear communication, and a solid understanding of the business. Highly recommended.",
    },
    {
      rating: 5,
      flag: "🔁",
      country: "Repeat Client",
      category: "Brand Strategy",
      quote:
        "Shai absolutely exceeded my expectations with exceptional attention to detail and persuasive deliverables. His proactive communication and deep understanding of what I needed made working together a pleasure. I should have hired him a year ago and saved myself much headache!",
    },
    {
      rating: 5,
      flag: "🇺🇸",
      country: "United States",
      category: "Brand Strategy",
      quote:
        "I have the highest respect for Shai and his ability to name businesses or products. Shai put in the effort to understand my brand which was key to getting the correct name. The names he came up with were all excellent and captured the essence of our brand. Shai also took the extra time to follow up.",
    },
    {
      rating: 5,
      flag: "🇩🇪",
      country: "Germany",
      category: "Brand Strategy",
      quote: "We are in love with the ideas. 100% professional and great variations of ideas.",
    },
    {
      rating: 5,
      flag: "🇺🇸",
      country: "United States",
      category: "Pitch Decks & Presentations",
      quote:
        "Great work, outstanding services, fantastic content, and excellent communication. I will be using Startle Labs for all future sales pitch decks. I would highly recommend that you utilize his services for any upcoming projects. I was blown away by the customer service.",
    },
    {
      rating: 5,
      flag: "🇺🇸",
      country: "United States",
      category: "Brand Strategy",
      quote:
        "Top notch seller who went above and beyond. Unique brand names and domains with thoughtful explanations. Thank you!",
    },
    {
      rating: 5,
      flag: "🇸🇬",
      country: "Singapore",
      category: "Pitch Decks & Presentations",
      quote: "Punctual, professional, good suggestions.",
    },
    {
      rating: 5,
      flag: "🇨🇦",
      country: "Canada",
      category: "Brand Strategy",
      quote:
        "Shai was very responsive and it is clear that he knows what he is doing. Delivery was on time and above and beyond what I expected. Will use him again for other branding needs.",
    },
    {
      rating: 5,
      flag: "🇺🇸",
      country: "United States",
      category: "Brand Strategy",
      quote:
        "I'm beyond impressed and satisfied with the work Startle Labs did to help us craft a mission statement. Not only did I receive several options but a very thoughtful (and educational!) analysis attached to each of the options. If you are looking for the perfect tagline for your business — you must buy this Gig!",
    },
    {
      rating: 5,
      flag: "🇮🇱",
      country: "Israel",
      category: "Pitch Decks & Presentations",
      quote: "A true professional, quick and responsive. Always a pleasure to work with!",
    },
    {
      rating: 5,
      flag: "🇬🇧",
      country: "United Kingdom",
      category: "Brand Strategy",
      quote:
        "Shai came up with some well thought out business names. I loved the breakdown for each one — what they meant and why he had picked them. Excellent communication too. Thanks.",
    },
    {
      rating: 5,
      flag: "🇮🇱",
      country: "Israel",
      category: "Websites & Digital Design",
      quote: "Amazing work! Powerful copy, and exactly how I envisioned our About Us page — thank you!",
    },
    {
      rating: 5,
      flag: "🇸🇪",
      country: "Sweden",
      category: "Brand Strategy",
      quote:
        "Wow! I'm super impressed. The result was beyond my expectation. Too bad that the seller does not master my own native language, as I would like to hire him for assignments in Sweden as well. Great work!",
    },
    {
      rating: 5,
      flag: "🇬🇧",
      country: "United Kingdom",
      category: "Brand Strategy",
      quote:
        "I was hesitant parting so much money for somebody to 'just' come up with some names… My fear was clearly unfounded. Shai is a true professional with great communication. I was blown away by the selection of names he brought to me and the depth that had gone behind them. Highly recommend.",
    },
    {
      rating: 5,
      flag: "🇺🇸",
      country: "United States",
      category: "Brand Strategy",
      quote:
        "Shai was exceptional. He was responsive, engaged, and most importantly delivered a product that exceeded expectations! I would highly recommend his services.",
    },
    {
      rating: 5,
      flag: "🇺🇸",
      country: "United States",
      category: "Pitch Decks & Presentations",
      quote:
        "I was presenting to an audience of 900+. Needed very specific things done. Shai was very impressive and on-time. He's expensive but worth it.",
    },
    {
      rating: 5,
      flag: "🇦🇹",
      country: "Austria",
      category: "Brand Strategy",
      quote:
        "We were looking for a new name for our business. Shai has been very diligent and friendly in his communication. He delivered suggestions within the specified time frame and with very good quality, giving a detailed reasoning for each suggestion. I can absolutely recommend his service.",
    },
    {
      rating: 5,
      flag: "🇺🇸",
      country: "United States",
      category: "Brand Strategy",
      quote:
        "This is truly a service that stands out from the rest. I have worked with 5 other brand naming professionals on Fiverr and Startle Labs went above and beyond everyone. If you want your work done professionally with deep thoughts and considerations, go with Startle Labs.",
    },
    {
      rating: 5,
      flag: "🇮🇱",
      country: "Israel",
      category: "Brand Strategy",
      quote:
        "Startle Labs does such great work for us. He gets the product, has a quick turnover and his work is just great! We continue to work with him on a monthly basis.",
    },
    {
      rating: 5,
      flag: "🇺🇸",
      country: "United States",
      category: "Pitch Decks & Presentations",
      quote:
        "I was trying to create a very complex, multi-part presentation and Shai was able to make it come to life beautifully. I cannot recommend him more. He was patient with me and offered plenty of useful suggestions. I will definitely return for more services.",
    },
    {
      rating: 5,
      flag: "🇩🇪",
      country: "Germany",
      category: "Brand Strategy",
      quote:
        "I don't tend to be overly euphoric but Shai is simply the best freelancer on this site! He takes his time to get to know the business idea and the person behind it. Then he starts the creative process and a couple days later you get a list with brilliant naming ideas together with detailed comments.",
    },
    {
      rating: 5,
      flag: "🇯🇵",
      country: "Japan",
      category: "Brand Strategy",
      quote:
        "This was the third time I worked with him, and his work has been always very professional. I am very satisfied.",
    },
    {
      rating: 5,
      flag: "🇺🇸",
      country: "United States",
      category: "Websites & Digital Design",
      quote: "Great working with this seller.",
    },
    {
      rating: 5,
      flag: "🇨🇿",
      country: "Czech Republic",
      category: "Brand Strategy",
      quote:
        "He's definitely a pro. Not only that I got a bunch of pretty good naming suggestions for my business, I've also learned a lot. The questions he asked made me think even more about my business. He's got a lot of experience and is absolutely worth the money.",
    },
    {
      rating: 5,
      flag: "🇦🇹",
      country: "Austria",
      category: "Brand Strategy",
      quote: "Awesome work, done by an awesome seller — absolutely recommended!",
    },
    {
      rating: 5,
      flag: "🇺🇸",
      country: "United States",
      category: "Brand Strategy",
      quote:
        "This gig is awesome! Does not just throw names — everything has real meaning. You get what you pay for. This is not cheap, but if you're building a real brand you gotta take this gig.",
    },
    {
      rating: 5,
      flag: "🇺🇸",
      country: "United States",
      category: "Pitch Decks & Presentations",
      quote:
        "Shai is the most talented PowerPoint slide presentation preparer I have ever worked with, and I have given a lot of presentations. He was prompt, concise, artistic and easy to work with. I recommend Shai wholeheartedly.",
    },
    {
      rating: 5,
      flag: "🇺🇸",
      country: "United States",
      category: "Brand Strategy",
      quote:
        "Thank you so much, Shai, for delivering incredible work! It's tough to decide which one to use because all of them are great taglines.",
    },
    {
      rating: 5,
      flag: "🇶🇦",
      country: "Qatar",
      category: "Brand Strategy",
      quote:
        "What a fantastic experience! Great communication, great service and attention to detail excellent. Will definitely be using again. Many thanks.",
    },
    {
      rating: 5,
      flag: "🇺🇸",
      country: "United States",
      category: "Brand Strategy",
      quote:
        "I didn't expect to be moved by Shai's work, but I was. His selections were thoughtful and nuanced, and the notes he provided beautifully summarized the thought process behind each one. He greatly exceeded my expectations, and from his ideas, I've found the name of my business.",
    },
    {
      rating: 5,
      flag: "🇺🇸",
      country: "United States",
      category: "Pitch Decks & Presentations",
      quote:
        "Very professional, receptive to suggestions, prompt in delivery timeline. Overall a great experience.",
    },
    {
      rating: 5,
      flag: "🇹🇭",
      country: "Thailand",
      category: "Brand Strategy",
      quote:
        "Naming is a very important part of any business startup. For me as a creative business owner that was really hard to delegate. The professionalism of that viewer (and creator) is crucial.",
    },
    {
      rating: 5,
      flag: "🇮🇳",
      country: "India",
      category: "Brand Strategy",
      quote:
        "Earlier I tried quite a few tagline/slogan sellers on Fiverr and I was very disappointed. Somehow, I came across Startle Labs, and I thought why not give a final try before deleting my Fiverr account. Glad I did. His service stands out from the rest. His work is exceptional!",
    },
    {
      rating: 5,
      flag: "🇨🇭",
      country: "Switzerland",
      category: "Brand Strategy",
      quote:
        "It was truly an outstanding experience! He delivered the most awesome names which I will use for my product. Great job! Just awesome!",
    },
  ],
  values: [
    {
      heading: "Clarity over cleverness.",
      body: "A clear idea beats a clever one every time. We push every project until the core concept is simple enough to explain in a single sentence — then we make it look unforgettable.",
    },
    {
      heading: "Strategy before craft.",
      body: "We don't make things look good until we know what they need to mean. Every visual decision traces back to a strategic one, so nothing we ship is decorative.",
    },
    {
      heading: "Client as collaborator.",
      body: "You know your audience better than anyone. Our job is to pull that knowledge out of you and channel it into a brand the world can actually see and feel.",
    },
    {
      heading: "Built to last.",
      body: "Trends come and go. We build brand systems that flex with growth, survive pivots, and stay recognizable five years from now — not just at launch.",
    },
  ],
  manifesto: {
    heading: "Connection isn't a skill — it's a choice.",
    body: "Every brand has the chance to mean something to the people it serves. Most waste it chasing what's fashionable. We're here to help you make the other choice: to show up honestly, look the part, and give your audience a reason to believe. That's what great branding does. That's what we're here to build.",
  },
  timeline: {
    heading: "How we got here",
    milestones: [
      {
        date: "2019",
        tag: "Day 1",
        heading: "Studio founded",
        body: "Startle Labs opens its doors in Toronto with a single focus: brand identity for early-stage companies.",
      },
      {
        date: "2020",
        tag: "First ship",
        heading: "First full rebrand",
        body: "We complete our first major rebrand — a fintech startup that needed to look trustworthy without looking boring.",
      },
      {
        date: "2021",
        tag: "Growth",
        heading: "Team grows to 4",
        body: "We bring on our first full-time strategist and hire a senior designer to handle the growing workload.",
      },
      {
        date: "2023",
        tag: "New home",
        heading: "New studio space",
        body: "We move into a proper studio in the west end and start hosting quarterly brand workshops for the local community.",
      },
      {
        date: "2024",
        tag: "Milestone",
        heading: "40+ brands built",
        body: "We cross a milestone: over forty brand identities shipped, spanning SaaS, consumer, nonprofit, and culture sectors.",
      },
      {
        date: "2026",
        tag: "Today",
        heading: "What's next",
        body: "We're deepening our work in strategy and digital product — helping brands not just look sharp, but live sharp across every surface.",
      },
    ],
  },
  portfolio: {
    heading: "Work we've shipped",
    body: "A living archive of the brands we've helped build, rebuild, and sharpen. Browse recent work and filter by industry, service, or year.",
    notionEmbedUrl:
      "https://shaidavis.notion.site/ebd/a3b1ac214a534a3c993ea8248ec151a9?v=30f304d338d2457bba8ba2eb6ad6656c",
  },
  faqs: [
    {
      question: "What types of companies do you work with?",
      answer: "We work best with founders and leadership teams who are serious about their brand and willing to be challenged. Our clients range from pre-launch startups to established companies going through a rebrand.",
    },
    {
      question: "How long does a typical project take?",
      answer: "A full brand identity engagement typically runs 6–10 weeks from kick-off to final delivery. Smaller projects like brand audits or visual refreshes can be completed in 2–4 weeks.",
    },
    {
      question: "Do you only do visual identity, or do you handle strategy too?",
      answer: "Both — and we'd argue you can't do one well without the other. Every project starts with a strategy phase that shapes all the creative work that follows.",
    },
    {
      question: "What does the process look like?",
      answer: "We start with discovery (research, stakeholder interviews, competitive audit), move into strategy (positioning, messaging, brand pillars), then into design. We work in collaborative rounds with feedback loops built in throughout.",
    },
    {
      question: "How much does a project cost?",
      answer: "Projects start at $15K for brand identity and scale based on scope and complexity. We're transparent about pricing from the first conversation — no surprises.",
    },
    {
      question: "Can you help us after the brand launches?",
      answer: "Yes. We offer a brand stewardship retainer for clients who want ongoing support applying the identity across channels, reviewing materials, and evolving the system over time.",
    },
  ],
  cta: {
    heading: "Ready to build something worth noticing?",
    buttonLabel: "Start a project",
    buttonHref: "/contact",
  },
};
