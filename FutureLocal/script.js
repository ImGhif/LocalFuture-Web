// set year (guarded)
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (href && href.length > 1) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// lazy load images (basic)
document.querySelectorAll("img").forEach((img) => {
  if ("loading" in HTMLImageElement.prototype) {
    img.loading = "lazy";
  }
});

// simple keyboard accessibility: focus skip
window.addEventListener("keydown", (e) => {
  if (e.key === "Tab") document.body.classList.add("show-focus");
});

// contact form submit stub (guarded)
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Thanks — this is a demo form. Replace with your backend endpoint.");
    this.reset();
  });
}

/* Carousel initialization for elements with [data-carousel] */
// Carousel removed — authors are displayed as an elegant responsive grid now.

// Tab behavior removed: news buttons were removed, content remains visible.
