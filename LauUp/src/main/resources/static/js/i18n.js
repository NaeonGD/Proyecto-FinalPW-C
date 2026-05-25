// i18n.js — Sistema de internacionalización

const I18N = {
    mensajes: {},
    idiomaActual: localStorage.getItem('belleza_lang') || 'es',

    async cargar(lang = null) {
        if (lang) this.idiomaActual = lang;
        localStorage.setItem('belleza_lang', this.idiomaActual);
		document.documentElement.lang = this.idiomaActual;
		
        try {
            const res = await fetch(`https://localhost:8443/api/i18n/${this.idiomaActual}`);
            this.mensajes = await res.json();
            this.aplicar();
        } catch (e) {
            console.error('Error cargando idioma:', e);
        }
    },

    get(clave) {
        return this.mensajes[clave] || clave;
    },

    aplicar() {
		// Aplica los mensajes a todos los elementos con data-i18n
		    document.querySelectorAll('[data-i18n]').forEach(el => {
		        const clave = el.getAttribute('data-i18n');
		        const valor = this.get(clave);
		        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
		            el.placeholder = valor;
		        } else {
		            el.textContent = valor;
		        }
		    });

		    // Aplica placeholders con data-i18n-placeholder
		    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
		        const clave = el.getAttribute('data-i18n-placeholder');
		        el.placeholder = this.get(clave);
		    });

		    //limpiar mensajes de error al cambiar idioma
		    document.querySelectorAll('.alert-error, .alert-success').forEach(el => {
		        el.style.display = 'none';
		        el.textContent = '';
		    });
    },

    cambiar(lang) {
		this.cargar(lang).then(() => {
		        // Regenerar contenido dinámico si estamos en admin
		        if (typeof cargarProductos === 'function') cargarProductos();
		        if (typeof cargarPedidos === 'function') cargarPedidos();
		        if (typeof cargarCategorias === 'function') cargarCategorias();

		        // Regenerar productos en index y catalogo
		        if (typeof cargarProductosDestacados === 'function') cargarProductosDestacados();
		        if (typeof cargarCategorias === 'function' && typeof cargarCategoriasFiltro === 'function') {
		            cargarCategoriasFiltro();
		            cargarTodosProductos();
		        }

		        // Regenerar carrito
		        if (typeof renderCarrito === 'function') renderCarrito();
		    });

		    // Actualizar botones activos
		    document.querySelectorAll('.lang-btn').forEach(btn => {
		        btn.classList.toggle('active', btn.dataset.lang === lang);
		    });
    }
	
};

// Cargar idioma al iniciar
document.addEventListener('DOMContentLoaded', () => I18N.cargar());