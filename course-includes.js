// ============================================
// DETALLE DE CURSO — ¿EN QUÉ CONSISTE?
//
// Mismo patrón que "¿Por qué entrenar durante meses?" de la home: el
// bloque vive dentro de .course-includes__sticky, pineado en pantalla
// mientras se recorre el riel de scroll de .course-includes (220vh).
// Cada frase arranca verde; al pasar su umbral se pone crema (y su
// punto + el tramo de línea que sale de él se ponen amarillos) y se
// queda así — no vuelve atrás. La primera frase arranca ya activa
// (umbral 0), igual que en el resto del sitio.
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const section = document.querySelector('.course-includes');
  const items = Array.from(document.querySelectorAll('.course-includes__item'));

  if (!section || !items.length) {
    console.warn('[course-includes] No se encontró .course-includes (o sus ítems) en el DOM.');
    return;
  }

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    items.forEach((item) => item.classList.add('is-active'));
    return;
  }

  const total = items.length;
  let ticking = false;

  function render() {
    ticking = false;

    const rect = section.getBoundingClientRect();
    const pinnableDistance = rect.height - window.innerHeight;

    if (pinnableDistance <= 0) {
      items.forEach((item) => item.classList.add('is-active'));
      return;
    }

    const scrolled = Math.min(Math.max(-rect.top, 0), pinnableDistance);
    const progress = scrolled / pinnableDistance; // 0 → 1 mientras está pineada

    items.forEach((item, i) => {
      const threshold = i / total;
      if (progress >= threshold) {
        item.classList.add('is-active');
      }
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
