# Isaiah Hawkins — Portfolio

A paper-desk portfolio. The page is one desk: an index card with Isaiah's name and links, six sticky notes for featured work, a strip for hackathon placings, and a folder holding everything else. Picking something up opens it as a sheet of paper. A sticky-note "Hello" covers the desk on the first visit of a session and peels away.

## Files

- `index.html`: the hello notes, the desk (index card, featured notes, hackathon strip, folder), and the empty sheet view.
- `desk.css`: all styling. Local fonts only (Space Grotesk for body, Caveat for handwriting).
- `hello.js`: the sticky-note greeting. Shown once per browser session; skipped on deep links and when reduced motion is requested; Skip button, Escape, a "Replay hello" control, and a fail-safe so it can never block the page.
- `desk.js`: hash routing and rendering of opened papers from the JSON data.
- `content.json`: project and experience facts.
- `profile.json`: skills, education, organizations, coursework, certifications, and recognition.
- `assets/`: fonts, favicon, social image, and `Isaiah-Hawkins-Resume.pdf`.

## Routes

- `#desk` (or no hash): the desk.
- `#project/<slug>`: one entry from `content.json` as a paper sheet. Featured notes page through each other; other entries page through the folder. `#project/watersight` opens TerraSite, where WaterSight is described as the preliminary idea. An unknown slug opens the folder with a short note.
- `#everything`: the folder, listing every entry that is not a featured note, grouped by category.
- `#about`: education, skills, recognition, organizations, coursework, and certifications from `profile.json`.

Escape or "Back to the desk" returns to the desk. Opening a paper moves focus to its heading.

## Content rules

- The six featured notes are set in two places that must match: the note links in `index.html` and `featured` in `desk.js`. Currently: Disney, SC Capital, Protein Function Predictor, protein mutation prediction, pruning research, TerraSite.
- The Protein Function Predictor is in development; hypotheses and planned evaluation are not presented as results.
- Visible is an independent hackathon prototype with illustrative data, not a medical tool.
- WaterSight has no standalone entry.
- An entry may carry `images` (`src`, `alt`, `caption`); they render as figures on its sheet. The mutation study's figures are slides from Isaiah's own SC26 presentation.

## Run and verify

Serve the repository with any static web server (`python3 -m http.server 8000`). No install or build step. Run `python3 scripts/check.py` to validate local assets, script syntax, desk links, project facts, and the security headers.

The Content-Security-Policy in `vercel.json` allows only same-origin scripts, styles, and fonts: no inline `<script>`, `<style>`, or `style=""` attributes, and no external font or script hosts.

## Deployment

Vercel project `bundled-page`, team `zay22`. GitHub: `isaiah7162/portfolio-`. Static output from the repository root, no build command. Review a preview before promoting to the production domain (iisaiah.com).

## Credits

Caveat is licensed under the SIL Open Font License 1.1 (The Caveat Project Authors). The single-screen "site as an object" idea was drawn from desktop-style entries in [Emma Bostian's developer portfolios list](https://github.com/emmabostian/developer-portfolios); no code or imagery was copied.
