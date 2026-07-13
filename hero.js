/* =====================================================
   HERO — desvanecido del título al hacer scroll
   =====================================================
   La aparición del título (blur + escala, de menor a mayor) es 100% CSS,
   ver @keyframes heroTitleReveal en style.css — no requiere JS.

   Este script solo agrega el efecto inverso: a medida que se scrollea
   hacia abajo, el título repite ese mismo efecto (blur + escala) pero en
   reversa, para "disolverse" en vez de aparecer. Se calcula un progreso
   0→1 en función de cuánto se scrolleó respecto de la altura del propio
   hero, y se escribe en la custom property --hero-scroll-fade sobre
   .hero__title (el resto lo resuelve el CSS, ver style.css).

   Sin parallax ni recálculos de layout: solo lectura de scrollY (vía
   rAF, para no saturar el hilo principal) y una escritura de estilo. */
(function () {
  var heroTitle = document.querySelector('.hero__title');
  var heroPin = document.querySelector('.hero__pin');

  if (!heroTitle || !heroPin) return;

  // Respeta prefers-reduced-motion: si el usuario lo pide, no se anima
  // nada por scroll (el CSS ya deja el título fijo y visible en ese caso).
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotion.matches) return;

  var ticking = false;

  function updateFade() {
    ticking = false;

    // El desvanecido se completa al scrollear una distancia igual a la
    // altura del propio hero (no del viewport): así queda proporcional
    // al tamaño real de la foto en cualquier resolución.
    var fadeDistance = heroPin.offsetHeight || window.innerHeight;
    var progress = window.scrollY / fadeDistance;

    // Clamp 0–1
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    heroTitle.style.setProperty('--hero-scroll-fade', progress.toFixed(4));
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateFade);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Estado inicial correcto (por si la página carga con scroll > 0, ej.
  // al refrescar con una posición guardada).
  updateFade();
})();
