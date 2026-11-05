# 3D Portfolio Website (Three.js + Vite)

Solo project. Live: https://sameersinghcode.github.io/3D-Portfolio-Website-1/. GitHub Actions deploys on every push to `main` that touches `MY-3D-Project1/`.

## Map
- App: `MY-3D-Project1/` (run npm there). Textures live in `public/` and are loaded by bare filename.
- `main.js` holds the whole scene: torus, 200 stars, avatar cube `jeff` (sam.png), moon (moon.jpg + normal.jpg), space.jpg background, scroll camera `moveCamera()`, `animate()` loop.
- `index.html` has only `<canvas id="bg">`. `style.css` is 5 lines. `vite.config.js` sets `base: './'`.
- `docs/ROADMAP.md`: prioritized backlog with recipes. This is the source of truth for what to do next.
- `scripts/shot.mjs`: optional desktop + mobile screenshots to `shots/`.

## Skills
- `/next [id]`: top roadmap item → build → tick → commit → push (deploys).
- `/ship [msg]`: commit + push current changes.
- `/idea <text>`: append to the roadmap Inbox.

## Rules
- Minimize tokens: terse replies, no recaps, read only the lines you need, don't explore beyond the Map.
- Smallest correct change; fix root causes; no fallbacks.
- Only check is `npm run build`. No screenshots unless asked.
- Deploy = `git push origin HEAD:main`.

# Compact instructions
Keep: current roadmap item, files changed, build errors. Drop: file dumps and research.
