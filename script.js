/* =============================================================
   CÚSPIDES — script.js
   El wireframe no indica interacciones complejas.
   Solo se agrega comportamiento mínimo al nav al hacer scroll.
   ============================================================= */

(function () {
  'use strict';

  const nav = document.getElementById('nav');
  if (!nav) return;

  // Agrega clase al nav cuando el usuario hace scroll hacia abajo
  // para darle fondo sólido y mejorar legibilidad.
  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // estado inicial
})();
