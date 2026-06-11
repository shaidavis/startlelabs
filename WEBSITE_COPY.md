# Startle Labs — Website Copy

> **Purpose:** A complete, editable inventory of every piece of visible text on the site, organized by where it appears.
>
> **How to use this doc:**
> 1. Edit the copy directly under each labeled item (the text after the `►` marker, or inside the blockquotes).
> 2. **Keep the bold `[ID]` labels and the `Source:` lines intact** — they tell me exactly which file/field to update when you hand this back.
> 3. `\n` inside a value means an intentional line break on the page. Leave it in (or move it) where you want the break.
> 4. Don't worry about the `Source:` paths — those are for me. Just change the words.
>
> **Source of truth:** Most copy lives in three data files (`src/data/services.ts`, `src/data/about.ts`) — editing there updates both the homepage and the detail pages at once. Some copy is hardcoded in components; those are noted individually.
>
> _Note: `src/data/projects.ts` exists but is **not used anywhere** on the live site, so it's excluded here._

---

## Table of Contents

1. [Global / Site-wide](#1--global--site-wide)
2. [Homepage](#2--homepage-)
3. [Service Detail Pages](#3--service-detail-pages-servicesslug)
4. [About Page](#4--about-page-about)
5. [Contact Page](#5--contact-page-contact)
6. [Interactive Venn Diagram](#6--interactive-venn-diagram-shared-component)

---

## 1 — Global / Site-wide

### Browser tab title & SEO description (homepage / default)
_Source: `src/app/layout.tsx`_

- **[GLOBAL-TITLE]** ► `Startle Labs — Branding & Creative Agency`
- **[GLOBAL-DESC]** ► `Brand strategy, creative direction, and digital design that inspires. Startle Labs builds brands that move markets.`

### Skip-to-content link (accessibility)
_Source: `src/app/layout.tsx`_

- **[GLOBAL-SKIP]** ► `Skip to content`

### Top navigation (Topbar / mobile menu)
_Source: `src/components/layout/Navigation.tsx`, labels also derived from service data_

- **[NAV-HOME]** ► `Home`
- **[NAV-ABOUT]** ► `About`
- **[NAV-CONTACT]** ► `Contact`
- Service nav tooltips (shown under each icon) come from the **navTooltip** field of each service — see Section 3.

### Footer (shown on About & Service pages — the homepage has its own in-panel footer, see Section 2)
_Source: `src/components/layout/Footer.tsx`_

- **[FOOTER-WORDMARK]** ► `Startle Labs`
- **[FOOTER-TAGLINE]** ► `Hand-drawn with` ❤️ `in TLV` _(the heart is an icon between the two phrases)_
- **[FOOTER-LINK-LINKEDIN]** ► `LinkedIn`
- **[FOOTER-COPYRIGHT]** ► `© {year} Startle Labs` _(year auto-fills)_
- Dark fallback footer links (rarely shown): **[FOOTER-TWITTER]** `Twitter` · **[FOOTER-INSTAGRAM]** `Instagram` · **[FOOTER-LINKEDIN2]** `LinkedIn`

---

## 2 — Homepage (`/`)

> The homepage is one continuous full-screen scroll experience. Sections appear in this order: **Hero → 3 Service panels → About panel → Contact panel**.
> _Source: `src/components/sections/FullscreenScroller.tsx`_

### 2.1 — Hero
The headline animates: it starts and ends reading **"Creativity that inspires."** while cycling a wheel of words in the middle.

- **[HOME-HERO-HEADLINE]** ► `Creativity that inspires`
- **[HOME-HERO-WORDS]** (the animated word wheel, in order) ►
  `teams` · `users` · `investors` · `vision` · `innovation` · `joy` · `success`
  _(the wheel always lands on the last word, currently `success`)_
- **[HOME-HERO-SCROLLHINT]** (curved text prompting the user to scroll) ► `Scroll & keep on scrolling!`

### 2.2 — Service panels (×3)
Each of the three services gets a full-screen panel. The headline + accent word + CTA all come from the service data (Section 3). The shared layout reads:

> **[headline]** _that inspire_ **[accent word].**  → button: **[cta text]**

- **[HOME-SERVICE-CONNECTOR]** (the fixed words between headline and accent) ► `that inspire`
- The headline, accent word (`description`), and button text (`cta.text`) per service are in Section 3.

### 2.3 — About panel
- **[HOME-ABOUT-EYEBROW]** ► `About Startle Labs`
- **[HOME-ABOUT-HEADING]** ► `Creativity is at the center.`
- **[HOME-ABOUT-BODY]** ►
  > Creativity isn't a gift, it's a process. And it's fortified by three core pillars that keep my work interesting, surprising, and authentic.
- **[HOME-ABOUT-CTA]** (primary button) ► `Learn More`
- **[HOME-ABOUT-REPLAY]** (secondary button) ► `Replay animation`

### 2.4 — Contact panel (final screen)
- **[HOME-CONTACT-EYEBROW]** ► `Get in touch`
- **[HOME-CONTACT-HEADING]** ► `Yalla.`
- **[HOME-CONTACT-BODY]** ►
  > Tell us what you're working on. We answer fast — usually same day, always before you start regretting sending it.
- **[HOME-CONTACT-EMAIL]** (the CTA pill, also the mailto link) ► `hello@startlelabs.com`
- In-panel footer: **[HOME-CONTACT-COPYRIGHT]** `© {year} Startle Labs` · links: `Twitter` · `Instagram` · `LinkedIn`

---

## 3 — Service Detail Pages (`/services/[slug]`)

> All three service pages share one template. The copy below is per-service and lives in `src/data/services.ts`.
> Shared/hardcoded labels in the template (`src/components/templates/ServicePageTemplate.tsx`):
> - **[SVC-BACKLINK]** ► `Back to overview`
> - **[SVC-PRINCIPLES-HEADING]** ► `Principles of the {Service}.` _(auto-fills the service name; "Pitch Decks" shows as "Pitch")_
> - **[SVC-PRINCIPLES-INTRO]** ⚠️ _placeholder — currently Lorem ipsum, needs real copy_ ►
>   `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.`
> - **[SVC-PROJECTS-HEADING]** ► `Selected Projects.`
> - **[SVC-CROSSSELL-HEADING]** ► `Other services from Startle Labs`

---

### 3.A — Brand Strategy (`/services/brand-strategy`)

| Field | ID | Copy |
|---|---|---|
| Nav title (display) | **[BS-TITLE]** | `Brand Strategy` |
| Nav tooltip | **[BS-NAVTOOLTIP]** | `Strategy` |
| Topbar nav title | **[BS-NAVTITLE]** | `Creative strategy, Brand identity, and Messaging` |
| Homepage headline | **[BS-HEADLINE]** | `Creative strategy,` / `brand identity,` / `and messaging` |
| Accent word | **[BS-ACCENT]** | `confidence` |
| Hero tagline (detail page) | **[BS-HEROTAG]** | `Creative Solutions` |
| Homepage CTA button | **[BS-CTA]** | `Explore Brand Strategy` |

**[BS-HEROINTRO]** ►
> Your brand is the face of your business. It needs to exude confidence, setting the tone for how your market perceives you. Just like wearing your best outfit, your brand should make you feel unstoppable, ready to engage with customers and stand out from competitors. When your brand looks and feels right, you walk into any room (or market) with swagger.

**Stats:**
- **[BS-STAT-1]** ► `Companies Named` = `192`
- **[BS-STAT-2]** ► `Taglines Written` = `2,148`
- **[BS-STAT-3]** ► `Pixels Perfected` = `All of them`

**[BS-QUOTE]** (pull-quote) ►
> "Confidence is key. If you don't believe in yourself, why should anyone else?" — **RuPaul**

**Deliverables (icon grid):**
- **[BS-DEL-1]** `Creative Strategy`
- **[BS-DEL-2]** `Naming & Branding`
- **[BS-DEL-3]** `Positioning & Ads`
- **[BS-DEL-4]** `Taglines & Messaging`
- **[BS-DEL-5]** `Logos & Identity`
- **[BS-DEL-6]** `Storyboards`

**Testimonials/clients:** ⚠️ _quotes are placeholders — "Placeholder testimonial — real copy coming soon."_
- **[BS-CLIENT-1]** `Clalit` · **[BS-CLIENT-2]** `Corpora` · **[BS-CLIENT-3]** `PointFive`

**Principles (6):**
1. **[BS-PRIN-1]** `Memorability` — _A brand that's easily recognized and remembered has staying power._
   > We ensure your brand leaves a lasting impression that sticks with your audience long after the first encounter.
2. **[BS-PRIN-2]** `Relevance` — _A strong brand speaks directly to the needs and aspirations of its target audience._
   > We craft brands that connect deeply with your market, making sure you resonate with the right people.
3. **[BS-PRIN-3]** `Distinctiveness` — _Standing out in a crowded market is key to being noticed._
   > We design brands that differentiate you from competitors and position you as unique in your space.
4. **[BS-PRIN-4]** `Resonance` — _Great brands evoke feelings that create deeper customer connections._
   > We focus on building brands that spark emotions and foster loyalty through authentic storytelling.
5. **[BS-PRIN-5]** `Timelessness` — _Your brand should endure, growing stronger over time._
   > We create brands that can evolve with your business without feeling outdated or tied to fleeting trends.
6. **[BS-PRIN-6]** `Scalability` — _Your brand must be flexible enough to grow alongside your business._
   > We develop brands that can expand across platforms and markets while maintaining a cohesive identity.

**Closing CTA:** ⚠️ _body is a placeholder_
- **[BS-CLOSE-TITLE]** ► `Confidence building?`
- **[BS-CLOSE-BODY]** ► `Placeholder body — real closing copy coming soon.`
- **[BS-CLOSE-BUTTON]** ► `Let's Connect`

---

### 3.B — Pitch Decks (`/services/creative-direction`)

| Field | ID | Copy |
|---|---|---|
| Nav title (display) | **[PD-TITLE]** | `Pitch Decks` |
| Nav tooltip | **[PD-NAVTOOLTIP]** | `Presentations` |
| Topbar nav title | **[PD-NAVTITLE]** | `Pitch decks, Presentations, and Collateral` |
| Homepage headline | **[PD-HEADLINE]** | `Pitch decks,` / `presentations,` / `and collateral` |
| Accent word | **[PD-ACCENT]** | `curiosity` |
| Hero tagline (detail page) | **[PD-HEROTAG]** | `Pitch perfect.` |
| Homepage CTA button | **[PD-CTA]** | `Explore Pitch Decks` |

**[PD-HEROINTRO]** ►
> Your pitch deck isn't just about presenting facts—it's about sparking curiosity. You need to make your investors or audience lean in, asking for more. When your message is compelling and thought-provoking, it ignites curiosity, pushing them to want to explore your vision and become part of your journey. It's not just what you show; it's what they want to learn next.

**Stats:** _(`\n` = line break)_
- **[PD-STAT-1]** ► `Funds Raised` = `Hundreds\nof Millions`
- **[PD-STAT-2]** ► `Slides Created` = `At Least Ten\nThousand`
- **[PD-STAT-3]** ► `Transition Effects` = `Never\nUse 'Em`

**[PD-QUOTE]** ►
> "The important thing is not to stop questioning. Curiosity has its own reason for existing." — **Albert Einstein**

**Deliverables:**
- **[PD-DEL-1]** `Pitch Decks`
- **[PD-DEL-2]** `Presentations`
- **[PD-DEL-3]** `One-Pagers`
- **[PD-DEL-4]** `Sales Decks`
- **[PD-DEL-5]** `Storytelling`
- **[PD-DEL-6]** `Infographics`

**Testimonials/clients:** ⚠️ _placeholders_
- **[PD-CLIENT-1]** `Bananaz` · **[PD-CLIENT-2]** `Naboo` · **[PD-CLIENT-3]** `Tastewise` · **[PD-CLIENT-4]** `SodaStream`

**Principles (6):**
1. **[PD-PRIN-1]** `Narrative Flow` — _A great presentation tells a compelling story, not just a sequence of slides._
   > We ensure every pitch deck has a clear, engaging storyline that guides your audience effortlessly from start to finish.
2. **[PD-PRIN-2]** `Visual Clarity` — _Visuals should enhance your message, not distract from it._
   > We prioritize clear, impactful design that supports your key points, ensuring investors focus on your message.
3. **[PD-PRIN-3]** `Persuasion` — _Every slide should compel action or inspire confidence._
   > We craft presentations that make investors eager to learn more, encouraging them to take the next step with you.
4. **[PD-PRIN-4]** `Brevity` — _Less is more—say enough to captivate, but leave them wanting more._
   > We refine your message to its essentials, keeping the content concise yet powerful.
5. **[PD-PRIN-5]** `Engagement` — _Investors should feel intrigued and involved, not just informed._
   > We create presentations that foster dialogue, encouraging curiosity and interaction from the audience.
6. **[PD-PRIN-6]** `Credibility` — _Your deck should make investors feel secure in your vision._
   > We emphasize data, facts, and realistic projections that build trust and make investors confident in your business.

**Closing CTA:** ⚠️ _body is a placeholder_
- **[PD-CLOSE-TITLE]** ► `Curiosity piqued?`
- **[PD-CLOSE-BODY]** ► `Placeholder body — real closing copy coming soon.`
- **[PD-CLOSE-BUTTON]** ► `Let's Connect`

---

### 3.C — Websites (`/services/digital-design`)

| Field | ID | Copy |
|---|---|---|
| Nav title (display) | **[WEB-TITLE]** | `Websites` |
| Nav tooltip | **[WEB-NAVTOOLTIP]** | `Websites` |
| Topbar nav title | **[WEB-NAVTITLE]** | `Websites, Art direction, and Product` |
| Homepage headline | **[WEB-HEADLINE]** | `Websites,` / `art direction,` / `and product` |
| Accent word | **[WEB-ACCENT]** | `connection` |
| Hero tagline (detail page) | **[WEB-HEROTAG]** | `Web perfect.` |
| Homepage CTA button | **[WEB-CTA]** | `Explore Websites` |

**[WEB-HEROINTRO]** ►
> Your website is where your brand builds meaningful connections. It's more than just a digital presence—it's a space where your audience should feel immediately at home. When done right, your website creates a lasting bond, making visitors feel like they've found what they've been looking for, fostering engagement, loyalty, and trust.

**Stats:**
- **[WEB-STAT-1]** ► `First Site Built` = `in 1999`
- **[WEB-STAT-2]** ► `Tools Used` = `Dozens`
- **[WEB-STAT-3]** ► `Pixels Perfected` = `All the Pixels`

**[WEB-QUOTE]** ►
> "Connection isn't a skill. It's a choice." — **Star Trek**

**Deliverables:**
- **[WEB-DEL-1]** `Art Direction`
- **[WEB-DEL-2]** `Websites`
- **[WEB-DEL-3]** `Copywriting`
- **[WEB-DEL-4]** `Project Management`
- **[WEB-DEL-5]** `Applications`
- **[WEB-DEL-6]** `Wireframes`

**Testimonials/clients:** ⚠️ _placeholders_
- **[WEB-CLIENT-1]** `Bamah` · **[WEB-CLIENT-2]** `Fiverr` · **[WEB-CLIENT-3]** `R2`

**Principles (6):**
1. **[WEB-PRIN-1]** `User-Centric Design` — _Your website should be built for the people using it, not just for show._
   > We prioritize intuitive navigation and usability, ensuring visitors can find what they need effortlessly.
2. **[WEB-PRIN-2]** `Speed & Performance` — _A slow website loses visitors—speed is key to keeping their attention._
   > We focus on optimizing site performance to provide a seamless, fast experience that keeps users engaged.
3. **[WEB-PRIN-3]** `Mobile Responsiveness` — _Your website should look great and function perfectly on any device._
   > We ensure that your site is fully responsive, adapting to mobile, tablet, and desktop seamlessly.
4. **[WEB-PRIN-4]** `SEO Optimization` — _What's the point of a great website if no one can find it?_
   > We design websites that are not only beautiful but also optimized for search engines, ensuring visibility.
5. **[WEB-PRIN-5]** `Conversion-Driven` — _A website's ultimate goal is to convert visitors into customers._
   > We strategically design websites that guide users toward taking action—whether it's making a purchase, signing up, or reaching out.
6. **[WEB-PRIN-6]** `Security & Stability` — _Trust is built on a secure and stable website that keeps data safe._
   > We implement the highest security standards, protecting both your business and your visitors, ensuring peace of mind.

**Closing CTA:** ⚠️ _body is a placeholder_
- **[WEB-CLOSE-TITLE]** ► `Ready to connect?`
- **[WEB-CLOSE-BODY]** ► `Placeholder body — real closing copy coming soon.`
- **[WEB-CLOSE-BUTTON]** ► `Let's Connect`

---

## 4 — About Page (`/about`)

> _Source: copy in `src/data/about.ts`; section headers hardcoded in `src/components/templates/AboutTemplate.tsx`._

### Browser tab title & SEO description
_Source: `src/app/about/page.tsx`_
- **[ABOUT-META-TITLE]** ► `About — Startle Labs`
- **[ABOUT-META-DESC]** ► `We make brands impossible to ignore. Learn who we are, how we work, and why we care.`

### 4.1 — Hero
- **[ABOUT-HERO-HEADING]** ► `We make brands impossible to ignore.`
- **[ABOUT-HERO-BODY]** ►
  > Startle Labs is a boutique branding studio helping founders and teams build identities that feel as good as they look — and land as hard as they should.
- **[ABOUT-HERO-IMG-ALT]** (image alt text) ► `Shai Davis — Startle Labs founder`

### 4.2 — Our Story
**[ABOUT-STORY-STARTED-HEADING]** ► `How It Started...`
1. **[ABOUT-STORY-S1]** `Born from frustration` —
   > Too many great ideas were falling flat because their packaging didn't match their ambition. We started Startle Labs to fix that.
2. **[ABOUT-STORY-S2]** `A small team, big opinions` —
   > From day one we operated on the belief that brand strategy and visual craft are inseparable — you can't do one without the other.
3. **[ABOUT-STORY-S3]** `First client, first lesson` —
   > Our first engagement taught us that the most valuable thing we could offer was a clear point of view, not just execution.

**[ABOUT-STORY-GOING-HEADING]** ► `How It's Going...`
1. **[ABOUT-STORY-G1]** `Growing deliberately` —
   > We take on a handful of projects at a time so every client gets our full attention. Quality over volume — always.
2. **[ABOUT-STORY-G2]** `Studio + partners` —
   > We've built a tight network of specialists — developers, photographers, copywriters — who plug in when projects need it.
3. **[ABOUT-STORY-G3]** `Doing work we're proud of` —
   > Every project ships with the same question: would we put this in our portfolio? If the answer is no, we keep going.

### 4.3 — Values ("How we work")
- **[ABOUT-VALUES-EYEBROW]** ► `How we work`
- **[ABOUT-VALUES-SUB]** ► `Four ideas we keep coming back to.`

1. **[ABOUT-VALUE-1]** `Clarity over cleverness.` —
   > A clear idea beats a clever one every time. We push every project until the core concept is simple enough to explain in a single sentence — then we make it look unforgettable.
2. **[ABOUT-VALUE-2]** `Strategy before craft.` —
   > We don't make things look good until we know what they need to mean. Every visual decision traces back to a strategic one, so nothing we ship is decorative.
3. **[ABOUT-VALUE-3]** `Client as collaborator.` —
   > You know your audience better than anyone. Our job is to pull that knowledge out of you and channel it into a brand the world can actually see and feel.
4. **[ABOUT-VALUE-4]** `Built to last.` —
   > Trends come and go. We build brand systems that flex with growth, survive pivots, and stay recognizable five years from now — not just at launch.

### 4.4 — Manifesto
- **[ABOUT-MANIFESTO-HEADING]** ► `Connection isn't a skill — it's a choice.`
- **[ABOUT-MANIFESTO-BODY]** ►
  > Every brand has the chance to mean something to the people it serves. Most waste it chasing what's fashionable. We're here to help you make the other choice: to show up honestly, look the part, and give your audience a reason to believe. That's what great branding does. That's what we're here to build.

### 4.5 — Reviews ("What clients say")
- **[ABOUT-REVIEWS-EYEBROW]** ► `What clients say`
- **[ABOUT-REVIEWS-SUB]** ► `Kind words from the people we build for.`

> These are real curated Fiverr reviews (all 5★). Each shows a country flag + project category. Format: **[ID]** `Country` · `Category` → quote.

1. **[ABOUT-REVIEW-01]** 🇮🇱 Israel · Brand Strategy —
   > I truly enjoyed every step of working with Shai. He is a true expert, and his guidance throughout the entire process was a game changer for my project. He was extremely professional, with a remarkable ability to quickly understand our requirements and identify effective solutions.
2. **[ABOUT-REVIEW-02]** 🇺🇸 United States · Brand Strategy —
   > Absolutely amazing experience naming my startup with Shai!! He exceeded my expectations in every way. Shai took the time to learn about my brand and invested himself deeply into the project as if he were a business partner. I am confident that I now have the perfect name for my business!
3. **[ABOUT-REVIEW-03]** 🇺🇸 United States · Pitch Decks & Presentations —
   > Shai turned around an excellent institutional-level deck for our firm in 2 days. I would certainly recommend him to anyone that needs this type of work. Most importantly though is that he delivered what he said he would do and more. Very reliable, very professional, great quality of work.
4. **[ABOUT-REVIEW-04]** 🇮🇳 India · Websites & Digital Design —
   > Shai is one of the best sellers I've worked with on Fiverr. He is super professional, his work is meticulous and his copy is just killer! I've worked with him on multiple occasions and he has always delivered right on time and right on point. Highly recommended!
5. **[ABOUT-REVIEW-05]** 🇮🇱 Israel · Brand Strategy —
   > Shai was a real pleasure to work with. He understood our product and brand right away and managed to put all our thoughts into perfect names, titles and descriptions, all SEO optimised! Shai's creativity and way of thinking is truly unique and I can't wait to collaborate with him on more projects as we continue to grow our product.
6. **[ABOUT-REVIEW-06]** 🇩🇪 Germany · Websites & Digital Design —
   > Shai did a fantastic job and put a lot of effort in understanding the industry and the message I wanted to convey. From branding, to copywriting and designing the website I was absolutely satisfied with the result.
7. **[ABOUT-REVIEW-07]** 🔁 Repeat Client · Pitch Decks & Presentations —
   > Shai did an excellent job preparing our investor pitch deck. He met — and even exceeded — our expectations in all areas, showing strong cooperation, clear communication, and a solid understanding of the business. Highly recommended.
8. **[ABOUT-REVIEW-08]** 🔁 Repeat Client · Brand Strategy —
   > Shai absolutely exceeded my expectations with exceptional attention to detail and persuasive deliverables. His proactive communication and deep understanding of what I needed made working together a pleasure. I should have hired him a year ago and saved myself much headache!
9. **[ABOUT-REVIEW-09]** 🇺🇸 United States · Brand Strategy —
   > I have the highest respect for Shai and his ability to name businesses or products. Shai put in the effort to understand my brand which was key to getting the correct name. The names he came up with were all excellent and captured the essence of our brand. Shai also took the extra time to follow up.
10. **[ABOUT-REVIEW-10]** 🇩🇪 Germany · Brand Strategy —
    > We are in love with the ideas. 100% professional and great variations of ideas.
11. **[ABOUT-REVIEW-11]** 🇺🇸 United States · Pitch Decks & Presentations —
    > Great work, outstanding services, fantastic content, and excellent communication. I will be using Startle Labs for all future sales pitch decks. I would highly recommend that you utilize his services for any upcoming projects. I was blown away by the customer service.
12. **[ABOUT-REVIEW-12]** 🇺🇸 United States · Brand Strategy —
    > Top notch seller who went above and beyond. Unique brand names and domains with thoughtful explanations. Thank you!
13. **[ABOUT-REVIEW-13]** 🇸🇬 Singapore · Pitch Decks & Presentations —
    > Punctual, professional, good suggestions.
14. **[ABOUT-REVIEW-14]** 🇨🇦 Canada · Brand Strategy —
    > Shai was very responsive and it is clear that he knows what he is doing. Delivery was on time and above and beyond what I expected. Will use him again for other branding needs.
15. **[ABOUT-REVIEW-15]** 🇺🇸 United States · Brand Strategy —
    > I'm beyond impressed and satisfied with the work Startle Labs did to help us craft a mission statement. Not only did I receive several options but a very thoughtful (and educational!) analysis attached to each of the options. If you are looking for the perfect tagline for your business — you must buy this Gig!
16. **[ABOUT-REVIEW-16]** 🇮🇱 Israel · Pitch Decks & Presentations —
    > A true professional, quick and responsive. Always a pleasure to work with!
17. **[ABOUT-REVIEW-17]** 🇬🇧 United Kingdom · Brand Strategy —
    > Shai came up with some well thought out business names. I loved the breakdown for each one — what they meant and why he had picked them. Excellent communication too. Thanks.
18. **[ABOUT-REVIEW-18]** 🇮🇱 Israel · Websites & Digital Design —
    > Amazing work! Powerful copy, and exactly how I envisioned our About Us page — thank you!
19. **[ABOUT-REVIEW-19]** 🇸🇪 Sweden · Brand Strategy —
    > Wow! I'm super impressed. The result was beyond my expectation. Too bad that the seller does not master my own native language, as I would like to hire him for assignments in Sweden as well. Great work!
20. **[ABOUT-REVIEW-20]** 🇬🇧 United Kingdom · Brand Strategy —
    > I was hesitant parting so much money for somebody to 'just' come up with some names… My fear was clearly unfounded. Shai is a true professional with great communication. I was blown away by the selection of names he brought to me and the depth that had gone behind them. Highly recommend.
21. **[ABOUT-REVIEW-21]** 🇺🇸 United States · Brand Strategy —
    > Shai was exceptional. He was responsive, engaged, and most importantly delivered a product that exceeded expectations! I would highly recommend his services.
22. **[ABOUT-REVIEW-22]** 🇺🇸 United States · Pitch Decks & Presentations —
    > I was presenting to an audience of 900+. Needed very specific things done. Shai was very impressive and on-time. He's expensive but worth it.
23. **[ABOUT-REVIEW-23]** 🇦🇹 Austria · Brand Strategy —
    > We were looking for a new name for our business. Shai has been very diligent and friendly in his communication. He delivered suggestions within the specified time frame and with very good quality, giving a detailed reasoning for each suggestion. I can absolutely recommend his service.
24. **[ABOUT-REVIEW-24]** 🇺🇸 United States · Brand Strategy —
    > This is truly a service that stands out from the rest. I have worked with 5 other brand naming professionals on Fiverr and Startle Labs went above and beyond everyone. If you want your work done professionally with deep thoughts and considerations, go with Startle Labs.
25. **[ABOUT-REVIEW-25]** 🇮🇱 Israel · Brand Strategy —
    > Startle Labs does such great work for us. He gets the product, has a quick turnover and his work is just great! We continue to work with him on a monthly basis.
26. **[ABOUT-REVIEW-26]** 🇺🇸 United States · Pitch Decks & Presentations —
    > I was trying to create a very complex, multi-part presentation and Shai was able to make it come to life beautifully. I cannot recommend him more. He was patient with me and offered plenty of useful suggestions. I will definitely return for more services.
27. **[ABOUT-REVIEW-27]** 🇩🇪 Germany · Brand Strategy —
    > I don't tend to be overly euphoric but Shai is simply the best freelancer on this site! He takes his time to get to know the business idea and the person behind it. Then he starts the creative process and a couple days later you get a list with brilliant naming ideas together with detailed comments.
28. **[ABOUT-REVIEW-28]** 🇯🇵 Japan · Brand Strategy —
    > This was the third time I worked with him, and his work has been always very professional. I am very satisfied.
29. **[ABOUT-REVIEW-29]** 🇺🇸 United States · Websites & Digital Design —
    > Great working with this seller.
30. **[ABOUT-REVIEW-30]** 🇨🇿 Czech Republic · Brand Strategy —
    > He's definitely a pro. Not only that I got a bunch of pretty good naming suggestions for my business, I've also learned a lot. The questions he asked made me think even more about my business. He's got a lot of experience and is absolutely worth the money.
31. **[ABOUT-REVIEW-31]** 🇦🇹 Austria · Brand Strategy —
    > Awesome work, done by an awesome seller — absolutely recommended!
32. **[ABOUT-REVIEW-32]** 🇺🇸 United States · Brand Strategy —
    > This gig is awesome! Does not just throw names — everything has real meaning. You get what you pay for. This is not cheap, but if you're building a real brand you gotta take this gig.
33. **[ABOUT-REVIEW-33]** 🇺🇸 United States · Pitch Decks & Presentations —
    > Shai is the most talented PowerPoint slide presentation preparer I have ever worked with, and I have given a lot of presentations. He was prompt, concise, artistic and easy to work with. I recommend Shai wholeheartedly.
34. **[ABOUT-REVIEW-34]** 🇺🇸 United States · Brand Strategy —
    > Thank you so much, Shai, for delivering incredible work! It's tough to decide which one to use because all of them are great taglines.
35. **[ABOUT-REVIEW-35]** 🇶🇦 Qatar · Brand Strategy —
    > What a fantastic experience! Great communication, great service and attention to detail excellent. Will definitely be using again. Many thanks.
36. **[ABOUT-REVIEW-36]** 🇺🇸 United States · Brand Strategy —
    > I didn't expect to be moved by Shai's work, but I was. His selections were thoughtful and nuanced, and the notes he provided beautifully summarized the thought process behind each one. He greatly exceeded my expectations, and from his ideas, I've found the name of my business.
37. **[ABOUT-REVIEW-37]** 🇺🇸 United States · Pitch Decks & Presentations —
    > Very professional, receptive to suggestions, prompt in delivery timeline. Overall a great experience.
38. **[ABOUT-REVIEW-38]** 🇹🇭 Thailand · Brand Strategy —
    > Naming is a very important part of any business startup. For me as a creative business owner that was really hard to delegate. The professionalism of that viewer (and creator) is crucial.
39. **[ABOUT-REVIEW-39]** 🇮🇳 India · Brand Strategy —
    > Earlier I tried quite a few tagline/slogan sellers on Fiverr and I was very disappointed. Somehow, I came across Startle Labs, and I thought why not give a final try before deleting my Fiverr account. Glad I did. His service stands out from the rest. His work is exceptional!
40. **[ABOUT-REVIEW-40]** 🇨🇭 Switzerland · Brand Strategy —
    > It was truly an outstanding experience! He delivered the most awesome names which I will use for my product. Great job! Just awesome!

### 4.6 — Portfolio
- **[ABOUT-PORTFOLIO-EYEBROW]** ► `Portfolio`
- **[ABOUT-PORTFOLIO-HEADING]** ► `Work we've shipped`
- **[ABOUT-PORTFOLIO-BODY]** ►
  > A living archive of the brands we've helped build, rebuild, and sharpen. Browse recent work and filter by industry, service, or year.
- _(embeds a Notion gallery — the embed URL is config, not copy.)_

### 4.7 — FAQs
- **[ABOUT-FAQ-EYEBROW]** ► `FAQs`
- **[ABOUT-FAQ-SUB]** ► `The questions we hear most.`

1. **[ABOUT-FAQ-1-Q]** `What types of companies do you work with?`
   **[ABOUT-FAQ-1-A]** ►
   > We work best with founders and leadership teams who are serious about their brand and willing to be challenged. Our clients range from pre-launch startups to established companies going through a rebrand.
2. **[ABOUT-FAQ-2-Q]** `How long does a typical project take?`
   **[ABOUT-FAQ-2-A]** ►
   > A full brand identity engagement typically runs 6–10 weeks from kick-off to final delivery. Smaller projects like brand audits or visual refreshes can be completed in 2–4 weeks.
3. **[ABOUT-FAQ-3-Q]** `Do you only do visual identity, or do you handle strategy too?`
   **[ABOUT-FAQ-3-A]** ►
   > Both — and we'd argue you can't do one well without the other. Every project starts with a strategy phase that shapes all the creative work that follows.
4. **[ABOUT-FAQ-4-Q]** `What does the process look like?`
   **[ABOUT-FAQ-4-A]** ►
   > We start with discovery (research, stakeholder interviews, competitive audit), move into strategy (positioning, messaging, brand pillars), then into design. We work in collaborative rounds with feedback loops built in throughout.
5. **[ABOUT-FAQ-5-Q]** `How much does a project cost?`
   **[ABOUT-FAQ-5-A]** ►
   > Projects start at $15K for brand identity and scale based on scope and complexity. We're transparent about pricing from the first conversation — no surprises.
6. **[ABOUT-FAQ-6-Q]** `Can you help us after the brand launches?`
   **[ABOUT-FAQ-6-A]** ►
   > Yes. We offer a brand stewardship retainer for clients who want ongoing support applying the identity across channels, reviewing materials, and evolving the system over time.

### 4.8 — Closing CTA
- **[ABOUT-CTA-HEADING]** ► `Ready to build something worth noticing?`
- **[ABOUT-CTA-BUTTON]** ► `Start a project` _(links to /contact)_

> ⚠️ **Note:** `about.ts` also contains a `timeline` block (milestones 2019–2026) that is **no longer rendered** (the Timeline section was removed). If you want it back, let me know — otherwise it's dead copy and I'll leave it out of edits.

---

## 5 — Contact Page (`/contact`)

> _Source: `src/app/contact/page.tsx` (all copy hardcoded here)._

### 5.1 — Hero
- **[CONTACT-EYEBROW]** ► `Get in touch`
- **[CONTACT-HEADING]** ► `Yalla.`
- **[CONTACT-BODY]** ►
  > Tell us what you're working on. We answer fast — usually same day, always before you start regretting sending it.
- **[CONTACT-EMAIL]** (CTA pill + mailto) ► `hello@startlelabs.com`

### 5.2 — Prompt cards ("Tell us what brought you here")
- **[CONTACT-PROMPTS-HEADING]** ► `Tell us what brought you here.`
- **[CONTACT-PROMPTS-SUB]** ► `Pick the one that fits — or write your own.`
- **[CONTACT-CARD-CTA]** (repeated on each card) ► `Start a thread`

1. **[CONTACT-CARD-1-TITLE]** `A new brand from scratch` —
   > Naming, identity, the works — you've got an idea, we've got the kit.
2. **[CONTACT-CARD-2-TITLE]** `A pitch you need to nail` —
   > Investor decks, sales decks, founder narrative, on a deadline.
3. **[CONTACT-CARD-3-TITLE]** `A site that finally fits` —
   > Marketing pages, product UI, art direction. Built for connection.

### 5.3 — Tail (alternate channels)
- **[CONTACT-TAIL-1-LABEL]** `Elsewhere` → links: `LinkedIn` · `Instagram` · `Twitter`
- **[CONTACT-TAIL-2-LABEL]** `HQ` →
  > Tel Aviv, IL
  > Working with founders worldwide.
- **[CONTACT-TAIL-3-LABEL]** `Response time` →
  > Usually within 4 hours
  > Sun – Thu, 9 to 7 IDT

---

## 6 — Interactive Venn Diagram (shared component)

> Appears on the homepage About panel, the About page, and a standalone reference page (`/values-venn`).
> _Source: `src/components/about/InteractiveVennCanvas.tsx` & `src/components/about/ValuesVennHero.tsx`._

### Region labels (the brand "values")
- **[VENN-1]** `Connection` · **[VENN-2]** `Curiosity` · **[VENN-3]** `Confidence` _(the three main circles)_
- **[VENN-4]** `Empathy` · **[VENN-5]** `Leadership` · **[VENN-6]** `Artistry` _(the pairwise overlaps)_
- **[VENN-7]** `Creativity` _(the center — where all three meet)_

### Hover "formula" captions
- **[VENN-F-1]** ► `connection`
- **[VENN-F-2]** ► `curiosity`
- **[VENN-F-4]** ► `confidence`
- **[VENN-F-3]** ► `curiosity + connection = empathy`
- **[VENN-F-5]** ► `connection + confidence = leadership`
- **[VENN-F-6]** ► `curiosity + confidence = artistry`
- **[VENN-F-7]** ► `curiosity + confidence + connection = creativity`

### UI controls
- **[VENN-REPLAY]** (button) ► `Replay intro`

### Standalone reference page meta (`/values-venn`)
_Source: `src/app/values-venn/page.tsx`_
- **[VENN-PAGE-TITLE]** ► `Well-Rounded Values — Startle Labs`
- **[VENN-PAGE-DESC]** ► `Interactive reference: the three brand values animate in over a timeline, and every region names itself on rollover.`

---

## ⚠️ Placeholder / TODO copy summary

These are the spots flagged as incomplete in the code — good candidates for a copy pass:

| Where | What's missing |
|---|---|
| All 3 service pages → testimonials | Real client quotes (currently "Placeholder testimonial — real copy coming soon.") |
| All 3 service pages → principles intro | Real intro paragraph (currently Lorem ipsum) |
| All 3 service pages → closing CTA body | Real closing copy (currently "Placeholder body — real closing copy coming soon.") |

---

_End of copy inventory. Edit freely and hand back — I'll map every `[ID]` to its source and update the site._
