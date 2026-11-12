import { cargarParciales } from './main.js';
import { obtenerModulos, obtenerEquipos, obtenerUsuario } from './datos.js';

document.addEventListener('DOMContentLoaded', async () => {
  await cargarParciales({ mostrarNav: true });

  const bienvenidaEl = document.getElementById('mensaje-bienvenida');
  const correoSesion = sessionStorage.getItem('usuario_correo');
  const usuarioDemo = await obtenerUsuario(1);

  if (bienvenidaEl) {
    const nombreMostrar = correoSesion || `${usuarioDemo.Nombre_Usuario} ${usuarioDemo.Apellido}`;
    bienvenidaEl.textContent = `Bienvenido(a), ${nombreMostrar}`;
  }

  // Llenar tarjetas de módulos desde datos.js
  const modulosContainer = document.getElementById('modulos-grid');
  const modulos = await obtenerModulos();

  modulosContainer.innerHTML = modulos
    .map(
      (mod) => `
      <article class="module-card">
        <div>
          <div class="module-card-header">
            <h3>${mod.titulo}</h3>
            <span class="badge-count">${mod.total}</span>
          </div>
          <p>${mod.descripcion}</p>
        </div>
        <a href="${mod.ruta}" class="module-link">Entrar al módulo &rarr;</a>
      </article>
    `
    )
    .join('');

  // Llenar tabla de equipos desde datos.js
  const tbodyEquipos = document.getElementById('tabla-equipos-body');
  const equipos = await obtenerEquipos();

  tbodyEquipos.innerHTML = equipos
    .map(
      (eq) => `
      <tr>
        <td><strong>${eq.Codigo_inventario}</strong></td>
        <td>${eq.Marca} ${eq.Modelo}</td>
        <td>${eq.Procesador} / ${eq.Memoria_ram}</td>
        <td>${eq.Sistema_operativo}</td>
        <td><span class="estado-pill">${eq.Estado_equipo}</span></td>
      </tr>
    `
    )
    .join('');
});