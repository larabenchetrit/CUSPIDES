// ============================================
// SECTION 10 — CTA FINAL (formulario "#MÉTODOCÚSPIDES")
//
// El formulario valida los 4 campos (nombre, correo, teléfono, edad) en
// el cliente y, si todo está OK, arma un mailto: con los datos cargados
// y le pide al navegador que lo abra — así se abre el programa de correo
// del usuario con un mail ya redactado a Cúspides, sin necesitar ningún
// backend ni servicio externo.
//
// El campo de edad es un dropdown tipo listbox (no un <select> nativo):
// al clickear el casillero se despliegan rangos de edad para elegir;
// también funciona con teclado (flechas + Enter/Espacio, Escape cierra).
// El valor elegido se guarda en un input oculto (#startEdad) que es el
// que realmente viaja en el mailto.
//
// OJO: reemplazar CONTACT_EMAIL de abajo por la casilla real de Cúspides
// antes de publicar. Es un placeholder.
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const CONTACT_EMAIL = 'contacto@cuspides.com';

  const form = document.getElementById('startForm');
  const msg = document.getElementById('startFormMsg');

  if (!form || !msg) {
    console.warn('[final-cta] Falta el formulario #startForm en el DOM.');
    return;
  }

  const fields = {
    nombre: document.getElementById('startNombre'),
    email: document.getElementById('startEmail'),
    telefono: document.getElementById('startTelefono'),
    edad: document.getElementById('startEdad'),
  };

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Acepta números de teléfono con dígitos, espacios, guiones, paréntesis
  // y un "+" opcional al inicio; exige al menos 6 dígitos en total.
  const PHONE_RE = /^\+?[\d\s().-]{6,}$/;

  function digitCount(str) {
    const m = str.match(/\d/g);
    return m ? m.length : 0;
  }

  function validators() {
    return {
      nombre: (v) => v.trim().length >= 2,
      email: (v) => EMAIL_RE.test(v.trim()),
      telefono: (v) => PHONE_RE.test(v.trim()) && digitCount(v) >= 6,
      // Ya no es un número puntual: es un rango elegido en el dropdown.
      edad: (v) => v.trim() !== '',
    };
  }

  // Para el input oculto de edad, la marca visual (borde rojo/ok) tiene
  // que caer sobre el botón visible (.final-cta__select-trigger), no
  // sobre el input escondido.
  function visualTarget(input) {
    if (input.type === 'hidden') {
      const field = input.closest('.final-cta__field');
      return field ? field.querySelector('.final-cta__select-trigger') : input;
    }
    return input;
  }

  function markValid(input) {
    visualTarget(input).classList.remove('is-invalid');
  }

  function markInvalid(input) {
    visualTarget(input).classList.add('is-invalid');
  }

  // Al corregir un campo marcado inválido, sacamos la marca al toque
  // (no hace falta esperar a un nuevo submit para dar el "ok" visual).
  Object.entries(fields).forEach(([key, input]) => {
    if (!input) return;
    input.addEventListener('input', function () {
      if (validators()[key](input.value)) markValid(input);
    });
  });

  // --- Selector de rango de edad (dropdown tipo listbox) ---
  const edadField = document.getElementById('startEdadField');
  const edadTrigger = document.getElementById('startEdadTrigger');
  const edadValueLabel = document.getElementById('startEdadValue');
  const edadList = document.getElementById('startEdadList');
  const edadHidden = document.getElementById('startEdad');
  const edadOptions = edadList ? Array.from(edadList.querySelectorAll('.final-cta__select-option')) : [];

  function moveActive(delta) {
    const currentIndex = edadOptions.findIndex((opt) => opt.classList.contains('is-active'));
    const nextIndex = Math.min(Math.max(currentIndex + delta, 0), edadOptions.length - 1);
    edadOptions.forEach((opt, i) => opt.classList.toggle('is-active', i === nextIndex));
    edadOptions[nextIndex].scrollIntoView({ block: 'nearest' });
  }

  function closeEdadList() {
    if (!edadList) return;
    edadList.hidden = true;
    edadTrigger.setAttribute('aria-expanded', 'false');
  }

  function openEdadList() {
    if (!edadList) return;
    edadList.hidden = false;
    edadTrigger.setAttribute('aria-expanded', 'true');
    const active = edadOptions.find((opt) => opt.dataset.value === edadHidden.value) || edadOptions[0];
    edadOptions.forEach((opt) => opt.classList.toggle('is-active', opt === active));
    if (active) active.scrollIntoView({ block: 'nearest' });
  }

  function selectEdadOption(option) {
    if (!option) return;
    edadHidden.value = option.dataset.value;
    edadValueLabel.textContent = option.textContent;
    edadField.classList.add('has-value');
    markValid(edadHidden);
    closeEdadList();
    edadTrigger.focus();
  }

  if (edadTrigger && edadList) {
    edadTrigger.addEventListener('click', function () {
      const isOpen = edadTrigger.getAttribute('aria-expanded') === 'true';
      isOpen ? closeEdadList() : openEdadList();
    });

    edadOptions.forEach((option) => {
      option.addEventListener('click', function () {
        selectEdadOption(option);
      });
    });

    edadTrigger.addEventListener('keydown', function (e) {
      const isOpen = edadTrigger.getAttribute('aria-expanded') === 'true';
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        isOpen ? moveActive(1) : openEdadList();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        isOpen ? moveActive(-1) : openEdadList();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!isOpen) { openEdadList(); return; }
        selectEdadOption(edadOptions.find((opt) => opt.classList.contains('is-active')));
      } else if (e.key === 'Escape') {
        closeEdadList();
      }
    });

    document.addEventListener('click', function (e) {
      if (!edadField.contains(e.target)) closeEdadList();
    });
  }

  function buildMailto(data) {
    const subject = '#MétodoCúspides — Nueva consulta desde la web';
    const bodyLines = [
      `Nombre y Apellido: ${data.nombre}`,
      `Correo electrónico: ${data.email}`,
      `Número de teléfono: ${data.telefono}`,
      `Edad: ${data.edad}`,
    ];
    const body = bodyLines.join('\n');
    return (
      'mailto:' +
      encodeURIComponent(CONTACT_EMAIL) +
      '?subject=' +
      encodeURIComponent(subject) +
      '&body=' +
      encodeURIComponent(body)
    );
  }

  function showMessage(text, isError) {
    msg.textContent = text;
    msg.classList.toggle('is-error', !!isError);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const checks = validators();
    let firstInvalid = null;
    let allValid = true;

    Object.entries(fields).forEach(([key, input]) => {
      if (!input) return;
      const valid = checks[key](input.value);
      if (valid) {
        markValid(input);
      } else {
        markInvalid(input);
        allValid = false;
        if (!firstInvalid) firstInvalid = visualTarget(input);
      }
    });

    if (!allValid) {
      showMessage('Revisá los datos marcados: falta completarlos o el formato no es correcto.', true);
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const data = {
      nombre: fields.nombre.value.trim(),
      email: fields.email.value.trim(),
      telefono: fields.telefono.value.trim(),
      edad: fields.edad.value.trim(),
    };

    window.location.href = buildMailto(data);
    showMessage('Se abrió tu programa de correo con los datos cargados — solo falta que le des enviar ahí.', false);
    form.reset();

    // El form.reset() nativo no toca el label ni la clase del dropdown
    // de edad (son contenido puesto a mano por JS), así que se resetean
    // aparte.
    if (edadValueLabel) edadValueLabel.textContent = 'Edad';
    if (edadField) edadField.classList.remove('has-value');
  });
});