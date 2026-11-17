# ShowScraper — Agent Guide

> Audience: code assistants (Codex/Claude). Primary focus: the React frontend. The scraper lives in `proteanP/ShowScraper_Standalone`.

## Fast facts
- Live site: `bayareashows.org`
- Data: public JSON in GCS bucket `show-scraper-data/`
- Main code: `frontend/`
- The active ShowScraper workload runs natively on the `show-scraper` Sprite, without Docker.

## Frontend (Create React App)
- Location: `frontend/react-app/`; uses Bulma, Leaflet, Moment, React Markdown (GitHub dark CSS).
- Data flow: `src/utils/GcsDataLoader.js` fetches `sources.json` + per-venue `{venue}.json` from GCS; groups events by `MM-DD` (year omitted to avoid Dec/Jan issues).
- Views: list (image/text), text-only, map, venues list, about. Root `src/App.jsx`; route prop controls view.
- Additional view: `Shows by Venue` provides venue-name search across all loaded dates and links users to the Venues page for the directory.
- AI research UI (its backend, `llm-server/`, was removed on 2026-11-17, so the button currently has no server; the staged design is kept in the KB note `PROJECTS/SHIPPABLE/BAY_AREA_SHOWS/AI_RESEARCH_WORKFLOW`):
  - Triggered from `EventListItem.jsx` & `MapViewManager.jsx`; modal `AIResearchModal.jsx`.
  - Endpoint config in `src/config.js`: prod `https://llm-backend.dissonant.info/tasks/concert-research`, dev `http://localhost:8000/tasks/concert-research`.
  - Workflow: request quick summary (`quick` SSE); auto-start detailed unless cached. Shows per-artist progress bars; renders markdown.
  - Caching: `localStorage` per event+mode; “Re-fetch” clears caches. Sample mode via `API_CONFIG.USE_SAMPLE_DATA=true`.
- Calendar links: Google/ICS generated in `EventListItem.jsx` & `EventModal.jsx`; missing images fallback to `MissingImage.png`.
- Venue coordinate overrides: canonical tuples are in `frontend/src/venueLocationOverrides.json`; validate or append proposal batches with `npm run venue-overrides:update -- --input <file> [--dry-run]` from `frontend/`.
- Dev start: `npm install && npm start` in `frontend/`.

## What to do as an agent
- Default to consulting this file first. Keep AGENTS.md updated; avoid duplicative docs.
- If editing Claude-specific guidance, keep it brief and point back here.
- After making code changes, default to committing them and opening a PR unless the user explicitly asks for direct publishing. Frontend deployment is handled by GitHub Pages Actions after merges to `master`.

## Common troubleshooting
- Missing AI results: clear `localStorage` entries for the event; use “Re-fetch” button.
- Year off in dates: grouping intentionally ignores year—don’t “fix” without redesign.
