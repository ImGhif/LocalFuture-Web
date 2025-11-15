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

// Author detail modal behavior
(() => {
  const modalOverlay = document.getElementById("author-modal");
  if (!modalOverlay) return;

  const q = (sel, ctx = document) => ctx.querySelector(sel);
  const nameEl = document.getElementById("modal-name");
  const roleEl = document.getElementById("modal-role");
  const avatarEl = document.getElementById("modal-avatar");
  const expEl = document.getElementById("modal-experience");
  const skillsEl = document.getElementById("modal-skills");
  const tasksEl = document.getElementById("modal-tasks");
  const socialEl = document.getElementById("modal-social");
  const timelineEl = document.getElementById("modal-timeline");
  const closeBtn = q(".modal-close", modalOverlay);

  function setModalAvatar(src, alt) {
    if (!avatarEl) return;
    if (src) {
      avatarEl.src = src;
      avatarEl.alt = alt || "Author photo";
      avatarEl.parentElement &&
        avatarEl.parentElement.setAttribute("aria-hidden", "false");
    } else {
      avatarEl.src = "";
      avatarEl.alt = "";
      avatarEl.parentElement &&
        avatarEl.parentElement.setAttribute("aria-hidden", "true");
    }
  }

  function openModal(data) {
    if (!modalOverlay) return;
    nameEl.textContent = data.name || "";
    roleEl.textContent = data.role || "";
    expEl.textContent = data.experience || "";
    skillsEl.textContent = data.skills || "";
    tasksEl.textContent = data.tasks || "";
    // render social icon links (if present)
    const socials = [];
    if (data.github)
      socials.push({ href: data.github, icon: "bi-github", label: "GitHub" });
    if (data.linkedin)
      socials.push({
        href: data.linkedin,
        icon: "bi-linkedin",
        label: "LinkedIn",
      });
    if (data.instagram)
      socials.push({
        href: data.instagram,
        icon: "bi-instagram",
        label: "Instagram",
      });
    if (data.twitter)
      socials.push({
        href: data.twitter,
        icon: "bi-twitter",
        label: "Twitter",
      });
    if (socials.length) {
      socialEl.innerHTML = socials
        .map(
          (s) =>
            `<a class="social-link" href="${s.href}" target="_blank" rel="noopener noreferrer" aria-label="${s.label}"><i class="bi ${s.icon}"></i></a>`
        )
        .join(" ");
    } else {
      socialEl.textContent = data.social || "";
    }
    timelineEl.textContent = data.timeline || "";

    setModalAvatar(data.avatar || "", data.avatarAlt || "");

    modalOverlay.classList.add("open");
    modalOverlay.setAttribute("aria-hidden", "false");
    // lock scroll
    document.documentElement.style.overflow = "hidden";
    // focus for accessibility
    closeBtn && closeBtn.focus();
  }

  function closeModal() {
    modalOverlay.classList.remove("open");
    modalOverlay.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
  }

  // attach to cards
  document.querySelectorAll(".author-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      // prefer dataset values, fallback to reading visible fields
      const d = card.dataset || {};
      const data = {
        name: d.name || card.querySelector(".name")?.textContent || "",
        role: d.role || card.querySelector(".role")?.textContent || "",
        experience: d.experience || "",
        skills: d.skills || "",
        tasks: d.tasks || "",
        github: d.github || "",
        linkedin: d.linkedin || "",
        instagram: d.instagram || "",
        twitter: d.twitter || "",
        social: d.social || "",
        timeline: d.timeline || "",
        avatar: d.avatar || card.querySelector("img.avatar")?.src || "",
        avatarAlt: d.avatarAlt || card.querySelector("img.avatar")?.alt || "",
      };
      openModal(data);
    });
  });

  // close handlers
  closeBtn && closeBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("open"))
      closeModal();
  });
  // prevent clicks inside modal from closing
  document
    .querySelectorAll(".modal")
    .forEach((m) => m.addEventListener("click", (e) => e.stopPropagation()));
})();
