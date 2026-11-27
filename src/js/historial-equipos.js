import { cargarParciales } from './main.js';
import { obtenerHistorialEquiposApi, obtenerEquiposApi } from './asignaciones-api.js';

document.addEventListener('DOMContentLoaded', async () => {
  await cargarParciales({ mostrarNav: true });

  const tbody = document.getElementById('tabla-historial-body');
  const mensajeEl = document.getElementById('mensaje-estado');

  const mostrarMensaje = (texto, esError = false) => {
    if (!mensajeEl) return;
    mensajeEl.innerHTML = `<div style="padding: 0.75rem 1rem; border-radius: 0.5rem; border: 1px solid ${esError ? '#dc2626' : '#16a34a'}; color: ${esError ? '#991b1b' : '#166534'}; background: ${esError ? '#fef2f2' : '#f0fdf4'};">${texto}</div>`;
  };

  try {
    const [historial, equipos] = await Promise.all([
      obtenerHistorialEquiposApi(),
      obtenerEquiposApi(),
    ]);

    if (!historial || historial.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 1.5rem;">
            No hay movimientos registrados en el historial.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = historial
      .map((h) => {
        const eq = equipos.find(
          (item) => Number(item.ID_Equipo ?? item.id) === Number(h.ID_Equipo)
        );
        const eqCodigo = h.Codigo_inventario || (eq ? eq.Codigo_inventario : 'N/D');
        const eqNombre = h.Equipo_Nombre || (eq ? `${eq.Marca} ${eq.Modelo}` : `Equipo #${h.ID_Equipo}`);

        return `
          <tr>
            <td>#${h.ID_Historial ?? h.id ?? ''}</td>
            <td>${h.Fecha_movimiento}</td>
            <td><strong>${eqCodigo}</strong><br><small>${eqNombre}</small></td>
            <td><span class="estado-pill">${h.Tipo_movimiento}</span></td>
            <td>${h.Descripcion}</td>
            <td>${h.Ubicacion_anterior}</td>
            <td>${h.Ubicacion_nueva}</td>
            <td>${h.ID_Asignacion ? `#${h.ID_Asignacion}` : '—'}</td>
          </tr>
        `;
      })
      .join('');
  } catch (error) {
    mostrarMensaje(error.message || 'Error al cargar el historial de equipos.', true);
  }
});