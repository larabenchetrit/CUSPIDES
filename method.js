// ============================================
// SECTION 3 — EL MÉTODO CÚSPIDES
//
// El título y la bajada quedan fijos en el centro de la pantalla.
// Debajo, las cards (.step) quedan todas superpuestas en el mismo
// lugar, mismo tamaño (acorde a su contenido). A medida que se
// scrollea la sección, la card actual se desliza hacia la izquierda y
// sale de escena, revelando a la siguiente (que ya estaba esperando
// en ese mismo lugar, debajo). Al scrollear para arriba, vuelve a
// entrar desde la izquierda hasta mostrarse de nuevo.
//
// Progressive enhancement:
// - Por defecto .method__cards es una lista vertical normal (una card
//   debajo de la otra, scroll de página nativo).
// - Si hay JS y el usuario no pidió "menos movimiento", se agrega la
//   clase .method--pinned: la sección se pinea y el scroll vertical
//   controla, card por card, cuánto se deslizó cada una hacia afuera.
// - Además del scroll vertical, el mazo de cards también se puede
//   arrastrar a mano (mouse o touch): ese arrastre se traduce en
//   scroll vertical de página equivalente, así siempre hay una sola
//   fuente de verdad para el progreso (ver render()).
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const section = document.querySelector('.method');
  const stage = document.getElementById('methodStage');
  const cards = Array.from(document.querySelectorAll('.method .step'));

  if (!section || !stage || !cards.length) {
    console.warn('[method] Faltan elementos de la sección .method en el DOM.');
    return;
  }

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Con "menos movimiento" preferido dejamos las cards como lista
  // vertical normal (comportamiento por defecto del CSS) y no pineamos
  // ni enganchamos el arrastre manual.
  if (prefersReducedMotion) return;

  // Orden de apilado fijo: la primera card queda arriba de todo, así
  // es la que se ve (y se desliza afuera) primero; cada una debajo de
  // la anterior espera su turno en ese mismo lugar.
  cards.forEach(function (card, i) {
    card.style.zIndex = String(cards.length - i);
  });

  let overflow = 0;   // scroll extra (px) necesario para recorrer todas las cards
  let stageWidth = 0; // ancho del stage, para saber cuánto desplazar cada card
  let ticking = false;

  function measure() {
    // Cada transición (una card saliendo hacia la izquierda) ocupa una
    // pantalla completa de scroll. La primera card ya se ve sin
    // necesitar scroll, así que solo hacen falta (n-1) pantallas
    // adicionales para llegar a la última.
    const segment = window.innerHeight;
    overflow = Math.max((cards.length - 1) * segment, 0);
    stageWidth = stage.clientWidth;

    if (overflow > 0) {
      section.classList.add('method--pinned');
      section.style.setProperty('--method-pin-height', '100vh');
      section.style.height = 'calc(100vh + ' + overflow + 'px)';
    } else {
      // No hay overflow (p. ej. una sola card): no hace falta pinear,
      // se ve completa como lista.
      section.classList.remove('method--pinned');
      section.style.height = '';
      cards.forEach(function (card) { card.style.transform = ''; });
    }
  }

  function render() {
    ticking = false;
    if (overflow <= 0) return;

    const rect = section.getBoundingClientRect();
    const scrolled = Math.min(Math.max(-rect.top, 0), overflow);
    const progress = scrolled / overflow; // 0 → 1
    const rawIndex = progress * (cards.length - 1); // posición continua entre cards

    cards.forEach(function (card, i) {
      if (i === cards.length - 1) {
        // La última card nunca sale: se queda fija en su lugar.
        card.style.transform = 'translate3d(0,0,0)';
        return;
      }
      // La card i sale hacia la izquierda durante el tramo de scroll
      // [i, i+1] del recorrido total. Se desplaza el ancho completo
      // del stage (no solo el propio) para garantizar que salga del
      // todo de la vista sin importar su tamaño o centrado.
      const local = Math.min(Math.max(rawIndex - i, 0), 1);
      const offset = -local * stageWidth;
      card.style.transform = 'translate3d(' + offset + 'px,0,0)';
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(render);
    }
  }

  function onResize() {
    measure();
    render();
  }

  measure();
  render();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);

  // ---------- Arrastre manual (mouse / touch / pen) ----------
  // Permite mover el mazo a mano, además del control automático por
  // scroll vertical. Mientras la sección está pineada, arrastrar hacia
  // arriba avanza (la card actual sale hacia la izquierda), igual que
  // scrollear hacia abajo; arrastrar hacia abajo retrocede.
  let isDragging = false;
  let lastY = 0;

  function onPointerDown(e) {
    // Solo botón principal del mouse (o touch/pen, que no reportan button).
    if (e.button !== undefined && e.button !== 0) return;
    isDragging = true;
    lastY = e.clientY;
    stage.classList.add('is-dragging');
    if (stage.setPointerCapture) {
      try { stage.setPointerCapture(e.pointerId); } catch (err) { /* no-op */ }
    }
  }

  function onPointerMove(e) {
    if (!isDragging) return;

    const deltaY = e.clientY - lastY;
    lastY = e.clientY;
    if (deltaY === 0) return;

    e.preventDefault();

    if (section.classList.contains('method--pinned')) {
      // Arrastrar hacia arriba (deltaY negativo) debe avanzar, igual
      // que scrollear hacia abajo: por eso el signo invertido.
      window.scrollBy(0, -deltaY);
    }
  }

  function onPointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    stage.classList.remove('is-dragging');
    if (stage.releasePointerCapture) {
      try { stage.releasePointerCapture(e.pointerId); } catch (err) { /* no-op */ }
    }
  }

  stage.addEventListener('pointerdown', onPointerDown);
  stage.addEventListener('pointermove', onPointerMove);
  stage.addEventListener('pointerup', onPointerUp);
  stage.addEventListener('pointercancel', onPointerUp);
});