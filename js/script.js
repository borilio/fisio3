(() => {
  "use strict";

  /* -----------------------------------------------------
     Modo oscuro / claro
     - Al inicio usa la preferencia del sistema, salvo que el usuario
       haya elegido un tema manualmente antes.
     ----------------------------------------------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const THEME_KEY = "fcds_theme";

  function applyTheme(isDark) {
    const dark = Boolean(isDark);
    root.setAttribute("data-theme", dark ? "dark" : "light");

    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
      );
      themeToggle.title = dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro";
    }

    try {
      localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
    } catch (err) {
      /* noop */
    }
  }

  let manualOverride = false;

  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "dark" || savedTheme === "light") {
      manualOverride = true;
      applyTheme(savedTheme === "dark");
    } else {
      applyTheme(media.matches);
    }
  } catch (err) {
    applyTheme(media.matches);
  }

  media.addEventListener("change", (e) => {
    if (!manualOverride) applyTheme(e.matches);
  });

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      manualOverride = true;
      const isDark = root.getAttribute("data-theme") === "dark";
      applyTheme(!isDark);
    });
  }

  /* -----------------------------------------------------
     Menú móvil
     ----------------------------------------------------- */
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* -----------------------------------------------------
     Modal de aviso legal
     ----------------------------------------------------- */
  const legalModal = document.getElementById("legal-modal");
  const openLegal = document.getElementById("open-legal");

  if (legalModal && openLegal) {
    function toggleModal(show) {
      legalModal.hidden = !show;
      document.body.style.overflow = show ? "hidden" : "";
    }

    openLegal.addEventListener("click", () => toggleModal(true));
    legalModal.querySelectorAll("[data-close-modal]").forEach((el) => {
      el.addEventListener("click", () => toggleModal(false));
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !legalModal.hidden) toggleModal(false);
    });
  }

  /* -----------------------------------------------------
     Aviso de cookies
     ----------------------------------------------------- */
  const cookieBanner = document.getElementById("cookie-banner");
  const cookieAccept = document.getElementById("cookie-accept");
  const COOKIE_KEY = "fcds_aviso_cerrado";

  if (cookieBanner && cookieAccept) {
    try {
      if (!localStorage.getItem(COOKIE_KEY)) {
        cookieBanner.hidden = false;
      }
    } catch (err) {
      cookieBanner.hidden = false;
    }

    cookieAccept.addEventListener("click", () => {
      cookieBanner.hidden = true;
      try {
        localStorage.setItem(COOKIE_KEY, "1");
      } catch (err) {
        /* noop */
      }
    });
  }

  /* -----------------------------------------------------
     Año en el footer
     ----------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
