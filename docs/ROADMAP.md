# Roadmap

`/next` does the first unchecked item. One item = one session. Notes are the recipe, so no research needed.

## Now

- [x] R1 Auto-deploy to GitHub Pages: `.github/workflows/deploy.yml`, `vite.config.js` (`base: './'`), textures moved to `public/`.
- [ ] R2 Correct colors + responsive canvas (`main.js`)
  - For each color texture (space, sam, moon; not normal) set `tex.colorSpace = THREE.SRGBColorSpace;`, since three ≥0.152 renders them washed out otherwise.
  - `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));`
  - `window.addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });`
- [ ] R3 Page content so the scroll animation works (`index.html`, `style.css`)
  - Needs from user: name, tagline, short bio, 3 projects (title, one line, link), contact links.
  - `<main>` after the canvas: `<header>` (name + tagline), then sections About / Projects / Contact; at least 3 screens tall so `moveCamera()` has range.
  - CSS: `canvas{position:fixed;top:0;left:0}` `main{position:absolute;z-index:1;width:100%;color:#fff}`; sections: translucent dark bg, `max-width:700px`, `margin:50vh auto`, `padding:1rem`, system font.
- [ ] R4 Mobile framing (`main.js`)
  - The avatar fills portrait screens. Add `layout()`, called on load and in the resize handler: `const portrait = innerHeight > innerWidth;` portrait → `jeff.position.set(0, 0, -10); camera.fov = 90;` landscape → `jeff.position.set(2, 0, -5); camera.fov = 75;` then `camera.updateProjectionMatrix()`. Tune the numbers on the live site.
  - `moveCamera()` overwrites camera x/z from scroll, so `camera.position.setZ(30)` / `setX(-3)` are dead code; remove them.
- [ ] R5 Metadata + cleanup (`index.html`)
  - `<title>` = "<Name> | Portfolio"; `<meta name="description">`; Open Graph `og:title`, `og:description`, `og:image` (1200×630 `public/og.jpg`) for WhatsApp/LinkedIn previews.
  - Replace the `/vite.svg` favicon with `public/favicon.png`; use a relative href (`favicon.png`).
  - Delete unused: `counter.js`, `javascript.svg`, `jeff.png`, `public/vite.svg`.
- [ ] R6 Lighter textures for mobile
  - `normal.jpg` is 933 KB and `sam.png` 689 KB. Convert to WebP, max 1024 px (e.g. `npx sharp-cli -i public/normal.jpg -o public/normal.webp -f webp resize 1024`) and update filenames in `main.js`.
- [ ] R7 Upgrade deps (`package.json`)
  - `npm i three@latest && npm i -D vite@latest` (three 0.156→0.187, vite 4→8; vite 8 needs Node ≥20.19).
  - Remove the unused OrbitControls import (or use `three/addons/controls/OrbitControls.js`). `npm run build` must pass.

## Later
- Replace the avatar cube with a GLTF model (`GLTFLoader` from `three/addons/loaders/GLTFLoader.js`).
- Respect `prefers-reduced-motion` (stop auto-rotation).
- Custom domain (`public/CNAME`).

## Inbox
<!-- /idea appends here -->
