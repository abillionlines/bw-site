# Brian Wilkinson — Official Site

Personal artist website for Brian Wilkinson, built around the _Still Water_ album release.

## Tech Stack

- **React + Vite** — component-based UI with fast dev server and optimized production builds
- **GSAP + ScrollTrigger** — all scroll-driven animations and section transitions
- **Framer Motion** — curtain intro and modal transitions
- **Supabase Auth** — password-protected site gate for pre-release access control
- **Google Fonts** — Michroma (site-wide), Love Light (Still Water titles)

## Sections

| Section              | Description                                                                  |
| -------------------- | ---------------------------------------------------------------------------- |
| **Hero**             | Full-screen image carousel intro                                             |
| **Transition Scene** | GSAP-animated photo grid overlay between Hero and Hear                       |
| **Hear**             | Music player with animated "Still Water" title and scroll-driven wave effect |
| **Watch**            | Featured video + scrollable thumbnail row with fullscreen modal              |
| **Bio**              | Scroll-reveal biography with Watch→Bio zoom transition                       |
| **Contact**          | Contact section with pinned footer                                           |

## Pre-Release Gate

The site is fully hidden behind a login screen until the release date. Only authenticated Supabase users can access the site. To remove the gate on launch, delete the `if (!session)` block in `src/App.jsx`.
