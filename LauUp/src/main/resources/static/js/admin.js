// admin.js — Lógica del panel de administrador

let categorias = [];

// Verificar que sea admin
const usuario = authActual();
if (!usuario || usuario.rol !== 'ADMIN') {
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    cargarCategorias();
});

// __ Navegación __________________________________________________

function mostrarSeccion(sec) {
	document.querySelectorAll('.admin-seccion').forEach(s => {
	        s.style.display = 'none';
	        s.setAttribute('aria-hidden', 'true');
	    });
	    document.querySelectorAll('.admin-link').forEach(l => {
	        l.classList.remove('active');
	        l.removeAttribute('aria-current');
	    });

	    const seccion = document.getElementById('sec-' + sec);
	    seccion.style.display = 'block';
	    seccion.setAttribute('aria-hidden', 'false');

	    event.target.classList.add('active');
	    event.target.setAttribute('aria-current', 'page');

    if (sec === 'productos')  cargarProductos();
    if (sec === 'pedidos')    cargarPedidos();
    if (sec === 'categorias') cargarCategorias();
}

// __ PRODUCTOS __________________________________________________

async function cargarProductos() {
    const tbody = document.getElementById('tabla-productos');
    const productos = await API.getProductos();
    tbody.innerHTML = productos.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td>${p.categoria?.nombre || '-'}</td>
            <td>${formatPrecio(p.precio)}</td>
            <td>
                <span class="${p.stock <= 5 ? 'stock-bajo' : ''}">${p.stock}</span>
            </td>
            <td class="acciones">
                <button class="btn-editar" onclick="editarProducto(${p.id})">✏️ Editar</button>
                <button class="btn-eliminar" onclick="eliminarProducto(${p.id})">🗑️ Eliminar</button>
            </td>
        </tr>
    `).join('');
}

function abrirModalProducto() {
    document.getElementById('modal-titulo').textContent = 'Nuevo producto';
    document.getElementById('prod-id').value        = '';
    document.getElementById('prod-nombre').value    = '';
    document.getElementById('prod-precio').value    = '';
    document.getElementById('prod-stock').value     = '';
    document.getElementById('prod-descripcion').value = '';
    document.getElementById('prod-imagen').value    = '';
    cargarSelectCategorias();
    document.getElementById('modal-producto').style.display = 'flex';
}

function cerrarModalProducto() {
    document.getElementById('modal-producto').style.display = 'none';
}

async function editarProducto(id) {
    const p = await API.get('/api/productos/' + id);
    document.getElementById('modal-titulo').textContent     = 'Editar producto';
    document.getElementById('prod-id').value                = p.id;
    document.getElementById('prod-nombre').value            = p.nombre;
    document.getElementById('prod-precio').value            = p.precio;
    document.getElementById('prod-stock').value             = p.stock;
    document.getElementById('prod-descripcion').value       = p.descripcion || '';
    document.getElementById('prod-imagen').value            = p.imagenUrl   || '';
    await cargarSelectCategorias(p.categoria?.id);
    document.getElementById('modal-producto').style.display = 'flex';
}

async function cargarSelectCategorias(seleccionadaId = null) {
    const select = document.getElementById('prod-categoria');
    const cats   = await API.getCategorias();
    select.innerHTML = cats.map(c => `
        <option value="${c.id}" ${c.id == seleccionadaId ? 'selected' : ''}>${c.nombre}</option>
    `).join('');
}

async function guardarProducto() {
	const id          = document.getElementById('prod-id').value;
	    const categoriaId = document.getElementById('prod-categoria').value;
	    const datos = {
	        nombre:      document.getElementById('prod-nombre').value.trim(),
	        precio:      parseFloat(document.getElementById('prod-precio').value),
	        stock:       parseInt(document.getElementById('prod-stock').value),
	        descripcion: document.getElementById('prod-descripcion').value.trim(),
	        imagenUrl:   document.getElementById('prod-imagen').value.trim(),
	        activo:      true,
	        categoria:   { id: parseInt(categoriaId) }
	    };

	    if (!datos.nombre || !datos.precio) {
	        alert(I18N.get('js.confirmarEliminar'));
	        return;
	    }

	    if (id) {
	        await API.put('/api/productos/' + id, datos);
	    } else {
	        await API.post('/api/productos', datos);
	    }

	    cerrarModalProducto();
	    cargarProductos();
	    mostrarToastAdmin(I18N.get('js.productoGuardado') + ' ✅');
}

async function eliminarProducto(id) {
	if (!confirm(I18N.get('js.confirmarEliminar'))) return;
	    await API.delete('/api/productos/' + id);
	    cargarProductos();
	    mostrarToastAdmin(I18N.get('js.productoEliminado') + ' ✅');
}

// __ PEDIDOS __________________________________________________

async function cargarPedidos() {
    const tbody  = document.getElementById('tabla-pedidos');
    const pedidos = await API.get('/api/pedidos');
    tbody.innerHTML = pedidos.map(p => `
        <tr>
            <td>#${p.id}</td>
            <td>${p.direccionEnvio || 'Sin Dirreccion'}</td>
            <td>${formatPrecio(p.total)}</td>
            <td><span class="badge-estado estado-${p.estado.toLowerCase()}">${p.estado}</span></td>
            <td>${new Date(p.creadoEn).toLocaleDateString('es-CO')}</td>
            <td>
                <select class="select-estado" onchange="cambiarEstadoPedido(${p.id}, this.value)">
                    <option value="PENDIENTE"  ${p.estado==='PENDIENTE'  ? 'selected':''}>Pendiente</option>
                    <option value="PAGADO"     ${p.estado==='PAGADO'     ? 'selected':''}>Pagado</option>
                    <option value="ENVIADO"    ${p.estado==='ENVIADO'    ? 'selected':''}>Enviado</option>
                    <option value="ENTREGADO"  ${p.estado==='ENTREGADO'  ? 'selected':''}>Entregado</option>
                    <option value="CANCELADO"  ${p.estado==='CANCELADO'  ? 'selected':''}>Cancelado</option>
                </select>
            </td>
        </tr>
    `).join('');
}

async function cambiarEstadoPedido(id, estado) {
	try {
	   const res = await fetch(`https://localhost:8443/api/pedidos/${id}/estado?estado=${estado}`, {
	   method: 'PATCH'
	   });
	   const data = await res.json();
	   if (data.error) {
	       mostrarToastAdmin('Error: ' + data.error);
	   return;
	   }
	       mostrarToastAdmin(I18N.get('js.estadoActualizado') + ' ✅');
	       setTimeout(() => cargarPedidos(), 1000);
	   } catch (e) {
	       mostrarToastAdmin(I18N.get('js.errorConexion'));
	   }
}

