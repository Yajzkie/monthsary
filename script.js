// ========== CONFIG ==========
// Change the start date (year, monthIndex 0-11, day) once, and every number updates itself.
const START = new Date(2022, 0, 16);

// ponytail: manual nudge — shows 56 a day early (monthsary is the 16th).
// Remove when you want it to roll over naturally.
const MONTHS_OFFSET = 1;

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ========== TIME MATH ==========
const now = new Date();
const totalDays = Math.floor((now - START) / 86400000);
const totalWeeks = Math.floor(totalDays / 7);
let months =
  (now.getFullYear() - START.getFullYear()) * 12 +
  (now.getMonth() - START.getMonth());
if (now.getDate() < START.getDate()) months--;
months += MONTHS_OFFSET;

const sinceLine = document.getElementById("sinceLine");
sinceLine.textContent =
  `since ${START.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`;

document.getElementById("daysSince").textContent = totalDays.toLocaleString();
document.getElementById("weeksSince").textContent = totalWeeks.toLocaleString();
document.getElementById("monthsSince").textContent = months;

// ========== HERO COUNTER (counts up once) ==========
const countEl = document.getElementById("monthsCount");
const duration = 1400;
const startAt = performance.now();

function frame(nowTime) {
  const p = Math.min((nowTime - startAt) / duration, 1);
  const eased = 1 - Math.pow(1 - p, 3);
  countEl.textContent = Math.round(eased * months);
  if (p < 1) requestAnimationFrame(frame);
}
if (reducedMotion) countEl.textContent = months;
else requestAnimationFrame(frame);

// ========== CONFETTI (one burst on load) ==========
const COLORS = ["#ff6b6b", "#ffa62b", "#ffd93d", "#62d9a3", "#54b7f0", "#9b7ff7"];

function confetti() {
  for (let i = 0; i < 36; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    piece.style.animationDuration = 2.4 + Math.random() * 1.6 + "s";
    piece.style.animationDelay = Math.random() * 0.9 + "s";
    document.body.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }
}
if (!reducedMotion) window.setTimeout(confetti, 250);

// ========== PHOTO WALL ==========
// Add or remove filenames here; tiles are built from this list.
const PHOTOS = [
  "photo-01.jpeg", "photo-02.jpeg", "photo-03.jpeg", "photo-04.jpeg",
  "photo-05.jpeg", "photo-06.jpeg", "photo-07.jpeg", "photo-08.jpeg",
  "photo-09.jpeg", "photo-10.jpeg", "photo-11.jpeg", "photo-12.jpeg",
  "photo-13.jpeg", "photo-14.jpeg", "photo-15.jpeg", "photo-16.jpeg",
  "photo-17.jpeg", "photo-18.jpeg", "photo-19.jpeg", "photo-20.jpeg",
  "photo-21.jpeg", "photo-22.jpeg", "photo-23.jpeg", "photo-24.jpeg",
  "photo-25.jpeg",
];

// Captions cycle across the wall. Swap any caption text here.
const CAPTIONS = [
  "motor rides with you are my favorite kind of adventure",
  "night walks on the dike just to talk about everything and nothing",
  "making fun of each other is how we say i love you",
  "babe, you make everyday feel special",
];

const gallery = document.getElementById("gallery");
gallery.append(
  ...PHOTOS.map((src, i) => {
    const fig = document.createElement("figure");
    fig.className = "tile reveal";
    fig.innerHTML = `
      <div class="frame">
        <img src="photos/${src}" alt="" loading="lazy"
             onerror="this.closest('.frame').classList.add('empty')">
        <div class="empty-state" aria-hidden="true">♥ photo missing</div>
      </div>
      <figcaption>${CAPTIONS[i % CAPTIONS.length]}</figcaption>`;
    return fig;
  })
);

// ========== REVEAL ==========
const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
reveals.forEach((el) => revealObserver.observe(el));