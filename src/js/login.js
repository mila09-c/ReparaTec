import { api } from './api.js'
import { guardarSesion, obtenerUsuario } from './sesion.js'

if (obtenerUsuario()) location.replace('home.html')

const formulario = document.querySelector('#form-login')
const errorGeneral = document.querySelector('#error-login')
const errorCorreo = document.querySelector('#error-Correo')
const errorContrasena = document.querySelector('#error-Contrasena')
const boton = formulario.querySelector('button[type="submit"]')

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault()

  // Limpiar errores previos
  errorGeneral.hidden = true
  errorCorreo.textContent = ''
  errorContrasena.textContent = ''

  const datos = Object.fromEntries(new FormData(formulario))

  let valido = true
  if (!datos.email?.trim()) {
    errorCorreo.textContent = 'Ingresa tu correo electrónico.'
    valido = false
  }
  if (!datos.password?.trim()) {
    errorContrasena.textContent = 'Ingresa tu contraseña.'
    valido = false
  }
  if (!valido) return

  boton.disabled = true
  boton.textContent = 'Verificando...'

  try {
    const respuesta = await api.post('/api/auth/login', datos)

    guardarSesion(respuesta.token, respuesta.user)
    location.href = 'home.html'
  } catch (e) {
    errorGeneral.textContent = e.message || 'Datos incorrectos. Intenta de nuevo.'
    errorGeneral.hidden = false
  } finally {
    boton.disabled = false
    boton.textContent = 'Iniciar sesión'
  }
})