// __ CATEGORIAS __________________________________________________

async function cargarCategorias() {
    const tbody = document.getElementById('tabla-categorias');
    if (!tbody) return;
    const cats = await API.getCategorias();
    tbody.innerHTML = cats.map(c => `
        <tr>
            <td>${c.id}</td>
            <td>${c.nombre}</td>
            <td>${c.descripcion || '-'}</td>
        </tr>
    `).join('');
}

function abrirModalCategoria() {
    document.getElementById('cat-nombre').value      = '';
    document.getElementById('cat-descripcion').value = '';
    document.getElementById('modal-categoria').style.display = 'flex';
}

function cerrarModalCategoria() {
    document.getElementById('modal-categoria').style.display = 'none';
}

async function guardarCategoria() {
	const nombre      = document.getElementById('cat-nombre').value.trim();
	    const descripcion = document.getElementById('cat-descripcion').value.trim();
	    if (!nombre) { 
	        alert(I18N.get('js.confirmarEliminar')); 
	        return; 
	    }
	    await API.post('/api/categorias', { nombre, descripcion });
	    cerrarModalCategoria();
	    cargarCategorias();
	    mostrarToastAdmin(I18N.get('js.categoriaCreada') + ' ✅');
}

// __ Utilidades __________________________________________________

function formatPrecio(n) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', minimumFractionDigits: 0
    }).format(n);
}

function mostrarToastAdmin(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3000);
}

function cerrarSesion() {
    localStorage.removeItem('belleza_user');
    window.location.href = 'index.html';
}
