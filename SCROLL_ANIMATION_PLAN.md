# Scroll Animation Plan

## Recommendation

Use a small **IntersectionObserver + CSS transition** system. Do not add Framer Motion for the current scope.

This site is a static Next.js export with mostly server-rendered sections that fetch Strapi content at build time. The animation system should preserve that architecture: server components render markup and static `data-*` attributes, while one tiny client component observes those elements and toggles visibility.

## Recommended Library Stack

- **No animation library for scroll reveals.**
- Use native `IntersectionObserver`.
- Use CSS transitions in `app/globals.css`.
- Keep Tailwind for layout, spacing, hover states, and color.
- Optional later only: `@react-aria/visually-hidden` is not needed for this work.

Avoid:

- `framer-motion`: too much client runtime for simple reveal effects.
- Scroll listeners for reveal behavior.
- Scroll-jacking, parallax-heavy scenes, or page transition frameworks.
- GSAP unless future requirements become complex animation sequences.

## Core Implementation

Add one client component:

```tsx
// components/ScrollReveal.tsx
"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        el.dataset.revealVisible = "true";
      });
      return;
    }

    document.documentElement.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          target.dataset.revealVisible = "true";
          observer.unobserve(target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
```

Mount once in `app/layout.tsx`, near `ScrollToTop`.

Add global CSS:

```css
[data-reveal] {
  opacity: 1;
  transform: none;
}

.reveal-ready [data-reveal] {
  opacity: 0;
  transform: translate3d(0, 16px, 0);
  transition:
    opacity var(--reveal-duration, 360ms) var(--reveal-ease, cubic-bezier(0.2, 0, 0, 1)),
    transform var(--reveal-duration, 360ms) var(--reveal-ease, cubic-bezier(0.2, 0, 0, 1));
  transition-delay: var(--reveal-delay, 0ms);
  will-change: opacity, transform;
}

.reveal-ready [data-reveal="fade"] {
  transform: none;
}

.reveal-ready [data-reveal="slide-left"] {
  transform: translate3d(18px, 0, 0);
}

.reveal-ready [data-reveal="slide-right"] {
  transform: translate3d(-18px, 0, 0);
}

.reveal-ready [data-reveal="scale"] {
  transform: scale(0.98);
}

.reveal-ready [data-reveal][data-reveal-visible="true"] {
  opacity: 1;
  transform: translate3d(0, 0, 0) scale(1);
  will-change: auto;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.001ms !important;
  }

  .reveal-ready [data-reveal],
  [data-reveal] {
    opacity: 1;
    transform: none;
    transition: none;
    will-change: auto;
  }
}
```

Static input pattern:

```tsx
<section data-reveal="fade">
  ...
</section>

<div
  data-reveal="item"
  style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
>
  ...
</div>
```

Use delays sparingly: `0ms`, `60ms`, `120ms`, `180ms`. Avoid long cascades and cap total stagger delay at `240ms`.

Suggested motion tokens:

```css
:root {
  --motion-fast: 150ms;
  --motion-base: 240ms;
  --motion-slow: 360ms;
  --motion-ease: cubic-bezier(0.2, 0, 0, 1);
  --reveal-distance: 16px;
  --reveal-stagger: 60ms;
}
```

## Animation Types

| Name | Use | CSS behavior |
|---|---|---|
| `fade` | Hero text, article body, static content | opacity only |
| `item` | Cards, list rows, CTA content | fade + translateY(16px) |
| `slide-left` | Right-side images/content entering from right | fade + translateX(18px) |
| `slide-right` | Left-side images/content entering from left | fade + translateX(-18px) |
| `scale` | Small icons/stats only | fade + scale(0.97) |

## Global Rules

- Animate only `opacity` and `transform`.
- Reveal once, then unobserve.
- Keep hero above-the-fold animation minimal; hero content should be readable immediately and only receive a short load/reveal polish.
- Never animate layout properties such as height, width, margin, top, left, or scroll position.
- Do not animate every paragraph. Animate section groups and key cards.
- Section reveal should clarify hierarchy, not decorate.
- Avoid parallax on large images for now.

## Homepage Sections

File: `app/page.tsx`

