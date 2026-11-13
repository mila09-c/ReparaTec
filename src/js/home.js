import { cargarParciales } from './main.js';
import { obtenerModulos } from './datos.js'; 
import { obtenerEquipos } from './datos_equipo.js'; 

document.addEventListener('DOMContentLoaded', async () => {
  await cargarParciales({ mostrarNav: true });

  const bienvenidaEl = document.getElementById('mensaje-bienvenida');
  const correoSesion = sessionStorage.getItem('usuario_correo');
  if (bienvenidaEl && correoSesion) {
    bienvenidaEl.textContent = `Bienvenido(a), ${correoSesion}`;
  }

  const modulosContainer = document.getElementById('modulos-grid');
  if (modulosContainer) {
    const modulosOriginales = await obtenerModulos();
    const equiposLista = await obtenerEquipos();

    const modulos = modulosOriginales.map((mod) => {
      if (mod.id === 3 || mod.nombre === 'Inventario de Equipos' || mod.titulo === 'Inventario de Equipos') {
        return {
          ...mod,
          ruta: '/equipos.html', 
          total: equiposLista.length
        };
      }
      return mod;
    });

    modulosContainer.innerHTML = modulos
      .map(
        (mod) => `
        <article class="module-card">
          <div>
            <div class="module-card-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
              <h3 style="font-size: 1.1rem; font-weight: 600;">${mod.titulo || mod.nombre}</h3>
              <span class="badge-count" style="background-color: rgba(37, 99, 235, 0.1); color: var(--color-primario); font-weight: 700; font-size: 0.85rem; padding: 0.25rem 0.65rem; border-radius: 999px;">${mod.total}</span>
            </div>
            <p style="font-size: 0.9rem; color: var(--color-texto-suave); margin-bottom: 1.25rem;">${mod.descripcion}</p>
          </div>
          <a href="${mod.ruta}" class="module-link" style="font-weight: 600; font-size: 0.9rem; color: var(--color-primario); display: inline-flex; align-items: center; gap: 0.35rem;">Entrar al módulo &rarr;</a>
        </article>
      `
      )
      .join('');
  }

  const tbodyEquipos = document.getElementById('tabla-equipos-body');
  if (tbodyEquipos) {
    const equiposLista = await obtenerEquipos();
    tbodyEquipos.innerHTML = equiposLista
      .map(
        (eq) => `
        <tr>
          <td><strong>${eq.Codigo_inventario}</strong></td>
          <td>${eq.Marca} ${eq.Modelo}</td>
          <td>${eq.Procesador || 'N/D'} / ${eq.Memoria_ram || 'N/D'}</td>
          <td>${eq.Sistema_operativo || 'N/D'}</td>
          <td><span class="estado-pill">${eq.Estado_equipo}</span></td>
        </tr>
      `
      )
      .join('');
  }
});