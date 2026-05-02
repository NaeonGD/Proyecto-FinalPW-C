// app.js — Lógica de la página de inicio (index.html)

const ICONOS_CAT = {
    'Maquillaje':       '💄',
    'Cuidado Facial':   '🧴',
    'Cuidado Capilar':  '💆',
    'Fragancias':       '🌸',
    'Cuidado Corporal': '✨'
};

document.addEventListener('DOMContentLoaded', async () => {
    await cargarCategorias();
    await cargarProductosDestacados();
});

async function cargarCategorias() {
    const grid = document.getElementById('categorias-grid');
    try {
        const cats = await API.getCategorias();
        grid.innerHTML = cats.map(c => `
            <a href="catalogo.html?cat=${c.id}" class="cat-card">
                <span class="cat-icon">${ICONOS_CAT[c.nombre] || '🌟'}</span>
                <h3 class="cat-nombre">${c.nombre}</h3>
                <p class="cat-desc">${c.descripcion || ''}</p>
            </a>
        `).join('');
    } catch {
        grid.innerHTML = '<p class="text-muted">No se pudieron cargar las categorías.</p>';
    }
}

async function cargarProductosDestacados() {
    const grid = document.getElementById('productos-grid');
    try {
        const productos = await API.getProductos();
        const destacados = productos.slice(0, 8);
        grid.innerHTML = destacados.map(renderProductoCard).join('');
    } catch {
        grid.innerHTML = '<p class="text-muted">No se pudieron cargar los productos.</p>';
    }
}

function renderProductoCard(p) {
    const precio = formatPrecio(p.precio);
    return `
        <div class="producto-card">
            <div class="producto-img">
                ${p.imagenUrl
                    ? `<img src="${p.imagenUrl}" alt="${p.nombre}" loading="lazy"/>`
                    : `<div class="producto-img-placeholder">${ICONOS_CAT[p.categoria?.nombre] || '🌟'}</div>`
                }
                ${p.stock <= 0 ? '<span class="badge-agotado">Agotado</span>' : ''}
            </div>
            <div class="producto-body">
                <span class="producto-cat">${p.categoria?.nombre || ''}</span>
                <h4 class="producto-nombre">${p.nombre}</h4>
                <p class="producto-desc">${p.descripcion || ''}</p>
                <div class="producto-footer">
                    <strong class="producto-precio">${precio}</strong>
                    <button class="btn-add ${p.stock <= 0 ? 'disabled' : ''}"
                            onclick="agregarAlCarrito(${JSON.stringify(p).replace(/"/g, '&quot;')})"
                            ${p.stock <= 0 ? 'disabled' : ''}>
                        + Agregar
                    </button>
                </div>
            </div>
        </div>
    `;
}