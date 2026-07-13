/* ============================================
   MENÚ HAMBURGUESA (mobile) — compartido entre home y páginas de detalle
   Se usa en index.html y detallehabitar.html (mismo markup: botón
   #navToggleBtn + nav #siteNav). Solo tiene efecto visual dentro de las
   media queries max-width:768px de cada hoja de estilos — en desktop el
   botón está oculto y este script no cambia nada de lo que se ve.
   ============================================ */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('navToggleBtn');
    var nav = document.getElementById('siteNav');
    if (!toggle || !nav) return;

    function isOpen() {
      return nav.classList.contains('is-open');
    }

    function openMenu() {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Cerrar menú');
    }

    function closeMenu() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
    }

    toggle.addEventListener('click', function () {
      if (isOpen()) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Cierra el menú al elegir un link.
    nav.querySelectorAll('.navbar__link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Cierra el menú al tocar/clickear afuera.
    document.addEventListener('click', function (e) {
      if (!isOpen()) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      closeMenu();
    });

    // Cierra el menú con la tecla Escape.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) closeMenu();
    });

    // Si el usuario agranda la ventana a desktop con el menú abierto,
    // lo reseteamos para que no quede "abierto" escondido al volver a mobile.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && isOpen()) closeMenu();
    });
  });
})();
