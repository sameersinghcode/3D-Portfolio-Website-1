// Starts Vite dev server, screenshots desktop + mobile, exits.
import { createRequire } from 'node:module';
const { chromium, devices } = createRequire(import.meta.url)('playwright'); // global install
import { mkdirSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const out = root + 'shots';
mkdirSync(out, { recursive: true });

const { createServer } = await import(root + 'MY-3D-Project1/node_modules/vite/dist/node/index.js');
const server = await createServer({ root: root + 'MY-3D-Project1', server: { port: 5199, strictPort: true } });
await server.listen();

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const targets = [
  ['desktop', { viewport: { width: 1440, height: 900 } }],
  ['mobile', devices['iPhone 13']],
];
for (const [name, opts] of targets) {
  const page = await (await browser.newContext(opts)).newPage();
  page.on('pageerror', e => console.error(`[${name}] pageerror:`, e.message));
  await page.goto('http://localhost:5199', { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${out}/${name}.png` });
  console.log(`${out}/${name}.png`);
}
await browser.close();
await server.close();
