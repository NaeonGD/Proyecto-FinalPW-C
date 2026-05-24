// carrito.js — Lógica del carrito de compras
let carrito = JSON.parse(localStorage.getItem('belleza_carrito') || '{}');

function guardarCarrito() {
    localStorage.setItem('belleza_carrito', JSON.stringify(carrito));
}

function agregarAlCarrito(producto) {
    const id = String(producto.id);
    if (carrito[id]) {
        carrito[id].cantidad++;
    } else {
        carrito[id] = { producto, cantidad: 1 };
    }
    guardarCarrito();
    actualizarBadge();
    mostrarToast(I18N.get('js.agregado'));
}

function quitarDelCarrito(id) {
    delete carrito[String(id)];
    guardarCarrito();
    actualizarBadge();
    renderCarrito();
}

function cambiarCantidad(id, delta) {
    const key = String(id);
    if (!carrito[key]) return;
    carrito[key].cantidad += delta;
    if (carrito[key].cantidad <= 0) delete carrito[key];
    guardarCarrito();
    actualizarBadge();
    renderCarrito();
}

function totalCarrito() {
    return Object.values(carrito).reduce((acc, item) =>
        acc + item.producto.precio * item.cantidad, 0);
}

function cantidadTotalCarrito() {
    return Object.values(carrito).reduce((acc, item) => acc + item.cantidad, 0);
}

function actualizarBadge() {
    const badge = document.getElementById('badge-carrito');
    if (badge) {
        const n = cantidadTotalCarrito();
        badge.textContent = n;
        badge.style.display = n > 0 ? 'inline' : 'none';
    }
}

function renderCarrito() {
    const contenedor = document.getElementById('carrito-items');
    const totalEl    = document.getElementById('carrito-total-val');
    if (!contenedor) return;

    const items = Object.values(carrito);
    if (!items.length) {
        contenedor.innerHTML = `
		<div class="carrito-vacio">
		            <span style="font-size:3rem">🛒</span>
		            <p>${I18N.get('js.carritoVacio')}</p>
		            <a href="catalogo.html" class="btn-outline" onclick="cerrarCarrito()">
		                ${I18N.get('js.verProductos')}
		            </a>
		        </div>`;
        if (totalEl) totalEl.textContent = '$0';
        return;
    }

    contenedor.innerHTML = items.map(({ producto, cantidad }) => `
        <div class="carrito-item">
            <div class="ci-info">
                <span class="ci-nombre">${producto.nombre}</span>
                <span class="ci-precio">${formatPrecio(producto.precio)}</span>
            </div>
            <div class="ci-controles">
                <button onclick="cambiarCantidad(${producto.id}, -1)">−</button>
                <span>${cantidad}</span>
                <button onclick="cambiarCantidad(${producto.id}, +1)">+</button>
            </div>
            <button class="ci-quitar" onclick="quitarDelCarrito(${producto.id})">✕</button>
        </div>
    `).join('');

    if (totalEl) totalEl.textContent = formatPrecio(totalCarrito());
}

function abrirCarrito() {
    renderCarrito();
    document.getElementById('carrito-panel').classList.add('open');
    document.getElementById('overlay').classList.add('visible');
}

function cerrarCarrito() {
    document.getElementById('carrito-panel').classList.remove('open');
    document.getElementById('overlay').classList.remove('visible');
}

function checkout() {
    cerrarCarrito();
    if (!authActual()) {
        window.location.href = 'login.html';
        return;
    }
    if (!Object.keys(carrito).length) {
        mostrarToast(I18N.get('js.carritoVacioMsg'));
        return;
    }
    document.getElementById('modal-checkout').style.display = 'flex';
}

function cerrarCheckout() {
    document.getElementById('modal-checkout').style.display = 'none';
}

async function confirmarPedido() {
    const usuario   = authActual();
    const direccion = document.getElementById('input-direccion').value.trim();
    if (!direccion) { mostrarToast(I18N.get('js.ingresaDireccion')); return; }

    const carritoSimple = {};
    Object.entries(carrito).forEach(([id, { cantidad }]) => {
        carritoSimple[id] = cantidad;
    });

    try {
        const res = await API.crearPedido({
            usuarioId: usuario.id,
            direccionEnvio: direccion,
            carrito: carritoSimple
        });

        if (res.error) { mostrarToast('Error: ' + res.error); return; }

        carrito = {};
        guardarCarrito();
        actualizarBadge();
        cerrarCheckout();
        mostrarToast('js.pedidoRealizado');
        setTimeout(() => window.location.href = 'perfil.html', 2000);
    } catch (e) {
        mostrarToast(I18N.get('js.errorPedido'));
    }
}

function formatPrecio(n) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', minimumFractionDigits: 0
    }).format(n);
}

function mostrarToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => {
        t.classList.remove('show');
        setTimeout(() => t.remove(), 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', actualizarBadge);