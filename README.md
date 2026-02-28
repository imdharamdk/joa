# JOA IT Prep Pro (HTML + CSS + JS + PHP)

This project is now implemented using **HTML, CSS, JavaScript, and PHP only**.

## Stack
- Frontend: `index.html`, `style.css`, `app.js`
- Backend API (PHP): `api.php`

## Features
- Live exam-relevant current affairs (server-side NewsAPI fetch through PHP)
- Refresh every 60 seconds + manual refresh button
- Shows 10 news items at a time
- Hard-level syllabus-focused quiz
- 100 questions per attempt (non-repeat based on attempt history)
- Leaderboard + timer + progress tracking

## Run locally (PHP server)

```bash
php -S 0.0.0.0:8080
```

Open: `http://localhost:8080`

## API routes
- `api.php?action=news`
- `api.php?action=questions`

## Note
For production, move API key to environment config and add database-backed auth/attempt storage.
