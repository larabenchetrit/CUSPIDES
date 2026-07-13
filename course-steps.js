// ============================================
// DETALLE DE CURSO — PROGRAMA PERSONALIZADO (ACORDEÓN)
//
// Cada .course-step arranca colapsado, mostrando solo su cabecera
// (número + título + flecha). Al hacer click en la cabecera, esa tarjeta
// se expande y muestra la info completa. Solo puede haber una tarjeta
// abierta a la vez: al abrir una, la que ya estaba abierta vuelve a su
// estado inicial.
//
// Con una tarjeta abierta, .course-steps__grid recibe la clase
// "has-active": eso oculta (vía CSS) las otras 5 tarjetas y hace que la
// activa pase a ocupar las dos columnas — el tamaño de las 6 juntas.
// Clickear en cualquier parte de la tarjeta ya abierta (no solo la
// cabecera) la cierra y devuelve todo a la normalidad.
//
// La animación de alto (grid-template-rows 0fr → 1fr) es 100% CSS; acá
// solo se maneja el estado (qué tarjeta está activa) y los atributos
// aria-expanded para accesibilidad.
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const grid = document.querySelector('.course-steps__grid');
  const steps = Array.from(document.querySelectorAll('.course-step'));

  if (!grid || !steps.length) {
    return;
  }

  function closeAll() {
    steps.forEach((other) => {
      other.classList.remove('is-active');
      const otherHeader = other.querySelector('.course-step__header');
      if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
    });
    grid.classList.remove('has-active');
  }

  steps.forEach((step) => {
    const header = step.querySelector('.course-step__header');
    if (!header) return;

    header.addEventListener('click', function () {
      const wasActive = step.classList.contains('is-active');

      // Cierra cualquier tarjeta que estuviera abierta (incluida esta).
      closeAll();

      // Si la tarjeta clickeada no era la que estaba activa, se abre.
      // Si ya estaba activa, el click la deja cerrada (toggle estándar
      // de acordeón).
      if (!wasActive) {
        step.classList.add('is-active');
        header.setAttribute('aria-expanded', 'true');
        grid.classList.add('has-active');
      }
    });

    // Con la tarjeta ya abierta, clickear en cualquier otra parte de
    // ella (fuera de la cabecera, que ya togglea sola) también la
    // cierra.
    step.addEventListener('click', function (event) {
      if (!step.classList.contains('is-active')) return;
      if (event.target.closest('.course-step__header')) return;
      closeAll();
    });
  });
});