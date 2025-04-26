/* -------------------------CREAR USUARIOS--------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    const boton_crear_usuario = document.querySelector('.boton_crear_usuario');
    const modal_crear_usuarios = document.querySelector('.modal_crear_usuarios');
    const boton_cerrar_crear_usuarios = document.querySelector('.boton_cerrar_crear_usuarios');


/* ----------------------------ACTUALIZAR USUARIOS-------------------------------------------------------- */

    let modal_actualizar_usuario = document.querySelector('.modal_actualizar_usuario')
    let boton_cerrar_modal_actualizar = document.getElementById("boton_cerrar_actualizar_usuario")
    let idetificacion_actualizar = document.getElementById("identificacion_usuario_editar")
    let boton_actualizar_usuario = document.querySelectorAll('.abrir_modal_actualizar_usuario')




    boton_actualizar_usuario.forEach((actualizar_boton) => {
        actualizar_boton.addEventListener("click", function () {
            // Obtenemos el ID del producto desde el atributo data-id

            let id_actualizar = this.getAttribute("data-id");
            

            // Insertamos el ID en el input del modal
            idetificacion_actualizar.value = id_actualizar;

            // Mostramos el modal
            modal_actualizar_usuario.classList.add('mostrar_modal_actualizar_usuario');
        });

        boton_cerrar_modal_actualizar.addEventListener('click',(e)=>{
            e.preventDefault();
            modal_actualizar_usuario.classList.remove('mostrar_modal_actualizar_usuario');

        })
    });

    /* --------------------------------------Eliminar usuarios----------------------------------------- */

    let modal_eliminar_usuario = document.querySelector('.modal_eliminar_usuario')
    let boton_rechazar_usuario = document.querySelector('.boton_rechazar_eliminar_usuario')
    let idetificacion_eliminar = document.getElementById('identificacion_eliminar')
    let boton_eliminar_usuario = document.querySelectorAll('.abrir_modal_eliminar_usuario')



    boton_eliminar_usuario.forEach((eliminar_boton) => {
        eliminar_boton.addEventListener("click", function () {
            // Obtenemos el ID del producto desde el atributo data-id

            let id_eliminar = this.getAttribute("data-id");
            

            // Insertamos el ID en el input del modal
            idetificacion_eliminar.value = id_eliminar;

            // Mostramos el modal
            modal_eliminar_usuario.classList.add('mostrar_eliminar_usuario');
        });

        boton_rechazar_usuario.addEventListener('click',(e)=>{
            e.preventDefault();
            modal_eliminar_usuario.classList.remove('mostrar_eliminar_usuario');

        })
    });

    /* --------------------------- Alerta Incorrecta ---------------------------------------------------- */
    const modal_agregar_incorrecto = document.querySelector('.modal_agregar_incorrecto');
    const mensaje_incorrecto = document.getElementById("mensaje_agregar_incorrecto");
    const boton_agregar_incorrecto = document.querySelector('.boton_agregar_incorrecto');

    /* -------------------------- Alerta Exitosa -------------------------------------------------------- */
    const modal_agregar_correcto = document.querySelector('.modal_agregar_correcto');
    const mensaje_correcto = document.getElementById("mensaje_agregar_correcto");
    const boton_agregar_correcto = document.querySelector('.boton_agregar_correcto');

    // Limpiar los parámetros de la URL si hay un mensaje de éxito o error
    if (window.location.search.includes('exito') || window.location.search.includes('error')) {
        history.pushState(null, null, window.location.pathname); 
    }

    // Cerrar alerta exitosa
    if (boton_agregar_correcto && modal_agregar_correcto) {
        boton_agregar_correcto.addEventListener('click', (e) => {
            e.preventDefault();
            modal_agregar_correcto.classList.add('oculto_correcto');
        });
    }

    // Cerrar alerta incorrecta
    if (boton_agregar_incorrecto && modal_agregar_incorrecto) {
        boton_agregar_incorrecto.addEventListener('click', (e) => {
            e.preventDefault();
            modal_agregar_incorrecto.classList.add('oculto_incorrecto');
        });
    }

    // Abrir modal de crear usuario
    if (boton_crear_usuario && modal_crear_usuarios) {
        boton_crear_usuario.addEventListener('click', (e) => {
            e.preventDefault();
            modal_crear_usuarios.classList.add('mostrar_modal_crear_usuario');
        });
    }

    // Cerrar modal de crear usuario
    if (boton_cerrar_crear_usuarios && modal_crear_usuarios) {
        boton_cerrar_crear_usuarios.addEventListener('click', (e) => {
            e.preventDefault();
            modal_crear_usuarios.classList.remove('mostrar_modal_crear_usuario');
        });

        boton_cerrar_modal_actualizar.addEventListener('click', (e) => {
            e.preventDefault();
            modal_actualizar.classList.remove('mostrar_modal_actualizar');
    
    
    });
    }

    document.getElementById("formulario_crear_usuarios").addEventListener("submit", (e)=>{
        e.preventDefault();
        crear_usuarios()
    })

    function crear_usuarios() {
        const nombre = document.getElementById("nombre_crear_usuarios").value;
        const correo = document.getElementById("correo_crear_usuarios").value;
        const contasena = document.getElementById("contraseña_crear_usuarios").value;
        const rol = document.getElementById("rol_usuario").value;
    
        fetch('/crear_usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombre,
                correo: correo,
                contrasena: contasena,
                rol: rol
            })
        })
        .then(response => response.json())
        .then(datos_crear => {
            if (datos_crear.exito) {
                modal_crear_usuarios.classList.remove('mostrar_modal_crear_usuario');
                mensaje_correcto.textContent = datos_crear.exito;
                modal_agregar_correcto.classList.add('oculto_correcto');
    
                boton_agregar_correcto.addEventListener('click', (e) => {
                    e.preventDefault();
                    modal_agregar_correcto.classList.add('oculto_correcto');
                    window.location.href = '/Usuarios';
                });
            }
            else if (datos_crear.correo_existente) {
                mensaje_incorrecto.textContent = datos_crear.correo_existente;
                modal_agregar_incorrecto.classList.add('oculto_incorrecto');
    
                boton_agregar_incorrecto.addEventListener('click', (e) => {
                    e.preventDefault();
                    modal_crear_usuarios.classList.remove('mostrar_modal_crear_usuario');
                    modal_agregar_incorrecto.classList.remove('oculto_incorrecto');
                    
                });
            }
        })
        .catch(error => console.error("Error al crear los usuarios:", error));
    }

    document.getElementById("formulario_eliminar_usuarios").addEventListener("submit", (e)=>{
        e.preventDefault();
        eliminar_usuarios()
    })

    function eliminar_usuarios(){
        const idetificacion_eliminar = document.getElementById('identificacion_eliminar').value;

        fetch('/eliminar_usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idetificacion: idetificacion_eliminar
            })
        })
        .then(response => response.json())
        .then(datos_eliminar => { 
            if (datos_eliminar.exito) {
                modal_eliminar_usuario.classList.remove('mostrar_eliminar_usuario');
                mensaje_correcto.textContent = datos_eliminar.exito;
                modal_agregar_correcto.classList.add('oculto_correcto');
    
                boton_agregar_correcto.addEventListener('click', (e) => {
                    e.preventDefault();
                    modal_agregar_correcto.classList.add('oculto_correcto');
                    window.location.href = '/Usuarios';
                });
            }
    
        })
        .catch(error => console.error("Error al eliminar los usuarios:", error));
    }

    document.getElementById("formulario_actualizar_usuario").addEventListener("submit", (e)=>{
        e.preventDefault();
        actualizar_usuarios()
    })

    function actualizar_usuarios(){
        const idetificacion_actualizar = document.getElementById("identificacion_usuario_editar").value;
        const contasena_nueva = document.getElementById("contraseña_nueva").value;
        const contasena_anterior = document.getElementById("contraseña_anterior").value;

        fetch('/actualizar_usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idetificacion: idetificacion_actualizar,
                contrasena_nueva: contasena_nueva,
                contrasena_anterior: contasena_anterior 
            })
        })
        .then(response => response.json())
        .then(datos_actualizar => { 
            if (datos_actualizar.exito) {
                modal_actualizar_usuario.classList.remove('mostrar_modal_actualizar_usuario');
                mensaje_correcto.textContent = datos_actualizar.exito;
                modal_agregar_correcto.classList.add('oculto_correcto');
                
                
    
                boton_agregar_correcto.addEventListener('click', (e) => {
                    e.preventDefault();
                    modal_agregar_correcto.classList.add('oculto_correcto');
                    window.location.href = '/Usuarios';
                });
            }
            else if (datos_actualizar.contraseña_incorrecta) {
                mensaje_incorrecto.textContent = datos_actualizar.contraseña_incorrecta;
                modal_agregar_incorrecto.classList.add('oculto_incorrecto');
    
                boton_agregar_incorrecto.addEventListener('click', (e) => {
                    e.preventDefault();
                    modal_agregar_incorrecto.classList.remove('oculto_incorrecto');
                });
            }
    
        })
        .catch(error => console.error("Error al actualizar los usuarios:", error));
    }
    

})
