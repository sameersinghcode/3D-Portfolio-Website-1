# SS//FILMS — Futuristic 3D Videography Portfolio

A cinematic, futuristic portfolio for a videographer/filmmaker, built with
[three.js](https://threejs.org/) and [Vite](https://vitejs.dev/).

Scrolling drives a camera flight through a real-time 3D world — past a glowing
torus-knot centerpiece, through a neon ring tunnel over an animated wireframe
terrain, toward a distant magenta sun — while the page content (showreel,
selected works, about, services, contact) reveals itself along the way.

## Features

- **Scroll-driven 3D camera** — keyframed flight path smoothed with easing
- **Cinematic post-processing** — Unreal bloom, film grain, scanlines, letterboxing, vignette
- **Reactive elements** — mouse-parallax camera, 3D-tilt cards, magnetic custom cursor, animated stat counters, reveal-on-scroll sections
- **Fully responsive** — mobile nav, adaptive 3D scale for portrait screens, touch-aware (cursor/parallax disabled on touch)
- **Accessible motion** — honors `prefers-reduced-motion`

## Run it

```bash
cd MY-3D-Project1
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
```
