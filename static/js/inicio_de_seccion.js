document.addEventListener('DOMContentLoaded', function () { 

    document.getElementById("inicio_seccion").addEventListener("submit", function(event) {
        event.preventDefault(); // Evita que el formulario se envíe normalmente
        
        let usuario = document.getElementById("usuario").value;
        let contrasena = document.getElementById("contrasena").value;
        const mensaje = document.getElementById("mensaje-error");

        

    fetch('/inicio_seccion', {  // Asegúrate de usar la misma ruta en Flask
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: usuario, contrasena: contrasena }),
    })
    .then(response => response.json())
    .then(datos => {
        if (datos.exito) {
            window.location.href = "/home";  // Redirige si el login es exitoso
        } else if (datos.inyesion) {
            mensaje.textContent = datos.inyesion;  // Mensaje de intento de inyección SQL
            mensaje.style.display = "block";
        } else if (datos.error) {
            mensaje.textContent = datos.error;  // Muestra otros errores
            mensaje.style.display = "block";
        }
    })
    .catch(error => console.error("Error en la solicitud:", error));
});

});