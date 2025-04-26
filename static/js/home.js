history.pushState(null, "", location.href);
window.onpopstate = function () {
    history.pushState(null, "", location.href);
};

    async function cargarTotalVendido() {
        try {
            const respuesta = await fetch('/total-hoy');
            const datos = await respuesta.json();

            if (respuesta.ok && datos.ok !== undefined) {
                document.getElementById('total-vendido').innerText = `el total vendido hoy es $${datos.ok}`;
            } else {
                document.getElementById('total-vendido').innerText = 'Error al cargar total';
                console.error(datos);
            }
        } catch (error) {
            document.getElementById('total-vendido').innerText = 'Error de conexión';
            console.error(error);
        }
    }

    window.onload = cargarTotalVendido;
    setInterval(cargarTotalVendido, 60000); // Refresca cada minuto


