/**
 * Custom prerender script for johannsebastianba.ch
 * Uses puppeteer to visit each route and save the rendered HTML to dist/.
 * Run after `vite build` via `npm run prerender`.
 */

import puppeteer from 'puppeteer-core';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

// On Vercel (and other serverless/container envs), use @sparticuz/chromium
// which bundles all required shared libraries. Locally, use the puppeteer-managed Chrome.
async function getBrowserOptions() {
    if (process.env.VERCEL) {
        const chromium = (await import('@sparticuz/chromium')).default;
        return {
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        };
    }
    const { executablePath } = await import('puppeteer');
    return {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: executablePath(),
        headless: true,
    };
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, '../dist');
const PORT = 5179;
const BASE_URL = `http://localhost:${PORT}`;
const ROUTES = ['/', '/discover', '/story', '/play', '/about', '/concert', '/colophon'];

const MIME_TYPES = {
    '.js': 'application/javascript',
    '.mjs': 'application/javascript',
    '.css': 'text/css',
    '.html': 'text/html; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.json': 'application/json',
    '.mp4': 'video/mp4',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.xml': 'application/xml',
    '.txt': 'text/plain',
};

function startServer() {
    return new Promise((resolve, reject) => {
        const server = createServer((req, res) => {
            let urlPath = req.url.split('?')[0];

            // Decode URL
            try { urlPath = decodeURIComponent(urlPath); } catch (_) {}

            // Build candidate paths
            let filePath = join(DIST_DIR, urlPath);

            // If path is a directory, look for index.html inside
            if (existsSync(filePath) && statSync(filePath).isDirectory()) {
                filePath = join(filePath, 'index.html');
            }

            if (existsSync(filePath) && statSync(filePath).isFile()) {
                const ext = extname(filePath).toLowerCase();
                const contentType = MIME_TYPES[ext] || 'application/octet-stream';
                const content = readFileSync(filePath);
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            } else {
                // SPA fallback: serve index.html for unknown paths
                const indexHtml = readFileSync(join(DIST_DIR, 'index.html'));
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(indexHtml);
            }
        });

        server.on('error', reject);
        server.listen(PORT, () => {
            console.log(`Static server running at ${BASE_URL}`);
            resolve(server);
        });
    });
}

async function prerender() {
    const server = await startServer();

    const browserOptions = await getBrowserOptions();
    const browser = await puppeteer.launch(browserOptions);

    let failed = false;

    try {
        for (const route of ROUTES) {
            process.stdout.write(`Pre-rendering ${route}... `);
            const page = await browser.newPage();

            page.on('pageerror', (err) => {
                process.stdout.write(`\n  ⚠ pageerror: ${err.message}`);
            });

            try {
                await page.goto(`${BASE_URL}${route}`, {
                    waitUntil: 'load',
                    timeout: 30000,
                });

                // Extra wait for React lazy-loaded chunks and Framer Motion
                await new Promise((r) => setTimeout(r, 3000));

                let html = await page.content();

                // Replace localhost references with the real site URL
                html = html.replace(new RegExp(`http://localhost:${PORT}`, 'g'), 'https://johannsebastianba.ch');

                const outDir = route === '/' ? DIST_DIR : join(DIST_DIR, route);
                if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

                writeFileSync(join(outDir, 'index.html'), html, 'utf-8');
                console.log('✓');
            } catch (err) {
                console.log(`✗ ${err.message}`);
                failed = true;
            } finally {
                await page.close();
            }
        }
    } finally {
        await browser.close();
        server.close();
    }

    if (failed) {
        console.warn('\n⚠ Some routes failed to pre-render — check warnings above.');
    } else {
        console.log('\n✓ Pre-rendering complete!');
    }
}

prerender().catch((err) => {
    console.error('Fatal prerender error:', err);
    process.exit(1);
});
