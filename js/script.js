(() => {
  "use strict";

  /* -----------------------------------------------------
     Modo oscuro / claro
     - El tema inicial ya lo aplica el script del <head> (evita parpadeo).
     - Sin elección manual, se sigue siempre la preferencia del sistema.
     - Solo se guarda el tema cuando el usuario pulsa el botón.
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
      try {
        localStorage.setItem(THEME_KEY, isDark ? "light" : "dark");
      } catch (err) {
        /* noop */
      }
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
  const openCookies = document.getElementById("open-cookies");
  const COOKIE_KEY = "fcds_aviso_cerrado";

  function showCookieBanner() {
    if (!cookieBanner) return;
    cookieBanner.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function hideCookieBanner() {
    if (!cookieBanner) return;
    cookieBanner.hidden = true;
    document.body.style.overflow = "";
  }

  if (cookieBanner && cookieAccept) {
    try {
      if (!localStorage.getItem(COOKIE_KEY)) {
        cookieBanner.hidden = false;
      } else {
        cookieBanner.hidden = true;
      }
    } catch (err) {
      cookieBanner.hidden = false;
    }

    cookieAccept.addEventListener("click", () => {
      hideCookieBanner();
      try {
        localStorage.setItem(COOKIE_KEY, "1");
      } catch (err) {
        /* noop */
      }
    });
  }

  if (openCookies) {
    openCookies.addEventListener("click", () => {
      try {
        localStorage.removeItem(COOKIE_KEY);
      } catch (err) {
        /* noop */
      }
      showCookieBanner();
    });
  }

  /* -----------------------------------------------------
     Mapa de Google: se carga solo al pulsar "Ver mapa"
     ----------------------------------------------------- */
  const mapContainer = document.getElementById("map-container");
  const loadMap = document.getElementById("load-map");

  if (mapContainer && loadMap) {
    loadMap.addEventListener("click", () => {
      const iframe = document.createElement("iframe");
      iframe.title = "Ubicación de la clínica en el mapa";
      iframe.src = mapContainer.dataset.mapSrc;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.allowFullscreen = true;
      iframe.className = "h-[300px] w-full border-0 sm:h-[360px]";
      mapContainer.replaceChildren(iframe);
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
