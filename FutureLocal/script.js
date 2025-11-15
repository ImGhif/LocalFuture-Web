// set year
document.getElementById("year").textContent = new Date().getFullYear();

// smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (href.length > 1) {
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

// contact form submit stub
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Thanks — this is a demo form. Replace with your backend endpoint.");
  this.reset();
});
