# JOA IT Prep Pro (HTML + CSS + JS + PHP)

This project is now implemented using **HTML, CSS, JavaScript, and PHP only**.

## Stack
- Frontend: `index.html`, `style.css`, `app.js`
- Backend API (PHP): `api.php`

## Features
- Live exam-relevant current affairs (server-side NewsAPI fetch through PHP)
- Refresh every 60 seconds + manual refresh button
- Live countdown indicator for next automatic current-affairs refresh
- Shows 10 news items at a time
- Hard-level syllabus-focused quiz
- 100 questions per attempt (non-repeat based on attempt history)
- Leaderboard + timer + progress tracking

## Run locally (PHP server)

```bash
php -S 0.0.0.0:8080
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

## API routes
- `api.php?action=news`
- `api.php?action=questions`

## Note
For production, move API key to environment config and add database-backed auth/attempt storage.
## Deploy to GitHub Pages

1. Push these files to your GitHub repository root.
2. Go to **Settings > Pages**.
3. Set source to `main` branch root.
4. Save and open your GitHub Pages URL.

## Notes

- NewsAPI free keys can have browser restrictions/rate limits.
- This MVP is static frontend only. For production, move API key to backend.
