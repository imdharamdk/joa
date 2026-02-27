# JOA IT Prep MVP (Static HTML/CSS/JS)

A beginner-friendly GitHub Pages-ready MVP for HPSSC/HPRCA Junior Office Assistant (IT) preparation.

## Features

- Live current affairs (NewsAPI) auto-refresh every **60 seconds**.
- Shows exam-relevant headlines only.
- Avoids repeating already-seen news where possible.
- Quiz engine with **10 MCQs** at a time.
- **Refresh Questions** button for a new non-repeating set.
- Attempt history tracking using `localStorage`.
- Basic login/register simulation with demo JWT-like token.
- Local leaderboard (top 10) based on accuracy.
- Mobile-friendly responsive UI.

## Run locally

Because browser API calls can be blocked on `file://`, use a simple local server:

```bash
python3 -m http.server 8080
```

Open: `http://localhost:8080`

## Deploy to GitHub Pages

1. Push these files to your GitHub repository root.
2. Go to **Settings > Pages**.
3. Set source to `main` branch root.
4. Save and open your GitHub Pages URL.

## Notes

- NewsAPI free keys can have browser restrictions/rate limits.
- This MVP is static frontend only. For production, move API key to backend.
