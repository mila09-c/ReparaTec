import { cargarParciales } from './main.js';
import {
  obtenerBeneficiariosApi,
  obtenerEvaluacionesApi,
  crearEvaluacionApi,
} from './asignaciones-api.js';

const hoy = () => new Date().toISOString().split('T')[0];

function pintarMensaje(el, texto, esError = false) {
  if (!el) return;
  const borde = esError ? '#dc2626' : '#16a34a';
  const color = esError ? '#991b1b' : '#166534';
  const fondo = esError ? '#fef2f2' : '#f0fdf4';
  el.innerHTML = `<div style="padding: 0.75rem 1rem; border-radius: 0.5rem; border: 1px solid ${borde}; color: ${color}; background: ${fondo};">${texto}</div>`;
}

function nombreBeneficiario(lista, idBen, nombreDirecto) {
  if (nombreDirecto) return nombreDirecto;
  const b = lista.find((item) => Number(item.ID_Beneficiario ?? item.id) === Number(idBen));
  return b ? `${b.Institucion} (${b.Tipo_beneficiario})` : `Beneficiario #${idBen}`;
}

function validarCampos(reglas) {
  return reglas.every(([id, valor, msg]) => {
    const errEl = document.getElementById(`error-${id}`);
    if (errEl) errEl.textContent = valor ? '' : msg;
    return Boolean(valor);
  });
}

async function iniciarVista({
  fechaId,
  tbodyId,
  formId,
  mensajeVacio,
  textoExito,
  textoErrorCargar,
  textoErrorGuardar,
  obtenerItemsApi,
  crearItemApi,
  renderFila,
  obtenerDatosForm,
}) {
  await cargarParciales({ mostrarNav: true });

  const benSelect = document.getElementById('ID_Beneficiario');
  const fechaInput = document.getElementById(fechaId);
  const tbody = document.getElementById(tbodyId);
  const form = document.getElementById(formId);
  const mensajeEl = document.getElementById('mensaje-estado');

  if (fechaInput && !fechaInput.value) fechaInput.value = hoy();

  let beneficiarios = [];
  try {
    beneficiarios = await obtenerBeneficiariosApi();
    beneficiarios.forEach((b) => {
      const opt = document.createElement('option');
      opt.value = b.ID_Beneficiario ?? b.id;
      opt.textContent = `${b.Institucion} (${b.Tipo_beneficiario})`;
      benSelect.appendChild(opt);
    });
  } catch (err) {
    pintarMensaje(mensajeEl, err.message || 'Error al cargar beneficiarios.', true);
  }

  const renderTabla = async () => {
    try {
      const lista = await obtenerItemsApi();
      tbody.innerHTML = lista?.length
        ? lista.map((item) => renderFila(item, beneficiarios)).join('')
        : `<tr><td colspan="6" style="text-align: center; padding: 1.5rem;">${mensajeVacio}</td></tr>`;
    } catch (err) {
      pintarMensaje(mensajeEl, err.message || textoErrorCargar, true);
    }
  };

  await renderTabla();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { reglas, payload } = obtenerDatosForm(benSelect, fechaInput);
    if (!validarCampos(reglas)) return;

    try {
      await crearItemApi(payload);
      await renderTabla();
      form.reset();
      if (fechaInput) fechaInput.value = hoy();
      pintarMensaje(mensajeEl, textoExito);
    } catch (err) {
      pintarMensaje(mensajeEl, err.message || textoErrorGuardar, true);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  iniciarVista({
    fechaId: 'Fecha_evaluacion',
    tbodyId: 'tabla-evaluaciones-body',
    formId: 'form-evaluacion',
    mensajeVacio: 'No hay evaluaciones registradas.',
    textoExito: 'Evaluación registrada correctamente.',
    textoErrorCargar: 'Error al cargar evaluaciones.',
    textoErrorGuardar: 'No se pudo guardar la evaluación.',
    obtenerItemsApi: obtenerEvaluacionesApi,
    crearItemApi: crearEvaluacionApi,
    renderFila: (ev, beneficiarios) => {
      const ben = nombreBeneficiario(beneficiarios, ev.ID_Beneficiario, ev.Beneficiario_Nombre);
      return `<tr><td>#${ev.ID_Evaluacion ?? ev.id ?? ''}</td><td><strong>${ben}</strong></td><td>${ev.Fecha_evaluacion}</td><td><strong>${ev.Calificacion} / 5</strong></td><td><span class="estado-pill">${ev.Estado_funcionamiento}</span></td><td>${ev.Observaciones || '—'}</td></tr>`;
    },
    obtenerDatosForm: (benSelect, fechaInput) => {
      const idBen = benSelect.value;
      const fecha = fechaInput.value.trim();
      const calif = document.getElementById('Calificacion').value;
      const estadoFunc = document.getElementById('Estado_funcionamiento').value;
      const obs = document.getElementById('Observaciones').value.trim();
      return {
        reglas: [
          ['ID_Beneficiario', idBen, 'Seleccione un beneficiario.'],
          ['Fecha_evaluacion', fecha, 'Indique la fecha.'],
          ['Calificacion', calif, 'Seleccione una calificación.'],
          ['Estado_funcionamiento', estadoFunc, 'Seleccione el estado de funcionamiento.'],
        ],
        payload: {
          ID_Beneficiario: Number(idBen),
          Fecha_evaluacion: fecha,
          Calificacion: Number(calif),
          Estado_funcionamiento: estadoFunc,
          Observaciones: obs,
        },
      };
    },
  });
});