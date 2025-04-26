// Obtener elementos del modal y otros elementos del DOM
let modal = document.getElementById("modalCarrito");
let btnCarro = document.getElementById("carro_compras");
let span = document.getElementsByClassName("cerrar")[0];
let listaCarrito = document.getElementById("listaCarrito");
let totalCarrito = document.getElementById("totalCarrito");


let mensaje_exitoso = document.getElementById("mensaje_aceptado");
let modal_alerta = document.querySelector('.modal_realizada');
let boton_aceptar = document.querySelector('.boton_aceptar');




let mensaje_modal_incorrecto = document.getElementById('mensaje_no_realizado')
let modal_incorrecto = document.querySelector('.modal_no_realizado')
let boton_modal_incorrecto = document.querySelector('.boton_no_realizado')



// Elementos del formulario del cliente
let identificacionCliente = document.getElementById("identificacion_cliente");
let correoCliente = document.getElementById("correoCliente");
let nombreCliente = document.getElementById("nombreCliente");
let telefonoCliente = document.getElementById("telefonoCliente");
let metodo_pago = document.getElementById("metodos")




// Array para almacenar los productos del carrito
var carrito = [];

// Función para agregar productos al carrito
function agregarAlCarrito(nombre, precio, id_producto) {
    var productoEncontrado = carrito.find(item => item.nombre === nombre);
    if (productoEncontrado) {
        productoEncontrado.cantidad += 1;
    } else {
        carrito.push({ 
            nombre: nombre, 
            precio: parseFloat(precio), 
            cantidad: 1, 
            id_producto: id_producto 
        });
    }
    actualizarListaCarrito();
}



// Función para actualizar la lista del carrito en el modal
function actualizarListaCarrito() {
    listaCarrito.innerHTML = '';
    let total = 0;

    carrito.forEach(item => {
        var li = document.createElement("li");
        li.innerHTML = `
            ${item.nombre} - $${item.precio} x
            <button class="btn-ajustar" onclick="ajustarCantidad('${item.nombre}', -1)">-</button> 
            <span id="cantidad-${item.nombre}">${item.cantidad}</span> 
            <button class="btn-ajustar" onclick="ajustarCantidad('${item.nombre}', 1)">+</button>
            <button class="btn-eliminar" onclick="eliminarProducto('${item.nombre}')">x</button>
        `;
        listaCarrito.appendChild(li);
        total += item.precio * item.cantidad;
    });

    // Actualizar el texto del total del carrito con formato colombiano
    totalCarrito.textContent = total.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Agregar el total al arreglo carrito como propiedad global, también con formato colombiano
    carrito.totalCarrito = total.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Función para ajustar la cantidad de un producto
function ajustarCantidad(nombre, cambio) {
    var producto = carrito.find(item => item.nombre === nombre);
    if (producto) {
        producto.cantidad += cambio;
        if (producto.cantidad <= 0) {
            eliminarProducto(nombre);
        } else {
            actualizarListaCarrito();
        }
    }
}

// Función para eliminar un producto del carrito
function eliminarProducto(nombre) {
    carrito = carrito.filter(item => item.nombre !== nombre);
    actualizarListaCarrito();
}

// Abrir el modal cuando el usuario hace clic en la imagen del carrito
btnCarro.onclick = function() {
    modal.style.display = "block";
}

// Cerrar el modal cuando el usuario hace clic en <span> (x)
span.onclick = function() {
    modal.style.display = "none";
    formularioCliente.reset();
}

// Cerrar el modal cuando el usuario hace clic en cualquier lugar fuera del modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


let productosOriginales = [];
let timer;

// Guardamos los productos originales cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", function () {
    productosOriginales = Array.from(document.getElementById("producto-encontrado").children).map(el => el.outerHTML);
});

