document.addEventListener('DOMContentLoaded', () => {
    /* -------------------- MODALES ----------------------------------- */
    const modalAbonar = document.querySelector('.modal_abonar');
    const botonCerrarAbonar = document.getElementById("boton_cerrar_abonos");
    const formularioAbonar = document.getElementById("formulario_actualizar_credito");

    /* alertas exitosa */
    let modal_alerta_exitosa = document.querySelector('.modal_agregar_correcto')
    let mensaje_alerta_correcta = document.getElementById("mensaje_agregar_correcto")
    let boton_cerrar_exitosa = document.querySelector('.boton_agregar_correcto')
    
    /* alertas incorrecta */
    let modal_alerta_incorrecta = document.querySelector('.modal_agregar_incorrecto')
    let mensaje_alerta_incorrecta = document.getElementById("mensaje_agregar_incorrecto")
    let boton_cerrar_incorrecta = document.querySelector('.boton_agregar_incorrecto')

    /*-------------------------------- eliminar creditos---------------*/
    let modal_creditos_eliminar = document.querySelector(".modal_creditos_eliminar")
    let bton_cerrar_eliminar_creditos = document.querySelector(".boton_rechazar")

    // Modal Pendientes
    const modalVerMasPendientes = document.querySelector('.modal_ver_mas_creditos_pendientes');
    const botonCerrarVerMasPendientes = document.getElementById('boton_cerrar_pendientes_ver_mas');
    const identificacionPendiente = document.getElementById('creador_ver_mas_indentificacion')
    const creadorPendiente = document.getElementById('creador_ver_mas_pendientes');
    const abonadorPendiente = document.getElementById('abonador_ver_mas_pendientes');
    const nombrePendiente = document.getElementById('nombre_ver_mas_pendientes');
    const categoriaPendiente = document.getElementById('categoria_ver_mas_pendientes');
    const unidadesPendientes = document.getElementById("unidades_ver_mas_pendientes");
    const clientePendiente = document.getElementById('cliente_ver_mas_pendientes');
    const cedulaPendiente = document.getElementById('cedula_ver_mas_pendientes');
    const telefonoPendiente = document.getElementById('telefono_ver_mas_pendientes');
    const abonadoPendiente = document.getElementById('abonado_ver_mas_pendientes');
    const porPagarPendiente = document.getElementById('por_pagar_ver_mas_pendientes');
    const fechaPendiente = document.getElementById('fecha_ver_mas_pendientes');
    const fechaPendiente_ultima = document.getElementById('fecha_ver_mas_pendientes_ultima'); 

    // Modal Pagados
    const modalVerMasPagados = document.querySelector('.modal_ver_mas_creditos_pagados');
    const botonCerrarVerMasPagados = document.getElementById('boton_cerrar_pagados_ver_mas');
    const creadorPagado = document.getElementById('creador_ver_mas_pagados');
    const abonadorPagado = document.getElementById('abonador_ver_mas_pagados');
    const nombrePagado = document.getElementById('nombre_ver_mas_pagados');
    const categoriaPagado = document.getElementById('categoria_ver_mas_pagados');
    const unidadesPagado = document.getElementById('unidades_ver_mas_pagados');
    const clientePagado = document.getElementById('cliente_ver_mas_pagados');
    const cedulaPagado = document.getElementById('cedula_ver_mas_pagados');
    const telefonoPagado = document.getElementById('telefono_ver_mas_pagados');
    const porPagarPagado = document.getElementById('por_pagar_ver_mas_pagados');
    const fechaPagado = document.getElementById('fecha_ver_mas_pagados');
    const identificacion_eliminar = document.getElementById('identificacion_eliminar');

    // Elementos de las tablas
    const listaPagados = document.getElementById("listado_creditos_pagados");
    const listaPendientes = document.getElementById("creditos_por_pagar");

    /* -------------------- FUNCIONES PRINCIPALES -------------------- */

    // Función para asignar eventos a los botones "Ver más"
    function asignarEventosBotonesVerMas() {
        document.querySelectorAll('.btn-ver-mas').forEach(boton => {
            boton.addEventListener('click', function() {
                const data = this.getAttribute("data-pendiente").split(",");
                const tipo = this.getAttribute("data-tipo");
    
                // Función auxiliar para formatear montos
                const formatearMonto = (valor) => {
                    const numero = parseFloat(valor) || 0;
                    return numero.toLocaleString('es-ES', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    });
                };
    
                if (tipo === "pendiente") {
                    // Rellenar modal de pendientes
                    identificacionPendiente.value = data[0];
                    creadorPendiente.value = data[1];
                    abonadorPendiente.value = data[2];
                    nombrePendiente.value = data[3];
                    categoriaPendiente.value = data[4];
                    unidadesPendientes.value = data[5];
                    clientePendiente.value = data[6];
                    cedulaPendiente.value = data[7];
                    telefonoPendiente.value = data[8];
                    
                    // Montos formateados para pendientes
                    abonadoPendiente.value = formatearMonto(data[9]);
                    porPagarPendiente.value = formatearMonto(data[10]);
                    
                    fechaPendiente_ultima.value = data[11];
                    fechaPendiente.value = data[12];
                    modalVerMasPendientes.classList.add('mostrar_ver_mas_pendientes');
                } else if (tipo === "pagado") {
                    // Rellenar modal de pagados
                    creadorPagado.value = data[1];
                    abonadorPagado.value = data[2];
                    nombrePagado.value = data[3];
                    categoriaPagado.value = data[4];
                    unidadesPagado.value = data[5];
                    clientePagado.value = data[6];
                    cedulaPagado.value = data[7];
                    telefonoPagado.value = data[8];
                    
                    // Monto formateado para pagados
                    porPagarPagado.value = formatearMonto(data[9]);
                    
                    fechaPagado.value = data[11];
                    modalVerMasPagados.classList.add('mostrar_ver_mas_pagados');
    
                    // Asignar data-pendiente a los botones de eliminar dentro del modal
                    document.querySelectorAll('.boton_eliminar_creditos').forEach(btnEliminar => {
                        btnEliminar.setAttribute('data-pendiente', this.getAttribute("data-pendiente"));
                    });
                }
            });
        });
    }

    

    // Función para actualizar las tablas
    function actualizarTabla(datos, idTabla, tipo) {
        const tabla = document.getElementById(idTabla);
        const tbody = tabla.querySelector("tbody");
        tbody.innerHTML = "";
    
        datos.forEach(credito => {
            const fila = document.createElement("tr");
            // Obtener el monto y formatearlo
            const monto = tipo === "pendiente" ? credito.restante : credito.abonado;
            const montoFormateado = monto ? 
                Number(monto).toLocaleString('es-ES', {minimumFractionDigits: 0, maximumFractionDigits: 0}) : 
                '0';
    
            fila.innerHTML = `
                <td>${credito.producto}</td>
                <td>${credito.categoria}</td>
                <td>${credito.cliente}</td>
                <td>${montoFormateado}</td>
                <td>
                    <button class="btn-ver-mas" 
                        data-pendiente="${credito.id_credito},${credito.creador},${credito.abonador},${credito.producto},${credito.categoria},${credito.unidades},${credito.cliente},${credito.cedula},${credito.telefono},${credito.abonado},${credito.restante || credito.total},${credito.fecha_ultima},${credito.fecha}" 
                        data-tipo="${tipo}">
                        Ver más
                    </button>
                </td>`;
            tbody.appendChild(fila);
        });
    
        asignarEventosBotonesVerMas();
    }

    // Función principal para cargar créditos
    function cargarCreditos(estado) {
        fetch("/creditos/buscar_credito", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                estado_credito: estado,
                nombre_cliente: "" // Cadena vacía para obtener todos
            }),
        })
        .then(response => response.json())
        .then(data => {
            actualizarTabla(data.pendientes, "creditos_por_pagar", "pendiente");
            actualizarTabla(data.pagados, "listado_creditos_pagados", "pagado");
    
            // Mostrar la tabla correspondiente
            if (estado === "Pagados") {
                listaPagados.style.display = "block";
                listaPendientes.style.display = "none";
            } else {
                listaPendientes.style.display = "block";
                listaPagados.style.display = "none";
            }
    
            // Mostrar mensaje si no hay créditos
            if (estado === "Pagados" && data.pagados.length === 0) {
                mensaje_alerta_incorrecta.textContent = "No hay créditos pagados registrados";
                modal_alerta_incorrecta.classList.add('mostrar_credito_incorrecto');
            } else if (estado === "Pendientes" && data.pendientes.length === 0) {
                mensaje_alerta_incorrecta.textContent = "No hay créditos pendientes registrados";
                modal_alerta_incorrecta.classList.add('mostrar_credito_incorrecto');
            }
        })
        .catch(error => console.error("Error al cargar los créditos:", error));
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
    const precio_abonar = document.getElementById("por_abonar");
    
    formatearMiles(precio_abonar);



    // Función para abonar créditos
    function abonarCredito() {
        const identificacionAbono = document.getElementById('id_abono').value.trim();
        const porPorPagar = document.getElementById('por_pagar').value.trim();
        const montoAbonar = document.getElementById('por_abonar').value.replace(/\./g, ''); 
        
    
        if (!precio_abonar || precio_abonar <= 0) {
            mensaje_alerta_incorrecta.textContent = "El monto a abonar debe ser mayor a 0.";
            modal_alerta_incorrecta.classList.add('mostrar_credito_incorrecto');
            return;
        }
    
        fetch('/creditos/abonar_credito', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identificacion_abono: identificacionAbono,
                por_por_pagar: porPorPagar,
                por_abonar: montoAbonar
            }),
        })
        .then(response => response.json())
        .then(datosAbonar => {
            if (datosAbonar.exito) {
                modalAbonar.classList.remove('mostrar_modal_abonar');
                mensaje_alerta_correcta.textContent = datosAbonar.exito;
                modal_alerta_exitosa.classList.add('mostrar_credito_correcto');

                boton_cerrar_exitosa.addEventListener("click",(e)=>{
                    e.preventDefault();
                    modal_alerta_exitosa.classList.remove('mostrar_credito_correcto');
                    window.location.href = "/creditos"; 
                });
            } else if (datosAbonar.error_monto) {
                mensaje_alerta_incorrecta.textContent = datosAbonar.error_monto;
                modal_alerta_incorrecta.classList.add('mostrar_credito_incorrecto');

                boton_cerrar_incorrecta.addEventListener("click",(e)=>{
                    e.preventDefault();
                    modal_alerta_incorrecta.classList.remove('mostrar_credito_incorrecto');
                });
            }
        })
        .catch(error => console.error("Error:", error));
    }

    // Función para eliminar créditos
    function eliminar_credito() {
        const identificacion_nombre = document.getElementById("identificacion_creditos_eliminar").value;
        const fecha_credito = document.getElementById("fecha_credito").value;

        if (!identificacion_nombre || !fecha_credito) {
            mensaje_alerta_incorrecta.textContent = "Datos incompletos para eliminar el crédito";
            modal_alerta_incorrecta.classList.add('mostrar_credito_incorrecto');
            return;
        }

        fetch('/creditos/eliminar', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                nombre: identificacion_nombre, 
                fecha: fecha_credito 
            }),
        })
        .then(response => response.json())
        .then(creditos_eliminados => {
            if (creditos_eliminados.exito) {
                modalVerMasPagados.classList.remove('mostrar_ver_mas_pagados');
                mensaje_alerta_correcta.textContent = creditos_eliminados.exito;
                modal_creditos_eliminar.classList.remove("mostrar_credito_eliminar");
                modal_alerta_exitosa.classList.add('mostrar_credito_correcto');

                boton_cerrar_exitosa.addEventListener("click", (e) => {
                    e.preventDefault();
                    modal_alerta_exitosa.classList.remove('mostrar_credito_correcto');
                    cargarCreditos("Pagados"); // Recargar la lista
                });
            } else if (creditos_eliminados.error) {
                mensaje_alerta_incorrecta.textContent = creditos_eliminados.error;
                modal_alerta_incorrecta.classList.add('mostrar_credito_incorrecto');
            }
        })
        .catch(error => {
            console.error("Error al eliminar crédito:", error);
            mensaje_alerta_incorrecta.textContent = "Error al eliminar el crédito";
            modal_alerta_incorrecta.classList.add('mostrar_credito_incorrecto');
        });
    }

    /* -------------------- EVENT LISTENERS -------------------- */

    // Botones principales
    document.getElementById("btn_pagados").addEventListener("click", () => cargarCreditos("Pagados"));
    document.getElementById("btn_pendientes").addEventListener("click", () => cargarCreditos("Pendientes"));

    // Botón de abonar en el modal
    document.getElementById('boton_abonar_credito').addEventListener("click", (e) => {
        e.preventDefault();
        modalVerMasPendientes.classList.remove('mostrar_ver_mas_pendientes');
        document.getElementById('id_abono').value = identificacionPendiente.value;
        document.getElementById('por_pagar').value = porPagarPendiente.value;
        modalAbonar.classList.add('mostrar_modal_abonar');
    });

    // Formulario de abonar
    document.getElementById('formulario_actualizar_credito').addEventListener('submit', function(event) {
        event.preventDefault();
        abonarCredito();
    });

    // Botones de eliminar
    document.querySelectorAll(".boton_eliminar_creditos").forEach(boton_eliminar => {
        boton_eliminar.addEventListener("click", function (e) {
            e.preventDefault();
            modal_creditos_eliminar.classList.add("mostrar_credito_eliminar");
            let datos = this.getAttribute("data-pendiente").split(",");
            document.getElementById("identificacion_creditos_eliminar").value = datos[3];
            document.getElementById("fecha_credito").value = datos[11];
        });
    });

    // Formulario de eliminar
    document.getElementById("formulario_creditos_eliminar").addEventListener("submit", function(e) {
        e.preventDefault();
        eliminar_credito();
    });

    // Cerrar modales
    botonCerrarVerMasPendientes.addEventListener('click', () => {
        modalVerMasPendientes.classList.remove('mostrar_ver_mas_pendientes');
    });

    botonCerrarVerMasPagados.addEventListener('click', () => {
        modalVerMasPagados.classList.remove('mostrar_ver_mas_pagados');
    });

    botonCerrarAbonar.addEventListener("click", (e) => {
        e.preventDefault();
        modalAbonar.classList.remove('mostrar_modal_abonar');
    });

    bton_cerrar_eliminar_creditos.addEventListener("click", (e) => {
        e.preventDefault();
        modal_creditos_eliminar.classList.remove("mostrar_credito_eliminar");
    });

    boton_cerrar_incorrecta.addEventListener("click", (e) => {
        e.preventDefault();
        modal_alerta_incorrecta.classList.remove('mostrar_credito_incorrecto');
    });

    boton_cerrar_exitosa.addEventListener("click", (e) => {
        e.preventDefault();
        modal_alerta_exitosa.classList.remove('mostrar_credito_correcto');
    });

    // Cargar créditos pendientes al iniciar
    cargarCreditos("Pendientes");
});