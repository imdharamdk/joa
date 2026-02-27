const NEWS_API_KEY = "3bf83bdcec3f42a0b9c4372109157e58";
const NEWS_REFRESH_MS = 60_000;
const QUIZ_SIZE = 100;
const QUIZ_DURATION_SECONDS = 60 * 60;
const EXAM_KEYWORDS = [
  "government", "scheme", "economy", "science", "technology", "award", "sports", "india", "education", "policy", "digital", "himachal", "hp", "cabinet", "budget", "exam"
];

const CURRENT_AFFAIRS_FALLBACK = [
  { title: "India expands digital public infrastructure for citizen services.", url: "https://www.india.gov.in" },
  { title: "Himachal Pradesh pushes e-governance service delivery in districts.", url: "https://himachal.nic.in" },
  { title: "National cyber security awareness drives expanded across states.", url: "https://www.cert-in.org.in" },
  { title: "Union budget focus continues on digital skilling and employment.", url: "https://www.indiabudget.gov.in" },
  { title: "Sports governance reforms and athlete support schemes updated.", url: "https://yas.nic.in" },
  { title: "Science and innovation missions prioritize semiconductor ecosystem.", url: "https://dst.gov.in" },
  { title: "Himachal tourism and infrastructure initiatives highlighted in state updates.", url: "https://himachaltourism.gov.in" },
  { title: "Major government schemes now linked with stronger online delivery systems.", url: "https://www.mygov.in" },
  { title: "Internet safety advisories issued for exam aspirants and students.", url: "https://cybercrime.gov.in" },
  { title: "Policy discussions continue on AI, data governance and public services.", url: "https://www.meity.gov.in" },
  { title: "State-level digital records and citizen portals receive new upgrades.", url: "https://digitalindia.gov.in" },
  { title: "Employment-focused skilling programs announced for youth in northern states.", url: "https://nsdcindia.org" }
];

const NEWS_ENDPOINTS = [
  `https://newsapi.org/v2/top-headlines?country=in&pageSize=50&apiKey=${NEWS_API_KEY}`,
  `https://newsapi.org/v2/everything?q=India%20government%20economy%20science%20technology%20Himachal&sortBy=publishedAt&pageSize=50&language=en&apiKey=${NEWS_API_KEY}`
];

const NEWS_PROXY_URLS = NEWS_ENDPOINTS.flatMap((endpoint) => [
  endpoint,
  `https://corsproxy.io/?${encodeURIComponent(endpoint)}`,
  `https://api.allorigins.win/raw?url=${encodeURIComponent(endpoint)}`,
  `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(endpoint)}`
]);

