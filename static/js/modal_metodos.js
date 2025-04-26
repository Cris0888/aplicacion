document.addEventListener('DOMContentLoaded', (event) => {
    const boton_crear = document.querySelector('.boton_crear');
    const modal_crear = document.querySelector('.modal_metodo');
    const boton_cerrar_crear = document.querySelector('.boton_cerrar');

    boton_crear.addEventListener('click', (e) => {
        e.preventDefault();
        modal_crear.classList.add('mostrar_modal_crear');
    });

    boton_cerrar_crear.addEventListener('click', (e) => {
        e.preventDefault();
        modal_crear.classList.remove('mostrar_modal_crear');
    });

    /* ---------------------modal eliminar metodo------------------------------------------ */
    let boton_eliminar_metodo = document.querySelectorAll('.abrir_modal_eliminar_metodo');
    let modal_eliminar_metodo = document.querySelector('.modal_eliminar_metodos');
    let boton_rechazar_eliminar_metodo = document.querySelector('.boton_rechazar_eliminar_metodos');
    let identificacion_eliminar_metodo = document.getElementById('identificacion_eliminar_metodos');

    boton_eliminar_metodo.forEach((boton_eliminar) => {
        boton_eliminar.addEventListener('click', function (){
            let id_eliminar = this.getAttribute("data-id");

            identificacion_eliminar_metodo.value = id_eliminar ;
            
            modal_eliminar_metodo.classList.add('mostrar_eliminar_metodos')
        });
    });
    boton_rechazar_eliminar_metodo.addEventListener('click',(e)=>{
        e.preventDefault();
        modal_eliminar_metodo.classList.remove('mostrar_eliminar_metodos')

        
    })

    /* ---------------------------------alerta incorrecta---------------------------------------------- */
    let alerta_incorrecta_metodos = document.querySelector('.modal_agregar_incorrecto');
    let mensaje_incorrecto_metodos = document.getElementById("mensaje_agregar_incorrecto");
    let boton_alerta_incorrecta_metodos = document.querySelector('.boton_agregar_incorrecto');

    if (alerta_incorrecta_metodos && boton_alerta_incorrecta_metodos) {
        boton_alerta_incorrecta_metodos.addEventListener('click', (e) => {
            e.preventDefault();
            alerta_incorrecta_metodos.classList.add('mostrar_metodo_incorrecto');
            window.location.href = "/metodos"
        });
    }


    /*---------------------------------- alerta correcta------------------------------------------------------------------------------- */
    let alerta_correcta_metodos = document.querySelector('.modal_agregar_correcto');
    let mensaje_correcto_metodos = document.getElementById("mensaje_agregar_correcto");
    let boton_alerta_correcta_metodos = document.querySelector('.boton_agregar_correcto');

    if (alerta_correcta_metodos && boton_alerta_correcta_metodos) {
        boton_alerta_correcta_metodos.addEventListener('click', (e) => {
            e.preventDefault();
            alerta_correcta_metodos.classList.add('mostrar_metodo_correcto');
            window.location.href = "/metodos"
        });
    }

    document.getElementById("formulario_crear_metodo").addEventListener("submit", (e) => {
        e.preventDefault(); 
        crear_metodo();
    })

    function crear_metodo() {

        const nombre= document.getElementById("nombre").value;

        fetch('/metodos/crear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre_metodo : nombre})
        })
        .then(response => response.json())
        .then(datos_crear => {
            if (datos_crear.exito) {
                // Mostrar alerta de éxito
                modal_crear.classList.remove('mostrar_modal_crear');
                mensaje_correcto_metodos.textContent = datos_crear.exito
                alerta_correcta_metodos.classList.add('mostrar_metodo_correcto');
                
                boton_alerta_correcta_metodos.addEventListener('click', (e) => {
                    e.preventDefault();
                    alerta_correcta_metodos.classList.remove('mostrar_metodo_correcto');
                    window.location.href = "/metodos"
                })

            } else if (datos_crear.existente) {
                
                mensaje_incorrecto_metodos.textContent = datos_crear.existente;
                alerta_incorrecta_metodos.classList.add('mostrar_metodo_incorrecto');
                

                boton_alerta_incorrecta_metodos.addEventListener('click', (e) => {
                    e.preventDefault();
                    alerta_incorrecta_metodos.classList.remove('mostrar_metodo_incorrecto');
                })
            }
        })
        .catch(error => console.error('Error:', error));
    }




    document.getElementById("formulario_eliminar_metodo").addEventListener("submit", (e) => {
        e.preventDefault(); 
        eliminar_metodo();
    })

    function eliminar_metodo() {

        const id_metodo= document.getElementById("identificacion_eliminar_metodos").value;

        fetch('/metodos/eliminar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_metodo : id_metodo})
        })
        .then(response => response.json())
        .then(datos_eliminar => {
            if (datos_eliminar.exito) {
                // Mostrar alerta de éxito
                modal_eliminar_metodo.classList.remove('mostrar_eliminar_metodos');
                mensaje_correcto_metodos.textContent = datos_eliminar.exito
                alerta_correcta_metodos.classList.add('mostrar_metodo_correcto');
                
                boton_alerta_correcta_metodos.addEventListener('click', (e) => {
                    e.preventDefault();
                    alerta_correcta_metodos.classList.remove('mostrar_metodo_correcto');
                    window.location.href = "/metodos"
                })

            } else if (datos_eliminar.metodo_incorrecto) {
                
                mensaje_incorrecto_metodos.textContent = datos_eliminar.metodo_incorrecto;
                alerta_incorrecta_metodos.classList.add('mostrar_metodo_incorrecto');
                

                boton_alerta_incorrecta_metodos.addEventListener('click', (e) => {
                    e.preventDefault();
                    alerta_incorrecta_metodos.classList.remove('mostrar_metodo_incorrecto');
                })
            }
        })
        .catch(error => console.error('Error:', error));
    }

});


