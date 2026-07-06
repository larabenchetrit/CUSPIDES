// ============================================
// SECTION 7 — CON CÚSPIDES COLECCIONÁ EXPERIENCIAS
// Flip de card al hacer click/tap o Enter/Espacio.
// Los botones "VER MÁS" no togglean la card: navegan directo
// a la página de detalle de la experiencia.
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('.exp-card');
  if (!cards.length) return;

  function toggleCard(card) {
    const isFlipped = card.classList.toggle('is-flipped');
    card.setAttribute('aria-pressed', isFlipped ? 'true' : 'false');
  }

  cards.forEach((card) => {
    // Guarda contra doble-inicialización (por si este script quedara
    // cargado más de una vez, o duplicado dentro de otro archivo).
    if (card.dataset.flipBound === 'true') return;
    card.dataset.flipBound = 'true';

    card.addEventListener('click', () => toggleCard(card));

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCard(card);
      }
    });

    // Evita que el click en "VER MÁS" dispare el flip de la card:
    // el link navega directo a la página de detalle.
    card.querySelectorAll('.exp-card__cta').forEach((cta) => {
      cta.addEventListener('click', (e) => {
        e.stopPropagation();
      });
      cta.addEventListener('keydown', (e) => {
        e.stopPropagation();
      });
    });
  });
});
