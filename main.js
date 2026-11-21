/* ================================================================
   CONTACT DETAILS — edit these. Leave a value empty ("") to hide it.
   ================================================================ */
const CONTACT = {
  email: "info@uruk.company",
  phone: "",            // e.g. "+964 770 000 0000"
  whatsapp: "",         // digits only, e.g. "9647700000000"
  facebook: "",         // e.g. "https://facebook.com/uruk.company"
  instagram: "",        // e.g. "https://instagram.com/uruk.company"
  location: { ar: "العراق", en: "Iraq" },
  mapUrl: ""            // optional Google Maps link
};

const ICONS = {
  email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3 3z"/><path d="M9 9.5c.5 2 2.5 4 4.5 4.5l1-1.2 2 .9c-.2 1.2-1 1.8-2 1.8A6 6 0 0 1 8.2 9.2c0-1 .6-1.8 1.8-2l.9 2z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>',
  location: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>'
};

function card(key, href, labelAr, labelEn, value) {
  const tag = href ? "a" : "div";
  const attrs = href ? ` href="${href}"${href.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}` : "";
  return `<${tag} class="ccard"${attrs}><span class="ico">${ICONS[key]}</span><span>
    <small><span class="ar">${labelAr}</span><span class="en">${labelEn}</span></small>
    <strong>${value}</strong></span></${tag}>`;
}

function renderContact() {
  const c = CONTACT, out = [];
  if (c.email) out.push(card("email", `mailto:${c.email}`, "البريد الإلكتروني", "Email", c.email));
  if (c.phone) out.push(card("phone", `tel:${c.phone.replace(/\s/g, "")}`, "الهاتف", "Phone", c.phone));
  if (c.whatsapp) out.push(card("whatsapp", `https://wa.me/${c.whatsapp}`, "واتساب", "WhatsApp", "+" + c.whatsapp));
  if (c.facebook) out.push(card("facebook", c.facebook, "فيسبوك", "Facebook", "مكتب أوروك الهندسي"));
  if (c.instagram) out.push(card("instagram", c.instagram, "إنستغرام", "Instagram", "@" + c.instagram.split("/").filter(Boolean).pop()));
  if (c.location) out.push(card("location", c.mapUrl, "الموقع", "Location",
    `<span class="ar">${c.location.ar}</span><span class="en">${c.location.en}</span>`));
  document.getElementById("contactCards").innerHTML = out.join("");
}

/* Language */
function setLang(lang) {
  const html = document.documentElement;
  html.lang = lang;
  html.dir = lang === "ar" ? "rtl" : "ltr";
  try { localStorage.setItem("uruk-lang", lang); } catch (e) {}
}
(function initLang() {
  const q = new URLSearchParams(location.search).get("lang");
  let saved = null;
  try { saved = localStorage.getItem("uruk-lang"); } catch (e) {}
  setLang(q === "en" || q === "ar" ? q : saved || "ar");
  document.getElementById("langBtn").addEventListener("click", () =>
    setLang(document.documentElement.lang === "ar" ? "en" : "ar"));
})();

renderContact();
document.getElementById("yr").textContent = new Date().getFullYear();

/* Nav background on scroll */
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("scrolled", scrollY > 30);
addEventListener("scroll", onScroll, { passive: true }); onScroll();

/* Reveal on scroll */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

/* Subtle parallax tilt on the hero mark */
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const markImg = document.querySelector("#mark img");
if (!reduce && matchMedia("(pointer: fine)").matches) {
  addEventListener("mousemove", (e) => {
    const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
    markImg.style.transform = `translate3d(${x * -14}px, ${y * -10}px, 0) scale(1.02)`;
  });
}
if (!reduce) {
  addEventListener("scroll", () => {
    const y = Math.min(scrollY, innerHeight);
    document.getElementById("mark").style.translate = `0 ${y * 0.18}px`;
  }, { passive: true });
}

/* Cursor-follow glow on service cards */
document.querySelectorAll(".svc-col").forEach((el) => {
  el.addEventListener("pointermove", (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});
