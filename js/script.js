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

// ============================================
// SECTION 3 — EL MÉTODO CÚSPIDES
// Ticker que se desplaza lateralmente según el scroll
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const track = document.getElementById('methodTickerTrack');
  if (!track) return;

  // El HTML trae el contenido duplicado (2 sets iguales) para loop infinito
  const SPEED = 0.35; // qué tan rápido se desplaza respecto al scroll (más bajo = más lento)

  let offset = 0;
  let lastScrollY = window.scrollY;
  let ticking = false;

  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  function update() {
    const currentY = window.scrollY;
    const delta = currentY - lastScrollY;
    lastScrollY = currentY;

    offset += delta * SPEED;

    const setWidth = track.scrollWidth / 2;
    if (setWidth > 0) {
      const x = mod(offset, setWidth);
      track.style.transform = `translateX(${-x}px)`;
    }

    ticking = false;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
});




// ============================================
// SECTION 4 — CURSOS
// Flip de card al hacer click/tap o Enter/Espacio
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('.course-card');
  if (!cards.length) return;

  function toggleCard(card) {
    const isFlipped = card.classList.toggle('is-flipped');
    card.setAttribute('aria-pressed', isFlipped ? 'true' : 'false');
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => toggleCard(card));

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCard(card);
      }
    });
  });
});


// ============================================
// SECTION 7 — CON CÚSPIDES COLECCIONÁ EXPERIENCIAS
// Flip de card al hacer click/tap o Enter/Espacio
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('.exp-card');
  if (!cards.length) return;

  function toggleCard(card) {
    const isFlipped = card.classList.toggle('is-flipped');
    card.setAttribute('aria-pressed', isFlipped ? 'true' : 'false');
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => toggleCard(card));

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCard(card);
      }
    });
  });
});


// ============================================
// SECTION 10 — CTA FINAL
// Evita que el form recargue la página (todavía no hay backend conectado)
// Reemplazá el contenido del if por tu integración real (fetch a tu API,
// Mailchimp, Google Sheets, etc.)
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('startForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = form.nombre.value.trim();
    const email = form.email.value.trim();

    if (!nombre || !email) return;

    // TODO: reemplazar por el envío real (fetch/AJAX a tu backend o servicio de email)
    console.log('Formulario listo para enviar:', { nombre, email });

    form.reset();
  });
});