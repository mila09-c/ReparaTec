import { cargarParciales } from './main.js';
import {
  obtenerBeneficiariosApi,
  obtenerSolicitudesApi,
  crearSolicitudApi,
} from './asignaciones-api.js';

document.addEventListener('DOMContentLoaded', async () => {
  await cargarParciales({ mostrarNav: true });

  const benSelect = document.getElementById('ID_Beneficiario');
  const fechaInput = document.getElementById('Fecha_solicitud');
  const tbody = document.getElementById('tabla-solicitudes-body');
  const form = document.getElementById('form-solicitud');
  const mensajeEl = document.getElementById('mensaje-estado');

  if (fechaInput && !fechaInput.value) {
    fechaInput.value = new Date().toISOString().split('T')[0];
  }

  const mostrarMensaje = (texto, esError = false) => {
    if (!mensajeEl) return;
    mensajeEl.innerHTML = `<div style="padding: 0.75rem 1rem; border-radius: 0.5rem; border: 1px solid ${esError ? '#dc2626' : '#16a34a'}; color: ${esError ? '#991b1b' : '#166534'}; background: ${esError ? '#fef2f2' : '#f0fdf4'};">${texto}</div>`;
  };

  let beneficiarios = [];
  try {
    beneficiarios = await obtenerBeneficiariosApi();
    beneficiarios.forEach((b) => {
      const idBen = b.ID_Beneficiario ?? b.id;
      const option = document.createElement('option');
      option.value = idBen;
      option.textContent = `${b.Institucion} (${b.Tipo_beneficiario})`;
      benSelect.appendChild(option);
    });
  } catch (error) {
    mostrarMensaje(error.message || 'Error al cargar beneficiarios.', true);
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
          const ben = beneficiarios.find(
            (b) => Number(b.ID_Beneficiario ?? b.id) === Number(s.ID_Beneficiario)
          );
          const benNombre =
            s.Beneficiario_Nombre ||
            (ben ? `${ben.Institucion} (${ben.Tipo_beneficiario})` : `Beneficiario #${s.ID_Beneficiario}`);

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
      mostrarMensaje(error.message || 'Error al cargar solicitudes.', true);
    }
  };

  await renderTabla();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    ['ID_Beneficiario', 'Fecha_solicitud', 'Prioridad', 'Estado', 'Motivo', 'Uso_destinado'].forEach((id) => {
      const el = document.getElementById(`error-${id}`);
      if (el) el.textContent = '';
    });

    const idBen = benSelect.value;
    const fecha = fechaInput.value.trim();
    const prioridad = document.getElementById('Prioridad').value;
    const estado = document.getElementById('Estado').value;
    const motivo = document.getElementById('Motivo').value.trim();
    const uso = document.getElementById('Uso_destinado').value.trim();
    const obs = document.getElementById('Observaciones').value.trim();

    let valido = true;
    if (!idBen) {
      document.getElementById('error-ID_Beneficiario').textContent = 'Seleccione un beneficiario.';
      valido = false;
    }
    if (!fecha) {
      document.getElementById('error-Fecha_solicitud').textContent = 'Indique la fecha.';
      valido = false;
    }
    if (!prioridad) {
      document.getElementById('error-Prioridad').textContent = 'Seleccione la prioridad.';
      valido = false;
    }
    if (!estado) {
      document.getElementById('error-Estado').textContent = 'Seleccione el estado.';
      valido = false;
    }
    if (!motivo) {
      document.getElementById('error-Motivo').textContent = 'Ingrese el motivo.';
      valido = false;
    }
    if (!uso) {
      document.getElementById('error-Uso_destinado').textContent = 'Ingrese el uso destinado.';
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
      fechaInput.value = new Date().toISOString().split('T')[0];
      mostrarMensaje('Solicitud registrada correctamente.');
    } catch (error) {
      mostrarMensaje(error.message || 'No se pudo registrar la solicitud.', true);
    }
  });
});