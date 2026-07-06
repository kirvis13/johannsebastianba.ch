# CLAUDE.md — Matthäus-Passion Unraveled

Immersive audiovisual web experience for Bach's St. Matthew Passion (BWV 244). Users watch the Nederlandse Bachvereniging performance with synchronized lyrics, musical analysis, theological context, and trivia.

## Commands

```bash
npm run dev        # Local dev server at http://localhost:5173
npm run build      # Production build → dist/ + puppeteer prerender of all routes
npm run prerender  # Prerender only (requires an existing dist/; set PUPPETEER_EXECUTABLE_PATH if no downloaded Chrome)
npm run lint       # ESLint
npm run preview    # Preview production build locally
```

CI (`.github/workflows/ci.yml`) runs `npm run lint` and `npx vite build` on every PR.

## Tech Stack

- **React 19** + **Vite 7**
- **Tailwind CSS 4** (utility-first, no config file — uses CSS-native setup via PostCSS)
- **React Router DOM 7** (client-side routing)
- **React Context API** (global state: language, persisted in localStorage)
- **Lucide React** (icons)
- **react-helmet-async** (SEO/meta tags)
- **YouTube Embed API** via `react-youtube` + custom sync wrapper
- **Vercel** (deployment; `@vercel/analytics` + `@vercel/speed-insights` are installed)
- **puppeteer** (devDependency; `scripts/prerender.js` renders every route to static HTML after `vite build`, then regenerates `sitemap.xml`)

No test suite is configured. Data files are fetched with native `fetch` (no HTTP client dependency).

## Project Structure

```
src/
├── App.jsx                  # Root: router + providers
├── main.jsx                 # Entry point (hydrateRoot when prerendered HTML exists)
├── translations/
│   ├── index.js             # Re-exports { translations } combining all languages
│   ├── en.js                # English UI text
│   ├── nl.js                # Dutch UI text
│   ├── fr.js                # French UI text
│   └── de.js                # German UI text, partial (not selectable in the UI)
├── context/
│   └── LanguageContext.jsx  # Language state + t() function (persists choice to localStorage)
├── config/
│   ├── project.js           # Route definitions + nav labels + SITE_URL
│   └── componentMap.js      # Lazy-loaded page components
├── data/
│   └── glossary.js          # Musical term definitions (EN, NL)
├── components/              # Reusable UI components
│   ├── DetailsPanel.jsx     # Lyrics / interpretation / trivia display
│   ├── InterpretationPanel.jsx
│   ├── PlayerHeader.jsx     # Navigation bar
│   ├── VideoPlayer.jsx      # YouTube sync wrapper (polls playback time at 250ms)
│   ├── MiniPlayer.jsx       # Fragment player used on DiscoverPage
│   ├── Layout.jsx
│   ├── SEO.jsx
│   └── SourceModal.jsx
├── pages/
│   ├── HomePageV4.jsx
│   ├── PlayerPage.jsx       # Main player with sync (slug URLs: /play/<title-slug>)
│   ├── DiscoverPage.jsx     # Musical structures explained
│   ├── StoryTimeline.jsx    # Passion story timeline
│   ├── ConcertPage.jsx      # Distraction-free mode
│   ├── AboutPage.jsx        # About Bach
│   └── AboutProjectPage.jsx # Colophon
└── utils/
    ├── textFormatter.jsx    # Markdown-like text rendering (**bold**, *italic*)
    ├── parseLyrics.js       # Splits lyrics into { speaker, content } segments
    └── slugify.js           # titleToSlug — single source of truth, also used by scripts/prerender.js

scripts/
├── prerender.js             # Post-build static HTML prerender + sitemap generation
└── compare-translations.js  # One-off EN-lyrics comparison against scripts/fb-reference.txt

public/
├── data/
│   ├── index.json           # Index of all chapters (metadata + timestamps)
│   └── details/             # 81 JSON files (part_01.json … part_80.json)
├── images/                  # WebP optimized assets
└── videos/                  # hero.mp4 homepage background
```

## Internationalization (i18n)

### How it works

- `LanguageContext.jsx` holds language state (default: `'en'`, persisted to localStorage)
- `t('key.nested')` resolves dot-notation paths into `translations[language]`
- Falls back to the key string if a translation is missing
- `toggleLanguage()` cycles through `en → nl → fr`
- All components access translations via `const { t, language, setLanguage } = useLanguage()`

