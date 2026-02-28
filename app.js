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
const NEWS_API_KEY = "3bf83bdcec3f42a0b9c4372109157e58";
const NEWS_URL = `https://newsapi.org/v2/top-headlines?country=in&category=general&pageSize=20&apiKey=${NEWS_API_KEY}`;
const NEWS_REFRESH_MS = 60_000;
const EXAM_KEYWORDS = [
  "government", "scheme", "economy", "science", "technology", "award", "sports", "india", "education", "policy", "digital"
];

const QUESTION_BANK = [
  { id: 1, topic: "Computer", q: "CPU stands for?", options: ["Central Process Unit", "Central Processing Unit", "Computer Primary Unit", "Central Program Utility"], ans: 1 },
  { id: 2, topic: "MS Excel", q: "Which formula adds A1 to A10?", options: ["=ADD(A1:A10)", "=SUM(A1:A10)", "=PLUS(A1:A10)", "=TOTAL(A1:A10)"], ans: 1 },
  { id: 3, topic: "Networking", q: "IP stands for?", options: ["Internet Protocol", "Internal Process", "Internet Program", "Instant Protocol"], ans: 0 },
  { id: 4, topic: "DBMS", q: "SQL is used to?", options: ["Create designs", "Manage databases", "Draw network", "Run antivirus"], ans: 1 },
  { id: 5, topic: "Cyber", q: "Phishing is a type of?", options: ["Backup", "Cyber attack", "Programming", "Compression"], ans: 1 },
  { id: 6, topic: "Himachal", q: "Capital of Himachal Pradesh is?", options: ["Mandi", "Dharamshala", "Shimla", "Solan"], ans: 2 },
  { id: 7, topic: "Himachal", q: "River Beas originates near?", options: ["Rohtang Pass", "Kaza", "Nahan", "Una"], ans: 0 },
  { id: 8, topic: "Current Affairs", q: "NITI Aayog is related to?", options: ["Defense", "Policy planning", "Sports", "Judiciary"], ans: 1 },
  { id: 9, topic: "Internet", q: "HTTP means?", options: ["Hyper Text Transfer Protocol", "High Transfer Text Process", "Host Transfer Tool", "Hyper Tool Transfer Program"], ans: 0 },
  { id: 10, topic: "Windows", q: "Windows shortcut for copy is?", options: ["Ctrl+V", "Ctrl+X", "Ctrl+C", "Ctrl+P"], ans: 2 },
  { id: 11, topic: "MS Office", q: "PowerPoint is mainly used for?", options: ["Spreadsheets", "Presentations", "Databases", "Coding"], ans: 1 },
  { id: 12, topic: "Computer", q: "RAM is?", options: ["Permanent", "Volatile", "External", "Output"], ans: 1 },
  { id: 13, topic: "Himachal", q: "Kullu Dussehra is celebrated in?", options: ["Winter", "Monsoon", "Autumn", "Spring"], ans: 2 },
  { id: 14, topic: "Current Affairs", q: "GDP refers to?", options: ["Gross Domestic Product", "General Development Plan", "Gross Demand Production", "Global Data Protocol"], ans: 0 },
  { id: 15, topic: "DBMS", q: "Primary key should be?", options: ["Duplicate", "Null", "Unique", "Optional"], ans: 2 },
  { id: 16, topic: "Networking", q: "Which is a private IP range?", options: ["8.8.8.8", "192.168.1.2", "1.1.1.1", "23.0.0.1"], ans: 1 },
  { id: 17, topic: "Cyber", q: "2FA improves?", options: ["Screen size", "Security", "Battery", "Graphics"], ans: 1 },
  { id: 18, topic: "MS Excel", q: "Absolute reference uses?", options: ["#", "$", "@", "%"], ans: 1 },
  { id: 19, topic: "Himachal", q: "Chamba is famous for?", options: ["Tea", "Rumal art", "IT park", "Ports"], ans: 1 },
  { id: 20, topic: "Current Affairs", q: "ISRO is associated with?", options: ["Agriculture", "Railways", "Space", "Tourism"], ans: 2 }
];

