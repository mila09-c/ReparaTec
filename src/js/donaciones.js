import { cargarParciales } from './main.js';
import { DONACIONES, DONADORES } from './datos_equipo.js';
import { obtenerUsuario } from './sesion.js';
import { normalizarRol } from './permisos.js';

export { DONADORES };

document.addEventListener('DOMContentLoaded', async () => {
  await cargarParciales({ mostrarNav: true });

  const usuario = obtenerUsuario();
  const rol = normalizarRol(usuario);
  
  const idDonadorUsuario = usuario?.ID_Donador ?? usuario?.id_donador ?? null;

  const donacionesVisibles =
    rol === 'donador' && idDonadorUsuario
      ? DONACIONES.filter((d) => Number(d.ID_Donador) === Number(idDonadorUsuario))
      : DONACIONES;

  const donadoresVisibles =
    rol === 'donador' && idDonadorUsuario
      ? DONADORES.filter((don) => Number(don.ID_Donador) === Number(idDonadorUsuario))
      : DONADORES;

  const tbodyDonaciones = document.getElementById('tabla-donaciones-body');
  if (tbodyDonaciones) {
    if (!donacionesVisibles.length) {
      tbodyDonaciones.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--color-texto-suave);">
            No hay donaciones registradas para mostrar.
          </td>
        </tr>
      `;
    } else {
      tbodyDonaciones.innerHTML = donacionesVisibles
        .map((d) => {
          const donador = DONADORES.find((don) => don.ID_Donador === d.ID_Donador);
          return `
            <tr>
              <td>#${d.ID_Donacion}</td>
              <td>${d.Fecha_donacion}</td>
              <td><strong>#${d.ID_Donador}</strong> — ${donador ? donador.Tipo_donador : 'N/D'}</td>
              <td>${d.Tipo_entrega}</td>
              <td>${d.Observaciones}</td>
              <td><span class="estado-pill">${d.Estado}</span></td>
              <td><a href="/equipos.html" class="btn-accion-tabla">Ver equipos</a></td>
            </tr>
          `;
        })
        .join('');
    }
  }

  const tbodyDonadores = document.getElementById('tabla-donadores-body');
  if (tbodyDonadores) {
    tbodyDonadores.innerHTML = donadoresVisibles
      .map(
        (don) => `
        <tr>
          <td>#${don.ID_Donador}</td>
          <td><strong>${don.Tipo_donador}</strong></td>
          <td>${don.Direccion}</td>
          <td><span class="estado-pill">${don.Estado || 'Activo'}</span></td>
        </tr>
      `
      )
      .join('');
  }
});