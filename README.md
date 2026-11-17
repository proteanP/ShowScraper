# ShowScraper

The React frontend for [bayareashows.org](https://bayareashows.org), which lists Bay Area concerts.

The scraper lives in a separate repository: https://github.com/proteanP/ShowScraper_Standalone

## Frontend quickstart

1. `cd frontend`
2. `yarn install`
3. `yarn start`

Build locally with `yarn build` in `frontend/`. Deployment runs through GitHub Pages Actions after changes are merged to `master`.

## Notes

- Event data is read from the public GCS bucket `show-scraper-data`.
- The AI research backend (`llm-server/`) was removed on 2026-11-17; it is in git history.
