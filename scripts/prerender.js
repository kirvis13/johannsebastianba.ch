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
import { titleToSlug } from '../src/utils/slugify.js';

// On Vercel (and other serverless/container envs), use @sparticuz/chromium
// which bundles all required shared libraries. Locally, use the puppeteer-managed Chrome
// (override with PUPPETEER_EXECUTABLE_PATH when no download is available).
async function getBrowserOptions() {
    if (process.env.VERCEL) {
        const chromium = (await import('@sparticuz/chromium')).default;
        return {
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        };
    }
    let execPath = process.env.PUPPETEER_EXECUTABLE_PATH;
    if (!execPath) {
        const { executablePath } = await import('puppeteer');
        execPath = executablePath();
    }
    return {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: execPath,
        headless: true,
    };
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, '../dist');
const PORT = 5179;
const BASE_URL = `http://localhost:${PORT}`;

function buildRoutes() {
    const indexPath = join(DIST_DIR, 'data/index.json');
    const indexData = JSON.parse(readFileSync(indexPath, 'utf-8'));
    const chapterRoutes = indexData.chapters.map(c => `/play/${titleToSlug(c.title)}`);
    return ['/', '/discover', '/story', '/about', '/concert', '/colophon', ...chapterRoutes];
}

const ROUTES = buildRoutes();

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
            try { urlPath = decodeURIComponent(urlPath); } catch { /* keep the raw path */ }

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

    generateSitemap();
}

function generateSitemap() {
    const SITE_URL = 'https://johannsebastianba.ch';
    const today = new Date().toISOString().split('T')[0];

    const staticPages = [
        { loc: '/', priority: '1.0', changefreq: 'monthly' },
        { loc: '/discover', priority: '0.9', changefreq: 'monthly' },
        { loc: '/story', priority: '0.9', changefreq: 'monthly' },
        { loc: '/about', priority: '0.7', changefreq: 'monthly' },
        { loc: '/colophon', priority: '0.5', changefreq: 'yearly' },
    ];

    const indexData = JSON.parse(readFileSync(join(DIST_DIR, 'data/index.json'), 'utf-8'));
    const chapterPages = indexData.chapters.map(c => ({
        loc: `/play/${titleToSlug(c.title)}`,
        priority: '0.8',
        changefreq: 'yearly',
    }));

    const allPages = [...staticPages, ...chapterPages];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${
        allPages.map(p =>
            `  <url>\n    <loc>${SITE_URL}${p.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
        ).join('\n')
    }\n</urlset>\n`;

    writeFileSync(join(DIST_DIR, 'sitemap.xml'), xml, 'utf-8');
    console.log('✓ sitemap.xml generated');
}

prerender().catch((err) => {
    console.error('Fatal prerender error:', err);
    process.exit(1);
});