| Section | Animate? | Animation | UX purpose | Static input |
|---|---:|---|---|---|
| `HeroStrapi` | Yes | Hero copy `fade`; arched image `slide-left`; stats `item` stagger | Establish premium first impression without delaying comprehension | Add `data-reveal="fade"` to text block, `slide-left` to image shell, `item` to stats |
| `ServicesSection` | Yes | Header `slide-right`; service items `item` stagger | Make service grid easier to scan from left intro to right options | Header div `slide-right`; each service `item` with 80ms stagger |
| `AboutSection` | Yes | Image `slide-right`; copy `slide-left` | Reinforce image/story relationship | Image wrapper `slide-right`; content wrapper `slide-left` |
| `NivelesSection` | Yes | Heading `fade`; level cards `item` stagger | Draw parent attention to education levels as decision points | Heading block `fade`; each level link/card `item` |
| `ValuePropositionSection` | Yes | Header `slide-right`; value rows `item`; image `slide-left` | Support sequential reading of proof points | Header `slide-right`; rows `item`; image shell `slide-left` |
| `TestimonialsSection` | Limited | Section header `fade`; testimonial cards should not scroll-reveal individually if marquee stays active | Avoid competing motion with carousel | Header `fade`; carousel container no reveal or simple `fade` |
| `CTASection` | Yes | CTA panel `scale`; text/buttons no separate heavy animation | Make final action feel intentional | Outer colored panel `data-reveal="scale"` |

## About Page Sections

File: `app/acerca/page.tsx`

| Section | Animate? | Animation | UX purpose | Static input |
|---|---:|---|---|---|
| Hero | Yes, minimal | Hero text `fade` | Preserve readability on image background | Text container `data-reveal="fade"` |
| Main content image/text | Yes | Image `slide-right`; text `slide-left` | Guide eye from school image to explanation | Image wrapper and copy wrapper |
| Mission & values sticky section | Yes | Sticky header `slide-right`; content blocks `item` | Clarify long two-column reading flow | Left sticky block `slide-right`; right blocks `item` |
| Overlapping image | Yes | Image `scale` | Emphasize visual transition between mission and journey | Image container `scale` |
| Journey section | Yes | Header `slide-right`; paragraphs `item` | Improve pacing in text-heavy section | Header and paragraph group |
| CTASection | Yes | `scale` | Final conversion emphasis | Existing CTA plan |

## Services Page Sections

File: `app/servicios/page.tsx`

| Section | Animate? | Animation | UX purpose | Static input |
|---|---:|---|---|---|
| Hero | Yes, minimal | Hero text `fade` | Keep the page title clear and polished | Hero content `fade` |
| Service rows | Yes | Image alternates `slide-right`/`slide-left`; copy opposite; number `scale` | Reinforce alternating editorial rhythm without distraction | Per row image/content wrappers with direction based on index |

Important: remove `console.log` statements from `ServicesPage` during any implementation pass; they are unrelated to animation and noisy in builds.

## Contact Page Sections

File: `app/contacto/page.tsx`

| Section | Animate? | Animation | UX purpose | Static input |
|---|---:|---|---|---|
| Header | Yes | `fade` | Calmly introduce the contact task | Header `data-reveal="fade"` |
| Contact form | Yes | `slide-right` or `item` | Prioritize the primary interaction | Form wrapper `slide-right` |
| Contact info card | Yes | `slide-left` | Secondary support information follows the form | Info card wrapper `slide-left` |
| Contact info rows | No initially | Existing hover/focus only | Avoid excessive movement in utility content | No reveal on every row |
| Map | Yes | `fade` | Reveal location after form/contact context | Map section `fade` |

## Blog Listing Sections

Files: `app/blog/page.tsx`, `app/blog/BlogFilter.tsx`

| Section | Animate? | Animation | UX purpose | Static input |
|---|---:|---|---|---|
| Blog hero | Yes | Inner hero card `fade` | Lightweight polish on static hero | Hero content/card `fade` |
| Category filters | Optional | `fade` | Avoid motion around controls unless subtle | Filter container `fade` only |
| Blog post cards | Yes | `item` stagger by row | Help scanning card grid | Each card `item`, small delays reset per row |

Do not animate filter state changes with scroll reveal. Filtering should feel immediate.

## Blog Detail Sections

File: `app/blog/[slug]/page.tsx`

| Section | Animate? | Animation | UX purpose | Static input |
|---|---:|---|---|---|
| Article heading/meta | Yes | `fade` | Introduce article without motion clutter | Heading wrapper `fade` |
| Header image | Yes | `scale` | Soft editorial polish | Image wrapper `scale` |
| Excerpt | Yes | `fade` | Emphasize summary before long content | Excerpt wrapper `fade` |
| Article body | No | Static | Reading content should not animate paragraph by paragraph | No reveal |
| Related posts | Yes | `item` cards | Surface next actions | Related cards `item` |
| Share sidebar | No | Static/sticky only | Avoid distracting from reading | No reveal |

## Nivel Detail Sections

File: `app/niveles/[id]/NivelContent.tsx`

