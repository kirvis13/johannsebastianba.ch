# CLAUDE.md — Matthäus-Passion Unraveled

Immersive audiovisual web experience for Bach's St. Matthew Passion (BWV 244). Users watch the Nederlandse Bachvereniging performance with synchronized lyrics, musical analysis, theological context, and trivia.

## Commands

```bash
npm run dev      # Local dev server at http://localhost:5173
npm run build    # Production build → dist/
npm run lint     # ESLint
npm run preview  # Preview production build locally
```

## Tech Stack

- **React 19** + **Vite 7**
- **Tailwind CSS 4** (utility-first, no config file — uses CSS-native setup via PostCSS)
- **React Router DOM 7** (client-side routing)
- **React Context API** (global state: language)
- **Framer Motion** (animations)
- **Lucide React** (icons)
- **react-helmet-async** (SEO/meta tags)
- **YouTube Embed API** via `react-youtube` + custom sync wrapper
- **Vercel** (deployment; `@vercel/analytics` + `@vercel/speed-insights` are installed)

No test suite is configured.

## Project Structure

```
src/
├── App.jsx                  # Root: router + providers
├── main.jsx                 # Entry point
├── translations/
│   ├── index.js             # Re-exports { translations } combining all languages
│   ├── en.js                # English UI text (~225 lines)
│   ├── nl.js                # Dutch UI text (~225 lines)
│   └── de.js                # German UI text, partial (~203 lines)
├── context/
│   └── LanguageContext.jsx  # Language state + t() function
├── config/
│   ├── project.js           # Route definitions + nav labels
│   └── componentMap.js      # Lazy-loaded page components
├── data/
│   └── glossary.js          # Musical term definitions (EN, NL)
├── components/              # Reusable UI components
│   ├── DetailsPanel.jsx     # Lyrics / interpretation / trivia display
│   ├── TriviaPanel.jsx      # Trivia cards
│   ├── PlayerHeader.jsx     # Navigation bar
│   ├── VideoPlayer.jsx      # YouTube sync wrapper
│   ├── AnatomyVisualizer.jsx
│   ├── MiniPlayer.jsx
│   ├── Layout.jsx
│   ├── SEO.jsx
│   └── SourceModal.jsx
├── pages/
│   ├── HomePageV4.jsx
│   ├── PlayerPage.jsx       # Main player with sync
│   ├── DiscoverPage.jsx     # Musical structures explained
│   ├── StoryTimeline.jsx    # Passion story timeline
│   ├── ConcertPage.jsx      # Distraction-free mode
│   ├── AboutPage.jsx        # About Bach
│   └── AboutProjectPage.jsx # Colophon
└── utils/
    └── textFormatter.jsx    # Markdown-like text rendering

public/
├── data/
│   ├── index.json           # Index of all 81 chapters (metadata + timestamps)
│   └── details/             # 81 JSON files (part_01.json … part_80.json)
├── images/                  # WebP optimized assets
└── videos/
```

## Internationalization (i18n)

### How it works

- `LanguageContext.jsx` holds language state (default: `'en'`)
- `t('key.nested')` resolves dot-notation paths into `translations[language]`
- Falls back to the key string if a translation is missing
- `toggleLanguage()` currently switches only between `'en'` and `'nl'`
- All components access translations via `const { t, language, setLanguage } = useLanguage()`

### Current languages

| Code | Language | Coverage |
|------|----------|----------|
| `en` | English  | Full (UI + content) |
| `nl` | Dutch    | Full (UI + content) |
| `de` | German   | Partial (content only; original lyrics) |

### Where text lives

**UI text** → `src/translations/`
One file per language (`en.js`, `nl.js`, `de.js`), combined in `index.js` as `{ en, nl, de }`.
To add a language, create `fr.js` and import it in `index.js`. Sections per language file:
- Navigation, labels, buttons
- `anatomy` — "Anatomy of a Masterpiece" scroll section (5 stages)
- `intro_page` — intro/guide page content
- `story_page` — story timeline chapters (12 scenes, 2 parts)
- `guide_page` — listening guide (forms, halo, O Haupt variations)
- `discover_page` — discovery sections (ritual, soundscape, building blocks, hidden codes)

**Content data** → `public/data/`

`index.json` — array of 81 chapter objects:
```json
{
  "id": "part_01",
  "volgorde": 1,
  "nba_no": "...",
  "title": "Kommt, ihr Töchter",   // always German
  "type": "Chorus",                 // Chorus | Recitative | Aria | Choral | ...
  "subtype": "Full",
  "scene_label": { "nl": "...", "en": "..." },
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
  "scene_label": { "nl": "...", "en": "..." },
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
    "en": {
      "lyrics": "...",
      "modern": "...",
      "interpretation": "...",
      "trivia": []
    },
    "original_source": null
  }
}
```

Note: `de` only has `lyrics`. `nl` has the most complete content (trivia, interpretation). `en` content is sometimes less complete than `nl`.

**Glossary** → `src/data/glossary.js`
Four terms (chorus, chorale, recitative, aria) with `nl` and `en` definitions.

**Route labels** → `src/config/project.js`
Each route has a `label: { en, nl, de }` object — add new languages here too.

## Adding a New Language

To add a language (e.g. French `fr`):

1. **`src/translations/fr.js`** — create new file with `export default { ... }` (~225 lines), then import it in `src/translations/index.js`
2. **`public/data/details/part_*.json`** — add `"fr"` block to `content` in all 81 files (~38,000 words; scriptable)
3. **`public/data/index.json`** — add `fr` to each `scene_label` object (~400 words)
4. **`src/data/glossary.js`** — add `fr` to each term (~100 words)
5. **`src/config/project.js`** — add `fr` label to each route
6. **`src/context/LanguageContext.jsx`** — add `fr` to available languages; update `toggleLanguage()` to a multi-language selector

Total translatable content: ~43,500 words. LLM translation is suitable for all content except lyrics, where a style review is recommended (professional French translations of the Matthäus-Passion exist but are likely copyrighted).

## Content Types & Musical Terms

- **Chorus** — large-scale choral movement
- **Recitative** — narrative singing (Evangelist tells the story)
- **Aria** — reflective solo moment, often with single instrument
- **Chorale** — Lutheran hymn, congregation voice
- Subtypes: Full, Secco, Solo, Accompagnato, Congregational, Turba

## Key Patterns

- No global CSS framework config — Tailwind 4 uses `@import "tailwindcss"` directly in CSS
- Lazy loading via `React.lazy()` + `componentMap.js`
- SEO handled per-page via `<SEO />` component (react-helmet-async)
- Video sync driven by YouTube player timestamps matched against `index.json` `start` values
- `textFormatter.jsx` renders markdown-style bold/italic in translation strings (uses `**bold**`, `*italic*`)
