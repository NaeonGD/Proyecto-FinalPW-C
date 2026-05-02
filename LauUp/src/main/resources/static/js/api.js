// api.js — Comunicación con el backend Spring Boot
const BASE_URL = 'http://localhost:8080';

const API = {
    async get(endpoint) {
        const res = await fetch(BASE_URL + endpoint);
        return res.json();
    },

    async post(endpoint, body) {
        const res = await fetch(BASE_URL + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return res.json();
    },

    async put(endpoint, body) {
        const res = await fetch(BASE_URL + endpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return res.json();
    },

    async delete(endpoint) {
        await fetch(BASE_URL + endpoint, { method: 'DELETE' });
    },

    // Atajos
    login(email, password)    { return this.post('/api/usuarios/login',   { email, password }); },
    registro(datos)           { return this.post('/api/usuarios/registro', datos); },
    getProductos(params = '') { return this.get('/api/productos' + params); },
    getCategorias()           { return this.get('/api/categorias'); },
    crearPedido(body)         { return this.post('/api/pedidos', body); }
};