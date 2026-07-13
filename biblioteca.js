/* ============================================
   CÚSPIDES — BIBLIOTECA UI
   JS mínimo, sólo para las demos interactivas de esta página:
   1) Acordeón (un panel abierto a la vez, mismo patrón que
      course-steps.js / course-faq.js).
   2) Flip card: tap-to-flip para touch (el hover ya lo resuelve el CSS
      en desktop).
   3) Swatches de color: click para copiar el hex al portapapeles.
   ============================================ */
(function () {
  'use strict';

  /* ---------- Acordeón ---------- */
  var accordion = document.getElementById('libAccordion');
  if (accordion) {
    var items = accordion.querySelectorAll('.ui-accordion__item');
    items.forEach(function (item) {
      var header = item.querySelector('.ui-accordion__header');
      if (!header) return;
      header.addEventListener('click', function () {
        var isActive = item.classList.contains('is-active');
        items.forEach(function (other) {
          other.classList.remove('is-active');
          var btn = other.querySelector('.ui-accordion__header');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
        if (!isActive) {
          item.classList.add('is-active');
          header.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ---------- Flip card (tap-to-flip para touch) ---------- */
  var flipCards = document.querySelectorAll('[data-flip-card]');
  flipCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var flipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', flipped ? 'true' : 'false');
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  /* ---------- Copiar hex de los swatches de color ---------- */
  var colorGrid = document.getElementById('colorGrid');
  if (colorGrid) {
    var swatches = colorGrid.querySelectorAll('.lib-swatch');
    swatches.forEach(function (swatch) {
      swatch.addEventListener('click', function () {
        var hex = swatch.getAttribute('data-hex');
        if (!hex) return;

        var markCopied = function () {
          swatch.classList.add('is-copied');
          window.clearTimeout(swatch._copyTimeout);
          swatch._copyTimeout = window.setTimeout(function () {
            swatch.classList.remove('is-copied');
          }, 1400);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(hex).then(markCopied).catch(markCopied);
        } else {
          markCopied();
        }
      });
    });
  }
})();
