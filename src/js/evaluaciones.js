import { cargarParciales } from './main.js';
import {
  obtenerBeneficiariosApi,
  obtenerEvaluacionesApi,
  crearEvaluacionApi,
} from './asignaciones-api.js';

document.addEventListener('DOMContentLoaded', async () => {
  await cargarParciales({ mostrarNav: true });

  const benSelect = document.getElementById('ID_Beneficiario');
  const fechaInput = document.getElementById('Fecha_evaluacion');
  const tbody = document.getElementById('tabla-evaluaciones-body');
  const form = document.getElementById('form-evaluacion');
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
      const lista = await obtenerEvaluacionesApi();
      if (!lista || lista.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; padding: 1.5rem;">
              No hay evaluaciones registradas.
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = lista
        .map((ev) => {
          const ben = beneficiarios.find(
            (b) => Number(b.ID_Beneficiario ?? b.id) === Number(ev.ID_Beneficiario)
          );
          const benNombre =
            ev.Beneficiario_Nombre ||
            (ben ? `${ben.Institucion} (${ben.Tipo_beneficiario})` : `Beneficiario #${ev.ID_Beneficiario}`);

          return `
            <tr>
              <td>#${ev.ID_Evaluacion ?? ev.id ?? ''}</td>
              <td><strong>${benNombre}</strong></td>
              <td>${ev.Fecha_evaluacion}</td>
              <td><strong>${ev.Calificacion} / 5</strong></td>
              <td><span class="estado-pill">${ev.Estado_funcionamiento}</span></td>
              <td>${ev.Observaciones || '—'}</td>
            </tr>
          `;
        })
        .join('');
    } catch (error) {
      mostrarMensaje(error.message || 'Error al cargar evaluaciones.', true);
    }
  };

  await renderTabla();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    ['ID_Beneficiario', 'Fecha_evaluacion', 'Calificacion', 'Estado_funcionamiento'].forEach((id) => {
      const el = document.getElementById(`error-${id}`);
      if (el) el.textContent = '';
    });

    const idBen = benSelect.value;
    const fecha = fechaInput.value.trim();
    const calif = document.getElementById('Calificacion').value;
    const estadoFunc = document.getElementById('Estado_funcionamiento').value;
    const obs = document.getElementById('Observaciones').value.trim();

    let valido = true;
    if (!idBen) {
      document.getElementById('error-ID_Beneficiario').textContent = 'Seleccione un beneficiario.';
      valido = false;
    }
    if (!fecha) {
      document.getElementById('error-Fecha_evaluacion').textContent = 'Indique la fecha.';
      valido = false;
    }
    if (!calif) {
      document.getElementById('error-Calificacion').textContent = 'Seleccione una calificación.';
      valido = false;
    }
    if (!estadoFunc) {
      document.getElementById('error-Estado_funcionamiento').textContent = 'Seleccione el estado de funcionamiento.';
      valido = false;
    }

    if (!valido) return;

    try {
      await crearEvaluacionApi({
        ID_Beneficiario: Number(idBen),
        Fecha_evaluacion: fecha,
        Calificacion: Number(calif),
        Estado_funcionamiento: estadoFunc,
        Observaciones: obs,
      });
      await renderTabla();
      form.reset();
      fechaInput.value = new Date().toISOString().split('T')[0];
      mostrarMensaje('Evaluación registrada correctamente.');
    } catch (error) {
      mostrarMensaje(error.message || 'No se pudo guardar la evaluación.', true);
    }
  });
});