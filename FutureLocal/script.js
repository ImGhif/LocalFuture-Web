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

    // render social icon links
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
    document.documentElement.style.overflow = "hidden";
    closeBtn && closeBtn.focus();
  }

  function closeModal() {
    modalOverlay.classList.remove("open");
    modalOverlay.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
  }

  document.querySelectorAll(".author-card").forEach((card) => {
    card.addEventListener("click", (e) => {
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

  closeBtn && closeBtn.addEventListener("click", closeModal);

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("open"))
      closeModal();
  });

  document
    .querySelectorAll(".modal")
    .forEach((m) => m.addEventListener("click", (e) => e.stopPropagation()));
})();

// Scroll-based navigation underline update (restored)
(() => {
  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id]");
    if (!sections.length) return;

    let currentSection = null;
    const viewportCenter = window.innerHeight / 3;

    // find which section is in the upper third of the viewport
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= viewportCenter && rect.bottom > 0) {
        currentSection = section.id;
      }
    });

    // fallback: choose the section closest to top
    if (!currentSection) {
      let closest = null;
      let minDist = Infinity;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const d = Math.abs(rect.top);
        if (d < minDist) {
          minDist = d;
          closest = section.id;
        }
      });
      currentSection = closest;
    }

    // Determine if we're at the very top (Home should be active)
    const atTop = window.scrollY <= 80;

    document.querySelectorAll("nav.primary a").forEach((link) => {
      const href = link.getAttribute("href") || "";

      // Home link (index.html) active when atTop
      if (href === "index.html") {
        if (atTop) link.setAttribute("data-page-link", "current");
        else link.removeAttribute("data-page-link");
        return;
      }

      // Anchor links active when not at top and matching currentSection
      if (href.startsWith("#")) {
        if (!atTop && currentSection && href === "#" + currentSection) {
          link.setAttribute("data-page-link", "current");
        } else {
          link.removeAttribute("data-page-link");
        }
      }
    });
  }

  window.addEventListener("scroll", updateActiveNavLink, { passive: true });
  window.addEventListener("resize", updateActiveNavLink);
  // run on load
  document.addEventListener("DOMContentLoaded", updateActiveNavLink);
  updateActiveNavLink();
})();

// Video gallery: switch main video on thumbnail click + generate thumbnails from first frame
(() => {
  const mainVideo = document.getElementById("mainVideo");
  const thumbs = document.querySelectorAll(".video-thumb");
  if (!mainVideo || !thumbs.length) return;

  function loadVideo(videoPath) {
    mainVideo.src = videoPath;
    mainVideo.play().catch(() => {
      // play may fail if autoplay is blocked
    });
  }

  function generateThumbnail(videoPath, canvas) {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.src = videoPath;
    video.currentTime = 1; // capture frame at 1 second

    video.addEventListener("seeked", () => {
      const ctx = canvas.getContext("2d");
      canvas.width = 160;
      canvas.height = 90;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    });

    video.load();
  }

  // Generate thumbnails and load first video
  thumbs.forEach((thumb, idx) => {
    const videoPath = thumb.getAttribute("data-video");
    const canvas = thumb.querySelector(".thumb-canvas");
    if (canvas) {
      generateThumbnail(videoPath, canvas);
    }
    // Load first video on page load
    if (idx === 0) {
      loadVideo(videoPath);
    }
  });

  // Attach click handlers to thumbnails
  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const videoPath = thumb.getAttribute("data-video");
      loadVideo(videoPath);

      // Update active state
      thumbs.forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
    });
  });
})();

// Daftar (registration) form: preview photo + submit stub
(function () {
  const form = document.getElementById("daftarForm");
  if (!form) return;

  const fileInput = document.getElementById("photo");
  const preview = document.getElementById("photoPreview");

  fileInput &&
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) {
        preview.innerHTML = "";
        preview.setAttribute("aria-hidden", "true");
        return;
      }

      // basic size check (5MB)
      const maxBytes = 5 * 1024 * 1024;
      if (file.size > maxBytes) {
        alert("File terlalu besar. Maksimum 5MB.");
        fileInput.value = "";
        preview.innerHTML = "";
        preview.setAttribute("aria-hidden", "true");
        return;
      }

      const reader = new FileReader();
      reader.onload = function (evt) {
        preview.innerHTML = `<img src="${evt.target.result}" alt="Preview foto" />`;
        preview.setAttribute("aria-hidden", "false");
      };
      reader.readAsDataURL(file);
    });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    // Collect values (demo only) — in a real app, send via fetch to backend
    const data = new FormData(form);
    const name = data.get("firstName") + " " + data.get("lastName");
    alert(`Terima kasih, ${name}. Pendaftaran Anda telah diterima (demo).`);
    form.reset();
    if (preview) {
      preview.innerHTML = "";
      preview.setAttribute("aria-hidden", "true");
    }
  });
})();

// Mobile hamburger toggle: open/close, aria-expanded, close on link/Escape
(function () {
  const btn = document.querySelector(".hamburger");
  const header =
    document.querySelector("header.site-header") ||
    document.querySelector("header");
  const nav =
    document.querySelector("nav.primary") || document.querySelector("nav");
  if (!btn || !header || !nav) return;

  const OPEN = "menu-open";

  function setOpen(open) {
    if (open) {
      header.classList.add(OPEN);
      btn.setAttribute("aria-expanded", "true");
      document.documentElement.style.overflow = "hidden";
    } else {
      header.classList.remove(OPEN);
      btn.setAttribute("aria-expanded", "false");
      document.documentElement.style.overflow = "";
    }
  }

  btn.addEventListener("click", function () {
    setOpen(!header.classList.contains(OPEN));
  });

  // Close when a nav link is clicked (use capture to catch links added dynamically)
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", function () {
      setOpen(false);
    })
  );

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });

  // If the viewport is resized to desktop size, ensure menu is closed
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth > 820) setOpen(false);
    }, 120);
  });
})();
