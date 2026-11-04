# Isaiah Hawkins · iisaiah.com

The original tabbed portfolio and waterfront scene, recovered from the live site, with icons removed and updated experience from the November 2, 2026 résumé and current project context. React and the original rendering runtime are bundled locally. The broader redesign is deferred.

## Preview

Run `python3 -m http.server 8000` from this directory, then open http://localhost:8000.

## Update

- `index.html`: original template, inline project data, tab logic, skills, and waterfront scene.
- `content.json`: matching project data snapshot. Keep this and the inline PROJECTS array synchronized when editing entries.
- `assets/`: recovered fonts, React, original runtime, and latest résumé PDF.
- Tabs: Current, Internships, Research, Projects, Academics, Skills, Leadership. Current is the default tab and uses the explicit `current: true` flag on project records.
- Updated entries: Disney, SC Capital (Quant Analyst under Internships and Research), TerraSite, Visible, the protein function predictor (Research and Projects), LSAMP, and the hackathon record.

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
python3 scripts/check.py
```

The Python check verifies local assets, unique project slugs, icon removal, JavaScript syntax, and tab data. It does not replace visual or browser interaction testing.

## Content notes

Updated November 4, 2026. The latest résumé is the authority for employment, research results, technical skills, TerraSite, and hackathon placements. Visible is an independent hackathon project with the role Founder · Builder, presented as a prototype using illustrative data. Current includes SC Capital, Visible, and the protein function predictor; TerraSite remains under Projects. On Record, Vista, FinSight, and TACC descriptions are recovered from the public website. The Disney summary uses the résumé's high-level description. No performance claims have been invented. The résumé's degree wording differs from the former site, so the portfolio uses “computer science” without expanding a degree abbreviation.
