// catalogo.js — Lógica de la página catálogo

let todosLosProductos = [];

const ICONOS_CAT = {
    'Maquillaje':       '💄',
    'Cuidado Facial':   '🧴',
    'Cuidado Capilar':  '💆',
    'Fragancias':       '🌸',
    'Cuidado Corporal': '✨'
};

document.addEventListener('DOMContentLoaded', async () => {
    await cargarCategoriasFiltro();
    await cargarTodosProductos();

    const params = new URLSearchParams(window.location.search);
    const catId  = params.get('cat');
    if (catId) {
        const radio = document.querySelector(`input[name="cat"][value="${catId}"]`);
        if (radio) { radio.checked = true; filtrar(); }
    }
});

async function cargarCategoriasFiltro() {
    const contenedor = document.getElementById('filtro-categorias');
    try {
        const cats = await API.getCategorias();
        cats.forEach(c => {
            const label = document.createElement('label');
            label.className = 'radio-label';
            label.innerHTML = `
                <input type="radio" name="cat" value="${c.id}" onchange="filtrar()"/>
                ${ICONOS_CAT[c.nombre] || '🌟'} ${c.nombre}
            `;
            contenedor.appendChild(label);
        });
    } catch { /* silencioso */ }
}

async function cargarTodosProductos() {
    try {
        todosLosProductos = await API.getProductos();
        renderProductos(todosLosProductos);
    } catch {
        document.getElementById('productos-catalogo').innerHTML =
            '<p class="text-muted">Error al cargar productos.</p>';
    }
}

function filtrar() {
    const buscar = document.getElementById('input-buscar').value.toLowerCase();
    const catId  = document.querySelector('input[name="cat"]:checked')?.value || '';
    const orden  = document.getElementById('select-orden').value;

    let resultado = todosLosProductos.filter(p => {
        const coincideNombre = p.nombre.toLowerCase().includes(buscar);
        const coincideCat    = !catId || String(p.categoria?.id) === catId;
        return coincideNombre && coincideCat;
    });

    if (orden === 'precio-asc')  resultado.sort((a, b) => a.precio - b.precio);
    if (orden === 'precio-desc') resultado.sort((a, b) => b.precio - a.precio);
    if (orden === 'nombre')      resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));

    renderProductos(resultado);
}

function renderProductos(lista) {
    const grid  = document.getElementById('productos-catalogo');
    const count = document.getElementById('resultado-count');
    count.textContent = `${lista.length} producto${lista.length !== 1 ? 's' : ''} encontrado${lista.length !== 1 ? 's' : ''}`;

    if (!lista.length) {
        grid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:4rem 0">
                <p style="font-size:3rem">🔍</p>
                <p class="text-muted">No encontramos productos con esos filtros.</p>
            </div>`;
        return;
    }

    grid.innerHTML = lista.map(p => {
        const precio = new Intl.NumberFormat('es-CO', {
            style: 'currency', currency: 'COP', minimumFractionDigits: 0
        }).format(p.precio);

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
    }).join('');
}