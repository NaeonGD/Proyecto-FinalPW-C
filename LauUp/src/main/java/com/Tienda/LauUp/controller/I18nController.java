package com.Tienda.LauUp.controller;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import org.springframework.context.MessageSource;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/i18n")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class I18nController {

	private final MessageSource messageSource;
	
	@GetMapping("/{lang}")
	public Map<String, String> getMensajes(@PathVariable String lang) {
		Locale locale;
		if ("en".equals(lang)) {
            locale = Locale.ENGLISH;
        } else if ("fr".equals(lang)) {
            locale = Locale.FRENCH;
        } else {
        	locale = Locale.forLanguageTag("es");
        }
		
		String[] claves = {
	            "nav.inicio", "nav.catalogo", "nav.ingresar", "nav.cerrarSesion",
	            "hero.tag", "hero.titulo", "hero.subtitulo", "hero.boton",
	            "sec.categorias", "sec.destacados", "sec.verTodos",
	            "prod.agregar", "prod.agotado",
	            "carrito.titulo", "carrito.vacio", "carrito.total", "carrito.pagar",
	            "checkout.titulo", "checkout.direccion", "checkout.placeholder",
	            "checkout.cancelar", "checkout.confirmar",
	            "login.titulo", "login.email", "login.password", "login.boton",
	            "login.sinCuenta", "login.registrate",
	            "reg.titulo", "reg.nombre", "reg.apellido", "reg.telefono",
	            "reg.boton", "reg.conCuenta", "reg.inicia",
	            "perfil.titulo", "perfil.pedidos", "perfil.guardar", "perfil.cerrar",
	            "footer.texto", "lang.es", "lang.en", "lang.fr","perfil.direccion",
	            "admin.productos", "admin.pedidos", "admin.categorias",
	            "admin.gestionProductos", "admin.gestionPedidos", "admin.gestionCategorias",
	            "admin.nuevoProducto", "admin.nuevaCategoria",
	            "admin.nombre", "admin.categoria", "admin.precio", "admin.stock",
	            "admin.acciones", "admin.usuario", "admin.total", "admin.estado",
	            "admin.fecha", "admin.cambiarEstado", "admin.descripcion",
	            "admin.imagen", "admin.verTienda"
	        };
		
		Map<String, String> mensajes = new HashMap<>();
		for (String clave : claves) {
            try {
                mensajes.put(clave, messageSource.getMessage(clave, null, clave, locale));
            } catch (Exception e) {
                mensajes.put(clave, clave);
            }
            }
        return mensajes;
		
	}
}
