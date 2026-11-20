import { cargarParciales } from './main.js';
import { DONACIONES } from './datos_equipo.js';

export const DONADORES = [
  { ID_Donador: 1, Tipo_donador: 'Empresa', Direccion: 'Blvd. Hermanos Serdan 450, Puebla, Pue.' },
  { ID_Donador: 2, Tipo_donador: 'Persona Fisica', Direccion: 'Calle 16 de Septiembre 112, Cholula, Pue.' },
  { ID_Donador: 3, Tipo_donador: 'Empresa', Direccion: 'Av. Juarez 2840, Col. La Paz, Puebla, Pue.' },
  { ID_Donador: 4, Tipo_donador: 'Institucion Educativa', Direccion: 'Circuito Universitario 100, Puebla, Pue.' },
  { ID_Donador: 5, Tipo_donador: 'Persona Fisica', Direccion: 'Privada Las Flores 28, Tlaxcalancingo, Pue.' },
  { ID_Donador: 6, Tipo_donador: 'Empresa', Direccion: 'Parque Industrial Puebla 2000, Lote 14, Pue.' },
  { ID_Donador: 7, Tipo_donador: 'Asociacion', Direccion: 'Calle Reforma 75, Centro, Puebla, Pue.' },
  { ID_Donador: 8, Tipo_donador: 'Persona Fisica', Direccion: 'Av. 31 Poniente 1905, Puebla, Pue.' },
  { ID_Donador: 9, Tipo_donador: 'Empresa', Direccion: 'Calzada Zavaleta 3100, Puebla, Pue.' },
  { ID_Donador: 10, Tipo_donador: 'Persona Fisica', Direccion: 'Calle 5 de Mayo 409, Atlixco, Pue.' }
];

document.addEventListener('DOMContentLoaded', async () => {
  await cargarParciales({ mostrarNav: true });

  const tbodyDonaciones = document.getElementById('tabla-donaciones-body');
  if (tbodyDonaciones) {
    tbodyDonaciones.innerHTML = DONACIONES.map((d) => {
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
    }).join('');
  }

  const tbodyDonadores = document.getElementById('tabla-donadores-body');
  if (tbodyDonadores) {
    tbodyDonadores.innerHTML = DONADORES.map(
      (don) => `
      <tr>
        <td>#${don.ID_Donador}</td>
        <td><strong>${don.Tipo_donador}</strong></td>
        <td>${don.Direccion}</td>
        <td><span class="estado-pill">Activo</span></td>
      </tr>
    `
    ).join('');
  }
});