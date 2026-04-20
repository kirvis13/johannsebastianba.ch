#!/usr/bin/env node
// Compares current EN lyrics in public/data/details/ against Francis Browne translation.
// Matching is done by German text similarity, not by movement number.
// Output: scripts/fb-diff-report.md

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SEP = '\u3000\t'; // full-width space + tab used as column separator in FB text

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isHeaderOrInstrumentation(s) {
    // Movement header: first line is just a number (possibly letter + optional [M])
    const firstLine = s.split('\n')[0].trim();
    if (/^\d+[a-e]?(?:\s+\[\d+\])?$/.test(firstLine)) return true;
    // Instrumentation line
    if (/^(Flauto|Oboe|Violino|Viola|Continuo|Cembalo|Organo|Tromba|Timpani)/i.test(s)) return true;
    if (/col (Soprano|Alto|Tenore|Basso)/i.test(s)) return true;
    return false;
}

function normalise(s) {
    return s
        .replace(/^(Evangelist|Jesus|Judas|Petrus|Peter|Pilatus|Pilate|Hoherpriester|High Priest|Magd|Maid|Chorus|Coro|Chor|Bass|Alto|Tenor|Sopran|Soprano|Solo|Solisten?|Soloists?):\s*/gm, '')
        .replace(/[–—-]/g, '-')
        .replace(/[""]/g, '"')
        .replace(/['']/g, "'")
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

// Simple word overlap score: jaccard similarity of words
function similarity(a, b) {
    const wordsA = new Set(a.split(/\s+/).filter(w => w.length > 3));
    const wordsB = new Set(b.split(/\s+/).filter(w => w.length > 3));
    if (wordsA.size === 0 || wordsB.size === 0) return 0;
    let intersect = 0;
    for (const w of wordsA) if (wordsB.has(w)) intersect++;
    return intersect / (wordsA.size + wordsB.size - intersect);
}

// ---------------------------------------------------------------------------
// Parse Francis Browne text → array of { fbKey, de, en } objects
// ---------------------------------------------------------------------------

function parseFBText(text) {
    const entries = [];

    // Movement headers: "N [M]" or "Na [M]" or just "9e" / "10" (no brackets)
    const blockRegex = /(?=^\d+[a-e]?(?: \[\d+\])?$)/m;
    const rawBlocks = text.split(blockRegex).filter(b => b.trim());

    for (const block of rawBlocks) {
        const headerMatch = block.match(/^(\d+[a-e]?)(?:\s+\[\d+\])?$/m);
        if (!headerMatch) continue;
        const fbKey = headerMatch[1];

        const parts = block.split(SEP).map(p => p.trim()).filter(Boolean);
        const contentParts = parts.filter(p => !isHeaderOrInstrumentation(p));

        if (contentParts.length < 2) continue; // need at least one DE+EN pair

        // Collect DE blocks (even 0-based) and EN blocks (odd 0-based)
        const deBlocks = contentParts.filter((_, i) => i % 2 === 0);
        const enBlocks = contentParts.filter((_, i) => i % 2 === 1);

        if (enBlocks.length === 0) continue;

        entries.push({
            fbKey,
            de: deBlocks.join('\n\n').trim(),
            en: enBlocks.join('\n\n').trim(),
        });
    }

    return entries;
}

// ---------------------------------------------------------------------------
// Match a chapter's German text against FB entries
// ---------------------------------------------------------------------------

function findBestFBEntry(fbEntries, germanText) {
    if (!germanText || germanText.trim().length < 10) return null;

    const normDE = normalise(germanText);

    let best = null;
    let bestScore = 0;

    for (const entry of fbEntries) {
        const score = similarity(normDE, normalise(entry.de));
        if (score > bestScore) {
            bestScore = score;
            best = entry;
        }
    }

    // Require minimum similarity to avoid false matches
    return bestScore >= 0.25 ? { entry: best, score: bestScore } : null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const fbRaw = readFileSync(join(__dirname, 'fb-reference.txt'), 'utf-8');
const fbEntries = parseFBText(fbRaw);
console.log(`Parsed ${fbEntries.length} FB entries`);

const index = JSON.parse(readFileSync(join(ROOT, 'public/data/index.json'), 'utf-8'));
const chapters = index.chapters;

const matches = [];
const diffs = [];
const noMatch = [];

for (const ch of chapters) {
    const detailPath = join(ROOT, 'public/data/details', `${ch.id}.json`);
    let detail;
    try {
        detail = JSON.parse(readFileSync(detailPath, 'utf-8'));
    } catch {
        noMatch.push({ ...ch, reason: 'detail file missing' });
        continue;
    }

    const currentEn = (detail.content?.en?.lyrics ?? '').trim();
    const germanText = (detail.content?.de?.lyrics ?? '').trim();

    if (!germanText) {
        noMatch.push({ id: ch.id, nba_no: ch.nba_no, title: ch.title, type: ch.type, reason: 'no German text' });
        continue;
    }

    const result = findBestFBEntry(fbEntries, germanText);

    if (!result) {
        noMatch.push({ id: ch.id, nba_no: ch.nba_no, title: ch.title, type: ch.type, reason: 'no FB match' });
        continue;
    }

    const { entry, score } = result;

    if (normalise(currentEn) === normalise(entry.en)) {
        matches.push({ id: ch.id, nba_no: ch.nba_no, title: ch.title, fbKey: entry.fbKey });
    } else {
        diffs.push({
            id: ch.id,
            nba_no: ch.nba_no,
            title: ch.title,
            type: ch.type,
            current: currentEn,
            fb: entry.en,
            fbKey: entry.fbKey,
            score: score.toFixed(2),
        });
    }
}

// ---------------------------------------------------------------------------
// Build report
// ---------------------------------------------------------------------------

const lines = [
    '# Francis Browne Translation Diff Report',
    '',
    `Generated: ${new Date().toISOString().slice(0, 10)}`,
    `Matched: ${matches.length + diffs.length} / ${chapters.length} chapters`,
    `Identical: ${matches.length} | Differences: ${diffs.length} | No FB match: ${noMatch.length}`,
    '',
    '---',
    '',
];

if (diffs.length > 0) {
    lines.push('## ⚠️ Differences', '');
    for (const d of diffs) {
        lines.push(`### ${d.id} — NBA ${d.nba_no} (FB: ${d.fbKey}, sim=${d.score}) — ${d.title} (${d.type})`);
        lines.push('');
        lines.push('**Current EN:**');
        lines.push('```');
        lines.push(d.current || '(empty)');
        lines.push('```');
        lines.push('');
        lines.push('**Francis Browne:**');
        lines.push('```');
        lines.push(d.fb);
        lines.push('```');
        lines.push('');
        lines.push('---');
        lines.push('');
    }
}

if (matches.length > 0) {
    lines.push('## ✅ Identical (after normalisation)', '');
    for (const m of matches) {
        lines.push(`- \`${m.id}\` (NBA ${m.nba_no}, FB ${m.fbKey}): ${m.title}`);
    }
    lines.push('');
}

if (noMatch.length > 0) {
    lines.push('## ❌ No FB match', '');
    for (const n of noMatch) {
        lines.push(`- \`${n.id}\` (NBA ${n.nba_no}): ${n.title} — _${n.reason}_`);
    }
    lines.push('');
}

const report = lines.join('\n');
writeFileSync(join(__dirname, 'fb-diff-report.md'), report);
console.log(`Report written to scripts/fb-diff-report.md`);
console.log(`Matched ${matches.length + diffs.length}/${chapters.length} | ${diffs.length} diffs | ${noMatch.length} unmatched`);
