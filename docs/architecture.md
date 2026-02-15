# Architecture — TranslationForFree

## Current State (as of Feb 2026)

### Frontend (this repo)
- React 18 SPA hosted on Netlify
- Vite 5 build with SWC for fast compilation
- Tailwind CSS 3 + shadcn/ui for UI
- React Router v6 for client-side routing
- React Context + useReducer for state management

### Routes
| Path | Page | Status |
|------|------|--------|
| `/` | Landing page | Live |
| `/subtitle-translate` | Subtitle translation tool | Live |
| `/*` | 404 | Live |

### Backend (separate repo / Cloud Run)
- Existing Cloud Run service: `https://translationforfree-737270753447.us-south1.run.app`
- Has a `/translate` POST endpoint for text translation
- Currently unused in the UI (Translation.tsx page exists but is not routed)

### AI Integration
- Google Gemini API (`gemini-2.5-flash-lite`)
- Called directly from browser (API key exposed in client bundle)
- Batch processing: 25 subtitle cues per API call
- Retry with exponential backoff (3 retries, 30s timeout)

### Translation Flow (Subtitle)
1. User uploads SRT/VTT via drag-and-drop
2. Client parses file into SubtitleCue[] (id, startTime, endTime, text)
3. Cues split into batches of 25
4. Each batch sent to Gemini with structured prompt
5. Gemini returns JSON array of translated strings
6. Translations merged back and shown in editable table
7. User downloads as SRT or VTT

### State Management
Single context: `TranslationContext.tsx`
- useReducer pattern with typed actions
- States: idle → parsing → translating → completed | error
- Tracks: file, parsed cues, languages, progress, translations

### Key Services
| File | Responsibility |
|------|---------------|
| `geminiService.ts` | Gemini API calls, batching, retry logic |
| `subtitleParser.ts` | SRT/VTT parsing and formatting |
| `fileHandler.ts` | File read, download, clipboard, size formatting |
| `validationService.ts` | File validation (10MB max, 5000 cues max, .srt/.vtt only) |

### Environment Variables
| Variable | Where Used | Sensitivity |
|----------|-----------|-------------|
| `VITE_GA_MEASUREMENT_ID` | GA4 tracking | Public (by design) |
| `VITE_GEMINI_API_KEY` | Gemini API calls | SENSITIVE — exposed in client bundle |

### Deployment
- Netlify: auto-builds on push to main
- Build command: `npm run build`
- Publish directory: `dist/`
- Node 18
- SPA redirect configured in `netlify.toml`

---

## Planned Architecture (Target)

### Backend Migration
- **FastAPI** backend (Python) for all API integrations
- Gemini API calls move server-side (fixes API key exposure)
- Rate limiting per IP/session
- All new features (text, PDF, Word translation) go through backend

### Feature Roadmap
1. SRT/VTT subtitle translation (DONE)
2. VTT ↔ SRT format conversion
3. Plain text translation
4. PDF translation
5. Word document translation
6. Light monetization (usage-based, above API cost)

### Security Improvements Needed
- [ ] Move Gemini API key to backend (highest priority)
- [ ] Add rate limiting
- [ ] Add CORS restrictions on backend
- [ ] Consider usage tracking per session (for future monetization)

## Dependencies (key versions)
- React 18.3.1, React DOM 18.3.1
- TypeScript 5.8.3
- Vite 5.4.19
- Tailwind CSS 3.4.17
- React Router DOM 6.30.1
- TanStack React Query 5.83.0
- @google/generative-ai 0.24.1
- react-ga4 2.1.0
- Zod 3.25.76
- shadcn/ui components (Radix UI based)
