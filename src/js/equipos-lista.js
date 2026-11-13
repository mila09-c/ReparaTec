import { cargarParciales } from './main.js';
import { obtenerEquipos } from './datos_equipo.js';

document.addEventListener('DOMContentLoaded', async () => {
  await cargarParciales({ mostrarNav: true });

  const tbody = document.getElementById('tabla-equipos-body');
  const equipos = await obtenerEquipos();

  if (!equipos || equipos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state" style="text-align: center; padding: 2rem;">
          <p>No hay equipos registrados en el sistema actualmente.</p>
          <a href="/formulario-equipo.html" class="btn-positivo" style="margin-top: 1rem;">Registrar el primer equipo</a>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = equipos
    .map(
      (eq) => `
      <tr>
        <td><strong>${eq.Codigo_inventario}</strong></td>
        <td>${eq.Marca} ${eq.Modelo}</td>
        <td>${eq.Procesador || 'N/D'} / ${eq.Memoria_ram || 'N/D'}</td>
        <td>${eq.Sistema_operativo || 'N/D'}</td>
        <td><span class="estado-pill">${eq.Estado_equipo}</span></td>
        <td>
          <a href="/detalle-equipo.html?id=${eq.ID_Equipo}" class="btn-accion-tabla">Ver detalle</a>
        </td>
      </tr>
    `
    )
    .join('');
});