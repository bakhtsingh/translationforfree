# TranslationForFree — Path 4: Utility Hub + Content Strategy

**Created:** 2026-05-04
**Status:** Strategic plan, supersedes `roadmap.md` (Feb 2026)
**Time horizon:** 24 months
**Realistic outcome target:** 50K-150K monthly visits, $2K-8K MRR
**Top-decile upside:** 200K-800K monthly visits, $8K-15K MRR

---

## Honest baseline

- **Today (May 2026):** 161 new users in 16 months. ~30 organic search sessions total. 87% Direct traffic = mostly owner + dev.
- **Comparables that took the same path:**
  - iLovePDF: ~217M monthly visits, ~$1M/mo, ~25 tools, took ~7 years to scale
  - Smallpdf: ~37M monthly visits, ~$11M/mo equivalent, acquired by Bending Spoons
  - TinyPNG: $7.4M/yr from one tool + API
  - DocTranslator (closest analog — solo dev, file translation): $360K ARR, ~3 years to scale
- **The unowned wedge:** Slator owns enterprise translation news (paywalled). Smartling/Phrase/Lokalise blogs serve enterprise buyers. **Nobody owns the prosumer/SMB translation space** with a free-tool-anchored content brand.

---

## The bet

Build a deep matrix of **25-40 free, no-signup, format-aware translation utilities** anchored by a content brand serving freelance translators, content creators, indie devs, fansubbers, and diaspora YouTubers.

**Why it can win:**
1. Existing tools (subtitle/SRT/VTT/transliteration) already cover the highest-leverage subtitle-tools cluster.
2. Gemini 2.5 Flash-Lite economics: ~$0.0003 per subtitle translation. API cost is **not** the constraint until ~500K translations/month.
3. SERP for translation utilities is moderate (not spam-saturated). Most competitors are signup-walled, slow, or ad-heavy.
4. The translation niche has no incumbent owning prosumer/SMB content — open lane.

---

## Positioning

**Tagline:** "Translate subtitles, documents, and dialogue without losing formatting. Free, no signup, in your browser."

**Wedge:** Format-aware utility. DeepL has 31 languages and great prose. Google Translate has everything but mangles SRT timestamps. **TranslationForFree's moat is "I uploaded an SRT, got an SRT back, timestamps intact, in 5 seconds."**

**Naming:** Keep "TranslationForFree.com" — SEO equity worth retaining; iLovePDF/FreeConvert proved descriptive names don't cap growth. When Pro tier launches in Year 2, brand it **"TranslationForFree Plus"** (mirrors Smallpdf Pro / iLovePDF Premium pattern).

**Trust signals (phased):**
- Months 1-6: "Open source [one component]", privacy statement ("files deleted after 60 minutes, never used to train AI"), MIT license badge for OSS, GitHub stars
- Months 6-12: "X tools and growing", "Y files translated this month" (when Y > 10K), 3-5 testimonials, HN/PH/BetaList logos as "as featured in"
- Year 2+: G2/Capterra reviews, "trusted by N users" counters

---

## Tool roadmap (25 tools over 24 months)

### Already shipped (6)
Subtitle Translation, SRT↔VTT Converter, Language Detector, Text Translation, Translation Comparison, Transliteration.

### P0 — Months 1-3 (7 tools, mostly pure-JS, zero API cost)

