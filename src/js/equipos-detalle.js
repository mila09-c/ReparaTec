import { cargarParciales } from './main.js';
import { obtenerEquipo, obtenerHistorialPorEquipo } from './datos_equipo.js';

document.addEventListener('DOMContentLoaded', async () => {
  await cargarParciales({ mostrarNav: true });

  const container = document.getElementById('detalle-container');
  const tbodyHistorial = document.getElementById('tabla-historial-equipo');
  const tbodyReparaciones = document.getElementById('tabla-reparaciones-equipo');
  const params = new URLSearchParams(window.location.search);
  const idEquipo = params.get('id');

  if (!idEquipo) {
    container.innerHTML = `
      <div class="empty-state" style="text-align: center;">
        <h2>ID no especificado</h2>
        <p>No se proporcionó un identificador de equipo en la dirección URL.</p>
        <a href="/equipos.html" class="btn-positivo" style="margin-top: 1rem;">Regresar a la lista</a>
      </div>
    `;
    return;
  }

  const equipo = await obtenerEquipo(idEquipo);

  if (!equipo) {
    container.innerHTML = `
      <div class="empty-state" style="text-align: center;">
        <h2>Registro no encontrado</h2>
        <p>El equipo solicitado con ID <strong>#${idEquipo}</strong> no existe o fue eliminado de la base de datos.</p>
        <a href="/equipos.html" class="btn-positivo" style="margin-top: 1rem;">Regresar a la lista</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--color-borde); padding-bottom: 1rem;">
        <div>
          <span style="font-size: 0.85rem; color: var(--color-primario); font-weight: 600;">EQUIPO #${equipo.ID_Equipo} · ${equipo.Nombre_Categoria}</span>
          <h1 style="font-size: 1.5rem; font-weight: 700;">${equipo.Marca} ${equipo.Modelo}</h1>
        </div>
        <span class="estado-pill">${equipo.Estado_equipo}</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; font-size: 0.95rem;">
        <div><strong>Código de inventario:</strong><br>${equipo.Codigo_inventario}</div>
        <div><strong>Número de serie:</strong><br>${equipo.Numero_de_serie}</div>
        <div><strong>Categoría:</strong><br>${equipo.Nombre_Categoria}</div>
        <div><strong>Donación:</strong><br>${equipo.Donacion_Info}</div>
        <div><strong>Procesador:</strong><br>${equipo.Procesador || 'No especificado'}</div>
        <div><strong>Memoria RAM:</strong><br>${equipo.Memoria_ram || 'No especificada'}</div>
        <div><strong>Almacenamiento:</strong><br>${equipo.Capacidad_almacenamiento || 'No especificado'}</div>
        <div><strong>Sistema Operativo:</strong><br>${equipo.Sistema_operativo || 'No especificado'}</div>
        <div><strong>Perfil de rendimiento:</strong><br>${equipo.Perfil_rendimiento || 'No especificado'}</div>
        <div><strong>Fecha de registro:</strong><br>${equipo.Fecha_registro || 'No especificada'}</div>
      </div>
    </div>
  `;

  if (tbodyReparaciones) {
    tbodyReparaciones.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 1.25rem;">
          Sin diagnósticos o reparaciones registradas para este equipo.
        </td>
      </tr>
    `;
  }

  const historial = await obtenerHistorialPorEquipo(idEquipo);
  if (tbodyHistorial) {
    if (!historial || historial.length === 0) {
      tbodyHistorial.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 1.25rem;">
            No hay movimientos registrados en el historial de este equipo.
          </td>
        </tr>
      `;
    } else {
      tbodyHistorial.innerHTML = historial
        .map(
          (mov) => `
          <tr>
            <td>${mov.Fecha_movimiento}</td>
            <td><span class="estado-pill">${mov.Tipo_movimiento}</span></td>
            <td>${mov.Descripcion}</td>
            <td>${mov.Ubicacion_anterior}</td>
            <td>${mov.Ubicacion_nueva}</td>
          </tr>
        `
        )
        .join('');
    }
  }
});