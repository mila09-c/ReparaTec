import { obtenerUsuarios, obtenerUsuario } from './datos.js';


const tablaBody = document.getElementById('tabla-usuarios-body');
const mensajeVacio = document.getElementById('mensaje-vacio');

if (tablaBody) {
  const lista = await obtenerUsuarios();

  if (!lista || lista.length === 0) {
    mensajeVacio.style.display = 'block';
  } else {
    tablaBody.innerHTML = lista
      .map(
        (u) => `
      <tr>
        <td>#${u.id}</td>
        <td>${u.nombre}</td>
        <td>${u.correo}</td>
        <td>${u.rol}</td>
        <td><span class="status-badge ${u.estado.toLowerCase()}">${u.estado}</span></td>
        <td>
          <a href="usuario-detalle.html?id=${u.id}" class="btn btn-secondary btn-sm">Ver</a>
          <a href="usuario-form.html?id=${u.id}" class="btn btn-primary btn-sm">Editar</a>
        </td>
      </tr>
    `
      )
      .join('');
  }
}


const detalleContenedor = document.getElementById('detalle-usuario');
const mensajeNoExiste = document.getElementById('mensaje-no-existe');

if (detalleContenedor) {
  const params = new URLSearchParams(globalThis.location.search);
  const id = params.get('id');
  const usuario = id ? await obtenerUsuario(id) : null;

  if (usuario) {
    document.getElementById('det-id').textContent = `#${usuario.id}`;
    document.getElementById('det-nombre').textContent = usuario.nombre;
    document.getElementById('det-correo').textContent = usuario.correo;
    document.getElementById('det-rol').textContent = usuario.rol;
    document.getElementById('det-estado').textContent = usuario.estado;
    document.getElementById('btn-editar-detalle').href = `usuario-form.html?id=${usuario.id}`;
  } else {
    detalleContenedor.style.display = 'none';
    mensajeNoExiste.style.display = 'block';
  }
}


const formUsuario = document.getElementById('form-usuario');

if (formUsuario) {
  const params = new URLSearchParams(globalThis.location.search);
  const id = params.get('id');

  if (id) {
    document.getElementById('form-titulo').textContent = 'Editar Usuario';
    const usuario = await obtenerUsuario(id);
    if (usuario) {
      document.getElementById('nombre').value = usuario.nombre;
      document.getElementById('correo').value = usuario.correo;
      document.getElementById('rol').value = usuario.rol;
      document.getElementById('estado').value = usuario.estado;
    }
  }

  formUsuario.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const rol = document.getElementById('rol').value;

    if (!nombre || !correo || !rol) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    alert('Usuario guardado correctamente.');
    globalThis.location.href = 'usuarios-lista.html';
  });
}