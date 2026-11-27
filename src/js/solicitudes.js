import { cargarParciales } from './main.js';
import {
  obtenerBeneficiariosApi,
  obtenerSolicitudesApi,
  crearSolicitudApi,
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
        : `<tr><td colspan="7" style="text-align: center; padding: 1.5rem;">${mensajeVacio}</td></tr>`;
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
    fechaId: 'Fecha_solicitud',
    tbodyId: 'tabla-solicitudes-body',
    formId: 'form-solicitud',
    mensajeVacio: 'No hay solicitudes registradas.',
    textoExito: 'Solicitud registrada correctamente.',
    textoErrorCargar: 'Error al cargar solicitudes.',
    textoErrorGuardar: 'No se pudo registrar la solicitud.',
    obtenerItemsApi: obtenerSolicitudesApi,
    crearItemApi: crearSolicitudApi,
    renderFila: (s, beneficiarios) => {
      const ben = nombreBeneficiario(beneficiarios, s.ID_Beneficiario, s.Beneficiario_Nombre);
      return `<tr><td>#${s.ID_Solicitud ?? s.id ?? ''}</td><td><strong>${ben}</strong></td><td>${s.Fecha_solicitud}</td><td><strong>${s.Motivo}</strong><br><small>${s.Uso_destinado}</small></td><td><span class="estado-pill">${s.Prioridad}</span></td><td><span class="estado-pill">${s.Estado}</span></td><td>${s.Observaciones || '—'}</td></tr>`;
    },
    obtenerDatosForm: (benSelect, fechaInput) => {
      const idBen = benSelect.value;
      const fecha = fechaInput.value.trim();
      const prioridad = document.getElementById('Prioridad').value;
      const estado = document.getElementById('Estado').value;
      const motivo = document.getElementById('Motivo').value.trim();
      const uso = document.getElementById('Uso_destinado').value.trim();
      const obs = document.getElementById('Observaciones').value.trim();
      return {
        reglas: [
          ['ID_Beneficiario', idBen, 'Seleccione un beneficiario.'],
          ['Fecha_solicitud', fecha, 'Indique la fecha.'],
          ['Prioridad', prioridad, 'Seleccione la prioridad.'],
          ['Estado', estado, 'Seleccione el estado.'],
          ['Motivo', motivo, 'Ingrese el motivo.'],
          ['Uso_destinado', uso, 'Ingrese el uso destinado.'],
        ],
        payload: {
          ID_Beneficiario: Number(idBen),
          Fecha_solicitud: fecha,
          Prioridad: prioridad,
          Estado: estado,
          Motivo: motivo,
          Uso_destinado: uso,
          Observaciones: obs,
        },
      };
    },
  });
});