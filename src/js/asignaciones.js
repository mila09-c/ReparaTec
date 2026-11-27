import { cargarParciales } from './main.js';
import {
  obtenerBeneficiariosApi,
  obtenerSolicitudesApi,
  obtenerEquiposApi,
  obtenerAsignacionesApi,
  crearAsignacionApi,
} from './asignaciones-api.js';

document.addEventListener('DOMContentLoaded', async () => {
  await cargarParciales({ mostrarNav: true });

  const solSelect = document.getElementById('ID_Solicitud');
  const eqSelect = document.getElementById('ID_Equipo');
  const fechaProgInput = document.getElementById('Fecha_programada');
  const fechaEntInput = document.getElementById('Fecha_entrega');
  const estadoSelect = document.getElementById('Estado');
  const tbody = document.getElementById('tabla-asignaciones-body');
  const form = document.getElementById('form-asignacion');
  const mensajeEl = document.getElementById('mensaje-estado');

  if (fechaProgInput && !fechaProgInput.value) {
    fechaProgInput.value = new Date().toISOString().split('T')[0];
  }

  estadoSelect.addEventListener('change', () => {
    if (estadoSelect.value === 'Entregada' && !fechaEntInput.value) {
      fechaEntInput.value = new Date().toISOString().split('T')[0];
    }
  });

  const mostrarMensaje = (texto, esError = false) => {
    if (!mensajeEl) return;
    mensajeEl.innerHTML = `<div style="padding: 0.75rem 1rem; border-radius: 0.5rem; border: 1px solid ${esError ? '#dc2626' : '#16a34a'}; color: ${esError ? '#991b1b' : '#166534'}; background: ${esError ? '#fef2f2' : '#f0fdf4'};">${texto}</div>`;
  };

  let beneficiarios = [];
  let solicitudes = [];
  let equipos = [];

  const cargarCatalogos = async () => {
    try {
      [beneficiarios, solicitudes, equipos] = await Promise.all([
        obtenerBeneficiariosApi(),
        obtenerSolicitudesApi(),
        obtenerEquiposApi(),
      ]);

      const solPrevia = solSelect.value;
      solSelect.innerHTML = '<option value="">Seleccione una solicitud...</option>';
      solicitudes.forEach((s) => {
        const idSol = s.ID_Solicitud ?? s.id;
        const ben = beneficiarios.find(
          (b) => Number(b.ID_Beneficiario ?? b.id) === Number(s.ID_Beneficiario)
        );
        const benLabel = ben ? ben.Institucion : `Beneficiario #${s.ID_Beneficiario}`;
        const option = document.createElement('option');
        option.value = idSol;
        option.textContent = `Sol #${idSol} — ${benLabel} [${s.Estado}]`;
        solSelect.appendChild(option);
      });
      if (solPrevia) solSelect.value = solPrevia;

      const eqPrevio = eqSelect.value;
      eqSelect.innerHTML = '<option value="">Seleccione un equipo...</option>';
      equipos.forEach((eq) => {
        const idEq = eq.ID_Equipo ?? eq.id;
        const option = document.createElement('option');
        option.value = idEq;
        option.textContent = `${eq.Codigo_inventario} — ${eq.Marca} ${eq.Modelo} (${eq.Estado_equipo})`;
        eqSelect.appendChild(option);
      });
      if (eqPrevio) eqSelect.value = eqPrevio;
    } catch (error) {
      mostrarMensaje(error.message || 'Error al cargar solicitudes o equipos.', true);
    }
  };

  const renderTabla = async () => {
    try {
      const lista = await obtenerAsignacionesApi();
      if (!lista || lista.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 1.5rem;">
              No hay asignaciones registradas.
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = lista
        .map((a) => {
          const sol = solicitudes.find(
            (s) => Number(s.ID_Solicitud ?? s.id) === Number(a.ID_Solicitud)
          );
          const ben = sol
            ? beneficiarios.find(
                (b) => Number(b.ID_Beneficiario ?? b.id) === Number(sol.ID_Beneficiario)
              )
            : null;
          const eq = equipos.find(
            (item) => Number(item.ID_Equipo ?? item.id) === Number(a.ID_Equipo)
          );

          const benNombre = a.Beneficiario_Nombre || (ben ? ben.Institucion : `Solicitud #${a.ID_Solicitud}`);
          const eqCodigo = a.Equipo_Codigo || (eq ? eq.Codigo_inventario : 'N/D');
          const eqNombre = a.Equipo_Nombre || (eq ? `${eq.Marca} ${eq.Modelo}` : `Equipo #${a.ID_Equipo}`);
          const eqEstado = a.Equipo_Estado || (eq ? eq.Estado_equipo : 'N/D');

          return `
            <tr>
              <td>#${a.ID_Asignacion ?? a.id ?? ''}</td>
              <td><strong>Sol #${a.ID_Solicitud}</strong><br><small>${benNombre}</small></td>
              <td><strong>${eqCodigo}</strong><br><small>${eqNombre}</small></td>
              <td><span class="estado-pill">${eqEstado}</span></td>
              <td>Prog: ${a.Fecha_programada}<br><small>Ent: ${a.Fecha_entrega || 'Pendiente'}</small></td>
              <td>${a.Condiciones_entrega}<br><small style="opacity:0.8;">${a.Recomendaciones || 'Sin recomendaciones'}</small></td>
              <td><span class="estado-pill">${a.Estado}</span></td>
            </tr>
          `;
        })
        .join('');
    } catch (error) {
      mostrarMensaje(error.message || 'Error al cargar asignaciones.', true);
    }
  };

  await cargarCatalogos();
  await renderTabla();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    ['ID_Solicitud', 'ID_Equipo', 'Fecha_programada', 'Estado', 'Condiciones_entrega'].forEach((id) => {
      const el = document.getElementById(`error-${id}`);
      if (el) el.textContent = '';
    });

    const idSol = solSelect.value;
    const idEq = eqSelect.value;
    const fProg = fechaProgInput.value.trim();
    const fEnt = fechaEntInput.value.trim();
    const estado = estadoSelect.value;
    const condiciones = document.getElementById('Condiciones_entrega').value.trim();
    const recomendaciones = document.getElementById('Recomendaciones').value.trim();

    let valido = true;
    if (!idSol) {
      document.getElementById('error-ID_Solicitud').textContent = 'Seleccione una solicitud.';
      valido = false;
    }
    if (!idEq) {
      document.getElementById('error-ID_Equipo').textContent = 'Seleccione un equipo.';
      valido = false;
    }
    if (!fProg) {
      document.getElementById('error-Fecha_programada').textContent = 'Indique la fecha programada.';
      valido = false;
    }
    if (!estado) {
      document.getElementById('error-Estado').textContent = 'Seleccione el estado.';
      valido = false;
    }
    if (!condiciones) {
      document.getElementById('error-Condiciones_entrega').textContent = 'Describa las condiciones de entrega.';
      valido = false;
    }

    if (!valido) return;

    const eqObj = equipos.find((item) => Number(item.ID_Equipo ?? item.id) === Number(idEq));
    const solObj = solicitudes.find((s) => Number(s.ID_Solicitud ?? s.id) === Number(idSol));
    const benObj = solObj
      ? beneficiarios.find((b) => Number(b.ID_Beneficiario ?? b.id) === Number(solObj.ID_Beneficiario))
      : null;

    try {
      await crearAsignacionApi(
        {
          ID_Solicitud: Number(idSol),
          ID_Equipo: Number(idEq),
          Fecha_programada: fProg,
          Fecha_entrega: fEnt || null,
          Estado: estado,
          Condiciones_entrega: condiciones,
          Recomendaciones: recomendaciones,
        },
        eqObj,
        benObj ? benObj.Institucion : ''
      );

      await cargarCatalogos();
      await renderTabla();
      form.reset();
      fechaProgInput.value = new Date().toISOString().split('T')[0];

      const seEntrego = estado === 'Entregada' || Boolean(fEnt);
      mostrarMensaje(
        seEntrego
          ? 'Asignación registrada y estado del equipo actualizado a "Asignado".'
          : 'Asignación registrada correctamente.'
      );
    } catch (error) {
      mostrarMensaje(error.message || 'No se pudo guardar la asignación.', true);
    }
  });
});