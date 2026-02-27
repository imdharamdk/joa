# JOA IT Prep Pro (Static HTML/CSS/JS)

A GitHub Pages-ready exam prep web app focused on HPSSC/HPRCA JOA (IT).

## What's improved

- Live current affairs + current-affairs search mode with refresh every **60 seconds**.
- Shows **10 news items** at a time.
- News refresh button included.
- Non-repeat logic for news using localStorage tracking.
- Reliable display using multi-source fetch + fallback current-affairs feed.
- Hard-level syllabus-focused quiz bank (**140 questions total**).
- Each attempt loads **100 questions** (non-repeat across attempts).
- Timer automation (60 minutes), answer progress tracking, and leaderboard.
- Enhanced dark responsive UI.

## Run locally

```bash
python3 -m http.server 8080
```

Open: `http://localhost:8080`

## Deploy to GitHub Pages

1. Push files to repo root.
2. GitHub → Settings → Pages.
3. Source: deploy from `main` root.
4. Open generated URL.

## Important note

This is static frontend MVP. For production reliability/security, move all news fetching to a backend API and keep the key server-side.
