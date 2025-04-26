/* -----------------------------------------modal actualizar-------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById("nombre_producto").addEventListener("input", buscar_inventario)


    const boton_productos = document.querySelector('.boton_agregar_productos');
    const modal__productos = document.querySelector('.modal_productos');
    const boton_cerrar = document.querySelector('.boton_cerrar_agregar');


    /* campos para que los productos salgan con decimales */


    


    /* --------------------------- Alerta Incorrecta ---------------------------------------------------- */
    let modal_agregar_incorrecto = document.querySelector('.modal_agregar_incorrecto');
    let boton_agregar_incorrecto = document.querySelector('.boton_agregar_incorrecto');
    let mensaje_agregar_incorrecto = document.getElementById("mensaje_agregar_incorrecto")



    /* -------------------------- Alerta Exitosa -------------------------------------------------------- */
    let modal_agregar_correcto = document.querySelector('.modal_agregar_correcto');
    let boton_agregar_correcto = document.querySelector('.boton_agregar_correcto');
    let mensaje_agregar_correcto = document.getElementById("mensaje_agregar_correcto")




    /* --------------------------eliminar producto----------------------------------------------------- */
    let boton_abrir_eliminar = document.querySelectorAll('.boton_eliminar_productos');
    let modal_eliminar = document.querySelector('.modal_actualizar_eliminar');
    let boton_rechazar = document.querySelector('.boton_rechazar');
    let identificacion_eliminar = document.getElementById('identificacion_actualizar-eliminar');


        
    // Selección de elementos
    let modal_ver_mas = document.querySelector('.modal_ver_mas_inventario');
    let boton_cerrar_ver_mas = document.getElementById("boton_cerrar_inventario_ver_mas");
    let boton_actualizar = document.getElementById("boton_actualizar_productos");



    let modal_act_ver_mas = document.querySelector('.modal_actualizar_productos');
    let cerrar_modal_act = document.getElementById("boton_cerrar_actualizar_productos")




    let creador_ver_mas = document.getElementById("creador_ver_mas_inventario");
    let nombre_ver_mas = document.getElementById("nombre_ver_mas_inventario");
    let categoria_ver_mas = document.getElementById("categoria_ver_mas_inventario");
    let descripcion_ver_mas = document.getElementById("descripcion_ver_mas_inventario");
    let precio_compra_ver_mas = document.getElementById("precio_compra_ver_mas_inventario");
    let precio_venta_ver_mas = document.getElementById("precio_venta_ver_mas_inventario");
    let unidades_ver_mas = document.getElementById("unidades_ver_mas_inventario");



    let identificacion_act = document.getElementById('identificacion_act');
    let nombre_act = document.getElementById('campo_1');
    let descripcion_act = document.getElementById('campo_2');
    let imagen_act = document.getElementById("campo_3");
    let precio_compra_act = document.getElementById('campo_4');
    let precio_venta_act = document.getElementById('campo_5');
    let unidades_act = document.getElementById('campo_6');



    // Evento para abrir el modal "Ver más"
    document.querySelectorAll('.boton_ver_mas_productos').forEach(boton => {
        boton.addEventListener('click', function () {
            let inventario = this.getAttribute('data-inventario')?.split(',') || [];

            if (inventario.length >= 8) {
                creador_ver_mas.value = inventario[7] || "";
                nombre_ver_mas.value = inventario[1] || "";
                categoria_ver_mas.value = inventario[2] || "";
                descripcion_ver_mas.value = inventario[3] || "";
                precio_compra_ver_mas.value = inventario[4] || "";
                precio_venta_ver_mas.value = inventario[5] || "";
                unidades_ver_mas.value = inventario[6] || "";

                modal_ver_mas.classList.add('mostrar_ver_mas_inventario');

                document.querySelectorAll('.boton_actualizar_productos').forEach(botonAct => {

                    botonAct.setAttribute('data-inventario', this.getAttribute('data-inventario'));
                });
                
                // Se guarda el data-inventario en cada botón de eliminar dentro del modal
                document.querySelectorAll('.boton_eliminar_productos').forEach(botonEliminar => {

                    botonEliminar.setAttribute('data-inventario', this.getAttribute('data-inventario'));
                });
            }
        });
    });

    // Evento para cerrar el modal "Ver más"
    boton_cerrar_ver_mas.addEventListener('click', (e) => {
        e.preventDefault();
        modal_ver_mas.classList.remove('mostrar_ver_mas_inventario');
    });

    // Evento para abrir el modal de actualización
    boton_actualizar.addEventListener("click", function (e) {
        modal_act_ver_mas.classList.add("mostrar_actualizar_productos")
        e.preventDefault();

        let inventario = this.getAttribute('data-inventario')?.split(',') || [];

        if (inventario.length >= 8) {
            identificacion_act.value = inventario[0];
            nombre_act.value = inventario[1];
            descripcion_act.value = inventario[3];
            precio_compra_act.value = inventario[4];
            precio_venta_act.value = inventario[5];
            unidades_act.value = inventario[6];

            modal_act_ver_mas.classList.add('mostrar_actualizar_productos');
        }

        cerrar_modal_act.addEventListener("click", (e) => {
            e.preventDefault();
            modal_act_ver_mas.classList.remove('mostrar_actualizar_productos');
        });
        
    });
    





    // Evento para cerrar el modal de actualización
    document.querySelectorAll(".boton_ver_mas_filtros").forEach(boton => {
        boton.addEventListener("click", function () {
            let ventas = this.getAttribute('data-filtros').split(',');
    
            console.log("Valores en data-filtros:", ventas);
            console.log("ID esperado en posición 7:", ventas[7]); 
    
            if (ventas.length > 7) {
                document.getElementById("identificacion_filtros_eliminar").value = ventas[7];
            } else {
                console.error("El ID de la venta no está en la posición esperada.");
            }
        });
    });
    
    /* -------------------------- Evento para cerrar el modal de eliminación -------------------------- */
    document.querySelector('.boton_rechazar').addEventListener('click', (e) => {
        e.preventDefault();
        modal_eliminar.classList.remove('mostrar_actualizar_eliminar');
    });


    window.onload = function () {
        if (window.location.search.includes('exito') || window.location.search.includes('error')) {
            // Limpiar los parámetros de la URL
            history.pushState(null, null, window.location.pathname);
        }
    };

    boton_productos.addEventListener('click', (e) => {
        e.preventDefault();
        modal__productos.classList.add('mostrar_modal');
    });

    boton_cerrar.addEventListener('click', (e) => {
        e.preventDefault();
        modal__productos.classList.remove('mostrar_modal');
        document.getElementById("modal_crear_inventario").reset();
    });



    document.getElementById("modal_eliminar_productos").addEventListener("submit",(e)=>{
        e.preventDefault();
        eliminar_inventario()
    })



    function eliminar_inventario(){
        const identificacion_eliminar = document.getElementById("identificacion_actualizar-eliminar").value.trim();
        
        fetch("/productos/eliminar",{
            method : "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ identificacion: identificacion_eliminar}),
        })
        .then(response => response.json())
        .then(datos_eliminar_productos =>{
            if (datos_eliminar_productos.exito){
                modal_eliminar.classList.remove('mostrar_actualizar_eliminar');
                mensaje_agregar_correcto.textContent = datos_eliminar_productos.exito;
                modal_agregar_correcto.classList.add("oculto_correcto");
    
                boton_agregar_correcto.addEventListener("click", (e) => {
                    e.preventDefault();
                    modal_agregar_correcto.classList.remove("oculto_correcto");
                    window.location.href = '/productos';
                });
            } else {
                let mensaje = datos_eliminar_productos.ventas_existentes || datos_eliminar_productos.creditos_existentes;
                if (mensaje){
                    mensaje_agregar_incorrecto.textContent = mensaje;
                    modal_agregar_incorrecto.classList.add("oculto_incorrecto");
    
                    boton_agregar_incorrecto.addEventListener("click", (e) => {
                        e.preventDefault();
                        modal_agregar_incorrecto.classList.remove("oculto_incorrecto");
                    });
                }
            }
        })
        .catch(error => console.error("Error:", error));
    }

    
    let valorNumerico = document.getElementById("campo4").value.replace(/\./g, '');
    if (isNaN(valorNumerico)) {
        alert("El precio debe ser un número válido");
        return;
    }

    function formatearMiles(input) {
        input.addEventListener('input', function () {
            let valor = this.value.replace(/\./g, '').replace(/[^\d]/g, ''); // Solo números
    
            if (valor === '') {
                this.value = '';
                return;
            }
    
            // Formatear con puntos de miles
            this.value = valor.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        });
    }
    
    // Usar para los campos de precio
    const precio_COMPRA = document.getElementById("campo4");
    const precio_VENTA = document.getElementById("campo5");
    const precio_COMPRA_ACT = document.getElementById("campo_4");
    const precio_VENTA_ACT = document.getElementById("campo_5");
    
    formatearMiles(precio_COMPRA);
    formatearMiles(precio_VENTA);
    formatearMiles(precio_COMPRA_ACT);
    formatearMiles(precio_VENTA_ACT);
    document.getElementById("modal_crear_inventario").addEventListener("submit", (e) => {
        e.preventDefault();
    
        // Ya no eliminamos puntos, porque queremos que lleguen así: "18.000"
        crear_inventario();
    });
    
    
    function crear_inventario() {
        const formData = new FormData();
        formData.append("nombre", document.getElementById("campo1").value);
        formData.append("categoria", document.getElementById("campo2").value);
        formData.append("descripcion", document.getElementById("campo3").value);
        formData.append("precio_compra", document.getElementById("campo4").value);
        formData.append("precio_venta", document.getElementById("campo5").value);
        formData.append("unidades", document.getElementById("campo6").value);
        formData.append("imagen", document.getElementById("campo7").files[0]);
    
        fetch("/productos/agregar", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(datos_crear => {
            if (datos_crear.exito) {
                modal__productos.classList.remove('mostrar_modal');
                mensaje_agregar_correcto.textContent = datos_crear.exito;
                modal_agregar_correcto.classList.add("oculto_correcto");
    
                boton_agregar_correcto.addEventListener("click", (e) => {
                    e.preventDefault();
                    modal_agregar_correcto.classList.remove("oculto_correcto");
                    window.location.href = '/productos';
                });
            } else {
                if (datos_crear.error) {
                    mensaje_agregar_incorrecto.textContent = datos_crear.error;
                    modal_agregar_incorrecto.classList.add("oculto_incorrecto");
    
                    boton_agregar_incorrecto.addEventListener("click", (e) => {
                        e.preventDefault();
                        modal_agregar_incorrecto.classList.remove("oculto_incorrecto");
                    });
                }
            }
        })
        .catch(error => console.error("Error:", error));
    }
    
    
    
    








    document.getElementById("actualizar_inventario").addEventListener("submit", (e) => {
        e.preventDefault();
        actualizacion_inventario();
    });
    
    function actualizacion_inventario() {
        const formData = new FormData();
        formData.append("identificacion", document.getElementById("identificacion_act").value);
        formData.append("nombre", document.getElementById("campo_1").value);
        formData.append("descripcion", document.getElementById("campo_2").value);
        formData.append("precio_compra", document.getElementById("campo_4").value);
        formData.append("precio_venta", document.getElementById("campo_5").value);
        formData.append("unidades", document.getElementById("campo_6").value);
    
        // Obtener la imagen solo si se ha seleccionado una nueva
           // Adjuntar la imagen solo si se selecciona una nueva
        const imagenInput = document.getElementById("campo_3");
        if (imagenInput.files.length > 0) {
            formData.append("imagen", imagenInput.files[0]); // Agregar la imagen al FormData
        }
    
        fetch('/productos/actualizar', {  
            method: 'POST',
            body: formData, // No se usa JSON.stringify
        })
        .then(response => response.json())
        .then(datos_actualizar => {
            if (datos_actualizar.exito) {
                mensaje_agregar_correcto.textContent = datos_actualizar.exito;
                modal_act_ver_mas.classList.remove('mostrar_actualizar_productos');
                modal_agregar_correcto.classList.add("oculto_correcto");
    
                boton_agregar_correcto.addEventListener("click", (e) => {
                    e.preventDefault();
                    modal_agregar_correcto.classList.remove("oculto_correcto");
                    window.location.href = '/productos';
                });
    
            } else {

                if (datos_actualizar.error) {
                    mensaje_agregar_incorrecto.textContent = datos_actualizar.error;
                    modal_agregar_incorrecto.classList.add("oculto_incorrecto");
    
                    boton_agregar_incorrecto.addEventListener("click", (e) => {
                        e.preventDefault();
                        modal_agregar_incorrecto.classList.remove("oculto_incorrecto");
                    });
                }
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }
    
        // Verifica que el botón exista antes de asignar el evento

    let productoOriginal = []; // Guardar HTML original
    let timerInventario;  // Variable para manejar el temporizador

    function buscar_inventario() {
        clearTimeout(timerInventario);  // Limpiar cualquier temporizador anterior
    
        let nombre_producto = document.getElementById("nombre_producto").value.trim();
        let inventarioEncontrado = document.getElementById("inventario-encontrado");
    
        // Guardar HTML inicial si aún no se ha guardado
        if (!productoOriginal || productoOriginal.length === 0) {
            productoOriginal = inventarioEncontrado.innerHTML;
        }
    
        if (nombre_producto.length >= 3) {
            // Establecer temporizador para esperar que el usuario termine de escribir
            timerInventario = setTimeout(() => {
                fetch(`/busqueda_inventario?nombre_producto=${encodeURIComponent(nombre_producto)}`)
                    .then(response => {
                        if (!response.ok) throw new Error("Error en la respuesta del servidor");
                        return response.json();
                    })
                    .then(datos => {
                        inventarioEncontrado.innerHTML = ""; // Limpiar resultados anteriores
    
                        let productos = datos.productos || [];
                        let rolUsuario = datos.rol || "";
    
                        if (!Array.isArray(productos) || productos.length === 0) {
                            mensaje_agregar_incorrecto.textContent = "No se encontraron productos en el inventario";
                            modal_agregar_incorrecto.classList.add('oculto_incorrecto');
    
                            boton_agregar_incorrecto.addEventListener("click", (e) => {
                                e.preventDefault();
                                modal_agregar_incorrecto.classList.remove('oculto_incorrecto');
                            });
                        }
    
                        let tablaHTML = `
                            <div id="inventario-encontrado">
                                <h2>Listado De productos en inventario</h2>
                                <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">Nombre</th>
                                                <th scope="col">Categoría</th>
                                                <th scope="col">Precio de Venta</th>
                                                <th scope="col">Unidades</th>
                                                <th>Más Info</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                        `;
    
                        productos.forEach(producto => {
                            // Formatear el precio como número con separadores de miles
                            const precioFormateado = Number(producto[5]).toLocaleString('es-ES', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            });

                            tablaHTML += `
                                <tr>
                                    <td>${producto[1]}</td>
                                    <td>${producto[2]}</td>
                                    <td>${precioFormateado}</td>
                                    <td>${producto[6]}</td>
                                    <td>
                                        <button class="boton_ver_mas_productos"
                                            data-inventario="${producto[0]},${producto[1]},${producto[2]},${producto[3]},${producto[4]},${producto[5]},${producto[6]},${producto[8]}">
                                            Ver Más
                                        </button>
                                    </td>
                                </tr>
                            `;
                        });
    
                        tablaHTML += `
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        `;
    
                        inventarioEncontrado.innerHTML = tablaHTML;
                        asignarEventosBotones();
                    })
                    .catch(error => {
                        console.error("❌ Error al buscar productos:", error);
                        mensaje_agregar_incorrecto.textContent = "Error al cargar los productos";
                        modal_agregar_incorrecto.classList.remove('oculto_incorrecto');
                    });
            }, 500); // Esperar 500ms después de que el usuario deje de escribir
        } else {
            // Restaurar productos originales si el usuario borra la búsqueda
            inventarioEncontrado.innerHTML = productoOriginal;
            modal_agregar_incorrecto.classList.remove('oculto_incorrecto');
            asignarEventosBotones();
        }
    }
    

    // 📌 Función para asignar eventos a los botones
    function asignarEventosBotones() {
        /* -------------------------- Evento para abrir el modal "Ver Más" -------------------------- */
        document.querySelectorAll('.boton_ver_mas_productos').forEach(boton => {
            boton.addEventListener('click', function () {
                let inventario = this.getAttribute('data-inventario')?.split(',') || [];

                const formatearMonto = (valor) => {
                    const numero = parseFloat(valor) || 0;
                    return numero.toLocaleString('es-ES', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    });
                };

                if (inventario.length >= 8) {
                    creador_ver_mas.value = inventario[7] || "";
                    nombre_ver_mas.value = inventario[1] || "";
                    categoria_ver_mas.value = inventario[2] || "";
                    descripcion_ver_mas.value = inventario[3] || "";
                    unidades_ver_mas.value = inventario[6] || "";

                    precio_venta_ver_mas.value = formatearMonto(inventario[5]);
                    precio_compra_ver_mas.value = formatearMonto(inventario[4]);

                    modal_ver_mas.classList.add('mostrar_ver_mas_inventario');

                    boton_actualizar.setAttribute('data-inventario', this.getAttribute('data-inventario'));
                    document.querySelectorAll('.boton_eliminar_productos').forEach(botonEliminar => {
                        botonEliminar.setAttribute('data-inventario', this.getAttribute('data-inventario'));
                    });
                }
            });
        });

        /* -------------------------- Evento para abrir el modal de actualización -------------------------- */
        boton_actualizar.addEventListener("click", function (e) {
            e.preventDefault();
            modal_ver_mas.classList.remove('mostrar_ver_mas_inventario');

            let inventario = this.getAttribute('data-inventario')?.split(',') || [];

            const formatearMonto = (valor) => {
                const numero = parseFloat(valor) || 0;
                return numero.toLocaleString('es-ES', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
            };

            if (inventario.length >= 8) {
                identificacion_act.value = inventario[0];
                nombre_act.value = inventario[1];
                descripcion_act.value = inventario[3];
                unidades_act.value = inventario[6];

            precio_venta_act.value = formatearMonto(inventario[5]);
            precio_compra_act.value = formatearMonto(inventario[4]);

                modal_act_ver_mas.classList.add('mostrar_actualizar_productos');
            }
        });

        /* -------------------------- Evento para eliminar producto -------------------------- */
        document.querySelectorAll('.boton_eliminar_productos').forEach(eliminar => {
            eliminar.addEventListener("click", function () {
                let id_act_eliminar = this.getAttribute('data-inventario')?.split(',') || [];
        
                if (id_act_eliminar.length > 0) {
                    document.getElementById('identificacion_actualizar-eliminar').value = id_act_eliminar[0];
                } else {
                    console.error("❌ No se pudo obtener el ID del producto para eliminar.");
                }
        
                // Mostrar el modal de eliminación
                modal_eliminar.classList.add('mostrar_actualizar_eliminar');
            });
        });
        
        /* -------------------------- Evento para cerrar el modal de eliminación -------------------------- */
        document.querySelector('.boton_rechazar').addEventListener('click', (e) => {
            e.preventDefault();
            modal_eliminar.classList.remove('mostrar_actualizar_eliminar');
        });
    }

    // Llamar a la función al cargar la página
    asignarEventosBotones();


    // 🎯 Evento para cerrar el modal de eliminar
    document.querySelector('.boton_rechazar').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.modal_actualizar_eliminar').classList.remove('mostrar_actualizar_eliminar');
    });

    // Llamar a la función al cargar la página
    asignarEventosBotones();


});