const seedBank = [
  ["Computer", "In 8086 architecture, BIU stands for", "Bus Interface Unit", ["Binary Interface Unit", "Bus Instruction Unit", "Basic Input Unit"]],
  ["Computer", "POST in a computer boot process means", "Power-On Self-Test", ["Power-On System Task", "Programmed Operational System Test", "Primary Output Scan Test"]],
  ["Computer", "Firmware is typically stored in", "ROM/Flash memory", ["RAM", "Cache only", "Hard disk swap"]],
  ["Computer", "Which scheduler decides which process gets CPU next", "CPU scheduler", ["Disk scheduler", "Memory scheduler", "File scheduler"]],
  ["Windows", "In Windows, Task Scheduler is mainly used for", "Automating scheduled tasks", ["Creating partitions", "Encrypting BIOS", "Compiling drivers"]],
  ["Windows", "NTFS supports which feature not native to FAT32", "File permissions (ACL)", ["Basic read/write", "Folder creation", "Simple copy-paste"]],
  ["MS Excel", "Which function counts non-empty cells", "COUNTA", ["COUNTBLANK", "COUNTIF", "NUMBERS"]],
  ["MS Excel", "To lock both row and column in Excel reference use", "$A$1 style absolute reference", ["A$1 only", "$A1 only", "#A#1"]],
  ["MS Excel", "Which feature summarizes data by category with drag-drop fields", "PivotTable", ["Goal Seek", "Solver", "Conditional Formatting"]],
  ["MS Excel", "XLOOKUP primarily improves over VLOOKUP by", "Bidirectional lookup with exact default match", ["Only numerical lookup", "No range requirement", "Auto charting"]],
  ["Internet", "DNS primarily maps", "Domain names to IP addresses", ["IP to MAC directly", "Ports to protocols", "Files to folders"]],
  ["Internet", "HTTPS differs from HTTP due to", "TLS encryption and certificate validation", ["Higher bandwidth only", "Different physical cable", "No request headers"]],
  ["Networking", "Which device operates mainly at OSI Layer 2", "Switch", ["Router", "Gateway at app layer", "Repeater at layer 1"]],
  ["Networking", "CIDR /24 denotes", "255.255.255.0 subnet mask", ["255.255.0.0", "255.0.0.0", "255.255.255.255"]],
  ["Networking", "NAT is mainly used to", "Translate private IPs to public IP", ["Encrypt packets", "Resolve hostnames", "Balance CPU load"]],
  ["DBMS", "Normalization mainly reduces", "Data redundancy and anomalies", ["Query language need", "User count", "Disk partitions"]],
  ["DBMS", "A foreign key in DBMS enforces", "Referential integrity", ["File compression", "Thread locking", "Index defragmentation"]],
  ["DBMS", "ACID property ensuring all-or-nothing transaction is", "Atomicity", ["Consistency", "Isolation", "Durability"]],
  ["DBMS", "Which SQL clause filters grouped records", "HAVING", ["WHERE", "ORDER BY", "JOIN"]],
  ["DBMS", "Indexing usually improves", "Read/query performance", ["Physical RAM capacity", "Network speed", "Monitor resolution"]],
  ["Cyber", "A zero-day vulnerability is", "A flaw exploited before official patch", ["A patched legacy bug", "A fake antivirus alert", "A firewall rule"]],
  ["Cyber", "2FA adds security by requiring", "Two independent authentication factors", ["Two passwords only", "Two usernames", "Two browsers"]],
  ["Cyber", "Ransomware typically aims to", "Encrypt data and demand payment", ["Improve backup", "Patch OS", "Speed up CPU"]],
  ["Cyber", "Principle of least privilege means", "Give minimum required access", ["Give admin to all", "Disable auditing", "Allow anonymous root"]],
  ["Cyber", "Hashing in security is commonly used for", "Integrity verification/password storage", ["Reversible encryption", "Video rendering", "IP routing"]],
  ["Current Affairs", "NITI Aayog is primarily associated with", "Policy think-tank and cooperative federalism", ["Supreme Court benching", "Defense procurement", "Election management"]],
  ["Current Affairs", "PM Gati Shakti is focused on", "Integrated infrastructure planning", ["Crypto regulation", "Judicial appointments", "Foreign tourism visa"]],
  ["Current Affairs", "UPI is administered by", "NPCI", ["SEBI", "RBI directly as operator", "NABARD"]],
  ["Current Affairs", "India's Aadhaar ecosystem is managed by", "UIDAI", ["TRAI", "NTA", "AICTE"]],
  ["Current Affairs", "The term fiscal deficit refers to", "Excess of total expenditure over total receipts (excluding borrowings)", ["Only import-export gap", "Only state subsidy", "Only tax arrears"]],
  ["Himachal", "The summer capital of Himachal Pradesh is", "Shimla", ["Mandi", "Hamirpur", "Solan"]],
  ["Himachal", "Kangra miniature paintings belong to", "Pahari school of art", ["Mughal architecture", "Dravidian temple art", "Gandhara school"]],
  ["Himachal", "River Satluj enters India from", "Tibet region", ["Nepal", "Bhutan", "Myanmar"]],
  ["Himachal", "Chamba Rumal is known for", "Hand embroidery art", ["Stone carving", "Metal casting", "Wooden toys"]],
  ["Himachal", "Kullu Dussehra starts on", "Vijayadashami day", ["Diwali day", "Holi day", "Makar Sankranti"]],
  ["Computer", "A process in waiting state generally waits for", "I/O completion or event", ["GPU overheating", "Keyboard layout", "File extension"]],
  ["Computer", "Virtual memory enables", "Execution of larger programs than physical RAM", ["Permanent CPU overclock", "No need for storage", "No context switch"]],
  ["MS Excel", "Which function returns current date", "TODAY()", ["DATEONLY()", "NOWDATE()", "CURRENTDATE()"]],
  ["MS Excel", "Conditional formatting is mainly used for", "Visual highlighting based on rules", ["Network firewall", "Driver installation", "BIOS update"]],
  ["Networking", "Default port for HTTPS is", "443", ["80", "25", "110"]],
  ["Networking", "Ping command uses", "ICMP protocol", ["FTP", "SMTP", "SNMP exclusively"]],
  ["DBMS", "Which normal form removes transitive dependency", "Third Normal Form (3NF)", ["1NF", "2NF", "BCNF for every case"]],
  ["DBMS", "SELECT DISTINCT is used to", "Eliminate duplicate rows in output", ["Delete duplicate data", "Encrypt repeated values", "Sort descending always"]],
  ["Cyber", "Phishing primarily exploits", "Human trust/social engineering", ["CPU cache fault", "Disk fragmentation", "Kernel panic"]],
  ["Cyber", "VPN mainly provides", "Encrypted tunnel over network", ["Guaranteed anonymity in all cases", "Extra RAM", "BIOS hardening"]],
  ["Current Affairs", "National Education Policy 2020 emphasizes", "Multidisciplinary and flexible learning", ["Only rote exams", "No vocational learning", "No digital learning"]],
  ["Current Affairs", "Semiconductor mission in India targets", "Domestic chip ecosystem development", ["River linking", "Agricultural MSP", "Sports league expansion"]],
  ["Himachal", "Great Himalayan National Park is in", "Kullu district", ["Una district", "Sirmaur district", "Bilaspur district"]],
  ["Himachal", "Kalka-Shimla route is famous as", "UNESCO World Heritage mountain railway", ["Hydro canal", "National waterway", "Underground metro"]],
  ["Internet", "Cookies in web context are", "Small data stored by browser for sessions/preferences", ["Encrypted executables", "Only malware scripts", "Router configs"]],
  ["Internet", "Two-factor auth OTP usually has security risk if", "Shared/forwarded to attacker", ["Generated offline", "Used once quickly", "Delivered via hardware token"]],
  ["Windows", "Safe Mode in Windows is used for", "Troubleshooting with minimal drivers", ["Gaming boost", "Permanent overclock", "Firmware flashing"]],
  ["Windows", "Command to check network configuration in Windows", "ipconfig", ["ifstat", "netroute", "routeprintall"]],
  ["Computer", "SSD differs from HDD mainly by", "No moving mechanical parts", ["Needs tape backup only", "No controller", "No firmware"]],
  ["Computer", "Unicode was designed to", "Represent characters from multiple writing systems", ["Replace CPUs", "Compress videos", "Map IP routes"]],
  ["Current Affairs", "DBT in governance stands for", "Direct Benefit Transfer", ["Digital Bank Tax", "Data Backup Tool", "Dual Benefit Token"]],
  ["Current Affairs", "SWAMITVA scheme relates to", "Rural property record digitization", ["Urban metro cards", "Defense satellites", "Stock market trading"]],
  ["Himachal", "Renuka fair is associated with", "Sirmaur district", ["Kinnaur district", "Lahaul district", "Kullu district"]]
];

