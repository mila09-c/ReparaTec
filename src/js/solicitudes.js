import { cargarParciales } from './main.js';
import {
  obtenerBeneficiariosApi,
  obtenerSolicitudesApi,
  crearSolicitudApi,
} from './asignaciones-api.js';

function hoyIso() {
  return new Date().toISOString().split('T')[0];
}

function pintarMensaje(contenedor, texto, esError = false) {
  if (!contenedor) return;
  const borde = esError ? '#dc2626' : '#16a34a';
  const color = esError ? '#991b1b' : '#166534';
  const fondo = esError ? '#fef2f2' : '#f0fdf4';
  contenedor.innerHTML = `<div style="padding: 0.75rem 1rem; border-radius: 0.5rem; border: 1px solid ${borde}; color: ${color}; background: ${fondo};">${texto}</div>`;
}

function resolverNombreBeneficiario(beneficiarios, idBen, nombreDirecto = '') {
  if (nombreDirecto) return nombreDirecto;
  const ben = beneficiarios.find((b) => Number(b.ID_Beneficiario ?? b.id) === Number(idBen));
  return ben ? `${ben.Institucion} (${ben.Tipo_beneficiario})` : `Beneficiario #${idBen}`;
}

function poblarSelectBeneficiarios(selectEl, beneficiarios) {
  beneficiarios.forEach((b) => {
    const option = document.createElement('option');
    option.value = b.ID_Beneficiario ?? b.id;
    option.textContent = `${b.Institucion} (${b.Tipo_beneficiario})`;
    selectEl.appendChild(option);
  });
}

function limpiarErrores(ids) {
  ids.forEach((id) => {
    const el = document.getElementById(`error-${id}`);
    if (el) el.textContent = '';
  });
}

function validarRequeridos(reglas) {
  let valido = true;
  reglas.forEach(([id, valor, mensaje]) => {
    if (!valor) {
      const el = document.getElementById(`error-${id}`);
      if (el) el.textContent = mensaje;
      valido = false;
    }
  });
  return valido;
}

document.addEventListener('DOMContentLoaded', async () => {
  await cargarParciales({ mostrarNav: true });

  const benSelect = document.getElementById('ID_Beneficiario');
  const fechaInput = document.getElementById('Fecha_solicitud');
  const tbody = document.getElementById('tabla-solicitudes-body');
  const form = document.getElementById('form-solicitud');
  const mensajeEl = document.getElementById('mensaje-estado');

  if (fechaInput && !fechaInput.value) {
    fechaInput.value = hoyIso();
  }

  let beneficiarios = [];
  try {
    beneficiarios = await obtenerBeneficiariosApi();
    poblarSelectBeneficiarios(benSelect, beneficiarios);
  } catch (error) {
    pintarMensaje(mensajeEl, error.message || 'Error al cargar beneficiarios.', true);
  }

  const renderTabla = async () => {
    try {
      const lista = await obtenerSolicitudesApi();
      if (!lista || lista.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 1.5rem;">
              No hay solicitudes registradas.
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = lista
        .map((s) => {
          const benNombre = resolverNombreBeneficiario(
            beneficiarios,
            s.ID_Beneficiario,
            s.Beneficiario_Nombre
          );
          return `
            <tr>
              <td>#${s.ID_Solicitud ?? s.id ?? ''}</td>
              <td><strong>${benNombre}</strong></td>
              <td>${s.Fecha_solicitud}</td>
              <td><strong>${s.Motivo}</strong><br><small>${s.Uso_destinado}</small></td>
              <td><span class="estado-pill">${s.Prioridad}</span></td>
              <td><span class="estado-pill">${s.Estado}</span></td>
              <td>${s.Observaciones || '—'}</td>
            </tr>
          `;
        })
        .join('');
    } catch (error) {
      pintarMensaje(mensajeEl, error.message || 'Error al cargar solicitudes.', true);
    }
  };

  await renderTabla();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const campos = ['ID_Beneficiario', 'Fecha_solicitud', 'Prioridad', 'Estado', 'Motivo', 'Uso_destinado'];
    limpiarErrores(campos);

    const idBen = benSelect.value;
    const fecha = fechaInput.value.trim();
    const prioridad = document.getElementById('Prioridad').value;
    const estado = document.getElementById('Estado').value;
    const motivo = document.getElementById('Motivo').value.trim();
    const uso = document.getElementById('Uso_destinado').value.trim();
    const obs = document.getElementById('Observaciones').value.trim();

    const valido = validarRequeridos([
      ['ID_Beneficiario', idBen, 'Seleccione un beneficiario.'],
      ['Fecha_solicitud', fecha, 'Indique la fecha.'],
      ['Prioridad', prioridad, 'Seleccione la prioridad.'],
      ['Estado', estado, 'Seleccione el estado.'],
      ['Motivo', motivo, 'Ingrese el motivo.'],
      ['Uso_destinado', uso, 'Ingrese el uso destinado.'],
    ]);
    if (!valido) return;

    try {
      await crearSolicitudApi({
        ID_Beneficiario: Number(idBen),
        Fecha_solicitud: fecha,
        Prioridad: prioridad,
        Estado: estado,
        Motivo: motivo,
        Uso_destinado: uso,
        Observaciones: obs,
      });
      await renderTabla();
      form.reset();
      fechaInput.value = hoyIso();
      pintarMensaje(mensajeEl, 'Solicitud registrada correctamente.');
    } catch (error) {
      pintarMensaje(mensajeEl, error.message || 'No se pudo registrar la solicitud.', true);
    }
  });
});