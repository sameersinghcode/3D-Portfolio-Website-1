import './style.css';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

/* ============================================================
   SS//FILMS — futuristic cinematic 3D portfolio
   Scroll drives the camera through a neon ring tunnel while
   the overlay UI tells the story.
   ============================================================ */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(pointer: coarse)').matches;

const COLORS = {
  cyan: 0x00f0ff,
  magenta: 0xff2d78,
  violet: 0x7c4dff,
  amber: 0xffb547,
};

/* ---------- Renderer / scene / camera ---------- */

const canvas = document.querySelector('#bg');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x030409);
scene.fog = new THREE.FogExp2(0x030409, 0.016);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 400);
camera.position.set(0, 0.6, 16);

/* ---------- Lights ---------- */

scene.add(new THREE.AmbientLight(0x223, 1.2));
const keyLight = new THREE.PointLight(COLORS.cyan, 60, 60);
keyLight.position.set(6, 6, 8);
scene.add(keyLight);
const rimLight = new THREE.PointLight(COLORS.magenta, 50, 60);
rimLight.position.set(-8, -4, -6);
scene.add(rimLight);

/* ---------- Hero centerpiece: wireframe torus knot ---------- */

const knot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(3.2, 0.9, 220, 32),
  new THREE.MeshStandardMaterial({
    color: 0x0a0f1a,
    emissive: COLORS.cyan,
    emissiveIntensity: 0.55,
    metalness: 0.9,
    roughness: 0.25,
    wireframe: true,
  })
);
const knotGroup = new THREE.Group();
knotGroup.position.set(0, 0, -5);
scene.add(knotGroup);
knot.position.set(0, 0.4, 0);
knotGroup.add(knot);

const knotCore = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.15, 1),
  new THREE.MeshStandardMaterial({
    color: 0x05060c,
    emissive: COLORS.magenta,
    emissiveIntensity: 1.6,
    metalness: 1,
    roughness: 0.1,
  })
);
knotCore.position.copy(knot.position);
knotGroup.add(knotCore);

// Keep the centerpiece from swallowing the hero text on narrow screens
function fitKnot() {
  const aspect = window.innerWidth / window.innerHeight;
  knotGroup.scale.setScalar(aspect < 0.8 ? 0.55 : aspect < 1.2 ? 0.8 : 1);
}
fitKnot();

/* ---------- Ring tunnel the camera flies through ---------- */

const rings = [];
const RING_COUNT = 16;
for (let i = 0; i < RING_COUNT; i++) {
  const even = i % 2 === 0;
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(5.2 + Math.sin(i * 1.7) * 0.8, 0.05, 12, 90),
    new THREE.MeshStandardMaterial({
      color: 0x05060c,
      emissive: even ? COLORS.cyan : COLORS.magenta,
      emissiveIntensity: even ? 1.4 : 1.1,
      metalness: 0.8,
      roughness: 0.3,
    })
  );
  ring.position.set(Math.sin(i * 0.9) * 1.4, Math.cos(i * 0.7) * 1.1, -10 - i * 7.5);
  ring.rotation.x = Math.sin(i) * 0.18;
  ring.rotation.y = Math.cos(i) * 0.18;
  ring.userData.spin = (even ? 1 : -1) * (0.0016 + (i % 3) * 0.0009);
  rings.push(ring);
  scene.add(ring);
}

/* ---------- Floating debris: glowing icosahedrons ---------- */

const debris = [];
const debrisMats = [COLORS.cyan, COLORS.magenta, COLORS.violet, COLORS.amber].map(
  (c) =>
    new THREE.MeshStandardMaterial({
      color: 0x05060c,
      emissive: c,
      emissiveIntensity: 0.9,
      metalness: 0.9,
      roughness: 0.2,
      wireframe: true,
    })
);
for (let i = 0; i < 34; i++) {
  const m = new THREE.Mesh(
    new THREE.IcosahedronGeometry(THREE.MathUtils.randFloat(0.25, 0.9), 0),
    debrisMats[i % debrisMats.length]
  );
  m.position.set(
    THREE.MathUtils.randFloatSpread(34),
    THREE.MathUtils.randFloatSpread(20),
    THREE.MathUtils.randFloat(-130, 10)
  );
  m.userData = {
    rx: THREE.MathUtils.randFloat(0.002, 0.01),
    ry: THREE.MathUtils.randFloat(0.002, 0.01),
    floatSeed: Math.random() * Math.PI * 2,
    baseY: m.position.y,
  };
  debris.push(m);
  scene.add(m);
}

