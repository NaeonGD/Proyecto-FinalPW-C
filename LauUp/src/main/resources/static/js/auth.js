// auth.js — Manejo de sesión del usuario con JWT

function authActual() {
    try {
        const data = JSON.parse(localStorage.getItem('belleza_user'));
        if (!data || !data.token) return null;
        return data;
    } catch { return null; }
}

function guardarAuth(data) {
    // data tiene { token, usuario }
    const guardar = {
        ...data.usuario,
        token: data.token
    };
    localStorage.setItem('belleza_user', JSON.stringify(guardar));
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