# Experience Collection ⚡️ – Qwik Edition

Ultra-fast web experience catalog powered by **Qwik** + **Firebase**.

- 🚀 [Qwik Docs](https://qwik.dev/) | [Qwik City](https://qwik.dev/qwikcity/)
- 🔥 [Firebase](https://firebase.google.com/)
- 💨 [Tailwind CSS v4](https://tailwindcss.com/)
- ⚙️ [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)

**Live Demo**: https://github.com/dragoshouse/frontend-ec-qwik

---

## About This Project

**Experience Collection** is a high-performance web app showcasing adventure experiences for **No Limit Adventures**. Built with Qwik for optimal performance:

- ✅ **Zero JavaScript by default** – Only ship what's needed
- ✅ **Resumable** – Pause/resume execution without re-hydration
- ✅ **SSR-ready** – Pre-rendered HTML for lightning-fast first paint
- ✅ **60s server cache** – Firestore data caching for efficiency
- ✅ **Responsive** – Mobile-first design (1-3 columns)
- ✅ **SEO-optimized** – Dynamic metadata per page
- ✅ **TypeScript strict** – Type-safe throughout

---

## Project Structure

This project uses Qwik with [QwikCity](https://qwik.dev/qwikcity/overview/) – a meta-framework with file-based routing, layouts, and server-side rendering out of the box.

Inside your project, you'll see the following directory structure:

```
src/
├── routes/                          # File-based routing (QwikCity)
│   ├── index.tsx                    # Home page (/)
│   ├── layout.tsx                   # Global layout + header/menu
│   └── experience/
│       └── [slug]/
│           └── index.tsx            # Experience detail (/experience/:slug)
│
├── components/                      # Reusable components
│   ├── experience-card/             # Experience card
│   ├── categories-modal/            # Category filter modal
│   ├── footer-logo/                 # Footer branding
│   └── router-head/                 # Dynamic <head> management
│
├── lib/                             # Business logic
│   ├── firestore-rest.ts            # Firestore API client
│   ├── markdown.ts                  # Markdown rendering
│   ├── types.ts                     # TypeScript types
│
├── root.tsx                         # App root component
├── global.css                       # Global styles
└── entry.*.tsx                      # Entry points (SSR, dev, preview)

public/
├── images/                          # Static images
├── fonts/                           # Noto Sans/Serif (local fallback)
└── favicon.svg                      # Favicon
```

---

## Key Features

### 🎨 Home Page (`/`)

- **Hero Section**: Dynamic background + logo positioning
- **Category Filter**: Dropdown with sync to URL query params
- **Experience Grid**: Responsive 1-3 columns (360px cards)
- **Cancellation Policy**: Markdown-rendered footer
- **Dynamic SEO**: Open Graph & Twitter Card meta tags

### 📄 Experience Detail (`/experience/:slug`)

- **Featured Image**: Hero banner with gradient overlay
- **Image Gallery**: 5-image lightbox with nav
- **Tags**: Thrilling, Hike, Flora&Fauna, Relax, Water, Cultural, Gourmet
- **Video Embed**: YouTube/Vimeo with autoplay muting
- **Dynamic Pricing**: 1-2, 3-6, 7+ person rates + group pricing
- **What to Bring**: Parsed from Firestore markdown
- **Difficulty Badges**: Easy / Moderate / Challenging

---

## Qwik Concepts Used

### Route Loaders (`routeLoader$`)
```typescript
export const useHomeData = routeLoader$(async () => {
  // Runs on server, data hydrated in HTML
  const [exps, hp, cp] = await Promise.all([
    getExperiences(),
    getHomePageContent(),
    getCancellationPolicy(),
  ]);
  return { experiences: exps, homePage: hp, cancellationPolicy: cp };
});
```

### Signals (`useSignal`)
```typescript
const selectedCategory = useSignal("");  // Reactive state
const categoriesOpen = useSignal(false); // Modal toggle
const gridWidth = useSignal(1200);       // Responsive width
```

### Tasks (`useTask$` + `useVisibleTask$`)
```typescript
// Sync with URL on the server
useTask$(({ track }) => {
  track(() => loc.url.searchParams.get("category"));
  selectedCategory.value = loc.url.searchParams.get("category") || "";
});

// ResizeObserver – client-side only
useVisibleTask$(() => {
  const observer = new ResizeObserver(entries => {
    gridWidth.value = entries[0].contentRect.width;
  });
  observer.observe(grid);
  return () => observer.disconnect();
});
```

---

## Architecture

### Frontend (Qwik)
- **SSR**: Pre-renders on server
- **Hydration**: Zero JS by default
- **Lazy Loading**: Code splits per route
- **Resumable**: Picks up where it left off

### Backend (Firebase)
- **Firestore REST API**: No SDK, direct HTTP calls
- **Server Cache**: 60s TTL in-memory
- **Collections**:
  - `experiences` – Experience details
  - `homePage` – Hero content (1 doc)
  - `cancellationPolicy` – Policy (1 doc)

### Styling
- **Tailwind CSS v4** – Utility-first CSS
- **Responsive**: `sm`, `md`, `lg`, `xl` breakpoints
- **Colors**: Custom theme (nav-bg, btn-bg, primary, navy)
- **Typography**: Noto Sans/Serif (local fonts)

---

## Getting Started

### Prerequisites
- **Node.js**: 18.17+ | 20.3+ | 21+
- **npm** or **yarn**

### Setup

1. **Clone the repo**:
   ```bash
   git clone https://github.com/dragoshouse/frontend-ec-qwik.git
   cd frontend-ec-qwik
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment** (Firebase):
   ```bash
   cp .env.example .env.local
   # Add your Firestore REST API key (already configured)
   ```

4. **Start dev server**:
   ```bash
   npm start
   ```
   Opens http://localhost:5173 (SSR mode)

---

## Development

Start the development server with SSR enabled:

```bash
npm start
# or with yarn
yarn start
```

The dev server runs at http://localhost:5173 with hot-reload enabled.

---

## Build & Deploy

### Production Build

```bash
npm run build
```

This generates:
- `dist/client/` – Client bundle (lazy-loaded chunks)
- `dist/server/` – Server bundle for Firebase Functions
- `public/_routes.json` – Route manifest with exclusions

### Type Checking

```bash
npm run build.types
```

### Preview Build (Local)

```bash
npm run preview
```

Builds and serves locally to test production output.

### Deploy to Firebase

```bash
npm run deploy
```

This runs the full build and deploys to Firebase Hosting + Cloud Functions.

---

## Scripts Reference

| Command | Purpose |
|---------|---------|
| `npm start` | Dev server (SSR) |
| `npm run build` | Production build |
| `npm run build.client` | Client build only |
| `npm run build.server` | Server build for Firebase |
| `npm run build.types` | TypeScript type check |
| `npm run preview` | Local production preview |
| `npm run deploy` | Build + deploy to Firebase |
| `npm run lint` | ESLint check |
| `npm run fmt` | Prettier format |
| `npm run fmt.check` | Check formatting |

---

## Performance Metrics

- **JS Bundle**: ~60KB (minified, gzipped)
- **HTML Size**: ~80KB (includes inlined CSS/JS)
- **First Paint**: < 1s (SSR pre-rendered)
- **Time to Interactive**: ~2-3s
- **Lighthouse**: Target 90+ (Performance, Accessibility)

---

## Environment Variables

Create `.env.local` based on `.env.example`:

```env
# Firebase (already configured in code)
VITE_FIREBASE_PROJECT_ID=catallog-experiences
VITE_FIREBASE_API_KEY=AIzaSyB7Q-zNPFBeHwRXCtv6-aWghTMExXh_GDI
```

> ⚠️ **Security Note**: The Firestore API key is restricted to read-only access via Firestore Security Rules.

---

## Troubleshooting

### Dev server won't start
```bash
# Clear cache
rm -rf dist node_modules
npm install
npm start
```

### Port 5173 already in use
```bash
npm start -- --port 3000
```

### Build fails
```bash
npm run build.types  # Check for TS errors
npm run lint          # Check for linting errors
```

---

## Resources

- 📖 [Qwik Documentation](https://qwik.dev/)
- 📖 [QwikCity Routing](https://qwik.dev/qwikcity/routing/overview/)
- 📖 [Tailwind CSS](https://tailwindcss.com/)
- 🔥 [Firebase Docs](https://firebase.google.com/docs)
- 🏗️ [Vite Guide](https://vitejs.dev/guide/)

---

## License

Private project. All rights reserved.