/* ---------- Particle starfield (two layers) ---------- */

function makeParticles(count, color, size, spreadZ) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = THREE.MathUtils.randFloatSpread(90);
    positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(60);
    positions[i * 3 + 2] = THREE.MathUtils.randFloat(-spreadZ, 20);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color,
    size,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  return new THREE.Points(geo, mat);
}
const starsA = makeParticles(2600, COLORS.cyan, 0.07, 160);
const starsB = makeParticles(1600, COLORS.magenta, 0.055, 160);
const starsC = makeParticles(900, 0xffffff, 0.045, 160);
scene.add(starsA, starsB, starsC);

/* ---------- Wireframe terrain floor ---------- */

const TERRAIN_SEGS = 70;
const terrainGeo = new THREE.PlaneGeometry(240, 240, TERRAIN_SEGS, TERRAIN_SEGS);
const terrain = new THREE.Mesh(
  terrainGeo,
  new THREE.MeshBasicMaterial({
    color: COLORS.violet,
    wireframe: true,
    transparent: true,
    opacity: 0.14,
  })
);
terrain.rotation.x = -Math.PI / 2;
terrain.position.set(0, -9, -60);
scene.add(terrain);
const terrainBase = terrainGeo.attributes.position.array.slice();

/* ---------- Distant "sun" behind the tunnel ---------- */

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(9, 40, 40),
  new THREE.MeshBasicMaterial({ color: COLORS.magenta })
);
sun.position.set(0, 2, -165);
scene.add(sun);

/* ---------- Post-processing: cinematic bloom ---------- */

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.85, // strength
  0.65, // radius
  0.12 // threshold
);
composer.addPass(bloom);

/* ---------- Scroll-driven camera path ---------- */

// Keyframes the camera glides through as you scroll 0 → 1.
const camPath = [
  { x: 0, y: 0.6, z: 16, ry: 0 }, // hero: facing the knot
  { x: -2.2, y: 1.4, z: 4, ry: 0.12 }, // showreel: pushing past the knot
  { x: 1.8, y: -0.4, z: -18, ry: -0.1 }, // work: inside the tunnel
  { x: -1.4, y: 1.0, z: -46, ry: 0.14 }, // about: deep tunnel
  { x: 1.2, y: -0.8, z: -78, ry: -0.12 }, // services: tunnel exit
  { x: 0, y: 0.4, z: -112, ry: 0 }, // contact: facing the sun
];

const smooth = (t) => t * t * (3 - 2 * t);

function sampleCamPath(p) {
  const clamped = THREE.MathUtils.clamp(p, 0, 1);
  const segs = camPath.length - 1;
  const f = clamped * segs;
  const i = Math.min(Math.floor(f), segs - 1);
  const t = smooth(f - i);
  const a = camPath[i];
  const b = camPath[i + 1];
  return {
    x: THREE.MathUtils.lerp(a.x, b.x, t),
    y: THREE.MathUtils.lerp(a.y, b.y, t),
    z: THREE.MathUtils.lerp(a.z, b.z, t),
    ry: THREE.MathUtils.lerp(a.ry, b.ry, t),
  };
}

let scrollProgress = 0;
let smoothProgress = 0;

function readScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress = max > 0 ? window.scrollY / max : 0;
}
window.addEventListener('scroll', readScroll, { passive: true });
readScroll();

/* ---------- Mouse parallax ---------- */

const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
window.addEventListener('pointermove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
});