| Section | Animate? | Animation | UX purpose | Static input |
|---|---:|---|---|---|
| Hero | Yes, minimal | Copy `fade`; buttons `item` | Strong landing moment per level | Copy block `fade`; button group `item` |
| Promise | Yes | Icon `scale`; heading/text `fade` | Emotional anchor after hero | Icon `scale`; text block `fade` |
| Developmental areas | Yes | Header `fade`; area rows `item` stagger | Make long capability list scannable | Header `fade`; rows `item` |
| MasonryGallery | Yes, limited | Gallery container `fade`; images keep existing hover zoom | Avoid many simultaneous image animations | Gallery wrapper `fade` only |
| Learning outcomes | Yes | Icon block `slide-right`; content `slide-left`; outcome rows `item` | Guide parent through outcome proof | Wrappers and rows |
| Testimonial | Yes | Quote card `scale` | Highlight parent proof | Quote card `scale` |
| Final CTA | Yes | Text block `fade`; buttons `item` | Conversion moment | CTA content `fade` |

Because `NivelContent` is already a client component, avoid adding another observer inside it. The global `ScrollReveal` should handle its static attributes.

## Shared Components

| Component | Recommendation |
|---|---|
| `Navbar` | Do not scroll-reveal. Keep sticky and stable. Current menu transitions are fine. |
| `TopBar` | Do not animate. Utility contact content should stay stable. |
| `Footer` | Optional `fade` on footer columns, but lower priority. |
| `ScrollToTop` | Respect reduced motion: use instant scroll when `prefers-reduced-motion: reduce`. Current scroll listener is acceptable but can be passive. |
| `MasonryGallery` | Keep hover image zoom; add only container-level `fade`. |
| `ContactForm` | Do not animate individual fields. Animate the form container only. |

## Testimonials Performance Fix

`components/TestimonialsSection.tsx` currently runs a continuous `requestAnimationFrame` loop and writes `scrollLeft` every frame. This is the highest-priority motion/performance issue.

Recommended behavior:

- If `prefers-reduced-motion: reduce`, disable auto-scroll.
- Pause auto-scroll when the section is offscreen.
- Pause on hover and focus-within.
- Update hint text so it is not mouse-only.
- Consider replacing the RAF loop with a CSS transform marquee later.

Implementation shape:

```tsx
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const visibilityObserver = new IntersectionObserver(([entry]) => {
  isVisible = entry.isIntersecting;
  if (isVisible && !prefersReducedMotion.matches && !isPaused) startScroll();
  else stopScroll();
});
```

Do not combine testimonial card reveal with continuous carousel movement.

## Component-Level Implementation Recommendations

1. Add `components/ScrollReveal.tsx`.
2. Mount it once in `app/layout.tsx`.
3. Add reveal CSS to `app/globals.css`.
4. Apply `data-reveal` attributes directly in existing server components. This does not require converting them to client components.
5. Use a tiny helper only if repetition becomes noisy:

```ts
export const revealDelay = (index: number, step = 80) =>
  ({ "--reveal-delay": `${Math.min(index * step, 240)}ms` }) as React.CSSProperties;
```

6. Prefer component-level static attributes over prop-driven animation systems for now.
7. Add reveal support first on homepage, then repeat the same pattern on inner pages.

## Accessibility Considerations

- Respect `prefers-reduced-motion` globally.
- Do not hide content indefinitely if JavaScript fails. The CSS should be scoped so content remains usable; if this risk is unacceptable, add a `js` class to `documentElement` and only apply hidden reveal states when JS is active.
- Do not animate form fields individually.
- Keep focus states visible and unaffected by transforms.
- Do not move focused elements while keyboard users are interacting.
- Avoid motion on sticky navigation, share sidebars, and utility contact bars.
- Make testimonial auto-scroll pausable by keyboard focus, not only hover.
- Do not rely on animation to communicate meaning.
- Keep most durations in the `240ms-360ms` range; reserve up to `450ms` for large image reveals.
- Avoid stagger delays beyond `240ms` total.
- Smooth scrolling should be disabled for reduced-motion users.

## Performance Considerations

- One observer for all `[data-reveal]` elements.
- Unobserve elements after reveal.
- Animate only `opacity` and `transform`.
- Avoid `will-change` staying active after reveal.
- Do not create one client wrapper per section.
- Do not add dependencies for simple reveal behavior.
- Keep large image motion subtle; no continuous parallax.
- Test with `npm run build` because the site deploys as static export.

## Rollout Plan

1. Fix `TestimonialsSection` motion and reduced-motion behavior.
2. Add `ScrollReveal` and global CSS.
3. Apply homepage reveal attributes.
4. Build and visually test desktop/mobile.
5. Apply the same system to about, services, contact, blog, and nivel pages.
6. Audit reduced-motion and keyboard behavior.
7. Consider deeper animation only after real school imagery/content is finalized.
