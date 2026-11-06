# Isaiah Hawkins — Portfolio

An interactive space portfolio: Hello dissolves into particles, Isaiah’s name types in, featured projects shine as bright stars, and Current work appears as planets. An open list view, full case studies, and a browser-local portfolio guide remain available.

## Files

- `index.html`: page structure, introduction, about, contact, and accessible dialogs.
- `style.css`: base responsive layout and typography.
- `space.css`: dark cosmic palette, accessible star/planet destinations, mobile constellation, and motion controls.
- `intro.js`: multilingual Hello sampled into particles that disperse into the starfield; replay, skip/Escape, reduced-motion bypass, and a fail-safe. Name typing starts after the reveal.
- `app.js`: typing, portfolio filters/search, case studies, and chat interface.
- `space.js`: procedural starfield and planet textures, slow stellar drift, pointer depth, occasional shooting stars, constellation filters, keyboard-accessible destinations, and pause/reduced-motion/visibility handling.
- `project-view.js`: full-screen cosmic project destinations, circular entry transitions from the selected object, previous/next navigation, Escape, source focus and scroll preservation, and deep-link handling.
- `lake.js`: retained earlier water experiment; no longer loaded by the page.
- `guide.js`: browser-local chatbot retrieval and conversation context. No AI provider, key, external chat request, analytics, or persistent chat history.
- `content.json`: project and experience facts, shared by project views and the chatbot.
- `profile.json`: skills, academic details, organizations, and recognition recovered from the prior site.
- `assets/morning-lake.webp`: retained earlier artwork; not used in the current design.
- `assets/Isaiah-Hawkins-Resume.pdf`: supplied résumé.

## Content and navigation

The home page highlights Quantitative Analyst Intern at SC Capital, Visible (Founder · Builder; independent hackathon project), and Protein Function Predictor. TerraSite is in the work archive, not Current. WaterSight is its final “Preliminary idea” section, with no standalone project entry; old WaterSight deep links open TerraSite. The protein study is explicitly in development; hypotheses and planned evaluation are not presented as achieved results.

The archive includes Selected, All, Current, Internships, Research, Projects, Academics, Skills, and Leadership. Search applies within the active category. Every project opens its full case study, and project deep links use `#project/<slug>`.

Bright stars highlight Disney/JARVIS, TerraSite, and LSAMP research. Planets represent exactly the three Current projects. The legend filters the map; List view opens the complete searchable archive. Smaller screens retain the six main destinations and a few smaller stars; the archive contains every entry.

## Chatbot

Visitors can ask about current work, projects, experience, skills, education, recognition, and contact details. Answers are assembled from the same portfolio facts and include links to supporting entries. Project context is retained for follow-ups. Unsupported questions return a clear limitation and a contact link. This is a local retrieval chatbot, not a generative language model or a live conversation with Isaiah. Chat is kept in memory only and can be cleared.

## Run and verify

Serve the repository with any static web server. No install or build step is needed. Run `python3 scripts/check.py` to validate local assets, JavaScript syntax, data constraints, and chatbot behavior. The guide checks also cover contextual follow-ups, comparisons, unsupported facts, current-project membership, and references.

The initial constellation received desktop and 390px phone browser QA. The subsequent animated destination update passed JavaScript syntax, content/constellation, chatbot, and project navigation contract checks (`node scripts/check-project-view.mjs`); browser visual QA was unavailable in that editing environment. Both the constellation and full-screen project destinations expose a synchronized pause control and honor reduced motion.

Project details now open as a borderless full-screen space scene with a large version of the selected star or planet and an open reading column. On phones, the celestial object appears above the story. Closing returns focus to the original destination without scrolling to the archive. Previous/next controls keep the original return point. Slow star breathing, planet floating, satellites, cursor depth, and occasional meteor trails add motion without moving clickable targets.

## Design references

Reviewed the [Developer Portfolios directory](https://6e87v.hatchboxapp.com/) and [Emma Bostian's collection](https://github.com/emmabostian/developer-portfolios). Reference patterns: [Brittany Chiang](https://brittanychiang.com/) for readable experience, [Dennis Snellenberg](https://dennissnellenberg.com/) for typography and open work lists, [Bruno Simon](https://bruno-simon.com/) for a memorable personal environment, and [Josh W. Comeau](https://www.joshwcomeau.com/) for useful interaction. These are widely featured examples, not a verified ranking by visitor counts. The greeting sequence also references [Aadarsh Rai](https://aadarshrai.vercel.app/): a dark overlay, centered dot and multilingual greeting, reinterpreted here as a particle-to-star transition. The animation code is implemented locally. No source code or imagery was copied from those portfolios.

## Deployment

Existing Vercel project: `bundled-page`, team `zay22`. GitHub: `isaiah7162/portfolio-`. Changes are saved to GitHub and deployed as Vercel previews. Production promotion and automatic Git deployment connection have not been configured by this update. The existing production domain remains unchanged.
