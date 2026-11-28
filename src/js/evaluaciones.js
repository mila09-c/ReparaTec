import { cargarParciales } from './main.js';
import {
  obtenerBeneficiariosApi,
  obtenerEvaluacionesApi,
  crearEvaluacionApi,
} from './asignaciones-api.js';

const fechaHoyIso = () => new Date().toISOString().split('T')[0];

function pintarAviso(contenedor, mensaje, esError = false) {
  if (!contenedor) return;
  const borde = esError ? '#dc2626' : '#16a34a';
  const color = esError ? '#991b1b' : '#166534';
  const fondo = esError ? '#fef2f2' : '#f0fdf4';
  contenedor.innerHTML = `<div style="padding: 0.75rem 1rem; border-radius: 0.5rem; border: 1px solid ${borde}; color: ${color}; background: ${fondo};">${mensaje}</div>`;
}

function formatearBeneficiario(catalogo, idBen, nombreDirecto) {
  if (nombreDirecto) return nombreDirecto;
  const match = catalogo.find((item) => Number(item.ID_Beneficiario ?? item.id) === Number(idBen));
  return match ? `${match.Institucion} (${match.Tipo_beneficiario})` : `Beneficiario #${idBen}`;
}

async function poblarSelectBeneficiarios(selectEl, alertaEl) {
  try {
    const items = await obtenerBeneficiariosApi();
    items.forEach((b) => {
      const opcion = document.createElement('option');
      opcion.value = b.ID_Beneficiario ?? b.id;
      opcion.textContent = `${b.Institucion} (${b.Tipo_beneficiario})`;
      selectEl.appendChild(opcion);
    });
    return items;
  } catch (err) {
    pintarAviso(alertaEl, err.message || 'Error al cargar beneficiarios.', true);
    return [];
  }
}

async function actualizarTablaEvaluaciones(tbodyEl, alertaEl, catalogo) {
  try {
    const evaluaciones = await obtenerEvaluacionesApi();
    if (!evaluaciones?.length) {
      tbodyEl.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 1.5rem;">No hay evaluaciones registradas.</td></tr>`;
      return;
    }

    tbodyEl.innerHTML = evaluaciones
      .map((ev) => {
        const benLabel = formatearBeneficiario(catalogo, ev.ID_Beneficiario, ev.Beneficiario_Nombre);
        const obs = ev.Observaciones || '—';
        return `<tr><td>#${ev.ID_Evaluacion ?? ev.id ?? ''}</td><td><strong>${benLabel}</strong></td><td>${ev.Fecha_evaluacion}</td><td><strong>${ev.Calificacion} / 5</strong></td><td><span class="estado-pill">${ev.Estado_funcionamiento}</span></td><td>${obs}</td></tr>`;
      })
      .join('');
  } catch (err) {
    pintarAviso(alertaEl, err.message || 'Error al cargar evaluaciones.', true);
  }
}

function validarFormularioEvaluacion(datos) {
  const reglas = [
    ['ID_Beneficiario', datos.idBen, 'Seleccione un beneficiario.'],
    ['Fecha_evaluacion', datos.fecha, 'Indique la fecha.'],
    ['Calificacion', datos.calif, 'Seleccione una calificación.'],
    ['Estado_funcionamiento', datos.estadoFunc, 'Seleccione el estado de funcionamiento.'],
  ];

  let esValido = true;
  reglas.forEach(([campo, valor, texto]) => {
    const errNode = document.getElementById(`error-${campo}`);
    if (errNode) errNode.textContent = '';
    if (!valor) {
      if (errNode) errNode.textContent = texto;
      esValido = false;
    }
  });
  return esValido;
}

document.addEventListener('DOMContentLoaded', async () => {
  await cargarParciales({ mostrarNav: true });

  const selectBen = document.getElementById('ID_Beneficiario');
  const inputFecha = document.getElementById('Fecha_evaluacion');
  const cuerpoTabla = document.getElementById('tabla-evaluaciones-body');
  const formEval = document.getElementById('form-evaluacion');
  const cajaMensaje = document.getElementById('mensaje-estado');

  if (inputFecha && !inputFecha.value) inputFecha.value = fechaHoyIso();

  const catalogo = await poblarSelectBeneficiarios(selectBen, cajaMensaje);
  await actualizarTablaEvaluaciones(cuerpoTabla, cajaMensaje, catalogo);

  formEval.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = {
      idBen: selectBen.value,
      fecha: inputFecha.value.trim(),
      calif: document.getElementById('Calificacion').value,
      estadoFunc: document.getElementById('Estado_funcionamiento').value,
      obs: document.getElementById('Observaciones').value.trim(),
    };

    if (!validarFormularioEvaluacion(datos)) return;

    try {
      await crearEvaluacionApi({
        ID_Beneficiario: Number(datos.idBen),
        Fecha_evaluacion: datos.fecha,
        Calificacion: Number(datos.calif),
        Estado_funcionamiento: datos.estadoFunc,
        Observaciones: datos.obs,
      });
      await actualizarTablaEvaluaciones(cuerpoTabla, cajaMensaje, catalogo);
      formEval.reset();
      inputFecha.value = fechaHoyIso();
      pintarAviso(cajaMensaje, 'Evaluación registrada correctamente.');
    } catch (err) {
      pintarAviso(cajaMensaje, err.message || 'No se pudo guardar la evaluación.', true);
    }
  });
});