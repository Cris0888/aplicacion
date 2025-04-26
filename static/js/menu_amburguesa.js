document.addEventListener("DOMContentLoaded", function() {
    let menuButton = document.querySelector(".barras__manu");
    let cajaDeInterfaces = document.getElementById("caja_de_intefaces");


    history.pushState(null, "", location.href);
    window.onpopstate = function () {
        history.pushState(null, "", location.href);
    };


    menuButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Evita que el clic se propague al `window`
        menuButton.classList.toggle("active");
        cajaDeInterfaces.classList.toggle("active");
    });

    // Cierra el menú si se toca fuera de él
    window.addEventListener("click", function(event) {
        if (!cajaDeInterfaces.contains(event.target) && !menuButton.contains(event.target)) {
            cajaDeInterfaces.classList.remove("active");
            menuButton.classList.remove("active");
        }
    });
});
