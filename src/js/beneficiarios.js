import { cargarParciales } from './main.js';
import { obtenerBeneficiariosApi, crearBeneficiarioApi } from './asignaciones-api.js';

document.addEventListener('DOMContentLoaded', async () => {
  await cargarParciales({ mostrarNav: true });

  const tbody = document.getElementById('tabla-beneficiarios-body');
  const form = document.getElementById('form-beneficiario');
  const mensajeEl = document.getElementById('mensaje-estado');

  const mostrarMensaje = (texto, esError = false) => {
    if (!mensajeEl) return;
    mensajeEl.innerHTML = `<div style="padding: 0.75rem 1rem; border-radius: 0.5rem; border: 1px solid ${esError ? '#dc2626' : '#16a34a'}; color: ${esError ? '#991b1b' : '#166534'}; background: ${esError ? '#fef2f2' : '#f0fdf4'};">${texto}</div>`;
  };

  const renderTabla = async () => {
    try {
      const lista = await obtenerBeneficiariosApi();
      if (!lista || lista.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="4" style="text-align: center; padding: 1.5rem;">
              No hay beneficiarios registrados.
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = lista
        .map(
          (b) => `
          <tr>
            <td>#${b.ID_Beneficiario ?? b.id ?? ''}</td>
            <td><span class="estado-pill">${b.Tipo_beneficiario}</span></td>
            <td><strong>${b.Institucion}</strong></td>
            <td>${b.Necesidad_tecnologica}</td>
          </tr>
        `
        )
        .join('');
    } catch (error) {
      mostrarMensaje(error.message || 'Error al cargar beneficiarios.', true);
    }
  };

  await renderTabla();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    ['Tipo_beneficiario', 'Institucion', 'Necesidad_tecnologica'].forEach((id) => {
      const el = document.getElementById(`error-${id}`);
      if (el) el.textContent = '';
    });

    const tipo = document.getElementById('Tipo_beneficiario').value;
    const institucion = document.getElementById('Institucion').value.trim();
    const necesidad = document.getElementById('Necesidad_tecnologica').value.trim();

    let valido = true;
    if (!tipo) {
      document.getElementById('error-Tipo_beneficiario').textContent = 'Seleccione el tipo de beneficiario.';
      valido = false;
    }
    if (!institucion) {
      document.getElementById('error-Institucion').textContent = 'Ingrese la institución o nombre.';
      valido = false;
    }
    if (!necesidad) {
      document.getElementById('error-Necesidad_tecnologica').textContent = 'Describa la necesidad tecnológica.';
      valido = false;
    }

    if (!valido) return;

    try {
      await crearBeneficiarioApi({
        Tipo_beneficiario: tipo,
        Institucion: institucion,
        Necesidad_tecnologica: necesidad,
      });
      await renderTabla();
      form.reset();
      mostrarMensaje('Beneficiario registrado correctamente.');
    } catch (error) {
      mostrarMensaje(error.message || 'No se pudo guardar el beneficiario.', true);
    }
  });
});