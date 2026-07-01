/* =========================================================
   BIBLIOTECA VIRTUAL — TECSUP
   JavaScript simple: búsqueda, filtros, contador y animaciones.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const cards = Array.from(document.querySelectorAll(".card"));
  const searchInput = document.getElementById("buscador");
  const filterButtons = Array.from(document.querySelectorAll(".filter-chip"));
  const counter = document.getElementById("contador");
  const emptyState = document.getElementById("empty-state");

  let activeFilter = "todos";
  let searchTerm = "";

  // Aplica juntos el filtro de tipo y el texto de búsqueda a cada tarjeta.
  function applyFilters() {
    let visibleCount = 0;

    cards.forEach((card) => {
      const type = card.dataset.type;
      const name = card.dataset.name.toLowerCase();
      const desc = card.dataset.desc.toLowerCase();

      const matchesFilter = activeFilter === "todos" || type === activeFilter;
      const matchesSearch = name.includes(searchTerm) || desc.includes(searchTerm);
      const shouldShow = matchesFilter && matchesSearch;

      if (shouldShow) {
        card.hidden = false;
        // Reinicia la animación de entrada al volver a mostrarse.
        card.classList.remove("is-filtered-in");
        void card.offsetWidth; // fuerza el reflow para reiniciar la animación
        card.classList.add("is-filtered-in");
        visibleCount++;
      } else {
        card.hidden = true;
      }
    });

    counter.textContent = `Mostrando ${visibleCount} de ${cards.length} recursos`;
    emptyState.hidden = visibleCount !== 0;
  }

  // Buscador
  searchInput.addEventListener("input", (event) => {
    searchTerm = event.target.value.trim().toLowerCase();
    applyFilters();
  });

  // Filtros por tipo de recurso
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => {
        btn.classList.remove("is-active");
        btn.setAttribute("aria-pressed", "false");
      });
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");

      activeFilter = button.dataset.filter;
      applyFilters();
    });
  });

  // Animación de aparición al hacer scroll (encabezado, tarjetas, etc.)
  const revealTargets = document.querySelectorAll("[data-reveal]");

  // Escalona la entrada de las tarjetas para un efecto más agradable.
  document.querySelectorAll(".card").forEach((card, index) => {
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

  // Estado inicial del contador
  applyFilters();

  // Si el logo real de un recurso no llega a cargar, mostramos el nombre
  // del recurso en su lugar (en vez de dejar el ícono de imagen rota).
  document.querySelectorAll(".resource-logo img").forEach((img) => {
    img.addEventListener("error", () => {
      img.closest(".resource-logo").classList.add("resource-logo--fallback");
    });
  });
});