const state = {
  currentQuiz: [],
  user: JSON.parse(localStorage.getItem("joa-user") || "null"),
  attempts: JSON.parse(localStorage.getItem("joa-attempted-ids") || "[]"),
  seenNews: JSON.parse(localStorage.getItem("joa-seen-news") || "[]"),
  leaderboard: JSON.parse(localStorage.getItem("joa-leaderboard") || "[]")
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
function initAuth() {
  const form = byId("auth-form");
  const status = byId("auth-status");
  if (state.user) status.textContent = `Logged in as ${state.user.name} (JWT demo token active)`;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = byId("name").value.trim();
    const email = byId("email").value.trim();
    if (!name || !email) return;
    const token = btoa(`${email}:${Date.now()}`);
    state.user = { name, email, token };
    localStorage.setItem("joa-user", JSON.stringify(state.user));
    status.textContent = `Logged in as ${name} (JWT demo token active)`;
  });
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
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

  state.currentQuiz.forEach((item, idx) => {
    const wrapper = document.createElement("div");
    wrapper.className = "question";
    const opts = shuffle(item.options.map((opt, i) => ({ text: opt, originalIndex: i })));
    wrapper.innerHTML = `<h4>Q${idx + 1}. [${item.topic}] ${item.q}</h4>`;

    opts.forEach((opt, optIdx) => {
      const label = document.createElement("label");
      label.innerHTML = `<input type="radio" name="q-${item.id}" value="${opt.originalIndex}" ${optIdx === 0 ? "required" : ""} /> ${opt.text}`;
      wrapper.appendChild(label);
      wrapper.appendChild(document.createElement("br"));
    });

    form.appendChild(wrapper);
  });

  byId("quiz-meta").textContent = `Attempted so far: ${state.attempts.length}`;
}

function loadNewQuiz() {
  const unseen = QUESTION_BANK.filter((q) => !state.attempts.includes(q.id));
  if (unseen.length < 10) {
    byId("score-output").textContent = "Not enough new questions left. Reset attempt history to continue.";
    return;
  }

  const topicBuckets = unseen.reduce((acc, q) => {
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
  const picked = [];
  Object.values(topicBuckets).forEach((bucket) => {
    if (picked.length < 10 && bucket.length) picked.push(shuffle(bucket)[0]);
  });

  const remaining = unseen.filter((q) => !picked.some((x) => x.id === q.id));
  while (picked.length < 10) {
    picked.push(...shuffle(remaining).slice(0, 10 - picked.length));
  }

  state.currentQuiz = shuffle(picked).slice(0, 10);
  renderQuiz();
}

function submitQuiz() {
  if (!state.user) {
    byId("score-output").textContent = "Please login first.";
    byId("score-output").textContent = "Please login/register first.";
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

  const accuracy = Math.round((score / state.currentQuiz.length) * 100);
  byId("score-output").textContent = `Score: ${score}/${state.currentQuiz.length} | Accuracy: ${accuracy}%`;

  state.leaderboard.push({
    name: state.user.name,
    score,
    accuracy,
    ts: Date.now()
  });

  state.leaderboard = state.leaderboard
    .sort((a, b) => b.accuracy - a.accuracy || b.score - a.score)
    .slice(0, 10);

  localStorage.setItem("joa-leaderboard", JSON.stringify(state.leaderboard));
  renderLeaderboard();
  loadNewQuiz();
}

function renderLeaderboard() {
  const list = byId("leaderboard-list");
  list.innerHTML = "";
  if (!state.leaderboard.length) {
    list.innerHTML = "<li>No attempts yet.</li>";
    return;
  }
  state.leaderboard.forEach((row, i) => {
    const li = document.createElement("li");
    li.textContent = `#${i + 1} ${row.name} — ${row.score}/10 (${row.accuracy}%)`;
    list.appendChild(li);
  });
}

function isExamRelevant(article) {
  const text = `${article.title || ""} ${article.description || ""}`.toLowerCase();
  return EXAM_KEYWORDS.some((k) => text.includes(k));
}

function renderNews(news) {
  const list = byId("news-list");
  list.innerHTML = "";
  if (!news.length) {
    list.innerHTML = "<li>No relevant news available right now.</li>";
    return;
  }

  news.slice(0, 5).forEach((article) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${article.url}" target="_blank" rel="noopener noreferrer">${article.title}</a>`;
    list.appendChild(li);
  });
}

async function fetchNews() {
  try {
    const response = await fetch(NEWS_URL);
    const data = await response.json();
    const filtered = (data.articles || []).filter(isExamRelevant);

    const unseen = filtered.filter((a) => {
      const key = a.url || a.title;
      return key && !state.seenNews.includes(key);
    });

    unseen.forEach((a) => state.seenNews.push(a.url || a.title));
    state.seenNews = state.seenNews.slice(-200);
    localStorage.setItem("joa-seen-news", JSON.stringify(state.seenNews));

    renderNews(unseen.length ? unseen : filtered);
  } catch (err) {
    renderNews([]);
    byId("news-list").innerHTML = `<li>News fetch failed. In static GitHub hosting, NewsAPI may block some browser requests due to API restrictions.</li>`;
  }
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
  loadNewQuiz();
  fetchNews();

  setInterval(fetchNews, NEWS_REFRESH_MS);

  byId("refresh-news").addEventListener("click", fetchNews);
  byId("refresh-quiz").addEventListener("click", loadNewQuiz);
  byId("submit-quiz").addEventListener("click", (e) => {
    e.preventDefault();
    submitQuiz();
  });

  byId("reset-attempts").addEventListener("click", () => {
    state.attempts = [];
    localStorage.removeItem("joa-attempted-ids");
    byId("score-output").textContent = "Attempt history reset. Fresh questions enabled.";
    loadNewQuiz();
  });
}

init();
