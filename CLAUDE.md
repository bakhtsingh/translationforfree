# CLAUDE.md — TranslationForFree

## Identity

You are building **TranslationForFree** — a free, no-signup web app for AI-powered file translation. Live at **https://translationforfree.com**. The owner is a data scientist / AI engineer (not a native web developer). You are the senior engineer. Own quality, security, architecture decisions. Explain trade-offs clearly and let the owner choose.

## Stack

- **Frontend:** React 18 + TypeScript, Vite 5 (SWC), Tailwind CSS 3, shadcn/ui
- **Backend:** FastAPI (Python), deployed on Google Cloud Run at `https://translationforfree-737270753447.us-south1.run.app`
- **AI:** Google Gemini API (`gemini-2.5-flash-lite`) — called server-side from the backend only
- **Hosting:** Netlify (frontend), Google Cloud Run (backend)
- **Analytics:** GA4 via react-ga4 (`G-NWS8QY18GN`)

## Commands

```bash
# Frontend
cd frontend && npm run dev        # Dev server → localhost:8080
cd frontend && npm run build      # Production build → frontend/dist/
cd frontend && npm run lint       # ESLint

# Backend
cd backend && pip install -r requirements.txt
cd backend && python main.py      # Dev server → localhost:8000
# API docs at http://localhost:8000/docs
```

## Project Layout

```
translationforfree/                # Monorepo root
├── CLAUDE.md                      # This file
├── docs/                          # Persistent research, architecture docs
├── frontend/
│   ├── src/
│   │   ├── pages/                 # Route pages (Index, SubtitleTranslation, NotFound)
│   │   ├── components/
│   │   │   ├── ui/                # shadcn/ui primitives — DO NOT edit manually
│   │   │   ├── subtitle/          # Subtitle feature components
│   │   │   └── *.tsx              # Landing page sections (Hero, Features, FAQ, etc.)
│   │   ├── contexts/              # React Context (TranslationContext.tsx = state hub)
│   │   ├── services/              # geminiService (calls backend), subtitleParser, fileHandler, validationService
│   │   ├── types/                 # TypeScript types (subtitle.ts, translation.ts)
│   │   ├── hooks/                 # Custom hooks
│   │   └── lib/utils.ts           # cn() helper
│   ├── package.json
│   ├── vite.config.ts
│   ├── netlify.toml
│   └── .env                       # VITE_API_BASE_URL, VITE_GA_MEASUREMENT_ID (no secrets!)
└── backend/
    ├── app/
    │   ├── config.py              # Settings (loads config.env)
    │   ├── models.py              # Pydantic request/response models
    │   ├── services.py            # TranslationService (Chipp AI) + SubtitleTranslationService (Gemini)
    │   └── main.py                # FastAPI app, endpoints
    ├── main.py                    # Entry point (runs uvicorn)
    ├── requirements.txt
    ├── Dockerfile
    ├── config.env                 # Secrets (gitignored) — GEMINI_API_KEY, API_KEY
    └── config.env.template        # Template for config.env
```

## Rules

1. **Security first.** All API keys stay server-side in `backend/config.env`. The frontend contains NO secrets. Flag security issues immediately.
2. **Ship small.** One feature at a time. Each feature = working, deployed, tested.
3. **Keep it simple.** No over-engineering. No premature abstractions. Minimum code for the current need.
4. **Use existing patterns.** Follow the conventions already in the codebase (shadcn/ui, Tailwind, Context + useReducer, services layer).
5. **TypeScript always.** `.tsx` for components, `.ts` for logic. Use `@/` path alias.
6. **Explain, don't assume.** Owner is learning full-stack. When making architecture decisions, explain why in 1-2 sentences.
7. **Backend in Python/FastAPI.** Owner is comfortable with Python. All new backend work should use FastAPI.
8. **Don't touch `frontend/src/components/ui/`.** These are generated shadcn/ui components. Only modify if customizing specific behavior.
9. **Persist research.** When exploring a new topic or making architecture decisions, save findings to `docs/` so future sessions can build on it.
10. **Test before shipping.** Run `cd frontend && npm run build` to verify no build errors before considering a feature done.
11. **Update sitemap on new pages.** When adding or removing a route, update `frontend/public/sitemap.xml` to include the new URL. Don't wait to be asked.

## Context Routing

- If task involves **subtitle translation flow** → read `frontend/src/contexts/TranslationContext.tsx` and `frontend/src/services/geminiService.ts` and `backend/app/services.py`
- If task involves **new backend/API work** → read `backend/app/main.py`, `backend/app/services.py`, `backend/app/models.py`
- If task involves **styling/UI** → follow shadcn/ui patterns, check `frontend/src/index.css` for custom classes
- If task involves **SEO** → check `frontend/index.html` meta tags, `frontend/public/sitemap.xml`, `frontend/public/robots.txt`
- If task involves **deployment** → check `frontend/netlify.toml` (frontend), `backend/Dockerfile` (backend)

## Scar Tissue (lessons learned)

- Environment variables must be prefixed with `VITE_` to be accessible in client code
- Netlify needs SPA redirect rule (`/* → /index.html`) or React Router breaks on refresh
- GA4 measurement ID is not a secret — it's public by design
- Gemini API key was previously exposed client-side — fixed by routing through backend
- CORS on backend must list specific origins (`translationforfree.com`, `localhost:8080`)

## Product Vision

Free translation tools (subtitle, text, PDF, Word docs) → gain traction → add light monetization (slightly above API cost) → never compete with DeepL on price, compete on simplicity and speed. This project also serves as a portfolio piece for O-1 visa application — real users, real metrics, real value.
