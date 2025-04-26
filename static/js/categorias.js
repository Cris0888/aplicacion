/* --------------------------modal actualizar-------------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    let boton_actualizar = document.querySelectorAll('.abrir_modal_actualizar');
    let modal_actualizar = document.querySelector('.modal_actualizar');
    let boton_cerrar_actualizar = document.querySelector('.boton_cerrar_actualizar');
    let identificacion_actualizar = document.getElementById('identificacion_actualizar');
    document.getElementById("nombre_categorias").addEventListener("input", buscar_categoria);
    
        // Recorremos todos los botones y les asignamos eventos
        boton_actualizar.forEach((actualizar_boton) => {
            actualizar_boton.addEventListener("click", function () {
                // Obtenemos el ID del producto desde el atributo data-id

                let id_actualizar = this.getAttribute("data-id");
                
    
                // Insertamos el ID en el input del modal
                identificacion_actualizar.value = id_actualizar;
    
                // Mostramos el modal
                modal_actualizar.classList.add('mostrar_modal_actualizar');
            });
        });
    
        // Cerrar el modal al hacer clic en el botón de cerrar
        boton_cerrar_actualizar.addEventListener('click', (e) => {
            e.preventDefault();
            modal_actualizar.classList.remove('mostrar_modal_actualizar');
        });
    
    



    /* -------------------------- Modal Agregar --------------------------------------------------------------------- */
    let boton_crear_categoria = document.querySelector('.boton_crear');
    let modal_crear = document.querySelector('.modal_crear');
    let cerrar_modal_crear = document.getElementById('boton_cerrar_crear');


     // Abrir modal para crear categoría
        boton_crear_categoria.addEventListener('click', (e) => {
            e.preventDefault();
        modal_crear.classList.add('mostrar_modal_crear');
    });

    // cerrar modal de crear categoria
        cerrar_modal_crear.addEventListener('click',(e)=>{
            e.preventDefault();
        modal_crear.classList.remove('mostrar_modal_crear')
    });





    /* --------------------------- Alerta de Categoría Incorrecta ---------------------------------------------------- */
    let modal_agregar_incorrecto = document.querySelector('.modal_agregar_incorrecto');
    let mensaje_agregar_incorrecto = document.getElementById('mensaje_agregar_incorrecto');
    let boton_agregar_incorrecto = document.querySelector('.boton_agregar_incorrecto');




    /* -------------------------- Alerta de Categoría Exitosa -------------------------------------------------------- */
    let modal_agregar_correcto = document.querySelector('.modal_agregar_correcto');
    let mensaje_agregar_correcto = document.getElementById('mensaje_agregar_correcto');
    let boton_agregar_correcto = document.querySelector('.boton_agregar_correcto');




    /* ---------------------------modal eliminar------------------------------------------------- */
    let boton_eliminar = document.querySelectorAll('.abrir_modal_eliminar');
    let modal_eliminar = document.querySelector('.modal_agregar_eliminar');
    let boton_rechazar_eliminar = document.querySelector('.boton_rechazar_eliminar');
    let identificacion_eliminar = document.getElementById('identificacion_eliminar');

    boton_eliminar.forEach((boton_eliminar) => {
        boton_eliminar.addEventListener('click', function (){
            let id_eliminar = this.getAttribute("data-id");

            identificacion_eliminar.value = id_eliminar ;
            
            modal_eliminar.classList.add('mostrar_agregar_eliminar')
        });
    });
    boton_rechazar_eliminar.addEventListener('click',(e)=>{
        e.preventDefault();
        modal_eliminar.classList.remove('mostrar_agregar_eliminar')
        
    })





    /* ---------------------------------funcionalidad de javascript--------------------------------------------------- */

    // Función para agregar categoría
    document.getElementById('formulario_crear').addEventListener("submit", function (e) {
        e.preventDefault();
        agregar();
    });

    
    function agregar() {

        const nombre = document.getElementById('input_crear').value.trim();
        
        fetch('/crear_categoria', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre: nombre }),
        })
        .then(response => response.json())
        .then(datos => {
            if (datos.exito) {
                // Mostrar mensaje de éxito
                modal_crear.classList.remove('mostrar_modal_crear')
                mensaje_agregar_correcto.textContent = datos.exito;
                modal_agregar_correcto.classList.add("mostrar_agregar_correcto");

                boton_agregar_correcto.addEventListener('click',(e)=>{
                    e.preventDefault();
                    modal_agregar_correcto.classList.remove("mostrar_agregar_correcto");
                    modal_crear.classList.remove('mostrar_modal_crear');
                    window.location.href = "/categorias";

                });
            } else if (datos.error) {
                // Mostrar mensaje de error
                mensaje_agregar_incorrecto.textContent = datos.error;
                modal_agregar_incorrecto.classList.add("mostrar_agregar_incorrecto");
                

                boton_agregar_incorrecto.addEventListener('click',(e)=>{
                    e.preventDefault();
                    modal_agregar_incorrecto.classList.remove('mostrar_agregar_incorrecto')
                });
            }
        })
        .catch(error => console.error("Error:", error));
    };

    document.getElementById('formulario_eliminar').addEventListener("submit", function (e) {
        e.preventDefault();
        eliminar();
    });

    function eliminar() {
        const identificacion = identificacion_eliminar.value.trim()
        fetch('/eliminar_categoria', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ identificacion : identificacion }),
        })
        .then(response => response.json())
        .then(datos_eliminar =>{
            if (datos_eliminar.exito) {
                modal_eliminar.classList.remove('mostrar_agregar_eliminar');
                mensaje_agregar_correcto.textContent = datos_eliminar.exito;
                modal_agregar_correcto.classList.add("mostrar_agregar_correcto");
                


                boton_agregar_correcto.addEventListener('click',(e)=>{
                    e.preventDefault();
                    modal_agregar_correcto.classList.remove("mostrar_agregar_correcto");
                    window.location.href = "/categorias";
                });
            } else if ( datos_eliminar.error_borrar){ 
                mensaje_agregar_incorrecto.textContent = datos_eliminar.error_borrar;
                modal_agregar_incorrecto.classList.add("mostrar_agregar_incorrecto");
                

                boton_agregar_incorrecto.addEventListener('click',(e)=>{
                    e.preventDefault();
                    modal_agregar_incorrecto.classList.remove('mostrar_agregar_incorrecto')
                });

            }
        })
        .catch(error => console.error("error", error));
    };

    document.getElementById('formulario_actualizar').addEventListener("submit", function (e) {
        e.preventDefault();
        actualizar();
    });


    function actualizar() {
        const identificacion = identificacion_actualizar.value.trim()
        const nombre = document.getElementById('nombre_actualizar').value.trim()

        fetch('/actualizar_categoria', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ identificacion : identificacion, nombre : nombre }),
        })
        .then(response => response.json())
        .then(datos_actualizar =>{
            if (datos_actualizar.exito) {
                modal_actualizar.classList.remove('mostrar_modal_actualizar')
                mensaje_agregar_correcto.textContent = datos_actualizar.exito;
                modal_agregar_correcto.classList.add("mostrar_agregar_correcto");

                boton_agregar_correcto.addEventListener('click',(e)=>{
                    e.preventDefault();
                    modal_agregar_correcto.classList.remove("mostrar_agregar_correcto");
                    modal_actualizar.classList.remove('mostrar_modal_actualizar')
                    window.location.href = "/categorias";
                });

                
            } else if ( datos_actualizar.error){
                mensaje_agregar_incorrecto.textContent = datos_actualizar.error;
                modal_agregar_incorrecto.classList.add("mostrar_agregar_incorrecto");
                

                boton_agregar_incorrecto.addEventListener('click',(e)=>{
                    e.preventDefault();
                    modal_agregar_incorrecto.classList.remove('mostrar_agregar_incorrecto')
                });

            }
        })
        .catch(error => console.error("error", error));
    };

    let timerCategorias; // Temporizador para categorías
    let categoriasOriginales = ""; // Guarda el HTML original
    
    function buscar_categoria() {
        clearTimeout(timerCategorias); // Limpiar temporizador anterior
    
        const nombre_categorias = document.getElementById("nombre_categorias").value.trim();
        const listado_categorias = document.getElementById("listado_categorias");
    
        if (!categoriasOriginales) {
            categoriasOriginales = listado_categorias.innerHTML;
        }
    
        if (nombre_categorias.length >= 3) {
            timerCategorias = setTimeout(() => {
                fetch(`/busqueda_categorias?nombre_categorias=${encodeURIComponent(nombre_categorias)}`)
                    .then(response => {
                        if (!response.ok) throw new Error("Error en la respuesta del servidor");
                        return response.json();
                    })
                    .then(datos => {
                        const categorias = Array.isArray(datos.productos) ? datos.productos : [];
                        const rolUsuario = datos.rol || "";
    
                        if (categorias.length === 0) {
                            listado_categorias.innerHTML = "";
                            mensaje_agregar_incorrecto.textContent = "No se encontraron categorías";
                            modal_agregar_incorrecto.classList.add("mostrar_agregar_incorrecto");
                            boton_agregar_incorrecto.onclick = () => modal_agregar_incorrecto.classList.remove("mostrar_agregar_incorrecto");
                            return;
                        }
    
                        let tablaHTML = `
                            <h2>Listado De Categorías</h2>
                            <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Creado por</th>
                                            <th scope="col">Nombre de la categoría</th>
                                            <th scope="col">Editar</th>
                                            ${rolUsuario === "Administrador" ? `<th scope="col">Eliminar</th>` : ""}
                                        </tr>
                                    </thead>
                                    <tbody>
                        `;
    
                        categorias.forEach(categoria => {
                            tablaHTML += `
                                <tr>
                                    <td>${categoria[1]}</td>
                                    <td>${categoria[2]}</td>
                                    <td>
                                        <button class="abrir_modal_actualizar" data-id="${categoria[0]}">
                                            <!-- Ícono lápiz -->
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                            </svg>
                                        </button>
                                    </td>
                                    ${rolUsuario === "Administrador" ? `
                                    <td>
                                        <button class="abrir_modal_eliminar" data-id="${categoria[0]}">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                            </svg>
                                        </button>
                                    </td>` : ""}
                                </tr>
                            `;
                        });
    
                        tablaHTML += `</tbody></table></div>`;
                        listado_categorias.innerHTML = tablaHTML;
                        EventosBotones();
                    })
                    .catch(error => {
                        console.error("❌ Error en la búsqueda:", error);
                        mensaje_agregar_incorrecto.textContent = "Error al cargar las categorías";
                        modal_agregar_incorrecto.classList.remove("mostrar_agregar_incorrecto");
                    });
            }, 500); // Esperar 500ms tras dejar de escribir
        } else {
            listado_categorias.innerHTML = categoriasOriginales;
            modal_agregar_incorrecto.classList.remove("mostrar_agregar_incorrecto");
            EventosBotones();
        }
    }
    

    
    // 📌 Función para mostrar mensajes de error de forma dinámica
    function mostrarMensajeError(mensaje) {
        let mensaje_agregar_incorrecto = document.getElementById("mensaje_agregar_incorrecto");
        let modal_agregar_incorrecto = document.getElementById("modal_agregar_incorrecto");
        let boton_agregar_incorrecto = document.getElementById("boton_agregar_incorrecto");
    
        if (!mensaje_agregar_incorrecto || !modal_agregar_incorrecto || !boton_agregar_incorrecto) {
            console.error("❌ No se encontraron los elementos del modal de error.");
            return;
        }
    
        mensaje_agregar_incorrecto.textContent = mensaje;
        modal_agregar_incorrecto.classList.add("mostrar_agregar_incorrecto");
        boton_agregar_incorrecto.onclick = () => modal_agregar_incorrecto.classList.remove("mostrar_agregar_incorrecto");
    }
    
    // 📌 Función para asignar eventos a los botones
    function EventosBotones() {
        document.querySelectorAll(".abrir_modal_actualizar").forEach(boton => {
            boton.removeEventListener("click", abrirModalActualizar);
            boton.addEventListener("click", abrirModalActualizar);
        });
    
        document.querySelectorAll(".abrir_modal_eliminar").forEach(boton => {
            boton.removeEventListener("click", abrirModalEliminar);
            boton.addEventListener("click", abrirModalEliminar);
        });
    }
    
    // 📌 Función para abrir el modal de actualizar
    function abrirModalActualizar() {
        let categoriaId = this.getAttribute("data-id");
    
        if (!categoriaId) {
            console.error("❌ No se encontró data-id en el botón.");
            return;
        }
    
        document.getElementById("identificacion_actualizar").value = categoriaId;
        document.querySelector(".modal_actualizar").classList.add("mostrar_modal_actualizar");
    }
    
    // 📌 Función para abrir el modal de eliminar
    function abrirModalEliminar() {
        let categoriaIdEliminar = this.getAttribute("data-id");
    
        if (!categoriaIdEliminar) {
            console.error("❌ No se encontró data-id en el botón.");
            return;
        }
    
        document.getElementById("identificacion_eliminar").value = categoriaIdEliminar;
        document.querySelector(".modal_agregar_eliminar").classList.add("mostrar_agregar_eliminar");
    }
    
    


});

    // Inicializar la función agregar

