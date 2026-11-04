# Isaiah Hawkins — Portfolio

A spacious, typography-led portfolio with a serene morning lake, a typed name introduction, open project rows, full case studies, and a visitor chatbot that answers from the published portfolio.

## Files

- `index.html`: page structure, introduction, about, contact, and accessible dialogs.
- `style.css`: responsive ivory/sage design, typography, and reduced-motion behavior.
- `intro.js`: multilingual hello screen, curved reveal, skip/Escape support, reduced-motion bypass, and a fail-safe. Name typing starts after the reveal.
- `app.js`: typing, portfolio filters/search, case studies, and chat interface.
- `lake.js`: animated water reflections; respects pause, visibility, and reduced motion.
- `guide.js`: browser-local chatbot retrieval and conversation context. No AI provider, key, external chat request, analytics, or persistent chat history.
- `content.json`: project and experience facts, shared by project views and the chatbot.
- `profile.json`: skills, academic details, organizations, and recognition recovered from the prior site.
- `assets/morning-lake.webp`: existing generated landscape artwork.
- `assets/Isaiah-Hawkins-Resume.pdf`: supplied résumé.

## Content and navigation

The home page highlights Quantitative Analyst Intern at SC Capital, Visible (Founder · Builder; independent hackathon project), and Protein Function Predictor. TerraSite is in the work archive, not Current. WaterSight is its final “Preliminary idea” section, with no standalone project entry; old WaterSight deep links open TerraSite. The protein study is explicitly in development; hypotheses and planned evaluation are not presented as achieved results.

The archive includes Selected, All, Current, Internships, Research, Projects, Academics, Skills, and Leadership. Search applies within the active category. Every project opens its full case study, and project deep links use `#project/<slug>`.

## Chatbot

Visitors can ask about current work, projects, experience, skills, education, recognition, and contact details. Answers are assembled from the same portfolio facts and include links to supporting entries. Project context is retained for follow-ups. Unsupported questions return a clear limitation and a contact link. This is a local retrieval chatbot, not a generative language model or a live conversation with Isaiah. Chat is kept in memory only and can be cleared.

## Run and verify

Serve the repository with any static web server. No install or build step is needed. Run `python3 scripts/check.py` to validate local assets, JavaScript syntax, data constraints, and chatbot behavior. The guide checks also cover contextual follow-ups, comparisons, unsupported facts, current-project membership, and references.

Local browser QA covered desktop and a 390px phone layout, project details, category filtering, search, typed-name completion, chatbot answers and links. Motion has a pause control and reduced-motion handling.

## Design references

Reviewed the [Developer Portfolios directory](https://6e87v.hatchboxapp.com/) and [Emma Bostian's collection](https://github.com/emmabostian/developer-portfolios). Reference patterns: [Brittany Chiang](https://brittanychiang.com/) for readable experience, [Dennis Snellenberg](https://dennissnellenberg.com/) for typography and open work lists, [Bruno Simon](https://bruno-simon.com/) for a memorable personal environment, and [Josh W. Comeau](https://www.joshwcomeau.com/) for useful interaction. These are widely featured examples, not a verified ranking by visitor counts. The greeting sequence also references [Aadarsh Rai](https://aadarshrai.vercel.app/): a dark overlay, centered dot and multilingual greeting, followed by a curved upward reveal. The animation code is implemented locally. No source code or imagery was copied from those portfolios.

## Deployment

Existing Vercel project: `bundled-page`, team `zay22`. GitHub: `isaiah7162/portfolio-`. Changes are saved to GitHub and deployed as Vercel previews. Production promotion and automatic Git deployment connection have not been configured by this update. The existing production domain remains unchanged.
