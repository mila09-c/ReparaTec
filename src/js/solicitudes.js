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

function limpiarErrores(ids) {
  ids.forEach((id) => {
    const el = document.getElementById(`error-${id}`);
    if (el) el.textContent = '';
  });
}

function marcarError(id, mensaje) {
  const el = document.getElementById(`error-${id}`);
  if (el) el.textContent = mensaje;
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
    beneficiarios.forEach((b) => {
      const option = document.createElement('option');
      option.value = b.ID_Beneficiario ?? b.id;
      option.textContent = `${b.Institucion} (${b.Tipo_beneficiario})`;
      benSelect.appendChild(option);
    });
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
    const camposRequeridos = ['ID_Beneficiario', 'Fecha_solicitud', 'Prioridad', 'Estado', 'Motivo', 'Uso_destinado'];
    limpiarErrores(camposRequeridos);

    const idBen = benSelect.value;
    const fecha = fechaInput.value.trim();
    const prioridad = document.getElementById('Prioridad').value;
    const estado = document.getElementById('Estado').value;
    const motivo = document.getElementById('Motivo').value.trim();
    const uso = document.getElementById('Uso_destinado').value.trim();
    const obs = document.getElementById('Observaciones').value.trim();

    let valido = true;
    if (!idBen) {
      marcarError('ID_Beneficiario', 'Seleccione un beneficiario.');
      valido = false;
    }
    if (!fecha) {
      marcarError('Fecha_solicitud', 'Indique la fecha.');
      valido = false;
    }
    if (!prioridad) {
      marcarError('Prioridad', 'Seleccione la prioridad.');
      valido = false;
    }
    if (!estado) {
      marcarError('Estado', 'Seleccione el estado.');
      valido = false;
    }
    if (!motivo) {
      marcarError('Motivo', 'Ingrese el motivo.');
      valido = false;
    }
    if (!uso) {
      marcarError('Uso_destinado', 'Ingrese el uso destinado.');
      valido = false;
    }
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