function buscarProducto() {
    clearTimeout(timer);  // Limpiar cualquier temporizador anterior

    let busqueda = document.getElementById("nombre_venta").value.trim();
    let productoEncontrado = document.getElementById("producto-encontrado");

    if (busqueda.length >= 3) {
        // Establecer un temporizador para ejecutar la búsqueda después de que el usuario deje de escribir
        timer = setTimeout(() => {
            fetch(`/busqueda_productos?busqueda=${encodeURIComponent(busqueda)}`)
                .then(response => {
                    if (!response.ok) throw new Error("Error en la respuesta del servidor");
                    return response.json();
                })
                .then(datos => {
                    productoEncontrado.innerHTML = "";

                    if (datos.length === 0) {
                        mensaje_modal_incorrecto.textContent = "No se encontraron productos";
                        modal_incorrecto.classList.add('mostrar_modal_no_realizado');
                        boton_modal_incorrecto.onclick = () => modal_incorrecto.classList.remove('mostrar_modal_no_realizado');
                    } else {
                        modal_incorrecto.classList.remove('mostrar_modal_no_realizado');
                        datos.forEach(resultado => {
                            let productoHTML = `
                            <div class="tarjeta ${resultado[3] <= 0 ? 'agotado' : ''}">
                                <div class="contenedor">
                                    <figure>
                                        <img src="/static/img_producto/${resultado[5]}" alt="Imagen del producto">
                                    </figure>
                                    <h2>${resultado[0]}</h2>
                                    <p>Precio: $ ${resultado[1]}</p>
                                    <p>Categoría: ${resultado[2]}</p>
                                    <p>Unidades: ${resultado[3]}</p>
                                    <p hidden>ID: ${resultado[4]}</p>
                                    <button class="btn-carrito" onclick="agregarAlCarrito('${resultado[0]}', '${resultado[1]}', '${resultado[4]}')">
                                        Añadir al carrito
                                    </button>
                                    ${resultado[3] <= 5 ? '<h3 style="color: red;">¡Producto agotado!</h3>' : ''}
                                </div>
                            </div>`;
                            productoEncontrado.innerHTML += productoHTML;
                        });
                    }
                })
                .catch(error => console.error("Error al buscar productos:", error));
        }, 500);  // Retrasar 500ms después de que el usuario deje de escribir
    } else {
        productoEncontrado.innerHTML = productosOriginales.join('');
        modal_incorrecto.classList.remove('mostrar_modal_no_realizado');
    }
}





let timerCliente;  // Variable para manejar el temporizador

function buscarCliente() {
    clearTimeout(timerCliente);  // Limpiar cualquier temporizador anterior

    let cedula = document.getElementById("identificacion_cliente").value.trim();

    if (cedula.length > 7) {
        // Establecer temporizador para esperar que el usuario termine de escribir
        timerCliente = setTimeout(() => {
            fetch(`/buscar_cliente?cedula=${encodeURIComponent(cedula)}`)
                .then(response => {
                    if (!response.ok) throw new Error("Error en la respuesta del servidor");
                    return response.json();
                })
                .then(datos => {
                    if (datos.encontrado) {
                        document.getElementById("nombreCliente").value = datos.nombreCliente;
                        document.getElementById("telefonoCliente").value = datos.telefonoCliente;
                        document.getElementById("correoCliente").value = datos.correoCliente;
                    } else {
                        document.getElementById("nombreCliente").value = "";
                        document.getElementById("correoCliente").value = "";
                        document.getElementById("telefonoCliente").value = "";
                    }
                })
                .catch(error => console.error("❌ Error al buscar cliente:", error));
        }, 500); // Esperar 5 segundos (5000 ms) después de que el usuario deje de escribir
    }
}



function vender() {
    if (carrito.length === 0) {
        mensaje_modal_incorrecto.textContent = 'El carrito está vacío. Añada productos antes de realizar la venta';
        modal_incorrecto.classList.add('mostrar_modal_no_realizado');
        boton_modal_incorrecto.onclick = () => modal_incorrecto.classList.remove('mostrar_modal_no_realizado');
        return;
    }

    let cliente = {
        nombre: nombreCliente.value || "no aplica",
        identificacion: identificacionCliente.value,
        correo: correoCliente.value || "no aplica",
        telefono: telefonoCliente.value || "no aplica",
        metodo_pago: metodo_pago.value
    };
    

    fetch('/procesar_venta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente, carrito })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mensaje_exitoso.textContent = data.success;
            modal_alerta.classList.add('mostrar_modal');
            boton_aceptar.onclick = () => window.location.href = "/venta_productos";

            carrito = [];
            actualizarListaCarrito();
            formularioCliente.reset();
            modal.style.display = "none";
        } else if (data.stock_error) {
            mensaje_modal_incorrecto.textContent = data.stock_error;
            modal_incorrecto.classList.add('mostrar_modal_no_realizado');
            boton_modal_incorrecto.onclick = () => modal_incorrecto.classList.remove('mostrar_modal_no_realizado');
        } else if (data.cliente_vacio) {
            mensaje_modal_incorrecto.textContent = data.cliente_vacio;
            modal_incorrecto.classList.add('mostrar_modal_no_realizado');
            boton_modal_incorrecto.onclick = () => modal_incorrecto.classList.remove('mostrar_modal_no_realizado');
        } else {
            alert('Error: ' + (data.error || 'Error desconocido'));
        }
    })
    .catch(error => console.error('Error:', error));
}

