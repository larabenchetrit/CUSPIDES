// ============================================
// SECTION 9 — TESTIMONIO
//
// La cinta de testimonios (.testimonial__track) se desliza sola hacia la
// izquierda a velocidad constante (SPEED px/seg) dentro de
// .testimonial__track-wrap. El contenido está triplicado en tres
// .testimonial__set idénticos (uno accesible + dos aria-hidden) para que
// el loop sea perfecto: medimos el ancho real de un set (setWidth) y
// envolvemos el desplazamiento (offsetX) dentro de (-setWidth, 0], así
// nunca se nota el punto de reinicio.
//
// Interacción:
//   - Hover / focus dentro de la cinta → se pausa el auto-scroll.
//   - Arrastre manual (mouse, touch o pen, vía Pointer Events) → mueve la
//     cinta a mano y pausa el auto-scroll mientras se arrastra.
//   - prefers-reduced-motion → no hay auto-scroll; la cinta queda quieta
//     y se puede recorrer con scroll horizontal nativo (ver CSS) o con
//     el arrastre manual, que se mantiene disponible.
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const wrap = document.getElementById('testimonialTrackWrap');
  const track = document.getElementById('testimonialTrack');

  if (!wrap || !track) {
    console.warn('[testimonial] Faltan elementos de la sección .testimonial en el DOM.');
    return;
  }

  const sets = Array.from(track.querySelectorAll('.testimonial__set'));
  if (sets.length < 2) {
    console.warn('[testimonial] Se necesitan al menos 2 .testimonial__set para el loop.');
    return;
  }

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const SPEED = 32; // px por segundo

  let setWidth = 0;
  let offsetX = 0;
  let paused = false;
  let dragging = false;
  let dragStartX = 0;
  let dragStartOffset = 0;
  let lastTimestamp = null;
  let rafId = null;

  function measure() {
    // Distancia entre el inicio de dos sets consecutivos == ancho de un
    // set (incluyendo el gap que lo separa del siguiente).
    setWidth = sets[1].offsetLeft - sets[0].offsetLeft;
  }

  // Mantiene offsetX dentro de (-setWidth, 0] para que el loop sea invisible.
  function wrap_(value) {
    if (setWidth <= 0) return 0;
    let v = value % setWidth;
    if (v > 0) v -= setWidth;
    return v;
  }

  function render() {
    track.style.transform = 'translate3d(' + offsetX + 'px, 0, 0)';
  }

  function tick(timestamp) {
    if (lastTimestamp === null) lastTimestamp = timestamp;
    const dt = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    if (!paused && !dragging && !prefersReducedMotion) {
      offsetX = wrap_(offsetX - SPEED * dt);
      render();
    }

    rafId = window.requestAnimationFrame(tick);
  }

  function pause() {
    paused = true;
  }

  function resume() {
    paused = false;
  }

  wrap.addEventListener('mouseenter', pause);
  wrap.addEventListener('mouseleave', resume);
  wrap.addEventListener('focusin', pause);
  wrap.addEventListener('focusout', resume);

  // --- Arrastre manual (mouse / touch / pen unificados con Pointer Events) ---
  function onPointerDown(e) {
    dragging = true;
    paused = true;
    dragStartX = e.clientX;
    dragStartOffset = offsetX;
    wrap.classList.add('is-dragging');
    wrap.setPointerCapture && wrap.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const delta = e.clientX - dragStartX;
    offsetX = wrap_(dragStartOffset + delta);
    render();
  }

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    wrap.classList.remove('is-dragging');
    if (e && wrap.releasePointerCapture) {
      try {
        wrap.releasePointerCapture(e.pointerId);
      } catch (err) {
        /* noop: el puntero puede ya no estar capturado */
      }
    }
    // Si el mouse quedó fuera de la cinta al soltar, retomamos el auto-scroll.
    if (!wrap.matches(':hover') && !wrap.matches(':focus-within')) {
      paused = false;
    }
  }

  wrap.addEventListener('pointerdown', onPointerDown);
  wrap.addEventListener('pointermove', onPointerMove);
  wrap.addEventListener('pointerup', endDrag);
  wrap.addEventListener('pointercancel', endDrag);
  wrap.addEventListener('pointerleave', function (e) {
    if (dragging) endDrag(e);
  });

  function onResize() {
    // Re-medimos y normalizamos offsetX contra el nuevo ancho para que no
    // quede "desfasado" tras un cambio de tamaño/orientación.
    measure();
    offsetX = wrap_(offsetX);
    render();
  }

  measure();
  render();
  window.addEventListener('resize', onResize);

  if (!prefersReducedMotion) {
    rafId = window.requestAnimationFrame(tick);
  }
});
