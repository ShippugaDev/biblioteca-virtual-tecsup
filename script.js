/* =========================================================
   BIBLIOTECA VIRTUAL — TECSUP
   JavaScript simple: filtros por categoría, animaciones de aparición
   y respaldo de logos.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const cards = Array.from(document.querySelectorAll(".card"));
  const filterButtons = Array.from(document.querySelectorAll(".filter-chip"));

  // "Todos" muestra lo mismo que "Libros digitales"; las revistas solo
  // aparecen si el usuario elige explícitamente ese filtro.
  function applyFilter(filter) {
    const effectiveFilter = filter === "todos" ? "libros" : filter;

    cards.forEach((card) => {
      const matches = card.dataset.type === effectiveFilter;

      if (matches) {
        card.hidden = false;
        requestAnimationFrame(() => {
          // Si la tarjeta empezó oculta, el observer de scroll nunca la vio: forzamos su aparición.
          card.classList.add("is-visible");
          card.classList.remove("is-filtering-out");
        });
      } else {
        card.classList.add("is-filtering-out");
        setTimeout(() => {
          if (card.classList.contains("is-filtering-out")) card.hidden = true;
        }, 250);
      }
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => {
        btn.classList.remove("is-active");
        btn.setAttribute("aria-pressed", "false");
      });
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");

      applyFilter(button.dataset.filter);
    });
  });

  // Animación de aparición al hacer scroll (encabezado, tarjetas, etc.)
  const revealTargets = document.querySelectorAll("[data-reveal]");

  // Escalona la entrada de las tarjetas para un efecto más agradable.
  cards.forEach((card, index) => {
    card.style.setProperty("--stagger", `${index * 80}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((target) => observer.observe(target));

  // Si el logo real de un recurso no llega a cargar, mostramos el nombre
  // del recurso en su lugar (en vez de dejar el ícono de imagen rota).
  document.querySelectorAll(".resource-logo img").forEach((img) => {
    img.addEventListener("error", () => {
      img.closest(".resource-logo").classList.add("resource-logo--fallback");
    });
  });
});
