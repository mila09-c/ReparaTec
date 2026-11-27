import { cargarParciales } from './main.js';

document.addEventListener('DOMContentLoaded', async () => {
  await cargarParciales({ mostrarNav: false });

  const form = document.getElementById('form-registro');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const campos = ['Nombre_Usuario', 'Apellido', 'Correo', 'Telefono', 'ID_Rol', 'Contrasena_hash'];
    campos.forEach((id) => {
      const err = document.getElementById(`error-${id}`);
      if (err) err.textContent = '';
    });

    let valido = true;
    const nombre = document.getElementById('Nombre_Usuario')?.value.trim();
    const apellido = document.getElementById('Apellido')?.value.trim();
    const correo = document.getElementById('Correo')?.value.trim();
    const rol = document.getElementById('ID_Rol')?.value;
    const pass = document.getElementById('Contrasena_hash')?.value.trim();

    if (!nombre) {
      const el = document.getElementById('error-Nombre_Usuario');
      if (el) el.textContent = 'Ingresa tu nombre.';
      valido = false;
    }
    if (!apellido) {
      const el = document.getElementById('error-Apellido');
      if (el) el.textContent = 'Ingresa tu apellido.';
      valido = false;
    }
    if (!correo || !correo.includes('@')) {
      const el = document.getElementById('error-Correo');
      if (el) el.textContent = 'Ingresa un correo válido.';
      valido = false;
    }
    if (!rol) {
      const el = document.getElementById('error-ID_Rol');
      if (el) el.textContent = 'Selecciona un rol.';
      valido = false;
    }
    if (!pass || pass.length < 6) {
      const el = document.getElementById('error-Contrasena_hash');
      if (el) el.textContent = 'La contraseña debe tener al menos 6 caracteres.';
      valido = false;
    }

    if (!valido) return;

    window.location.href = '/login.html';
  });
});