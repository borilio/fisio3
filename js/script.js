(() => {
  "use strict";

  /* -----------------------------------------------------
     Modo oscuro / claro
     - Al cargar: sigue la preferencia del sistema (prefers-color-scheme).
     - El botón permite forzar manualmente claro/oscuro durante la sesión.
     - No se guarda en cookies ni localStorage: cada visita vuelve a
       partir de la preferencia del sistema.
     ----------------------------------------------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  function applyTheme(isDark) {
    root.setAttribute("data-theme", isDark ? "dark" : "light");
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
    );
  }

  applyTheme(media.matches);

  // Si el usuario no ha tocado el botón, sigue la preferencia del sistema en vivo.
  let manualOverride = false;
  media.addEventListener("change", (e) => {
    if (!manualOverride) applyTheme(e.matches);
  });

  themeToggle.addEventListener("click", () => {
    manualOverride = true;
    const isDark = root.getAttribute("data-theme") === "dark";
    applyTheme(!isDark);
  });

  /* -----------------------------------------------------
     Menú móvil
     ----------------------------------------------------- */
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");

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

  /* -----------------------------------------------------
     Modal de aviso legal
     ----------------------------------------------------- */
  const legalModal = document.getElementById("legal-modal");
  const openLegal = document.getElementById("open-legal");

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

  /* -----------------------------------------------------
     Aviso de cookies
     - La web no usa cookies. Solo se recuerda localmente (localStorage,
       no una cookie) que el aviso ya se ha cerrado, para no mostrarlo
       en cada visita.
     ----------------------------------------------------- */
  const cookieBanner = document.getElementById("cookie-banner");
  const cookieAccept = document.getElementById("cookie-accept");
  const COOKIE_KEY = "fcds_aviso_cerrado";

  try {
    if (!localStorage.getItem(COOKIE_KEY)) {
      cookieBanner.hidden = false;
    }
  } catch (err) {
    // Si localStorage no está disponible, mostramos el aviso igualmente.
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

  /* -----------------------------------------------------
     Año en el footer
     ----------------------------------------------------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
