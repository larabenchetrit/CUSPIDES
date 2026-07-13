// ============================================
// DETALLE DE CURSO — INTRO ("Si te atrae LA MONTAÑA...")
//
// El bloque (cards + título + texto + botón) vive dentro de
// .course-intro__sticky, que queda pineado en pantalla (position:
// sticky) mientras se recorre el "riel" de scroll de .course-intro
// (220vh). El título arranca completamente verde; a medida que el
// scroll avanza, cada palabra/frase en rojo (LA MONTAÑA, APRENDER,
// COMPROMISO) se va pintando en orden y se queda así — no vuelve a
// verde aunque se scrollee hacia arriba (mismo patrón que la sección
// "¿Por qué entrenar durante meses?" de la home).
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const section = document.querySelector('.course-intro');
  const accents = Array.from(document.querySelectorAll('.course-intro__accent'));

  if (!section || !accents.length) {
    console.warn('[course-intro] No se encontró .course-intro (o sus acentos) en el DOM.');
    return;
  }

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Con "menos movimiento" preferido mostramos el título ya completo
  // en rojo, sin pinear ni animar nada.
  if (prefersReducedMotion) {
    accents.forEach((accent) => accent.classList.add('is-active'));
    return;
  }

  const total = accents.length;
  let ticking = false;

  function render() {
    ticking = false;

    const rect = section.getBoundingClientRect();
    const pinnableDistance = rect.height - window.innerHeight;

    // Si la sección no llega a ser más alta que el viewport, mostramos
    // el título ya completo.
    if (pinnableDistance <= 0) {
      accents.forEach((accent) => accent.classList.add('is-active'));
      return;
    }

    const scrolled = Math.min(Math.max(-rect.top, 0), pinnableDistance);
    const progress = scrolled / pinnableDistance; // 0 → 1 mientras está pineada

    accents.forEach((accent, i) => {
      // A diferencia de "¿Por qué entrenar durante meses?" (donde la
      // razón 1 arranca ya pintada), acá el título tiene que arrancar
      // completamente verde: la primera frase recién se pinta cuando el
      // scroll avanza un tercio del riel, no apenas se pinea. Una vez
      // agregada la clase, no se saca: no hay marcha atrás.
      const threshold = (i + 1) / total;
      if (progress >= threshold) {
        accent.classList.add('is-active');
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