/* ---------- Animation loop ---------- */

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  // Smooth camera towards scroll target
  smoothProgress += (scrollProgress - smoothProgress) * (prefersReducedMotion ? 1 : 0.06);
  const p = sampleCamPath(smoothProgress);

  mouse.sx += (mouse.x - mouse.sx) * 0.05;
  mouse.sy += (mouse.y - mouse.sy) * 0.05;
  const parallax = prefersReducedMotion || isTouch ? 0 : 1;

  camera.position.set(
    p.x + mouse.sx * 0.8 * parallax,
    p.y - mouse.sy * 0.5 * parallax,
    p.z
  );
  camera.rotation.set(mouse.sy * 0.04 * parallax, p.ry + mouse.sx * -0.05 * parallax, 0);

  // Hero knot
  knot.rotation.x = t * 0.12;
  knot.rotation.y = t * 0.18;
  knot.position.y = 0.4 + Math.sin(t * 0.8) * 0.25;
  knotCore.rotation.y = -t * 0.4;
  knotCore.rotation.z = t * 0.25;
  knotCore.position.y = knot.position.y;
  knotCore.scale.setScalar(1 + Math.sin(t * 2.2) * 0.06);

  // Tunnel rings
  for (const ring of rings) ring.rotation.z += ring.userData.spin;

  // Debris drift
  for (const d of debris) {
    d.rotation.x += d.userData.rx;
    d.rotation.y += d.userData.ry;
    d.position.y = d.userData.baseY + Math.sin(t * 0.6 + d.userData.floatSeed) * 0.6;
  }

  // Slow starfield rotation
  starsA.rotation.z = t * 0.008;
  starsB.rotation.z = -t * 0.006;
  starsC.rotation.z = t * 0.004;

  // Terrain waves
  if (!prefersReducedMotion) {
    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = terrainBase[i * 3];
      const y = terrainBase[i * 3 + 1];
      pos.setZ(i, Math.sin(x * 0.12 + t * 0.9) * Math.cos(y * 0.1 + t * 0.7) * 1.6);
    }
    pos.needsUpdate = true;
  }

  // Lights breathe with the sun as you approach
  keyLight.intensity = 55 + Math.sin(t * 1.3) * 10;
  rimLight.intensity = 45 + Math.cos(t * 1.1) * 10;
  bloom.strength = 0.8 + smoothProgress * 0.5 + Math.sin(t * 0.9) * 0.05;

  composer.render();
}

/* ---------- Resize ---------- */

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  fitKnot();
});

/* ============================================================
   UI LAYER
   ============================================================ */

/* ---------- Loader ---------- */

const loader = document.getElementById('loader');
const loaderFill = document.getElementById('loader-fill');
const loaderStatus = document.getElementById('loader-status');
const bootLines = [
  'INITIALIZING RENDER ENGINE…',
  'CALIBRATING LENS PROFILES…',
  'LOADING PARTICLE FIELD…',
  'SYNCING TIMECODE…',
  'TRANSMISSION READY',
];
let bootStep = 0;
const bootTimer = setInterval(() => {
  bootStep++;
  const pct = Math.min(bootStep * 25, 100);
  loaderFill.style.width = pct + '%';
  loaderStatus.textContent = bootLines[Math.min(bootStep, bootLines.length - 1)];
  if (bootStep >= 5) {
    clearInterval(bootTimer);
    loader.classList.add('loader--done');
    document.body.classList.add('is-ready');
    setTimeout(() => loader.remove(), 900);
  }
}, prefersReducedMotion ? 60 : 320);

/* ---------- Scroll progress bar + nav state ---------- */

const progressFill = document.getElementById('progress-fill');
const nav = document.getElementById('nav');
window.addEventListener(
  'scroll',
  () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressFill.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    nav.classList.toggle('nav--solid', window.scrollY > 40);
  },
  { passive: true }
);

/* ---------- Mobile menu ---------- */

const burger = document.getElementById('burger');
const navLinks = document.getElementById('nav-links');
burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('nav__links--open');
  burger.classList.toggle('nav__burger--open', open);
  burger.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    navLinks.classList.remove('nav__links--open');
    burger.classList.remove('nav__burger--open');
    burger.setAttribute('aria-expanded', 'false');
  })
);

/* ---------- Reveal on scroll ---------- */

const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--in');
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ---------- Animated counters ---------- */

const counterObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      counterObserver.unobserve(entry.target);
      const el = entry.target;
      const target = Number(el.dataset.count);
      const dur = prefersReducedMotion ? 1 : 1400;
      const start = performance.now();
      const tick = (now) => {
        const k = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  },
  { threshold: 0.6 }
);
document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el));

/* ---------- 3D tilt cards ---------- */

if (!isTouch && !prefersReducedMotion) {
  document.querySelectorAll('.tilt').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${px * 10}deg) rotateX(${py * -10}deg) translateY(-4px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}

/* ---------- Custom cursor ---------- */

const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');
if (!isTouch) {
  document.body.classList.add('has-cursor');
  let cx = 0, cy = 0, tx = 0, ty = 0;
  window.addEventListener('pointermove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    cursorDot.style.transform = `translate(${tx}px, ${ty}px)`;
  });
  (function cursorLoop() {
    cx += (tx - cx) * 0.16;
    cy += (ty - cy) * 0.16;
    cursor.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(cursorLoop);
  })();
  document.querySelectorAll('[data-hover]').forEach((el) => {
    el.addEventListener('pointerenter', () => cursor.classList.add('cursor--active'));
    el.addEventListener('pointerleave', () => cursor.classList.remove('cursor--active'));
  });
}

animate();
