import { cargarParciales } from './main.js';
import {
  obtenerBeneficiariosApi,
  obtenerSolicitudesApi,
  crearSolicitudApi,
} from './asignaciones-api.js';

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
  let ok = true;
  reglas.forEach(([id, valor, msg]) => {
    const errEl = document.getElementById(`error-${id}`);
    if (errEl) errEl.textContent = '';
    if (!valor) {
      if (errEl) errEl.textContent = msg;
      ok = false;
    }
  });
  return ok;
}

document.addEventListener('DOMContentLoaded', async () => {
  await cargarParciales({ mostrarNav: true });
  const benSelect = document.getElementById('ID_Beneficiario');
  const fechaInput = document.getElementById('Fecha_solicitud');
  const tbody = document.getElementById('tabla-solicitudes-body');
  const form = document.getElementById('form-solicitud');
  const mensajeEl = document.getElementById('mensaje-estado');
  const hoy = () => new Date().toISOString().split('T')[0];
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
      const lista = await obtenerSolicitudesApi();
      if (!lista?.length) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 1.5rem;">No hay solicitudes registradas.</td></tr>`;
        return;
      }
      tbody.innerHTML = lista
        .map((s) => {
          const ben = nombreBeneficiario(beneficiarios, s.ID_Beneficiario, s.Beneficiario_Nombre);
          return `<tr><td>#${s.ID_Solicitud ?? s.id ?? ''}</td><td><strong>${ben}</strong></td><td>${s.Fecha_solicitud}</td><td><strong>${s.Motivo}</strong><br><small>${s.Uso_destinado}</small></td><td><span class="estado-pill">${s.Prioridad}</span></td><td><span class="estado-pill">${s.Estado}</span></td><td>${s.Observaciones || '—'}</td></tr>`;
        })
        .join('');
    } catch (err) {
      pintarMensaje(mensajeEl, err.message || 'Error al cargar solicitudes.', true);
    }
  };

  await renderTabla();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const idBen = benSelect.value;
    const fecha = fechaInput.value.trim();
    const prioridad = document.getElementById('Prioridad').value;
    const estado = document.getElementById('Estado').value;
    const motivo = document.getElementById('Motivo').value.trim();
    const uso = document.getElementById('Uso_destinado').value.trim();
    const obs = document.getElementById('Observaciones').value.trim();
    const valido = validarCampos([
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
      fechaInput.value = hoy();
      pintarMensaje(mensajeEl, 'Solicitud registrada correctamente.');
    } catch (err) {
      pintarMensaje(mensajeEl, err.message || 'No se pudo registrar la solicitud.', true);
    }
  });
});