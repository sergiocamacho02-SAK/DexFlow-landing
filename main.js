document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('leadForm');
    const success = document.getElementById('success');

    // Smooth Scroll al formulario
    document.querySelector('.btn--primary').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('#register').scrollIntoView({ behavior: 'smooth' });
    });

    // Validación y Feedback Visual
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputs = form.querySelectorAll('input[required]');
        let valid = true;

        inputs.forEach(i => {
            if (i.type === 'checkbox') {
                if (!i.checked) {
                    valid = false;
                    i.nextElementSibling.style.color = '#B5179E'; // Morado error
                } else {
                    i.nextElementSibling.style.color = '#A0ABC0';
                }
            } else {
                if (i.value.trim() === '') {
                    valid = false;
                    i.style.borderColor = '#B5179E';
                } else {
                    i.style.borderColor = 'rgba(255,255,255,0.1)';
                }
            }
        });

        if (valid) {
            form.classList.add('hidden');
            success.classList.remove('hidden');
        }
    });
});