function buildHardQuestionBank() {
  const bank = [];
  let id = 1;
  seedBank.forEach(([topic, prompt, correct, distractors], idx) => {
    bank.push({ id: id++, topic, level: "Hard", q: prompt, options: shuffle([correct, ...distractors]), ansText: correct });
    bank.push({
      id: id++,
      topic,
      level: "Hard",
      q: `Choose the MOST accurate statement: ${prompt}`,
      options: shuffle([correct, ...distractors.map((d) => `${d} (incorrect context)`) ]),
      ansText: correct
    });
  });
  return bank.map((q) => ({ ...q, ans: q.options.indexOf(q.ansText) }));
}

const QUESTION_BANK = buildHardQuestionBank();

const state = {
  currentQuiz: [],
  user: JSON.parse(localStorage.getItem("joa-user") || "null"),
  attempts: JSON.parse(localStorage.getItem("joa-attempted-ids") || "[]"),
  seenNews: JSON.parse(localStorage.getItem("joa-seen-news") || "[]"),
  cachedNews: JSON.parse(localStorage.getItem("joa-cached-news") || "[]"),
  leaderboard: JSON.parse(localStorage.getItem("joa-leaderboard") || "[]"),
  timerInterval: null,
  timerLeft: QUIZ_DURATION_SECONDS
};

