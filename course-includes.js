// ============================================
// DETALLE DE CURSO — ¿EN QUÉ CONSISTE?
//
// Mismo patrón que "¿Por qué entrenar durante meses?" de la home: el
// bloque vive dentro de .course-includes__sticky, pineado en pantalla
// mientras se recorre el riel de scroll de .course-includes (220vh).
// Cada frase arranca en verde claro (punto en contorno, sin relleno);
// al pasar su umbral se pinta de amarillo (punto, línea y texto) — y
// ahora también vuelve a verde claro si se scrollea hacia arriba,
// restaurando el estado inicial. La primera frase arranca ya activa
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
      item.classList.toggle('is-active', progress >= threshold);
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