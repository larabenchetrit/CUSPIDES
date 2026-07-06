// ============================================
// SECTION 1 — QUIÉNES SOMOS + ESTADÍSTICAS
// Contador animado 0 -> valor, al entrar en viewport
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const section = document.getElementById('statsCounter');
  if (!section) {
    console.warn('[section-1] No se encontró #statsCounter en el DOM.');
    return;
  }

  const numbers = Array.from(section.querySelectorAll('.stat__number'));
  if (!numbers.length) {
    console.warn('[section-1] No se encontraron .stat__number dentro de #statsCounter.');
    return;
  }

  const DURATION = 1800; // ms — ritmo fluido, ni muy rápido ni muy lento
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased = easeOutCubic(progress);
      const value = Math.round(target * eased);
      el.textContent = value.toLocaleString('es-AR');

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toLocaleString('es-AR');
      }
    }

    requestAnimationFrame(tick);
  }

  let hasAnimated = false;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            numbers.forEach(animateCount);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(section);
  } else {
    // Fallback para navegadores sin soporte de IntersectionObserver
    numbers.forEach(animateCount);
  }
});
