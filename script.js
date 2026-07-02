/* =====================================================
   CÚSPIDES — HERO SCROLL REVEAL
   La imagen "heroadelante" arranca oculta debajo del viewport
   y se desliza hacia arriba a medida que se scrollea la sección
   .hero, tapando progresivamente el título hasta cubrirlo del todo.
   ===================================================== */

(function () {
  const hero = document.querySelector('.hero');
  const front = document.getElementById('heroFront');

  if (!hero || !front) return;

  let ticking = false;

  function getProgress() {
    const rect = hero.getBoundingClientRect();
    const scrollable = hero.offsetHeight - window.innerHeight;

    if (scrollable <= 0) return 0;

    // rect.top va de 0 (inicio del hero) a -scrollable (fin del hero, pineado)
    const scrolled = -rect.top;
    const progress = scrolled / scrollable;

    return Math.min(Math.max(progress, 0), 1);
  }

  function updateHero() {
    const progress = getProgress();

    // De 100% (totalmente oculta abajo) a 0% (tapando toda la pantalla)
    const translateY = (1 - progress) * 100;
    front.style.transform = `translateY(${translateY}%)`;

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateHero);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  // Estado inicial
  updateHero();
})();
