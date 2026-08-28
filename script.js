/* =========================================================
   DOMANDE — modifica liberamente testo, ordine o quantità.
   Il risultato finale NON dipende mai da queste risposte:
   è fisso ed è definito nell'HTML (resultScreen).
   ========================================================= */
const QUESTIONS = [
  "Alessandro è un coglione?",
  "Io sono una brava e intelligente ragazza?",
  "Guardo la Zanzara?",
  "Sono la ragazza con il sorriso più bello del mondo?",
  "Alessandro deve esplodere?",
];

// Quanto durano le animazioni di fade (deve combaciare col CSS)
const FADE_MS = 350;

// --- Riferimenti agli elementi della pagina ---
const questionScreen = document.getElementById("questionScreen");
const resultScreen = document.getElementById("resultScreen");
const questionText = document.getElementById("questionText");
const qNumberEl = document.getElementById("qNumber");
const btnYes = document.getElementById("btnYes");
const btnNo = document.getElementById("btnNo");
const btnRestart = document.getElementById("btnRestart");
const progressDots = document.querySelectorAll(".progress-dot");

// Indice della domanda corrente (0 = prima domanda)
let currentIndex = 0;

/**
 * Mostra la domanda corrente nella card, aggiornando anche
 * il contatore "domanda X di 5" e i pallini di avanzamento.
 */
function renderQuestion() {
  questionText.textContent = QUESTIONS[currentIndex];
  qNumberEl.textContent = currentIndex + 1;
  updateProgressDots();
}

function updateProgressDots() {
  progressDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex);
    dot.classList.toggle("done", i < currentIndex);
  });
}

/**
 * Fa sparire un elemento con un fade leggero, esegue un callback
 * quando è invisibile, poi lo fa riapparire. Usata sia per passare
 * da una domanda all'altra, sia per passare al risultato finale.
 */
function fadeSwap(element, onHidden) {
  element.classList.add("fade-out");

  setTimeout(() => {
    onHidden();
    element.classList.remove("fade-out");
    element.classList.add("fade-in");
  }, FADE_MS);
}

/**
 * Gestisce il click su SÌ o NO. La risposta non viene salvata
 * da nessuna parte: qualunque cosa scelga, il flusso è lo stesso.
 */
function handleAnswer() {
  const isLastQuestion = currentIndex === QUESTIONS.length - 1;

  if (isLastQuestion) {
    goToResult();
  } else {
    fadeSwap(questionScreen, () => {
      currentIndex += 1;
      renderQuestion();
    });
  }
}

/**
 * Passa dalla schermata delle domande a quella del risultato,
 * con una transizione leggermente più marcata.
 */
function goToResult() {
  questionScreen.classList.add("fade-out");

  setTimeout(() => {
    questionScreen.classList.add("hidden");
    questionScreen.classList.remove("fade-out", "fade-in");

    resultScreen.classList.remove("hidden");
    // forziamo un reflow per far ripartire l'animazione di fade-in
    void resultScreen.offsetWidth;
    resultScreen.classList.add("fade-in");

    progressDots.forEach((dot) => dot.classList.add("done"));
  }, FADE_MS);
}

/**
 * Riporta il gioco all'inizio, per rifare il test da capo.
 */
function restart() {
  resultScreen.classList.add("fade-out");

  setTimeout(() => {
    resultScreen.classList.add("hidden");
    resultScreen.classList.remove("fade-out", "fade-in");

    currentIndex = 0;
    renderQuestion();

    questionScreen.classList.remove("hidden");
    void questionScreen.offsetWidth;
    questionScreen.classList.add("fade-in");
  }, FADE_MS);
}

// --- Collegamento eventi ---
btnYes.addEventListener("click", handleAnswer);
btnNo.addEventListener("click", handleAnswer);
btnRestart.addEventListener("click", restart);

// --- Avvio iniziale ---
renderQuestion();
spawnFloaties();

/* =========================================================
   DECORAZIONI DI SFONDO (cuoricini/stelline che salgono piano)
   Puramente estetico: puoi cambiare EMOJIS o COUNT per
   modificare densità e stile.
   ========================================================= */
function spawnFloaties() {
  const container = document.getElementById("floaties");
  const EMOJIS = ["💗", "✨", "🌸"];
  const COUNT = 14;

  for (let i = 0; i < COUNT; i++) {
    const span = document.createElement("span");
    span.className = "floaty";
    span.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

    const size = 14 + Math.random() * 14; // tra 14px e 28px
    const left = Math.random() * 100; // posizione orizzontale %
    const duration = 9 + Math.random() * 8; // tra 9s e 17s
    const delay = Math.random() * 10; // sfalsamento iniziale

    span.style.fontSize = `${size}px`;
    span.style.left = `${left}%`;
    span.style.animationDuration = `${duration}s`;
    span.style.animationDelay = `${delay}s`;

    container.appendChild(span);
  }
}
