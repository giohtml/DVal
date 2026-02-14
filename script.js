document.addEventListener("DOMContentLoaded", () => {
  const noPhrases = [
    "Nahh",
    "Are you sure?",
    "Really sure?",
    "Are you sure sure :( ?",
    "Think again please 🥲",
    "PLEASE CLICK ENTER",
    "Don’t do this to me 😭",
    "I’ll be so sad…",
    "Okay… I’m gonna cry 🥺",
    "JUST SAY YOU HATE ME"
  ];

  let growStep = 0;
  const GROW_PAD_Y = 6;
  const GROW_PAD_X = 12;
  const GROW_FONT = 2;
  const MAX_STEPS = 18;

  // Elements
  const bg = document.getElementById("bg");
  const noBtn = document.getElementById("noBtn");
  const yesBtn = document.getElementById("yesBtn");

  const mainCard = document.getElementById("mainCard");
  const accepted = document.getElementById("accepted");

  const nextFromAcceptedBtn = document.getElementById("nextFromAcceptedBtn");

  // Pages (NOW includes page7)
  const pages = [
    document.getElementById("page1"),
    document.getElementById("page2"),
    document.getElementById("page3"),
    document.getElementById("page4"),
    document.getElementById("page5"),
    document.getElementById("page6"),
    document.getElementById("page7"),
  ].filter(Boolean);

  function hideAll() {
    if (mainCard) mainCard.style.display = "none";
    if (accepted) accepted.style.display = "none";
    pages.forEach(p => (p.style.display = "none"));
  }

  function showMain() {
    hideAll();
    if (mainCard) mainCard.style.display = "grid";

    // reset growth + no button text when restarting
    growStep = 0;
    applyYesGrowth();
    if (noBtn) noBtn.textContent = noPhrases[0];
    noIndex = 0;
  }

  function showAccepted() {
    hideAll();
    if (accepted) accepted.style.display = "block";
    burstIcons();
  }

  function showPage(i) {
    hideAll();
    const page = pages[i];
    if (page) page.style.display = "block";
  }

  // Keep base YES button values in sync with CSS (.yes)
  const basePadY = 20;
  const basePadX = 34;
  const baseFont = 44;

  function applyYesGrowth() {
    if (!yesBtn) return;

    const steps = Math.min(growStep, MAX_STEPS);
    const padY = basePadY + steps * GROW_PAD_Y;
    const padX = basePadX + steps * GROW_PAD_X;
    const font = baseFont + steps * GROW_FONT;

    yesBtn.style.padding = `${padY}px ${padX}px`;
    yesBtn.style.fontSize = `${font}px`;
  }

  let noIndex = 0;

  if (noBtn) {
    noBtn.addEventListener("click", () => {
      growStep++;
      applyYesGrowth();

      noIndex = Math.min(noIndex + 1, noPhrases.length - 1);
      noBtn.textContent = noPhrases[noIndex];
    });
  }

  // YES click -> accepted
  if (yesBtn) yesBtn.addEventListener("click", showAccepted);

  // Enter triggers YES only when main card is visible
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    if (!mainCard) return;

    // visible check (works even if display wasn't set inline)
    const isVisible = !!(mainCard.offsetWidth || mainCard.offsetHeight || mainCard.getClientRects().length);
    if (isVisible) showAccepted();
  });

  // Accepted -> Page 1
  if (nextFromAcceptedBtn) {
    nextFromAcceptedBtn.addEventListener("click", () => showPage(0));
  }

  // Wire up Back/Next for pages 1..7
  function on(id, fn) {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", fn);
  }

  // Page 1
  on("back1", () => showAccepted());
  on("next1", () => showPage(1));

  // Page 2
  on("back2", () => showPage(0));
  on("next2", () => showPage(2));

  // Page 3
  on("back3", () => showPage(1));
  on("next3", () => showPage(3));

  // Page 4
  on("back4", () => showPage(2));
  on("next4", () => showPage(4));

  // Page 5
  on("back5", () => showPage(3));
  on("next5", () => showPage(5));

  // Page 6
  on("back6", () => showPage(4));
  on("next6", () => showPage(6)); // NEW: page6 -> page7

  // Page 7
  on("back7", () => showPage(5)); // NEW: page7 -> page6
  on("finishBtn", () => showMain()); // Finish returns to main

  // Start on main
  showMain();

  // ------------------------------
  // Floating PNG Background Icons
  // ------------------------------
  const ICON_SRC = "./icon.png";
  const ICON_MIN = 50;
  const ICON_MAX = 100;
  const SPAWN_MS = 1400;
  const MAX_ON_SCREEN = 28;

  function makeIcon() {
    if (!bg) return;

    while (bg.childElementCount >= MAX_ON_SCREEN) {
      bg.firstElementChild?.remove();
    }

    const el = document.createElement("div");
    el.className = "heart";

    const size = ICON_MIN + Math.random() * (ICON_MAX - ICON_MIN);
    const x0 = Math.random() * 100;
    const x1 = x0 + (Math.random() * 22 - 11);
    const r0 = (Math.random() * 40 - 20) + "deg";
    const r1 = (Math.random() * 80 - 40) + "deg";
    const duration = 12 + Math.random() * 10;
    const delay = -(Math.random() * duration);

    el.style.setProperty("--size", `${size}px`);
    el.style.setProperty("--x0", `${x0}vw`);
    el.style.setProperty("--x1", `${x1}vw`);
    el.style.setProperty("--r0", r0);
    el.style.setProperty("--r1", r1);
    el.style.animationDuration = `${duration}s`;
    el.style.animationDelay = `${delay}s`;

    el.style.opacity = "1";
    el.innerHTML = `<img src="${ICON_SRC}" class="floatingIcon" alt="">`;
    bg.appendChild(el);

    setTimeout(() => el.remove(), (duration + 2) * 1000);
  }

  function seedIcons(count = 14) {
    for (let i = 0; i < count; i++) makeIcon();
  }

  function burstIcons() {
    for (let i = 0; i < 12; i++) setTimeout(makeIcon, i * 90);
  }

  seedIcons(14);

  let iconInterval = setInterval(makeIcon, SPAWN_MS);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearInterval(iconInterval);
    } else {
      iconInterval = setInterval(makeIcon, SPAWN_MS);
    }
  });
});
