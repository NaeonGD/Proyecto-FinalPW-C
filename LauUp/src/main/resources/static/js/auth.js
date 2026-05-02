// auth.js — Manejo de sesión del usuario

function authActual() {
    try { return JSON.parse(localStorage.getItem('belleza_user')); }
    catch { return null; }
}

function guardarAuth(usuario) {
    localStorage.setItem('belleza_user', JSON.stringify(usuario));
}

function renderNavAuth() {
    const usuario = authActual();
    const navAuth = document.getElementById('nav-auth');
    const btnUser = document.getElementById('btn-user');
    if (!navAuth) return;

    if (usuario) {
        navAuth.innerHTML = `<a href="perfil.html" class="nav-link">👤 ${usuario.nombre}</a>`;
        if (btnUser) btnUser.onclick = () => window.location.href = 'perfil.html';
    } else {
        navAuth.innerHTML = `<a href="login.html" class="nav-link">Ingresar</a>`;
        if (btnUser) btnUser.onclick = () => window.location.href = 'login.html';
    }
}

function irPerfil() {
    window.location.href = authActual() ? 'perfil.html' : 'login.html';
}

document.addEventListener('DOMContentLoaded', renderNavAuth);