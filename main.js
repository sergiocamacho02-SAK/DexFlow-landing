document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    /* ==========================================================================
       1. SMOOTH SCROLL (Tu código original conservado)
       ========================================================================== */
    const btnPrimary = document.querySelector('.btn--primary');
    if (btnPrimary) {
        btnPrimary.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('#register').scrollIntoView({ behavior: 'smooth' });
        });
    }

    /* ==========================================================================
       2. LÓGICA DE VALIDACIÓN PROFESIONAL DEXFLOW
       ========================================================================== */
    var form = document.getElementById('leadForm');
    var successEl = document.getElementById('success');

    if (!form) return;

    var nombreInput = document.getElementById('name');
    var occInput = document.getElementById('occupation');
    var emailInput = document.getElementById('email');
    var netSelect = document.getElementById('net');
    var consentInput = document.getElementById('consent');

    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function getErrorEl(field) {
        return form.querySelector('.error-msg[data-field="' + field + '"]');
    }

    function clearFieldError(control, field) {
        if (control) control.classList.remove('input-error');
        var msg = getErrorEl(field);
        if (msg) {
            msg.classList.add('hidden');
            msg.textContent = '';
        }
    }

    function showFieldError(control, field, message) {
        if (control) control.classList.add('input-error');
        var msg = getErrorEl(field);
        if (msg) {
            msg.textContent = message;
            msg.classList.remove('hidden');
        }
    }

    function clearAllErrors() {
        clearFieldError(nombreInput, 'name');
        clearFieldError(occInput, 'occupation');
        clearFieldError(emailInput, 'email');
        clearFieldError(netSelect, 'net');
        clearFieldError(consentInput, 'consent');
    }

    function validateNombre() {
        var value = (nombreInput.value || '').trim();
        if (value.length === 0) {
            showFieldError(nombreInput, 'name', 'El nombre es obligatorio');
            return false;
        }
        clearFieldError(nombreInput, 'name');
        return true;
    }

    function validateOccupation() {
        var value = (occInput.value || '').trim();
        if (value.length === 0) {
            showFieldError(occInput, 'occupation', 'El perfil es obligatorio');
            return false;
        }
        clearFieldError(occInput, 'occupation');
        return true;
    }

    function validateEmail() {
        var value = (emailInput.value || '').trim();
        if (value.length === 0) {
            showFieldError(emailInput, 'email', 'El correo es obligatorio');
            return false;
        }
        if (!EMAIL_PATTERN.test(value)) {
            showFieldError(emailInput, 'email', 'Ingresa un correo válido');
            return false;
        }
        clearFieldError(emailInput, 'email');
        return true;
    }

    function validateNet() {
        var value = netSelect.value;
        if (!value || value === '') {
            showFieldError(netSelect, 'net', 'Selecciona tu nivel');
            return false;
        }
        clearFieldError(netSelect, 'net');
        return true;
    }

    function validateConsent() {
        if (!consentInput.checked) {
            showFieldError(consentInput, 'consent', 'Debes aceptar las condiciones');
            return false;
        }
        clearFieldError(consentInput, 'consent');
        return true;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (successEl) successEl.classList.add('hidden');

        var okNombre = validateNombre();
        var okOcc = validateOccupation();
        var okEmail = validateEmail();
        var okNet = validateNet();
        var okConsent = validateConsent();

        if (!okNombre || !okOcc || !okEmail || !okNet || !okConsent) {
            return;
        }

        // Si todo está correcto
        console.log('Lead registrado en DexFlow');
        form.reset();
        clearAllErrors();

        // Ocultar formulario y mostrar éxito
        form.classList.add('hidden');
        if (successEl) {
            successEl.classList.remove('hidden');
        }
    });

    // Validación en tiempo real al escribir
    function errorVisible(field) {
        var el = getErrorEl(field);
        return el && !el.classList.contains('hidden');
    }

    nombreInput.addEventListener('input', function () { if (errorVisible('name')) validateNombre(); });
    occInput.addEventListener('input', function () { if (errorVisible('occupation')) validateOccupation(); });
    emailInput.addEventListener('input', function () { if (errorVisible('email')) validateEmail(); });
    netSelect.addEventListener('change', function () { if (errorVisible('net')) validateNet(); });
    consentInput.addEventListener('change', function () { if (errorVisible('consent')) validateConsent(); });

    /* ==========================================================================
       3. PERSISTENCIA CON LOCALSTORAGE (Commit 7)
       ========================================================================== */

    // Función para guardar cuando el usuario escribe
    function autoSave() {
        localStorage.setItem('dexflow_name', nombreInput.value);
        localStorage.setItem('dexflow_occ', occInput.value);
        localStorage.setItem('dexflow_email', emailInput.value);
    }

    // Cargar datos al abrir la página
    if (localStorage.getItem('dexflow_name')) nombreInput.value = localStorage.getItem('dexflow_name');
    if (localStorage.getItem('dexflow_occ')) occInput.value = localStorage.getItem('dexflow_occ');
    if (localStorage.getItem('dexflow_email')) emailInput.value = localStorage.getItem('dexflow_email');

    // Escuchar cambios para guardar automáticamente
    nombreInput.addEventListener('input', autoSave);
    occInput.addEventListener('input', autoSave);
    emailInput.addEventListener('input', autoSave);

    // Limpiar localStorage al enviar el formulario exitosamente
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        
        // 1. Desactivar botón y cambiar texto
        var submitBtn = form.querySelector('.btn--submit');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Procesando...';

        if (successEl) successEl.classList.add('hidden');

        var okNombre = validateNombre();
        var okOcc = validateOccupation();
        var okEmail = validateEmail();
        var okNet = validateNet();
        var okConsent = validateConsent();

        if (!okNombre || !okOcc || !okEmail || !okNet || !okConsent) {
            // Si hay error, reactivar botón inmediatamente
            submitBtn.disabled = false;
            submitBtn.textContent = 'Quiero mi Acceso Beta';
            return;
        }

        // Simulación de envío exitoso
        //console.log('Lead registrado en DexFlow');
        
        // Finalización
        form.reset();
        clearAllErrors();
        form.classList.add('hidden');
        if (successEl) successEl.classList.remove('hidden');
    });

});
