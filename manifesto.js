// ============================================
// SECTION 2 — CITA "CADA EXPEDICIÓN COMIENZA..."
//
// El texto vive dentro de .manifesto__sticky, que queda pineado en
// pantalla (position: sticky) mientras se recorre el "riel" de scroll
// de .manifesto (220vh). Cada .manifesto__word tiene su propia ventana
// de aparición dentro de ese recorrido: a medida que el scroll avanza,
// las palabras se iluminan de izquierda a derecha, de forma fluida y
// continua (nunca saltan de golpe), sin que el bloque de texto se
// mueva de su lugar en el wireframe.
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const section = document.querySelector('.manifesto');
  const words = Array.from(document.querySelectorAll('.manifesto__word'));
  if (!section || !words.length) {
    if (!section) console.warn('[manifesto] No se encontró .manifesto en el DOM.');
    return;
  }

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Con "menos movimiento" preferido, mostramos todo el texto ya
  // revelado y no animamos nada.
  if (prefersReducedMotion) {
    words.forEach((word) => { word.style.opacity = 1; });
    return;
  }

  const DIM_OPACITY = 0.16; // opacidad de una palabra todavía "no leída"

  let ticking = false;

  function render() {
    ticking = false;

    const rect = section.getBoundingClientRect();
    const pinnableDistance = rect.height - window.innerHeight;

    // Si la sección no llega a ser más alta que el viewport (pantallas
    // muy grandes / secciones editadas), mostramos el texto entero.
    if (pinnableDistance <= 0) {
      words.forEach((word) => { word.style.opacity = 1; });
      return;
    }

    const scrolled = Math.min(Math.max(-rect.top, 0), pinnableDistance);
    const progress = scrolled / pinnableDistance; // 0 → 1 mientras está pineada

    const total = words.length;
    words.forEach((word, i) => {
      const start = i / total;
      const end = start + 1 / total;
      const local = (progress - start) / (end - start);
      const eased = Math.min(Math.max(local, 0), 1);
      word.style.opacity = DIM_OPACITY + eased * (1 - DIM_OPACITY);
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(render);
    }
  }

  render();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
});
