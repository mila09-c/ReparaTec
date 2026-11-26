import { obtenerUsuario } from './sesion.js'
import { puedeEntrar } from './permisos.js'

const usuario = obtenerUsuario()

if (!usuario) {
    location.replace('login.html')
    throw new Error('Sin sesión')
}

const paginaActual = location.pathname.split('/').pop().replace('.html', '')

if (!puedeEntrar(paginaActual, usuario.role)) {
    location.replace('home.html')
    throw new Error('Sin permiso para esta página')
}

export function formatearFecha(fecha) {
    return new Date(`${fecha}T00:00`).toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

export function iniciales(nombre) {
    return nombre
        .split(' ')
        .slice(0, 2)
        .map((palabra) => palabra[0])
        .join('')
        .toUpperCase()
}

export function crearEtiqueta(texto) {
    const etiqueta = document.createElement('span')
    const clase = texto.toLowerCase().replace('en ', '')
    etiqueta.className = `etiqueta etiqueta-${clase}`
    etiqueta.textContent = texto
    return etiqueta
}