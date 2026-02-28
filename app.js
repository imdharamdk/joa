const NEWS_REFRESH_MS = 60_000;
const QUIZ_SIZE = 100;
const QUIZ_SECONDS = 60 * 60;

const state = {
  user: JSON.parse(localStorage.getItem("joa-user") || "null"),
  attempts: JSON.parse(localStorage.getItem("joa-attempted-ids") || "[]"),
  leaderboard: JSON.parse(localStorage.getItem("joa-leaderboard") || "[]"),
  seenNews: JSON.parse(localStorage.getItem("joa-seen-news") || "[]"),
  questionBank: [],
  currentQuiz: [],
  timerLeft: QUIZ_SECONDS,
  timerInterval: null,
  newsInFlight: false,
  newsPollTimeout: null,
  newsTickInterval: null,
  nextNewsAt: 0
};

const byId = (id) => document.getElementById(id);

function shuffle(arr) {
  const c = [...arr];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

async function apiGet(action) {
  const nonce = Date.now(); // cache-busting for auto refresh
  const res = await fetch(`api.php?action=${encodeURIComponent(action)}&_=${nonce}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function setNextRefreshTarget(ms) {
  state.nextNewsAt = Date.now() + ms;
}

function startNewsCountdown() {
  clearInterval(state.newsTickInterval);
  state.newsTickInterval = setInterval(() => {
    if (!state.nextNewsAt) return;
    const leftMs = state.nextNewsAt - Date.now();
    if (leftMs <= 0) {
      byId("news-timer").textContent = "Auto refresh due now...";
      return;
    }
    const leftSec = Math.ceil(leftMs / 1000);
    byId("news-timer").textContent = `Next auto refresh in ${leftSec}s`;
  }, 1000);
}

function renderNews(items) {
  const list = byId("news-list");
  list.innerHTML = "";

  const deduped = items.filter((x) => {
    const key = x.url || x.title;
    if (!key) return false;
    if (state.seenNews.includes(key)) return false;
    state.seenNews.push(key);
    return true;
  });

  const pool = deduped.length ? deduped : shuffle(items);
  const chosen = pool.slice(0, 10);

  chosen.forEach((a, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${a.url || '#'}" target="_blank" rel="noopener noreferrer">${a.title || `Current Affairs ${i + 1}`}</a>`;
    list.appendChild(li);
  });

  if (!chosen.length) list.innerHTML = "<li>No current affairs available.</li>";
  state.seenNews = state.seenNews.slice(-500);
  localStorage.setItem("joa-seen-news", JSON.stringify(state.seenNews));
  byId("news-count").textContent = `News: ${chosen.length} latest`;
}

async function fetchNews({ manual = false } = {}) {
  if (state.newsInFlight) return;
  state.newsInFlight = true;
  byId("news-timer").textContent = manual ? "Refreshing manually..." : "Refreshing now...";

  try {
    const data = await apiGet("news");
    renderNews(data.items || []);
  } catch {
    byId("news-timer").textContent = "News refresh failed, retrying automatically";
  } finally {
    state.newsInFlight = false;
    scheduleNextNewsPoll();
  }
}

function scheduleNextNewsPoll() {
  clearTimeout(state.newsPollTimeout);
  setNextRefreshTarget(NEWS_REFRESH_MS);
  state.newsPollTimeout = setTimeout(() => fetchNews({ manual: false }), NEWS_REFRESH_MS);
}

function renderLeaderboard() {
  const list = byId("leaderboard-list");
  list.innerHTML = "";
  if (!state.leaderboard.length) {
    list.innerHTML = "<li>No attempts yet.</li>";
    return;
  }
  state.leaderboard.forEach((r, i) => {
    const li = document.createElement("li");
    li.textContent = `#${i + 1} ${r.name} — ${r.score}/${r.total} (${r.accuracy}%)`;
    list.appendChild(li);
  });
}

function updateProgress() {
  const answered = state.currentQuiz.filter((q) => document.querySelector(`input[name="q-${q.id}"]:checked`)).length;
  byId("quiz-progress").textContent = `Answered: ${answered}/${state.currentQuiz.length}`;
}

function renderQuiz() {
  const form = byId("quiz-form");
  form.innerHTML = "";
  state.currentQuiz.forEach((q, idx) => {
    const box = document.createElement("div");
    box.className = "question";
    box.innerHTML = `<h4>Q${idx + 1}. [${q.topic} | ${q.level}] ${q.q}</h4>`;

    q.options.forEach((opt, i) => {
      const label = document.createElement("label");
      label.innerHTML = `<input type="radio" name="q-${q.id}" value="${i}" /> ${opt}`;
      box.appendChild(label);
      box.appendChild(document.createElement("br"));
    });

    form.appendChild(box);
  });

  form.onchange = updateProgress;
  updateProgress();
  byId("quiz-meta").textContent = `Attempted unique questions: ${state.attempts.length}`;
}