### Current languages

| Code | Language | Coverage |
|------|----------|----------|
| `en` | English  | Full (UI + content) |
| `nl` | Dutch    | Full (UI + content) |
| `fr` | French   | Full (UI + content) |
| `de` | German   | Partial UI file; content has original lyrics only. Not selectable in the UI. |

### Where text lives

**UI text** → `src/translations/`
One file per language (`en.js`, `nl.js`, `fr.js`, `de.js`), combined in `index.js`. Sections per language file:
- Navigation, labels, buttons
- `anatomy` — "Anatomy of a Masterpiece" scroll section (5 stages)
- `intro_page` — intro/guide page content
- `story_page` — story timeline chapters (12 scenes, 2 parts)
- `guide_page` — listening guide (forms, halo, O Haupt variations)
- `discover_page` — discovery sections (ritual, soundscape, building blocks, hidden codes)

**Content data** → `public/data/`

`index.json` — array of chapter objects:
```json
{
  "id": "part_01",
  "volgorde": 1,
  "nba_no": "...",
  "title": "Kommt, ihr Töchter",   // always German
  "type": "Chorus",                 // Chorus | Recitativo | Aria | Choral | ...
  "subtype": "Full",
  "scene_label": { "nl": "...", "en": "...", "fr": "..." },
  "speaker": "Chorus I & II",
  "start": 0                        // timestamp in seconds
}
```

`public/data/details/part_XX.json` — one file per chapter:
```json
{
  "id": "part_01",
  "title": "...",
  "type": "Chorus",
  "subtype": "Full",
  "scene_label": { "nl": "...", "en": "...", "fr": "..." },
  "speaker": "...",
  "source": "...",
  "content": {
    "de": { "lyrics": "..." },
    "nl": {
      "lyrics": "...",
      "modern": "...",
      "interpretation": "...",
      "trivia": [{ "category": "muzikaal", "fact": "..." }]
    },
    "en": { "lyrics": "...", "modern": "...", "interpretation": "...", "trivia": [] },
    "fr": { "lyrics": "...", "modern": "...", "interpretation": "...", "trivia": [] },
    "original_source": null
  }
}
```

Note: `de` only has `lyrics`. `nl` has the most complete content (trivia, interpretation).

**Glossary** → `src/data/glossary.js`
Four terms (chorus, chorale, recitative, aria) with `nl` and `en` definitions.

**Route labels** → `src/config/project.js`
Each route has a `label: { en, nl, fr, ... }` object — add new languages here too.

## Adding a New Language

To add a language (e.g. Spanish `es`):

1. **`src/translations/es.js`** — create new file with `export default { ... }` (~225 lines), then import it in `src/translations/index.js`
2. **`public/data/details/part_*.json`** — add `"es"` block to `content` in all 81 files (~38,000 words; scriptable)
3. **`public/data/index.json`** — add `es` to each `scene_label` object (~400 words)
4. **`src/data/glossary.js`** — add `es` to each term (~100 words)
5. **`src/config/project.js`** — add `es` label to each route
6. **`src/context/LanguageContext.jsx`** — add `es` to `AVAILABLE_LANGUAGES`
7. **`src/components/SEO.jsx`** — add the locale to the `og:locale` map

Total translatable content: ~43,500 words. LLM translation is suitable for all content except lyrics, where a style review is recommended.

## Content Types & Musical Terms

- **Chorus** — large-scale choral movement
- **Recitative** — narrative singing (Evangelist tells the story)
- **Aria** — reflective solo moment, often with single instrument
- **Chorale** — Lutheran hymn, congregation voice
- Subtypes: Full, Secco, Solo, Accompagnato, Congregational, Turba

## Key Patterns

- No global CSS framework config — Tailwind 4 uses `@import "tailwindcss"` directly in CSS
- Lazy loading via `React.lazy()` + `componentMap.js` (import pages through the map — a direct static import defeats code splitting)
- SEO handled per-page via `<SEO />` component (react-helmet-async)
- Video sync driven by YouTube player timestamps matched against `index.json` `start` values; chapter URLs auto-advance while playing
- Chapter URLs use `titleToSlug` from `src/utils/slugify.js` — prerender and app must stay in sync, so never duplicate this function
- `textFormatter.jsx` renders markdown-style bold/italic in translation strings (uses `**bold**`, `*italic*`)
