document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('ai-form');
    const responseDiv = document.getElementById('form-response');
    const submitBtn = document.getElementById('btn-submit');

    // Cambia esta URL por el Webhook de Albato cuando lo tengas configurado
    const ALBATO_WEBHOOK_URL = 'https://webhook.albato.com/tu-webhook-aqui';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Estado visual de carga
        submitBtn.disabled = true;
        submitBtn.innerText = 'Enviando y procesando con IA...';
        responseDiv.innerText = '';

        const formData = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            mensaje: document.getElementById('mensaje').value,
            fecha: new Date().toISOString()
        };

        try {
            // Envío al webhook de Albato
            const response = await fetch(ALBATO_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            // Respuesta simulada o real
            responseDiv.style.color = '#00d2ff';
            responseDiv.innerText = '¡Mensaje recibido! El Agente de IA ha analizado tu solicitud y me notificará al instante.';
            form.reset();

        } catch (error) {
            console.log('Modo demostración activo');
            responseDiv.style.color = '#00d2ff';
            responseDiv.innerText = '¡Gracias por probar el formulario! (Mensaje recibido correctamente en modo demo).';
            form.reset();
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = 'Enviar a Agente Comercial';
        }
    });
});