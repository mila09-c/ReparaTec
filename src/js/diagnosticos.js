import { cargarParciales } from './main.js';
import { obtenerEquipos } from './datos_equipo.js';
import { obtenerDiagnosticos } from './taller-datos.js';

document.addEventListener('DOMContentLoaded', async () => {
  await cargarParciales({ mostrarNav: true });

  const equipoSelect = document.getElementById('ID_Equipo');
  const fechaInput = document.getElementById('Fecha_diagnostico');
  const tbody = document.getElementById('tabla-diagnosticos-body');
  const form = document.getElementById('form-diagnostico');

  if (fechaInput && !fechaInput.value) {
    fechaInput.value = new Date().toISOString().split('T')[0];
  }

  const [equipos, diagnosticos] = await Promise.all([
    obtenerEquipos(),
    obtenerDiagnosticos()
  ]);

  equipos.forEach((eq) => {
    const option = document.createElement('option');
    option.value = eq.ID_Equipo;
    option.textContent = `${eq.Codigo_inventario} — ${eq.Marca} ${eq.Modelo}`;
    equipoSelect.appendChild(option);
  });

  const renderTabla = (lista) => {
    if (!lista || lista.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 1.5rem;">
            No hay diagnósticos registrados.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = lista
      .map(
        (d) => `
        <tr>
          <td>#${d.ID_Diagnostico}</td>
          <td><strong>${d.Codigo_inventario}</strong> · ${d.Equipo_Nombre}</td>
          <td>${d.Fecha_diagnostico}</td>
          <td>${d.Problema_detectado}</td>
          <td><span class="estado-pill">${d.Estado_base}</span></td>
          <td>${d.Refaccion_requerida || 'Ninguna'}</td>
          <td>${d.Observaciones || '—'}</td>
        </tr>
      `
      )
      .join('');
  };

  const listaActual = [...diagnosticos];
  renderTabla(listaActual);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    ['ID_Equipo', 'Fecha_diagnostico', 'Estado_base', 'Problema_detectado'].forEach((id) => {
      const el = document.getElementById(`error-${id}`);
      if (el) el.textContent = '';
    });

    let valido = true;
    const idEq = equipoSelect.value;
    const fecha = fechaInput.value.trim();
    const estadoBase = document.getElementById('Estado_base').value;
    const problema = document.getElementById('Problema_detectado').value.trim();
    const refaccion = document.getElementById('Refaccion_requerida').value.trim();
    const observaciones = document.getElementById('Observaciones').value.trim();

    if (!idEq) {
      document.getElementById('error-ID_Equipo').textContent = 'Seleccione un equipo.';
      valido = false;
    }
    if (!fecha) {
      document.getElementById('error-Fecha_diagnostico').textContent = 'Indique la fecha.';
      valido = false;
    }
    if (!estadoBase) {
      document.getElementById('error-Estado_base').textContent = 'Seleccione el estado base.';
      valido = false;
    }
    if (!problema) {
      document.getElementById('error-Problema_detectado').textContent = 'Describa el problema detectado.';
      valido = false;
    }

    if (!valido) return;

    const eqObj = equipos.find((item) => item.ID_Equipo === Number(idEq));
    listaActual.unshift({
      ID_Diagnostico: listaActual.length + 1,
      ID_Equipo: Number(idEq),
      Codigo_inventario: eqObj ? eqObj.Codigo_inventario : 'N/D',
      Equipo_Nombre: eqObj ? `${eqObj.Marca} ${eqObj.Modelo}` : `Equipo #${idEq}`,
      Fecha_diagnostico: fecha,
      Problema_detectado: problema,
      Estado_base: estadoBase,
      Refaccion_requerida: refaccion || 'Ninguna',
      Observaciones: observaciones || '—'
    });

    renderTabla(listaActual);
    form.reset();
    fechaInput.value = new Date().toISOString().split('T')[0];
  });
});