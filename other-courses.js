// ============================================
// EXPLORÁ OTROS CURSOS — flip de card (idéntico a section-4.js del home)
//
// Flip de card al hacer click/tap o Enter/Espacio (y, en mouse fino,
// también al hacer hover — eso lo resuelve el CSS con :hover, no hace
// falta JS para eso). Los botones "VER MÁS" (frente y dorso) no
// togglean la card: navegan directo a index.html#cursos.
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('.other-course-card');
  if (!cards.length) return;

  function toggleCard(card) {
    const isFlipped = card.classList.toggle('is-flipped');
    card.setAttribute('aria-pressed', isFlipped ? 'true' : 'false');
  }

  cards.forEach((card) => {
    if (card.dataset.flipBound === 'true') return;
    card.dataset.flipBound = 'true';

    card.addEventListener('click', () => toggleCard(card));

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCard(card);
      }
    });

    // Evita que el click en "VER MÁS" dispare el flip de la card: el
    // link navega directo a index.html#cursos.
    card.querySelectorAll('.other-course-card__cta').forEach((cta) => {
      cta.addEventListener('click', (e) => {
        e.stopPropagation();
      });
      cta.addEventListener('keydown', (e) => {
        e.stopPropagation();
      });
    });
  });
});
