/* Portfolio scripts — no inline JS so the Content-Security-Policy can forbid it. */
// Clickjacking defence: GitHub Pages cannot send frame-ancestors, so refuse to run inside a frame.
if (window.top !== window.self) { try { window.top.location.replace(window.self.location.href); } catch (e) { document.documentElement.style.display = 'none'; } }

  (function () {
  const root = document.documentElement;
  const arBtn = document.getElementById("langAr");
  const enBtn = document.getElementById("langEn");
  const toastText = document.getElementById("toastText");

  function setLanguage(lang) {
    const isAR = lang === "ar";

    root.lang = lang;
    root.dir = isAR ? "rtl" : "ltr";

    // التحكم بالظهور والاختفاء عبر الـ JavaScript مباشرة لتفادي تعليق التصميم
    document.querySelectorAll('[data-lang="ar"]').forEach(el => el.style.display = isAR ? 'inline' : 'none');
    document.querySelectorAll('[data-lang="en"]').forEach(el => el.style.display = isAR ? 'none' : 'inline');

    if (toastText) {
      toastText.textContent = isAR ? "تم الاستلام (محلياً)" : "Received (locally)";
    }

    arBtn?.setAttribute("aria-pressed", String(isAR));
    enBtn?.setAttribute("aria-pressed", String(!isAR));
  }

  arBtn?.addEventListener("click", () => setLanguage("ar"));
  enBtn?.addEventListener("click", () => setLanguage("en"));

  // Smooth scroll triggers
  document.getElementById("scrollContact")?.addEventListener("click", () => {
    document.getElementById("contact").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.getElementById("viewSkills")?.addEventListener("click", () => {
    document.getElementById("skills").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Mobile Menu Overlay Drawer System
  const overlay = document.getElementById("drawerOverlay");
  const drawer = document.getElementById("drawer");
  const openMenu = document.getElementById("openMenu");

  function setDrawer(open) {
    overlay?.classList.toggle("show", open);
    drawer?.classList.toggle("show", open);
    overlay?.setAttribute("aria-hidden", String(!open));
    drawer?.setAttribute("aria-hidden", String(!open));
  }

  openMenu?.addEventListener("click", () => setDrawer(true));
  overlay?.addEventListener("click", () => setDrawer(false));
  document.querySelectorAll("[data-close-drawer]").forEach((a) => {
    a.addEventListener("click", () => setDrawer(false));
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setDrawer(false);
  });

  // Dynamic Communications link updates
  const waLink = document.getElementById("waLink");
  const smsLink = document.getElementById("smsLink");
  const phoneDigits = "0537292913";
  const waPhone = "966" + phoneDigits.replace(/^0/, "");

  if (waLink) {
    const waMessage = encodeURIComponent(
      "Hello Majd, we reviewed your cybersecurity portfolio and would like to discuss professional opportunities."
    );
    waLink.setAttribute("href", `https://wa.me/${waPhone}?text=${waMessage}`);
  }
  if (smsLink) {
    smsLink.setAttribute("href", `sms:${phoneDigits}`);
  }

  // اللغة الافتراضية عند التشغيل: العربية
  setLanguage("ar");
})();

/* =====================================================
   Cyber cursor — soft halo + ring + core dot, eased trailing
   ===================================================== */
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const isFinePointer = window.matchMedia("(pointer: fine)").matches;
  const hasTouch = ("ontouchstart" in window) || navigator.maxTouchPoints > 0;
  if (!isFinePointer && !hasTouch) return;

  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  const ring = document.createElement("div");
  ring.className = "cursor-ring";
  const glow = document.createElement("div");
  glow.className = "cursor-glow";

  document.body.append(glow, ring, dot);
  if (isFinePointer) document.body.classList.add("has-custom-cursor");
  if (hasTouch) document.body.classList.add("has-touch-cursor");

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let dotX = mx, dotY = my;
  let ringX = mx, ringY = my;
  let glowX = mx, glowY = my;
  let hideTimer = null;

  function reveal() {
    clearTimeout(hideTimer);
    dot.style.opacity = 1;
    ring.style.opacity = 1;
    glow.style.opacity = 1;
  }
  function hide(delay) {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      dot.style.opacity = 0;
      ring.style.opacity = 0;
      glow.style.opacity = 0;
    }, delay || 0);
  }

  const hoverSelector = "a, button, .chip, .ctaBtn, input, textarea, .card, .langToggle button";

  // ----- Mouse / trackpad (fine pointer) -----
  if (isFinePointer) {
    window.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      reveal();
    });
    document.addEventListener("mouseleave", () => hide(0));
    document.addEventListener("mouseenter", reveal);

    document.addEventListener("mouseover", (e) => {
      if (e.target.closest && e.target.closest(hoverSelector)) {
        document.body.classList.add("cursor-active");
      }
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest && e.target.closest(hoverSelector)) {
        document.body.classList.remove("cursor-active");
      }
    });
  }

  // ----- Touch (iPad / iPhone / tablets / all touch screens) -----
  if (hasTouch) {
    function touchPoint(e) {
      const t = e.touches && e.touches[0];
      return t ? { x: t.clientX, y: t.clientY } : null;
    }

    document.addEventListener("touchstart", (e) => {
      const p = touchPoint(e);
      if (!p) return;
      mx = dotX = ringX = glowX = p.x;
      my = dotY = ringY = glowY = p.y;
      reveal();
      if (e.target.closest && e.target.closest(hoverSelector)) {
        document.body.classList.add("cursor-active");
      }
    }, { passive: true });

    document.addEventListener("touchmove", (e) => {
      const p = touchPoint(e);
      if (!p) return;
      mx = p.x;
      my = p.y;
      reveal();
    }, { passive: true });

    document.addEventListener("touchend", () => {
      document.body.classList.remove("cursor-active");
      hide(550);
    }, { passive: true });

    document.addEventListener("touchcancel", () => {
      document.body.classList.remove("cursor-active");
      hide(200);
    }, { passive: true });
  }

  function tick() {
    dotX += (mx - dotX) * 0.35;
    dotY += (my - dotY) * 0.35;
    ringX += (mx - ringX) * 0.18;
    ringY += (my - ringY) * 0.18;
    glowX += (mx - glowX) * 0.09;
    glowY += (my - glowY) * 0.09;

    dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;

    requestAnimationFrame(tick);
  }
  tick();
})();

