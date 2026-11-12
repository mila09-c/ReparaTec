import { cargarParciales } from './main.js';
import { obtenerEquipo } from './datos.js';

document.addEventListener('DOMContentLoaded', async () => {
  await cargarParciales({ mostrarNav: true });

  const container = document.getElementById('detalle-container');
  const params = new URLSearchParams(window.location.search);
  const idEquipo = params.get('id');

  if (!idEquipo) {
    container.innerHTML = `
      <div class="empty-state" style="background: white; border: 1px solid var(--color-borde); border-radius: 0.75rem;">
        <h2>ID no especificado</h2>
        <p>No se proporcionó un identificador de equipo en la dirección URL.</p>
        <a href="/equipos.html" class="btn-positivo">Regresar a la lista</a>
      </div>
    `;
    return;
  }

  const equipo = await obtenerEquipo(idEquipo);

  if (!equipo) {
    container.innerHTML = `
      <div class="empty-state" style="background: white; border: 1px solid var(--color-borde); border-radius: 0.75rem;">
        <h2>Registro no encontrado</h2>
        <p>El equipo solicitado con ID <strong>#${idEquipo}</strong> no existe o fue eliminado de la base de datos.</p>
        <a href="/equipos.html" class="btn-positivo">Regresar a la lista</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="background: white; border: 1px solid var(--color-borde); border-radius: 0.75rem; padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--color-borde); padding-bottom: 1rem;">
        <div>
          <span style="font-size: 0.85rem; color: var(--color-primario); font-weight: 600;">EQUIPO #${equipo.ID_Equipo}</span>
          <h1 style="font-size: 1.5rem; font-weight: 700;">${equipo.Marca} ${equipo.Modelo}</h1>
        </div>
        <span class="estado-pill">${equipo.Estado_equipo}</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; font-size: 0.95rem;">
        <div><strong>Código de inventario:</strong><br>${equipo.Codigo_inventario}</div>
        <div><strong>Número de serie:</strong><br>${equipo.Numero_de_serie}</div>
        <div><strong>Procesador:</strong><br>${equipo.Procesador || 'No especificado'}</div>
        <div><strong>Memoria RAM:</strong><br>${equipo.Memoria_ram || 'No especificada'}</div>
        <div><strong>Almacenamiento:</strong><br>${equipo.Capacidad_almacenamiento || 'No especificado'}</div>
        <div><strong>Sistema Operativo:</strong><br>${equipo.Sistema_operativo || 'No especificado'}</div>
      </div>
    </div>
  `;
});