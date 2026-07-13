// ============================================
// DETALLE DE CURSO — PREGUNTAS FRECUENTES (ACORDEÓN)
//
// Mismo patrón que "Programa Personalizado" (course-steps.js): cada
// .faq-item arranca colapsado, mostrando solo el ícono + la pregunta.
// Al hacer click, esa pregunta se expande y muestra la respuesta
// (línea divisoria + texto). Solo puede haber una abierta a la vez: al
// abrir una, la que ya estaba abierta vuelve a su estado inicial. Si se
// vuelve a clickear la que ya está abierta, se cierra.
//
// La animación de alto es 100% CSS (grid-template-rows); acá solo se
// maneja el estado y los atributos aria-expanded para accesibilidad.
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const items = Array.from(document.querySelectorAll('.faq-item'));

  if (!items.length) {
    return;
  }

  items.forEach((item) => {
    const header = item.querySelector('.faq-item__header');
    if (!header) return;

    header.addEventListener('click', function () {
      const wasActive = item.classList.contains('is-active');

      items.forEach((other) => {
        other.classList.remove('is-active');
        const otherHeader = other.querySelector('.faq-item__header');
        if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
      });

      if (!wasActive) {
        item.classList.add('is-active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
});