/* =====================================================
   Scroll progress, header state, reveal-on-scroll,
   active nav link, back-to-top, card spotlight glow
   ===================================================== */
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Scroll progress bar
  const progress = document.createElement("div");
  progress.className = "scrollProgress";
  document.body.prepend(progress);

  // Back-to-top button
  const backBtn = document.createElement("button");
  backBtn.type = "button";
  backBtn.className = "backToTop";
  backBtn.setAttribute("aria-label", "Back to top");
  backBtn.innerHTML = "&uarr;";
  document.body.appendChild(backBtn);
  backBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  const header = document.querySelector("header");

  function onScroll() {
    const docEl = document.documentElement;
    const scrollTop = docEl.scrollTop || document.body.scrollTop;
    const scrollHeight = (docEl.scrollHeight || document.body.scrollHeight) - docEl.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progress.style.width = pct + "%";
    header && header.classList.toggle("scrolled", scrollTop > 10);
    backBtn.classList.toggle("show", scrollTop > 400);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal-on-scroll targets
  const revealEls = document.querySelectorAll(
    ".heroCard, .sideCard, .sectionHeader, .card, footer > div"
  );
  revealEls.forEach((el) => el.classList.add("reveal"));

  // Staggered delay for siblings inside the same grid
  document.querySelectorAll(".grid2").forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      child.style.transitionDelay = i * 0.1 + "s";
    });
  });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));

    // Active nav link tracking
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll("header nav a[href^='#']");
    const navIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const link = document.querySelector(`header nav a[href="#${entry.target.id}"]`);
          if (!link) return;
          navLinks.forEach((l) => l.classList.remove("navLinkActive"));
          link.classList.add("navLinkActive");
        });
      },
      { threshold: 0, rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => navIO.observe(s));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  // Card spotlight glow follows pointer
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });
})();

/* ---------- Certificates filter + image lightbox (added 2026-11) ---------- */
(function () {
  "use strict";
  const root = document.documentElement;
  const isAR = () => root.lang === "ar";

  // Only same-site images under img/ may be opened in the viewer.
  const SAFE_SRC = /^img\/[a-z0-9\/_-]+\.webp$/;

  // Filter buttons
  const filters = document.querySelectorAll(".certFilter");
  const cards = document.querySelectorAll(".certCard");
  const grid = document.getElementById("certGrid");
  const more = document.getElementById("certMore");
  const moreWrap = more?.parentElement;
  more?.addEventListener("click", () => {
    grid?.classList.remove("collapsed");
    more.setAttribute("aria-expanded", "true");
    if (moreWrap) moreWrap.hidden = true;
  });
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter;
      filters.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      cards.forEach((c) => { c.hidden = !(f === "all" || c.dataset.cat === f); });
      // a category shows all its certificates; "All" goes back to the short list
      grid?.classList.toggle("collapsed", f === "all");
      if (moreWrap) moreWrap.hidden = f !== "all";
      more?.setAttribute("aria-expanded", "false");
    });
  });

  // Lightbox
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbCap = document.getElementById("lbCap");
  if (!lb || !lbImg || typeof lb.showModal !== "function") return;

  let group = [];
  let index = 0;

  function show(i) {
    index = (i + group.length) % group.length;
    const el = group[index];
    const src = el.dataset.full || "";
    if (!SAFE_SRC.test(src)) return;
    lbImg.src = src;
    const cap = (isAR() ? el.dataset.capAr : el.dataset.capEn) || "";
    lbImg.alt = cap;
    lbCap.textContent = cap; // textContent: never interpreted as HTML
    lb.classList.toggle("single", group.length < 2);
  }

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-gallery][data-full]");
    if (!el) return;
    const name = el.dataset.gallery;
    group = Array.from(document.querySelectorAll(`[data-gallery="${CSS.escape(name)}"]`)).filter((x) => !x.hidden);
    show(group.indexOf(el));
    lb.showModal();
  });

  lb.addEventListener("click", (e) => {
    const action = e.target.closest("[data-lb]")?.dataset.lb;
    if (action === "close" || e.target === lb) lb.close();
    else if (action === "prev") show(index - 1);
    else if (action === "next") show(index + 1);
  });

  document.addEventListener("keydown", (e) => {
    if (!lb.open) return;
    if (e.key === "ArrowRight") show(index + (isAR() ? -1 : 1));
    if (e.key === "ArrowLeft") show(index + (isAR() ? 1 : -1));
  });

  // Swipe on phones
  let x0 = null;
  lb.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    x0 = null;
  });

  lb.addEventListener("close", () => { lbImg.removeAttribute("src"); });
})();