function pickQuiz() {
  const unseen = state.questionBank.filter((q) => !state.attempts.includes(q.id));
  if (unseen.length < QUIZ_SIZE) {
    byId("score-output").textContent = `Only ${unseen.length} unseen questions left. Reset history for fresh 100.`;
  }

  const byTopic = unseen.reduce((acc, q) => {
    acc[q.topic] = acc[q.topic] || [];
    acc[q.topic].push(q);
    return acc;
  }, {});

  Object.values(byTopic).forEach((arr) => arr.sort(() => Math.random() - 0.5));
  const topics = Object.keys(byTopic);
  const selected = [];
  let k = 0;

  while (selected.length < Math.min(QUIZ_SIZE, unseen.length)) {
    const topic = topics[k % topics.length];
    const item = byTopic[topic].pop();
    if (item) selected.push(item);
    k += 1;
    if (!topics.some((t) => byTopic[t].length)) break;
  }

  state.currentQuiz = shuffle(selected).slice(0, QUIZ_SIZE);
  renderQuiz();
  startTimer();
}

function startTimer() {
  clearInterval(state.timerInterval);
  state.timerLeft = QUIZ_SECONDS;

  const paint = () => {
    const m = String(Math.floor(state.timerLeft / 60)).padStart(2, "0");
    const s = String(state.timerLeft % 60).padStart(2, "0");
    byId("quiz-timer").textContent = `Timer: ${m}:${s}`;
  };

  paint();
  state.timerInterval = setInterval(() => {
    state.timerLeft -= 1;
    paint();
    if (state.timerLeft <= 0) {
      clearInterval(state.timerInterval);
      submitQuiz();
    }
  }, 1000);
}

function submitQuiz() {
  if (!state.user) {
    byId("score-output").textContent = "Please login first.";
    return;
  }

  let score = 0;
  state.currentQuiz.forEach((q) => {
    const selected = document.querySelector(`input[name="q-${q.id}"]:checked`);
    if (selected && Number(selected.value) === q.ans) score += 1;
    if (!state.attempts.includes(q.id)) state.attempts.push(q.id);
  });

  localStorage.setItem("joa-attempted-ids", JSON.stringify(state.attempts));
  const total = state.currentQuiz.length;
  const accuracy = total ? Math.round((score / total) * 100) : 0;
  byId("score-output").textContent = `Score: ${score}/${total} | Accuracy: ${accuracy}%`;

  state.leaderboard.push({ name: state.user.name, score, total, accuracy, ts: Date.now() });
  state.leaderboard = state.leaderboard
    .sort((a, b) => b.accuracy - a.accuracy || b.score - a.score)
    .slice(0, 20);
  localStorage.setItem("joa-leaderboard", JSON.stringify(state.leaderboard));
  renderLeaderboard();
}

function initAuth() {
  const status = byId("auth-status");
  if (state.user) status.textContent = `Logged in as ${state.user.name}`;

  byId("auth-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = byId("name").value.trim();
    const email = byId("email").value.trim();
    if (!name || !email) return;
    state.user = { name, email, token: btoa(`${email}:${Date.now()}`) };
    localStorage.setItem("joa-user", JSON.stringify(state.user));
    status.textContent = `Logged in as ${name}`;
  });
}

async function initQuestions() {
  const data = await apiGet("questions");
  state.questionBank = data.items || [];
  byId("question-count").textContent = `Questions: ${state.questionBank.length}`;
  pickQuiz();
}

function init() {
  initAuth();
  renderLeaderboard();
  startNewsCountdown();
  fetchNews();

  byId("refresh-news").addEventListener("click", () => fetchNews({ manual: true }));
  byId("refresh-quiz").addEventListener("click", pickQuiz);
  byId("submit-quiz").addEventListener("click", (e) => { e.preventDefault(); submitQuiz(); });
  byId("reset-attempts").addEventListener("click", () => {
    state.attempts = [];
    localStorage.removeItem("joa-attempted-ids");
    byId("score-output").textContent = "Attempt history reset.";
    pickQuiz();
  });

  initQuestions().catch(() => {
    byId("score-output").textContent = "Failed to load questions from PHP API.";
  });
}

init();
