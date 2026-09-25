document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('ai-form');
    const responseDiv = document.getElementById('form-response');
    const submitBtn = document.getElementById('btn-submit');

    // Webhook de MAKE (Es público y seguro de tener aquí)
    const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/278hs863s66wynlk6rx6wsmgg936tcpj';

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Lectura del campo Honeypot (Anti-bots)
        const honeypotField = document.getElementById('honeypot');
        const honeypotValue = honeypotField ? honeypotField.value : '';

        // NUEVO: Lectura del token de Cloudflare Turnstile
        const turnstileField = document.querySelector('[name="cf-turnstile-response"]');
        const turnstileToken = turnstileField ? turnstileField.value : '';

        // NUEVO: Si no se completó el captcha, no dejar enviar
        if (!turnstileToken) {
            responseDiv.style.color = '#ff6b6b';
            responseDiv.innerText = 'Por favor completa la verificación de seguridad.';
            return;
        }

        // 2. Estado visual de carga y bloqueo anti-doble clic
        submitBtn.disabled = true;
        submitBtn.innerText = 'Enviando y procesando con IA...';
        responseDiv.innerText = '';

        // 3. Captura de datos
        const formData = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            mensaje: document.getElementById('mensaje').value,
            website: honeypotValue, // Campo trampa para Make
            turnstileToken: turnstileToken, // NUEVO: token para validar en Make
            fecha: new Date().toISOString()
        };

        try {
            // 4. Envío al webhook de MAKE
            await fetch(MAKE_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            // 5. Mensaje de éxito
            responseDiv.style.color = '#00d2ff';
            responseDiv.innerText = '¡Solicitud recibida! El Agente de IA está procesando el envío de mi CV a tu correo.';
            form.reset();
            if (window.turnstile) window.turnstile.reset(); // NUEVO: resetea el widget para el próximo envío

        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            responseDiv.style.color = '#ff6b6b';
            responseDiv.innerText = 'Hubo un problema al procesar la solicitud. Por favor, intenta nuevamente más tarde.';
        } finally {
            // 6. Cooldown de seguridad: mantiene el botón deshabilitado 15 segundos antes de reactivarlo
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = 'Recibir CV en mi correo';
            }, 15000);
        }
    });
});
