// ============================================
// SECTION 5 — ¿POR QUÉ ENTRENAR DURANTE MESES?
//
// El título+lista viven dentro de .why-train__sticky, que queda pineado
// en pantalla (position: sticky) mientras se recorre el "riel" de
// scroll de .why-train (230vh). A medida que el scroll avanza, cada
// razón (1, 2, 3) se pinta de rojo en orden; si se scrollea hacia
// arriba, se despinta y vuelve a verde (reversible, se puede ir y
// volver). La línea que conecta los puntos (.why-train__line) es un
// único elemento sin cortes: su posición/alto se calculan a partir de
// los puntos reales, y su color es un gradiente duro verde/rojo cuyo
// corte avanza en sincro con el progreso del scroll.
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const section = document.querySelector('.why-train');
  const items = Array.from(document.querySelectorAll('.why-train__item'));
  const listWrap = document.querySelector('.why-train__list-wrap');
  const lineEl = document.getElementById('whyTrainLine');

  if (!section || !items.length) {
    console.warn('[why-train] No se encontró .why-train (o sus ítems) en el DOM.');
    return;
  }

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Posiciona la línea (top/alto/left) según la ubicación real de los
  // puntos, y la colorea con un gradiente verde/rojo cuyo punto de
  // corte depende del progreso (0 → todo verde, 1 → todo roja).
  function updateLine(progress) {
    if (!lineEl || !listWrap || !items.length) return;

    const firstDot = items[0].querySelector('.why-train__dot');
    const lastDot = items[items.length - 1].querySelector('.why-train__dot');
    if (!firstDot || !lastDot) return;

    const wrapRect = listWrap.getBoundingClientRect();
    const firstRect = firstDot.getBoundingClientRect();
    const lastRect = lastDot.getBoundingClientRect();

    const top = (firstRect.top + firstRect.height / 2) - wrapRect.top;
    const bottom = (lastRect.top + lastRect.height / 2) - wrapRect.top;
    const left = (firstRect.left + firstRect.width / 2) - wrapRect.left;

    lineEl.style.top = top + 'px';
    lineEl.style.height = Math.max(bottom - top, 0) + 'px';
    lineEl.style.left = left + 'px';

    const pct = Math.round(Math.min(Math.max(progress, 0), 1) * 1000) / 10;
    lineEl.style.background =
      'linear-gradient(to bottom, ' +
      'var(--color-red, #ff523c) 0%, var(--color-red, #ff523c) ' + pct + '%, ' +
      'var(--color-green, #5c734f) ' + pct + '%, var(--color-green, #5c734f) 100%)';
  }

  // Con "menos movimiento" preferido mostramos las tres razones ya
  // pintadas de rojo, sin pinear ni animar nada.
  if (prefersReducedMotion) {
    items.forEach((item) => item.classList.add('is-active'));
    updateLine(1);
    return;
  }

  const total = items.length;
  let ticking = false;

  function render() {
    ticking = false;

    const rect = section.getBoundingClientRect();
    const pinnableDistance = rect.height - window.innerHeight;

    // Si la sección no llega a ser más alta que el viewport (pantallas
    // muy grandes / sección editada), mostramos todo pintado.
    if (pinnableDistance <= 0) {
      items.forEach((item) => item.classList.add('is-active'));
      updateLine(1);
      return;
    }

    const scrolled = Math.min(Math.max(-rect.top, 0), pinnableDistance);
    const progress = scrolled / pinnableDistance; // 0 → 1 mientras está pineada

    items.forEach((item, i) => {
      // El ítem 1 arranca pintado (umbral 0). Cada ítem siguiente se
      // pinta cuando el progreso supera su umbral, y se despinta si el
      // progreso vuelve a bajar (reversible en ambos sentidos).
      const threshold = i / total;
      item.classList.toggle('is-active', progress >= threshold);
    });

    updateLine(progress);
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