// ============================================
// SECTION 6 — EL MEJOR ENTRENAMIENTO PARA LA MONTAÑA
//
// Los callouts (Eficiencia / Resiliencia / Adaptación) viven dentro de
// .training__sticky, que queda pineada en pantalla (position: sticky)
// mientras se recorre el "riel" de scroll de .training (260vh). Cada
// callout tiene dos pasos, en orden:
//   1) se revela (línea que nace del cuerpo de la mujer + título +
//      texto) — clase .is-visible
//   2) aparece el tilde dentro del círculo — clase .is-checked
// Recién terminado un callout empieza a revelarse el siguiente.
//
// A diferencia de la versión anterior, esto es BIDIRECCIONAL: si el
// usuario scrollea hacia arriba, las clases se sacan en el mismo orden
// invertido (el tilde desaparece, después la línea/texto se retraen),
// así que scrollear arriba y abajo siempre refleja el progreso real
// dentro del riel.
//
// En pantallas angostas .training__sticky deja de ser "sticky" (ver
// media query en style.css: el layout pasa a apilarse debajo de la
// foto) y con "menos movimiento" preferido tampoco se pinea nada — en
// ambos casos se muestran los tres callouts ya revelados y tildados,
// de forma permanente (no hay riel de scroll que recorrer).
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const section = document.querySelector('.training');
  const sticky = document.querySelector('.training__sticky');
  const items = Array.from(document.querySelectorAll('.training__callout'));

  if (!section || !sticky || !items.length) {
    console.warn('[training] Faltan elementos de la sección .training en el DOM.');
    return;
  }

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealAll() {
    items.forEach((item) => {
      item.classList.add('is-visible');
      item.classList.add('is-checked');
    });
  }

  if (prefersReducedMotion) {
    revealAll();
    return;
  }

  const total = items.length;
  let ticking = false;

  function render() {
    ticking = false;

    // Si .training__sticky no es sticky (layout apilado de pantallas
    // angostas), no hay riel de scroll que recorrer: mostramos todo.
    if (window.getComputedStyle(sticky).position !== 'sticky') {
      revealAll();
      return;
    }

    const rect = section.getBoundingClientRect();
    const pinnableDistance = rect.height - window.innerHeight;

    if (pinnableDistance <= 0) {
      revealAll();
      return;
    }

    const scrolled = Math.min(Math.max(-rect.top, 0), pinnableDistance);
    const progress = scrolled / pinnableDistance; // 0 → 1 mientras está pineada

    items.forEach((item, i) => {
      const revealThreshold = (i * 2) / (total * 2);
      const checkThreshold = (i * 2 + 1) / (total * 2);
      // toggle (no add): al bajar se agregan, al subir se sacan.
      item.classList.toggle('is-visible', progress >= revealThreshold);
      item.classList.toggle('is-checked', progress >= checkThreshold);
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