# Matthäus-Passion Unraveled

**An immersive audiovisual web experience for Johann Sebastian Bach's St. Matthew Passion.**

This interactive web application retrieves the masterpiece from the concert hall and places it in a modern digital context. It combines high-quality video performance (Nederlandse Bachvereniging) with synchronized details, historical context, and deep musical analysis.

## 🌟 Key Features

*   **Interactive Player:** Watch the performance with real-time synchronized lyrics (German, Dutch, English) and musical insights.
*   **Concert Mode:** A distraction-free, dark-mode experience focused on listening, with "Trivia" popups and live translation (coming soon).
*   **The Story:** A scrollable visual timeline of the Passion story according to the Gospel of Matthew.
*   **Discovery:** Explanations of musical structures (e.g., the "Halo" effect), theological symbolism, and the "Three Worlds" concept.
*   **SEO & GEO Optimized:** Fully indexable by search engines and AI agents with structured data (JSON-LD) and semantic HTML.
*   **Performance:** Optimized assets (WebP), lazy loading, and efficient state management.

## 🛠️ Tech Stack

*   **Framework:** React 19 + Vite
*   **Styling:** Tailwind CSS 4, Lucide React (Icons)
*   **Routing:** React Router DOM 7
*   **State:** React Context API
*   **SEO:** React Helmet Async
*   **Video:** YouTube Embed API (Custom synchronized wrapper)

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   npm

### Installation

```bash
# Clone the repository
git clone https://github.com/kirvis13/johannsebastianba.ch.git

# Navigate to the directory
cd johannsebastianba.ch

# Install dependencies
npm install
```

### Development

Start the local development server:

```bash
npm run dev
```

The app will run at `http://localhost:5173`.

### Build for Production

Create an optimized build in the `dist/` directory:

```bash
npm run build
```

## 📂 Project Structure

*   `src/components`: Reusable UI components (`VideoPlayer`, `DetailsPanel`, `SEO`, etc.)
*   `src/pages`: Route components (`HomePageV4`, `PlayerPage`, `ConcertPage`, `StoryTimeline`)
*   `src/context`: Global state (`LanguageContext`)
*   `public/data`: Static JSON data for chapters, synchronized events, and trivia.
*   `public/images`: Optimized WebP assets.

## © Credits

*   **Video Content:** Nederlandse Bachvereniging (All of Bach)
*   **Concept & Development:** Kirvis13

---
*Built with Passion for Bach.*
