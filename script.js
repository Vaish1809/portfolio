/* ---------- Tiny helpers ---------- */
const $  = (q, ctx=document) => ctx.querySelector(q);
const $$ = (q, ctx=document) => [...ctx.querySelectorAll(q)];
$("#year").textContent = new Date().getFullYear();

/* ---------- Mobile nav ---------- */
const toggleBtn = $(".nav-toggle");
const navLinks  = $(".nav-links");
toggleBtn?.addEventListener("click", () => navLinks.classList.toggle("show"));
$$(".nav-links a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("show")));

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); } });
}, { threshold: 0.12 });
$$(".observe").forEach(el => io.observe(el));

/* ---------- Experience: expand panels ---------- */
$$(".more").forEach(btn => {
  btn.addEventListener("click", () => {
    const panel = btn.nextElementSibling;
    const open = panel.classList.toggle("show");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.textContent = open ? "Close" : "Impact & stack";
  });
});

/* ---------- Projects: filter ---------- */
const pills = $$(".pill");
const cards = $$(".p-card");
pills.forEach(p => p.addEventListener("click", () => {
  pills.forEach(x => x.classList.remove("active"));
  p.classList.add("active");
  const tag = p.dataset.filter;
  cards.forEach(c => {
    const tags = c.dataset.tags || "";
    const show = tag === "all" || tags.includes(tag);
    c.style.display = show ? "" : "none";
  });
}));

/* ---------- Publications: accordions + copy BibTeX ---------- */
$$(".acc-head").forEach(head => {
  head.addEventListener("click", () => {
    const expanded = head.getAttribute("aria-expanded") === "true";
    head.setAttribute("aria-expanded", String(!expanded));
    const body = head.nextElementSibling;
    body.classList.toggle("show");
  });
});
$$(".copy-bib").forEach(btn => {
  btn.addEventListener("click", async () => {
    const bib = btn.dataset.bib || "";
    try {
      await navigator.clipboard.writeText(bib);
      btn.textContent = "Copied ✓";
      setTimeout(() => (btn.textContent = "Copy BibTeX"), 1200);
    } catch {
      alert("Copy failed — select and copy manually.");
    }
  });
});

/* ---------- Contact form (placeholder) ---------- */
const form = $("#contact-form");
const status = $("#form-status");
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.textContent = "Sending…";
  await new Promise(r => setTimeout(r, 700));
  status.textContent = "Thanks! I’ll get back to you soon.";
  form.reset();
});

/* ---------- Background particles ---------- */
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
let w, h, particles;

function resize() { w = canvas.width = innerWidth; h = canvas.height = innerHeight; initParticles(); }
addEventListener("resize", resize);

function initParticles() {
  const count = Math.min(110, Math.floor((w * h) / 15000));
  particles = Array.from({ length: count }).map(() => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 1.6 + 0.4
  }));
}
function draw() {
  ctx.clearRect(0, 0, w, h);
  const grd = ctx.createRadialGradient(w*0.8, h*0.2, 0, w*0.8, h*0.2, Math.max(w,h));
  grd.addColorStop(0, "rgba(138,180,248,0.04)"); grd.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grd; ctx.fillRect(0,0,w,h);

  ctx.fillStyle = "rgba(255,255,255,0.55)";
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
  });

  ctx.strokeStyle = "rgba(138,180,248,0.15)";
  particles.forEach((p, i) => {
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x, dy = p.y - q.y, d2 = dx*dx + dy*dy;
      if (d2 < 120*120) {
        ctx.globalAlpha = 1 - d2 / (120*120);
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  });

  requestAnimationFrame(draw);
}
resize(); draw();
// Compact Skills: tab switching
document.querySelectorAll(".skill-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".skill-tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    const cat = tab.dataset.target;
    document.querySelectorAll(".skill-row").forEach(r => {
      r.classList.toggle("hidden", r.dataset.cat !== cat);
    });
  });
});

/* ===========================
   CONTACT FORM HANDLER
   =========================== */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");

  if (!form) return; // If there's no contact form, skip this

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "Sending…";

    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        statusEl.textContent = "✅ Message sent successfully! I’ll get back to you soon.";
        form.reset();
      } else {
        statusEl.textContent = "❌ Something went wrong. Please try again later.";
      }
    } catch (err) {
      console.error("Contact form error:", err);
      statusEl.textContent = "⚠️ Network error. Please check your connection.";
    }
  });
});
