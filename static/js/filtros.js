document.addEventListener('DOMContentLoaded', function () {
    /* modal alerta incorrecta */
    let alerta_incorrecta = document.querySelector('.modal_agregar_incorrecto');
    let boton_alerta_incorrecta = document.querySelector('.boton_agregar_incorrecto');
    let mensaje_alerta_incorrecta = document.getElementById('mensaje_agregar_incorrecto');


    /* -------------------------- Alerta Exitosa -------------------------------------------------------- */
    let modal_agregar_correcto = document.querySelector('.modal_agregar_correcto');
    let boton_agregar_correcto = document.querySelector('.boton_agregar_correcto');
    let mensaje_agregar_correcto = document.getElementById("mensaje_agregar_correcto")

    /* modal eliminar */

    let  modal_eliminar_ventas = document.querySelector('.modal_filtros_eliminar')
    let  boton_cerrar_eliminar_ventas = document.querySelector('.boton_rechazar')

    
    /* modal ver mas creditos */

    modal_ver_mas_filtros = document.querySelector('.modal_ver_mas_filtros');
    boton_cerrar_ver_mas = document.getElementById('boton_cerrar_ver_mas_filtros');



    let creador_filtros = document.getElementById("creador_ver_mas_filtros");
    let nombre_filtros = document.getElementById("nombre_ver_mas_filtros");
    let categoria_filtros = document.getElementById("categoria_ver_mas_filtros");
    let vendido_filtros = document.getElementById("vendido_ver_mas_filtros");
    let cantidad_filtros = document.getElementById("cantidad_compra_ver_mas_filtros");
    let mediopago_filtros = document.getElementById("medioPago_venta_ver_mas_filtros");
    let fecha_filtros = document.getElementById("fecha_ver_mas_filtros");


    // Evento para abrir el modal "Ver más"
    function ver_mas(boton) {
        let filtros = boton.getAttribute('data-filtros')?.split(',') || [];

        const formatearMonto = (valor) => {
            const numero = parseFloat(valor) || 0;
            return numero.toLocaleString('es-ES', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
        };
    
        if (filtros.length >= 7) {
            creador_filtros.value = filtros[0] || "";
            nombre_filtros.value = filtros[1] || "";
            categoria_filtros.value = filtros[2] || "";
            cantidad_filtros.value = filtros[4] || "";
            mediopago_filtros.value = filtros[5] || "";
            fecha_filtros.value = filtros[6] || "";

            // Montos formateados para pendientes
            vendido_filtros.value  = formatearMonto(filtros[3]);
    
            modal_ver_mas_filtros.classList.add('mostrar_ver_mas_filtros');
    
            // Asigna el atributo 'data-filtros' a todos los botones de eliminación
            document.querySelectorAll('.boton_eliminar_ventas').forEach(eliminacion => {
                eliminacion.setAttribute('data-filtros', boton.getAttribute('data-filtros'));
            });
        }
    
        boton_cerrar_ver_mas.addEventListener('click', (e) => {
            e.preventDefault();
            modal_ver_mas_filtros.classList.remove('mostrar_ver_mas_filtros');
        });
    }

    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("boton_ver_mas_filtros")) {
            ver_mas(event.target);
            
        }
    });

    boton_cerrar_eliminar_ventas.addEventListener("click",(e)=>{
        e.preventDefault();
        modal_eliminar_ventas.classList.remove("mostrar_filtros_eliminar")
    })

    


    boton_alerta_incorrecta.addEventListener('click', (e) => {
        e.preventDefault();
        alerta_incorrecta.classList.add('mostrar_alerta');
    });

    document.querySelectorAll(".boton_eliminar_ventas").forEach(boton => {
        boton.addEventListener("click", function (e) {
            e.preventDefault();
            modal_eliminar_ventas.classList.add('mostrar_filtros_eliminar');
    
            let filtros = this.getAttribute('data-filtros')?.split(',') || [];
    
            if (filtros.length > 7) {
                document.getElementById("identificacion_filtros_eliminar").value = filtros[7]; // ID de la venta
            } else {
                console.error("El ID de la venta no está disponible en data-filtros.");
            }
        });
    });

    document.getElementById("formulario_filtros_eliminar").addEventListener("submit",(e)=>{
        e.preventDefault();
        eliminar_filtro()
    })

    function eliminar_filtro(){
        const identificacion = document.getElementById("identificacion_filtros_eliminar").value;

        fetch('/filtros/eliminar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({identificacion: identificacion})
        })
        .then(response =>response.json())
        .then(eliminar_filtros =>{
            if (eliminar_filtros.exito){
                modal_eliminar_ventas.classList.remove('mostrar_filtros_eliminar')
                mensaje_agregar_correcto.textContent = eliminar_filtros.exito;
                modal_agregar_correcto.classList.add('oculto_correcto')
                boton_agregar_correcto.addEventListener("click",(e)=>{
                    e.preventDefault();
                    modal_agregar_correcto.classList.add('oculto_correcto')
                    window.location.href = '/filtros'
                })
            }
        })
        .catch(error => console.error('Error:', error));
    }


    
    document.getElementById('formulario_buscar_filtros').addEventListener('submit', (e) => {
        e.preventDefault();
        buscador_filtros();
    });
    
    let filtrosOriginales = document.getElementById('tabla_filtros').innerHTML; // Guardar HTML original

    
    
    function buscador_filtros() {
        const fecha_buscar = document.getElementById('fecha').value;
        const metodo_buscar = document.getElementById('metodo').value;
        const listado_filtros = document.getElementById('tabla_filtros');
    
        fetch('/filtros/buscar_filtros', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fecha: fecha_buscar,
                metodo: metodo_buscar
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.busqueda && data.busqueda.length > 0) {
                let contenidoTabla = `
                    <h2>Listado de venta de productos</h2>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Nombre</th>
                                <th scope="col">Categoría</th>
                                <th scope="col">Vendido</th>
                                <th scope="col">Medio de pago</th>
                                <th scope="col">Más info</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${data.busqueda.map(filtro => {
                            const precioFormateado = Number(filtro[3]).toLocaleString('es-ES', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            });
                            let fechaObj = new Date(filtro[6]);
                            let fechaConvertida = fechaObj.getFullYear() + "-" +
                                String(fechaObj.getMonth() + 1).padStart(2, '0') + "-" +
                                String(fechaObj.getDate()).padStart(2, '0') + " " +
                                String(fechaObj.getHours()).padStart(2, '0') + ":" +
                                String(fechaObj.getMinutes()).padStart(2, '0') + ":" +
                                String(fechaObj.getSeconds()).padStart(2, '0');
                        
                            return `
                                <tr>
                                    <td>${filtro[1]}</td>
                                    <td>${filtro[2]}</td>
                                    <td>${precioFormateado}</td>
                                    <td>${filtro[5]}</td>
                                    <td>
                                        <button class="boton_ver_mas_filtros" 
                                                data-filtros="${filtro[0]},${filtro[1]},${filtro[2]},${filtro[3]},${filtro[4]},${filtro[5]},${fechaConvertida},${filtro[9]}">
                                            Ver más
                                        </button>
                                    </td>
                                </tr>
                            `;
                        }).join("")}
                        
                        
                        </tbody>
                    </table>`;
                listado_filtros.innerHTML = contenidoTabla;
            } else if (data.busqueda.length === 0) {
                mensaje_alerta_incorrecta.textContent = 'este dia no se realizo ninguna venta';
                alerta_incorrecta.classList.add('mostrar_alerta');

                boton_alerta_incorrecta.addEventListener('click', (e) => {
                    e.preventDefault();
                    alerta_incorrecta.classList.remove('mostrar_alerta');
                });
            }
        })
        .catch(error => console.error('Error:', error));

        document.getElementById('total_ventas').addEventListener('click', (e) => {
            e.preventDefault();
            listado_filtros.innerHTML = filtrosOriginales;
        });
    }
    
});