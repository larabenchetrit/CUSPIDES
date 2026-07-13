// ============================================
// DETALLE DE CURSO — PROGRAMA PERSONALIZADO (ACORDEÓN)
//
// Cada .course-step arranca colapsado, mostrando solo su cabecera
// (número + título + flecha). Al hacer click en la cabecera, esa tarjeta
// se expande y muestra la info completa (cards_sect_3). Solo puede haber
// una tarjeta abierta a la vez: al abrir una, la que ya estaba abierta
// vuelve a su estado inicial. Si se vuelve a clickear la tarjeta ya
// abierta, se cierra (accordion estándar).
//
// La animación de alto (grid-template-rows 0fr → 1fr) es 100% CSS; acá
// solo se maneja el estado (qué tarjeta está activa) y los atributos
// aria-expanded para accesibilidad.
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const steps = Array.from(document.querySelectorAll('.course-step'));

  if (!steps.length) {
    return;
  }

  steps.forEach((step) => {
    const header = step.querySelector('.course-step__header');
    if (!header) return;

    header.addEventListener('click', function () {
      const wasActive = step.classList.contains('is-active');

      // Cierra cualquier tarjeta que estuviera abierta (incluida esta).
      steps.forEach((other) => {
        other.classList.remove('is-active');
        const otherHeader = other.querySelector('.course-step__header');
        if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
      });

      // Si la tarjeta clickeada no era la que estaba activa, se abre.
      // Si ya estaba activa, el click anterior ya la dejó cerrada
      // (comportamiento de acordeón: togglea).
      if (!wasActive) {
        step.classList.add('is-active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
});
