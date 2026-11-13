import { obtenerModulos, obtenerModuloPorId } from './datos.js';
import { cargarParciales } from './main.js';
document.addEventListener('DOMContentLoaded', async () => {
    await cargarParciales({ mostrarNav: true });
  const tablaBody = document.getElementById('tabla-modulos-body');
  const detalleContainer = document.getElementById('detalle-modulo-container');
  const formModulo = document.getElementById('form-modulo');

  // 1. Vista Lista
  if (tablaBody) {
    const modulos = await obtenerModulos();
    if (modulos.length === 0) {
      tablaBody.innerHTML = '<tr><td colspan="5">No hay módulos registrados.</td></tr>';
      return;
    }

    tablaBody.innerHTML = modulos.map(mod => `
      <tr>
        <td>${mod.id}</td>
        <td><strong>${mod.nombre}</strong></td>
        <td><code>${mod.ruta}</code></td>
        <td>
          <span class="${mod.estado === 'Activo' ? 'badge-activo' : 'badge-inactivo'}">
            ${mod.estado}
          </span>
        </td>
        <td>
          <a href="/modulo-detalle.html?id=${mod.id}">Ver detalle</a> |
          <a href="/modulo-form.html?id=${mod.id}">Editar</a>
        </td>
      </tr>
    `).join('');
  }

  
  if (detalleContainer) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const modulo = await obtenerModuloPorId(id);

    if (!modulo) {
      detalleContainer.innerHTML = `
        <h2>Módulo no encontrado</h2>
        <p>El registro solicitado no existe.</p>
        <a href="/modulos-lista.html" class="btn-secundario">Volver a la lista</a>
      `;
      return;
    }

    detalleContainer.innerHTML = `
      <h2>${modulo.nombre}</h2>
      <p><strong>ID:</strong> ${modulo.id}</p>
      <p><strong>Descripción:</strong> ${modulo.descripcion}</p>
      <p><strong>Ruta:</strong> <code>${modulo.ruta}</code></p>
      <p><strong>Estado:</strong> ${modulo.estado}</p>
      <div class="form-actions">
        <a href="/modulos-lista.html" class="btn-secundario">Volver</a>
        <a href="/modulo-form.html?id=${modulo.id}" class="btn-primario">Editar</a>
      </div>
    `;
  }

  
  if (formModulo) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id) {
      document.getElementById('titulo-form-modulo').textContent = 'Editar Módulo';
      const modulo = await obtenerModuloPorId(id);
      if (modulo) {
        document.getElementById('nombre').value = modulo.nombre;
        document.getElementById('descripcion').value = modulo.descripcion;
        document.getElementById('ruta').value = modulo.ruta;
        document.getElementById('estado').value = modulo.estado;
      }
    }

    formModulo.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Módulo guardado correctamente.');
      window.location.href = '/modulos-lista.html';
    });
  }
});