import { cargarParciales } from './main.js';
import {
  obtenerBeneficiariosApi,
  obtenerSolicitudesApi,
  crearSolicitudApi,
} from './asignaciones-api.js';

const obtenerFechaActual = () => new Date().toISOString().split('T')[0];

function mostrarAviso(destino, mensaje, esError = false) {
  if (!destino) return;
  const paleta = esError
    ? 'border-color: #dc2626; color: #991b1b; background: #fef2f2;'
    : 'border-color: #16a34a; color: #166534; background: #f0fdf4;';
  destino.innerHTML = `<div style="padding: 0.75rem 1rem; border-radius: 0.5rem; border: 1px solid; ${paleta}">${mensaje}</div>`;
}

function obtenerEtiquetaBeneficiario(listaBen, idBeneficiario, nombreDirecto) {
  if (nombreDirecto) return nombreDirecto;
  const item = listaBen.find(
    (b) => Number(b.ID_Beneficiario ?? b.id) === Number(idBeneficiario)
  );
  return item
    ? `${item.Institucion} (${item.Tipo_beneficiario})`
    : `Beneficiario #${idBeneficiario}`;
}

document.addEventListener('DOMContentLoaded', async () => {
  await cargarParciales({ mostrarNav: true });

  const comboBeneficiario = document.getElementById('ID_Beneficiario');
  const campoFecha = document.getElementById('Fecha_solicitud');
  const cuerpoSolicitudes = document.getElementById('tabla-solicitudes-body');
  const formSolicitud = document.getElementById('form-solicitud');
  const cajaEstado = document.getElementById('mensaje-estado');

  if (campoFecha && !campoFecha.value) {
    campoFecha.value = obtenerFechaActual();
  }

  let listaBeneficiarios = [];
  try {
    listaBeneficiarios = await obtenerBeneficiariosApi();
    listaBeneficiarios.forEach((benef) => {
      const opt = document.createElement('option');
      opt.value = benef.ID_Beneficiario ?? benef.id;
      opt.textContent = `${benef.Institucion} (${benef.Tipo_beneficiario})`;
      comboBeneficiario.appendChild(opt);
    });
  } catch (error) {
    mostrarAviso(cajaEstado, error.message || 'Error al cargar beneficiarios.', true);
  }

  const pintarSolicitudes = async () => {
    try {
      const datos = await obtenerSolicitudesApi();
      if (!Array.isArray(datos) || datos.length === 0) {
        cuerpoSolicitudes.innerHTML =
          '<tr><td colspan="7" style="text-align: center; padding: 1.5rem;">No hay solicitudes registradas.</td></tr>';
        return;
      }

      cuerpoSolicitudes.innerHTML = datos
        .map((sol) => {
          const etiquetaBen = obtenerEtiquetaBeneficiario(
            listaBeneficiarios,
            sol.ID_Beneficiario,
            sol.Beneficiario_Nombre
          );
          const codigo = sol.ID_Solicitud ?? sol.id ?? '';
          const obsTexto = sol.Observaciones || '—';
          return `<tr><td>#${codigo}</td><td><strong>${etiquetaBen}</strong></td><td>${sol.Fecha_solicitud}</td><td><strong>${sol.Motivo}</strong><br><small>${sol.Uso_destinado}</small></td><td><span class="estado-pill">${sol.Prioridad}</span></td><td><span class="estado-pill">${sol.Estado}</span></td><td>${obsTexto}</td></tr>`;
        })
        .join('');
    } catch (error) {
      mostrarAviso(cajaEstado, error.message || 'Error al cargar solicitudes.', true);
    }
  };

  await pintarSolicitudes();

  formSolicitud.addEventListener('submit', async (e) => {
    e.preventDefault();

    const validaciones = [
      ['ID_Beneficiario', comboBeneficiario.value, 'Seleccione un beneficiario.'],
      ['Fecha_solicitud', campoFecha.value.trim(), 'Indique la fecha.'],
      ['Prioridad', document.getElementById('Prioridad').value, 'Seleccione la prioridad.'],
      ['Estado', document.getElementById('Estado').value, 'Seleccione el estado.'],
      ['Motivo', document.getElementById('Motivo').value.trim(), 'Ingrese el motivo.'],
      ['Uso_destinado', document.getElementById('Uso_destinado').value.trim(), 'Ingrese el uso destinado.'],
    ];

    let todoOk = true;
    for (const [idCampo, valorCampo, textoError] of validaciones) {
      const elemError = document.getElementById(`error-${idCampo}`);
      if (elemError) {
        elemError.textContent = valorCampo ? '' : textoError;
      }
      if (!valorCampo) todoOk = false;
    }

    if (!todoOk) return;

    try {
      await crearSolicitudApi({
        ID_Beneficiario: Number(comboBeneficiario.value),
        Fecha_solicitud: campoFecha.value.trim(),
        Prioridad: document.getElementById('Prioridad').value,
        Estado: document.getElementById('Estado').value,
        Motivo: document.getElementById('Motivo').value.trim(),
        Uso_destinado: document.getElementById('Uso_destinado').value.trim(),
        Observaciones: document.getElementById('Observaciones').value.trim(),
      });
      await pintarSolicitudes();
      formSolicitud.reset();
      campoFecha.value = obtenerFechaActual();
      mostrarAviso(cajaEstado, 'Solicitud registrada correctamente.');
    } catch (error) {
      mostrarAviso(cajaEstado, error.message || 'No se pudo registrar la solicitud.', true);
    }
  });
});