// ============================================
// SECTION 4 — CURSOS
// Flip de card al hacer click/tap o Enter/Espacio.
// Los botones "VER MÁS" (frente y dorso) no togglean la card:
// navegan directo a la página de detalle del curso.
//
// IMPORTANTE: esta misma lógica de flip también existe en tu script.js
// original (bloque "SECTION 4 — CURSOS"). Si cargás los dos archivos a
// la vez, cada click dispara los dos listeners y la card se da vuelta
// y se vuelve a dar vuelta en el mismo click (no se ve ningún cambio).
// Usá SOLO uno de los dos: o este section-4.js, o el bloque de
// script.js, nunca ambos.
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('.course-card');
  if (!cards.length) return;

  function toggleCard(card) {
    const isFlipped = card.classList.toggle('is-flipped');
    card.setAttribute('aria-pressed', isFlipped ? 'true' : 'false');
  }

  cards.forEach((card) => {
    // Guarda contra doble-inicialización: si este script se cargara
    // más de una vez (o quedó un <script> repetido en el HTML), no
    // vuelve a atar un segundo listener sobre la misma card.
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
    card.querySelectorAll('.course-card__cta').forEach((cta) => {
      cta.addEventListener('click', (e) => {
        e.stopPropagation();
      });
      cta.addEventListener('keydown', (e) => {
        e.stopPropagation();
      });
    });
  });
});
