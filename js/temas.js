const temas = document.querySelectorAll('.theme-item');
const html = document.querySelector('html');

window.addEventListener('DOMContentLoaded', () => {
    const theme = localStorage.getItem('theme');
    if (theme) {
        html.setAttribute('data-theme', theme);
    }
});


temas.forEach(theme => {
    theme.addEventListener('click', () => {
        const theme_name = theme.getAttribute('theme');
        console.log(theme_name);
        html.setAttribute('data-theme', theme_name);
        guardarTema(theme_name);
    });
});

//guardar tema
function guardarTema(theme_name) {
    localStorage.setItem('theme', theme_name);
}

//obtenemos tema
function obtenerTema() {
    return localStorage.getItem('theme');
}