import { obtenerUsuarios, obtenerUsuario, obtenerRoles } from './datos.js';
import { cargarParciales } from './main.js';

document.addEventListener('DOMContentLoaded', async () => {
  await cargarParciales({ mostrarNav: true });

  // 1. Tabla de usuarios (usuarios-lista.html)
  const tablaBody = document.getElementById('tabla-usuarios-body');
  const mensajeVacio = document.getElementById('mensaje-vacio');

  if (tablaBody) {
    let lista = [];
    try {
      lista = await obtenerUsuarios();
    } catch {
      lista = [];
    }

    if (!lista || lista.length === 0) {
      if (mensajeVacio) mensajeVacio.style.display = 'block';
    } else {
      if (mensajeVacio) mensajeVacio.style.display = 'none';
      tablaBody.innerHTML = lista
        .map((u) => {
          const id = u.id ?? u.ID_Usuario ?? '';
          const nombre =
            u.nombre ||
            [u.Nombre_Usuario, u.Apellido].filter(Boolean).join(' ') ||
            'N/D';
          const correo = u.correo || u.Correo || 'N/D';
          const telefono = u.telefono || u.Telefono || 'N/D';
          const rol = u.rol || u.Nombre_Rol || 'N/D';
          const fecha = u.fecha_registro || u.Fecha_registro || 'N/D';
          const estado = u.estado || u.Estado || 'Activo';
          const claseEstado = String(estado).toLowerCase();

          return `
            <tr>
              <td>#${id}</td>
              <td>${nombre}</td>
              <td>${correo}</td>
              <td>${telefono}</td>
              <td>${rol}</td>
              <td>${fecha}</td>
              <td><span class="status-badge ${claseEstado}">${estado}</span></td>
              <td>
                <a href="usuario-detalle.html?id=${id}" class="btn btn-secondary btn-sm">Ver</a>
                <a href="usuario-form.html?id=${id}" class="btn btn-primary btn-sm">Editar</a>
              </td>
            </tr>
          `;
        })
        .join('');
    }
  }

  // 2. Catálogo de roles en usuarios-lista.html (si existe en el HTML)
  const tablaRolesBody = document.getElementById('tabla-roles-body');
  if (tablaRolesBody && typeof obtenerRoles === 'function') {
    let rolesLista = [];
    try {
      rolesLista = await obtenerRoles();
    } catch {
      rolesLista = [];
    }

    if (rolesLista.length) {
      tablaRolesBody.innerHTML = rolesLista
        .map((r) => {
          const idRol = r.ID_Rol ?? r.id ?? '';
          const nombreRol = r.Nombre_Rol ?? r.nombre ?? 'N/D';
          const descRol = r.Descripcion ?? r.descripcion ?? 'Sin descripción';
          const estadoRol = r.Estado ?? r.estado ?? 'Activo';

          return `
            <tr>
              <td>#${idRol}</td>
              <td>${nombreRol}</td>
              <td>${descRol}</td>
              <td><span class="status-badge ${String(estadoRol).toLowerCase()}">${estadoRol}</span></td>
            </tr>
          `;
        })
        .join('');
    }
  }

  // 3. Detalle de usuario (usuario-detalle.html)
  const detalleContenedor = document.getElementById('detalle-usuario');
  const mensajeNoExiste = document.getElementById('mensaje-no-existe');

  if (detalleContenedor) {
    const params = new URLSearchParams(globalThis.location.search);
    const id = params.get('id');
    let usuario = null;

    try {
      usuario = id ? await obtenerUsuario(id) : null;
    } catch {
      usuario = null;
    }

    if (usuario) {
      const idUsuario = usuario.id ?? usuario.ID_Usuario ?? id;
      const nombre =
        usuario.nombre ||
        [usuario.Nombre_Usuario, usuario.Apellido].filter(Boolean).join(' ') ||
        'N/D';

      document.getElementById('det-id').textContent = `#${idUsuario}`;
      document.getElementById('det-nombre').textContent = nombre;
      document.getElementById('det-correo').textContent = usuario.correo || usuario.Correo || 'N/D';
      document.getElementById('det-telefono').textContent = usuario.telefono || usuario.Telefono || 'N/D';
      document.getElementById('det-rol').textContent = usuario.rol || usuario.Nombre_Rol || 'N/D';
      document.getElementById('det-fecha').textContent = usuario.fecha_registro || usuario.Fecha_registro || 'N/D';
      document.getElementById('det-estado').textContent = usuario.estado || usuario.Estado || 'Activo';
      document.getElementById('btn-editar-detalle').href = `usuario-form.html?id=${idUsuario}`;
    } else {
      detalleContenedor.style.display = 'none';
      if (mensajeNoExiste) mensajeNoExiste.style.display = 'block';
    }
  }

  // 4. Formulario crear / editar usuario (usuario-form.html)
  const formUsuario = document.getElementById('form-usuario');

  if (formUsuario) {
    const params = new URLSearchParams(globalThis.location.search);
    const id = params.get('id');

    if (id) {
      const tituloEl = document.getElementById('form-titulo');
      if (tituloEl) tituloEl.textContent = 'Editar Usuario';

      let usuario = null;
      try {
        usuario = await obtenerUsuario(id);
      } catch {
        usuario = null;
      }

      if (usuario) {
        document.getElementById('Nombre_Usuario').value =
          usuario.Nombre_Usuario || usuario.nombre?.split(' ')[0] || '';
        document.getElementById('Apellido').value =
          usuario.Apellido || usuario.nombre?.split(' ').slice(1).join(' ') || '';
        document.getElementById('Correo').value = usuario.Correo || usuario.correo || '';
        document.getElementById('Telefono').value = usuario.Telefono || usuario.telefono || '';
        document.getElementById('ID_Rol').value = usuario.ID_Rol || '';
        document.getElementById('Estado').value = usuario.Estado || usuario.estado || 'Activo';
      }
    }

    formUsuario.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = document.getElementById('Nombre_Usuario').value.trim();
      const apellido = document.getElementById('Apellido').value.trim();
      const correo = document.getElementById('Correo').value.trim();
      const contrasena = document.getElementById('Contrasena_hash').value.trim();
      const telefono = document.getElementById('Telefono').value.trim();
      const idRol = document.getElementById('ID_Rol').value;

      if (!nombre || !apellido || !correo || (!id && !contrasena) || !telefono || !idRol) {
        alert('Por favor completa todos los campos obligatorios.');
        return;
      }

      alert('Usuario guardado correctamente.');
      globalThis.location.href = 'usuarios-lista.html';
    });
  }
});