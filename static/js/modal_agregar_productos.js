document.addEventListener('DOMContentLoaded', (event) => {
    const boton_productos = document.querySelector('.boton_agregar_productos');
    const modal__productos = document.querySelector('.modal_productos');
    const boton_cerrar = document.querySelector('.boton_');

    boton_productos.addEventListener('click', (e) => {
        e.preventDefault();
        modal__productos.classList.add('mostrar_modal');
    });

    boton_cerrar.addEventListener('click', (e) => {
        e.preventDefault();
        modal__productos.classList.remove('mostrar_modal');
    });
});