| Tool | Search vol/mo | KD | Build | Gemini? | Why |
|---|---|---|---|---|---|
| **Subtitle Timing Shifter** (offset cues by ±N sec) | 8-12K | Low | <1 day | No | Highest ROI/hour. Owns "subtitle out of sync" intent. |
| **SRT to TXT extractor** (strip timecodes) | 10-18K | Low | <1 day | No | Most-searched subtitle conversion after SRT↔VTT. |
| **Subtitle Merger** (combine 2 SRTs for dual-language) | 4-8K | Low | <1 day | No | Language-learner intent, high engagement. |
| **CPS / Reading-Speed Checker** (Netflix 20cps, BBC 17cps) | 1-3K | Low | 1-3 days | No | Pro/freelancer audience — anchors authority. |
| **Subtitle Line-Length Analyzer** (CPL: 42 char Netflix, 37 BBC) | 0.5-1.5K | V.Low | <1 day | No | Pairs with CPS. Tiny build. |
| **JSON i18n Translator** (preserves keys, ICU placeholders, `{name}`, `%s`) | 6-10K | Low-Med | 1-3 days | Yes | Dev audience = high LTV. Existing tools gate behind signup. |
| **Subtitle Splitter** (split by time/cue count) | 1-2K | Low | <1 day | No | Cluster completion. |

**Q1 outcome:** Subtitle-tools cluster = the most complete free toolbox on the web for subtitle work. Plus a dev wedge (JSON i18n).

### P1 — Months 4-9 (11 tools)

| Tool | Search vol/mo | KD | Build | Gemini? |
|---|---|---|---|---|
| SRT to ASS/SSA + ASS Tag Stripper | 2-4K | Low | <1 day | No |
| VTT to SRT (reverse of existing) | 5-9K | Low | <1 day | No |
| .po / .pot Translator (gettext, plurals/msgctxt) | 2-4K | Low | 1-3 days | Yes |
| Markdown Translator (preserves code blocks, frontmatter) | 3-5K | Low-Med | 1-3 days | Yes |
| CSV Translator (column-aware) | 4-7K | Med | 1-3 days | Yes |
| XLIFF Viewer + Translator (1.2 + 2.0) | 1-2K | Low | 4-10 days | Yes |
| Placeholder-Preserving Translator (`{0}`, `%s`, `%(name)s`) | 0.5-1.5K | V.Low | <1 day | Yes |
| Devanagari ↔ IAST/Hunterian Romanizer | 3-6K | Low | 1-3 days | No (Sanscript.js) |
| Pinyin Converter (Hanzi → tone-marked) | 15-25K | Med | 1-3 days | No (pinyin-pro lib) |
| Romaji Converter (Kana/Kanji → Hepburn) | 8-15K | Med | 1-3 days | No (kuroshiro lib) |
| Cyrillic → Latin (GOST/ISO9/BGN, RU/UA/BG/SR) | 4-8K | Low | <1 day | No |

**Q2-Q3 outcome:** Document/dev format-translator cluster + script romanization cluster. Pinyin and Romaji bring high-volume language-learner traffic at zero API cost.

### P2 — Months 10-18 (7 tools + pSEO layer)

| Tool | Search vol/mo | KD | Build | Gemini? |
|---|---|---|---|---|
| Korean Romanizer (Revised + McCune-Reischauer) | 2-4K | Low | 1-3 days | No |
| Translation Diff / Back-Translation Checker | 0.5-1K | V.Low | 1-3 days | Yes |
| Glossary / Terminology Consistency Checker | 0.3-0.8K | V.Low | 4-10 days | Yes |
| EPUB Chapter Translator (preserve XHTML/CSS) | 1-2K | Low | 4-10 days | Yes |
| HTML Translator (preserves tags + lang-attr) | 2-4K | Med | 1-3 days | Yes |
| Social Caption Translator (Twitter 280, IG 2200, TikTok 2200, YT) | 4-7K | Low-Med | 1-3 days | Yes |

**pSEO layer:** Generate `/translate-srt-{sourceLang}-to-{targetLang}` for top 10 language pairs (EN↔ES, EN↔FR, EN↔HI, EN↔AR, EN↔ZH, EN↔PT, EN↔JA, EN↔DE, EN↔RU, EN↔KO). **Each page MUST include:** live tool embed, 2-3 unique example sentences, format/dialect notes (e.g., LatAm vs. Iberian Spanish), reading-speed differences (CJK runs hot on CPS). ~30 pages with real per-page data.

### P3 — Months 18-24

