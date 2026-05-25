// producto.js — Lógica de la página de detalle de producto

const ICONOS_CAT = {
    'Maquillaje':       '💄',
    'Cuidado Facial':   '🧴',
    'Cuidado Capilar':  '💆',
    'Fragancias':       '🌸',
    'Cuidado Corporal': '✨',
    'Utileria':         '🌟'
};

document.addEventListener('DOMContentLoaded', async () => {
    const params     = new URLSearchParams(window.location.search);
    const productoId = params.get('id');

    if (!productoId) {
        window.location.href = 'catalogo.html';
        return;
    }

    await cargarProducto(productoId);
});

async function cargarProducto(id) {
    try {
        const p = await API.get('/api/productos/' + id);
        renderProducto(p);
        await cargarRelacionados(p.categoria?.id, p.id);
    } catch {
        document.getElementById('producto-detalle').innerHTML =
            `<p class="text-muted" style="text-align:center;padding:4rem">
                ${I18N.get('js.errorProductos')}
            </p>`;
    }
}

function renderProducto(p) {
    const precio = new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', minimumFractionDigits: 0
    }).format(p.precio);

    // Actualizar título de la página y breadcrumb
    document.title = p.nombre + ' | Lau & Up.';
    document.getElementById('bread-nombre').textContent = p.nombre;

    const icono = ICONOS_CAT[p.categoria?.nombre] || '🌟';
    const agotado = p.stock <= 0;

    document.getElementById('producto-detalle').innerHTML = `
        <div class="detalle-grid">
            <!-- Imagen -->
            <div class="detalle-img">
                ${p.imagenUrl
                    ? `<img src="${p.imagenUrl}" alt="${p.nombre}"/>`
                    : `<div class="detalle-img-placeholder">${icono}</div>`
                }
            </div>

            <!-- Info -->
            <div class="detalle-info">
                <span class="producto-cat">${p.categoria?.nombre || ''}</span>
                <h1 class="detalle-titulo">${p.nombre}</h1>
                <p class="detalle-precio">${precio}</p>

                <div class="detalle-stock ${agotado ? 'agotado' : 'disponible'}">
                    ${agotado
                        ? `<span>❌ ${I18N.get('prod.agotado')}</span>`
                        : `<span>✅ ${I18N.get('prod.disponible')} (${p.stock})</span>`
                    }
                </div>

                <p class="detalle-descripcion">${p.descripcion || ''}</p>

                <div class="detalle-cantidad">
                    <label class="form-label">
                        <span data-i18n="prod.cantidad">Cantidad</span>
                    </label>
                    <div class="cantidad-controles">
                        <button onclick="cambiarCantidadDetalle(-1)" 
                                aria-label="Reducir cantidad">−</button>
                        <span id="cantidad-val">1</span>
                        <button onclick="cambiarCantidadDetalle(1)"
                                aria-label="Aumentar cantidad">+</button>
                    </div>
                </div>

                <div class="detalle-acciones">
                    <button class="btn-primary ${agotado ? 'disabled' : ''}"
                            onclick="agregarDesdeDetalle(${JSON.stringify(p).replace(/"/g, '&quot;')})"
                            ${agotado ? 'disabled' : ''}
                            aria-label="Agregar al carrito">
                        🛒 ${I18N.get('prod.agregar')}
                    </button>
                    <a href="catalogo.html" class="btn-outline" 
                       data-i18n="prod.volver">← Volver al catálogo</a>
                </div>
            </div>
        </div>
    `;
}

let cantidadDetalle = 1;

function cambiarCantidadDetalle(delta) {
    cantidadDetalle = Math.max(1, cantidadDetalle + delta);
    document.getElementById('cantidad-val').textContent = cantidadDetalle;
}

function agregarDesdeDetalle(producto) {
    for (let i = 0; i < cantidadDetalle; i++) {
        agregarAlCarrito(producto);
    }
    cantidadDetalle = 1;
    document.getElementById('cantidad-val').textContent = '1';
    abrirCarrito();
}

async function cargarRelacionados(categoriaId, productoActualId) {
    if (!categoriaId) return;
    try {
        const todos = await API.get('/api/productos?categoriaId=' + categoriaId);
        const relacionados = todos.filter(p => p.id !== productoActualId).slice(0, 4);
        if (!relacionados.length) return;

        const sec = document.getElementById('sec-relacionados');
        sec.style.display = 'block';

        document.getElementById('grid-relacionados').innerHTML = relacionados.map(p => {
            const precio = new Intl.NumberFormat('es-CO', {
                style: 'currency', currency: 'COP', minimumFractionDigits: 0
            }).format(p.precio);
            return `
                <div class="producto-card" onclick="window.location='producto.html?id=${p.id}'"
                     style="cursor:pointer">
                    <div class="producto-img">
                        ${p.imagenUrl
                            ? `<img src="${p.imagenUrl}" alt="${p.nombre}" loading="lazy"/>`
                            : `<div class="producto-img-placeholder">${ICONOS_CAT[p.categoria?.nombre] || '🌟'}</div>`
                        }
                    </div>
                    <div class="producto-body">
                        <span class="producto-cat">${p.categoria?.nombre || ''}</span>
                        <h4 class="producto-nombre">${p.nombre}</h4>
                        <div class="producto-footer">
                            <strong class="producto-precio">${precio}</strong>
                            <button class="btn-add" 
                                    onclick="event.stopPropagation(); agregarAlCarrito(${JSON.stringify(p).replace(/"/g, '&quot;')})">
                                + ${I18N.get('prod.agregar')}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch { /* silencioso */ }
}