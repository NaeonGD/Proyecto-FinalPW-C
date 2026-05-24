// api.js — Comunicación con el backend Spring Boot
const BASE_URL = 'https://localhost:8443';

const API = {
	// Obtener token guardado
	getToken() {
	    const usuario = JSON.parse(localStorage.getItem('belleza_user') || 'null');
	    return usuario?.token || null;
	},

	// Headers con token JWT
	getHeaders() {
	    const headers = { 'Content-Type': 'application/json' };
	    const token = this.getToken();
	    if (token) headers['Authorization'] = 'Bearer ' + token;
	    return headers;
	},

	async get(endpoint) {
	    const res = await fetch(BASE_URL + endpoint, {
	        headers: this.getHeaders()
	    });
	    return res.json();
	},

	async post(endpoint, body) {
	    const res = await fetch(BASE_URL + endpoint, {
	        method: 'POST',
	        headers: this.getHeaders(),
	        body: JSON.stringify(body)
	    });
	    return res.json();
	},

	async put(endpoint, body) {
	    const res = await fetch(BASE_URL + endpoint, {
	        method: 'PUT',
	        headers: this.getHeaders(),
	        body: JSON.stringify(body)
	    });
	    return res.json();
	},

	async patch(endpoint) {
	    const res = await fetch(BASE_URL + endpoint, {
	        method: 'PATCH',
	        headers: this.getHeaders()
	    });
	    return res.json();
	},

	async delete(endpoint) {
	    await fetch(BASE_URL + endpoint, {
	        method: 'DELETE',
	        headers: this.getHeaders()
	    });
	},

    // Atajos
    login(email, password)    { return this.post('/api/usuarios/login',   { email, password }); },
    registro(datos)           { return this.post('/api/usuarios/registro', datos); },
    getProductos(params = '') { return this.get('/api/productos' + params); },
    getCategorias()           { return this.get('/api/categorias'); },
    crearPedido(body)         { return this.post('/api/pedidos', body); }
};