- Game Localization Hub (Ren'Py / Unity .po / Godot CSV / Unreal — placeholder-safe sub-tools)
- Re-evaluate freemium gate (only if monthly Gemini spend > $200; currently nowhere close)

### Skip list (do NOT build)

- **PDF translator as hero / DOCX translator as hero** — Smallpdf, DocTranslator, MS Word own SERP. Build only as long-tail companion if at all.
- **Generic language-pair landing pages** ("translate english to spanish") — Google Translate owns position 0. Only do *subtitle-prefixed* long-tails.
- **Whisper / audio / podcast translation** — stack mismatch (no audio infra). Defer or skip.
- **Burn-in caption preview / MKV extractor** — high build cost (ffmpeg.wasm), users have desktop alternatives.
- **Generic "language detector" page** — Google detects in-browser; no upside.
- **TM (translation memory) match checker** — enterprise-only, fights memoQ/Trados, ~0 organic search.

---

## Content strategy

### The 7 pillars

| # | Pillar | Defensibility |
|---|---|---|
| **P1** | **Subtitle & Video Localization Workshop** — practical guides for fansubbers, YouTubers, indie filmmakers | Slator/Smartling ignore creators; Happyscribe/Rev paywall. We have free SRT/VTT tools. |
| **P2** | **AI Translation Quality Lab** — original benchmarks (Gemini vs DeepL vs GPT vs Claude vs GT) per language/domain | Nobody publishes free, reproducible benchmarks at this granularity. Gemini API access = our moat. |
| **P3** | **Freelance Translator Toolkit** — workflow, MTPE rates, post-editing for solo translators | ProZ is closed; LinkedIn influencers don't ship utilities. We give tools + tactics. |
| **P4** | **Diaspora & Heritage Languages** — Punjabi, Tamil, Hindi, Urdu, Yoruba, Tagalog, etc. | Big-tech blogs ignore these. Owner has Punjabi/Hindi domain knowledge — unfair advantage. |
| **P5** | **Localization for Indie SaaS / Indie Devs** — i18n, app store, README translation | Lokalise/Phrase target enterprise. Indie Hackers crowd needs no-budget answers. |
| **P6** | **Translation Industry Briefing** — weekly news + commentary, "we tested it" angle | Slator paywalled, MultiLingual slow. We're free, fast, opinionated, and link to free tools. |
| **P7** | **Subtitle Format & File-Plumbing Reference** — evergreen technical reference | StackOverflow answers stale. Tool-anchored definitive references. |

### Cadence (5-10 hrs/week)

- **1 long-form per week** (1500-2500w) anchored to a tool — 3-5 hrs
- **Friday "Translation Wire"** (600-900w, 5-7 curated items + 1 sharp opinion) — 1.5-2 hrs/week
- **1 benchmark per 6 weeks** (3000-4000w, original data) — batch on weekends
- **Refresh 1 old post/week** — 30 min

**Differentiation from Slator:** Slator reports; we *test*. Every news item gets a "we tried it" run on our own tools. Paywalled enterprise media can't do that.

### 15 original-data benchmark pieces (the link bait)

Each: reproducible method, GitHub repo with code, real budget. Ranked by reach potential:

1. **"Gemini 2.5 Flash vs DeepL: 12-Language Subtitle Quality Benchmark"** — 100 clips, 3 raters, COMET scores. Budget ~$50. (HN front page potential.)
2. **"AI Translation Drift: We Translated The Same SRT 100 Times"** — re-call at temp 0.7, n-gram variance. Budget ~$10. (r/MachineLearning.)
3. **"Best AI for Korean Honorifics"** — 200 sentences, 5 models, native rater. ~$80.
4. **"Arabic Dialect Benchmark (MSA + Egyptian + Gulf + Maghrebi)"** — ~$120, 4 native raters.
5. **"50 Idioms × 8 Languages × 5 Models"** — ~$60.
6. **"Subtitle CPS-Aware Translation: Which Models Respect Length?"** — ~$30.
7. **"Cost-per-1M-tokens for Full SRT Translation, All Major APIs"** — pure spreadsheet, $0.
8. **"Japanese Keigo Benchmark"** — ~$80.
9. **"Roman → Native Script Transliteration Accuracy (Hindi/Urdu/Arabic)"** — ~$40.
10. **"Low-Resource Benchmark: Yoruba/Pashto/Burmese"** — ~$100.
11. **"Code-Switching: Hinglish/Spanglish/Taglish"** — ~$60.
12. **"Subtitle Timing Preservation: Which Translators Break Timecodes?"** — pure tool test, $0.
13. **"Profanity / NSFW Handling per Model"** — $0.
14. **"Netflix Style Guide Compliance, Scored Across Models"** — ~$50.
15. **"State of AI Translation 2026"** — quarterly synthesis, the anchor piece.

### What NOT to write (HCU failure modes)

1. AI-spun "what is translation/localization/i18n" 101 listicles
2. Programmatic language-pair pages without unique data (classic HCU killer)
3. Generic "top 10 translation tools 2026" without our own testing
4. Reposted news with no commentary or original test
5. Affiliate-stuffed comparison reviews of tools we haven't used
6. AI-summarized academic papers without our own analysis
7. Padded "ultimate guide" pages that hit 5000w on fluff
8. Country/culture pages ("Doing business in Japan") — off-topic, low E-E-A-T
9. Thin glossaries (single-term pages)
10. Listicle dumps ("50 Spanish idioms") — pure SEO bait

**HCU lesson:** site-quality signal punishes domains that *look* like content farms even when individual pages are decent. Stay narrow, tool-anchored, expert-voiced.

---

## Distribution playbook

### 90-day launch sequence

**Days 1-14: Foundation (no launches yet)**
- Ship 2-3 P0 tools (Subtitle Timing Shifter + SRT→TXT + Subtitle Merger).
- Add 5 long-form articles targeting low-KD queries.
- Set up Search Console, get a real logo + favicon + OG image.
- Open-source one component (e.g., the SRT parser) on GitHub.

**Days 15-45: Show HN + niche Reddit + indie boards**
- **Show HN**: title pattern "Show HN: I built a free subtitle translator that runs on Gemini Flash". Avoid superlatives. Tuesday/Wednesday 8-10am ET. Realistic: top 30 = 2-5K visits, top 10 = 10-30K spike.
- **Reddit priority order**:
  - r/SideProject (240K) — friendly, allows launch posts
  - r/InternetIsBeautiful (17M) — must be polished, no signup wall
  - r/coolgithubprojects (75K) — needs OSS repo
  - r/webdev (2M) — only via Showoff Saturday thread
  - r/anime, r/fansubs — only as helpful comment, never top-level post
  - r/learnjapanese, r/learnkorean, r/languagelearning — strict; participate genuinely 4+ weeks before any tool mention
  - **AVOID** r/translator (request-translation sub, bans self-promo) and r/TranslationStudies (50K, professional translators, hostile to AI tools)
- **Indie launch boards**: BetaList, Indie Hackers Showcase, AlternativeTo (list as alternative to "DeepL", "Google Translate", "Subtitle Edit"), SaaSHub, Tiny Startups, Fazier, Peerlist. 50-300 visits each.

**Days 46-75: Product Hunt — only when ready**
PH algorithm changed; ~10% of submissions get featured. **Decision rule**: only launch on PH after 500+ engaged email subs and 3+ "hunters" with track records. Otherwise skip and focus on SEO.

**Days 76-90: Backlinks + content rhythm**
- HARO / Help-A-B2B-Writer: 3 queries/week, "founder of TranslationForFree". Land 1-2 quotes/month.
- Email outreach to roundup posts ranking for "best free SRT translator" — offer to be added. 10-15% hit rate on 50 emails.
- Submit to G2, Capterra, GetApp, Slant, ToolFinder. Skip everything else.

### Partnership angles that compound

- **Aegisub / Subtitle Edit ecosystems**: Lua macros / SE plugins that call your API. Get into 3-5 fansub Discords (earn the role first, contribute, then mention).
- **OBS + indie streamers**: "free subtitle translator for VOD uploads" angle on r/Twitch.
- **Indie game devs / itch.io**: r/gamedev's monthly thread + a free "localize your game.csv" tool.
- **Newsletters**: pitch Slator (paid, hard), Multilingual Magazine (sponsorship-friendly), Nimdzi Insights, Subtitler's Digest, Tool Finder. Sponsorships ~$200-800 for 5K-20K reach.

### Dead in 2025-2026 (do not bother)

PBN/blog network links, Fiverr backlink packages, AI-generated guest posts, generic directory submissions (most deindexed), reciprocal link schemes, comment spam, paid do-follow links from "DA50 sites".

---

## Monetization sequencing

### Gemini API cost reality
Gemini 2.5 Flash-Lite: $0.10/M input, $0.40/M output. Per subtitle file (500 in / 600 out): **$0.00029**. At 1M monthly translations: **$290/mo**. **API cost is not the constraint until ~500K monthly translations.**

**Add a soft cap now:** 20 files/day OR 50K characters/day per IP, no signup. Real users never hit it; caps worst-case bill.

### Phased monetization

**~5K monthly visits (months 1-6):** Pure growth. Footer "Buy me a coffee" link only. ~$0-30/mo in tips. **Do not add ads at this stage** — kills SEO velocity for ~$50/mo.

**~10K monthly visits (months 6-10):**
- **Skip display ads.** Add affiliate links to DeepL Pro (10-30% commission), Rev.com ($10-20/signup), Happyscribe Pro, GoTranscript. Realistic: **$50-150/mo** with no UX hit.
- Tip jar: 0.05-0.2% of users → $5-20/mo.
- Do NOT launch Pro yet.

**~25K-50K monthly visits (months 10-18):**
- **Launch Pro at $5/mo or $39/yr.** Gates: batch processing (>10 files), files >25MB, glossary/term-memory, history, no rate limit, priority queue, no ads. **DO NOT gate single-file translation** — that's the SEO funnel.
- Realistic conversion: 0.5-1.5% of users → ~250-750 paid × $5 = **$1.25K-3.75K MRR**.
- Optional Mediavine Journey ads (1K+ sessions threshold) — model $5-10 RPM for international-skewing translation traffic. At 50K visits: $250-500/mo. **Trade-off**: 0.5-1.5s page-speed hit, 5-10% SEO dent. Worth it after rankings are stable.
- **API offering:** $19/$49/$99 tiers (1K/5K/20K translations/mo). Pricing ~3× Gemini cost.
- **Skip AppSumo lifetime deal** — 70-75% revenue cut, attracts churn-prone deal hunters. DocTranslator's $360K ARR path didn't use it.

**~100K-500K monthly visits (months 18-24+):**
- Raptive (premium tier, 25K threshold): **$1.5K-7K/mo** at scale.
- Pro at 0.8% conversion of 200K visits → 1,600 × $5 = **$8K MRR**.
- **B2B API tiers** ($49/$199/$499/mo) for video agencies, indie game studios, podcast localization. One sticky $499/mo customer = 100 consumer subs.
- Direct ad sales / sponsorships (Smartling, Phrase, Lokalise, Crowdin): $500-2K per sponsored post or $1-3K/mo sidebar.

### Revenue path summary

| Visits/mo | Realistic monthly revenue | Path |
|---|---|---|
| 5K | $0-30 | Tip jar |
| 10K | $50-150 | + affiliate |
| 25K | $400-1K | + Pro launch |
| 50K | $1.5K-4K | Pro scaling |
| 100K | $4K-9K | + ads + B2B API |
| 200K+ | $8K-15K | All channels |

**The $2-10K MRR target is reachable at 50-150K monthly visits with 0.5-1% paid conversion at $5-9 ARPU + ads + affiliate.** That's the DocTranslator math. Bottleneck: traffic, not monetization design.

---

## 24-month phased plan

| Quarter | Tools shipped (cumul.) | Articles published (cumul.) | Distribution focus | Monetization | Visit target | Revenue target |
|---|---|---|---|---|---|---|
| **Q1 (now-Jul'26)** | 13 | 10 | Foundation, Show HN ready | None | 2-5K/mo | $0-20/mo |
| **Q2 (Aug-Oct'26)** | 17 | 24 | Show HN, Reddit niche, indie boards | Tip jar | 5-10K/mo | $20-100/mo |
| **Q3 (Nov'26-Jan'27)** | 21 | 38 | First benchmark drops, fansub Discord, partnerships | + Affiliate | 10-20K/mo | $100-300/mo |
| **Q4 (Feb-Apr'27)** | 24 | 52 | Quarterly state-of-translation, more partnerships | + Mediavine (optional) | 20-40K/mo | $300-1K/mo |
| **Q5 (May-Jul'27)** | 26 | 66 | pSEO matrix live, B2B outreach | + Pro launch ($5/mo) | 40-70K/mo | $1K-3K/mo |
| **Q6 (Aug-Oct'27)** | 28 | 80 | API offering, agency outreach | + API tiers | 70-120K/mo | $3K-6K/mo |
| **Q7 (Nov'27-Jan'28)** | 30 | 94 | Direct ad sales pitches | + Raptive | 120-200K/mo | $5K-9K/mo |
| **Q8 (Feb-May'28)** | 32+ | 108+ | Sponsorships, white-label talks | All channels | 150-300K/mo | $7K-12K/mo |

---

## Risks (and mitigations)

| Risk | Mitigation |
|---|---|
| **Google HCU / AI-content updates hit the domain** | Tool-anchor every article; use AI for drafts only, human-edit; ship original benchmarks, real screenshots, real opinions |
| **API abuse drives up Gemini bill** | Soft cap: 20 files/day or 50K chars/day per IP; add Cloudflare rate limit; monitor daily spend |
| **Gemini 3 / 4 deprecates Flash-Lite** | Decouple model behind a router service; A/B test on quality/cost monthly |
| **Spam/SERP saturation by AI-content sites** | Lean into original-data pieces and tool depth — content farms can't replicate either |
| **Solo-dev burnout on 2-year arc** | Ship rhythm (1 tool/week, 1 post/week max); take quarterly pauses; treat it as compounding portfolio not sprint |
| **Owner immigration timing forces priorities** | Path 4 outcomes also strengthen O-1 evidence (real users, real revenue, named adopters) — they compound, not conflict |
| **DeepL/Google launch a free SRT translator** | Defensible because of breadth (25+ tools) and content brand, not single-tool quality |

---

## Tech architecture notes

- **Frontend:** React + Vite stays. Each tool = page component. Shared `LanguageSelector`, `FileUploader`, `TranslationResult`, `SEOHead`. Add a `ToolGrid` for the homepage hub feel.
- **Backend:** FastAPI on Cloud Run stays. New service modules per format type (`subtitle_service.py`, `json_service.py`, `markdown_service.py`, etc.). Common middleware: rate limiting (IP-based), cost tracking, abuse detection.
- **Cost monitoring:** Add daily spend dashboard pulling from Gemini billing API. Alert if daily > 3× rolling average.
- **Scalability:** Cloud Run autoscales fine. The pinch point at 100K+ visits will be cold starts and Cloud Run egress; consider min-instance=1 once traffic justifies it (~$30/mo).
- **SEO infra:** Sitemap auto-generation per tool/article, JSON-LD schema on every tool page, Open Graph + Twitter Card meta on every page.

---

## Q1 punch list (the immediate first 90 days)

### Build (in order)
1. **Subtitle Timing Shifter** — pure JS, owns "subtitle out of sync" intent
2. **SRT to TXT** — pure JS, highest single-tool volume in cluster
3. **Subtitle Merger** — pure JS, language-learner traffic
4. **CPS Reading-Speed Checker** — anchors authority for subtitle pros
5. **JSON i18n Translator** — Gemini-backed, dev wedge
6. **Subtitle Splitter** — pure JS
7. **Subtitle Line-Length Analyzer** — pure JS, pairs with CPS

### Brand
- Logo + favicon + OG image (Figma 2 hours OR 99designs $200)
- Homepage `ToolGrid` redesign (mirror iLovePDF's 4-column tile layout)
- Footer with privacy statement + open-source badge + tip jar
- Update masthead positioning to "the subtitle & document translation toolkit"

### Content (first 10 posts)
1. "How to translate an SRT file free" → Subtitle Translator
2. "SRT to VTT: complete guide" → SRT↔VTT Converter
3. "Best free subtitle translator 2026" → Subtitle Translator (listicle)
4. "Gemini 2.5 vs DeepL: subtitle benchmark" → Translation Comparison ⭐ (link bait)
5. "Detect language of text free" → Language Detector
6. "Roman Urdu to Urdu converter guide" → Transliteration
7. "VTT to SRT converter" → SRT↔VTT Converter
8. "Translate YouTube captions" → Subtitle Translator
9. "MTPE rates per word 2026" → Translation Comparison
10. "Hinglish to Hindi converter guide" → Transliteration

### SEO
- Search Console set up for every new tool page within 24 hours of ship
- JSON-LD `SoftwareApplication` schema on every tool page
- Internal linking: every article links to ≥2 tools, every tool links to ≥3 related tools
- Sitemap updated on every new page (per project rule)

### Distribution
- One Show HN attempt (after 4-5 P0 tools shipped)
- One r/SideProject post
- Manual outreach to 20 "best free SRT translator 2026" roundup posts asking to be added
- One BetaList submission, one Indie Hackers Showcase, one AlternativeTo listing
- Open one OSS repo (e.g., extracted SRT parser) — even thin OSS feeds HN/Reddit credibility

### Monetization
- Footer "Buy me a coffee" link only
- **Do not add display ads, do not gate any feature**

---

## What this plan does NOT include (deliberately deferred)

- Multi-language site UI (Spanish/French/German/Hindi versions of the site itself) — defer to Q5 once English version has stable rankings
- Mobile app / PWA — defer to Q6+, web-first
- User accounts — defer until Pro tier launches in Q5
- Stripe integration — defer until Pro tier launches in Q5
- Whisper-based audio/podcast translation — out of stack scope; revisit Q7+

---

## References

- DocTranslator $360K ARR: https://getlatka.com/companies/doctranslator
- iLovePDF revenue analysis: https://reviewbolt.com/r/ilovepdf.com
- TinyPNG case study: https://jolyti.com/tinypng-one-page-website-success-story/
- OmniCalculator publisher case: https://www.google.com/ads/publisher/stories/omni_calculator/
- Slator 2025 Market Report: https://slator.com/slator-2025-language-industry-market-report/
- Gemini 2.5 Flash-Lite pricing: https://ai.google.dev/gemini-api/docs/pricing
- Programmatic SEO post-HCU 2026: https://backlinko.com/programmatic-seo
- Show HN analysis: https://antontarasenko.github.io/show-hn/
- Reddit self-promotion rules: https://www.conbersa.ai/learn/reddit-self-promotion-rules
- Mediavine/Raptive 2025: https://thisweekinblogging.com/mediavine-raptive-requirements/
- SaaS freemium conversion: https://firstpagesage.com/seo-blog/saas-freemium-conversion-rates/
- Netflix CPS standards: https://partnerhelp.netflixstudios.com/hc/en-us/articles/115001352212
