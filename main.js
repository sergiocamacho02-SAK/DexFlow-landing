// ==========================================================================
// 1. CONFIGURACIÓN E INICIALIZACIÓN DE FIREBASE
// ==========================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAFvzr-JaYuFrrlbipgLvtGw3dKnzSSNrw",
    authDomain: "dexflow-2fa4a.firebaseapp.com",
    projectId: "dexflow-2fa4a",
    storageBucket: "dexflow-2fa4a.firebasestorage.app",
    messagingSenderId: "855597653867",
    appId: "1:855597653867:web:2208ef294208ef0821762e"
};

// Inicializamos Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 

// ==========================================================================
// 2. LÓGICA DEL DOM Y FUNCIONALIDAD DE LA PÁGINA
// ==========================================================================
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    /* --- SMOOTH SCROLL --- */
    const btnPrimary = document.querySelector('.btn--primary');
    if (btnPrimary) {
        btnPrimary.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('#register').scrollIntoView({ behavior: 'smooth' });
        });
    }

    /* --- VARIABLES DEL FORMULARIO --- */
    var form = document.getElementById('leadForm');
    var successEl = document.getElementById('success');

    if (!form) return;

    var nombreInput = document.getElementById('name');
    var occInput = document.getElementById('occupation');
    var emailInput = document.getElementById('email');
    var netSelect = document.getElementById('net');
    var consentInput = document.getElementById('consent');

    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    /* --- FUNCIONES AUXILIARES DE ERROR --- */
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

    /* --- FUNCIONES DE VALIDACIÓN --- */
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

    /* --- VALIDACIÓN EN TIEMPO REAL --- */
    function errorVisible(field) {
        var el = getErrorEl(field);
        return el && !el.classList.contains('hidden');
    }

    nombreInput.addEventListener('input', function () { if (errorVisible('name')) validateNombre(); });
    occInput.addEventListener('input', function () { if (errorVisible('occupation')) validateOccupation(); });
    emailInput.addEventListener('input', function () { if (errorVisible('email')) validateEmail(); });
    netSelect.addEventListener('change', function () { if (errorVisible('net')) validateNet(); });
    consentInput.addEventListener('change', function () { if (errorVisible('consent')) validateConsent(); });

    /* --- PERSISTENCIA CON LOCALSTORAGE --- */
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

    // ==========================================================================
    // 3. ENVÍO MAESTRO A FIREBASE
    // ==========================================================================
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        // 1. Estado "Cargando" del botón
        var submitBtn = form.querySelector('.btn--submit');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Procesando...';

        if (successEl) successEl.classList.add('hidden');

        // 2. Validar todos los campos
        var okNombre = validateNombre();
        var okOcc = validateOccupation();
        var okEmail = validateEmail();
        var okNet = validateNet();
        var okConsent = validateConsent();

        if (!okNombre || !okOcc || !okEmail || !okNet || !okConsent) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Quiero mi Acceso Beta';
            return;
        }

        // 3. Conexión con Firebase
        try {
            await addDoc(collection(db, "leads"), {
                nombre: nombreInput.value,
                ocupacion: occInput.value,
                email: emailInput.value,
                nivel_capital: netSelect.value,
                fecha_registro: new Date()
            });

            // 4. Acciones si todo sale bien
            localStorage.clear(); 
            form.reset(); 
            clearAllErrors();
            
            form.classList.add('hidden');
            if (successEl) successEl.classList.remove('hidden');

        } catch (error) {
            console.error("Error guardando en base de datos:", error);
            alert("Hubo un error al procesar tu solicitud. Intenta de nuevo.");
            submitBtn.disabled = false;
            submitBtn.textContent = 'Quiero mi Acceso Beta';
        }
    });
});