const byId = (id) => document.getElementById(id);
byId("question-count").textContent = `Questions: ${QUESTION_BANK.length}`;

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function isExamRelevant(article) {
  const text = `${article.title || ""} ${article.description || ""}`.toLowerCase();
  return EXAM_KEYWORDS.some((keyword) => text.includes(keyword));
}

function normalizeArticles(payload) {
  if (payload?.articles?.length) return payload.articles;
  if (payload?.status === "ok" && payload?.data?.length) return payload.data;
  return [];
}

function renderNews(news) {
  const list = byId("news-list");
  list.innerHTML = "";
  const data = news.slice(0, 10);
  byId("news-count").textContent = `News: ${data.length} latest`;

  data.forEach((article, idx) => {
    const li = document.createElement("li");
    const title = article.title || `Current Affairs Update ${idx + 1}`;
    const url = article.url || "https://www.mygov.in";
    li.innerHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a>`;
    list.appendChild(li);
  });

  if (!data.length) {
    list.innerHTML = "<li>No news available. Please refresh.</li>";
  }
}

async function fetchNews() {
  byId("news-timer").textContent = "Refreshing now...";
  let fetched = [];

  for (const url of NEWS_PROXY_URLS) {
    try {
      const response = await fetch(url, { headers: { "Accept": "application/json" } });
      if (!response.ok) continue;
      const payload = await response.json();
      fetched = fetched.concat(normalizeArticles(payload));
      if (fetched.length >= 10) break;
    } catch {
      // try next source
    }
  }

  const filtered = fetched.filter(isExamRelevant);
  const deduped = filtered.filter((item) => {
    const key = item.url || item.title;
    if (!key) return false;
    if (state.seenNews.includes(key)) return false;
    state.seenNews.push(key);
    return true;
  });

  state.seenNews = state.seenNews.slice(-300);
  localStorage.setItem("joa-seen-news", JSON.stringify(state.seenNews));

  const toRender = deduped.length ? deduped : filtered.length ? filtered : state.cachedNews.length ? state.cachedNews : CURRENT_AFFAIRS_FALLBACK;
  renderNews(toRender);

  if (toRender.length) {
    state.cachedNews = toRender;
    localStorage.setItem("joa-cached-news", JSON.stringify(state.cachedNews));
  }

  byId("news-timer").textContent = "Refreshing every 60s";
}

function startQuizTimer() {
  clearInterval(state.timerInterval);
  state.timerLeft = QUIZ_DURATION_SECONDS;
  const timerLabel = byId("quiz-timer");

  function paint() {
    const m = String(Math.floor(state.timerLeft / 60)).padStart(2, "0");
    const s = String(state.timerLeft % 60).padStart(2, "0");
    timerLabel.textContent = `Timer: ${m}:${s}`;
  }

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

function updateProgress() {
  const answered = state.currentQuiz.filter((q) => document.querySelector(`input[name="q-${q.id}"]:checked`)).length;
  byId("quiz-progress").textContent = `Answered: ${answered}/${state.currentQuiz.length}`;
}

function renderQuiz() {
  const form = byId("quiz-form");
  form.innerHTML = "";

  state.currentQuiz.forEach((item, idx) => {
    const wrapper = document.createElement("div");
    wrapper.className = "question";
    wrapper.innerHTML = `<h4>Q${idx + 1}. [${item.topic} | ${item.level}] ${item.q}</h4>`;

    item.options.forEach((opt, optIdx) => {
      const label = document.createElement("label");
      label.innerHTML = `<input type="radio" name="q-${item.id}" value="${optIdx}" /> ${opt}`;
      wrapper.appendChild(label);
      wrapper.appendChild(document.createElement("br"));
    });

    form.appendChild(wrapper);
  });

  form.onchange = updateProgress;
  byId("quiz-meta").textContent = `Attempted unique questions: ${state.attempts.length}`;
  updateProgress();
}

function pickQuestionsBalanced(unseen, count) {
  const topicBuckets = unseen.reduce((acc, q) => {
    if (!acc[q.topic]) acc[q.topic] = [];
    acc[q.topic].push(q);
    return acc;
  }, {});

  Object.values(topicBuckets).forEach((bucket) => bucket.sort(() => Math.random() - 0.5));

  const topics = Object.keys(topicBuckets);
  const selected = [];
  let pointer = 0;

  while (selected.length < count) {
    const topic = topics[pointer % topics.length];
    const bucket = topicBuckets[topic];
    if (bucket?.length) selected.push(bucket.pop());
    pointer += 1;

    const remaining = topics.some((t) => topicBuckets[t].length > 0);
    if (!remaining) break;
  }

  return shuffle(selected).slice(0, count);
}

function loadNewQuiz() {
  const unseen = QUESTION_BANK.filter((q) => !state.attempts.includes(q.id));
  if (unseen.length < QUIZ_SIZE) {
    byId("score-output").textContent = `Only ${unseen.length} unseen questions left. Reset attempt history to load a full set of ${QUIZ_SIZE}.`;
  }

  const targetCount = Math.min(QUIZ_SIZE, unseen.length);
  state.currentQuiz = pickQuestionsBalanced(unseen, targetCount);
  renderQuiz();
  startQuizTimer();
}

function submitQuiz() {
  if (!state.user) {
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

  const accuracy = state.currentQuiz.length ? Math.round((score / state.currentQuiz.length) * 100) : 0;
  byId("score-output").textContent = `Score: ${score}/${state.currentQuiz.length} | Accuracy: ${accuracy}%`;

  state.leaderboard.push({
    name: state.user.name,
    score,
    total: state.currentQuiz.length,
    accuracy,
    ts: Date.now()
  });

  state.leaderboard = state.leaderboard
    .sort((a, b) => b.accuracy - a.accuracy || b.score - a.score)
    .slice(0, 20);

  localStorage.setItem("joa-leaderboard", JSON.stringify(state.leaderboard));
  renderLeaderboard();
  clearInterval(state.timerInterval);
}

function renderLeaderboard() {
  const list = byId("leaderboard-list");
  list.innerHTML = "";
  if (!state.leaderboard.length) {
    list.innerHTML = "<li>No attempts yet.</li>";
    return;
  }

  state.leaderboard.forEach((entry, i) => {
    const li = document.createElement("li");
    li.textContent = `#${i + 1} ${entry.name} — ${entry.score}/${entry.total || QUIZ_SIZE} (${entry.accuracy}%)`;
    list.appendChild(li);
  });
}

function initAuth() {
  const form = byId("auth-form");
  const status = byId("auth-status");

  if (state.user) {
    status.textContent = `Logged in as ${state.user.name}`;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = byId("name").value.trim();
    const email = byId("email").value.trim();
    if (!name || !email) return;
    state.user = {
      name,
      email,
      token: btoa(`${email}:${Date.now()}`)
    };
    localStorage.setItem("joa-user", JSON.stringify(state.user));
    status.textContent = `Logged in as ${name}`;
  });
}

function init() {
  initAuth();
  renderLeaderboard();
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
    byId("score-output").textContent = "Attempt history reset. Fresh hard-level set loaded.";
    loadNewQuiz();
  });
}

init();
