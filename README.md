# Isaiah Hawkins · iisaiah.com

A dependency-free static portfolio, rebuilt from the existing site and updated using the November 2, 2026 résumé and current project context. The original waterfront canvas illustration is retained as standalone JavaScript.

## Preview

Run `python3 -m http.server 8000` from this directory, then open http://localhost:8000.

## Update

- `content.json`: project details and case studies.
- `index.html`: home-page cards, biography, skills, and recognition. When updating a project's title or summary, also update its home-page card.
- `style.css`: layout and visual style.
- `scene.js`: recovered waterfront illustration and animation control.
- `assets/Isaiah-Hawkins-Resume.pdf`: replace this file to update the résumé.

## GitHub and Vercel

Repository: https://github.com/isaiah7162/portfolio-

To connect a local checkout:

```sh
git remote add origin https://github.com/isaiah7162/portfolio-.git
git push -u origin main
```

In the existing Vercel project for iisaiah.com, connect this repository under Settings → Git. Select framework preset Other, use the repository root, leave the build command empty, and use `.` as the output directory. Keep the existing custom domain assigned to that project. If existing framework overrides are present, clear them to match this static configuration.

Use a branch and pull request for updates. Vercel can create preview deployments for pull requests and deploy the production branch after merge. The source is maintained on GitHub. Connecting the existing Vercel project is still required.

## Verification

```sh
node --check app.js
node --check scene.js
python3 scripts/check.py
```

The Python check verifies local page links, asset existence, unique project slugs, and a one-to-one mapping between home-page cards and case-study data. It does not replace visual or browser interaction testing.

## Content notes

Updated November 3, 2026. The latest résumé is the authority for employment, research results, technical skills, TerraSite, and hackathon placements. Visible is explicitly presented as a prototype using illustrative data. On Record, Vista, FinSight, and TACC descriptions are recovered from the public website. The Disney summary uses the résumé's high-level description. No performance claims have been invented. The résumé's degree wording differs from the former site, so the portfolio uses “computer science” without expanding a degree abbreviation.
