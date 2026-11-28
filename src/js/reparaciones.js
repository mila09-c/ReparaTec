import { cargarParciales } from './main.js';
import { obtenerTecnicos } from './datos_equipo.js';
import { obtenerDiagnosticos, obtenerReparaciones } from './taller-datos.js';

document.addEventListener('DOMContentLoaded', async () => {
  await cargarParciales({ mostrarNav: true });

  const diagSelect = document.getElementById('ID_Diagnostico');
  const tecSelect = document.getElementById('ID_Tecnico');
  const fechaInicioInput = document.getElementById('Fecha_inicio');
  const tbody = document.getElementById('tabla-reparaciones-body');
  const form = document.getElementById('form-reparacion');

  if (fechaInicioInput && !fechaInicioInput.value) {
    fechaInicioInput.value = new Date().toISOString().split('T')[0];
  }

  const [diagnosticos, tecnicos, reparaciones] = await Promise.all([
    obtenerDiagnosticos(),
    obtenerTecnicos(),
    obtenerReparaciones()
  ]);

  diagnosticos.forEach((d) => {
    const option = document.createElement('option');
    option.value = d.ID_Diagnostico;
    option.textContent = `Diag #${d.ID_Diagnostico} — ${d.Codigo_inventario} (${d.Problema_detectado})`;
    diagSelect.appendChild(option);
  });

  tecnicos.forEach((t) => {
    const option = document.createElement('option');
    option.value = t.ID_Tecnico;
    option.textContent = `Técnico #${t.ID_Tecnico} — ${t.Especialidad} [${t.Disponibilidad}]`;
    tecSelect.appendChild(option);
  });

  const renderTabla = (lista) => {
    if (!lista || lista.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 1.5rem;">
            No hay reparaciones registradas.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = lista
      .map(
        (r) => `
        <tr>
          <td>#${r.ID_Reparacion}</td>
          <td><strong>${r.Codigo_inventario}</strong><br><small>${r.Equipo_Nombre}</small></td>
          <td>
            <strong>${r.Descripcion_trabajo}</strong><br>
            <small style="opacity: 0.8;">Diag #${r.ID_Diagnostico}: ${r.Problema_detectado}</small>
          </td>
          <td>${r.Tecnico_Nombre}</td>
          <td>Inicio: ${r.Fecha_inicio}<br><small>Fin: ${r.Fecha_termino || 'Pendiente'}</small></td>
          <td>Est: $${Number(r.Costo_estimado || 0).toFixed(2)}<br><small>Final: $${Number(r.Costo_final || 0).toFixed(2)}</small></td>
          <td><span class="estado-pill">${r.Estado_reparacion}</span></td>
        </tr>
      `
      )
      .join('');
  };

  const listaActual = [...reparaciones];
  renderTabla(listaActual);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    ['ID_Diagnostico', 'ID_Tecnico', 'Fecha_inicio', 'Costo_estimado', 'Estado_reparacion', 'Descripcion_trabajo'].forEach((id) => {
      const el = document.getElementById(`error-${id}`);
      if (el) el.textContent = '';
    });

    let valido = true;
    const idDiag = diagSelect.value;
    const idTec = tecSelect.value;
    const fInicio = fechaInicioInput.value.trim();
    const fTermino = document.getElementById('Fecha_termino').value.trim();
    const cEstimado = document.getElementById('Costo_estimado').value.trim();
    const cFinal = document.getElementById('Costo_final').value.trim();
    const estado = document.getElementById('Estado_reparacion').value;
    const desc = document.getElementById('Descripcion_trabajo').value.trim();

    if (!idDiag) {
      document.getElementById('error-ID_Diagnostico').textContent = 'Seleccione un diagnóstico.';
      valido = false;
    }
    if (!idTec) {
      document.getElementById('error-ID_Tecnico').textContent = 'Seleccione un técnico.';
      valido = false;
    }
    if (!fInicio) {
      document.getElementById('error-Fecha_inicio').textContent = 'Indique la fecha de inicio.';
      valido = false;
    }
    if (cEstimado === '' || Number(cEstimado) < 0) {
      document.getElementById('error-Costo_estimado').textContent = 'Ingrese un costo estimado válido.';
      valido = false;
    }
    if (!estado) {
      document.getElementById('error-Estado_reparacion').textContent = 'Seleccione un estado.';
      valido = false;
    }
    if (!desc) {
      document.getElementById('error-Descripcion_trabajo').textContent = 'Describa el trabajo realizado.';
      valido = false;
    }

    if (!valido) return;

    const diagObj = diagnosticos.find((d) => d.ID_Diagnostico === Number(idDiag));
    const tecObj = tecnicos.find((t) => t.ID_Tecnico === Number(idTec));

    listaActual.unshift({
      ID_Reparacion: listaActual.length + 1,
      ID_Diagnostico: Number(idDiag),
      ID_Tecnico: Number(idTec),
      Codigo_inventario: diagObj ? diagObj.Codigo_inventario : 'N/D',
      Equipo_Nombre: diagObj ? diagObj.Equipo_Nombre : 'Equipo N/D',
      Problema_detectado: diagObj ? diagObj.Problema_detectado : '',
      Tecnico_Nombre: tecObj ? `Técnico #${tecObj.ID_Tecnico} (${tecObj.Especialidad})` : `Técnico #${idTec}`,
      Fecha_inicio: fInicio,
      Fecha_termino: fTermino,
      Descripcion_trabajo: desc,
      Costo_estimado: Number(cEstimado),
      Costo_final: cFinal ? Number(cFinal) : 0,
      Estado_reparacion: estado
    });

    renderTabla(listaActual);
    form.reset();
    fechaInicioInput.value = new Date().toISOString().split('T')[0];
  });
});