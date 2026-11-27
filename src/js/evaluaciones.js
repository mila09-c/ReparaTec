import { cargarParciales } from './main.js';
import {
  obtenerBeneficiariosApi,
  obtenerEvaluacionesApi,
  crearEvaluacionApi,
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
  const fechaInput = document.getElementById('Fecha_evaluacion');
  const tbody = document.getElementById('tabla-evaluaciones-body');
  const form = document.getElementById('form-evaluacion');
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
          const benNombre = resolverNombreBeneficiario(
            beneficiarios,
            ev.ID_Beneficiario,
            ev.Beneficiario_Nombre
          );
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
      pintarMensaje(mensajeEl, error.message || 'Error al cargar evaluaciones.', true);
    }
  };

  await renderTabla();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const campos = ['ID_Beneficiario', 'Fecha_evaluacion', 'Calificacion', 'Estado_funcionamiento'];
    limpiarErrores(campos);

    const idBen = benSelect.value;
    const fecha = fechaInput.value.trim();
    const calif = document.getElementById('Calificacion').value;
    const estadoFunc = document.getElementById('Estado_funcionamiento').value;
    const obs = document.getElementById('Observaciones').value.trim();

    const valido = validarRequeridos([
      ['ID_Beneficiario', idBen, 'Seleccione un beneficiario.'],
      ['Fecha_evaluacion', fecha, 'Indique la fecha.'],
      ['Calificacion', calif, 'Seleccione una calificación.'],
      ['Estado_funcionamiento', estadoFunc, 'Seleccione el estado de funcionamiento.'],
    ]);
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
      fechaInput.value = hoyIso();
      pintarMensaje(mensajeEl, 'Evaluación registrada correctamente.');
    } catch (error) {
      pintarMensaje(mensajeEl, error.message || 'No se pudo guardar la evaluación.', true);
    }
  });
});