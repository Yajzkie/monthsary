// ========== CONFIG ==========
// Change the start date (year, monthIndex 0-11, day) once, and every number updates itself.
const START = new Date(2022, 0, 16);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ========== TIME MATH ==========
const now = new Date();
const totalDays = Math.floor((now - START) / 86400000);
const totalWeeks = Math.floor(totalDays / 7);
let months =
  (now.getFullYear() - START.getFullYear()) * 12 +
  (now.getMonth() - START.getMonth());
if (now.getDate() < START.getDate()) months--;

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