import { cargarParciales } from './main.js';
import { obtenerRoles } from './datos.js';

document.addEventListener('DOMContentLoaded', async () => {
  await cargarParciales({ mostrarNav: false });

  const selectRol = document.getElementById('ID_Rol');
  const roles = await obtenerRoles();

  selectRol.innerHTML =
    `<option value="">Selecciona un rol...</option>` +
    roles.map((r) => `<option value="${r.ID_Rol}">${r.Nombre_Rol}</option>`).join('');

  const form = document.getElementById('login-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const correoInput = document.getElementById('Correo');
    const passInput = document.getElementById('Contrasena_hash');
    const errCorreo = document.getElementById('error-Correo');
    const errPass = document.getElementById('error-Contrasena');
    const errRol = document.getElementById('error-Rol');

    errCorreo.textContent = '';
    errPass.textContent = '';
    errRol.textContent = '';

    let esValido = true;
    const correo = correoInput.value.trim();
    const pass = passInput.value.trim();
    const rol = selectRol.value;

    const regexCorreo = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    if (!correo) {
      errCorreo.textContent = 'El correo electrónico es obligatorio.';
      esValido = false;
    } else if (!regexCorreo.test(correo)) {
      errCorreo.textContent = 'Ingresa un formato de correo válido.';
      esValido = false;
    }

    if (!pass) {
      errPass.textContent = 'La contraseña es obligatoria.';
      esValido = false;
    } else if (pass.length < 4) {
      errPass.textContent = 'La contraseña debe tener al menos 4 caracteres.';
      esValido = false;
    }

    if (!rol) {
      errRol.textContent = 'Debes seleccionar un rol de acceso.';
      esValido = false;
    }

    if (esValido) {
      sessionStorage.setItem('usuario_correo', correo);
      sessionStorage.setItem('usuario_rol', rol);
      window.location.href = '/home.html';
    }
  });
});