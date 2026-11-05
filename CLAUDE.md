# Project: 3D Portfolio Website (Three.js + Vite)

## Map
- App lives in `MY-3D-Project1/` (run npm commands there).
- `main.js` — whole scene: torus, 200 stars, `sam.png` avatar cube (var `jeff`), moon (`moon.jpg` + `normal.jpg`), `space.jpg` background, scroll-driven camera (`moveCamera`), `animate()` loop.
- `index.html` — only `<canvas id="bg">`. `style.css` — 5 lines. `counter.js` — unused Vite boilerplate.
- `scripts/shot.mjs` (repo root) — screenshots desktop + mobile.

## Commands
- First in a fresh session: `cd MY-3D-Project1 && npm ci`
- Dev: `npm run dev` · Build check: `npm run build`
- Screenshots: `node scripts/shot.mjs` → `shots/desktop.png`, `shots/mobile.png` (gitignored)

## Known issues (not yet fixed)
- Textures (`space.jpg`, `sam.png`, `moon.jpg`, `normal.jpg`) sit in project root, not `public/` → missing from `dist/` after build.
- Mobile: avatar cube fills most of the screen (camera not adapted to portrait).
- No resize handler; `<title>` is "Vite App"; favicon `/vite.svg`; no HTML content sections, so scroll animation never triggers.

## Working rules (user preferences)
- Minimize tokens: terse replies, no recaps, read only needed lines.
- Simple, surgical changes; fix root causes; fail fast; no fallbacks.
- User often works from mobile: verify visual changes with `node scripts/shot.mjs` and send `shots/mobile.png`.
- Commit/push only when asked.

## Quick prompts (paste these)
- **Task:** "Task: <change>. Use CLAUDE.md map, read only needed lines, smallest fix, run build, screenshot if visual, reply ≤3 lines."
- **Look:** "Run shot.mjs, send mobile.png."
- **Ship:** "Build, commit '<msg>', push."
- **Handoff:** "Append a line to Session log (date — done — next), commit, push."

## Session log
- 2026-11-05 — added CLAUDE.md + scripts/shot.mjs — next: fix Known issues
