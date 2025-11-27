

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("formNoticia");
    const inputs = document.querySelectorAll(".input");

    inputs.forEach(input => {
        input.addEventListener("focus", () => {
            input.style.borderColor = "#1d7a37";
        });

        input.addEventListener("blur", () => {
            input.style.borderColor = "#3ea34f";
        });
    });

    form.addEventListener("submit", (e) => {
        const titulo = form.titulo.value.trim();
        const autor = form.autor.value.trim();
        const contenido = form.contenido.value.trim();

        if (!titulo || !autor || !contenido) {
            e.preventDefault();
            alert("⚠ Completa todos los campos antes de enviar.");
        }
    });

});
