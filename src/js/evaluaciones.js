import { cargarParciales } from './main.js';
import {
  obtenerBeneficiariosApi,
  obtenerEvaluacionesApi,
  crearEvaluacionApi,
} from './asignaciones-api.js';

const fechaHoy = () => new Date().toISOString().split('T')[0];

function renderAlerta(contenedor, texto, esError = false) {
  if (!contenedor) return;
  const estilos = esError
    ? 'border-color: #dc2626; color: #991b1b; background: #fef2f2;'
    : 'border-color: #16a34a; color: #166534; background: #f0fdf4;';
  contenedor.innerHTML = `<div style="padding: 0.75rem 1rem; border-radius: 0.5rem; border: 1px solid; ${estilos}">${texto}</div>`;
}

function resolverNombreBeneficiario(beneficiarios, idBen, nombreGuardado) {
  if (nombreGuardado) return nombreGuardado;
  const encontrado = beneficiarios.find(
    (item) => Number(item.ID_Beneficiario ?? item.id) === Number(idBen)
  );
  return encontrado
    ? `${encontrado.Institucion} (${encontrado.Tipo_beneficiario})`
    : `Beneficiario #${idBen}`;
}

document.addEventListener('DOMContentLoaded', async () => {
  await cargarParciales({ mostrarNav: true });

  const selectBeneficiario = document.getElementById('ID_Beneficiario');
  const inputFecha = document.getElementById('Fecha_evaluacion');
  const cuerpoTabla = document.getElementById('tabla-evaluaciones-body');
  const formulario = document.getElementById('form-evaluacion');
  const alertaEstado = document.getElementById('mensaje-estado');

  if (inputFecha && !inputFecha.value) {
    inputFecha.value = fechaHoy();
  }

  let catalogoBeneficiarios = [];
  try {
    catalogoBeneficiarios = await obtenerBeneficiariosApi();
    for (const ben of catalogoBeneficiarios) {
      const opcion = document.createElement('option');
      opcion.value = ben.ID_Beneficiario ?? ben.id;
      opcion.textContent = `${ben.Institucion} (${ben.Tipo_beneficiario})`;
      selectBeneficiario.appendChild(opcion);
    }
  } catch (err) {
    renderAlerta(alertaEstado, err.message || 'Error al cargar beneficiarios.', true);
  }

  const cargarEvaluaciones = async () => {
    try {
      const registros = await obtenerEvaluacionesApi();
      if (!Array.isArray(registros) || registros.length === 0) {
        cuerpoTabla.innerHTML =
          '<tr><td colspan="6" style="text-align: center; padding: 1.5rem;">No hay evaluaciones registradas.</td></tr>';
        return;
      }

      cuerpoTabla.innerHTML = registros
        .map((ev) => {
          const nombre = resolverNombreBeneficiario(
            catalogoBeneficiarios,
            ev.ID_Beneficiario,
            ev.Beneficiario_Nombre
          );
          const idMostrar = ev.ID_Evaluacion ?? ev.id ?? '';
          const obsMostrar = ev.Observaciones || '—';
          return `<tr><td>#${idMostrar}</td><td><strong>${nombre}</strong></td><td>${ev.Fecha_evaluacion}</td><td><strong>${ev.Calificacion} / 5</strong></td><td><span class="estado-pill">${ev.Estado_funcionamiento}</span></td><td>${obsMostrar}</td></tr>`;
        })
        .join('');
    } catch (err) {
      renderAlerta(alertaEstado, err.message || 'Error al cargar evaluaciones.', true);
    }
  };

  await cargarEvaluaciones();

  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const camposRequeridos = [
      ['ID_Beneficiario', selectBeneficiario.value, 'Seleccione un beneficiario.'],
      ['Fecha_evaluacion', inputFecha.value.trim(), 'Indique la fecha.'],
      ['Calificacion', document.getElementById('Calificacion').value, 'Seleccione una calificación.'],
      [
        'Estado_funcionamiento',
        document.getElementById('Estado_funcionamiento').value,
        'Seleccione el estado de funcionamiento.',
      ],
    ];

    let formularioValido = true;
    for (const [campoId, valor, mensajeError] of camposRequeridos) {
      const nodoError = document.getElementById(`error-${campoId}`);
      if (nodoError) {
        nodoError.textContent = valor ? '' : mensajeError;
      }
      if (!valor) formularioValido = false;
    }

    if (!formularioValido) return;

    try {
      await crearEvaluacionApi({
        ID_Beneficiario: Number(selectBeneficiario.value),
        Fecha_evaluacion: inputFecha.value.trim(),
        Calificacion: Number(document.getElementById('Calificacion').value),
        Estado_funcionamiento: document.getElementById('Estado_funcionamiento').value,
        Observaciones: document.getElementById('Observaciones').value.trim(),
      });
      await cargarEvaluaciones();
      formulario.reset();
      inputFecha.value = fechaHoy();
      renderAlerta(alertaEstado, 'Evaluación registrada correctamente.');
    } catch (err) {
      renderAlerta(alertaEstado, err.message || 'No se pudo guardar la evaluación.', true);
    }
  });
});